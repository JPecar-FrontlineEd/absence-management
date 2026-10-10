(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Service (stringSvc) -----# //
	app.factory('stringSvc', function ($q, $timeout, $log, $rootScope, allStringsVal, resourcesApi, storageSvc, userSvc, tokenSvc) {

		var cache = {},
		    cacheRetry = {},		// cacheRetry[key] = # of times retrieved.
			userData = {},
			stringQueue = [],
			fetchTimeout = null,
			returnObjects = [],
			preloadAlreadyFired = false,
			_defer = $q.defer();

		// preload all strings
		userSvc.ready.then(function(userObj){
			userData = userObj;
			cache = storageSvc.load({key: 'i18nStrings-' + userData.localeId}) || {};
			getStrings(allStringsVal).$promise.then(function () {
				_defer.resolve();
			});
		});

		preloadAlreadyFired = true;

		function processStrings() {
			// copy current viewModel objects that want
			// values back from this call
			var objects = returnObjects,
				queue = stringQueue;

			if (queue.join('').length) {
				tokenSvc.ready.then(function(){
					resourcesApi.fetch({ locId: userData.localeId }, queue.map(function (v, i, a) {
							return {
								mnemonic: v
							};
						})
					).then(function (data) {
						var key, val, ki, i;
						ki = data.length;
						for (; ki-- ;) {
							key = data[ki].mnemonic;
							val = data[ki].resolved || '';
							cache[key] = val;
							if (val === "{" + key + "}") {
								cacheRetry[key] ? cacheRetry[key]++ : cacheRetry[key] = 1;
							}
							i = objects.length;
							for (; i-- ;) {
								if (typeof objects[i][key] === 'string') {
									objects[i][key] = val;
								}
							}
						}

						i = objects.length;
						for (; i-- ;) {
							if (objects[i].$defer) {
								objects[i].$defer.resolve(objects[i]);
								delete objects[i].$defer;
							}
						}

						storageSvc.save({
							key: 'i18nStrings-' + userData.localeId,
							expires: 525600,	// Expire strings in 1 year
							persistent: true,	// keep this data across multiple sessions
							data: cache
						});

						$rootScope.safeApply();
					});
				});
			}

			returnObjects = [];
			fetchTimeout = null;
			stringQueue = [];
		}

		function fetchString(key) {
			if (fetchTimeout) { $timeout.cancel(fetchTimeout); }
			fetchTimeout = $timeout(processStrings, 25);

			// only request any given string once
			if (stringQueue.indexOf(key) < 0) {
 				stringQueue.push(key);
			}
		}

		function retryFetch(key) {
			//If the value in the cache matches the key surrounded by curly braces
			//then resource resolution didn't really work.  
			//Try again... but keep track of how many times. 
			//After 5 (arbitrary choice) don't retry anymore.
			if (cache[key] && cache[key] === "{" + key + "}") {
				var numRetries = (cacheRetry[key] ? cacheRetry[key] : 0);
				if (numRetries >= 5) $log.warn("Exceeded Resource retry count for mnemonic '" + key + "'");
				return numRetries < 5;
			}

			return false;
		}
		
		function StringObj(keyArr) {
			var i = keyArr.length,
				key, satisfied = true;

			this.$defer = $q.defer();
			this.$promise = this.$defer.promise;

			for (; i-- ;) {
				key = keyArr[i];

				// when to give up
				if (key === null) { continue; }
				if (key === '') { continue; }
				if (key.indexOf('|') !== -1) { continue; }

				if (cache[key] == null || retryFetch(key)) {
					satisfied = false;
					fetchString(key);
					this[key] = '...';
					if (preloadAlreadyFired) {
						if (allStringsVal.indexOf(key) === -1) {
							$log.warn('MNEMONIC NOT PRELOADED!', key);
						}
					}
				} else {
					this[key] = cache[key];
				}
			}

			if (!satisfied) {
				returnObjects.push(this);
			} else {
				this.$defer.resolve(this);
				delete this.$defer;
			}

			return this;
		}
		StringObj.prototype.bind = function (key) {
			return (this[key] === '...' || this[key] == null) ? undefined : this[key];
		};

		function getStrings(keyArr) {
			return new StringObj(keyArr);
		}

		return {
			getStrings: getStrings,
			ready: _defer.promise
		};

	});
	// #--- END Service (stringSvc) ---# //
	// #-------------------------------# //

}());
