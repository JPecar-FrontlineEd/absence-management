(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Endpoint (workerApi) -----# //
	app.factory('workerApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/workers/:workerId'),
			resFiles = $resource(config.apiEndpoint + '/v1.0/workers/:workerId/Files'),
			resRelatedFiles = $resource(config.apiEndpoint + '/v1.0/workers/:workerId/RelatedFiles'),
			wrapper = {
				files: {},
				relatedFiles: {}
			},
			customHooks, key;



		customHooks = {
			// get: function () {}
			// save: function () {}
			// query: function () {}
			// remove: function () {}
			// delete: function () {}
		};

		for (key in resource) {
			if (!resource.hasOwnProperty(key) || key === 'bind') { continue; }
			// setup the promise hook
			wrapper[key] = customHooks[key] || apiHelp.promiseHook(key, resource);
		}

		for (key in resFiles) {
			if (!resFiles.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.files[key] = apiHelp.promiseHook(key, resFiles);
		}

		for (key in resRelatedFiles) {
			if (!resRelatedFiles.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.relatedFiles[key] = apiHelp.promiseHook(key, resRelatedFiles);
		}

		// custom API methods
		// wrapper.customMethod = function...

		return wrapper;

	});
	// #--- END Endpoint (workerApi) ---# //
	// #--------------------------------# //

}());