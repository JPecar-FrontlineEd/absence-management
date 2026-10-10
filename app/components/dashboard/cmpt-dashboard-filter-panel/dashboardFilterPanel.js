(function() {'use strict';angular.module('aesop')
.directive('cmptDashboardFilterPanel', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/dashboard/cmpt-dashboard-filter-panel/dashboardFilterPanel.html',

// #-------------------------------------------------# //
// #---- Component (cmpt-dashboard-filter-panel) ----# //
controller: function ($scope, scrollHelp, stringSvc, institutionSvc, workerTypeSvc, $location) {

	var leftValues = {
			unfilled: 106,
			filled: 232,
			nosub: 358
		},
		lockedHeader = false;

	// Shared View Model
	var dash = $scope.dash = $scope.route.vm;

	// View Model properties
	var vm = $scope.vm = {
		instList: [],
		workerTypeList: [],
		employeeType: [],
		arrowLeft: leftValues[dash.activeSection],
		absenceVacancySelected: 'both',
	};
	calcLeft();

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Dashboard.Header.SummaryFor.Label',
		'Absences',
		'Vacancies',
		'Schools',
		'Both',
		'Dashboard.Filter.Schools.AllSchools',
		'EmployeeTypes',
		'Dashboard.WorkerTypes.Label.AllTypes',
		'Dashboard.Header.Total.Label',
		'Dashboard.Header.Unfilled.Label',
		'Dashboard.Header.Filled.Label',
		'Dashboard.Header.NoSubRequired',
		'Dashboard.MiniControl.Button.DailyReport',
		'Dashboard.Header.Print.Label'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		checkIfActive: function (check) {
			return dash.activeSection === check;
		},
		activate: function (section) {
			dash.activeSection = section;
			calcLeft();
		},
		getAbsencePercent: function (part) {
			if (part === 0) { return 0; }
			var percentage = ((part / (dash.counts.filled + dash.counts.unfilled)) * 100);
			return percentage.toFixed(1);
		},
		setAbsenceVacancy: function () {
			if (dash.fTypeVacancy && dash.fTypeAbsence) {
				vm.absenceVacancySelected = 'both';
			} else if (dash.fTypeAbsence) {
				vm.absenceVacancySelected = 'absences';
			} else {
				vm.absenceVacancySelected = 'vacancies';
			}
		},
		dailyreport: function(){
			$location.path('/abs-mgt/reports/absence/daily-report').search({ date: dash.filterDate.toString('MM/dd/yyyy') });
		}
	};

	function updateNumbers() {
		dash.totalCount = dash.counts.filled + dash.counts.unfilled + dash.counts.nosub;
		dash.percents.filled = go.getAbsencePercent(dash.counts.filled);
		dash.percents.unfilled = go.getAbsencePercent(dash.counts.unfilled);
	}

	updateNumbers();
	$scope.$watchCollection('dash.counts', function () {
		updateNumbers();
		// results have changed and we are down the page far enough to trigger
		// the locked header, take us to the top of the filters panel
		if (lockedHeader) { scrollHelp.scrollTo('dashboard-lock-header'); }
	});

	$scope.$watch('vm.absenceVacancySelected', function (val) {
		val = val.toLowerCase();
		dash.fTypeVacancy = (val === 'both' || val === 'vacancies');
		dash.fTypeAbsence = (val === 'both' || val === 'absences');
	});

	$scope.$watch('dash.fTypeVacancy', function (val) {
		if (!val && !dash.fTypeAbsence) { dash.fTypeAbsence = true; }
		go.setAbsenceVacancy();
	});

	$scope.$watch('dash.fTypeAbsence', function (val) {
		if (!val && !dash.fTypeVacancy) { dash.fTypeVacancy = true; }
		go.setAbsenceVacancy();
	});

	function ambientReact(eventName) {
		lockedHeader = (eventName === 'enter');
		calcLeft();
		$scope.$root.safeApply();
	}
	ambient.on('enter leave', 'dashboard-locked', ambientReact);
	$scope.$on('$destroy', function () {
		ambient.off('enter leave', 'dashboard-locked', ambientReact);
	});

	function calcLeft() {
		vm.arrowLeft = ((leftValues[dash.activeSection]-leftValues.unfilled) * (lockedHeader ? 0.61 : 1)) + leftValues.unfilled;
	}

	function buildInstMultiSelectData(node, nestLevel) {
		var i, len;

		if (node.isAvailable) {
			vm.instList.push({
				id: node.id,
				value: node.name,
				enabled: node.isAvailable,
				nestLevel: nestLevel
			});
		}

		if (node.children && node.children.length) {
			i = 0;
			len = node.children.length;
			for (; i < len; i++) {
				buildInstMultiSelectData(node.children[i], nestLevel + 1);
			}
		}
	}

	institutionSvc.getTreeData().then(function (tree) {
		vm.instList = [];
		buildInstMultiSelectData(tree, 0);
	});

	workerTypeSvc.ready.then(function (data) {
		vm.workerTypeList = data.map(function (v, i, a) {
			return {
				id: v.id,
				value: v.title,
				enabled: true
			};
		}).sort(function (a, b) {
			if (a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
			if (a.value.toLowerCase() > b.value.toLowerCase()) { return 1; }
			return 0;
		});
	});
}

// #-- END Component (cmpt-dashboard-filter-panel) --# //
// #-------------------------------------------------# //
};});}());