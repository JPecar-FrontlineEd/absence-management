(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #---- Directive (ap-focus-bind) ----# //
	app.directive('apFocusBind', function ($timeout, $rootScope, domHelp) {

		return {
			restrict: 'A',
			scope: {
				scopeBound: '=apFocusBind'
			},
			link: function (scope, elem, attrs) {
				var locked = false;
				scope.$watch('scopeBound', function (nVal) {
					if (!locked) {
						if (domHelp.getStyle(elem[0], 'display') === 'none') {
							$timeout(function () {
								elem[0][!!nVal ? 'focus' : 'blur']();
							}, 10);
						} else {
							elem[0][!!nVal ? 'focus' : 'blur']();
						}
					}
					locked = false;
				});

				elem.on('focus', function () {
					$rootScope.safeApply(function () {
						locked = true;
						scope.scopeBound = true;
					});
				});

				elem.on('blur', function () {
					$rootScope.safeApply(function () {
						locked = true;
						scope.scopeBound = false;
					});
				});
			}
		};

	});
	// #-- END Directive (ap-focus-bind) --# //
	// #-----------------------------------# //

}());