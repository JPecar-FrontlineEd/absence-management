(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------------# //
	// #----- Endpoint (institutionApi) -----# //
	app.factory('institutionApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/institutions', {}, {
			    get: {
			    	method: 'GET',
			    	url: config.apiEndpoint + '/v1.0/institutions',
			    	interceptor: endpointInterceptor
			    },
			    getById: {
					method: 'GET',
					params: {instId: '@id'},
					url: config.apiEndpoint + '/v1.0/institutions/:instId',
					interceptor: endpointInterceptor
				},
				callHistory: {
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/Locations/CallHistory',
					interceptor: endpointInterceptor
				},
				entitlementTypes:{
					method: 'GET',
					cache: true,
					params: {instId: '@id'},
					url: config.apiEndpoint + '/v1.0/institutions/:instId/AbsenceReasons',
					interceptor: endpointInterceptor
				}
			}),
			resFiles = $resource(config.apiEndpoint + '/v1.0/institutions/:instId/Files'),
			wrapper = {
				files: {}
			},
			customHooks, key;


		customHooks = {};

		for (key in resource) {
			if (!resource.hasOwnProperty(key)) { continue; }
			// setup the promise hook
			wrapper[key] = customHooks[key] || apiHelp.promiseHook(key, resource);
		}
		for (key in resFiles) {
			if (!resFiles.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.files[key] = apiHelp.promiseHook(key, resFiles);
		}

		// custom API methods

		return wrapper;

	});
	// #--- END Endpoint (institutionApi) ---# //
	// #-------------------------------------# //

}());