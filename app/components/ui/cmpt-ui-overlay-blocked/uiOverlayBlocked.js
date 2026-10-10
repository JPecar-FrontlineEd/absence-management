(function() {'use strict';angular.module('aesop')
.directive('cmptUiOverlayBlocked', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-overlay-blocked/uiOverlayBlocked.html',

// #---------------------------------------------# //
// #---- Component (cmpt-ui-overlay-blocked) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		property: 'initial value'
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-ui-overlay-blocked) --# //
// #---------------------------------------------# //
};});}());