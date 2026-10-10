(function () {'use strict'; var app = angular.module('aesop');

	var apiRequests = {};

	// inject api key if the call is made to the api folder
	app.factory('authInterceptor', function ($q, tokenSvc) {

		function addAuthToken(config) {
			if ((/\/api\//gi).test(config.url)) {
				var token = tokenSvc.get();
				if (token) {
					config.headers.AesopToken = token;
				}
			}
			return config;
		}

		function checkForFailedAuth(res) {
			if (res.status === 401) {
				tokenSvc.clear();
			} else {
				return res;
			}
		}

		return {
			request: addAuthToken,
			responseError: checkForFailedAuth
		};
	});


	app.factory('idmAuthInterceptor', function (authSvc) {

		function addAuthToken(config) {
			if (authSvc.token.access && authSvc.token.access.length > 0) {
				config.headers.Authorization = `Bearer ${authSvc.token.access}`;
			}
			return config;
		}
		return {
			request: addAuthToken,
		};
	});


	//DE12637 WRONG DATA ISSUE
	app.factory('orgIdInterceptor', function ($q, storageSvc) {

		function addOrgID(config) {
			if ((/\/api\//gi).test(config.url)) {
				var loggedInOrgId = storageSvc.load('loggedInOrgId');
				if(loggedInOrgId)
				{
						config.headers.LoggedInOrgId = loggedInOrgId;
				}
			}
			return config;
		}
		return {
			request: addOrgID,
		};
	});



	// track API requests so they can be aborted
	app.factory('resourceRequestInterceptor', function ($q) {

		return {
			request: function (config) {
				if ((/\/api\//gi).test(config.url)) {
					var _defer = $q.defer(),
						keys = Object.keys(apiRequests),
						i = keys.length,
						rootUrl, request;

					for (; i-- ;) {
						if (config.url.toLowerCase().indexOf(keys[i]) === 0) {
							rootUrl = keys[i]; break;
						}
					}

					request = apiRequests[rootUrl];
					if (request && request.$promise) {
						config.timeout = _defer.promise;
						request.$promise.$aborted = false;
						request.$promise.$abort = _defer.resolve;
						_defer.promise.then(function () {
							request.$promise.$aborted = true;
						});
					}
					delete apiRequests[rootUrl];
				}
				return config;
			}
		};

	});

	app.factory('endpointInterceptor', function () {
		return {
			response: function (res) {
				res.resource.$status = res.status;
				return res.resource;
			}
		};
	});

	app.config(function ($httpProvider, $resourceProvider, $provide) {
		var actions = $resourceProvider.defaults.actions,
			endpointInterceptor = {
				response: function (res) {
					res.resource.$status = res.status;
					return res.resource;
				}
			};

		Object.keys(actions).forEach(function (a) {
			actions[a].interceptor = endpointInterceptor;
		});

		// RESOURCE DECORATOR
		$provide.decorator('$resource', function ($delegate) {
			// Return a new constructor function that prepends an API
			// prefix to the passed resource URL (first parameter).
			return function decoratedResource(url, params, actions, options) {
				var newResource = $delegate(url, params, actions, options),
					rootUrl = (/(^.*?)(?:\/:|$)/i).exec(url)[1];
				Object.keys(newResource).forEach(function (action) {
					var actionHook = newResource[action];
					newResource[action] = function () {

						var actionResult = actionHook.apply(null, arguments);
						apiRequests[rootUrl] = actionResult;
						return actionResult;
					};
				});
				return newResource;
			};
		});
	});

	app.config(function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
		//-- http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	});


}());
