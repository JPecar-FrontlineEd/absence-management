(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Endpoint (filesApi) -----# //
	app.factory('filesApi', function ($resource, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/files/:id'),
			wrapper = {},
			customHooks, key;


		customHooks = {};

		for (key in resource) {
			if (!resource.hasOwnProperty(key)) { continue; }
			// setup the promise hook
			wrapper[key] = customHooks[key] || apiHelp.promiseHook(key, resource);
		}

		// custom API methods
		// wrapper.customMethod = function...

		return wrapper;

	});
	// #--- END Endpoint (filesApi) ---# //
	// #-------------------------------# //

}());