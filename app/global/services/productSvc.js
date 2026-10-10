(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Service (productSvc) -----# //
	app.factory('productSvc', function ($q, storageSvc, tokenSvc, productApi) {

		var productData = storageSvc.load({key: 'products'}),
			_defer = $q.defer();

		if (productData) {
			_defer.resolve(productData);
		} else {
			tokenSvc.ready.then(function(){
				productApi.get().then(function (data) {
					storageSvc.save({
						key: 'products',
						data: data
					});
					_defer.resolve(data);
				});
			});
		}

		return {
			ready: _defer.promise
		};

	});
	// #--- END Service (productSvc) ---# //
	// #--------------------------------# //

}());
