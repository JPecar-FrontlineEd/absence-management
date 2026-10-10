(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------# //
	// #----- Filter (parseAesopDate) -----# //
	app.filter('parseAesopDate', function (parseDateFilter, $locale, timeFilter) {

		//NOTE:
		//  Angular's built-in date formatting based on its predefined formats automatically
		//  offsets times to browser's timezone which is not what we want. The Api endpoints
		//  resolve the times to the user's/org's timezone and should not be changed. This is
		//  why the timeFilter is used separately below for the times rather than using one
		//  of the predefined formats to include both date and time.

		return function (value, timeFormat) {
			var dateConfig = $locale.DATETIME_FORMATS.shortDate;
			var time = '';
			if (angular.isDefined(timeFormat) && timeFormat.toLowerCase().indexOf('date') === -1) {
				var format = (timeFormat.toLowerCase() === 'long') ? 'h:mm:ss T' : 'h:mm T';
				time = ' ' + timeFilter(value, format);
			}
			if ((dateConfig.match(/y/g) || []).length === 2) {
				dateConfig = dateConfig.replace('yy','yyyy');
			}
			return parseDateFilter(value, dateConfig) + time;
		};

	});
	// #--- END Filter (parseAesopDate) ---# //
	// #---------------------------------------# //

}());