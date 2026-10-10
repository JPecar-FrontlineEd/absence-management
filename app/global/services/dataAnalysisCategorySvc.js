(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------------# //
	// #----- Service (dataAnalysisCategorySvc) -----# //
	app.factory('dataAnalysisCategorySvc', function ($q, dataAnalysisCategoryApi, storageSvc) {

		var	dataAnalysisCategoryData = storageSvc.load({key: 'dataAnalysisCategoryData'});
		if(dataAnalysisCategoryData === null) { dataAnalysisCategoryData = {}; }

		function getDataAnalysisCategory(type) {
			var	_defer = $q.defer();
			if(angular.isUndefined(dataAnalysisCategoryData[type])){
				dataAnalysisCategoryApi[type]().then(function (data) {
					dataAnalysisCategoryData[type] = data;
					storageSvc.save({
						key: 'dataAnalysisCategoryData',
						data: dataAnalysisCategoryData,
						expires: 10080,	// Expire strings in 1 week
						persistent: true,	// keep this data across multiple sessions
					});
					_defer.resolve(dataAnalysisCategoryData[type]);

				}, _defer.reject);
			}else{
				_defer.resolve(dataAnalysisCategoryData[type]);
			}
			return _defer.promise;
		}

		return {
			getDataAnalysisCategory: getDataAnalysisCategory
		};

	});
	// #--- END Service (dataAnalysisCategorySvc) ---# //
	// #---------------------------------------------# //

}());