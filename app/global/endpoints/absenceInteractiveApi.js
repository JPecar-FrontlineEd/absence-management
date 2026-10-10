(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------------# //
	// #----- Endpoint (absenceInteractiveApi) -----# //
	app.factory('absenceInteractiveApi', function ($resource, apiHelp, config,endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/absenceinteractive',{},{
			GetExecution: {
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/AbsenceInteractive/DownloadDetails',
					interceptor: endpointInterceptor
				},
			reportExec: {
				method: 'GET',
				params: { reportExecId: '@id' },
				url: config.apiEndpoint + '/v1.0/AbsenceInteractive/Executions/:reportExecId',
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
	// #--- END Endpoint (absenceInteractiveApi) ---# //
	// #--------------------------------------------# //

}());