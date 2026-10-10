(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Endpoint (substituteApi) -----# //
	app.factory('substituteApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var allSubsResource = resource = $resource(config.apiEndpoint + '/v1.0/substitutes');
		var resource = $resource(config.apiEndpoint + '/v1.0/substitutes/:id', {}, {
			callHistory: {
				method: 'GET',
				url: config.apiEndpoint + '/v1.0/Substitutes/CallHistory',
				interceptor: endpointInterceptor
				},
			availability: {
				method: 'GET',
				url: config.apiEndpoint + '/v1.0/Substitutes/Availability',
				interceptor: endpointInterceptor
			},
			excluded: {
				method: 'GET',
				url: config.apiEndpoint + '/v1.0/Substitutes/Excluded',
				interceptor: endpointInterceptor
			},
			call: {
				method: 'POST',
				params: {id: '@id', absrId: '@absrId'},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id/Call',
				interceptor: endpointInterceptor
			},
			block:{
				method: 'PUT',
				params: {id: '@id', absrId: '@absrId'},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id/Block',
				interceptor: endpointInterceptor
			},
			unBlock:{
				method: 'PUT',
				params: {id: '@id', absrId: '@absrId'},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id/Unblock',
				interceptor: endpointInterceptor
			},
			removeSub:{
				method: 'DELETE',
				params: {
					id: '@id',
					absrId: '@absrId',
					hideJobFromSub: '@hideJobFromSub',
					sendSubRemovedNotification:'@sendSubRemovedNotification',
					preventSubFromWorking:'@preventSubFromWorking',
					requestedBy:'@requestedBy',
					subCancelReasonId: '@subCancelReasonId'
				},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id/Remove',
				interceptor: endpointInterceptor
			},
			assignSub:{
				method: 'PUT',
				params: {
					id: '@id',
					absrId: '@absrId',
					isSubOverworked: '@isSubOverworked'
				},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id/Assign',
				interceptor: endpointInterceptor
			},
			absrQualifiedSubstitute:{
				method: 'GET',
				params: {
					id: '@id',
					absrId: '@absrId'
				},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id/AbsrQualifiedSubstitute',
				interceptor: endpointInterceptor
			},
			getById:{
				method: 'GET',
				params: {
					id: '@id'
				},
				url: config.apiEndpoint + '/v1.0/Substitutes/:id',
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

		for (key in allSubsResource) {
			if (!allSubsResource.hasOwnProperty(key)) { continue; }
			// setup the promise hook
			wrapper[key] = customHooks[key] || apiHelp.promiseHook(key, allSubsResource);
		}

		// custom API methods
		// wrapper.customMethod = function...

		return wrapper;

	});
	// #--- END Endpoint (substituteApi) ---# //
	// #------------------------------------# //

}());