(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------# //
	// #----- Endpoint (reportWriterApi) -----# //
	app.factory('reportWriterApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/ReportWriter', {}, {
			reports: {
				method: 'GET',
				url: config.apiEndpoint + '/v1.0/ReportWriter/Reports',
				interceptor: endpointInterceptor
			},
			report: {
				method: 'GET',
				params: { reportConfigId: '@id' },
				url: config.apiEndpoint + '/v1.0/ReportWriter/Reports/:reportConfigId',
				interceptor: endpointInterceptor
			},
			reportExecs: {
				method: 'GET',
				params: { reportConfigId: '@id' },
				url: config.apiEndpoint + '/v1.0/ReportWriter/Reports/:reportConfigId/Executions',
				interceptor: endpointInterceptor
			},
			reportExec: {
				method: 'GET',
				params: { reportExecId: '@id' },
				url: config.apiEndpoint + '/v1.0/ReportWriter/Executions/:reportExecId',
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
	// #--- END Endpoint (reportWriterApi) ---# //
	// #--------------------------------------# //

}());