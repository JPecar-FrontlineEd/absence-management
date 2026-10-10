(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #---- Directive (ap-hide-slide) ----# //
	// app.directive('apHideSlide', function (jQuery) {

	// 	return {
	// 		restrict: 'A',
	// 		link: function (scope, elem, attrs) {
	// 			var duration = 500;
	// 			var animationComplete = function (){};
	// 			if (attrs.duration != null && !isNaN(parseInt(attrs.duration, 10))) {
	// 				duration = parseInt(attrs.duration, 10);
	// 			}
	// 			if(attrs.animationComplete != null){
	// 				animationComplete = attrs.animationComplete;
	// 			}

	// 			scope.$watch(attrs.apHideSlide, goSlide);
	// 			goSlide(scope.$eval(attrs.apHideSlide), null);

	// 			function goSlide(nVal, oVal) {
	// 				if (nVal === oVal) { return; }
	// 				if (typeof nVal !== 'boolean') { return; }

	// 				jQuery(elem)[nVal ? 'slideUp' : 'slideDown']( (oVal == null ? 0 : duration),scope.$eval(animationComplete));
	// 			}
	// 		}
	// 	};

	// });
	// #-- END Directive (ap-hide-slide) --# //

	// #-----------------------------# //

	// #---- Directive (ap-show-slide) ----# //
	app.directive('apShowSlide', function (jQuery) {

		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var duration = 200;

				if (attrs.duration != null && !isNaN(parseInt(attrs.duration, 10))) {
					duration = parseInt(attrs.duration, 10);
				}

				scope.$watch(attrs.apShowSlide, goSlide);
				goSlide(scope.$eval(attrs.apShowSlide), null);

				function goSlide(nVal, oVal) {
					if (nVal === oVal) { return; }
					if (typeof nVal !== 'boolean') { return; }

					jQuery(elem)[nVal ? 'slideDown' : 'slideUp']( (oVal == null ? 0 : duration), function (){
						document.body.click();
					});
				}
			}
		};

	});
	// #-- END Directive (ap-show-slide) --# //
	// #-----------------------------# //

}());