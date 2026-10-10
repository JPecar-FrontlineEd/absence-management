(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Service (userSessionsSvc) -----# //
	app.factory('userSessionsSvc', function ($q, userSessionsApi, tokenSvc) {

		function getOrganizationRoles(orgXrefId = null) {
			var _defer = $q.defer();
			userSessionsApi.roles({
				orgXrefId: orgXrefId
			}).then(function (data) {
				_defer.resolve(data);
			}, function (error) {
				_defer.reject(error);
			});

			return _defer.promise;
		}

		function redirectUrl(userType, userKey, usingMobile, orgXrefId = null, url = null, isPartOfMos = false) {
			var _defer = $q.defer();
			userSessionsApi.redirectUrl({
				userType: userType,
				userKey: userKey,
				usingMobile: usingMobile,
				orgXrefId: orgXrefId,
				redirectUrl: url,
				isPartOfMos: isPartOfMos
			}).then(function (data) {
				_defer.resolve(data);
			}, function (error) {
				_defer.reject(error);
			});

			return _defer.promise;
		}

		function impersonateRedirectUrl(userType, userKey, usingMobile, url = null, productId = null) {
			var _defer = $q.defer();
			userSessionsApi.impersonateRedirectUrl({
				userType: userType,
				userKey: userKey,
				redirectUrl: url,
				productId: productId,
				usingMobile: usingMobile
			}).then(function (data) {
				_defer.resolve(data);
			}, function (error) {
				_defer.reject(error);
			});

			return _defer.promise;
		}
		
		function endImpersonationUrl(){
			var _defer = $q.defer();
			userSessionsApi.endImpersonationUrl()
			.then(function(data){
				_defer.resolve(data);
			})
			.catch(function(error){
				_defer.reject(error);
			})
			return _defer.promise;
		}

		


		return {
			getRoles: getOrganizationRoles,
			redirectUrl: redirectUrl,
			impersonateRedirectUrl,			
			endImpersonationUrl
		};

	});
	// #--- END Service (userSessionsSvc) ---# //
	// #-------------------------------# //

}());
