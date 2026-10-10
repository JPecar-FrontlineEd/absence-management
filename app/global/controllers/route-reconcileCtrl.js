(function() {'use strict';angular.module('aesop')
.controller('ReconcileCtrl', function ($q, $filter, stringSvc, toastHelp, reportHelp, absenceRequestApi, locationHelp, permissionSvc, orgSvc) {
// #-----------------------------# //
// #------- ReconcileCtrl -------# //

	// this is a route controller
	var route = this,
		parseDateFilter = $filter('parseDate');


	route.strings = stringSvc.getStrings([
		'Reconciliation.Page.Header.Title',
		'Reconciliation.Hint.Header',
		'Reconciliaiton.Hint.Details.Text.Part1',
		'Reconciliaiton.Hint.Details.Text.Details',
		'Reconciliation.Hint.Details.Text.Part2',
		'Reconciliation.Hint.Details.Text.Part3',
		'Reconciliation.Hint.Details.Text.Reconciliation',
		'Reconciliation.Hint.Details.Text.Unreconcile',
		'And',
		'Reconciliation.Hint.Details.Text.Modify',
		'Reconciliation.Hint.Detials.Text.Part4',
		'Reconciliation.Footer.Text.TotalEvents',
		'Reconcile',
		'Date',
		'Reconciliation.Header.Text.ReconciledSummary',
		'Reconciliation.Header.Text.NotReconcilied'
	]);


	var now = new Date(),
		orgSettings = orgSvc.getOrgData()[0].settings,
		daysToReconcile = 30,
		startDate = new Date(now.setDate(now.getDate()-daysToReconcile)),
		endDate = new Date(),
		futureDate= new Date(),
		futureDaysToReconcile = (orgSettings.canReconcileFutureAbsences) ? reportHelp.LeapYearCheck(new Date(futureDate.setDate(futureDate.getDate()+365)))-1 :0,
		archiveDate = orgSvc.getOrgData()[0].absenceRequestArchiveDate;
		
	// View Model properties
	route.vm = {
		filters: {
			dateRange:{startDate: null, endDate: null},
			filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
			institutions:[],
			institutionsMultiple: false,
			maxDate: endDate,
		},
		validation:{

		},
		isLoading:false,
		dataLoaded:false,
		dataset: [],
		summary: {
			reconciled: 0,
			total: 0
		},
		returnDate: null
	};
	
	// change startDate to the correct "PAST" date if this user is not allowed to reconcile in the past
	if (!permissionSvc.iHave('ABSRPAST.APPROVE')) {
		route.vm.filters.minDate = new Date(orgSettings.PastAbsenceDateTime);
		if (startDate < route.vm.filters.minDate) {
			startDate = new Date(route.vm.filters.minDate.getTime());
		}
	}
	//Set minimum start date  in calendar to absence Request archive date as a default setting
	else{
		route.vm.filters.minDate = (archiveDate != null) ? new Date(archiveDate) : null;
	}
	//change endDate to the correct "FUTURE" date if this user is allowed to reconcile future dates
	if (orgSettings.canReconcileFutureAbsences) {
		var maxDate= new Date();
		route.vm.filters.maxDate = new Date (maxDate.setDate(maxDate.getDate() + futureDaysToReconcile));
	}
	
	function defaultDate() {
		route.vm.filters.dateRange.startDate = startDate;
		route.vm.filters.dateRange.endDate = endDate;
	}

	function processResults(data) {
		var dayIndex = {},
			absences = [],
			i = data.length;

		route.vm.summary.total = 0;
		route.vm.summary.reconciled = 0;

		for (; i-- ;) {
			absences = absences.concat(
				data[i].absences.filter(function (a) { return a.canReconciled; })
			);
		}

		route.vm.dataset = (function () {
			var startDate = new Date(route.vm.filters.dateRange.startDate),
				endDate = new Date(route.vm.filters.dateRange.endDate),
				curDate = new Date(startDate.getTime()),
				day, curWeek = {expanded: false},
				weeks = [];

			for (; curDate.getTime() <= endDate.getTime(); curDate.setDate(curDate.getDate() + 1)) {
				if (curWeek.start == null) {
					curWeek.start = new Date(curDate.getTime());
					curWeek.dates = [];
					curWeek.total = 0;
					curWeek.reconciled = 0;
				}

				day = {
					date: $filter('date')(curDate, 'fullDate'),
					total: 0,
					reconciled: 0,
					week: curWeek
				};
				dayIndex[day.date] = day;
				curWeek.dates.push(day);

				if (curDate.getDay() === 6 || curDate.toString() === endDate.toString()) {
					curWeek.end = new Date(curDate.getTime());
					if (route.vm.returnDate != null && reportHelp.IsBetween(route.vm.returnDate, curWeek.start, curWeek.end)) {
						curWeek.expanded = true;
					}
					weeks.push(curWeek);
					curWeek = {expanded: false};
				}
			}

			if (route.vm.returnDate === null) {
				weeks[weeks.length-1].expanded = true;
			}

			return weeks;
		}());

		absences.forEach(function(d) {
			var day = dayIndex[parseDateFilter(d.date, 'fullDate')];

			day.total += 1;
			day.week.total += 1;
			route.vm.summary.total += 1;

			if (d.isReconciled) {
				day.reconciled += 1;
				day.week.reconciled += 1;
				route.vm.summary.reconciled += 1;
			}
		});

		route.vm.dataset.forEach(function (week) {
			var percent = Math.round((week.reconciled / week.total) * 100);
			week.progressStyles = {
				backgroundColor: (percent > 50 ? '#2d7b50' : '#CC9900'),
				transform: 'translateX(-' + (100 - percent) + '%)'
			};
		});
	}

	// Actions that can be bound to from the view
	route.go = {
		callToServer: function () {
			if(!route.vm.isLoading){
				var _defer = $q.defer();

				toastHelp.clear();

				route.vm.isLoading = true;
				route.vm.dataLoaded = false;

				route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
				route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');

				var filter = reportHelp.convertAbsenceRequestFilter(route.vm.filters);
				angular.extend(filter, {
					fields: 'absences(date,isReconciled,canReconciled)',
					includeDenied: false,
					includeDeletedWorkers: false,
					includeReconciled: true,
					includeNotReconciled: true,
					includeAllDateAbsences: false,
					forReconciliation: true
				});

				absenceRequestApi.get(filter).then(function (data){
					processResults(data);
					route.vm.isLoading = false;
					route.vm.dataLoaded = true;
					_defer.resolve();
				},function(reasons){
					route.vm.isLoading = false;
					toastHelp.error(reasons.$messages, 'Error');
					_defer.resolve();
				});
				return _defer.promise;
			}
		},
		details: function (date, showReconciled) {
			if (showReconciled == null) { showReconciled = false; }
			var filters = route.vm.filters;
			filters.dateRange.startDate = filters.dateRange.endDate = new Date(date);
			filters.state = showReconciled ? 'includeReconciled' : 'includeNotReconciled';
			locationHelp.redirect('/abs-mgt/absences/reconcile/details', route.vm.filters);
		}
	};

	if (locationHelp.hasSearch()) {
		locationHelp.parseSearch(route.vm.filters);
		route.vm.returnDate = parseDateFilter(route.vm.filters.dateRange.startDate,'MM/dd/yyyy');
		if (!reportHelp.IsBetween(route.vm.filters.dateRange.endDate, startDate, endDate)
			  && !reportHelp.IsAfter(archiveDate,route.vm.filters.dateRange.endDate)
			  && !reportHelp.IsAfter(archiveDate,route.vm.filters.dateRange.startDate)) 
	       {
			route.vm.filters.dateRange.startDate = parseDateFilter(startDate, 'MM/dd/yyyy');
			if (reportHelp.DayDiff(Date.parse(route.vm.filters.dateRange.startDate), Date.parse(route.vm.filters.dateRange.endDate)) < 0) {
				var newStart = Date.parse(route.vm.filters.dateRange.endDate);
				route.vm.filters.dateRange.startDate = new Date(newStart.setDate(newStart.getDate()-daysToReconcile));
			} 
			if(orgSettings.canReconcileFutureAbsences)
			{    // If user makes any changes in dates using the URL, he can't go beyond maxDate
				if(reportHelp.DayDiff(Date.parse(route.vm.filters.dateRange.endDate),Date.parse(route.vm.filters.maxDate))<0)
				{
					route.vm.filters.dateRange.endDate = route.vm.filters.maxDate;
				}
				// If user comes back to Reconcillation summary page with date range more than 365, reset the end date.
				if(reportHelp.DayDiff(Date.parse(route.vm.filters.dateRange.startDate),Date.parse(route.vm.filters.dateRange.endDate))>= futureDaysToReconcile)
				{   var newEndDate = Date.parse(route.vm.filters.dateRange.startDate);
					route.vm.filters.dateRange.endDate = new Date(newEndDate.setDate(newEndDate.getDate() + futureDaysToReconcile));
				}
		    }
		} else {
			defaultDate();
		}
	} else {
		defaultDate();
	}

	route.go.callToServer();

// #----- END ReconcileCtrl -----# //
});}());
