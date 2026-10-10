(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------------# //
	// #----- Endpoint (substituteAbsencesApi) -----# //
	app.factory('substituteAbsencesApi', function ($q, $timeout, $resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/substituteabsences/:id', {}, {
				substituteAbsenceLog: {
					method: 'GET',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/substituteabsences/:id/SubstituteAbsenceLog',
					interceptor: endpointInterceptor
				},
				update:{
					method: 'PUT',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/substituteabsences/:id',
					interceptor: endpointInterceptor
				},
				create:{
					method: 'POST',
					params: { },
					url: config.apiEndpoint + '/v1.0/substituteabsences',
					interceptor: endpointInterceptor
				},
				lock:{
					method: 'POST',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/substituteabsences/:id/Lock',
					interceptor: endpointInterceptor
				},
				unlock:{
					method: 'DELETE',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/substituteabsences/:id/Lock',
					interceptor: endpointInterceptor
				},
				findLock:{
					method: 'GET',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/substituteabsences/:id/Lock',
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
	// #--- END Endpoint (substituteAbsencesApi) ---# //
	// #--------------------------------------------# //

}());