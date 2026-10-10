(function () {'use strict'; var app = angular.module('aesop');

app.run(function ($rootScope, $location) {

	var pathsThatFillScreen = [
		/^\/navigator/i
	];

	$rootScope.fillScreen = false;
	$rootScope.$on('$stateChangeSuccess', function () {
		var path = $location.path();
		$rootScope.fillScreen = pathsThatFillScreen.reduce(function (goingToFill, pathMatcher) {
			return goingToFill || pathMatcher.test(path);
		}, false);
	});
});

}());
