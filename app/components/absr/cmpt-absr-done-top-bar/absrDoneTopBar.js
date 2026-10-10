(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDoneTopBar', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
transclude: true,
templateUrl: '/components/absr/cmpt-absr-done-top-bar/absrDoneTopBar.html',

// #--------------------------------------------# //
// #---- Component (cmpt-absr-done-top-bar) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {

	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Text.PrintThisPage'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {};
}

// #-- END Component (cmpt-absr-done-top-bar) --# //
// #--------------------------------------------# //
};});}());