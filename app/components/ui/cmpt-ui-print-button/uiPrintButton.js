(function() {'use strict';angular.module('aesop')
.directive('cmptUiPrintButton', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/ui/cmpt-ui-print-button/uiPrintButton.html',

// #------------------------------------------# //
// #---- Component (cmpt-ui-print-button) ----# //
controller: function ($scope, stringSvc, domHelp) {

	// View Model properties
	var vm = $scope.vm = {
		printing: false
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Reports.CriteriaPanel.Button.Print'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		printPage: function () {
			vm.printing = true;
			domHelp.rAF().then(function () {
				$scope.$root.$emit('beforePrint');

				domHelp.rAF().then(function () {
					domHelp.rAF().then(function () {
						window.print();
						$scope.$root.$emit('afterPrint');
					});
				});
			});
		}
	};

	$scope.$on('$destroy', $scope.$root.$on('beforePrint', function () { vm.printing = true; $scope.$root.safeDigest($scope); }));
	$scope.$on('$destroy', $scope.$root.$on('afterPrint', function () { vm.printing = false; }));
}

// #-- END Component (cmpt-ui-print-button) --# //
// #------------------------------------------# //
};});}());