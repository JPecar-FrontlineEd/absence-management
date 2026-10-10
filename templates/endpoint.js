(function() {'use strict';var app = angular.module('aesop');

	// #----------------{{dashes (camelCase name)}}-----------# //
	// #----- Endpoint ({{camelCase name}}Api) -----# //
	app.factory('{{camelCase name}}Api', function ($resource, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/{{lowerCase (camelCase name)}}'),
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
	// #--- END Endpoint ({{camelCase name}}Api) ---# //
	// #------------------{{dashes (camelCase name)}}---------# //

}());