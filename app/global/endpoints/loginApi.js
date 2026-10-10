(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Endpoint (loginApi) -----# //
	app.factory('loginApi', function ($resource, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/login'),
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
	// #--- END Endpoint (loginApi) ---# //
	// #-------------------------------# //

}());