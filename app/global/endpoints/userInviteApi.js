(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------# //
	// #----- Endpoint (userInviteApi) -----# //
	app.factory('userInviteApi', function ($resource, apiHelp, config, endpointInterceptor) {

		var resource = $resource(config.apiEndpoint + '/v1.0/AesopUsers', {}, {
				inviteUser:{
					method: 'POST',
					params: { id: '@id'},
					url: config.apiEndpoint + '/v1.0/AesopUsers/:id/Invite',
					interceptor: endpointInterceptor
				},
				bulkInviteUsers:{
					method: 'POST',
					url: config.apiEndpoint + '/v1.0/AesopUsers/BulkInvite',
					interceptor: endpointInterceptor
				},
				bulkInactivateUsers:{
					method: 'POST',
					url: config.apiEndpoint + '/v1.0/AesopUsers/BulkInactivate',
					interceptor: endpointInterceptor
				},
				bulkActivateUsers:{
					method: 'POST',
					url: config.apiEndpoint + '/v1.0/AesopUsers/BulkActivate',
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
	// #--- END Endpoint (userInviteApi) ---# //
	// #---------------------------------------# //

}());
