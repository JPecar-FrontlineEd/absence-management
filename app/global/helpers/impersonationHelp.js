(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------# //
	// #----- Helper (impersonationHelp) -----# //
	app.factory('impersonationHelp', function ($cookies, config) {

		function impersonationData(impersonateeId = null){
			var cookieRegex = /{("originalUser":"[0|4|7]-\d+"),("impersonatedUser":"[2-5]-\d+"),"startedFrom":"(AM|TA)"}/;
        	var cookieVal = $cookies.get(config.isImpersonatingCookie);
	        var isImpersonating = false;
	        var impersonationIsValid = false;
	        var impersonateeUserKey;
	        if (cookieVal !== null && cookieRegex.test(cookieVal)) {                                   
	            var parsedVal = JSON.parse(cookieVal);
	            impersonateeUserKey = parsedVal.impersonatedUser;
	            if(impersonateeId){                
                	impersonationIsValid = (impersonateeUserKey.split('-')[1] ==  impersonateeId);	                
            	}
	            isImpersonating = true            
	        } 
	        
	        return {
	            isImpersonating: isImpersonating,
	            impersonationIsValid: impersonationIsValid,
	            impersonateeUserKey: impersonateeUserKey
	        }
		}

		return {
			impersonationData
		};

	});
	// #--- END Helper (impersonationHelp) ---# //
	// #--------------------------------------# //

}());