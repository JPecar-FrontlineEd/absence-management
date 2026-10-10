(function () {
	'use strict'; var app = angular.module('aesop');

	// #----------------------------------------# //
	// #----- Service (routePermissionSvc) -----# //
	app.factory('routePermissionSvc', function (permissionSvc, routePermissionVal) {

		var iHave = permissionSvc.iHave;

		function checkRoute(path) {
			var matchingRoutes = routePermissionVal.filter(function (route) {
				return route.matcher && route.matcher.test(path);
			});

			var checkedRoutes = matchingRoutes.reduce(function (prev, route) {
				return prev && route.permission != null && iHave(route.permission);
				
			}, true);

			return checkedRoutes;
		}

		function checkRouteVisible(path) {
			var matchingRoutes = routePermissionVal.filter(function (route) {
				return route.matcher && route.matcher.test(path);
			});

			return matchingRoutes.reduce(function (prev, route) {
				return prev && (route.hidden == null || !iHave(route.hidden));
			}, true);
		}

		return {
			checkRoute: checkRoute,
			checkRouteVisible: checkRouteVisible
		};

	});
	// #--- END Service (routePermissionSvc) ---# //
	// #----------------------------------------# //

}());