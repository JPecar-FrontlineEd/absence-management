(function() {'use strict';angular.module('aesop')
.directive('cmptReportsStaffListSummaryPanel', function () {return {

// directive options
restrict: 'E',
scope: {
	employeeData: '=',
	vacancyData: '='
},
replace: true,
templateUrl: '/components/reports/cmpt-reports-staff-list-summary-panel/reportsStaffListSummaryPanel.html',

// #-----------------------------------------------------------# //
// #---- Component (cmpt-reports-staff-list-summary-panel) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		hasEmployeeData: false,
		hasVacancyData: false,
		colors: {
			total: '#236b8e',
			subRequired: '#666',
			active: '#2d7b50',
			itinerant: '#c90'
		},
		employeeGraphData: [],
		vacancyGraphData: [],
		legendData: [],
		titleHovered: ''
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'DR.Summar.Legend.Header.ReadingTheReport',
		'DR.Summary.Graph.Text.NoAbsencesOrVacancies'
	]);

	var itemData = vm.legendData = [{
		title: 'total',
		label: 'Total'
	}, {
		title: 'active',
		label: 'Active'
	}, {
		title: 'subRequired',
		label: 'Sub Required'
	}, {
		title: 'itinerant',
		label: 'Itinerant'
	}];

	$scope.$watchGroup(['employeeData','vacancyData'], function () {
		vm.hasEmployeeData = false;
		vm.hasVacancyData = false;

		vm.employeeGraphData = [];
		vm.vacancyGraphData = [];

		if ($scope.employeeData == null) { $scope.employeeData = {}; }
		if ($scope.vacancyData == null) { $scope.vacancyData = {}; }

		// stabilize data
		itemData.forEach(function (item) {
			var key = item.title,
				label = item.label;

			if ($scope.employeeData[key] == null) { $scope.employeeData[key] = 0; }
			if ($scope.vacancyData[key] == null) { $scope.vacancyData[key] = 0; }

			if ($scope.employeeData[key] > 0 && !vm.hasEmployeeData) { vm.hasEmployeeData = true; }
			if ($scope.vacancyData[key] > 0 && !vm.hasVacancyData) { vm.hasVacancyData = true; }

			vm.employeeGraphData.push({
				title: key,
				value: $scope.employeeData[key],
				label: label
			});
			vm.vacancyGraphData.push({
				title: key,
				value: $scope.vacancyData[key],
				label: label
			});
		});

	});

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};
}

// #-- END Component (cmpt-reports-staff-list-summary-panel) --# //
// #-----------------------------------------------------------# //
};});}());