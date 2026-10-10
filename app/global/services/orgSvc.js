(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------# //
	// #----- Service (orgSvc) -----# //
	app.factory('orgSvc', function ($q, storageSvc, tokenSvc, organizationApi) {


		var _defer = $q.defer(),
			orgData = storageSvc.load({key: 'organizations'});

		if (orgData == null) {
			tokenSvc.ready.then(function(){
				organizationApi.get().then(function (data) {

					orgData = data;
					storageSvc.save({
						key: 'organizations',
						data: data
					});

					storageSvc.save({
						key:'loggedInOrgId',
						data: data[0].id
					});

					_defer.resolve(orgData);
				}, _defer.reject);
			});
		} else {
			_defer.resolve(orgData);
		}

		function getOrgData() {
			return orgData;
		}



		const partner = () => {
			var org = getOrgData()[0];
			var useAdmin = true;
		};


		return {
			ready: _defer.promise,
			getOrgData: getOrgData,
			partner
		};

	});
	// #--- END Service (orgSvc) ---# //
	// #----------------------------# //

}());
