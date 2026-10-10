(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------# //
	// #----- Endpoint (organizationApi) -----# //
	app.factory('organizationApi', function ($resource, endpointInterceptor,apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/organizations/:id',{},{
			balanceStartDate: {
				method: 'GET',
				url: config.apiEndpoint + '/v1.0/Organizations/BalanceStartDate',
				interceptor: endpointInterceptor
			},
			createBalanceStartDate: {
				method: 'POST',
				url: config.apiEndpoint + '/v1.0/Organizations/BalanceStartDate',
				interceptor: endpointInterceptor
			},
			updateBalanceStartDate: {
				method: 'PUT',
				params: {id: '@id'},
				url: config.apiEndpoint + '/v1.0/Organizations/BalanceStartDate/:id',
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
	// #--- END Endpoint (organizationApi) ---# //
	// #--------------------------------------# //

}());