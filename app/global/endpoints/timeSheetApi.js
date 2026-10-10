(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Endpoint (timeSheetApi) -----# //
	app.factory('timeSheetApi', function ($resource, apiHelp, config,endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/timesheets/:tsid',{},{
				log:{
					method: 'GET',
					params: {tsid: '@id'},
					url: config.apiEndpoint + '/v1.0/timesheets/:tsid/Log',
					interceptor: endpointInterceptor
				},
				getById:{
					method: 'GET',
					params: {
						id: '@id'
					},
					url: config.apiEndpoint + '/v1.0/Timesheets/:id',
					interceptor: endpointInterceptor
				},
				getPeriods:{
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/Timesheets/Periods',
					interceptor: endpointInterceptor
				},
				saveTimesheet:{
					method: 'PUT',
					params: {tsid: '@id'},
					url: config.apiEndpoint + '/v1.0/Timesheets/:tsid',
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
	// #--- END Endpoint (timeSheetApi) ---# //
	// #-----------------------------------# //

}());
