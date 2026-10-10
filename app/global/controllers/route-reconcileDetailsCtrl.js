(function() {'use strict';angular.module('aesop')
.controller('ReconcileDetailsCtrl', function ($scope, $q, $timeout, stringSvc, absrSvc, permissionSvc, reconciliationSvc, orgSvc, reportHelp, toastHelp, locationHelp, arrayHelp, parseDateFilter, parseAesopDateFilter, absenceRequestApi, ngDialog, domHelp, $rootScope) {
// #---------------------------# //
// #------- ReconcileDetailsCtrl -------# //

	// this is a route controller
	var route = this;
	var resultsTimer, lastRequest;
	var orgSettings = orgSvc.getOrgData()[0].settings;
	var archiveDate =orgSvc.getOrgData()[0].absenceRequestArchiveDate;
	var futureDate =new Date();
	var futureDaysToReconcile= (orgSettings.canReconcileFutureAbsences) ? reportHelp.LeapYearCheck(new Date(futureDate.setDate(futureDate.getDate()+365)))-1 :0;

	$scope.pageStart = 1;
	$scope.maximumPages = 5;

	$scope.sortingOrder = 'name';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 50;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

	// calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
		var tempDataSet = route.vm.dataSet.filter(removeHidden);
        for (var i = 0; i < tempDataSet.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [tempDataSet[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push(tempDataSet[i]);
            }
        }
    };

	function removeHidden(value){
		return value.hidden == false || value.hidden == undefined;
	}
	$scope.range = function (start, end) {
		var pageNumbers = [];

		//Get the Pagenumber start first.
		if($scope.currentPage >= $scope.maximumPages-2 && $scope.totalPages > $scope.maximumPages) {
			$scope.pageStart = start = $scope.currentPage-2;
		} else if($scope.currentPage <= $scope.maximumPages-2) {
			$scope.pageStart = start = 0;
		}

        for (var i = start; i < end; i++) {
			pageNumbers.push(i);
        }
		//fix some css for UI
		if ($scope.pageStart >= $scope.maximumPages-2 || end == $scope.maximumPages+$scope.pageStart) {
			$('.dots').prev().css("border", "none");
		} 
        return pageNumbers;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function (selectedPage) {
		$scope.currentPage = this.n == undefined ? selectedPage : this.n;
    };


	route.strings = stringSvc.getStrings([
		'ReconciliationDetails.Header.Text.ReconciliationDetailFor',
		'Reconciliation.Page.Header.Title',
		'NoResultsFound',
		'Reconcile.Button.Text.ReconcileAll',
		'Custom',
		'Reconciliation.Dialog.Header.Text.WarningChangesNotSaved',
		'Reconciliation.Label.Text.YouAreAttemtingTo',
		'Reconciliation.Label.Text.MultipleRecordsNotSaved',
		'Absence.Button.Text.Unreconcile',
		'Dashboard.Header.Button.Reconcile',
		'Reconciliation.Button.Text.ContinueAndSave',
		'Cancel',
		'Reconcile.Button.Text.UnreconcileAll',
		'SelectPreviousDay',
		'SelectNextDay'
	]);

	// View Model properties
	route.vm = {
		filters: {
			dateRange:{startDate: null,endDate: null},
			absenceType:{includeAbsences:true, includeVacancies: permissionSvc.iHave('ABSR.VACANCY')},
			filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
			institutionList: [],
			institutions: [],
			selectedInst: [],
			absenceReasonList:[],
			absenceReasonId: null,
			budgetCodeList:[],
			budgetCodeId: null,
			accountingCodeList:[],
			accountingCodeId: null,
			states:[{value:'includeNotReconciled',title:'Not Reconciled'},{value:'includeReconciled',title:'Reconciled'}],
			state:'includeNotReconciled',
			includeAllDateAbsences: false,
			accountingCodeData: true,
			attachmentData: true
		},
		notReconcileState: true,
		validation:{
			 dateRange: function (){
				 if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,null,'employee',route.vm.filters.workers)){
					 return reportHelp.InjectValuesToResource(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'],'employee',route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate);
				 }else{
					return '';
				 }
			 }
		},
		nonSearchFilters: [
    		'institutions','institutionList', 'absenceReasonList',
    		'absenceReasonId', 'budgetCodeList','budgetCodeId',
    		'accountingCodeList','accountingCodeId','states',
    		'institutionsMultiple', 'filledStatus'
    	],
		defaultInstId: null,
		canGoToNextDay: false,
		isLoading: false,
		dataLoaded: false,
		dateText: '',
		dataSet: [],
		contexts:[],
		count:0,
		canReconcile: permissionSvc.iHave('ABSR.Approve'),
		canReconcileAll: permissionSvc.iHave('ABSR.RECONCILEALL'),
		canRequestVacancies: permissionSvc.iHave('ABSR.VACANCY'),
		canGoToPreviousDay: false,
		isDataRendered: false,
		totalRecords: 0
	};


	$scope.$watch('route.vm.filters.state', function (val) {
		var currSearch = locationHelp.currentSearch();
		route.vm.notReconcileState = val === 'includeNotReconciled' ? true : false;
		currSearch['state'] = route.vm.filters.state;
		locationHelp.updateSearch(currSearch);
		makeCallToApi();
	});

	$scope.$watch("route.vm.filters.absenceType.includeAbsences", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.absenceType.includeVacancies", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.filledStatus.includeFilled", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.filledStatus.includeUnfilled", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.filledStatus.includeNoSubRequired", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})

	$scope.$watch("route.vm.filters.absenceReasonId", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.budgetCodeId", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.accountingCodeId", function(oVal, nVal){
		if(oVal != nVal) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})
	$scope.$watch("route.vm.filters.selectedInst", function(oVal, nVal){
		if(oVal[0] != nVal[0]) {
			$scope.isReconcileTriggered = false;
			filterResults();
		}
	})

	$rootScope.$on("absenceReconcileTriggered", function () {
		$scope.isReconcileTriggered = true;
	});

	function filterResults() {
		if (!$scope.isReconcileTriggered) { 
			$scope.currentPage = 0; 
		}
		var dataSet = route.vm.dataSet,
			i = route.vm.dataSet.length,
			inst = route.vm.filters.selectedInst,
			absenceReasonId = route.vm.filters.absenceReasonId,
			budgetCodeId = route.vm.filters.budgetCodeId,
			accountingCodeId = route.vm.filters.accountingCodeId,
			includeAbsence = route.vm.filters.absenceType.includeAbsences,
			includeVacancy = route.vm.filters.absenceType.includeVacancies,
			includeFilled = route.vm.filters.filledStatus.includeFilled,
			includeUnfilled = route.vm.filters.filledStatus.includeUnfilled,
			includeNoNeedSub = route.vm.filters.filledStatus.includeNoSubRequired;
		for (; i-- ;) {
			var absr = dataSet[i];
			var absence = absr.absrVariations[0];
			if (!includeAbsence && !absr.worker.isVacancy) {
				absr.hidden = true;
			} else if (!includeVacancy && absr.worker.isVacancy) {
				absr.hidden = true;
			}else if(!includeFilled && isFilled(absr)){
				absr.hidden = true;
			}else if(!includeUnfilled && isUnfilled(absr)){
				absr.hidden = true;
			}else if(!includeNoNeedSub && isNoNeedSub(absr)){
				absr.hidden = true;
			//}else if (inst != null && absence.institution.id !== inst.id) {
			}else if (inst.length > 0 && absence.institution.id !== inst[0]) {
				absr.hidden = true;
			}else if (absenceReasonId.length > 0 && (absence.entitlementType == null || absence.entitlementType.id !== absenceReasonId[0])) {
				absr.hidden = true;
			}else if (budgetCodeId.length > 0  && (absence.budgetCode == null || absence.budgetCode.id !== budgetCodeId[0])) {
				absr.hidden = true;
			}else if (accountingCodeId.length > 0 && (absence.accountingCode == null || absence.accountingCode.id !== accountingCodeId[0])){
				absr.hidden = true;
			}else{
				absr.hidden = false;
			}
		}
		reCountAbsrs();
	}


	function reCountAbsrs () {
		var dataSet = route.vm.dataSet,
		count = 0,
		i = route.vm.dataSet.length;
		for (; i-- ;) {
			var absr = dataSet[i];
			var absence = absr.absrVariations[0];
			if(absr.hidden){
				continue;
			}else if(absence.isProcessed){
				continue;
			}else{
				count +=1;
			}
		}
		route.vm.count = count;
		route.vm.totalRecords = route.vm.count;
		$scope.totalPages = Math.ceil(route.vm.totalRecords / $scope.itemsPerPage);
		//Group dataSet items to multiple pages
		$scope.groupToPages();
	}

	function isFilled (absr) {
		if (absr.needSub && absr.substitute !== null) {
			return true;
		}else{
			return false;
		}
	}

	function isUnfilled (absr) {
		if (absr.needSub && absr.substitute === null) {
			return true;
		}else{
			return false;
		}
	}

	function isNoNeedSub (absr) {
		if (absr.needSub){
			return false;
		}else{
			return true;
		}
	}

	function processResults(data) {
		var loadPosition = 0, loadTotal = 0;
		//var allResults = [];
		var absrVals= [];
		data.map(function (absr){
            absr.absences.forEach(function (abs){
				if (abs.isReconciled !== route.vm.notReconcileState && abs.canReconciled) {
					var absrObj = angular.copy(absr);
					absrObj.absences.length = 0;
					absrObj.absences.push(abs);
					absrVals.push(absrWithContext(absrObj));
				}
			});
		});
		absrVals.sort(arrayHelp.sort('id'));
		if(absrVals.length > 0){
			loadTotal = absrVals.length;
			route.vm.isLoading = false;
			route.vm.dataLoaded = true;
			loadDataSet();
		} else {
			route.vm.isLoading = false;
			route.vm.dataLoaded = true;
			route.vm.isDataRendered = true;
		}
        
		function loadDataSet () {
			if (loadTotal > loadPosition) {
				route.vm.dataSet.push(absrVals[loadPosition]);
				loadPosition += 1;
				domHelp.rAF(loadDataSet);
			}else{
				populateFilters(absrVals);
				filterResults();
				route.vm.isDataRendered = true;
			}

			//Group dataSet items to multiple pages
			$scope.groupToPages();
		}
	}





	// Actions that can be bound to from the view
	route.go = {
		//callToServer: makeCallToApi,
		dismissAction: function (absId){
            var absrVal = route.vm.dataSet.filter(function (a){ return a.absrVariations[0].id === absId; })[0];
			var index = route.vm.dataSet.indexOf(absrVal);
			route.vm.dataSet.splice(index,1);
			reCountAbsrs();
		},
		backToSummary: function () {
			locationHelp.redirect('/abs-mgt/absences/reconcile', cleanSearchFilters(route.vm.filters));
		},
		next: function () {
			updateDate(1);
		},
		prev: function () {
			updateDate(-1);
		},
		reconcileAll: reconcileAll,
		//save function being passed down into child components
		//post processing handled in those componenents
		//just responsible for saving an absence
		save: save,
		reCountAbsrs: reCountAbsrs
	};

	function reconcileAll () {
		reconciliationSvc.reconcileAllDialog(route.vm.dataSet, route.vm.notReconcileState).then(function (){
			reCountAbsrs();
		});
	}

	angular.element(document).ready(function () {
		fetchInitialResults();
	});

	//save function being passed down into child components
	//post processing handled in those componenents
	//just responsible for saving an absence
	function save(absrId, absenceId){
		var _defer = $q.defer();

		var absrs = route.vm.dataSet.filter(function(a) { return a.id === absrId; });
		var absrVal = absrs.filter(function(a) { return a.absrVariations[0].absences[0].id === absenceId; })[0];
		var fullAbsenceObj = absrVal.absrVariations[0].absences[0];

		absrVal.reconcileMode = true;
		absrVal.errors.length = 0;
		absrVal.warnings.length = 0;
		absrSvc.saveAbsence(absrVal,null)
		.then(
			function (absrData){
				//update absr last update for all matching absrs
				absrs.forEach(function (absr){
					absr.lastUpdated = absrData.lastUpdated;
					absr.dbLastUpdatedTimeStamp = absrData.dbLastUpdatedTimeStamp;
				});
				//update last update for curr absence
				var newAbsence = absrData.absences.filter(function(a) { return a.id === fullAbsenceObj.id; })[0];
				absrVal.absrVariations[0].absences[0] = newAbsence;
				reCountAbsrs();
				populateFilters(route.vm.dataSet);
				return _defer.resolve(absrData);
			},
			function (rejectData){
				if (rejectData != null) {
					// Seperate out the save failure from save absence.
					rejectData.rejectData.$messages.forEach(function (m) { m.key = 0; });
					// pass reconcile flag
					absrSvc.saveFailure(absrVal,rejectData.rejectData, true);

					if(rejectData.warnings.length > 0){
						reconciliationSvc.refreshAbsr(absrId).then(function(absr){
							absrs.forEach(function (a) {
								var absrVal = reconciliationSvc.createAbsrVal(absr, a.absrVariations[0].id);
								reconciliationSvc.replaceWithUpdatedAbsr(route.vm.dataSet, absrVal);
							});
                            reconciliationSvc.checkAbsenceReconcileState(route.vm.dataSet, route.vm.notReconcileState, absrId, absenceId);
						});
					}
				}
				return _defer.reject(rejectData);
			}
		);

		return _defer.promise;
	}

	function absrWithContext (absr) {
		var absrVal = absrSvc.absrModelToStateVal(absr,absr.context);
		delete absrVal.absr.absences;
		return absrVal;
	}

    function validateDetailsDate(){
        var currSearch = locationHelp.currentSearch();
        // change startDate to the correct "PAST" date if this user is not allowed to reconcile in the past
        if (isDateInPast()) {
            route.vm.filters.dateRange.startDate = route.vm.filters.dateRange.endDate = parseDateFilter(Date.parse(orgSettings.PastAbsenceDateTime), 'MM/dd/yyyy');
            currSearch['dateRange.startDate'] = currSearch['dateRange.endDate'] = route.vm.filters.dateRange.startDate;
            locationHelp.updateSearch(currSearch);
		}
		 //change endDate to present  date if this user is not allowed to reconcile in the future.
		 if (!(isValidDate(route.vm.filters.dateRange.endDate)  && isValidDate(route.vm.filters.dateRange.startDate)) &&
		    (reportHelp.IsAfter(route.vm.filters.dateRange.startDate, parseDateFilter(new Date(), 'MM/dd/yyyy')) )) {
            route.vm.filters.dateRange.startDate = route.vm.filters.dateRange.endDate = parseDateFilter(new Date(), 'MM/dd/yyyy');
            currSearch['dateRange.startDate'] = currSearch['dateRange.endDate'] = route.vm.filters.dateRange.startDate;
            locationHelp.updateSearch(currSearch);
        }
    }


	function fetchInitialResults() {
		if (locationHelp.hasSearch()) {
			locationHelp.parseSearch(route.vm.filters);
			route.vm.selectedInst = route.vm.filters.institutions;
            validateDetailsDate();
			route.vm.canGoToNextDay = isValidDate(route.vm.filters.dateRange.startDate);
			route.vm.canGoToPreviousDay = !isDateInPast(-1);
			makeCallToApi();
		}
	}
	function updateDate(daysToAdd) {
		var currentDate = Date.parse(route.vm.filters.dateRange.startDate);
		route.vm.filters.dateRange.startDate = route.vm.filters.dateRange.endDate = parseDateFilter(currentDate.setDate(currentDate.getDate() + daysToAdd), 'MM/dd/yyyy');
		route.vm.dateText = parseDateFilter(currentDate, 'EEEE') + ', ' + parseAesopDateFilter(currentDate);
		//reset the date in the url
		var currSearch = locationHelp.currentSearch();
		currSearch['dateRange.startDate'] = currSearch['dateRange.endDate'] = route.vm.filters.dateRange.startDate;
		locationHelp.updateSearch(currSearch);
		route.vm.canGoToNextDay = isValidDate(route.vm.filters.dateRange.startDate);
        route.vm.canGoToPreviousDay = !isDateInPast(-1);
		$scope.currentPage = 0;
		makeCallToApi();
	}

	function checkForToday(date){
		var today = new Date();
		if (parseDateFilter(Date.parse(date), 'MM/dd/yyyy') === parseDateFilter(today, 'MM/dd/yyyy')  || reportHelp.DayDiff(Date.parse(today),Date.parse(date) )>0) {
			return true;
		}
		return false;
	}
	function checkForMaxDate(date){
		var today= Date.parse(new Date());
		var endDate=  Date.parse(date);
		return (reportHelp.DayDiff(today,endDate) < (futureDaysToReconcile-1));
	}
    function isDateInPast(dayOffset) {
		var currentDate = Date.parse(route.vm.filters.dateRange.startDate);
        if (dayOffset != null) {
                currentDate.setDate(currentDate.getDate() + dayOffset);
        }
        if (permissionSvc.iHave('ABSRPAST.APPROVE') && !reportHelp.IsAfter(archiveDate,currentDate) ){
               return false;
        } else {
            return !reportHelp.IsAfter(currentDate, orgSettings.PastAbsenceDateTime);
        }
	}
	// If reconcilation of future absences is allowed and date lies in the alllowed range then return true.
	// If reconcilation of future absences is not allowed then check if the date is today or greater than today,
	// if yes then return false else return true.
	function isValidDate(currentDate)
	{
		if(orgSettings.canReconcileFutureAbsences ){
			return (checkForMaxDate(currentDate));
		}
		else{
			return (!checkForToday(currentDate));
        }
	}
	
	function makeCallToApi() {
		var delay = (resultsTimer == null) ? 0 : 200;
		var _defer = $q.defer();

		// cancel the previous request and reset timer
		$timeout.cancel(resultsTimer);
		if (lastRequest && lastRequest.$abort) { lastRequest.$abort(); }

		resultsTimer = $timeout(function () {
			toastHelp.clear();
			//carry the current inst selection between page changes
			//if it is not in the list, it just won't be selected
			route.vm.defaultInstId = route.vm.filters.selectedInst.length > 0 ? route.vm.filters.selectedInst[0] : route.vm.defaultInstId;
			clearFilters();
			route.vm.dataSet = [];
			route.vm.isLoading = true;
			route.vm.isDataRendered= false;
			route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
			route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
			route.vm.dateText = parseDateFilter(route.vm.filters.dateRange.startDate, 'EEEE') + ', ' + parseAesopDateFilter(route.vm.filters.dateRange.startDate);
			var filter = reportHelp.convertAbsenceRequestFilter(route.vm.filters);
			//determine which state will be requested
			filter.includeReconciled = route.vm.filters.state === 'includeReconciled';
			filter.includeNotReconciled = route.vm.filters.state === 'includeNotReconciled';
			filter.includeDenied= false;
			filter.accountingCodeData = true;
			filter.includeDeletedWorkers = false;
			//we want to carry around the settings for these filters between pages, but whenever we make a call
			//to the server, all have to be true so we can get all of the data down and then do client side filtering
			filter.includeAbsences = true;
			filter.includeVacancies = route.vm.canRequestVacancies;
			filter.includeFilled = true;
			filter.includeUnfilled = true;
			filter.includeNoSubRequired = true;
			filter.forReconciliation = true;
			//in the reconcile workflow, viewing the individual details for Absrs is the only time
			//where we actually show the locked status to the user. We need that info here.
            filter.checkForLock = true;

			lastRequest = absenceRequestApi.get(filter);
			lastRequest.then(function(data) {
				$scope.totalPages = Math.ceil(data.length / $scope.itemsPerPage);
				route.vm.totalRecords = data.length;
				processResults(data);
				return _defer.resolve();
			},function(reasons){
				route.vm.isLoading = false;
				route.vm.dataLoaded = true;
				if (reasons.$messages != null) { toastHelp.error(reasons.$messages, 'Error'); }
				return _defer.reject();
			});

		}, delay);

		return _defer.promise;
	}

	function clearFilters() {
		route.vm.filters.selectedInst = [];
		route.vm.filters.institutionList = [];
		route.vm.filters.budgetCodeList = [];
		route.vm.filters.budgetCodeId = [];
		route.vm.filters.absenceReasonList = [];
		route.vm.filters.absenceReasonId = [];
		route.vm.filters.accountingCodeList = [];
		route.vm.filters.accountingCodeId = [];
	}

	function populateFilters(absrVals) {
		var insts = [];
		var budgetCodes = [];
		var absReasons = [];
		var accountingCodes = [];
		var institutionMatch = false;
		var customAcctCodeFound = false;

		absrVals.forEach(function (absr){
			var absence = absr.absrVariations[0].absences[0];
			if (absence.institution != null) {
				insts.push({
					id: absence.institution.id,
					value: absence.institution.name,
					enabled: true
				});
				if ((route.vm.selectedInst.length > 0 && absence.institution.id === route.vm.selectedInst[0]) || absence.institution.id == route.vm.defaultInstId) {
					institutionMatch = true;
					route.vm.filters.selectedInst = [absence.institution.id];
				}
			}
			if (absence.budgetCode != null) {
				budgetCodes.push({
					id: absence.budgetCode.id,
					value: absence.budgetCode.description,
					enabled: true
				});
			}
			if (absence.entitlement != null) {
				absReasons.push({
					id: absence.entitlement.id,
					value: absence.entitlement.name,
					enabled: true
				});
			}
			if (absence.accountingCode != null) {
				if (absence.accountingCode.isFreeForm) {
					customAcctCodeFound = true;
				} else {
					accountingCodes.push({
						id: absence.accountingCode.id,
						value: absence.accountingCode.name == null ? '' : absence.accountingCode.name,
						enabled: true
					});
				}
			}
		});

		route.vm.filters.institutionList = arrayHelp.distinctObjectList(insts, 'id').sort(arrayHelp.sort('value'));
		route.vm.filters.budgetCodeList = arrayHelp.distinctObjectList(budgetCodes, 'id').sort(arrayHelp.sort('value'));
		route.vm.filters.absenceReasonList = arrayHelp.distinctObjectList(absReasons, 'id').sort(arrayHelp.sort('value'));
		route.vm.filters.accountingCodeList = arrayHelp.distinctObjectList(accountingCodes, 'id').sort(arrayHelp.sort('value'));

		if (customAcctCodeFound) {
			route.vm.filters.accountingCodeList.push({
				id: 0,
				value: route.strings['Custom'],
				enabled: true
			});
		}

		if (!institutionMatch) {
			route.vm.defaultInstId = route.vm.filters.selectedInst.length > 0 ? route.vm.filters.selectedInst[0] : route.vm.defaultInstId;
			route.vm.filters.selectedInst = [];
		}
	}

	function cleanSearchFilters(filterObj) {
		var filters = angular.copy(filterObj);
		if (filters != null) {
			route.vm.nonSearchFilters.forEach(function (v,i,a){
				if (filters.hasOwnProperty(v)) {
					delete filters[v];
				}
			});
		}
		return filters;
	}


// #----- END ReconcileDetailsCtrl -----# //
});}());