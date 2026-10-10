(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------# //
	// #----- Service (ssoSvc) -----# //
	app.factory('ssoSvc', function ($q, $cookies) {

		//pull out the SSO domain
		var ssoDomain = $cookies.get('SsoDomain');
		ssoDomain = ssoDomain || '';

		//look for the SSO cookie
		var isSSO = false;
		var isSSOCookie = $cookies.get('IsSso');
		if(isSSOCookie)
		{
			isSSO = isSSOCookie == "1" && ssoDomain.length > 0;
		}

		return {
			IsSSO: isSSO,
			SSODomain: ssoDomain
		};

	});
	// #--- END Service (ssoSvc) ---# //
	// #----------------------------# //

}());
