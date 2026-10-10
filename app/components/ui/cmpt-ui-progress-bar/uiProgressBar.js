(function() {'use strict';angular.module('aesop')
.directive('cmptUiProgressBar', function () {return {

// directive options
restrict: 'E',
scope: {
	preloader: '=',
	loadingText: '=?'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-progress-bar/uiProgressBar.html',

// #------------------------------------------# //
// #---- Component (cmpt-ui-progress-bar) ----# //
controller: function ($scope, stringSvc) {

	if($scope.loadingText == null){$scope.loadText= '';}

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

// #-- END Component (cmpt-ui-progress-bar) --# //
// #------------------------------------------# //
};});}());