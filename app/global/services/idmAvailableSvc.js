(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------------# //
	// #----- Service (idmAvailableSvc) -----# //
	app.factory('idmAvailableSvc', function ($q, $log, config, featureSvc, ssoSvc) {
		var idmAvailable = false;
		var idmIsIdentityProvider = false;
		var _defer = $q.defer();
		featureSvc.ready.then(function(){
			// IDM needs to be enabled for the org, the user has to not have logged in via SSO
			idmAvailable = determineIDMAvailability(idmFeatureEnabled(), isSso(), idmConfigEnabled());
			idmIsIdentityProvider = featureSvc.get("IDMisIdentityProvider").enabled;
			_defer.resolve(idmAvailable);
		},function() {
			var message = 'PROMISES DID NOT RESOLVE, ASSUMING IDM FEATURE FLAG IS DISABLED';
			$log.debug(message);
			idmAvailable = determineIDMAvailability(false, isSso(), idmConfigEnabled());
			_defer.resolve(idmAvailable);
		});

		function idmFeatureEnabled(){
			return featureSvc.get("IDM").enabled;
		}

		function isSso(){
			return ssoSvc.IsSSO;
		}

		function idmConfigEnabled(){
			return config.idm.enabled == 'on';
		}

		function determineIDMAvailability(idmFeature, sso, idmConfig){
				return (idmFeature &&  idmConfig && !sso) || false;
		}

		function isIdmAvailable(){
			return idmAvailable;
		}

		function isIdmIdentityProvider(){
			return idmIsIdentityProvider;
		}


		return {
			 ready: _defer.promise,
			 IDMAvailable : isIdmAvailable,
			 IDMIsIdentityProvider: isIdmIdentityProvider
		};

	});
	// #--- END Service (idmAvailableSvc) ---# //
	// #-------------------------------------# //

}());
