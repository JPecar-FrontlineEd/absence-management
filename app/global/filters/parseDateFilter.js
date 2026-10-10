(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------------# //
	// #----- Filter (parseDate) -----# //
	app.filter('parseDate', function ($filter) {

		return function (value, config) {
			return $filter('date')(new Date(value), config);
		};

	});
	// #--- END Filter (parseDate) ---# //
	// #----------------------------------# //

}());