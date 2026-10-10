(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Endpoint (userRevokeApi) -----# //
	app.factory('userRevokeApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/userrevoke', {}, {
			revokeUser:{
					method: 'DELETE',
					params: { id: '@id'},
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id/Revoke',
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
	// #--- END Endpoint (userRevokeApi) ---# //
	// #------------------------------------# //

}());