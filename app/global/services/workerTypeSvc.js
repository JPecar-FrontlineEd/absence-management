(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Service (workerTypeSvc) -----# //
	app.factory('workerTypeSvc', function ($q, storageSvc, workerTypeApi, tokenSvc) {

		var workerData = storageSvc.load({key: 'workerTypes'}),
			_defer = $q.defer();

		if (workerData) {
			_defer.resolve(workerData);
		} else {
			tokenSvc.ready.then(function(){
				workerTypeApi.get().then(function (data) {
					workerData = data;

					storageSvc.save({
						key: 'workerTypes',
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
	// #--- END Service (workerTypeSvc) ---# //
	// #-------------------------------# //

}());
