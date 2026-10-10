(function () {'use strict'; var app = angular.module('aesop');
	app.run(function ($rootScope) {

		$rootScope.safeApply = function(fn) {
			var phase = $rootScope.$$phase;
			if(phase === '$apply' || phase === '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				$rootScope.$apply(fn);
			}
		};

		$rootScope.safeDigest = function (scope) {
			var phase = scope.$$phase,
				rootPhase = $rootScope.$$phase;

			if(phase !== '$apply' && phase !== '$digest' && rootPhase !== '$apply' && rootPhase !== '$digest') {
				scope.$digest();
			}
		};

		$rootScope.setTitle = function (title) {
			if (title.length) { title = ' - ' + title; }
			document.title = 'Aesop' + title;
		};

		$rootScope.findInParentScope = function (key, scope) {
			if (key in scope) {
				return scope[key];
			} else if (scope.$parent != null) {
				return $rootScope.findInParentScope(key, scope.$parent);
			} else {
				return null;
			}
		};
	});
}());