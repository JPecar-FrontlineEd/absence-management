(function() {'use strict';angular.module('aesop')
.controller('FromTimeAndAttendenceCtrl', function ($cookies, $window, $location, impersonationHelp) {
// #-----------------------------------------# //
// #------- FromTimeAndAttendenceCtrl -------# //

	// this is a route controller
	var route = this;
	var queryStringObj = $location.search();
	var redirectUrl;
	var impersonationData = impersonationHelp.impersonationData();
	var url = queryStringObj.url;
	var userKey = impersonationData.impersonateeUserKey;
	if(!userKey && !url)
	{
		//check for a userKey specified in the url query strings
		var qsUserKey = queryStringObj.userkey || queryStringObj.userKey || queryStringObj.UserKey;
		if(qsUserKey){
			qsUserKey = '?userKey=' + qsUserKey;
		}
		else{
			qsUserKey = "";
		}
		$window.location.href = '/access' + qsUserKey;
	}
	else {
		redirectUrl = (impersonationData.isImpersonating) ? '/impersonate' : '/access';
		if(url || userKey) { redirectUrl = redirectUrl + '?' };
		if(url && url.length) { redirectUrl = redirectUrl + 'url=' + url + '&'};
		if(userKey && userKey.length) { redirectUrl = redirectUrl + 'userKey=' + userKey };
		//$location.path(redirectUrl).replace();
		$window.location.replace(redirectUrl);
	}




// #----- END FromTimeAndAttendenceCtrl -----# //
});}());
