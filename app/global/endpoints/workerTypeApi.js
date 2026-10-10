(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Endpoint (workerTypeApi) -----# //
	app.factory('workerTypeApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/workertypes/:wktid',{},{
			substituteQuestion:{
				method: 'GET',
				cache:true,
				params: {wktid: '@id'},
				url: config.apiEndpoint + '/v1.0/workertypes/:wktid/SubstituteQuestions',
				interceptor: endpointInterceptor
			},
			workerQuestion:{
				method: 'GET',
				cache:true,
				params: {wktid: '@id'},
				url: config.apiEndpoint + '/v1.0/workertypes/:wktid/WorkerQuestions',
				interceptor: endpointInterceptor
			},
			getForReferenceData:{
				method: 'GET',
				cache:true,
				url: config.apiEndpoint + '/v1.0/workertypes/ReferenceData',
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
	// #--- END Endpoint (workerTypeApi) ---# //
	// #------------------------------------# //

}());