(function() {'use strict';angular.module('aesop')
.controller('ImpersonateCtrl', function ($scope, authSvc, userSessionsSvc,
                                        $location, browserDetectHelp, toastHelp,
                                        storageSvc, $window, $cookies, config) {
// #--------------------------# //
// #------- ImpersonateCtrl -------# //

    // this is a route controller
    var route = this;
    var queryStringObj = $location.search();
    var url = '';
    var productId = '';
    var userTypeId = '';
    var userId = '';
    if(queryStringObj.url) { url = queryStringObj.url; }
    if(queryStringObj.productId) { productId = queryStringObj.productId; }
    authSvc.ready.then(function (svc){
      //Verify is Impersonator is Authticated with IDM
      if(!svc.isAuthenticated) { $window.location.href = '/access'; }
      
      if(queryStringObj.userKey) {
        var access = userDetail(queryStringObj.userKey);
        userTypeId = access.userTypeId;
        userId = access.userId;        
      }
      userSessionsSvc.impersonateRedirectUrl(userTypeId,
          userId,          
          browserDetectHelp.isMobile.any(),
          url,
          productId
      ).then(function(data){
          storageSvc.clearSession();          
          $window.location.replace(data.url);
      }).catch(function(error){
        console.log(error);
        $window.location.href = '/access';
      });
      
    });


    function userDetail(userKey) {
        var user = userKey.split('-');
        return { userTypeId: user[0], userId: user[1] };
    }


    // View Model properties
    route.vm = {
    };

    // Actions that can be bound to from the view
    route.go = {

    };



// #----- END ImpersonateCtrl -----# //
});}());
