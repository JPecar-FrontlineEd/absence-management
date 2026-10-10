(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Endpoint (searchApi) -----# //
	app.factory('searchApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/search', {}, {
			generalSearch: {
					method: 'GET',
                params: {searchFor: '@searchFor', searchTypes: '@searchTypes', isActive: '@isActive', maxFetchCount: '@maxFetchCount', offset: '@offset'},
					url: config.apiEndpoint + '/v1.0/search/generalSearch',
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
	// #--- END Endpoint (searchApi) ---# //
	// #--------------------------------# //

}());