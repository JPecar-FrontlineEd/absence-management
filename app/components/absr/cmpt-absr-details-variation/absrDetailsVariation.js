(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDetailsVariation', function () {return {

// directive options
restrict: 'E',
scope: {
	variationData:'=',
	detectConflict: '=',
	detectVacancyConflict: '=',
	allDates:'=',
	editMode: '=',
	uniqueId: '@'
},
replace: true,
transclude:true,
templateUrl: '/components/absr/cmpt-absr-details-variation/absrDetailsVariation.html',

// #-------------------------------------------------# //
// #---- Component (cmpt-absr-details-variation) ----# //
controller: function ($scope,$filter, $q, absrStateVal, regexExpressionsVal, absrVariationHelp, dateHelp,
					  stringSvc, institutionSvc, budgetCodeSvc, payCodeSvc, featureSvc,
	entitlementTypeApi, accountingCodeApi, arrayHelp,absrSvc, toastHelp, stringHelp, storageSvc, $location, relatedCalendarDataSvc) {

	//Create an entry in session storage with name "absrDetailsVariationDebug" and value {"data":{"debug":true}}
	let debug = storageSvc.load("absrDetailsVariationDebug") != null;

	var absrState = $scope.absrState = absrStateVal;
	var variationData = $scope.variationData;
	var isVacancy = absrState.worker.isVacancy;
	$scope.showResetIcon = false;
	$scope.canViewOrEditBreakTime = false;
	$scope.canViewAbsenceDuration = false;
    absrSvc.setDefaultBreakTime();
	var isViewingAbsence = $scope.isViewingAbsence = $location.url().includes('/view');
		
	if($location.url().includes('/edit') || isViewingAbsence) {
		variationData.deductCustomBreakTime = variationData.absences[0].DeductBreakFromAbsenceDuration;
	}
	else if ( variationData.deductCustomBreakTime == null && absrSvc.showHideAbsenceBreakTime(variationData) && absrStateVal.absr == null) { 
		variationData.deductCustomBreakTime = true; 
	}

	if ( variationData.doesBreakTimeOverlapAbsenceTimes == null && absrSvc.showHideAbsenceBreakTime(variationData) ) { 
		variationData.doesBreakTimeOverlapAbsenceTimes = true; 
	}
	
	// TO DO: Conditions related to breakStartTime and breakEndTime will be revisited.
	if ( variationData.breakStartTime == null) 
	{ 
		variationData.breakStartTime = variationData.breakStart == null
		? (absrState.worker.defaultBreakStartTime == null ? absrState.worker.HalfDayAMEndTime : absrState.worker.defaultBreakStartTime) 
		: variationData.breakStart; 
	}

	if ( variationData.breakEndTime == null) 
	{ 
		variationData.breakEndTime = variationData.breakEnd == null
		? (absrState.worker.defaultBreakEndTime == null ? absrState.worker.HalfDayPMStartTime : absrState.worker.defaultBreakEndTime) 
		: variationData.breakEnd;
	}

	variationData.IsBreakTimeEdited = variationData.absences && variationData.absences[0].IsBreakTimeEdited;
	var organizationSettings = storageSvc.load('organizations')[0].settings;
	$scope.canDeductCustomBreakTime = organizationSettings.ShowBreakTimeForCustomAbsences;
	
	var mnemonic = $scope.mnemonic ={
		reasonTitle: isVacancy ? 'VacancyReason' : 'AbsenceReason',
		reasonLabel: isVacancy ? 'SelectVacancyReason': 'SelectAbsenceReason',
		defaultStartTime: 'defaultStartTime',
		defaultEndTime: 'defaultEndTime',
		hoursInADay: 'hoursInADay',
		minAbsLength: 'minAbsLength',
		maxAbsLength: 'maxAbsLength',
		hours: 'Absence.HoldOption.Text.Hours'

	};
	var isCreateMode = isVacancy ? $location.url().includes('create-vacancy-details') : $location.url().includes('create-absence-details');
	var initialDataLoaders = [];
	variationData.isReasonCreateMode = isCreateMode;
	variationData.isVariationReasonEditCreateMode = !isCreateMode && $location.url().includes('/edit')
	&& variationData.isVariationReasonEditCreateMode != undefined;
	relatedCalendarDataSvc.clearCache("absrDetailsVariation.js");
	
	// View Model properties
	var vm = $scope.vm = {
		shouldShowSubTimeFields: absrState.context.showVacancyTimes,
		highlightDates:{otherAbsenceDays: []},
		dateConflictResolved: false,
		dateVacancyConflictResolved: false,
		institutionList: [],
		entitlementTypeList: [],
		accountingCodeList: [],
		bugdetCodeList: [],
		payCodeList:[],
		instSettings: null,
		editable:{
			date: isCreateMode? true : variationData.newVariation ? absrState.editMode : absrState.editMode && absrState.context.editDates && variationData.isEditable,
			institution: isCreateMode? true : absrState.editMode && absrState.context.editInstitution && variationData.isEditable,
			entitlementType: isCreateMode? true : absrState.editMode && absrState.context.editEntitlementType && variationData.isEditable,
			absenceTime: isCreateMode? true : absrState.editMode && absrState.context.editAbsenceTimes && variationData.isEditable,
			vacancyTime: isCreateMode? true : absrState.editMode && absrState.context.editVacancyTimes && variationData.isEditable,
			userSpecifiedAbsenceDuration: isCreateMode? true : absrState.editMode && absrState.context.editUserSpecifiedAbsenceDuration && variationData.isEditable,
			nonPayTime: isCreateMode? true : absrState.editMode && absrState.context.editNonPayTime && variationData.isEditable,
			budgetCode: isCreateMode? true : absrState.editMode && absrState.context.editBudgetCode && variationData.isEditable,
			payCode: isCreateMode? true : absrState.editMode && absrState.context.editPayCode && variationData.isEditable,
			hoursSubWorked: isCreateMode? true : absrState.editMode && absrState.context.editHoursSubWorked && variationData.isEditable,
			accountingCode: isCreateMode? true : absrState.editMode && absrState.context.editAccountingCode && variationData.isEditable,
		},
		earliestAbsenceDate: new Date(absrState.context.earliestAbsenceDate),
		instDependantDataReady: false, 
		mainDataReady: false,
		extensions: variationData.extensions,
		showVacancyConflicts: true,
		uniqueId: $scope.uniqueId,
		isVacancy:isVacancy,
		absenceDuration: null,
		isHiddenAbsenceReason: false,
        canSelectHiddenAbsenceReasons:absrState.context.CanSelectHiddenAbsenceReasons
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'School',
		'AbsenceReason',
		'VacancyReason',
		'Time',
		'EnterValidAMPMTime',
		'SubstituteReportTime',
		'NonPayTime',
		'EnterValidHHMMDurationInMinuteIncrements',
		'EnterValidHHMMDuration',
		'TimeAbsent',
		'HoursSubWorked',
		'BudgetCode',
		'AccountingCode',
		'PayCode',
		'NoneSelected',
		'VacancyPosition',
		'LockedDates.Message.Header',
		'ConfirmationNumberPound',
		'defaultStartTime',
		'defaultEndTime',
		'hoursInADay',
		'maxAbsLength',
		'minAbsLength',
		'Absence.HoldOption.Text.Hours',
		'Report.Label.SelectSchool',
		'SelectAbsenceReason',
		'SelectBudgetCode',
		'SelectAccountingCode',
		'SelectVacancyReason',
		'SelectPayCode',
		'EnterNonPayTime',
		'EnterAbsentTime',
		'EnterSubWorkedHours',
		'EnterCustomAccountingCode',
		'SelectShiftType',
		'SelectSubShiftType',
		'EnterSubShiftFromTime',
		'EnterSubShiftToTime',
		'EnterShiftToTime',
		'EnterShiftFromTime',
		'Expanded',
		'Collapsed',
		'DeductBreak'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		sortByNameWithCustomAtBottom: function (a, b) {
			if (a.value.toLowerCase() === 'custom') { return 1; }
			if (b.value.toLowerCase() === 'custom') { return -1; }
			if (a.value < b.value) { return -1; }
			if (a.value > b.value) { return 1; }
			return 0;
		},
		enableDisableCustomBreakTime: function(){
			variationData.deductCustomBreakTime = !variationData.deductCustomBreakTime;
			setRectifiedOrDefaultBreakTime(!variationData.deductCustomBreakTime, variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
			$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime);
			var isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
			$scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, isBreakCustomized);
			$scope.showResetIcon = false;
			
			// TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
			storageSvc.save({
				key: 'setDefaultBreakTime',
				data: true,
				persistent: false
			});
		},
		resetBreakTime: function(){ 	
			absrSvc.setDefaultBreakTime(variationData.institution.id);
			let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakStartTime);
			let absenceStartTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime); 
			let absenceEndTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime); 
			let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakEndTime);
			let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime); 
			let absenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime);                        
			   // Resetting absenceBreakStartTime(customised) to DefaultBreakStartTime in normal
              // as well as Overlapping scenarios .  
			  variationData.breakStartTime = defaultAbsenceBreakStartTime < (absenceBreakStartTime < absenceStartTime ?
				absenceBreakStartTime : absenceStartTime) ? defaultAbsenceBreakStartTime :
				((absenceBreakStartTime < absenceStartTime) ? absenceBreakStartTime : absenceStartTime);        
			 
			// Resetting absenceBreakEndTime(customised) to DefaultBreakEndTime in normal 
            // as well as Overlapping scenarios.     
			 variationData.breakEndTime = (absenceBreakEndTime > absenceEndTime) ?
                                (absenceBreakEndTime > defaultAbsenceBreakEndTime ? absenceBreakEndTime : defaultAbsenceBreakEndTime) :
                                (absenceEndTime > defaultAbsenceBreakEndTime ? absenceEndTime : defaultAbsenceBreakEndTime);                    
			
			$scope.showResetIcon = false;     
		}
	
	};

	//ar validation = absrVariationHelp.validationFunctions(variationData, absrState, regexExpressionsVal, strings);

	// if the shiftTypeMode is 3, we need to limit the shift types to only full day
	if (absrState.context.absenceShiftTypeMode === 3) {
		absrState.context.absenceShiftTypes = absrState.context.absenceShiftTypes.filter(function (v) {
			return v.id === 1;
		});
	}

	if(absrState.context.showPayCode && absrState.id > 0){
		payCodeSvc.ready.then(function (payCodeData){
			vm.payCodeList = payCodeData.map(function(v){
				return { id:v.id, value: v.description };
			});
			variationData.payCode = absrVariationHelp.setDefaultDropdownOption({
				options: vm.payCodeList,
				item: variationData.payCode,
				allowDeleted: variationData.allowDeleted
			});
		});
		initialDataLoaders.push(payCodeSvc.ready);
	}

	if(absrState.context.showBudgetCode){
		budgetCodeSvc.ready.then(function (budgetCodeData) {
			vm.bugdetCodeList = budgetCodeData.map(function(v){
				return { id:v.id, value: v.description };
			});

			// checking if the variation have a budgetCode means absence save with budeget code.
			// else if worker has an associated budget code on it.
			// else letting user to select budget code from the dropdown.
			var budgetCode = variationData.budgetCode || absrState.worker.budgetCode || null;

			variationData.budgetCode = absrVariationHelp.setDefaultDropdownOption({
				options: vm.bugdetCodeList,
				item: budgetCode,
				allowDeleted: variationData.allowDeleted
			});
		});
		initialDataLoaders.push(budgetCodeSvc.ready);
	}

	$q.all(initialDataLoaders).then(function () {
		vm.mainDataReady = true;
	});

	if (absrState.worker) {
		vm.institutionList = angular.copy(absrState.worker.schools);
		if (variationData.institution != null) {
			vm.institutionList.push(variationData.institution);
		}

		vm.institutionList = arrayHelp.distinctObjectList(vm.institutionList, 'id');

		// due to issues with retrieving the absence reason and accounting codes
		// this change has been deferred and may be addressed again in the future
		// if (absrState.id > 0) {
		// 	// take the institutions that are within the variations and add them to
		// 	// the list (concat), then deduplicate the list using distinctObjectList

		// 	// reference defect DE8482 for the details
		// 	vm.institutionList = arrayHelp.distinctObjectList(
		// 		vm.institutionList.concat(
		// 			absrState.absrVariations.map(function (variation) {
		// 				return variation.institution;
		// 			})
		// 		), 'id');

		// }

		if (vm.institutionList.length === 1) {
			variationData.institution = vm.institutionList[0];
		}
	}

	$scope.$watch('variationData.institution.id', function (inst, oldInst){
		var instId, dataLoaders = [];

		// update active institution list
		absrSvc.setAbsrInstIds();

		// clear data
		if (inst) {
			instId = (typeof inst === 'object') ? inst.id : inst;
			let oldInstId = (typeof inst === 'object') ? oldInst.id : oldInst

			if (instId != oldInstId){
				absrSvc.setDefaultBreakTime(instId);
				setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, variationData.absenceEndTime, variationData.absenceStartTime, variationData.absenceEndTime);
			}
			
			$scope.selectedInstId = instId;
			vm.accountingCodeList = [];
			vm.entitlementTypeList = [];
			vm.instDependantDataReady = false;

			// get the inst settings
			vm.instSettings = absrState.context.InstitutionSettings
				.filter(function (v, i, a) {
					return v.id === instId;
				});

			vm.instSettings = vm.instSettings.length && vm.instSettings[0] || null;

			if(absrState.context.showAccountingCode){
				// fetch accounting codes
				dataLoaders.push(
					accountingCodeApi.queryCached({
						workId: absrState.worker.id,
						instId: instId,
						enforceMultiLocPerm:true,
						fields: '(id,name)'
					}).then(function (codes) {
						vm.accountingCodeList = codes.map(function (v, i , a) {
							return { id: v.id, value: v.name };
						});
						// checking if the variation have a accountingCode means absence save with budeget code.
						// else if worker has an associated accountingCode on it.
						// else letting user to select accountingCode from the dropdown.
						var accountingCode = variationData.accountingCode || absrState.worker.accountingCode || null;

						//if we're trying to default to a custom accounting code, set it's id to 0 which is what "Custom" is in the list.
						var defaultingCustomAccountingCode = accountingCode != null && accountingCode.isFreeForm;
						if (defaultingCustomAccountingCode) {
							accountingCode.id = 0;
						}

						if(inst === oldInst || isCreateMode){
							variationData.accountingCode = absrVariationHelp.setDefaultDropdownOption({
								options: vm.accountingCodeList,
								item: accountingCode,
								allowDeleted: variationData.allowDeleted && inst && oldInst && inst.id === oldInst.id
							});
						}

						//also, populate the name of the custom accounting code for vm binding.
						if (defaultingCustomAccountingCode) {
							variationData.customAccountingCode = accountingCode.name;
						}

					},function (){})
				);
			}

			// fetch absence absReasons (entitlement types)
			dataLoaders.push(
				entitlementTypeApi.queryCached({
					workId: absrState.worker.id,
					isVacancyType: isVacancy,
					instId: instId,
					enforceMultiLocPerm:true,
					fields: '(id,name,notesToAdminRequired,isHiddenReason)',
					canSelectHiddenAbsenceReasons: vm.canSelectHiddenAbsenceReasons
				}).then(function (absReasons) { 
					vm.entitlementTypeList = absReasons.map(function (v, i , a) {
						return { id: v.id, value: v.name, notesRequired: v.notesToAdminRequired, isHiddenReason: v.isHiddenReason };
					});
					if (!vm.canSelectHiddenAbsenceReasons) {
						vm.entitlementTypeList = vm.entitlementTypeList.filter(x => !x.isHiddenReason);
					}
					
						if (inst === oldInst) {
						variationData.entitlementType = absrVariationHelp.setDefaultDropdownOption({
							options: vm.entitlementTypeList,
							item: variationData.entitlementType,
							allowDeleted: variationData.allowDeleted && inst && oldInst && inst.id === oldInst.id
						});
					  }
					
					// if the no entitlement type is available and the worker type is vacancy profile
					// setting the entitlement type to a dummy id zero
					// so the client side can skip the validation and its valid to create a vacancy without vacancy reason.
					if(vm.entitlementTypeList.length === 0 && isVacancy){
						variationData.entitlementType = {id: 0, value: '(' + strings['VacancyPosition'] + ')'};
					}
				},function(){})
			);

			$q.all(dataLoaders).then(function () {
				vm.instDependantDataReady = true;
			});
		}else{
			vm.accountingCodeList = [];
			vm.entitlementTypeList = [];
			vm.instSettings = null;
		}
		$scope.$broadcast("institutionSelected", $scope.selectedInstId);
	});

	$scope.$watch('allDates', function (nVal,oVal){
		vm.highlightDates.otherAbsenceDays = nVal;
	});
	$scope.$watch('variationData.dates', function (nVal, oVal){
		//DE11613
		//It was checking nVal.length previously and in case of empty dates 'detectConflict' function
		//was not getting executed and was not clearing the 'otherDates' property to reflect changes in the
		//clenders of other variations.
		if(nVal !== null){
			detectConflict();
			detectVacancyConflict();
		}
	});
	$scope.$watch('variationData.absenceShiftType', function (nVal, oVal){
		if (nVal !== null){
			detectConflict();
			if (nVal.id == 4 && $scope.canDeductCustomBreakTime){
				$scope.canViewOrEditBreakTime = absrSvc.showHideAbsenceBreakTime(variationData) && !isVacancy;		
				$scope.canViewAbsenceDuration = $scope.canViewOrEditBreakTime && (isCreateMode || absrState.editMode);
				variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
				if (!isViewingAbsence){
					absrSvc.setDefaultBreakTime(variationData.institution.id);
					if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
						setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
					} else {
						setRectifiedOrDefaultBreakTime(true);
					}		
				}
				$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
				var isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				$scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, isBreakCustomized);
			} else {
				$scope.canViewOrEditBreakTime = false;
				$scope.canViewAbsenceDuration = false;
			}
		}
	});
	$scope.$watch('variationData.absenceStartTime', function (nVal, oVal){
		if (nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
			detectConflict();
			variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(nVal, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
			if( $scope.canDeductCustomBreakTime && !isViewingAbsence
				&& dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
				absrSvc.setDefaultBreakTime(variationData.institution.id);
				if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
					setRectifiedOrDefaultBreakTime(false, nVal, variationData.absenceEndTime, nVal, variationData.breakEndTime);
				} else {
					setRectifiedOrDefaultBreakTime(true);
				}
				$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(nVal, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
				var isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				$scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, isBreakCustomized);
			}
			$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(nVal, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
		}
	});
	$scope.$watch('variationData.absenceEndTime', function (nVal, oVal){
		if (nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
			detectConflict();
			variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, nVal, variationData.breakStartTime, variationData.breakEndTime);
			if (dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal) 
				&& $scope.canDeductCustomBreakTime && !isViewingAbsence){
				absrSvc.setDefaultBreakTime(variationData.institution.id);
				if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
					setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, nVal, variationData.breakStartTime, nVal);
				} else {
					setRectifiedOrDefaultBreakTime(true);
				}
				$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, nVal, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
				var isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				$scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, isBreakCustomized);
			}
			$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, nVal, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
		}
		let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime);		
		if(dateHelp.convertTimeToMilitaryTime(nVal) == absenceBreakEndTime){
			$scope.showResetIcon = false;
		}
	});
	$scope.$watch('variationData.breakStartTime', function (nVal, oVal){
		if (nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal) && !isViewingAbsence){
			detectConflict();
			variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, variationData.absenceEndTime, nVal, variationData.breakEndTime);
			absrSvc.setDefaultBreakTime(variationData.institution.id);
			if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
				setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, variationData.absenceEndTime, nVal, variationData.breakEndTime);
			} else {
				setRectifiedOrDefaultBreakTime(true);
			}

			// TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
			storageSvc.save({
				key: 'setDefaultBreakTime',
				data: false,
				persistent: false
			});

			$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, variationData.absenceEndTime, nVal, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
			var isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
			$scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, isBreakCustomized);
		}
		if (isViewingAbsence){ variationData.breakStartTime = variationData.absences[0].BreakStart; }

		let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakStartTime);
		let absenceStartTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime);  
		let absenceEndTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime);
		let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakEndTime);
		let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime); 
		if (defaultAbsenceBreakStartTime != dateHelp.convertTimeToMilitaryTime(nVal)){
			if(variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
				if( defaultAbsenceBreakStartTime <= dateHelp.convertTimeToMilitaryTime(nVal)){
					if((absenceStartTime < dateHelp.convertTimeToMilitaryTime(nVal)) && !isViewingAbsence){
						$scope.showResetIcon = true;
					} else {
						$scope.showResetIcon = false;
					}
				}
			}
		} else if(absenceBreakEndTime != defaultAbsenceBreakEndTime && absenceBreakEndTime != absenceEndTime && !isViewingAbsence){
			$scope.showResetIcon = true;
		} else{
			$scope.showResetIcon = false; 
		}
	});
	$scope.$watch('variationData.breakEndTime', function (nVal, oVal){
		if (nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal) && !isViewingAbsence){
			detectConflict();
			variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, nVal);
			absrSvc.setDefaultBreakTime(variationData.institution.id);
			if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
				setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, nVal);
			} else {
				setRectifiedOrDefaultBreakTime(true);
			}

			// TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
			storageSvc.save({
				key: 'setDefaultBreakTime',
				data: false,
				persistent: false
			});

			$scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, nVal, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
			var isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
			$scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, isBreakCustomized);
		}
		if (isViewingAbsence){ variationData.breakEndTime = variationData.absences[0].BreakEnd; }

		let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakEndTime);
		let absenceEndTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime); 
		let absenceStartTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime);   
		let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakStartTime);
		let absenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime); 
		if (defaultAbsenceBreakEndTime != dateHelp.convertTimeToMilitaryTime(nVal)){
			if(variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
				if( defaultAbsenceBreakEndTime >= dateHelp.convertTimeToMilitaryTime(nVal)){
					if((absenceEndTime > dateHelp.convertTimeToMilitaryTime(nVal)) && !isViewingAbsence){
						$scope.showResetIcon = true;
					} else {
						$scope.showResetIcon = false;
					}
				
				}
			}			
		} else if (absenceBreakStartTime != defaultAbsenceBreakStartTime && absenceBreakStartTime != absenceStartTime && !isViewingAbsence){
			$scope.showResetIcon = true;
		} else{
			$scope.showResetIcon = false; 
		}
	});
	$scope.$watch('variationData.vacancyShiftType', function (nVal, oVal) {
		if (nVal !== null) {
			detectVacancyConflict();
		}
		dirtySync();
	});
	$scope.$watch('variationData.vacancyStartTime', function (nVal, oVal) {
		if (nVal !== null) {
			detectVacancyConflict();
		}
		dirtySync();
	});
	$scope.$watch('variationData.vacancyEndTime', function (nVal, oVal) {
		if (nVal !== null) {
			detectVacancyConflict();
		}
		dirtySync();
	});
	$scope.$watch('absrState.needSub',function (nVal, oVal) {
		if (nVal !== null) {
			detectVacancyConflict();
		}
	});

	$scope.$watch('variationData.absenceShiftType', linkSync);
	$scope.$watch('variationData.timeIsLinked', linkSync);
	$scope.$watch('variationData.absenceStartTime', calcVacancyStartTime);
	$scope.$watch('variationData.absenceEndTime', calcVacancyEndTime);
	$scope.$watch('variationData.budgetCode', dirtySync);
	$scope.$watch('variationData.payCode', dirtySync);
	$scope.$watch('variationData.entitlementType', dirtySync);
	$scope.$watch('variationData.accountingCode', dirtySync);
	$scope.$watch('variationData.nonPayTime', dirtySync);
	$scope.$watch('variationData.subHourWorked', dirtySync);
	$scope.$watch('variationData.timeAbsent', dirtySync);

	$scope.$watch(['variationData.budgetCode','variationData.payCode','variationData.entitlementType','variationData.accountingCode','variationData.nonPayTime','variationData.subHourWorked','variationData.timeAbsent'], dirtySync);

	function dirtySync(){
		if($scope.validationForm.$dirty){
			storageSvc.clear('formDirty');
			storageSvc.save({
				key: 'formDirty',
				data: $scope.validationForm.$dirty,
				persistent: true
			});
		}
		
	}

	function detectConflict() {
		if($scope.vm.showVacancyConflicts)
			$scope.detectConflict(absrState.absrVariations.indexOf(variationData),vm);
	}

	function detectVacancyConflict() {
		$scope.detectVacancyConflict(absrState.absrVariations.indexOf(variationData), vm);
	}

	function linkSync() {
		var shift = variationData.absenceShiftType && variationData.absenceShiftType.id || null,
			isLinked = variationData.timeIsLinked;

		if (isLinked) {
			variationData.vacancyShiftType = absrState.context.vacancyShiftTypes
				.filter(function (v, i, a) { return v.id === shift; })[0];

			if (shift === 4) {
				calcVacancyStartTime(variationData.absenceStartTime);
				calcVacancyEndTime(variationData.absenceEndTime);
			}
		}
		dirtySync();
	}

	function calcVacancyStartTime(newStartTime) {
		if (vm.instSettings && variationData.timeIsLinked && variationData.absenceShiftType && variationData.absenceShiftType.id === 4) {
			variationData.vacancyStartTime = dateHelp.offSetTime(
				newStartTime, // original time
				vm.instSettings.defaultVacancyStartOffsetMinutes, // amount to offset
				'hh:mm T' // format we want back
			);
		}
		dirtySync();
	}

	function calcVacancyEndTime(newEndTime) {
		if (vm.instSettings && variationData.timeIsLinked && variationData.absenceShiftType && variationData.absenceShiftType.id === 4) {
			variationData.vacancyEndTime = dateHelp.offSetTime(
				newEndTime, // original time
				vm.instSettings.defaultVacancyEndOffsetMinutes, // amount to offset
				'hh:mm T' // format we want back
			);
		}
		dirtySync();
	}

	function setRectifiedOrDefaultBreakTime(setDefault, absenceStartTime, absenceEndTime, breakStartTime, breakEndTime){
		if (setDefault){
			variationData.breakEndTime = absrState.worker.defaultBreakEndTime;
			variationData.breakStartTime = absrState.worker.defaultBreakStartTime;
		} else {
			var rectifiedBreakStartAndEndTime = absrSvc.getRectifiedBreakStartAndEndTime(absenceStartTime, absenceEndTime, breakStartTime, breakEndTime);
			variationData.breakEndTime = rectifiedBreakStartAndEndTime.breakEndTime;
			variationData.breakStartTime = rectifiedBreakStartAndEndTime.breakStartTime;
		}		
	}

	// $scope.$watch('absrState.lastUpdated', function (){
	// 	variationData.validate = function () {
	// 		var errorCount = 0;
	// 		Object.keys(variationData.errors).forEach(function (key){
	// 			variationData.errors[key] = validation[key] && validation[key]() || [];
	// 			errorCount += variationData.errors[key].length;
	// 		});
	// 		return (errorCount === 0);
	// 	};
	// });


	//Let the user know they cannot remove a date from the datepicker
	$scope.$on('locked-dates', function(event, args){
		var message = stringHelp.replace(variationData.noDeleteReason, '{0}', args.dates.join(', '));
		toastHelp.info(message, strings['LockedDates.Message.Header'], toastHelp.configOverrides.longTimeOut);
	});
	
}

// #-- END Component (cmpt-absr-details-variation) --# //
// #-------------------------------------------------# //
};});}());
