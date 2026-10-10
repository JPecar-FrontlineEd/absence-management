(function() {'use strict';angular.module('aesop')
.directive('cmptSearchByLetter', function () {return {

// directive options
restrict: 'E',
scope: {
	filter: '='
},
replace: true,
templateUrl: '/components/template/cmpt-search-by-letter/searchByLetter.html',

// #-------------------------------------------------------# //
// #---- Component (cmpt-search-by-letter) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		characters: (function () {
			var arr = [];
			for (var i = 65; i <= 90; i++) {
				arr.push(String.fromCharCode(i));
			}
			return arr;
		}())
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Select.SearchByLetter',
		'All'
	]);


	// Actions that can be bound to from the view
	var go = $scope.go = {
		setLetter: function (letter) {
			$scope.filter = letter;
		}
	};
}

// #-- END Component (cmpt-search-by-letter) --# //
// #-------------------------------------------------------# //
};});}());