(function () {'use strict'; var app = angular.module('aesop');

	app.run(function ($rootScope, navUrlMappingSvc) {

		$rootScope.$on('$stateChangeSuccess', function (e) {
			var doVerify = navUrlMappingSvc.verifyCurrentPath();
			if (doVerify != null) { $rootScope.setTitle(''); }
			$rootScope.routeVerified = (doVerify == null) ? true : doVerify;
		});

	});

}());