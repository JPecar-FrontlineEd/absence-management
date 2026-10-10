(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------------------# //
	// #----- Endpoint (userAccessApi) -----# //
	app.factory('userAccessApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/AesopUsers', {}, {
				getUsers:{
					method: 'GET',
					params: {
						searchString: '@searchString',
						missingEmailUsersOnly: '@missingEmailUsersOnly',
						pageNumber: '@pageNumber',
						pageSize:'@pageSize',
					},
					url: config.apiEndpoint + '/v1.0/AesopUsers',
					interceptor: endpointInterceptor
				},
				getUser:{
					method: 'GET',
					params: {
						id: '@id',
					},
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id',
					interceptor: endpointInterceptor
				},
				getUserCredentials:{
					method: 'GET',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id/Credentials',
					interceptor: endpointInterceptor
				},
				setEmail:{
					method: 'PUT',
					params: { id: '@id' },
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id/SetEmail',
					interceptor: endpointInterceptor
				},
				activateUser:{
					method: 'PUT',
					params: { id: '@id' },
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id/Activate',
					interceptor: endpointInterceptor
				},
				inactivateUser:{
					method: 'DELETE',
					params: { id: '@id' },
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id/Inactivate',
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
	// #--- END Endpoint (userAccessApi) ---# //
	// #----------------------------------------# //

}());