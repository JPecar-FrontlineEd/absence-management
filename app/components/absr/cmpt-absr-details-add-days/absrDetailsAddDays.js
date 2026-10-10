(function () {
    'use strict'; angular.module('aesop')
        .directive('cmptAbsrDetailsAddDays', function () {
            return {

                // directive options
                restrict: 'E',
                scope: {
                    selectedLocation: '=?',
                    isMultiLocationSelectEnabled: '=?',
                    variationDataByLocation: '=?',
                    uniqueId: '@',
                },
                replace: true,
                templateUrl: '/components/absr/cmpt-absr-details-add-days/absrDetailsAddDays.html',
                

                
                controller: function ($scope, $filter, absrSvc, stringSvc, budgetCodeSvc,dateHelp, ngDialog,absrStateVal,
                                       arrayHelp,entitlementTypeApi,accountingCodeApi,absrVariationHelp,$q,
                                       regexHelp,payCodeSvc,$rootScope, $location, parseDateFilter, storageSvc, featureSvc, relatedCalendarDataSvc) {
                         
                    //Create an entry in session storage with name "absrDetailsAddDays" and value {"data":{"debug":true}}
                    let debug = storageSvc.load("absrDetailsAddDaysDebug") != null;                    

                    var absrState = $scope.absrState = absrStateVal;
                    var initialDataLoaders = [];
                    var emptyAbsrStateVal = $scope.emptyAbsrStateVal =  angular.copy(absrSvc.blankAbsrStateVal);
                    var variationData = null; 
                    $scope.absrState.isErrorWhileAddingDays = false;
                    
                    if ($scope.isMultiLocationSelectEnabled && $scope.selectedLocation != null) {
                        variationData = $scope.variationData =  $scope.variationDataByLocation;
                    } else {
                        variationData = $scope.variationData = $scope.emptyAbsrStateVal.absrVariations[0];
                        variationData.breakStartTime = absrStateVal.worker.defaultBreakStartTime;
                        variationData.breakEndTime = absrStateVal.worker.defaultBreakEndTime;
                        variationData.selectedSchools = [];
                        $scope.showResetIcon = false ;
                    }

                    var newAbsenceStartTime = variationData.absenceStartTime;
                    var newAbsenceEndTime = variationData.absenceEndTime;
                    $scope.emptyAbsrStateVal.worker = angular.copy(absrState.worker);
                    $scope.emptyAbsrStateVal.context = angular.copy(absrState.context);

                    $scope.absrState.absrVariationsError = [];

                    var organizationSettings = storageSvc.load('organizations')[0].settings;
	                $scope.canDeductCustomBreakTime = organizationSettings.ShowBreakTimeForCustomAbsences;
                    $scope.isMultiLocationSelectEnabled = featureSvc.get("MultiLocationSelectForAbsence").enabled;
                    $scope.entireDateRange=[];                                 
                    $scope.absrState.issueWith = null;
                    $scope.showRelatedCalendarData = featureSvc.get("ShowRelatedCalendarData").enabled;
                    
                    var isVacancy = emptyAbsrStateVal.worker.isVacancy; 
                    function getEntitlementTypeCacheKey(instId) {
                        return (isVacancy ? 'vacancy' : 'absence') + '_' + instId;
                    }
                    var isCreateMode = isVacancy ? $location.url().includes('create-vacancy-details') : $location.url().includes('create-absence-details');
                    variationData.isReasonCreateMode = isCreateMode;
                    absrState.isAddDaysEditCreateMode = !isCreateMode && $location.url().includes('/edit') && absrState.isAddDaysEditCreateMode != undefined;
                    $scope.canViewOrEditBreakTime = false;
                    $scope.canViewAbsenceDuration = false;
                    if (variationData.deductCustomBreakTime == null && absrSvc.showHideAbsenceBreakTime(variationData) ) { 
                        variationData.deductCustomBreakTime = true;
                    }
                    if (variationData.doesBreakTimeOverlapAbsenceTimes == null && absrSvc.showHideAbsenceBreakTime(variationData) ) { 
                        variationData.doesBreakTimeOverlapAbsenceTimes = true;
                    }   
                    // View Model properties
                    var vm = $scope.vm = {
                        startDate: null,
                        endDate: null,
                        showRange: true,
                        selectabledow: $scope.emptyAbsrStateVal.context.selectableDOW,
                        dragSelectdow: $scope.emptyAbsrStateVal.context.dragSelectDOW,
                        minSystemDate: dateHelp.getMinSystemDate(),
                        disabledDates: [],
                        bugdetCodeList:[],
                        payCodeList:[],
                        accountingCodeList:[],
                        uniqueId: $scope.uniqueId,
                        institutionList: [],
                        shouldShowSubTimeFields:  $scope.emptyAbsrStateVal.context.showVacancyTimes,
                        instSettings: null,  
                        editable: {
                            date: isCreateMode? true : absrState.editMode && absrState.context.editDates,
                            absenceTime: isCreateMode? true : absrState.editMode && absrState.context.editAbsenceTimes,
                            vacancyTime: isCreateMode? true : absrState.editMode && absrState.context.editVacancyTimes,
                            institution: isCreateMode? true : absrState.editMode && absrState.context.editInstitution,
                            entitlement: isCreateMode? true : absrState.editMode && absrState.context.editEntitlementType,
                            userSpecifiedAbsenceDuration: isCreateMode? true : absrState.editMode && absrState.context.editUserSpecifiedAbsenceDuration,
                            nonPayTime: isCreateMode? true : absrState.editMode && absrState.context.editNonPayTime,
                            budgetCode: isCreateMode? true : absrState.editMode && absrState.context.editBudgetCode,
                            payCode: isCreateMode? true : absrState.editMode && absrState.context.editPayCode,
                            hoursSubWorked: isCreateMode? true : absrState.editMode && absrState.context.editHoursSubWorked,
                            accountingCode: isCreateMode? true : absrState.editMode && absrState.context.editAccountingCode,
                        },
                        enableField : false,
                        allowAddingDay : false,
                        isOnlyInstitute : false,
                        SelectFromDate: 'SelectFromDate',
                        SelectToDate:'SelectToDate',
                        isVacancy:isVacancy,
                        absenceDuration: null,
                        sortedSchools: [],
                        allDates: [],
                        canSelectHiddenAbsenceReasons:  absrState.context.CanSelectHiddenAbsenceReasons
                    };
                    
                    //Set Institution list
                    if (emptyAbsrStateVal.worker) {
                        vm.institutionList = angular.copy(emptyAbsrStateVal.worker.schools);
                        vm.institutionList = arrayHelp.distinctObjectList(vm.institutionList, 'id');
                        if (vm.institutionList.length === 1) {
                            variationData.institution = vm.institutionList[0];
                            vm.isOnlyInstitute = true;
                            vm.enableField=true;
                        } else {
                            vm.institutionList.forEach(school => {
                                school.enabled = true;
                            });
                        }
                        if(absrState.absr != null && absrState.absr.absences.length>0 && $scope.selectedLocation == null){
                            variationData.institution = angular.copy(absrState.absr.absences[0].institution);
                        }
                        if(!vm.editable.institution)
                        {
                            vm.isOnlyInstitute = true
                        }
                    }

                    vm.institutesAccountingCodeList = [];
                    vm.workerTypeAndInstituteEntitlementTypeList = [];
                    $scope.$watchCollection('variationData.selectedSchools', function (newValue, oldValue) {
                        getOverlappingEvents();
                        if (absrStateVal.worker.schools.length > 1 && $scope.isMultiLocationSelectEnabled) {
                            variationData.selectedSchools = newValue;
                            var schools = [];
                            absrStateVal.worker.schools.forEach(school => {
                                newValue.forEach(value => {
                                    if (school.id == value){
                                        schools.push(school);
                                    }
                                });
                            });

                            vm.sortedSchools = schools.sort(function(a,b){
                                if (a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
                                if (a.value.toLowerCase() > b.value.toLowerCase()) { return  1; }
                            });
                            $scope.selectedInstId = null; $scope.removedInstId = null;
                            // Fetching the selected or removed institution from the multi-select institution list to trigger the variationData institution
                            if (variationData.selectedSchools.length > 0 && oldValue && newValue) {
                                var indexOfInst = 0;
                                if (oldValue == newValue) {
                                    $scope.selectedInstId = newValue;
                                    indexOfInst = absrStateVal.worker.schools.findIndex(x=>x.id == $scope.selectedInstId);
                                } else if (newValue.length > oldValue.length) {
                                    $scope.selectedInstId = newValue.filter(x=> !oldValue.includes(x)); 
                                    indexOfInst = absrStateVal.worker.schools.findIndex(x=>x.id == $scope.selectedInstId);
                                }
                                else {
                                    $scope.removedInstId = oldValue.filter(x=> !newValue.includes(x));
                                    indexOfInst = absrStateVal.worker.schools.findIndex(x=>x.id == $scope.removedInstId);
                                }
                                variationData.institution = $scope.institutionRemoved ? vm.sortedSchools[0]  : absrStateVal.worker.schools[indexOfInst];
                            } else {
                                variationData.institution = null;
                                vm.institutesAccountingCodeList = [];
                                vm.workerTypeAndInstituteEntitlementTypeList = [];
                            }
    
                            // Removing the accouting codes for the un-checked institution from the institutesAccountingCodeList
                            if($scope.removedInstId != null && $scope.selectedSchools == undefined) {
                                vm.institutesAccountingCodeList = vm.institutesAccountingCodeList.filter(x=>x.institutionId != $scope.removedInstId ||x.id == 0);
                                // Removing the Entitlement types for the un-checked institution from the workerTypeAndInstituteEntitlementTypeList                         
                                vm.workerTypeAndInstituteEntitlementTypeList = vm.workerTypeAndInstituteEntitlementTypeList.filter(x=>x.institutionId != $scope.removedInstId);
                                if(vm.workerTypeAndInstituteEntitlementTypeList == 0)
                                {
                                    var entitlementTypesFromCache = storageSvc.load("instAbsenceReasons") === null ? {} : storageSvc.load("instAbsenceReasons");  
                                    //populating Entitlement Types  when selected locations have same EntitlementTypeList  and one of them gets unchecked                            
                                    var entitlementTypesList = entitlementTypesFromCache[getEntitlementTypeCacheKey($scope.removedInstId)]; 
                                    if (entitlementTypesList != undefined) {
                                        vm.workerTypeAndInstituteEntitlementTypeList = entitlementTypesList.map(function (v, i, a) {
                                            return { id: v.id, value: v.value, institutionId: v.institutionId };
                                        }); 
                                    }
                                }
                            }                

                            // Setting the values for the multi-location view of add days popup
                            if ($scope.isMultiLocationSelectEnabled && $scope.selectedLocation != undefined) {
                                vm.individualLocationDetails = true;
                                variationData.institution = $scope.selectedLocation;
                                variationData.startDate = vm.startDate = $scope.variationDataByLocation.startDate;
                                variationData.endDate = vm.endDate = $scope.variationDataByLocation.endDate;
                                variationData.accountingCode = $scope.variationDataByLocation.accountingCode;
                                variationData.entitlementType =  $scope.variationDataByLocation.entitlementType;
                                variationData.budgetCode = $scope.variationDataByLocation.budgetCode;
                                variationData.payCode = $scope.variationDataByLocation.payCode;
                                variationData.nonPayTime = $scope.variationDataByLocation.nonPayTime;
                                variationData.subHourWorked = $scope.variationDataByLocation.subHourWorked;
                                variationData.absenceShiftType = $scope.variationDataByLocation.absenceShiftType;
                                variationData.vacancyShiftType = $scope.variationDataByLocation.vacancyShiftType;
                                variationData.timeAbsent = $scope.variationDataByLocation.timeAbsent;
                                variationData.IsBreakTimeEdited = $scope.variationDataByLocation.IsBreakTimeEdited;
                                variationData.isBreakCustomized = $scope.variationDataByLocation.isBreakCustomized;
                                variationData.doesBreakTimeOverlapAbsenceTimes = $scope.variationDataByLocation.doesBreakTimeOverlapAbsenceTimes;
                                if(vm.startDate == vm.endDate && $scope.variationDataByLocation.dates.length == 0) { 
                                    $scope.variationDataByLocation.dates.push(vm.startDate);
                                }
                                variationData.dates = $scope.variationDataByLocation.dates;
                                variationData.locationWiseDragSelectDow = vm.dragSelectdow = ($scope.variationDataByLocation.locationWiseDragSelectDow == null ? vm.dragSelectdow : $scope.variationDataByLocation.locationWiseDragSelectDow);
                                variationData.locationWiseSelectableDow = vm.selectabledow = ($scope.variationDataByLocation.locationWiseSelectableDow == null ? vm.selectabledow : $scope.variationDataByLocation.locationWiseSelectableDow);
                            }
                        }
                        var workerAccountingCode = variationData.accountingCode || emptyAbsrStateVal.worker.accountingCode || null;                    
                        function setDefaultAccountingCode() {                       
                            variationData.accountingCode = absrVariationHelp.setDefaultDropdownOption({
                                options: $scope.isMultiLocationSelectEnabled && !vm.individualLocationDetails ? vm.institutesAccountingCodeList : vm.accountingCodeList,
                                item: workerAccountingCode,
                                    allowDeleted: false
                            });
                        };  

                        var instId, dataLoaders = [];
                        $scope.$watch('variationData.institution.id', function (inst, oldInst) {
                            vm.enableField = inst != undefined;                            
                            validate();
    
                            // update active institution list
                            absrSvc.setAbsrInstIds();
                            // clear data
                            if (inst) {
                                instId = (typeof inst === 'object') ? inst.id : inst;
                                let oldInstId = (typeof oldInst === 'object') ? oldInst.id : oldInst
    
                                if (instId != oldInstId){
                                    getOverlappingEvents();
                                    absrSvc.setDefaultBreakTime(instId);
                                    setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, variationData.absenceEndTime, variationData.absenceStartTime, variationData.absenceEndTime);
                                }
                            
                                vm.accountingCodeList = [];
                                vm.entitlementTypeList = [];
                                vm.instDependantDataReady = false;
    
                                // Setting the absence / break start / end time values for the multi-location view if its being customized
                                if ($scope.isMultiLocationSelectEnabled && vm.individualLocationDetails && $scope.variationDataByLocation.absenceShiftType.id == 4) {
                                    variationData.absenceStartTime = dateHelp.convertTimeToMilitaryTime($scope.variationDataByLocation.absenceStartTime);
                                    variationData.absenceEndTime = dateHelp.convertTimeToMilitaryTime($scope.variationDataByLocation.absenceEndTime);
                                    variationData.breakStartTime = dateHelp.convertTimeToMilitaryTime($scope.variationDataByLocation.breakStartTime);
                                    variationData.breakEndTime = dateHelp.convertTimeToMilitaryTime($scope.variationDataByLocation.breakEndTime);
						            variationData.vacancyStartTime = dateHelp.convertTimeToMilitaryTime($scope.variationDataByLocation.vacancyStartTime);
						            variationData.vacancyEndTime = dateHelp.convertTimeToMilitaryTime($scope.variationDataByLocation.vacancyEndTime);
                                } else {
                                    // get the inst settings
                                    vm.instSettings = emptyAbsrStateVal.context.InstitutionSettings
                                    .filter(function (v, i, a) {
                                        return v.id === ($scope.isMultiLocationSelectEnabled && absrState.worker.schools.length > 1 && variationData.selectedSchools.length > 0 ? vm.sortedSchools[0].id : instId);
                                    });
                                    vm.instSettings = vm.instSettings.length && vm.instSettings[0] || null;
                                }

                                var accountingCodesByInstituteCache = storageSvc.load("instAccountingCodes") === null ? {} : storageSvc.load("instAccountingCodes");
                                var accountingCodes = accountingCodesByInstituteCache[instId];
                                if (emptyAbsrStateVal.context.showAccountingCode && !$scope.removedInstId) {
                                    // fetch accounting codes
                                    if(accountingCodes != undefined) {
                                        vm.accountingCodeList = accountingCodes.map(function (v, i, a) {
                                            return { id: v.id, value: v.value, institutionId: v.institutionId };
                                        });
                                    }
                                    else {
                                        dataLoaders.push(
                                            accountingCodeApi.queryCached({
                                                workId: emptyAbsrStateVal.worker.id,
                                                instId: instId,
                                                enforceMultiLocPerm: true,
                                                fields: '(id,name)'
                                            }).then(function (codes) {
                                                vm.accountingCodeList = codes.map(function (v, i, a) {
                                                    return { id: v.id, value: v.name, institutionId: instId };
                                                });
                                               setDefaultAccountingCode() ;                   

                                                accountingCodesByInstituteCache[instId] = vm.accountingCodeList;
                                                storageSvc.save({
                                                    key: 'instAccountingCodes',
                                                    data: accountingCodesByInstituteCache,
                                                    persistent: false
                                                });
                                            }, function () { })
                                        );
                                    }
                                       
                                    //if we're trying to default to a custom accounting code, set it's id to 0 which is what "Custom" is in the list.
                                    var defaultingCustomAccountingCode = workerAccountingCode != null && workerAccountingCode.isFreeForm;
                                    if (defaultingCustomAccountingCode) {
                                        workerAccountingCode.id = 0;
                                    }
                                    setDefaultAccountingCode() ;      
                                    //also, populate the name of the custom accounting code for vm binding.
                                    if (defaultingCustomAccountingCode) {
                                        variationData.customAccountingCode = workerAccountingCode.name;                                           
                                    }
                                }
                                
                                var entitlementTypeByWorkerTypeAndInstituteCache = storageSvc.load("instAbsenceReasons") === null ? {} : storageSvc.load("instAbsenceReasons");
                                var entitlementTypeCacheKey = getEntitlementTypeCacheKey(instId);
                                var entitlementTypesByInstituteId = entitlementTypeByWorkerTypeAndInstituteCache[entitlementTypeCacheKey];                                                      
                                // fetch absence absReasons (entitlement types) 
                                if (emptyAbsrStateVal.context.showEntitlementType && !$scope.removedInstId) { 
                                    if (entitlementTypesByInstituteId != undefined) {
                                        vm.entitlementTypeList = entitlementTypesByInstituteId.map(function (v, i, a) {
                                            return { id: v.id, value: v.value, institutionId: v.institutionId,isHiddenReason: v.isHiddenReason };
                                        });                    
                                        if (!vm.canSelectHiddenAbsenceReasons) {
                                            vm.entitlementTypeList = vm.entitlementTypeList.filter(x => !x.isHiddenReason);
                                        } 
                                    }
                                    else {                  
                                        dataLoaders.push(
                                            entitlementTypeApi.queryCached({
                                                workId: emptyAbsrStateVal.worker.id,
                                                isVacancyType: emptyAbsrStateVal.worker.isVacancy,
                                                instId: instId,                                   
                                                fields: '(id,name,notesToAdminRequired,isHiddenReason)',
                                                canSelectHiddenAbsenceReasons: vm.canSelectHiddenAbsenceReasons
                                            }).then(function (enttTypes) {
                                                vm.entitlementTypeList = enttTypes.map(function (v, i, a) {
                                                    return { id: v.id, value: v.name,institutionId: instId,isHiddenReason: v.isHiddenReason };
                                                }); 

                                                if (!vm.canSelectHiddenAbsenceReasons) {
                                                        vm.entitlementTypeList = vm.entitlementTypeList.filter(x => !x.isHiddenReason);
                                                }
                                                entitlementTypeByWorkerTypeAndInstituteCache[entitlementTypeCacheKey] =  vm.entitlementTypeList;
                                                storageSvc.save({
                                                    key: 'instAbsenceReasons',
                                                    data: entitlementTypeByWorkerTypeAndInstituteCache,
                                                    persistent: false
                                                });

                                                variationData.entitlementType = absrVariationHelp.setDefaultDropdownOption({
                                                    options: $scope.isMultiLocationSelectEnabled && !vm.individualLocationDetails ? vm.workerTypeAndInstituteEntitlementTypeList : vm.entitlementTypeList ,
                                                    item: variationData.entitlementType,
                                                    allowDeleted: false
                                                });
                                            }, function () { })
                                        );
                                    }
                                }
    
                                $q.all(dataLoaders).then(function () {
                                    vm.instDependantDataReady = true;
                                    if($scope.isMultiLocationSelectEnabled){
                                        vm.accountingCodeList.forEach(value => {
                                            if (vm.institutesAccountingCodeList.findIndex(x=>x.id == value.id) == -1) {
                                                vm.institutesAccountingCodeList.push(value);
                                            }
                                        });
                                        setDefaultAccountingCode() ;                   
                                        if(!vm.individualLocationDetails && absrState.worker.schools.length > 1 && variationData.selectedSchools.length == 0){
                                            vm.institutesAccountingCodeList = [];
                                            vm.workerTypeAndInstituteEntitlementTypeList = [];
                                        }
                                        vm.institutesAccountingCodeList = vm.institutesAccountingCodeList.map(function (v, i, a) {
                                            return { id: v.id, value: v.value, institutionId: v.institutionId };
                                        });
                                        
                                        vm.entitlementTypeList.forEach(value => {
                                            if (vm.workerTypeAndInstituteEntitlementTypeList.findIndex(x=>x.id == value.id) == -1) {
                                                vm.workerTypeAndInstituteEntitlementTypeList.push(value);
                                            }
                                        });
                                        vm.workerTypeAndInstituteEntitlementTypeList = vm.workerTypeAndInstituteEntitlementTypeList.map(function (v, i, a) {
                                            return { id: v.id, value: v.value, institutionId: v.institutionId, isHiddenReason: v.isHiddenReason };
                                        });
                                    }
                                });
                            } else {
                                vm.entitlementTypeList = [];
                                vm.instSettings = null;
                            }
                        });
                    });
                    
                    $scope.$watch('variationData.entitlementType.id', validate); 
                    $scope.$watch('variationData.absenceStartTime', validate) 
                    $scope.$watch('variationData.vacancyStartTime', validate);
                    $scope.$watch('variationData.absenceEndTime', validate);
                    $scope.$watch('variationData.vacancyEndTime', validate);
                    $scope.$watch('variationData.startDate', validate);
                    $scope.$watch('variationData.endDate',validate);
                    $scope.$watch('variationData.timeAbsent',validate);
                    var newStartDate; var newEndDate;
                    $scope.$watch('variationData.startDate', function(nVal, oVal){
                        
                        if(nVal != oVal) {
                            if (nVal != null || nVal != undefined) { newStartDate = nVal; }
                            vm.startDate = variationData.startDate = (nVal == null) ? newStartDate : nVal;
                            go.changeStartDate(vm.startDate, false);
                            $scope.removeErrorMessages();
                            getOverlappingEvents();
                        }
                    });
                    $scope.$watch('variationData.endDate', function(nVal, oVal){
                        
                        if(nVal != oVal) {
                            if (nVal != null || nVal != undefined) { newEndDate = nVal; }
                            vm.endDate = variationData.endDate = (nVal == null) ? newEndDate : nVal;
                            go.changeEndDate(vm.endDate);
                            $scope.removeErrorMessages();
                            getOverlappingEvents();
                        }
                    });

                    //Binding input fields with first absence values.
                    bindModelWithDefaultValues();
                    
                   //Set Budget codes
                    if (emptyAbsrStateVal.context.showBudgetCode) {
                        budgetCodeSvc.ready.then(function (budgetCodeData) {
                            vm.bugdetCodeList = budgetCodeData.map(function (v) {
                                return { id: v.id, value: v.description };
                            });

                            variationData.budgetCode = variationData.budgetCode || emptyAbsrStateVal.worker.budgetCode || null;

                            if( absrState.absr != null && absrState.absr.absences.length>0 && $scope.selectedLocation == null){
                                variationData.budgetCode = angular.copy(absrState.absr.absences[0].budgetCode);
                            }

                            variationData.budgetCode = absrVariationHelp.setDefaultDropdownOption({
                                options: vm.bugdetCodeList,
                                item: variationData.budgetCode,
                                allowDeleted: false
                            });
        
                        });
                        initialDataLoaders.push(budgetCodeSvc.ready);
                    }

                    //Set Pay Code
                    if (emptyAbsrStateVal.context.showPayCode ) {
                        payCodeSvc.ready.then(function (payCodeData) {
                            vm.payCodeList = payCodeData.map(function (v) {
                                return { id: v.id, value: v.description };
                            });

                            if( absrState.absr != null && absrState.absr.absences.length>0 && $scope.selectedLocation == null){
                                variationData.payCode = angular.copy(absrState.absr.absences[0].payCode);
                            }

                            variationData.payCode = absrVariationHelp.setDefaultDropdownOption({
                                options: vm.payCodeList,
                                item: variationData.payCode,
                                allowDeleted: false
                            });

                        });
                        initialDataLoaders.push(payCodeSvc.ready);
                    }

                    $scope.removeErrorMessages = function() {
                        $scope.absrState.isErrorWhileAddingDays = false;
                        var variationError = $scope.absrState.absrVariationsError.filter(error => error.value == true);
                        for (var i = 0; i < variationError.length; i++) {
                            $("div[unique-id='" + variationError[i].key + "']").find("input[name='startDate']").removeClass('error');
                            $("div[unique-id='" + variationError[i].key + "']").find("input[name='endDate']").removeClass('error');
                            $("div[unique-id='" + variationError[i].key + "']").find("select[unique-id='absrEmpShift" + variationError[i].key + "']").removeClass('empShiftTypeOverlapError');
                        }
                    }

                    function loopDateRange(startDate, endDate, rangeSelectedFromDt = false) {
                        var newRange = [];
                        var entireDateRange= [];

                        if (!vm.dragSelectdow[new Date(startDate).getDay()] || !vm.dragSelectdow[new Date(endDate).getDay()] ){ 
                            if (!vm.dragSelectdow[new Date(startDate).getDay()]){
                                $scope.absrState.issueWith = 'startDate';
                            } else {
                                $scope.absrState.issueWith = 'endDate';
                            }
                            return newRange; 
                        } else {
                            $scope.absrState.issueWith = null;
                        }
                        if(startDate == null && endDate == null) { return newRange; }
                        if((startDate == null || startDate.length ===0 ) && endDate!=null &&  endDate.length>0 ){startDate = endDate;}
                        if((endDate == null|| endDate.length === 0 ) && startDate!=null && startDate.length>0 ) {endDate = startDate;}
                
                        const tempStartDate = new Date(startDate);
                        const tempEndDate = new Date(endDate);
                        
                        for (var date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1))
                         { 
                            if(vm.dragSelectdow[date.getDay()] || (rangeSelectedFromDt && isDateABoundaryValue(date, tempStartDate, tempEndDate)))
                                {
                                    newRange.push(date.toString('MM/dd/yyyy'));
                            }
                             entireDateRange.push(date.toString('MM/dd/yyyy'));
                            
                        }
                        variationData.locationWiseDragSelectDow = vm.dragSelectdow;
                        variationData.locationWiseSelectableDow = vm.selectabledow;
                        $scope.entireDateRange=entireDateRange;
                       
                        return newRange;
                    }

                    function removingDisabledDates(newDates){
                        //determine if the removal of any disabled dates was attempted
                        var invalidRemovalDates = vm.disabledDates.filter(function(d) { return newDates.indexOf(d) < 0});
                        if (invalidRemovalDates.length > 0){
                            $scope.$emit('locked-dates', {dates: invalidRemovalDates});
                            return true;
                        } else {
                            return false;
                        }
                    }

                    function setStartAndEndDates(dates, reset){
                        if (dates.length === 1) {
                            var date = dates[0];
                            if($scope.startDate === null || $scope.startDate.length > 0 || reset) { vm.startDate = $scope.startDate = date; }
                            if($scope.endDate === null  || $scope.endDate.length > 0 || reset) { vm.endDate = $scope.endDate = date; }
                            vm.showRange = true;
                        } else if (dates.length > 1) {
                            rangeCalculation(dates);
                        } else {
                            vm.startDate = $scope.startDate = $scope.variationData.startDate= null;
                            vm.endDate = $scope.endDate = $scope.variationData.endDate= null;
                            vm.showRange = true;
                        }
                    }
                
                    function rangeCalculation(dates) {
                        vm.showRange = absrVariationHelp.isRangeConsecutive(dates, $scope.dragSelectdow);
                        if(vm.showRange){
                            vm.startDate = $scope.startDate = dates[0];
                            vm.endDate = $scope.endDate = dates[dates.length -1];
                        }else{
                            vm.startDate= $scope.startDate = $scope.variationData.startDate =null;
                            vm.endDate = $scope.endDate = $scope.variationData.endDate= null;
                        }
                    }

                    const isDateABoundaryValue = (date, startDate, endDate) => {
                        return (+startDate === +date || +endDate === +date);
                    };

                    var go = $scope.go = {
                        changeStartDate:(val, compareWithOldValue = true) => {
                            var value = angular.isDate(val) ? val.toString('MM/dd/yyyy') : val;
                            $scope.variationData.startDate=value;
                           
                            //Check if New Value is equal to Old Value
                            if ( compareWithOldValue && angular.equals(value, vm.startDate)) { return; }
                            // Check if the new Value is invalid
                            if (value.length && !regexHelp.dateString().test(value)) { return; }
                            // Check if second value is null
                            if(value.length && vm.endDate==null)
                            {
                                variationData.endDate=vm.endDate=value;
                            }
                            // Check if the Second value is also valid then doing comparision
                            if (value.length && regexHelp.dateString().test(vm.endDate) &&
                                (new Date(value) > new Date(vm.endDate))) {
                                    
                                val = variationData.endDate = variationData.endDate= vm.endDate = value;
                               
                            }
                            //if New is empty then setting VM value also to the new value
                            if (value.length === 0) {
                                vm.startDate = val;
                            }

                            // //Determine if we really can make this change based on any disabled dates
                            var oldDateList = $scope.variationData.dates;
                            var potentialDateUpdate = loopDateRange(val, vm.endDate);
                            
                            if (vm.disabledDates.length > 0 && removingDisabledDates(potentialDateUpdate)) {
                                //If this would remove a disabled date, reset
                                $timeout(function () {
                                    setStartAndEndDates(oldDateList, true);
                                }, 100);
                            } else {
                                $scope.variationData.dates = potentialDateUpdate;
                               
                            }
                       },
                        changeEndDate: (val) => {
                            if (val == null) { val = $('#absrEnd').val(); } //if weekday checkbox checked/unchecked
                            var value = angular.isDate(val) ? val.toString('MM/dd/yyyy') : val;
                            $scope.variationData.endDate = value;
                            
                            // Check if the new Value is invalid
                            if(value.length && !regexHelp.dateString().test(value)) { return; }
                            // Check if second value is null
                            if(value.length && vm.startDate==null)
                            {
                                variationData.startDate=vm.startDate=value;
                            }
                            // Check if the Second value is also valid then doing comparision
                            if(regexHelp.dateString().test(vm.startDate) &&
                                (new Date(value) < new Date(variationData.startDate))) {
                                    val =  variationData.startDate= variationData.endDate= vm.startDate = vm.endDate= value;
                            }
                            //if New is empty then setting VM value also to the new value
                            if(value.length === 0){
                                vm.endDate = val;
                            }
                
                            // //Determine if we really can make this change based on any disabled dates
                            var oldDateList=$scope.variationData.dates;
                            var potentialDateUpdate = loopDateRange(vm.startDate, val);
                            
                            if (vm.disabledDates.length > 0 && removingDisabledDates(potentialDateUpdate)){
                                //If this would remove a disabled date, reset
                                $timeout(function(){
                                      setStartAndEndDates(oldDateList, true);
                                }, 100);
                            } else {
                                $scope.variationData.dates = potentialDateUpdate;
                                
                            }
                            
                        },
                        enableDisableCustomBreakTime: function(){
                            variationData.deductCustomBreakTime = !variationData.deductCustomBreakTime;
                            setRectifiedOrDefaultBreakTime(!variationData.deductCustomBreakTime, variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime);                           
                            variationData.isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, variationData.isBreakCustomized);
                            $scope.showResetIcon = false;
                            
                            // TO DO: key: setDefaultBreakTime is not needed any more, will have to be removed.
                            storageSvc.save({
                                key: 'setDefaultBreakTime',
                                data: true,
                                persistent: false
                            });
                        },
                        resetBreakTime:function(){ 
                            absrSvc.setDefaultBreakTime(variationData.institution.id);
                            let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakStartTime);
                            let absenceStartTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime); 
                            let absenceEndTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime); 
                            let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakEndTime);
                            let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime); 
                            let absenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime); 

                            // TO DO: these conditions are needed to be revisited for optimization
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
                    // Get mnemonics that this component needs
                    var strings = $scope.strings = stringSvc.getStrings([
                        'ApprovalList.Label.Text.StartDate',
                        'ApprovalList.Label.Text.EndDate',
                        'School',
                        'AbsenceReason',
                        'VacancyReason',
                        'BudgetCode',
		                'AccountingCode',
                        'PayCode',
                        'EnterValidAMPMTime',
                        'SubstituteReportTime',
                        'AbsenceType',
                        'VacancyType',
                        'StartTime',
                        'EndTime',
                        'TimeAbsent',
                        'HoursSubWorked',
                        'SubTimes',
                        'NonPayTime',
                        'PayCode',
                        'Cancel',
                        'AddDay',
                        'ErrorMessage.MaxDays',
                        'ErrorMessage.SkippedDates.StartDate',
                        'ErrorMessage.SkippedDates.EndDate',
                        'NoneSelected',
                        'DeductBreak',
                        'AddDaysTo',
                        'Cancel',
                        'ErrorMessage.OverlapsMustBeCorrected',
                        'OverlappingEvents.Text'
                    ]);

                    var mnemonic = $scope.mnemonic = {
                        reasonTitle: isVacancy ? 'VacancyReason' : 'AbsenceReason',
                        typeTitle: isVacancy ? 'VacancyType' : 'AbsenceType',
                    }

                    // Method to check the overlapping of dates and time with in the Absence Request absences.
                    function checkWithAbsenceShiftAndTimeOverlap(actualGroup, storedAbsences) {
                        for (var i = 0; i < storedAbsences.length; i++) {
                            var comparingGroup = absrState.absr.absences[i];
                            comparingGroup.dates = [];
                            comparingGroup.dates[0] = comparingGroup.date.split(' ')[0];
                            if (actualGroup.absenceShiftType != null){
                                var actualGroupShiftType = parseInt(actualGroup.absenceShiftType.id);
                                var comparingGroupShiftType = parseInt(comparingGroup.shiftType.id);
                                if (actualGroupShiftType === 1) {
                                    switch (comparingGroupShiftType) {
                                        case 1:
                                        case 2:
                                        case 3:
                                            if (!checkForOverlappingDates(actualGroup.dates, comparingGroup.dates)) { continue; }
                                            else { return true; }
                                        default:
                                            //Check for time Conflicts
                                            if (!haveOverlaps(actualGroup, comparingGroup)) { continue;}
                                            else { return true; }
                                    }
                                }else if(actualGroupShiftType === 2){
                                    switch (comparingGroupShiftType) {
                                        case 1:
                                        case 2:
                                            if (!checkForOverlappingDates(actualGroup.dates, comparingGroup.dates)) { continue;}
                                            else { return true; }
                                        case 3:
                                            return false;
                                        default:
                                            //Check for time Conflicts
                                            if (!haveOverlaps(actualGroup, comparingGroup)) { continue;}
                                            else { return true; }
                                    }
                                }else if(actualGroupShiftType === 3){
                                    switch (comparingGroupShiftType) {
                                        case 1:
                                            if (!checkForOverlappingDates(actualGroup.dates, comparingGroup.dates)) { continue;}
                                            else { return true; }
                                        case 2:
                                            return false;
                                        case 3:
                                            if (!checkForOverlappingDates(actualGroup.dates, comparingGroup.dates)) { continue;}
                                            else { return true; }
                                    default:
                                            //Check For time Conflicts
                                            if (!haveOverlaps(actualGroup, comparingGroup)) { continue;}
                                            else { return true; }
                                    }
                                }else{
                                        //Check for time Conflicts
                                        if (!haveOverlaps(actualGroup, comparingGroup)) { continue;}
                                        else { return true; }
                                }
                            } 
                        }
                    }

                    // Method to check the overlapping of dates and time with in the Absence Request variations for multi-location view
                    function checkShiftAndTimeOverlap(actualGroup, comparingGroup) {
                        if (actualGroup.absenceShiftType != null){
                            var actualGroupShiftType = parseInt(actualGroup.absenceShiftType.id);
                            var comparingGroupShiftType = parseInt(comparingGroup.absenceShiftType.id);
                            if (actualGroupShiftType === 1) {
                                switch (comparingGroupShiftType) {
                                    case 1:
                                    case 2:
                                    case 3:
                                        return checkForOverlappingDates(actualGroup.dates, comparingGroup.dates);
                                    default:
                                        //Check for time Conflicts
                                        return haveOverlaps(actualGroup, comparingGroup);
                                }
                            }else if(actualGroupShiftType === 2){
                                switch (comparingGroupShiftType) {
                                    case 1:
                                    case 2:
                                        return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
                                    case 3:
                                        return false;
                                    default:
                                        //Check for time Conflicts
                                        return haveOverlaps(actualGroup, comparingGroup);
                                }
                            }else if(actualGroupShiftType === 3){
                                switch (comparingGroupShiftType) {
                                    case 1:
                                        return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
                                    case 2:
                                        return false;
                                    case 3:
                                        return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
                                default:
                                        //Check For time Conflicts
                                        return haveOverlaps(actualGroup, comparingGroup);
                                }
                            }else{
                                    //Check for time Conflicts
                                    return haveOverlaps(actualGroup, comparingGroup);
                            }
                        }
                    }

                    //Helper methods to check the overlapping of absence date and time.
                    function haveOverlaps(actualGroup, comparingGroup) {
                        var actualGroupStartTime = dateHelp.parseTime(actualGroup.absenceStartTime);
                        var actualGroupEndTime = dateHelp.parseTime(actualGroup.absenceEndTime);
                
                        var comparingGroupStartTime = dateHelp.parseTime(comparingGroup.absenceStartTime);
                        var comparingGroupEndTime = dateHelp.parseTime(comparingGroup.absenceEndTime);
                
                        var haveOverlappingDates = checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
                        var haveOverlappingTime = checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime);
                
                        return haveOverlappingDates && haveOverlappingTime;
                    }
                
                    function checkForOverlappingDates(actualGroupDates,comparingGroupDates){
                        var dates = actualGroupDates.concat(comparingGroupDates).map(function (dateString) {
                            return {
                                date: dateString,
                                ms: (new Date(dateString)).getTime()
                            };
                        }).sort(function (a, b) { return a.ms - b.ms; });
                
                        var duplicates = dates.filter(function(v, i, a){
                            return v.ms === (a[i+1] || {}).ms;
                        }).map(function (v) { return v.date; });
                
                        return duplicates.length > 0;
                    }

                    function checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime) {
                        var haveStartTimeOverlaps = (comparingGroupStartTime >= actualGroupStartTime && comparingGroupStartTime < actualGroupEndTime);
                        var haveEndTimeOverlaps = (actualGroupStartTime >= comparingGroupStartTime && actualGroupStartTime < comparingGroupEndTime);
                        return haveStartTimeOverlaps || haveEndTimeOverlaps;
                    }

                    // To sort accountingcodes with custom at bottom
                    $scope.sortByNameWithCustomAtBottom= function (a, b) {
                            if (a.value.toLowerCase() === 'custom') { return 1; }
                            if (b.value.toLowerCase() === 'custom') { return -1; }
                            if (a.value < b.value) { return -1; }
                            if (a.value > b.value) { return 1; }
                            return 0;
                    }

                    $scope.validateIfSkipOverDateSelected = function() {
                        if ($scope.absrState.issueWith == "startDate"){
                            $scope.absrState.errorMessage = strings['ErrorMessage.SkippedDates.StartDate'];
                        } else {
                            $scope.absrState.errorMessage = strings['ErrorMessage.SkippedDates.EndDate'];
                        }
                    }

                    $scope.addDays = function() {
                        if($scope.isMultiLocationSelectEnabled && variationData.selectedSchools.length > 1)
                        {
                            if ($scope.absrState.issueWith != undefined) {
                                $scope.validateIfSkipOverDateSelected();
                                $scope.absrState.isErrorWhileAddingDays = true;                                
                                return;
                            }
                            ngDialog.close();
                            $scope.absrState.absrVariations = [];
                            for (var i = 0; i < vm.sortedSchools.length ; i++)
                            {
                                var data = angular.copy(variationData);
                                data.institution = vm.sortedSchools[i];
                                data.dates = variationData.dates;
                                data.startDate = variationData.startDate;
                                data.endDate = variationData.endDate;
                                data.allowDeleted = false;
                                data.isEditable = true;
                                data.newVariation = true;
                                $scope.absrState.absrVariations[i] = data;
                            }

                            var dialog = ngDialog.open({
                                template: '/components/absr/cmpt-absr-details-by-day-section/add-days.html',
                                closeByDocument: false,
                                showClose: true,
                                closeByEscape: false,
                                closeByNavigation: false,
                                className: 'ngdialog-theme-default section-multiLocation',
                                data: {
                                    header: $scope.strings['AddDaysTo'] + $scope.strings[mnemonic.typeTitle],
                                    multipleLocation: vm.sortedSchools,
                                    isMultiLocationSelectEnabled: $scope.isMultiLocationSelectEnabled,
                                    absenceVariations : $scope.absrState.absrVariations,
                                    buttons: [{
                                        title: $scope.strings['Cancel'],
                                        cls: 'fl-button',
                                        action: function () {
                                            $scope.closeDialog();
                                        }
                                    },{
                                        title: $scope.strings['AddDay'],
                                        cls: 'fl-button fl-primary',
                                        action: function () {
                                            $scope.AddDaysToAbsenceRequest();
                                        }
                                    }]
                                }
                            });
                        }
                        else
                        {
                            $scope.AddDaysToAbsenceRequest();    
                        }        
                    }

                    $scope.AddDaysToAbsenceRequest = function() {
                        $scope.absrState.absrVariationsError = [];
                        if(vm.allowAddingDay){                           
                            if (absrState.absr == null){
                                absrState.absr = [];
                                absrState.absr.absences = [];  
                            }
                            if(emptyAbsrStateVal.absrVariations[0].dates.length == 0){
                                go.changeStartDate(variationData.startDate, false);
                            }
                            var abs= absrSvc.stateValToAbsrModel($scope.isMultiLocationSelectEnabled && $scope.variationData.selectedSchools.length > 1 && $scope.absrState.absrVariations.length > 1 ? $scope.absrState : emptyAbsrStateVal, true);

                            if (abs.absences.length == 0 || abs.absences.length > 90 ){
                            if ( abs.absences.length > 90 ){
                                    $scope.absrState.errorMessage = strings['ErrorMessage.MaxDays'].replace('{0}', abs.absences[89].date);
                                } else {
                                    $scope.validateIfSkipOverDateSelected();
                                }
                                $scope.absrState.isErrorWhileAddingDays = true;                                
                                return;
                            }

                            if ($scope.isMultiLocationSelectEnabled && $scope.variationData.selectedSchools.length > 1 && $scope.absrState.absrVariations.length > 1) {
                                if ($scope.absrState.issueWith != undefined) {
                                    $scope.validateIfSkipOverDateSelected();
                                    $scope.absrState.isErrorWhileAddingDays = true;                                
                                    return;
                                }
                                for (var i = 0; i < $scope.absrState.absrVariations.length; i++) {
                                    $scope.detectConflict(i);
                                }
                            }
                            if ($scope.isMultiLocationSelectEnabled && $scope.absrState.absrVariations.length > 1 && $scope.absrState.absrVariationsError.findIndex(x=>x.value == true) > -1) {
                                $scope.absrState.errorMessage = strings['ErrorMessage.OverlapsMustBeCorrected'];
                                $scope.absrState.isErrorWhileAddingDays = true;

                                var variationError = $scope.absrState.absrVariationsError.filter(error => error.value == true);
                                for (var i = 0; i < variationError.length; i++) {
                                    $("div[unique-id='" + variationError[i].key + "']").find("input[name='startDate']").addClass('error');
                                    $("div[unique-id='" + variationError[i].key + "']").find("input[name='endDate']").addClass('error');
                                    $("div[unique-id='" + variationError[i].key + "']").find("select[unique-id='absrEmpShift" + variationError[i].key + "']").addClass('empShiftTypeOverlapError');
                                }
                                
                                return;
                            } else {
                                $scope.closeDialog();
                            }

                            if (absrState.absrVariations.length == 0 || absrState.absrVariations[0].absences == null){
                                absrState.absrVariations = [];
                            }

                            for(var i =0; i <=  abs.absences.length - 1; i++){
                                if (absrState.absr.absences.length > 0 && absrState.originalPlusRelatedAbsences != null){
                                    abs.absences[i].flag = "unrelated" + absrState.originalPlusRelatedAbsences.length + i;
                                    absrState.absr.absences.push(abs.absences[i]); 
                                    absrState.originalPlusRelatedAbsences.push(angular.copy(abs.absences[i]));
                                }
                                else{                                    
                                    absrState.absr.absences.push(abs.absences[i]); 
                                } 
                            }
                            $scope.absrState = absrSvc.getStateValFromAbsence(abs.absences, absrState.context,absrState);
                        }
                    }
                
                    //Method to detect the conflict with in an Absence request for the multi-location view
                    $scope.detectConflict = function(index) {
                        var conflictingDates =[];
                        var thisVariation = absrState.absrVariations[index];
                        var locked = false;

                        if(thisVariation != null) {
                            conflictingDates = thisVariation.dates;
                            if(thisVariation.institution == null) { return; }
                            for (var i = absrState.absrVariations.length - 1; i >= 0; i--) {
                                if(i === index){ continue; }
                                var otherVariation = absrState.absrVariations[i];
                                if(otherVariation.institution == null) { continue; }
                                if(checkShiftAndTimeOverlap(thisVariation,otherVariation)) {
                                    if (!otherVariation.isEditable) { locked = true; }
                                    conflictingDates = conflictingDates.concat(otherVariation.dates);
                                    //Setting the value of the variation as true if there is a conflict with other variation of the absence request
                                    $scope.absrState.absrVariationsError.push({key : 'variation' + index, value : true})
                                } else {
                                    //Setting the value of the variation as true if there is a conflict with any existing absence on the absence request
                                    if (checkWithAbsenceShiftAndTimeOverlap(thisVariation, absrState.absr.absences)) {
                                        $scope.absrState.absrVariationsError.push({key : 'variation' + index, value : true}) 
                                    }
                                }
                            }
                        }
                    }

                    $scope.closeDialog = function(){
                        ngDialog.close();
                    }
                   
                    $scope.$watch('variationData.absenceShiftType', linkSync);
                    $scope.$watch('variationData.timeIsLinked', linkSync);
                    $scope.$watch('variationData.absenceStartTime', calcVacancyStartTime);
                    $scope.$watch('variationData.absenceEndTime', calcVacancyEndTime);
                    
                    $scope.$watch('variationData.absenceStartTime', function (nVal, oVal){
                        if (nVal != null || nVal != undefined) { newAbsenceStartTime = nVal; }
                        variationData.absenceStartTime = (nVal === undefined) ? newAbsenceStartTime : nVal;
                        if(nVal !== null && $scope.canDeductCustomBreakTime 
                            && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
                            variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(nVal, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
                            if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, nVal, variationData.absenceEndTime, nVal, variationData.breakEndTime);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(nVal, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
                            variationData.isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, variationData.isBreakCustomized);
                        }
                        $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(nVal, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
                    });
                    $scope.$watch('variationData.absenceEndTime', function (nVal, oVal){
                        if (nVal != null || nVal != undefined) { newAbsenceEndTime = nVal; }
                        variationData.absenceEndTime = (nVal === undefined) ? newAbsenceEndTime : nVal;
                        if(nVal !== null && $scope.canDeductCustomBreakTime 
                            && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
                            variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, nVal, variationData.breakStartTime, variationData.breakEndTime);
                            if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, nVal, variationData.breakStartTime, nVal);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }
                            $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, nVal, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
                            variationData.isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, variationData.isBreakCustomized);
                        }
                        $scope.vm.absenceDuration = absrSvc.calculateAbsenceDuration(variationData.absenceStartTime, nVal, variationData.breakStartTime, variationData.breakEndTime, variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes);
                        
                        let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime);
                        if(dateHelp.convertTimeToMilitaryTime(nVal) == absenceBreakEndTime){
                            $scope.showResetIcon = false;                          
                        }
                    });
                    $scope.$watch('variationData.breakStartTime', function (nVal, oVal){
                        if(nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
                            variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, variationData.absenceEndTime, nVal, variationData.breakEndTime);
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
                            variationData.isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
				            $scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, variationData.isBreakCustomized);
                        } 
                        let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakStartTime);
                        let absenceStartTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime); 
                        let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakEndTime);
                        let absenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime);
                        let absenceEndTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime);                      
                        if (defaultAbsenceBreakStartTime != dateHelp.convertTimeToMilitaryTime(nVal)){
                            if(variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
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
                    $scope.$watch('variationData.breakEndTime', function (nVal, oVal){
                        if(nVal !== null && dateHelp.convertTimeToMilitaryTime(nVal) != dateHelp.convertTimeToMilitaryTime(oVal)){
                            variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, nVal);
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
                        variationData.isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
										&& ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
											|| (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
                        $scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, variationData.isBreakCustomized);
                        
                        let defaultAbsenceBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakEndTime);
                        let absenceEndTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime); 
                        let absenceStartTime = dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime); 
                        let defaultAbsenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrState.worker.defaultBreakStartTime);
                        let absenceBreakStartTime = dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime);                       
                        if (defaultAbsenceBreakEndTime != dateHelp.convertTimeToMilitaryTime(nVal)){
                            if(variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
                                if( defaultAbsenceBreakEndTime >= dateHelp.convertTimeToMilitaryTime(nVal)){
                                    if(absenceEndTime > dateHelp.convertTimeToMilitaryTime(nVal)){
                                        $scope.showResetIcon = true;
                                    } else {
                                        $scope.showResetIcon = false;
                                    }     
                                }
                            }                         
                        } else if(absenceBreakStartTime != defaultAbsenceBreakStartTime && absenceBreakStartTime != absenceStartTime) {
                            $scope.showResetIcon = true; 
                        }  else {
                            $scope.showResetIcon = false;   
                        }                                                                      
                    }});

                    // if the shiftTypeMode is 3, we need to limit the shift types to only full day
	                if (emptyAbsrStateVal.context.absenceShiftTypeMode === 3) {
	            	    emptyAbsrStateVal.context.absenceShiftTypes = emptyAbsrStateVal.context.absenceShiftTypes.filter(function (v) {
		                	return v.id === 1;
		                });
	                }

                    function linkSync() {
                       var shift = variationData.absenceShiftType && variationData.absenceShiftType.id || null,
                            isLinked = variationData.timeIsLinked;

                        if (isLinked) {
                            variationData.vacancyShiftType = emptyAbsrStateVal.context.vacancyShiftTypes
                                .filter(function (v, i, a) { return v.id === shift; })[0]; 
                            
                            calcVacancyStartTime(variationData.absenceStartTime);
                            calcVacancyEndTime(variationData.absenceEndTime);                       
                        }             

                        if (shift === 4 && $scope.canDeductCustomBreakTime) {
                            $scope.canViewOrEditBreakTime = absrSvc.showHideAbsenceBreakTime(variationData) && !isVacancy;
                            $scope.canViewAbsenceDuration = $scope.canViewOrEditBreakTime && (isCreateMode || absrState.editMode);
                            
                            variationData.doesBreakTimeOverlapAbsenceTimes = absrSvc.doesBreakTimeOverlapAbsenceTimes(variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
                            if (variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes){
                                setRectifiedOrDefaultBreakTime(false, variationData.absenceStartTime, variationData.absenceEndTime, variationData.breakStartTime, variationData.breakEndTime);
                            } else {
                                setRectifiedOrDefaultBreakTime(true);
                            }

                            variationData.isBreakCustomized = variationData.deductCustomBreakTime && variationData.doesBreakTimeOverlapAbsenceTimes 
                                && ((dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) && dateHelp.convertTimeToMilitaryTime(variationData.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variationData.breakStartTime)) 
                                    || (dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) && dateHelp.convertTimeToMilitaryTime(variationData.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variationData.absenceEndTime)))
                            
                            $scope.customBreakType = absrSvc.getBreakType(!variationData.doesBreakTimeOverlapAbsenceTimes, !variationData.deductCustomBreakTime, variationData.isBreakCustomized);
                        } else {
                            $scope.canViewOrEditBreakTime = false;
                            $scope.canViewAbsenceDuration = false;
                        }
                    }

                    function calcVacancyStartTime(newStartTime) {
                        if (vm.instSettings && variationData.timeIsLinked && variationData.absenceShiftType && variationData.absenceShiftType.id == 4) {
                            vm.instSettings.hasSubDefaultTimes = false;
                            variationData.vacancyStartTime = dateHelp.offSetTime(
                                newStartTime, // original time
                                vm.instSettings.defaultVacancyStartOffsetMinutes, // amount to offset
                                'hh:mm T' // format we want back
                            );
                        }

                    }
                    function calcVacancyEndTime(newEndTime) {
                        if (vm.instSettings && variationData.timeIsLinked && variationData.absenceShiftType && variationData.absenceShiftType.id == 4 ) {
                            vm.instSettings.hasSubDefaultTimes = false;
                            variationData.vacancyEndTime = dateHelp.offSetTime(
                                newEndTime, // original time
                                vm.instSettings.defaultVacancyEndOffsetMinutes, // amount to offset
                                'hh:mm T' // format we want back
                            );
                        }

                    }
                    function validate()
                    {
                        var isReasonRequiredAndSelected  = true
                        if(vm.isVacancy){
                            if (vm.entitlementTypeList != undefined && vm.entitlementTypeList.length > 0) {
                                if (variationData.entitlementType == null) {
                                    isReasonRequiredAndSelected = false;
                                }
                            }
                        }else{
                            if (variationData.entitlementType == null ) {
                                isReasonRequiredAndSelected = false;
                            }
                        }
                       if(isReasonRequiredAndSelected && variationData.startDate!=null && variationData.endDate!=null
                            && variationData.institution!=null )
                        {
                            if(vm.shouldShowSubTimeFields && absrState.context.editVacancyTimes && (variationData.vacancyStartTime== null || variationData.vacancyEndTime==null) )
                            {
                                vm.allowAddingDay=false;
                            }
                            else if( absrState.context.editAbsenceTimes && (variationData.absenceStartTime== undefined || variationData.absenceEndTime==undefined)) 
                            {
                                vm.allowAddingDay=false;
                            }
                            else if(emptyAbsrStateVal.context.showAbsenceTime && absrState.context.editUserSpecifiedAbsenceDuration && variationData.timeAbsent==null)
                            {
                                vm.allowAddingDay=false;
                            }
                            else{
                                vm.allowAddingDay=true;
                            }
                        }
                        else{
                            vm.allowAddingDay=false;
                        }
                    }
                    function bindModelWithDefaultValues()
                    {
                        if($scope.selectedLocation == undefined && absrState.absr != null && absrState.absr.absences.length>0) {
                            var nextDate = new Date(Math.max.apply(null, absrState.absr.absences.map(function(e) {
                                return new Date(e.date);
                              }))).addDays(1);
                            variationData.nonPayTime = angular.copy(absrState.absr.absences[0].nonPayTime);
                            variationData.subHourWorked = angular.copy(absrState.absr.absences[0].hoursSubWorked);
                            variationData.timeAbsent = angular.copy(absrState.absr.absences[0].userSpecifiedAbsenceDuration);
                            variationData.absenceShiftType = angular.copy(absrState.absr.absences[0].shiftType);
                            variationData.absenceStartTime = angular.copy(absrState.absr.absences[0].absenceStartTime);
                            variationData.absenceEndTime = angular.copy(absrState.absr.absences[0].absenceEndTime);
                            variationData.startDate = vm.startDate = parseDateFilter(angular.copy(nextDate), 'MM/dd/yyyy');
                            variationData.endDate = vm.endDate = parseDateFilter(angular.copy(nextDate), 'MM/dd/yyyy');
                            variationData.entitlementType = angular.copy(absrState.absr.absences[0].entitlement);
                            variationData.accountingCode = angular.copy(absrState.absr.absences[0].accountingCode);
                                if(variationData.accountingCode !=null && variationData.accountingCode.id === 0){
                                    variationData.customAccountingCode = angular.copy(absrState.absr.absences[0].customAccountingCode);
                              }
                            variationData.vacancyShiftType = angular.copy(absrState.absr.absences[0].substituteShiftType);
                            variationData.vacancyStartTime = angular.copy(absrState.absr.absences[0].substituteStartTime);
                            variationData.vacancyEndTime = angular.copy(absrState.absr.absences[0].substituteEndTime);
                            variationData.timeIsLinked = angular.copy(absrState.absr.absences[0].timesAreLinked);
                            variationData.breakEndTime = angular.copy(absrState.absr.absences[0].breakEndTime);
                            variationData.breakStartTime = angular.copy(absrState.absr.absences[0].breakStartTime);
							variationData.selectedSchools.push(absrState.absr.absences[0].institution.id);
                        }
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

                    // This method will fetch if there are any overlapping events i.e. absence, inServiceDay and closedDay, for the selected date range.
                    function getOverlappingEvents() {
                        // Feature flag check.
                        if (!$scope.showRelatedCalendarData){
                            return;
                        }

                        if ($scope.uniqueId){
                            // do nothing, just proceed.
                        }
                        else if ($scope.isMultiLocationSelectEnabled 
                            && absrStateVal.worker.schools.length > 1 
                            && (variationData.selectedSchools.length > 1 || variationData.selectedSchools.length == 0)){
                                variationData.groupedEvents = [];
                                return;
                        }
                        if (variationData.institution && variationData.institution.id
                            && variationData.startDate && variationData.endDate) {
                            if (debug) console.log(new Date().toISOString() + " " +"absrDetailsAddDays.js getOverlappingEvents" + " institutionId="+variationData.institution.id + ", startDate=" + variationData.startDate + ", endDate=" + variationData.endDate);
                            
                            let cachedData = getOverlappingEventsFromCache();
                            if (!cachedData.allMonthsOK) {
                                getOverlappingEventsFromAPI();
                            }
                        }
                    }
                    function getOverlappingEventsFromCache()
                    {
                        let cachedData = relatedCalendarDataSvc.getLocalCachedDataForDateRange(
                            variationData.startDate, variationData.endDate, 
                            variationData.institution.id,
                            absrStateVal.worker.id,
                            "GetOverlappingEvents",
                            absrStateVal.worker.isVacancy);
                        if (cachedData.allMonthsOK)
                        {
                            let variationStart = new Date(variationData.startDate);
                            let variationEnd = new Date(variationData.endDate);
                            let possibleOverlaps = cachedData.allMonthData.filter((item)=>{
                                let itemDate = new Date(item.Date);
                                return itemDate >= variationStart && itemDate <= variationEnd;
                            });
                            aggregateEvents(possibleOverlaps);
                        }

                        return cachedData;
                    }
                    function getOverlappingEventsFromAPI()
                    {
                        let variationStart = new Date(variationData.startDate);
                        let variationEnd = new Date(variationData.endDate);
                        let firstMonthStart = new Date(variationStart.getFullYear(), variationStart.getMonth(), 1).toString("MM/dd/yyyy");
                        let lastMonthEnd = new Date(variationEnd.getFullYear(), variationEnd.getMonth() + 1, 0).toString("MM/dd/yyyy");
                        let instId = $scope.uniqueId ? variationData.institution.id : ($scope.isMultiLocationSelectEnabled && absrStateVal.worker.schools.length > 1? variationData.selectedSchools[0] : variationData.institution.id);

                        absrSvc.relatedCalendarData(
                            firstMonthStart,
                            lastMonthEnd,
                            absrStateVal.worker.id,
                            instId,
                            !absrStateVal.worker.isVacancy,
                            true,
                            absrStateVal.worker.isVacancy
                        )
                        .then((response) => {
                            if (response.length <= 0) {
                                variationData.groupedEvents = [];
                                return;
                            }

                            let possibleOverlaps = response.filter((item)=>{
                                let itemDate = new Date(item.Date);
                                return itemDate >= variationStart && itemDate <= variationEnd;
                            });
                            relatedCalendarDataSvc.saveRangeInfoToCache(response, instId, "GetOverlappingEvents");
                            aggregateEvents(possibleOverlaps);
                        })
                    }
                    function aggregateEvents(events){
                        var aggregatedEvents = [];
                        $scope.numberOfEvents = 0;
                        events.forEach(event => {
                            aggregatedEvents.push({
                                date: event.Date,
                                isAbsence: !absrStateVal.worker.isVacancy && event.NumberOfAbsences > 0,
                                isInserviceDay: event.IsInserviceDay,
                                isClosedDay: event.IsClosedDay,
                            });
                        });

                        // removing vacancies from the collection
                        aggregatedEvents = aggregatedEvents.filter(event => {
                            if (event.isAbsence || event.isInserviceDay || event.isClosedDay)
                                return event;
                        });

                        if (aggregatedEvents.length == 0){
                            variationData.groupedEvents = [];
                            return;
                        }
                        
                        aggregatedEvents.forEach(event => {
                            event.eventTypes = [];
                            if (event.isAbsence) { 
                                event.eventTypes.push("A");
                                $scope.numberOfEvents++;
                            }
                            if (event.isInserviceDay) { 
                                event.eventTypes.push("IS");
                                $scope.numberOfEvents++;
                            }
                            if (event.isClosedDay) { 
                                event.eventTypes.push("C");
                                $scope.numberOfEvents++;
                            }
                        });
                        if ($scope.numberOfEvents > 0) { groupEvents(aggregatedEvents) };
                    }

                    function groupEvents(aggregatedEvents) {
                        variationData.groupedEvents = [];
                        
                        for(var i = 0; i < aggregatedEvents.length; i++){
                            if (aggregatedEvents[i].eventTypes.length == 1) {
                                var alreadyPresentDates = variationData.groupedEvents.filter(event => { 
                                    var dateRange = event.date.split('-');
                                    return new Date(dateRange[0]) <= new Date(aggregatedEvents[i].date)
                                        && new Date(aggregatedEvents[i].date) <= new Date(dateRange[1]);
                                });
                                if (variationData.groupedEvents.length != 0 && alreadyPresentDates.length > 0){
                                     continue;
                                }

                                var startDate = dateHelp.formatDate(new Date(aggregatedEvents[i].date), "MM/dd/yyyy");
                                var endDate = dateHelp.formatDate(new Date(aggregatedEvents[i].date), "MM/dd/yyyy");

                                for (var j = i; j < aggregatedEvents.length; j++) {
                                    var eventDate = new Date(aggregatedEvents[j].date);
                                    var nextEventDate = new Date(aggregatedEvents[aggregatedEvents.length - 1 == j ? j : j + 1].date);
                                    
                                    if (eventDate.getMonth() == nextEventDate.getMonth() 
                                        && eventDate.getDate() + 1 == nextEventDate.getDate()
                                        && aggregatedEvents[j + 1].eventTypes.length == 1
                                        && aggregatedEvents[j].eventTypes[0] == aggregatedEvents[j + 1].eventTypes[0]) {
                                            continue;
                                    } else {
                                        endDate = dateHelp.formatDate(new Date(aggregatedEvents[j].date), "MM/dd/yyyy");
                                        var date = startDate == endDate ? startDate.toString() : startDate.toString() + " - " + endDate.toString();
                                        variationData.groupedEvents.push({date: date, symbolsToBeShown: aggregatedEvents[j].eventTypes}); 
                                        break;       
                                    }
                                }
                            } else {
                                variationData.groupedEvents.push({
                                    date: dateHelp.formatDate(new Date(aggregatedEvents[i].date), "MM/dd/yyyy"), 
                                    symbolsToBeShown: aggregatedEvents[i].eventTypes}); 
                            }
                        }
                    }

                     $rootScope.$on("weekDaysCheckboxChanged", function (){ go.changeEndDate(vm.endDate) });
                }

            }
        });
}());
