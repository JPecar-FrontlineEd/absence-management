(function() {'use strict';angular.module('aesop')
.directive('cmptUiBarChart', function () {return {

// directive options
restrict: 'E',
scope: {
	options: '=?',
	labels: '=',
	series: '=?',
	colors:'=',
	data: '=',
	width: '@',
	height: '@'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-bar-chart/uiBarChart.html',

// #---------------------------------------# //
// #---- Component (cmpt-ui-bar-chart) ----# //
controller: function ($scope, stringSvc) {


	if($scope.options == null) {$scope.options = {};}
	if($scope.series == null) {$scope.series = [];}

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

// #-- END Component (cmpt-ui-bar-chart) --# //
// #---------------------------------------# //
};});}());
