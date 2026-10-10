(function() {'use strict';var app = angular.module('aesop');

	// #-------------------{{dashes (dashCase name)}}-------# //
	// #---- Directive (ap-{{dashCase name}}) ----# //
	app.directive('ap{{properCase name}}', function () {

		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				elem.on('click', function () {
					elem.text('something');
				});
			}
		};

	});
	// #-- END Directive (ap-{{dashCase name}}) --# //
	// #-------------------{{dashes (dashCase name)}}-------# //

}());