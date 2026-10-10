(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Service (payCodeSvc) -----# //
	app.factory('payCodeSvc', function ($q, storageSvc, paycodeApi, permissionSvc) {

		var _defer = $q.defer(),
			payCodeData = storageSvc.load({key: 'payCodes'});

		if (payCodeData == null) {
			permissionSvc.ready.then(function (){
				if(permissionSvc.iHave('ABSR.DTLSPYCD')){
					paycodeApi.get().then(function (data) {
						payCodeData = data;
						storageSvc.save({
							key: 'payCodes',
							data: data
						});
						_defer.resolve(payCodeData);

					}, _defer.reject);
				}
			});
		}else{
			_defer.resolve(payCodeData);
		}

		function getPayCodes() {
			return payCodeData;
		}

		return {
			ready: _defer.promise,
			getPayCodes: getPayCodes
		};

	});


	// #--- END Service (payCodeSvc) ---# //
	// #--------------------------------# //

}());