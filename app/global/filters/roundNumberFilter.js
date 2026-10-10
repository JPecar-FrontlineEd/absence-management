(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Filter (roundNumber) -----# //
	app.filter('roundNumber', function () {

		return function (value, places) {
			if (!angular.isNumber(value)) {
				return value;
			}
			places = places || 0;

			//create the factor (10,100,1000) to determine how many decimal places we have
			var factor = '1' + new Array(+(places > 0 && places + 1)).join('0');
        	return Math.round(value * factor) / factor;
		};

	});
	// #--- END Filter (roundNumber) ---# //
	// #------------------------------------# //

}());