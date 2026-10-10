(function () {
    'use strict'; angular.module('aesop')
        .directive('cmptAbsrEditByDay', function () {
            return {

                // directive options
                restrict: 'E',
                scope: {
                    absenceData: '=',
                    apshowslide: '=?',
                    detectConflict: '=?',
                    checkLastAbsence:'=?'
                },
                replace: true,
                transclude: true,
                templateUrl: '/components/absr/cmpt-absr-edit-by-day/absrEditByDay.html',

                //Controller
                controller: function ($q, $scope, $filter, absrSvc, absrStateVal, stringSvc, arrayHelp, dateHelp, absrVariationHelp, 
                                        entitlementTypeApi, budgetCodeSvc, accountingCodeApi, payCodeSvc,storageSvc,$location, featureSvc) {
                    $scope.isExpanded = true;
                    $scope.showTrashIcon = true;
                    $scope.showUndoDiv=false;
                    var inst;
                    var absenceReason;
                    var absr = $scope.absrState = absrStateVal;
                    var absenceData = $scope.absenceData;
                    absenceData.isEditable = !(absenceData.readOnlyReason != null && absenceData.readOnlyReason.length > 0)
                    const dateLength = 10;
                    var initialDataLoaders = [];
                    $scope.currentAbsrState = $scope.absrState.absr == null? $scope.absrState.absrVariations[0] : $scope.absrState.absr;
                    var isVacancy = absr.worker.isVacancy;
                    var isCreateMode = isVacancy ? $location.url().includes('create-vacancy-details') : $location.url().includes('create-absence-details');
                    $scope.canViewOrEditBreakTime = false;
                    $scope.canViewAbsenceDuration = false;
                    var organizationSettings = storageSvc.load('organizations')[0].settings;
                    absenceData.isReasonCreateMode = isCreateMode;
                   
                    if($location.url().includes('/edit')) {
                        absenceData.deductCustomBreakTime = absenceData.DeductBreakFromAbsenceDuration;
                        if (absenceData.deductCustomBreakTime == null){ absenceData.deductCustomBreakTime = absrStateVal.worker.DeductBreakFromAbsenceDuration; }
                        if (absenceData.deductCustomBreakTime == null){ absenceData.deductCustomBreakTime = absrStateVal.worker.workerType.DeductBreakFromAbsenceDuration; }
                        if (absenceData.deductCustomBreakTime == null){ absenceData.deductCustomBreakTime = organizationSettings.DeductBreakFromAbsenceDuration; }
                    }
                    else if (absenceData.deductCustomBreakTime == null && absrSvc.showHideAbsenceBreakTime(absenceData) && absrStateVal.absr == null) { 
                        absenceData.deductCustomBreakTime = true;
                    }

	                if (absenceData.doesBreakTimeOverlapAbsenceTimes == null && absrSvc.showHideAbsenceBreakTime(absenceData)) { 
                        absenceData.doesBreakTimeOverlapAbsenceTimes = true;
                    }
                    if (absenceData.breakStartTime == null) { 
                        absenceData.breakStartTime = absr.worker.defaultBreakStartTime == null ? absenceData.BreakStart : absr.worker.defaultBreakStartTime; 
                    }
                    if (absenceData.breakEndTime == null) { 
                        absenceData.breakEndTime = absr.worker.defaultBreakEndTime == null ? absenceData.BreakEnd : absr.worker.defaultBreakEndTime; 
                    }

                    $scope.canDeductCustomBreakTime = organizationSettings.ShowBreakTimeForCustomAbsences;;

                    $scope.showResetIcon = false;                                                              
                    $scope.toggleUndoDelete = function()
                    {
                        $scope.showTrashIcon = !$scope.showTrashIcon;
                        $scope.showUndoDiv = false;
                        
                        if($scope.showTrashIcon){  
                            $scope.absenceData.isDeleted = false;
                            $scope.currentAbsrState.absences[$scope.currentAbsrState.absences.indexOf(absenceData)].isDeleted = false;
                        }
                        else{                            
                            $scope.absenceData.isDeleted = true;
                            $scope.currentAbsrState.absences[$scope.currentAbsrState.absences.indexOf(absenceData)].isDeleted = true;
                        }
                        absrSvc.checkLastAbsence($scope.currentAbsrState.absences.indexOf(absenceData));
                      
                    }
                    $scope.onMouseOver = function()
                    {
                        if(!$scope.showTrashIcon)
                        {
                            $scope.showUndoDiv = true;
                        }
                    }
                    $scope.onMouseLeave=function()
                    {
                        $scope.showUndoDiv = false;
                    }

                    var mnemonic = $scope.mnemonic = {
                        reasonTitle: isVacancy ? 'VacancyReason' : 'AbsenceReason',
                        typeTitle: isVacancy ? 'VacancyType' : 'AbsenceType',
                        errorTitle: isVacancy ? 'OverlappingVacancy' : 'OverlappingAbsence',
                        reasonLabel: isVacancy ? 'SelectVacancyReason': 'SelectAbsenceReason'
                    }

                    // View Model properties
                    var vm = $scope.vm = {
                        institutionList: [],
                        entitlementTypeList: [],
                        dateLength: dateLength,
                        minSystemDate: dateHelp.getMinSystemDate(),
                        date: absenceData.date,
                        shiftTypeList: [],
                        instDependantDataReady: false,
                        instSettings: null,
                        startTime: absenceData.absenceStartTime,
                        editable: {
                            date: isCreateMode? true : absr.editMode && absr.context.editDates && absenceData.isEditable,
                            absenceTime: isCreateMode? true : absr.editMode && absr.context.editAbsenceTimes && absenceData.isEditable,
                            vacancyTime: isCreateMode? true : absr.editMode && absr.context.editVacancyTimes && absenceData.isEditable,
                            institution: isCreateMode? true : absr.editMode && absr.context.editInstitution && absenceData.isEditable,
                            entitlement: isCreateMode? true : absr.editMode && absr.context.editEntitlementType && absenceData.isEditable,
                            userSpecifiedAbsenceDuration: isCreateMode? true : absr.editMode && absr.context.editUserSpecifiedAbsenceDuration && absenceData.isEditable,
                            nonPayTime: isCreateMode? true : absr.editMode && absr.context.editNonPayTime && absenceData.isEditable,
                            budgetCode: isCreateMode? true : absr.editMode && absr.context.editBudgetCode && absenceData.isEditable,
                            payCode: isCreateMode? true : absr.editMode && absr.context.editPayCode && absenceData.isEditable,
                            hoursSubWorked: isCreateMode? true : absr.editMode && absr.context.editHoursSubWorked && absenceData.isEditable,
                            accountingCode: isCreateMode? true : absr.editMode && absr.context.editAccountingCode && absenceData.isEditable,
                        },
                        showVacancyConflicts: true,
                        showByDay: true,
                        shouldShowSubTimeFields: absr.context.showVacancyTimes,
                        mainDataReady: false,
                        bugdetCodeList: [],
                        accountingCodeList: [],
                        defaultText: 'None Selected',
                        payCodeList: [],
                        isOnlyInstitute: true,
                        isVacancy:isVacancy,
                        absenceDuration: null,
                        canSelectHiddenAbsenceReasons: absr.context.CanSelectHiddenAbsenceReasons
                    };
                    
                    if (absr.worker) {
                        vm.institutionList = angular.copy(absr.worker.schools);
                        if (absenceData.institution != null) {
                            if (absenceData.institution.name != null){
                                inst  = { id: absenceData.institution.id, value: absenceData.institution.name }
                                vm.institutionList.push(inst);
                            }
                            vm.institutionList.push(absenceData.institution);
                        }
                        vm.institutionList = arrayHelp.distinctObjectList(vm.institutionList, 'id');

                        if (vm.institutionList.length === 1) {
                            absenceData.institution = vm.institutionList[0];
                            vm.isOnlyInstitute = false;
                        }
                    }

                    if (absr.context.showPayCode && absr.id > 0) {
                        payCodeSvc.ready.then(function (payCodeData) {
                            vm.payCodeList = payCodeData.map(function (v) {
                                return { id: v.id, value: v.description };
                            });
                            absenceData.payCode = absrVariationHelp.setDefaultDropdownOption({
                                options: vm.payCodeList,
                                item: absenceData.payCode,
                                allowDeleted: true
                            });
                        });
                        initialDataLoaders.push(payCodeSvc.ready);
                    }


                    if (absr.context.showBudgetCode) {
                        budgetCodeSvc.ready.then(function (budgetCodeData) {
                            vm.bugdetCodeList = budgetCodeData.map(function (v) {
                                return { id: v.id, value: v.description };
                            });

                            var budgetCode = absenceData.budgetCode || absr.worker.budgetCode || null;

                            absenceData.budgetCode = absrVariationHelp.setDefaultDropdownOption({
                                options: vm.bugdetCodeList,
                                item: budgetCode,
                                allowDeleted: absenceData.allowDeleted
                            });
                        });
                        initialDataLoaders.push(budgetCodeSvc.ready);
                    }

                    $q.all(initialDataLoaders).then(function () {
                        vm.mainDataReady = true;
                    });



                    $scope.$watch('absenceData.institution.id', function (inst, oldInst) {
                        var instId, dataLoaders = [];
                        dirtySync();
                        // update active institution list
                        absrSvc.setAbsrInstIds();

                        // clear data
                        if (inst) {
                            instId = (typeof inst === 'object') ? inst.id : inst;
                            let oldInstId = (typeof inst === 'object') ? oldInst.id : oldInst

                            if (instId != oldInstId){
                                absrSvc.setDefaultBreakTime(instId);
                                setRectifiedOrDefaultBreakTime(false, absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.absenceStartTime, absenceData.absenceEndTime);
                            }
                            vm.accountingCodeList = [];
                            vm.entitlementTypeList = [];
                            vm.instDependantDataReady = false;

                            // get the inst settings
                            vm.instSettings = absr.context.InstitutionSettings
                                .filter(function (v, i, a) {
                                    return v.id === instId;
                                });

                            vm.instSettings = vm.instSettings.length && vm.instSettings[0] || null;
                            absenceData.isHiddenReasonSelected = false;

                            if (absr.context.showAccountingCode) {
                                // fetch accounting codes
                                dataLoaders.push(
                                    accountingCodeApi.queryCached({
                                        workId: absr.worker.id,
                                        instId: instId,
                                        enforceMultiLocPerm: true,
                                        fields: '(id,name)'
                                    }).then(function (codes) {
                                        vm.accountingCodeList = codes.map(function (v, i, a) {
                                            return { id: v.id, value: v.name };
                                        });

                                        var accountingCode = absenceData.accountingCode || absr.worker.accountingCode || null;

                                        //if we're trying to default to a custom accounting code, set it's id to 0 which is what "Custom" is in the list.
                                        var defaultingCustomAccountingCode = accountingCode != null && accountingCode.isFreeForm;
                                        if (defaultingCustomAccountingCode) {
                                            accountingCode.id = 0;
                                        }

                                        if(inst === oldInst || isCreateMode){
                                            absenceData.accountingCode = absrVariationHelp.setDefaultDropdownOption({
                                                options: vm.accountingCodeList,
                                                item: accountingCode,
                                                allowDeleted: absenceData.allowDeleted && inst && oldInst && inst.id === oldInst.id
                                            });
                                        }

                                        //also, populate the name of the custom accounting code for vm binding.
                                        if (defaultingCustomAccountingCode) {
                                            absenceData.customAccountingCode = accountingCode.name;
                                        }

                                    }, function () { })
                                );
                            }



                            // fetch absence absReasons (entitlement types)
                            dataLoaders.push(
                                entitlementTypeApi.queryCached({
                                    workId: absr.worker.id,
                                    isVacancyType: isVacancy,
                                    instId: instId,
                                    enforceMultiLocPerm: true,
                                    fields: '(id,name,notesToAdminRequired,isHiddenReason)',
                                    canSelectHiddenAbsenceReasons: vm.canSelectHiddenAbsenceReasons
                                }).then(function (enttTypes) {
                                    vm.entitlementTypeList = enttTypes.map(function (v, i, a) {
                                        return { id: v.id, value: v.name, notesRequired: v.notesToAdminRequired, isHiddenReason: v.isHiddenReason };
                                    }); 
                                    if (!vm.canSelectHiddenAbsenceReasons) {
                                            vm.entitlementTypeList = vm.entitlementTypeList.filter(x => !x.isHiddenReason);
                                    }

                                    if(inst === oldInst){
                                        absenceData.entitlement = absrVariationHelp.setDefaultDropdownOption({
                                            options: vm.entitlementTypeList,
                                            item: absenceData.entitlement != null ? { id: absenceData.entitlement.id, value: absenceData.entitlement.name != undefined ? absenceData.entitlement.name : absenceData.entitlement.value} : null,
                                            allowDeleted: true && inst && oldInst && inst.id === oldInst.id
                                        });
                                    }

                                    if(vm.entitlementTypeList.length === 0 && isVacancy){
                                        absenceData.entitlement = {id: 0, value: '(' + strings['VacancyPosition'] + ')'};
                                    }

                                }, function () { })
                            );

                            $q.all(dataLoaders).then(function () {
                                vm.instDependantDataReady = true;
                            });
                        } else {
                            vm.entitlementTypeList = [];
                            vm.instSettings = null;
                        }
                    });

                    // if the shiftTypeMode is 3, we need to limit the shift types to only full day
                    if (absr.context.absenceShiftTypeMode === 3) {
                        absr.context.absenceShiftTypes = absr.context.absenceShiftTypes.filter(function (v) {
                            return v.id === 1;
                        });
                    }


                    $scope.$watch('absenceData.shiftType', linkSync);
                    $scope.$watch('absenceData.timesAreLinked', linkSync);
                    $scope.$watch('absenceData.absenceStartTime', calcVacancyStartTime);
                    $scope.$watch('absenceData.absenceEndTime', calcVacancyEndTime);
                    $scope.$watchGroup(['absenceData.date', 'absenceData.absenceStartTime', 'absenceData.absenceEndTime'], alreadyAbsenceCheck);
                    $scope.$watch('absenceData.budgetCode', dirtySync);
                    $scope.$watch('absenceData.payCode', dirtySync);
                    $scope.$watch('absenceData.entitlement', dirtySync);
                    $scope.$watch('absenceData.accountingCode', dirtySync);
                    $scope.$watch('absenceData.nonPayTime', dirtySync);
                    $scope.$watch('absenceData.hoursSubWorked', dirtySync);
                    $scope.$watch('absenceData.userSpecifiedAbsenceDuration', dirtySync);

                    $scope.$watch('absenceData.absenceStartTime', function (nVal, oVal){
                        if( nVal !== null 
                            && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)
                            && $scope.canDeductCustomBreakTime){
                            absenceData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(nVal, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime);
                            absrSvc.setDefaultBreakTime(absenceData.institution.id);
                            if (absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, nVal, absenceData.absenceEndTime, nVal, absenceData.breakEndTime);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(nVal, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime, absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes);
                            var isBreakCustomized = absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!absenceData.doesBreakTimeOverlapAbsenceTimes, !absenceData.deductCustomBreakTime, isBreakCustomized);
                        }
                        $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(nVal, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime, absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes);
                    });
                    $scope.$watch('absenceData.absenceEndTime', function (nVal, oVal){
                        if( nVal !== null 
                            && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)
                            && $scope.canDeductCustomBreakTime){
                            absenceData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(absenceData.absenceStartTime, nVal, absenceData.breakStartTime, absenceData.breakEndTime);
                            absrSvc.setDefaultBreakTime(absenceData.institution.id);
                            if (absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, absenceData.absenceStartTime, nVal, absenceData.breakStartTime, nVal);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(absenceData.absenceStartTime, nVal, absenceData.breakStartTime, absenceData.breakEndTime, absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes);
                            var isBreakCustomized = absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!absenceData.doesBreakTimeOverlapAbsenceTimes, !absenceData.deductCustomBreakTime, isBreakCustomized);
                        }
                        $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(absenceData.absenceStartTime, nVal, absenceData.breakStartTime, absenceData.breakEndTime, absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes);

                        let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime);
                        if(dateHelp.convertTimeToMilitaryTime(nVal) == absenceBreakEndTime){
                            $scope.showResetIcon = false;
                        }
                    });
                    $scope.$watch('absenceData.breakStartTime', function (nVal, oVal){
                        if(nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
                            absenceData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(absenceData.absenceStartTime, absenceData.absenceEndTime, nVal, absenceData.breakEndTime);
                            absrSvc.setDefaultBreakTime(absenceData.institution.id);
                            if (absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, absenceData.absenceStartTime, absenceData.absenceEndTime, nVal, absenceData.breakEndTime);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }

                            // TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
                            storageSvc.save({
                                key: 'setDefaultBreakTime',
                                data: false,
                                persistent: false
                            });

                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(absenceData.absenceStartTime, absenceData.absenceEndTime, nVal, absenceData.breakEndTime, absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes);
                            var isBreakCustomized = absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!absenceData.doesBreakTimeOverlapAbsenceTimes, !absenceData.deductCustomBreakTime, isBreakCustomized);
                        }
                        let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime);
                        let absenceStartTime = dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime);
                        let absenceEndTime = dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime);   
                        let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime);
                        let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime);                       
                        if (defaultAbsenceBreakStartTime != dateHelp.convertTimeToMilitaryTime(nVal)){
                            if(absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                if( defaultAbsenceBreakStartTime <= dateHelp.convertTimeToMilitaryTime(nVal)){
                                    if(absenceStartTime < dateHelp.convertTimeToMilitaryTime(nVal)){
                                        $scope.showResetIcon = true;
                                    } else {
                                        $scope.showResetIcon = false;
                                    }
                                
                                }
                            }                         
                        } else if (absenceBreakEndTime != defaultAbsenceBreakEndTime && absenceBreakEndTime != absenceEndTime) {
                            $scope.showResetIcon = true;
                        } else {
                            $scope.showResetIcon = false; 
                        }                                                   
                    });
                    $scope.$watch('absenceData.breakEndTime', function (nVal, oVal){
                        if(nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
                            absenceData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, nVal);
                            absrSvc.setDefaultBreakTime(absenceData.institution.id);
                            if (absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, nVal);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }

                            // TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
                            storageSvc.save({
                                key: 'setDefaultBreakTime',
                                data: false,
                                persistent: false
                            });
                            
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, nVal, absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes);
                            var isBreakCustomized = absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!absenceData.doesBreakTimeOverlapAbsenceTimes, !absenceData.deductCustomBreakTime, isBreakCustomized);
                        }
                        let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime);
                        let absenceEndTime = dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime);  
                        let absenceStartTime = dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime);
                        let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime);
                        let absenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime);                     
                        if (defaultAbsenceBreakEndTime != dateHelp.convertTimeToMilitaryTime(nVal)) {
                            if(absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                if( defaultAbsenceBreakEndTime >= dateHelp.convertTimeToMilitaryTime(nVal)){
                                    if(absenceEndTime > dateHelp.convertTimeToMilitaryTime(nVal)){
                                        $scope.showResetIcon = true;
                                    } else {
                                        $scope.showResetIcon = false;
                                    }
                                }
                            }
                        } else if (absenceBreakStartTime != defaultAbsenceBreakStartTime && absenceBreakStartTime != absenceStartTime) {
                            $scope.showResetIcon = true;  
                        } else {
                            $scope.showResetIcon = false; 
                        }                                                                  
                    });

                    function linkSync() {
                        var shift = absenceData.shiftType.id || absenceData.shiftType || null,
                            isLinked = absenceData.timesAreLinked;

                        if (isLinked) {
                            absenceData.substituteShiftType = absr.context.vacancyShiftTypes
                                .filter(function (v, i, a) { return v.id === shift; })[0];

                            calcVacancyStartTime(absenceData.absenceStartTime);
                            calcVacancyEndTime(absenceData.absenceEndTime);
                        }

                        if (shift === 4 && $scope.canDeductCustomBreakTime) {
                            $scope.canViewOrEditBreakTime = absrSvc.showHideAbsenceBreakTime(absenceData) && !isVacancy;
                            $scope.canViewAbsenceDuration = $scope.canViewOrEditBreakTime && (isCreateMode || absr.editMode);
                            absrSvc.setDefaultBreakTime(absenceData.institution.id);
                            
                            absenceData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime);
                            if (absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }
                            var isBreakCustomized = absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes 
                                && ((dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime)) 
                                    || (dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime)))
                            
                            $scope.customBreakType = absrSvc.getBreakType(!absenceData.doesBreakTimeOverlapAbsenceTimes, !absenceData.deductCustomBreakTime, isBreakCustomized);
                        } else {
                            $scope.canViewOrEditBreakTime = false;
                            $scope.canViewAbsenceDuration = false;
                        }

                        dirtySync();
                    }

                    function dirtySync(){
                        if ($scope.editByDayForm.$dirty){
                            storageSvc.clear('formDirty');
                            storageSvc.save({
                                key: 'formDirty',
                                data: $scope.editByDayForm.$dirty,
                                persistent: true
                            });
                        }
                    }
                   


                    function calcVacancyStartTime(newStartTime) {
                        if (vm.instSettings && absenceData.timesAreLinked && absenceData.shiftType && absenceData.shiftType.id === 4) {
                            absenceData.substituteStartTime = dateHelp.offSetTime(
                                newStartTime, // original time
                                vm.instSettings.defaultVacancyStartOffsetMinutes, // amount to offset
                                'hh:mm T' // format we want back
                            );
                        }
                        dirtySync();
                    }

                    function calcVacancyEndTime(newEndTime) {
                        if (vm.instSettings && absenceData.timesAreLinked && absenceData.shiftType && absenceData.shiftType.id === 4) {
                            absenceData.substituteEndTime = dateHelp.offSetTime(
                                newEndTime, // original time
                                vm.instSettings.defaultVacancyEndOffsetMinutes, // amount to offset
                                'hh:mm T' // format we want back
                            );
                        }
                        dirtySync();
                    }


                    function alreadyAbsenceCheck() {
                        if (storageSvc.load("alreadyAbsenceCheckRequired") == null || storageSvc.load("alreadyAbsenceCheckRequired") != 'false'){
                            if (absr.absrVariations[0] != null && absenceData.errors != null){
                                for (var property in absr.absrVariations[0].errors) {
                                    if (!absenceData.errors.hasOwnProperty(property)) {
                                        absenceData.errors = angular.copy(absr.absrVariations[0].errors);
                                        break;
                                    }
                                  }                          
                            if (absrSvc.detectConflict(absr.absr == null? absr.absrVariations[0].absences.indexOf(absenceData): absr.absr.absences.indexOf(absenceData), vm))
                            {
                                absenceData.errors.dates.push(isVacancy? $scope.strings.AlreadyOnThisVacancy: $scope.strings.AlreadyOnThisAbsence);
                                absr.hasError=true;
                            }
                            
                         }
                            dirtySync();
                        } else {
                            if (absr.absr.absences.indexOf(absenceData) === absr.absr.absences.length - 1){
                                storageSvc.clear("alreadyAbsenceCheckRequired");
                            }
                        }
                    }
                    
                    function setRectifiedOrDefaultBreakTime(setDefault, absenceStartTime, absenceEndTime, breakStartTime, breakEndTime){
                        if (setDefault){
                            absenceData.breakEndTime = absr.worker.defaultBreakEndTime;
                            absenceData.breakStartTime = absr.worker.defaultBreakStartTime;
                        } else {
                            var rectifiedBreakStartAndEndTime = absrSvc.getRectifiedBreakStartAndEndTime(absenceStartTime, absenceEndTime, breakStartTime, breakEndTime);
                            absenceData.breakEndTime = rectifiedBreakStartAndEndTime.breakEndTime;
                            absenceData.breakStartTime = rectifiedBreakStartAndEndTime.breakStartTime;
                        }		
                    }


                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";

                    $scope.go = {
                        parseTime: function (dateTime) {
                            return Date.parse(dateTime);
                        },
                        getDay: function (dateTime) {
                            dateTime = Date.parse(dateTime);
                            return weekday[dateTime.getDay()];
                        },

                        sortByNameWithCustomAtBottom: function (a, b) {
                            if (a.value.toLowerCase() === 'custom') { return 1; }
                            if (b.value.toLowerCase() === 'custom') { return -1; }
                            if (a.value < b.value) { return -1; }
                            if (a.value > b.value) { return 1; }
                            return 0;
                        },
                        enableDisableCustomBreakTime: function(){
                            absenceData.deductCustomBreakTime = !absenceData.deductCustomBreakTime;
                            setRectifiedOrDefaultBreakTime(!absenceData.deductCustomBreakTime, absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime );
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(absenceData.absenceStartTime, absenceData.absenceEndTime, absenceData.breakStartTime, absenceData.breakEndTime, absenceData.deductCustomBreakTime);
                            var isBreakCustomized = absenceData.deductCustomBreakTime && absenceData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!absenceData.doesBreakTimeOverlapAbsenceTimes, !absenceData.deductCustomBreakTime, isBreakCustomized);
                            $scope.showResetIcon = false;
                            // TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
                            storageSvc.save({
                                key: 'setDefaultBreakTime',
                                data: true,
                                persistent: false
                            });
                        },
                        resetBreakTime: function(){   
                            absrSvc.setDefaultBreakTime(absenceData.institution.id);
                            let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakStartTime);
                            let absenceStartTime = dateHelp.convertTimeToMilitaryTime(absenceData.absenceStartTime); 
                            let absenceEndTime = dateHelp.convertTimeToMilitaryTime(absenceData.absenceEndTime); 
                            let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absr.worker.defaultBreakEndTime);
                            let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absenceData.breakEndTime); 
                            let absenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absenceData.breakStartTime);                        
                              // Resetting absenceBreakStartTime(customised) to DefaultBreakStartTime in normal
                             // as well as Overlapping scenarios . 
                             absenceData.breakStartTime = defaultAbsenceBreakStartTime < (absenceBreakStartTime < absenceStartTime ?
                                absenceBreakStartTime : absenceStartTime) ? defaultAbsenceBreakStartTime :
                                ((absenceBreakStartTime < absenceStartTime) ? absenceBreakStartTime : absenceStartTime);                             

                            // Resetting absenceBreakEndTime(customised) to DefaultBreakEndTime in normal 
                            // as well as Overlapping scenarios.     
                            absenceData.breakEndTime = (absenceBreakEndTime > absenceEndTime) ?
                                (absenceBreakEndTime > defaultAbsenceBreakEndTime ? absenceBreakEndTime : defaultAbsenceBreakEndTime) :
                                (absenceEndTime > defaultAbsenceBreakEndTime ? absenceEndTime : defaultAbsenceBreakEndTime);  
                                                                                                   
                            $scope.showResetIcon = false;                                                 
                         }
                    };


                  var strings = $scope.strings = stringSvc.getStrings([
                        'ViewingByDay',
                        'AddDay',
                        'School',
                        'AbsenceReason',
                        'Date',
                        'SubTimes',
                        'StartTime',
                        'EndTime',
                        'AbsenceType',
                        'InServiceDay',
                        'ClosedDay',
                        'BudgetCode',
                        'AccountingCode',
                        'NoneSelected',
                        'PayCode',
                        'HoursSubWorked',
                        'NonPayTime',
                        'TimeAbsent',
                        'OverlappingAbsence',
                        'OverlappingVacancy',
                        'AlreadyOnThisAbsence',
                        'AlreadyOnThisVacancy',
                        'VacancyPosition',
                        'VacancyReason',
                        'VacancyType',
                        'EnterCustomAccountingCode',
                        'SelectDate',
                        'SelectShiftType',
                        'SelectSubShiftType',
                        'EnterSubShiftFromTime',
                        'EnterSubShiftToTime',
                        'EnterShiftToTime',
                        'EnterShiftFromTime',
                        'Report.Label.SelectSchool',
                        'SelectBudgetCode',
                        'SelectAccountingCode',
                        'SelectPayCode',
                        'EnterNonPayTime',
                        'EnterSubWorkedHours',
                        'EnterAbsentTime',
                        'SelectVacancyReason',
                        'SelectAbsenceReason',
                        'DeductBreak'
                    ]);
                }


            };
        });


}());


