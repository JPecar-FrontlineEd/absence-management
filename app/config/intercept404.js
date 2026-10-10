(function () {'use strict'; var app = angular.module('aesop');

	app.factory('404Interceptor', function ($templateCache) {

		function checkFor404(res) {
			if (typeof res.data === 'string' && res.data.substr(2, 7) === 'doctype') {
				// console.log(' => res', res); // REMOVE ME
				res.data = $templateCache.get('/routes/404.html');
				return res;
			} else {
				return res;
			}
		}

		return {
			response: checkFor404
		};
	});

}());


