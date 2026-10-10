(function() {'use strict';angular.module('aesop')
.directive('cmptReportsReportWriterActions', function () {return {

// directive options
restrict: 'E',
scope: {
	reportConfig: '='
},
replace: true,
templateUrl: '/components/reports/cmpt-reports-report-writer-actions/reportsReportWriterActions.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-reports-report-writer-actions) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		reportConfig: {}
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'RunWithNewFilters',
		'RunWithSavedFilters',
		'Edit',
		'Delete',
		'UseAsTemplate'
	]);

	$scope.$watch('reportConfig', function (config) {
		vm.reportConfig = config;
	}, true);
}

// #-- END Component (cmpt-reports-report-writer-actions) --# //
// #--------------------------------------------------------# //
};});}());