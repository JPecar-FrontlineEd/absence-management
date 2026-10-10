(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------------# //
	// #----- Endpoint (entitlementTypeApi) -----# //
	app.factory('entitlementTypeApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/AbsenceReasons/:id', {}, {
				queryCached: {
					method: 'GET',
					cache: true
				},
				queryReference: {
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/AbsenceReasons/ReferenceData'
				},
				put: {
					method: 'PUT',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/AbsenceReasons/:id',
					interceptor: endpointInterceptor
				},
				post: {
					method: 'POST',
					params: {},
					url: config.apiEndpoint + '/v1.0/AbsenceReasons',
					interceptor: endpointInterceptor
				},
				delete: {
					method: 'DELETE',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/AbsenceReasons/:id',
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


		return wrapper;

	});
	// #--- END Endpoint (entitlementTypeApi) ---# //
	// #-----------------------------------------# //

}());