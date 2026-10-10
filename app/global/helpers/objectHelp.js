(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Helper (objectHelp) -----# //
	app.factory('objectHelp', function () {

		function splice(obj, properties) {
			var retObj = {};

			properties.forEach(function (p){
				if (obj.hasOwnProperty(p)) {
					retObj[p] = obj[p];
				}
			});

		    return retObj;
		}

		return {
			splice: splice
		};

	});
	// #--- END Helper (objectHelp) ---# //
	// #-------------------------------# //

}());