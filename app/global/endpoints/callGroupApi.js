(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Endpoint (callGroupApi) -----# //
	app.factory('callGroupApi', function ($resource, apiHelp, config,endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/callgroups',{},{
			defaults:{
					method: 'GET',
					params: {id: '@id'},
					url: config.apiEndpoint + '/v1.0/locations/:id/CallGroup',
					interceptor: endpointInterceptor
				},
			saveDefaults:{
				method: 'Put',
				params: {id: '@id'},
				url: config.apiEndpoint + '/v1.0/callGroups/:id/',
				interceptor: endpointInterceptor
			},
			getPreferences:{
				method: 'GET',
				params: {id: '@id'},
				url: config.apiEndpoint + '/v1.0/CallGroups/:id/Preferences',
				interceptor: endpointInterceptor
			},
			getEligibleSubs:{
				method: 'GET',
				params: {id: '@id'},
				url: config.apiEndpoint + '/v1.0/CallGroups/:id/AvailableSubstitutes',
				interceptor: endpointInterceptor
			},
			deletePreferences:{
				method: 'Delete',
				params: {id: '@id'},
				url: config.apiEndpoint + '/v1.0/CallGroups/:id/Preferences',
				interceptor: endpointInterceptor
			},
			upsertPreferences:{
				method: 'Put',
				params: {id: '@id'},
				url: config.apiEndpoint + '/v1.0/CallGroups/:id/Preferences',
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
	// #--- END Endpoint (callGroupApi) ---# //
	// #-----------------------------------# //

}());