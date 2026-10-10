(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------# //
	// #----- Service (tokenSvc) -----# //

	var isBase = false;

	app.factory('tokenSvc', function ($q, $window, $location, storageSvc, userDataVal, config, ssoSvc) {
		var _defer = $q.defer(),
			token = storageSvc.load({key: 'token'});

		//handle if the token has changed from what was in session storage in anyway
		//or is being set for the first time
		var matches = $location.path().match(/token\/([a-z0-9]+)(\/.+)?$/i);
		if (matches !== null && matches.length >= 2) {
			var newToken = matches[1];
			setToken(newToken);
		}

		if (token) {
			_defer.resolve(token);
		} else {
			_defer.reject({
				key: 'tokenError',
				message: 'User not logged in'
			});
		}

		function setToken(hash, sameUser) {
			if (sameUser == null) { sameUser = false; }

			if(token != null && hash !== token){
				sessionStorage.clear();
			}

			saveToken(hash);

			if(token != null && hash !== token && !sameUser){
				location.reload();
			}

			token = hash;
		}

		function saveToken(token) {
            storageSvc.save({
                key: 'token',
                data: token,
                expires: null
            });
        }


		function getToken() {
			return token = token || storageSvc.load({key: 'token'});
		}

		function clearToken() {
			token = null;
			storageSvc.clear('token');
			//do not want to redirect or clear session storage if on the angular landing page
			if (isBase) {
				storageSvc.clearSession();
				if(ssoSvc.IsSso){
						$window.location.href = "//" + ssoSvc.SSODomain + config.topLevelDomain;
				}
				else {
					if(userDataVal.UserType === 5){//campus user
						$window.location.href = config.logout;
					}else{
						var url = config.logoutNavigator;
						var navUrl = $location.url();
						url += "&url=" + encodeURIComponent(navUrl);
						$window.location.href = url;
					}

				}

			}
		}

		return {
			ready: _defer.promise,
			set: setToken,
			get: getToken,
			clear: clearToken
		};

	});

	app.run(function($state, $rootScope){
		$rootScope.$on('$stateChangeStart', function(event, toState){
			isBase = toState.name.indexOf('base.') === 0;
		});
	});
	// #--- END Service (tokenSvc) ---# //
	// #------------------------------# //

}());
