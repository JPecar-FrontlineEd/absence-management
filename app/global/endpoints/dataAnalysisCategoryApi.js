(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------------------------# //
	// #----- Endpoint (dataAnalysisCategoryApi) -----# //
	app.factory('dataAnalysisCategoryApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/dataanalysiscategory',{},{
			entitlementType:{
				method: 'GET',
				params: {absrid: '@id'},
				url: config.apiEndpoint + '/v1.0/AbsenceReasons/DataAnalysisCategories',
				interceptor: endpointInterceptor
			}
		}),
		wrapper = {},
		customHooks, key;


		customHooks = {
			// get: function () {}
			// save: function () {}
			// query: function () {}
			// remove: function () {}
			// delete: function () {}
		};

		for (key in resource) {
			if (!resource.hasOwnProperty(key)) { continue; }
			// setup the promise hook
			wrapper[key] = customHooks[key] || apiHelp.promiseHook(key, resource);
		}

		// custom API methods
		// wrapper.customMethod = function...

		return wrapper;

	});
	// #--- END Endpoint (dataAnalysisCategoryApi) ---# //
	// #----------------------------------------------# //

}());