(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Filter (timeFormat) -----# //
	app.filter('time', function (dateHelp, stringHelp) {

		return function (dateString, format, roundToNearest) {
			format = format || 'hh:mm T';
			roundToNearest = roundToNearest && parseInt(roundToNearest, 10) || 0;

			try {
				dateString = dateString.toString().replace(/\s/g, '');
				if (!dateString) { return; }

				var dt = dateHelp.parseTime(dateString);
				if (dt === false) { return ''; }
				if (roundToNearest) {
					dt = dateHelp.roundMinutes(dt, roundToNearest);
				}
				return dateHelp.formatDate(dt, format);
			}
			catch (e) { return ''; }
		};

	});
	// #--- END Filter (timeFormat) ---# //
	// #-----------------------------------# //

}());