(function () {'use strict'; var app = angular.module('aesop');
	app.run(function ($q) {
		var promiseApi = Object.getPrototypeOf($q.defer().promise);
		promiseApi.waitFor = function () {
			var promiseArray = Array.prototype.slice.call(arguments, 0),
				_defer = $q.defer();

			this.then(function (data) {
				$q.all(promiseArray).then(function () {
					_defer.resolve(data);
				});
			});

			return _defer.promise;
		};
	});
}());