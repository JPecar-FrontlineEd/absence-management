(function() {'use strict';angular.module('aesop')
.controller('AccessCtrl', function ($scope, $cookies, authSvc, $location, $window, $q, $http,
                                    userSessionsSvc, browserDetectHelp, toastHelp,
                                    userTypeDef, config, storageSvc, userSvc, ngDialog) {
// #--------------------------# //
// #------- AccessCtrl -------# //

    // this is a route controller
    var route = this;
    var queryStringObj = $location.search();
    var qsOrgId = queryStringObj.orgid || queryStringObj.orgId || queryStringObj.OrgId || queryStringObj.OrgID;
    var qsUserKey = queryStringObj.userkey || queryStringObj.userKey || queryStringObj.UserKey;
    var qsReAuth = queryStringObj.reauth;
    var qsPartOfMos = queryStringObj.ispartofmos;

    // Get rid of all of the cookies that may be from a prior session
    // If they are still needed they will be recreated on the GetRedirectUrl call
    expireCookies();

    // View Model properties
    route.vm = {
    };

    // Actions that can be bound to from the view
    route.go = {
        logout: function () {
            authSvc.signout();
        },
        redirect
    };

    authSvc.ready.then(function (svc){
        if (qsReAuth){
            //explicit request to reauthenticate with IDM to get a new access token. only way to be able to
            //refresh the user in another site (MVC) and then also see those same changes in the API.
            authSvc.reauthenticate(cleanRedirectUrl());
        } else {
            // Check if we need to fetch orgId from usercontext
            var isMorpheusEnv = config.idm && config.idm.isMorpheusEnvironment;
            if ((!qsOrgId || qsOrgId === '') && isMorpheusEnv) {
                fetchOrgIdFromUserContext().then(function(orgId) {
                    redirect(userRequest(qsUserKey, orgId));
                }).catch(function(error) {
                    console.error('Failed to fetch orgId from usercontext:', error);
                    // Fallback to original behavior
                    redirect(userRequest(qsUserKey, qsOrgId));
                });
            } else {
                redirect(userRequest(qsUserKey, qsOrgId));
            }
        }
    });

    function processUserNotifications(data) {
        var defer = $q.defer();

        var messages = data.$messages;
        var i = messages.length;

        if(i === 0) {
            defer.resolve();
        }

        while (i--){
            if(messages[i].startsWith('new mos notification')) {
                notifyUserOfMosCreation(messages[i]).then(function() {
                    defer.resolve();
                });
            }
            else {
                defer.resolve();
            }
        }

        return defer.promise;
    }


    function notifyUserOfMosCreation(message) {
        var defer = $q.defer();

        var pieces = message.split("|");
        var firstName = pieces[1];
        var lastName = pieces[2];
        var phone = pieces[3];
        var pin = pieces[4];

        var dialog = ngDialog.open({
            template: '/global/modals/mos-created.html',
            closeByDocument: false,
            showClose: false,
            closeByEscape: false,
            closeByNavigation: true,
            className: 'ngdialog-theme-default mos-created-dialog',
            data: {
                mosPhone: phone,
                mosPin: pin,
                buttons: [{
                    title: 'Thanks, I noted my new PIN',
                    cls: 'fl-button fl-primary',
                    action: function action(obj) {
                        ngDialog.close(dialog.id);
                        defer.resolve();
                    }
                }]
            }
        });

        return defer.promise;
    }

    function fetchOrgIdFromUserContext() {
        var defer = $q.defer();
        
        $http.get('../!/usercontext')
            .then(function(response) {
                try {
                    var data = response.data;
                    if (data && data.userInfo && data.userInfo.orgInfo && data.userInfo.orgInfo.orgId) {
                        defer.resolve(data.userInfo.orgInfo.orgId);
                    } else {
                        defer.reject('orgId not found in usercontext response');
                    }
                } catch (error) {
                    defer.reject('Error parsing usercontext response: ' + error.message);
                }
            })
            .catch(function(error) {
                defer.reject('HTTP request to usercontext failed: ' + error.message);
            });
            
        return defer.promise;
    }

    function userRequest(userKey, aesopOrgId){
        var userId, userTypeId;
        if (userKey) {
            var user = userKey.split('-');
            userId = user[1];
            userTypeId = user[0];
        }

        return { userTypeId: userTypeId, userId: userId, organizationId: aesopOrgId };
    }


    function redirect(access) {
        route.vm.loading = true;
        var url = null;
        //For Org Users, it may be "url" in the querystring, but for Campus Users it would be "location"
        if(queryStringObj.url || queryStringObj.location){
            Object.keys(queryStringObj).forEach(function(key){
                if(key === 'url' || key === 'location'){
                    url = queryStringObj[key];
                }else{
                    //do not want to carry the userkey through to other sites
                    //when we do have url we need to redirect to when we get there
                    if (key.toLowerCase() !== 'userkey'){
                        url = url + '&' + key + '=' + queryStringObj[key];
                    }
                }
            });
            url = encodeURIComponent(url);
        }
        userSessionsSvc.redirectUrl(access.userTypeId,
            access.userId,
            useMobileSite(),
            access.organizationId,
            url,
            qsPartOfMos == 1 ? true : false
        ).then(function(data){
            var redirectUrl = data.url;
            var requestStatus = data.$status;
            //show any notifications, then redirect;
            processUserNotifications(data).then(function() {
                if (redirectUrl) {
                    //we found a user and the API told us where to go next
                    $window.location.replace(decodeURIComponent(redirectUrl));
                } else {
                    //we either really have no users or we have users across multiple orgs and we don't know which org should be active
                    //or the API had to add some users to the FLID and we need to force a reauthentication with IDM so the claims are updated
                    if (requestStatus === 206) {
                        //we have valid users, but they are across multiple orgs and one has not been selected yet
                        //redirect to supersuit so the user can select their Org and then they can be sent back to us
                        $window.location = `${config.SuperSuitDomain}select?productId=${config.idm.productId}`;
                    } else if (requestStatus === 409){
                        //more users have been added to this FLID and we need a fresh id token that includes them on the claims
                        //force a reauthentication with IDM through flAuth
                        authSvc.ready.then(function (svc){
                            authSvc.reauthenticate(cleanRedirectUrl());
                        });
                    } else {
                      //if in passthru mode, this means likely we identified a user that is not actually active, so we should redirect to supersuit (which was what we are currently doing in production)
                    	if(authSvc.IsInPassthruMode()){
                            $window.location = `${config.SuperSuitDomain}select?productId=${config.idm.productId}`;
                    	}
                    	else {
                    		//Expires the idm token and then redirects to the access page which will attempt to
                    		//re authenticate and get kicked to the idm's common unauthorized experience.
                    		authSvc.ready.then(function(svc) {
                                svc._userManager.removeUser().then(() => {
                                    $window.location = `${config.SuperSuitDomain}select?productId=${config.idm.productId}`;
                                });
                            });
                        }
                    }
                }
            });
        }, function(e){
            toastHelp.error(e.$messages,'Error');
            $window.location = `${config.SuperSuitDomain}select?productId=${config.idm.productId}`;
        });
    }

    function useMobileSite(){
        //When a user on the Mobile site chooses to "Redirect to Full Site" it will put a
        //cookie on the user's machine so we know they want the full site as they move forward
        return browserDetectHelp.isMobile.any() && !$cookies.get(config.mobileOptOutCookie);
    }

    function cleanRedirectUrl(){
        //rebuild the url with querystring removing the reauth and ispartofmos params if present (do not want to end up in endless loop)
        var redirectUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + $location.path();
        var preParamLength = redirectUrl.length;
        var searchObject = $location.search();
        if (searchObject != null && angular.isObject(searchObject) && Object.keys(searchObject).length > 0){
            for (var i = Object.keys(searchObject).length - 1; i >= 0; i--) {
                var key = Object.keys(searchObject)[i];
                if (key !== 'reauth' && key !== 'ispartofmos'){
                    if (redirectUrl.length == preParamLength){
                        redirectUrl += '?'
                    } else {
                        redirectUrl += '&'
                    }
                    redirectUrl += key + '=' + encodeURIComponent(searchObject[key]);
                }
            };
        }
        return redirectUrl;
    }

    function expireCookies(){
        // Expiring the IsSso, SsoDomain and LoggedInUser Cookies.
        var today = new Date();
        var expireDate =  today.setDate(today.getDate() - 1);
        var expireObj = { domain: config.topLevelDomain , expires: expireDate };
        $cookies.remove('IsSso', expireObj);
        $cookies.remove('SsoDomain', expireObj);
        $cookies.remove(config.loggedInUserCookie, expireObj);
        $cookies.remove(config.isImpersonatingCookie, expireObj);
        $cookies.remove(config.notificationCountCookieName, expireObj);
        $cookies.remove(config.mopInUseCookie, expireObj);
        $cookies.remove(config.flidImpersonationCookieName, expireObj);
        $cookies.remove(config.flidCookieName, expireObj);
        $cookies.remove("PartnerAccess", expireObj);
        console.log("Expiring cookies");
    }

// #----- END AccessCtrl -----# //
});}());
