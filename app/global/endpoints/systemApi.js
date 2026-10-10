(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Endpoint (systemApi) -----# //
	app.factory('systemApi', function ($resource, apiHelp, config,endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/System',{},{
			GotoVeritime: {
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/System/RedirectToVeritime',
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
	// #--- END Endpoint (systemApi) ---# //
	// #--------------------------------# //

}());