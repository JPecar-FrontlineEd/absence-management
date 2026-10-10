(function() {'use strict';angular.module('aesop')
.directive('cmptReportsMonthlySummary', function () {return {

// directive options
restrict: 'E',
scope: {
	month: '=',
	year: '=',
	dataset: '=',
	searchPerformed: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/reports/cmpt-reports-monthly-summary/reportsMonthlySummary.html',

// #--------------------------------------------------# //
// #---- Component (cmpt-reports-monthly-summary) ----# //
controller: function ($scope, stringSvc, orgSvc, stringHelp, parseDateFilter, parseAesopDateFilter) {

	if ($scope.searchPerformed == null) { $scope.searchPerformed = false; }

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Reports.AbsMonSum.Label.Total',
		'Reports.AbsMonSum.Label.FillNOTNeeded',
		'Reports.AbsMonSum.Label.FillNeeded',
		'Reports.AbsMonSum.Label.Filled',
		'Reports.AbsMonSum.Label.UnFilled',
		'Reports.AbsMonSum.Label.Held',
		'Reports.AbsMonSum.Label.FillRate',
		'Reports.AbsMonSum.Text.RequestedArchivedData1',
		'Reports.AbsMonSum.Text.RequestedArchivedData2',
		'Reports.AbsMonSum.Text.RequestedArchivedData3',
		'Table.Label.MonthlyTotal'
	]);

	// View Model properties
	var vm = $scope.vm = {
		columns: getColumns(),
		weekColumns: getWeekColumns(),
		weeks: [],
		weekStats: [],
		weekSummary: [],
		dayGroupedData: {},
		archiveDate: '',
		archiveDateMessage1: '',
		archiveDateMessage2: '',
		archiveDateMessage3: ''
	};

	//generate the archive messaging
	var orgData = orgSvc.getOrgData();
	vm.archiveDate = parseAesopDateFilter(orgData[0].absenceRequestArchiveDate);

	vm.archiveDateMessage1 = strings['Reports.AbsMonSum.Text.RequestedArchivedData1'];
	vm.archiveDateMessage2 = stringHelp.replace(strings['Reports.AbsMonSum.Text.RequestedArchivedData2'], '{0}', vm.archiveDate);
	vm.archiveDateMessage3 = strings['Reports.AbsMonSum.Text.RequestedArchivedData3'];

	function getColumns() {
		return [{
			key: 'sunday', width: '4/24',
			name: 'Sunday',
			cls: 'weekendHeader',
			sortable: false,
            template: getDayTemplateHtml(0)
		},{
			key: 'monday', width: '4/24',
			name: 'Monday',
			cls: 'weekdayHeader',
			sortable: false,
            template: getDayTemplateHtml(1)
		},{
			key: 'tuesday', width: '3/24',
			name: 'Tuesday',
			cls: 'weekdayHeader',
			sortable: false,
            template: getDayTemplateHtml(2)
		},{
			key: 'wednesday', width: '3/24',
			name: 'Wednesday',
			cls: 'weekdayHeader',
			sortable: false,
            template: getDayTemplateHtml(3)
		},{
			key: 'thursday', width: '3/24',
			name: 'Thursday',
			cls: 'weekdayHeader',
			sortable: false,
            template: getDayTemplateHtml(4)
		},{
			key: 'friday', width: '3/24',
			name: 'Friday',
			cls: 'weekdayHeader',
			sortable: false,
            template: getDayTemplateHtml(5)
		},{
			key: 'saturday', width: '4/24',
			name: 'Saturday',
			cls: 'weekendHeader',
			sortable: false,
            template: getDayTemplateHtml(6)
		}];
	}

	function getDayTemplateHtml(index) {
		return '<div class="summaryDay" ng-class="{\'today\': row.days['+index+'].currDay, \'weekend\': row.days['+index+'].isWeekend, \'other-month\': !row.days['+index+'].inMonth}">' +
				'<div class="day">{{row.days['+index+'].number}}</div>' +
	    			'<div ng-if="row.days['+index+'] != null && Object.keys(row.days['+index+'].groupedData).length !== 0 && row.days['+index+'].groupedData.total > 0" ' +
	    			  'ng-init="dayData=row.days['+index+'].groupedData">' +
		    				'<div class="total highlight"><div class="label">'+strings['Reports.AbsMonSum.Label.Total']+'</div> <div class="data">{{dayData.total}}</div></div>' +
		    				'<div class="group"><div class="label">'+strings['Reports.AbsMonSum.Label.FillNOTNeeded']+'</div> <div class="data">{{dayData.fillNotNeeded}}</div></div>' +
		    				'<div class="group"><div class="label">'+strings['Reports.AbsMonSum.Label.FillNeeded']+'</div> <div class="data">{{dayData.fillNeeded}}</div></div>' +
		    				'<div class="group"><div class="label">'+strings['Reports.AbsMonSum.Label.Filled']+'</div> <div class="data">{{dayData.filled}}</div></div>' +
		    				'<div class="group"><div class="label">'+strings['Reports.AbsMonSum.Label.UnFilled']+'</div> <div class="data">{{dayData.unfilled}}</div></div>' +
		    				'<div class="group"><div class="label">'+strings['Reports.AbsMonSum.Label.Held']+'</div> <div class="data">{{dayData.held}}</div></div>' +
		    				'<div class="group highlight"><div class="label">'+strings['Reports.AbsMonSum.Label.FillRate']+'</div> <div class="data">{{dayData.fillRate}}</div></div>' +
	    			'</div>' +
	    		'</div>';
	}

	//Build grouped data structure from data
	$scope.$watchCollection('dataset', function (data) {
		var orgData = orgSvc.getOrgData();
		if (new Date($scope.year, $scope.month-1, 1) < new Date(orgData[0].absenceRequestArchiveDate)) {
			vm.weeks = [];
			vm.weekStats = [];
			vm.weekSummary = [];
			vm.dayGroupedData = {};
		} else if ($scope.searchPerformed) {
			vm.dayGroupedData = {};
			//group all of the day data
			if (data.length > 0 && Object.keys(data[0]).length !== 0)
			{
				data.forEach(function (v,i,a) {
					var isHeld = v.isHeld;
					var fillNeeded = v.needSub;
					var filled = v.substitute != null;

					var absences = v.absences.filter(function (a) { return new Date(a.date) >= new Date($scope.year, $scope.month-1, 1) && new Date(a.date) < new Date($scope.year, $scope.month, 1); });
					absences.forEach(function (v,i,a) {
						var currDay = parseDateFilter(v.date, 'd');
						if (vm.dayGroupedData.hasOwnProperty(currDay)) {
							var currGroup = vm.dayGroupedData[currDay];
							currGroup.total = currGroup.total + 1;
							currGroup.fillNeeded = fillNeeded ? currGroup.fillNeeded + 1 : currGroup.fillNeeded;
							currGroup.fillNotNeeded = fillNeeded ? currGroup.fillNotNeeded : currGroup.fillNotNeeded + 1;
							currGroup.filled = filled ? currGroup.filled + 1 : currGroup.filled;
							currGroup.held = isHeld ? currGroup.held + 1 : currGroup.held;
							currGroup.unfilled = getUnfilled(currGroup.fillNeeded, currGroup.filled, currGroup.held);
							currGroup.fillRate = getFillRate(currGroup.total, currGroup.fillNeeded, currGroup.filled);
							vm.dayGroupedData[currDay] = currGroup;
						}
						else {
							vm.dayGroupedData[currDay] = {
								total: 1,
								fillNeeded: fillNeeded ? 1 : 0,
								fillNotNeeded: fillNeeded ? 0 : 1,
								filled: filled ? 1 : 0,
								held: isHeld ? 1 : 0,
								unfilled: getUnfilled((fillNeeded ? 1 : 0), (filled ? 1 : 0), (isHeld ? 1 : 0)),
								fillRate: getFillRate(1, (fillNeeded ? 1 : 0), (filled ? 1 : 0))
							};
						}
					});
				});
			}

			paintMonthSummary();
		}
	});

	function paintMonthSummary(){
		//group the week data
		var weeks = generateWeeks();
		var weekTotal = 0, fillNeededTotal = 0, fillNotNeededTotal = 0, filledTotal = 0, heldTotal = 0, unfilledTotal = 0;
		weeks.forEach(function (w,i,a){
			var total = 0, fillNeeded = 0, fillNotNeeded = 0, filled = 0, held = 0, unfilled = 0;
			w.days.forEach(function (d, di, da){
				if (d.groupedData != null && Object.keys(d.groupedData).length !== 0) {
					total = total + d.groupedData.total;
					fillNeeded = fillNeeded + d.groupedData.fillNeeded;
					fillNotNeeded = fillNotNeeded + d.groupedData.fillNotNeeded;
					filled = filled + d.groupedData.filled;
					held = held + d.groupedData.held;
					unfilled = unfilled + d.groupedData.unfilled;
				}
			});
			w.summaryData = {
				total: total,
				fillNeeded: fillNeeded,
				fillNotNeeded: fillNotNeeded,
				filled: filled,
				held: held,
				unfilled: unfilled,
				fillRate: getFillRate(total, fillNeeded, filled)
			};
			//sum all of the data
			weekTotal = weekTotal + total;
			fillNeededTotal = fillNeededTotal + fillNeeded;
			fillNotNeededTotal = fillNotNeededTotal + fillNotNeeded;
			filledTotal = filledTotal + filled;
			heldTotal = heldTotal + held;
			unfilledTotal = unfilledTotal + unfilled;
		});

		vm.weeks = weeks;
		vm.weekStats = angular.copy(weeks);
		vm.weekSummary = [{
			summaryData: {
				total: weekTotal,
				fillNeeded: fillNeededTotal,
				fillNotNeeded: fillNotNeededTotal,
				filled: filledTotal,
				held: heldTotal,
				unfilled: unfilledTotal,
				fillRate: getFillRate(weekTotal, fillNeededTotal, filledTotal)
			}
		}];
	}

	function getUnfilled(fillNeededCnt, filledCnt, heldCnt) {
		var unfilled = fillNeededCnt - filledCnt - heldCnt;
		if (unfilled < 0) {
			return 0;
		} else {
			return unfilled;
		}
	}
	function getFillRate(total, fillNeeded, filled) {
		if (total === 0) {
			return '0%';
		} else if (fillNeeded === 0 || filled > fillNeeded) {
			return '100%';
		} else {
			var fillRate = filled / fillNeeded;
			return (+(fillRate * 100).toFixed(2)) + '%';
			//return (Math.round(fillRate).toFixed(4) * 100) + '%';
		}
	}

	function getWeekColumns(){
		return [{
			key: 'weekRange', width: '3/24',
			name: '',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span class="weekRange">{{row.month}} {{row.startDay}}<span ng-if="row.startDay !== row.endDay">-{{row.endDay}}</span></span>' +
            				'<span class="monthTotal">'+strings['Table.Label.MonthlyTotal']+'</span>' +
            			'</div>'
		},{
			key: 'weekTotal', width: '3/24',
			name: '',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.total}}</span>' +
            			'</div>'
		},{
			key: 'weekFillNotNeeded', width: '3/24',
			name: 'Table.Header.FillNOTNeeded',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.fillNotNeeded}}</span>' +
            			'</div>'
		},{
			key: 'weekFillNeeded', width: '3/24',
			name: 'Table.Header.FillNeeded',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.fillNeeded}}</span>' +
            			'</div>'
		},{
			key: 'weekFilled', width: '3/24',
			name: 'Table.Header.Filled',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.filled}}</span>' +
            			'</div>'
		},{
			key: 'weekUnFilled', width: '3/24',
			name: 'Table.Header.Unfilled',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.unfilled}}</span>' +
            			'</div>'
		},{
			key: 'weekHeld', width: '3/24',
			name: 'Table.Header.Held',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.held}}</span>' +
            			'</div>'
		},{
			key: 'weekFillRate', width: '3/24',
			name: 'Table.Header.FillRate',
			sortable: false,
            template: '<div ng-if="row.hasOwnProperty(\'summaryData\')">' +
            				'<span>{{row.summaryData.fillRate}}</span>' +
            			'</div>'
		}];
	}

	function generateWeeks(){
		var weeks = [];
		var totalWeeks = weekCount();
		for (var i = 0; i < totalWeeks; i++) {
			weeks.push({
				weekNumber: i,
				startDay: 0,
				endDay: 0,
				month: parseDateFilter(new Date($scope.year, $scope.month-1, 1), 'MMM'),
				days: [{
					name: 'sunday',
					count: 1,
					isWeekend: true,
					inMonth: true,
					currDay: false
				},{
					name: 'monday',
					count: 1,
					isWeekend: false,
					inMonth: true,
					currDay: false
				},{
					name: 'tuesday',
					count: 1,
					isWeekend: false,
					inMonth: true,
					currDay: false
				},{
					name: 'wednesday',
					count: 1,
					isWeekend: false,
					inMonth: true,
					currDay: false
				},{
					name: 'thursday',
					count: 1,
					isWeekend: false,
					inMonth: true,
					currDay: false
				},{
					name: 'friday',
					count: 1,
					isWeekend: false,
					inMonth: true,
					currDay: false
				},{
					name: 'saturday',
					count: 1,
					isWeekend: true,
					inMonth: true,
					currDay: false
				}]
			});
		}
		weeks = populateDays(weeks);
		return weeks;
	}

	function weekCount(){
		var firstOfMonth = new Date($scope.year, $scope.month-1, 1);
	    var lastOfMonth = new Date($scope.year, $scope.month, 0);
	    var used = firstOfMonth.getDay() + lastOfMonth.getDate();
	    return Math.ceil( used / 7);
	}

	function populateDays(weeks){
		var firstOfMonth = new Date($scope.year, $scope.month-1, 1);
	    var lastOfMonth = new Date($scope.year, $scope.month, 0);
	    var calOffset = firstOfMonth.getDay();

	    for (var i = firstOfMonth.getDate(); i <= lastOfMonth.getDate(); i++) {
	    	var currDate = new Date($scope.year,$scope.month-1,i);
	    	var currWeek = ((i+calOffset)%7)===0 ? ((i+calOffset) / 7)-1 : Math.floor((i+calOffset) / 7);
	    	var dayOfWeek = currDate.getDay();
	    	var dayOfMonth = currDate.getDate();
	    	//set the first and last day of the week
	    	if (weeks[currWeek].weekNumber === currWeek && (weeks[currWeek].startDay === 0 || dayOfMonth < weeks[currWeek].startDay)) {
	    		weeks[currWeek].startDay = dayOfMonth;
	    	}
	    	if (weeks[currWeek].weekNumber === currWeek && (weeks[currWeek].endDay === 0 || dayOfMonth > weeks[currWeek].endDay)) {
	    		weeks[currWeek].endDay = dayOfMonth;
	    	}
	    	//set up the day info for the week
	    	weeks[currWeek].days[dayOfWeek].number = i;
	    	weeks[currWeek].days[dayOfWeek].dateString = parseDateFilter(currDate, 'MM/dd/yyyy');
	    	if (parseDateFilter(currDate, 'MM/dd/yyyy') === parseDateFilter(new Date(), 'MM/dd/yyyy')) {
	    		weeks[currWeek].days[dayOfWeek].currDay = true;
	    	}
	    	//--- add grouped data, if present, to the days object ---
	    	if (vm.dayGroupedData.hasOwnProperty(dayOfMonth)) {
	    		weeks[currWeek].days[dayOfWeek].groupedData = vm.dayGroupedData[dayOfMonth];
	    	} else {
	    		weeks[currWeek].days[dayOfWeek].groupedData = {};
	    	}
	    }

	    weeks = fillOutWeeks(firstOfMonth, lastOfMonth, weeks);
	    return weeks;
	}

	function fillOutWeeks(firstDayOfMonth, lastDayOfMonth, weeks) {
		var startOffset = firstDayOfMonth.getDay();
		var endOffset = lastDayOfMonth.getDay();
		var newStartDate = new Date(firstDayOfMonth);
		var newEndDate = new Date(lastDayOfMonth);
		var weekCnt = weeks.length;
		var daysInWeek = 6;

		if (startOffset > 0) {
			for (var i = 0; i < startOffset; i++) {
				newStartDate = new Date(firstDayOfMonth);
    			newStartDate.setDate(i * -1);
    			weeks[0].days[newStartDate.getDay()].number = newStartDate.getDate();
		    	weeks[0].days[newStartDate.getDay()].dateString = parseDateFilter(newStartDate, 'MM/dd/yyyy');
		    	weeks[0].days[newStartDate.getDay()].groupedData = {};
		    	weeks[0].days[newStartDate.getDay()].inMonth = false;
		    }
		}
		if (endOffset < daysInWeek) {
			for (var j = 1; j <= daysInWeek-endOffset; j++) {
				newEndDate = new Date(lastDayOfMonth);
    			newEndDate.setDate(lastDayOfMonth.getDate() + j);
    			weeks[weekCnt-1].days[newEndDate.getDay()].number = newEndDate.getDate();
		    	weeks[weekCnt-1].days[newEndDate.getDay()].dateString = parseDateFilter(newEndDate, 'MM/dd/yyyy');
		    	weeks[weekCnt-1].days[newEndDate.getDay()].groupedData = {};
		    	weeks[weekCnt-1].days[newEndDate.getDay()].inMonth = false;
			}
		}

		return weeks;
	}
}

// #-- END Component (cmpt-reports-monthly-summary) --# //
// #--------------------------------------------------# //
};});}());