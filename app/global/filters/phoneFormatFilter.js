(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Filter (phoneFormat) -----# //
	app.filter('phoneFormat', function () {

		return function (value, config) {
			if (!value) { return ''; }

			var newvalue = value.toString().trim().replace(/^\+/, '');

			if (newvalue.match(/[^0-9]/)) {
	            return newvalue;
	        }

	        var country, city, number;

	        switch (newvalue.length) {
	            case 10: // +1PPP####### -> C (PPP) ###-####
	                country = 1;
	                city = newvalue.slice(0, 3);
	                number = newvalue.slice(3);
	                break;

	            case 11: // +CPPP####### -> CCC (PP) ###-####
	                country = newvalue[0];
	                city = newvalue.slice(1, 4);
	                number = newvalue.slice(4);
	                break;

	            case 12: // +CCCPP####### -> CCC (PP) ###-####
	                country = newvalue.slice(0, 3);
	                city = newvalue.slice(3, 5);
	                number = newvalue.slice(5);
	                break;

	            default:
	                return value;
       		}

        if (country === 1) {
            country = '';
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + ' (' + city + ') ' + number).trim();

		};

	});
	// #--- END Filter (phoneFormat) ---# //
	// #------------------------------------# //

}());