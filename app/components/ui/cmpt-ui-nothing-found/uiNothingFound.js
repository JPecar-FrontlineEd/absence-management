(function() {'use strict';angular.module('aesop')
.directive('cmptUiNothingFound', function () {return {

// directive options
restrict: 'E',
scope: {
	nothingFoundText: "=",
	nothingFoundExplanationText: "=",
	showError: "="
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-nothing-found/uiNothingFound.html',

// #-------------------------------------------# //
// #---- Component (cmpt-ui-nothing-found) ----# //
controller: function ($scope) {

	if ($scope.nothingFoundText == null) { $scope.nothingFoundText = ''; }
	if ($scope.nothingFoundExplanationText == null) { $scope.nothingFoundExplanationText = ''; }
	
	// View Model properties
	var vm = $scope.vm = {
		text: $scope.nothingFoundText,
		explanationText: $scope.nothingFoundExplanationText,
		showError: $scope.showError
	}; 


	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-ui-nothing-found) --# //
// #-------------------------------------------# //
};});}());