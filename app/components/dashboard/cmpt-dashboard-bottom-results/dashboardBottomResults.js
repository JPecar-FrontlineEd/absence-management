(function() {'use strict';angular.module('aesop')
.directive('cmptDashboardBottomResults', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/dashboard/cmpt-dashboard-bottom-results/dashboardBottomResults.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-dashboard-bottom-results) ----# //
controller: function ($scope, $timeout, $filter,stringSvc, permissionSvc, orgSvc, absenceRequestApi, institutionSvc, dailyReportSvc) {

	var	resultsTimer, lastRequest;

	// Shared View Model
	var dash = $scope.dash = $scope.route.vm;

	// View Model properties
	var vm = $scope.vm = {
		loading: false,
		sectionLabel: {
			unfilled: 'Dashboard.Header.Unfilled.Label',
			filled: 'Dashboard.Header.Filled.Label',
			nosub: 'Dashboard.Header.NoSubRequired'
		},
		noDataLabel: {
			unfilled: 'DR.Tab.Unfilled.NoRecord',
			filled: 'DR.Tab.Filled.NoRecord',
			nosub: 'DR.Tab.NoSub.NoRecord'
		},
		rawData: [],
		data: {
			unfilled: [],
			filled: [],
			nosub: []
		},
		columns: {
			unfilled: getUnfilledCols(),
			filled: getFilledCols(),
			nosub: getNoSubCols()
		},
		noDataMessage: ''
	};


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Dashboard.Header.Unfilled.Label',
		'Dashboard.Header.Filled.Label',
		'Dashboard.Header.NoSubRequired',
		'DR.Tab.Unfilled.NoRecord',
		'DR.Tab.Filled.NoRecord',
		'DR.Tab.NoSub.NoRecord',
		'Name',
		'School',
		'Reason',
		'Shift',
		'Substitute',
		'DR.Tab.Table.Header.Text.Codes',
		'Vacancy',
		'Absence'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {};



	orgSvc.ready.then(function (orgData) {
		if (orgData[0].settings.usesAbsenceApproval) {
			vm.columns.unfilled.splice(5, 0, dailyReportSvc.getConfig('approval'));
			vm.columns.unfilled[1].width = '4';

			vm.columns.filled.splice(5, 0, dailyReportSvc.getConfig('approval'));
			vm.columns.filled[3].width = '3';

			vm.columns.nosub.splice(5, 0, dailyReportSvc.getConfig('approval'));
			vm.columns.nosub[1].width = '6';
		}

		var canViewBudgetCode = permissionSvc.iHave('ABSR.DTLSBDCD') && orgData[0].settings.showDailyReportBudgetCode;
		var canViewPayCode = permissionSvc.iHave('ABSR.DTLSPYCD') && orgData[0].settings.showDailyReportPayCode;
		if(canViewPayCode || canViewBudgetCode){
			vm.columns.filled.splice(7, 0, dailyReportSvc.getConfig('code', { width: '4' }));
			vm.columns.filled[5].width = '1';
			vm.columns.nosub.splice(7, 0, dailyReportSvc.getConfig('code'));
			vm.columns.nosub[2].width = '4';
		}
	});

	$scope.$watchGroup(['dash.fTypeVacancy','dash.fTypeAbsence'], filterResults);
	$scope.$watchCollection('dash.institution', filterResults);
	$scope.$watchCollection('dash.workerType', filterResults);

	$scope.$watch('dash.filterDate.toString()', function (newDate, oldDate) {
		fetchResults();
	});

	function getUnfilledCols(){
		return [dailyReportSvc.getConfig('confirmation'),
				dailyReportSvc.getConfig('worker') ,
				dailyReportSvc.getConfig('institution'),
				dailyReportSvc.getConfig('reason'),
				dailyReportSvc.getConfig('shift'),
				dailyReportSvc.getConfig('created'),
				dailyReportSvc.getConfig('held')];
	}

	function getFilledCols () {
		return [dailyReportSvc.getConfig('confirmation'),
				dailyReportSvc.getConfig('worker', { width: '4' }),
				dailyReportSvc.getConfig('institution', { width: '4' }),
				dailyReportSvc.getConfig('reason'),
				dailyReportSvc.getConfig('shift'),
				dailyReportSvc.getConfig('substitute'),
				dailyReportSvc.getConfig('created', { width: '3' })];
	}

	function getNoSubCols () {
		return [dailyReportSvc.getConfig('confirmation'),
				dailyReportSvc.getConfig('worker', { width: '7' }),
				dailyReportSvc.getConfig('institution', { width: '7' }),
				dailyReportSvc.getConfig('reason'),
				dailyReportSvc.getConfig('shift'),
				dailyReportSvc.getConfig('created', { width: '2' })];
	}

	function instOverlap (list1, list2) {
		var i = list1.length,
			instId;

		for (; i-- ;) {
			instId = list1[i];
			if (list2.indexOf(instId) !== -1) { return true; }
		}

		return false;
	}

	function filterResults() {
		Object.keys(vm.data).forEach(function (section) {
			var sectionData = vm.data[section],
				i = sectionData.length,
				instChildren = (dash.institution != null) ? institutionSvc.getInstAndChildrenIds(dash.institution[0]) : [],
				count = 0,
				row;

			for (; i-- ;) {
				row = sectionData[i];

				// hide if this is a vacancy and they not selected
				if (!dash.fTypeVacancy && row.isVacancy) {
					row.hidden = true;

				// hide if this is an absences and they not selected
				} else if (!dash.fTypeAbsence && !row.isVacancy) {
					row.hidden = true;

				// hide if this does not belong to an institution that is not selected
				} else if (dash.institution != null && dash.institution.length && !instOverlap(row.institutionIds, instChildren) && !row.allItinerantAbsences) {
					row.hidden = true;

				// hide if the worker type for this row does not match what is selected
				} else if (dash.workerType != null && dash.workerType.length && dash.workerType.indexOf(row.workerTypeId) === -1) {
					row.hidden = true;

				// SHOW IT! YAY!
				} else {
					row.hidden = false;
					count += 1;
				}
			}

			dash.counts[section] = count;
		});
	}

	function processResults(data) {
		if (lastRequest.$aborted) { return; }
		vm.data.filled = [];
		vm.data.unfilled = [];
		vm.data.nosub = [];
		data.forEach(function (row, i, a) {
			var section = dailyReportSvc.absrType(row);
			var obj = dailyReportSvc.processColumnData(row);

			// dashboard specific
			obj.isVacancy = row.worker.isVacancy;
			obj.workerTypeId = row.worker.workerType.id;

			vm.data[section].push(obj);
		});
		dash.counts.filled = vm.data.filled.length;
		dash.counts.unfilled = vm.data.unfilled.length;
		dash.counts.nosub = vm.data.nosub.length;
		vm.loading = false;
		filterResults();
	}

	function fetchResults() {
		var delay = (resultsTimer == null) ? 0 : 200;

		// cancel the previous request and reset timer
		$timeout.cancel(resultsTimer);
		if (lastRequest && lastRequest.$abort) { lastRequest.$abort(); }

		resultsTimer = $timeout(function () {
			vm.loading = true;
			lastRequest = absenceRequestApi
				.dailyReport({
					startDate: dash.filterDate.toString('MM/dd/yyyy'),
					includeDeleted: false,
					includeClosed: false,
					includeAllDateAbsences: false,
					//includeAllInstAbsences is needed to display itinerant absences on the DR
            		//We do not show itinerant absences anywhere else so this param on the endpoint solves that
					includeAllInstAbsences: permissionSvc.iHave('ABSRMLOC.MultiSchoolAbsences'),
					includeDenied: false,
					useAlwaysOnDb: (window.siteConfig.useAlwaysOnDb === 'on'),
					fields: '(' +
						'id,startDate,endDate,requiresApproval,isApproved,isDenied,isPartiallyApproved,heldPastFulfillmentCutoff,isHeld,heldUntil,created,needSub,isCancelled,isClosed,' +
						'substitute(id,firstName,lastName),' +
						'worker(id,isVacancy,firstName,middleName,lastName,title,workerType(id),institution),' +
						'absences(date,institution(id),entitlement(name),shiftType,substituteShiftType,budgetCode(description),payCode(description),absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,vacancyBreakDuration,absenceBreakDuration)' +
						'closedDayAbsences(date,institution(id),entitlement(name),shiftType,substituteShiftType,budgetCode(description),payCode(description))' +
					')'
				});

			lastRequest.then(processResults);

		}, delay);
	}
}

// #-- END Component (cmpt-dashboard-bottom-results) --# //
// #---------------------------------------------------# //
};});}());
