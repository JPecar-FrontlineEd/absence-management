(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------------------# //
	// #----- Endpoint (identityManagementApi) -----# //
	app.factory('identityManagementApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/IdentityManagement', {}, {
				getFlidInformation:{
					method: 'GET',
					params: {
						flid: '@flid',
					},
					url: config.apiEndpoint + '/v1.0/IdentityManagement/Account/FlidLookup/:flid',
					interceptor: endpointInterceptor,
					cache : true
				},
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
	// #--- END Endpoint (identityManagementApi) ---# //
	// #----------------------------------------# //

}());