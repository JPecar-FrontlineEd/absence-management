(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------------# //
	// #----- Endpoint (timesheetApproversApi) -----# //
	app.factory('timesheetApproversApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/timesheetapprovers', {}, {
				approverList: {
					method: 'GET',
					params: {instId: '@id'},
					url: config.apiEndpoint + '/v1.0/Institutions/:instId/TimesheetApprovers',
					interceptor: endpointInterceptor
				},
				create: {
					method: 'POST',
					params: {instId: '@id'},
					url: config.apiEndpoint + '/v1.0/Institutions/:instId/TimesheetApprovers',
					interceptor: endpointInterceptor
				},
				update: {
					method: 'PUT',
					params: {
						instId: '@id',
						tsaaId: '@tsaaId'
					},
					url: config.apiEndpoint + '/v1.0/Institutions/:instId/TimesheetApprovers/:tsaaId',
					interceptor: endpointInterceptor
				},
				deleteAlternateApprover: {
					method: 'DELETE',
					params: {
						instId: '@id',
						tsaaId: '@tsaaId'
					},
					url: config.apiEndpoint + '/v1.0/Institutions/:instId/TimesheetApprovers/:tsaaId',
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
	// #--- END Endpoint (timesheetApproversApi) ---# //
	// #--------------------------------------------# //

}());