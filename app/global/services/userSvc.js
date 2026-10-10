(function () {
	'use strict'; var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Service (userSvc) -----# //
	app.factory('userSvc', function ($q, $window, userApi, loginApi, storageSvc, tokenSvc, authSvc, userDataVal, config, ssoSvc, idmAvailableSvc, $cookies) {
		var userData = storageSvc.load('user'),
			_defer = $q.defer()


		if (!userData) {
			tokenSvc.ready.then(function () {
				var test = userApi.get().then(function (data) {
					userData = data;
					storageSvc.save({
						key: 'user',
						data: data,
						expire: 5
					});

					setUserDataVal(data);
					_defer.resolve(userDataVal);
				}, function (err) {
					console.log(' => error', err); // REMOVE ME
				});
			});
		} else {
			setUserDataVal(userData);
			_defer.resolve(userDataVal);
		}

		function logUserOut() {
			storageSvc.clearSession();
			loginApi.remove().then(function () {
				if (idmAvailableSvc.IDMAvailable()) {
					clearMobileOptOutCookie();
					authSvc.ready.then(function (svc) {
						if (authSvc.isOrgImpersonating() || authSvc.isFlidImpersonating()) {
							authSvc.endImpersonate();
						} else if (isMOPUser()) {
							if (idmAvailableSvc.IDMIsIdentityProvider()) {
								authSvc.signout(config.logout + '/navigator/loginexpired.asp?logout=1');
							} else {
								$window.location.href = config.logout + "/logout.asp";
							}
						} else {
							authSvc.signout();
						}
					});
				}
				else {
					if (ssoSvc.IsSSO) {
						$window.location.href = "//" + ssoSvc.SSODomain + config.topLevelDomain;
					}
					else {
						if (userData.UserType === 5) {
							//campus user
							$window.location.href = config.logout;
						} else {
							var url = config.logoutNavigator;
							var navUrl = $location.url();
							url += "&url=" + encodeURIComponent(navUrl);
							$window.location.href = url;
						}
					}
				}
			});
		}

		function logUserOutMorpheus() {
			storageSvc.clearSession();
			loginApi.remove().then(function () {
				clearMobileOptOutCookie();
				authSvc.ready.then(function (svc) {
					if (authSvc.isOrgImpersonating() || authSvc.isFlidImpersonating()) {
						authSvc.endImpersonate();
					} else if (isMOPUser()) {
						if (idmAvailableSvc.IDMIsIdentityProvider()) {
							authSvc.signout(config.logout + '/navigator/loginexpired.asp?logout=1');
						} else {
							$window.location.href = config.logout + "/logout.asp";
						}
					} else {
						$window.location.href = config.morpheusLogout;
					}
				});
			});
		}


		function clearUserSession() {
			storageSvc.clearSession();
			if (tokenSvc.get()) {
				loginApi.remove();
				location.reload();
			}
			return $q.resolve();
		}

		function updateUserInfo(userObj) {
			userData = userObj;
			storageSvc.save({
				key: 'user',
				data: userObj,
				expire: 5
			});
			setUserDataVal(userObj);
		}

		function setUserDataVal(userData) {
			clearUserDataVal();
			angular.extend(userDataVal, userData);
			userDataVal.isFullyPopulated = true;
		}
		function clearUserDataVal() {
			Object.keys(userDataVal).forEach(function (v, i, a) {
				delete userDataVal[v];
			});
			userDataVal.isFullyPopulated = false;
		}

		function isMOPUser() {
			return !!$cookies.get(config.mopInUseCookie);
		}

		function clearMobileOptOutCookie() {
			var today = new Date();
			var expireDate = today.setDate(today.getDate() - 1);
			var expireObj = { domain: config.topLevelDomain, expires: expireDate };
			$cookies.remove(config.mobileOptOutCookie, expireObj);
		}
		function isOrgUser() {
			return (userDataVal.UserType == 4 || userDataVal.UserType == 0);
		}
		function isCampusUser() {
			return (userDataVal.UserType == 5);
		}
		function getPreference(code) {
			let result = null;
			userDataVal.preferences.forEach(function (pref) {
				if (pref.code == code) {
					result = pref;
					return false;
				}
			});
			return result;
		}
		function syncPreference(id, code, value) {
			let pref = getPreference(code);
			if (pref) {
				pref.value = value;
			}
			else {
				userDataVal.preferences.push({ id: id, code: code, value: value });
			}
			saveToStorage(userDataVal);
		}
		function saveToStorage(userDataObj) {
			storageSvc.save({
				key: 'user',
				data: userDataObj,
				expire: 5
			});
		}

		function updatePreference(preferenceObj) {
			_defer = $q.defer();
			userApi.updateUserPreference(preferenceObj)
				.then(
					function (userObj) {
						updateUserInfo(userObj);
						_defer.resolve();
					},
					function (reasons) {
						_defer.reject(reasons);
					});
			return _defer.promise;
		}

		return {
			ready: _defer.promise,
			logout: logUserOut,
			logoutMorpheus: logUserOutMorpheus,
			getUserData: function () {
				return userDataVal;
			},
			update: updateUserInfo,
			clearUserSession: clearUserSession,
			isOrgUser: isOrgUser,
			isCampusUser: isCampusUser,
			getUserPreference: getPreference,
			syncUserPreference: syncPreference,
			updatePreference: updatePreference,
			isMOPUser: isMOPUser
		};

	});
	// #--- END Service (userSvc) ---# //
	// #-----------------------------# //

}());
