(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------# //
	// #----- Helper (apiHelp) -----# //
	app.factory('apiHelp', function ($q) {

		return {
			promiseHook: function (funcName, resource) {
				// return a promise if it's available from the $resource call
				funcName = funcName === 'query' ? 'get' : funcName;
				return function() {
					// pass the function call through to the resource object
					var value = resource[funcName].apply(this, arguments),
						_defer = $q.defer();

					Object.keys(value.constructor.prototype).forEach(function (action) {
						if (action.indexOf('$') !== 0) { return; }
						_defer[action] = value.constructor.prototype[action];
					});

					// favor returning a promise
					if (value.$promise) {

						// pass through the abort functionality
						_defer.promise.$aborted = false;
						_defer.promise.$abort = function () {
							if (value.$promise.$abort) {
								value.$promise.$abort();
							}
						};

						value.$promise.then(function (res) {
							var output = res.data || {};
							delete res.data;

							// if this request was aborted, pass the state back
							// to the main promise that we returned.
							if (res.$promise.$aborted) {
								_defer.promise.$aborted = true;
							}

							Object.keys(res).forEach(function (k) {
								if (k === '$promise') { return; }
								var resK = k.charAt(0) === '$' ? k : '$' + k;
								output[resK] = res[k];
							});

							if (!res.success) {
								_defer.reject(output);
							} else {
								_defer.resolve(output);
							}
						});
					} else {
						_defer.resolve(value);
					}

					return _defer.promise;
				};
			}
		};

	});
	// #--- END Helper (apiHelp) ---# //
	// #----------------------------# //

}());