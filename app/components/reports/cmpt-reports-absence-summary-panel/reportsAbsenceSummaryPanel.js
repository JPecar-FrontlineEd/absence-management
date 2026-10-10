(function() {'use strict';angular.module('aesop')
.directive('cmptReportsAbsenceSummaryPanel', function () {return {

// directive options
restrict: 'E',
scope: {
	noNeedSub: '=?',
	unfilled: '=?',
	filled: '=?'
},
replace: true,
transclude:true,
templateUrl: '/components/reports/cmpt-reports-absence-summary-panel/reportsAbsenceSummaryPanel.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-reports-absence-summary-panel) ----# //
controller: function ($scope, stringSvc) {

	if ($scope.noNeedSub == null) { $scope.noNeedSub = 0; }
	if ($scope.unfilled == null) { $scope.unfilled = 0; }
	if ($scope.filled == null) { $scope.filled = 0; }

	// View Model properties
	var vm = $scope.vm = {
		hasData: false,
		colors: [ '#26A26A', '#D6AD6A', '#8A8A8A'],
		graphData: [],
		labels:[],
		options: {
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						beginAtZero: true,   // minimum value will be 0.
						callback: function(value) {
							if (Math.floor(value) === value) {
								return value;
							}
						}
					}
				}]
			}
		}
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'DR.Summar.Legend.Header.ReadingTheReport',
		'DR.Summary.Graph.Text.NoAbsencesOrVacancies',
		'DR.Summary.Legend.Text.NoFillNeeded',
		'Unfilled',
		'DR.Summary.Legend.Text.Filled'
	]);


	vm.labels = [ strings['DR.Summary.Legend.Text.Filled'],
 								strings['Unfilled'],
								strings['DR.Summary.Legend.Text.NoFillNeeded'] ]

	$scope.$watchGroup(['noNeedSub','unfilled','filled'], function () {
		vm.hasData = ($scope.noNeedSub + $scope.unfilled + $scope.filled) > 0;
		vm.graphData = [$scope.filled, $scope.unfilled, $scope.noNeedSub];
	});

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};
}

// #-- END Component (cmpt-reports-absence-summary-panel) --# //
// #--------------------------------------------------------# //
};});}());
