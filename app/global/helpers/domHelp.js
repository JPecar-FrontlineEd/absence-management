(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------# //
	// #----- Helper (domHelp) -----# //
	app.factory('domHelp', function ($rootScope, $q) {

		var rAF = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout( callback, 1000 / 60 );
				};
		})();

		function applyValidationAttributes (elem, attr) {
			if(attr.validations){
				var validations = attr.validations.split(',');
				var validationObj = {};
				for (var i = 0; i < validations.length; i++) {
					var validationName = validations[i].trim();
					validationObj[validationName] = '';//validationName;
				}
				elem.find('input').attr(validationObj);
			}
		}

		return {
			applyValidationAttributes,
			getStyle: function (element, style) {
				return window.getComputedStyle(element, null)[style];
			},
			rAF: function (handler) {
				var _defer = $q.defer();
				rAF(function () {
					var hasFuncHandler = (typeof handler === 'function'),
						result = hasFuncHandler && handler();

					_defer.resolve(result);
					if (hasFuncHandler) { $rootScope.safeApply(); }
				});
				return _defer.promise;
			}
		};

	});
	// #--- END Helper (domHelp) ---# //
	// #----------------------------# //

}());
