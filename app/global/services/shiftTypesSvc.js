(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Service (shiftTypesSvc) -----# //
	app.factory('shiftTypesSvc', function ($q,stringSvc) {

		var _defer = $q.defer();
		var shiftTypes = {
			1: {
				mnemonic:'FullDay',
				cssClass:'fa-circle'
			},
			2: {
				mnemonic:'HalfDayAM',
				cssClass:'fa-circle-am'
			},
			3: {
				mnemonic:'HalfDayPM',
				cssClass:'fa-circle-pm'
			},
			4: {
				mnemonic:'CustomDay',
				cssClass:'fa-circle-dotted'
			},
			0: {
				mnemonic:'Unknown',
				cssClass:'fa-circle-dotted'
			}
			
		};


		stringSvc.getStrings(
			Object.keys(shiftTypes).map(function (v, i, a) {
				return shiftTypes[v].mnemonic;
			})
		).$promise.then(function (strings) {
			Object.keys(shiftTypes).forEach(function (v, i, a) {
				shiftTypes[v].title = strings[shiftTypes[v].mnemonic];
			});

			_defer.resolve(shiftTypes);
		});

		return {
			ready: _defer.promise,
			oneById: function (v) { return shiftTypes[v]; }
		};

	});
	// #--- END Service (shiftTypesSvc) ---# //
	// #-----------------------------------# //

}());