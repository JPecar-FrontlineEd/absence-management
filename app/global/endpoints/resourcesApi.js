(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Endpoint (resourcesApi) -----# //
	app.factory('resourcesApi', function ($resource, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/resources', {}, {
				fetch: {
					method: 'PUT'
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
	// #--- END Endpoint (resourcesApi) ---# //
	// #-----------------------------------# //

}());