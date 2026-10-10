(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------------# //
	// #----- Service (identityMgmtSvc) -----# //
	app.factory('identityMgmtSvc', function ($q, identityManagementApi, authSvc, userSvc ) {

		function getFlidInformation(flid) {
			var _defer = $q.defer();
			authSvc.ready.then(function(svc){
				if(authSvc.isOrgImpersonating()){
					identityManagementApi.getFlidInformation({
						flid : flid
					}).then(function (data) {
						_defer.resolve(data);
					}, function (error) {
						_defer.reject(error);
					});
				}
				else{
					_defer.resolve({lastName: 'Unknown', firstName: 'User'});
				}
			});
			return _defer.promise;
		}

		return {
			getFlidInformation
		};

	});
	// #--- END Service (identityMgmtSvc) ---# //
	// #-------------------------------------# //

}());
