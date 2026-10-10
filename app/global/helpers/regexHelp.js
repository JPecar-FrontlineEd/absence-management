(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------# //
	// #----- Helper (regexHelp) -----# //
	app.factory('regexHelp', function () {

		return {
			dateString: function (){
				return /^\d{1,2}\/\d{1,2}\/\d{4}$/;
			},
			escapeString: function (string) {
				if (typeof string !== 'string') { return ''; }
				return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
			},
			timeFormatOptional: function () {
				return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i;
			},
			negativeInteger: function(){
				return /^-(\d+)$/;
			},
			integer: function(){
				return /^[+-]?(\d+)$/;
			},
			decimal: function(){
				return /^[+-]?(?!.*\..*\.)[.\d]+$/;
			},
			decimalTwoPlaces: function(){
				return /^[+-]?(?=[0-9]?)\d*(?:\.\d{1,2})?\s*$/;
			}
		};

	});
	// #--- END Helper (regexHelp) ---# //
	// #------------------------------# //

}());
