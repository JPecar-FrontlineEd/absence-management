(function() {
    'use strict';
    angular.module('aesop').directive('cmptReportsFilterPanel', function() {
        return {

// directive options
restrict: 'E',
scope: {
    filters: '=',
    extraValidators: '=',
    action: '=',
    showPrintButton: '=?',
    autoExecute: '=?',
    originalFilters: '=?',
    downloadUrl: '=',
    isDailyReport:'=?',
    groupByAction: '=?'
},
replace: true,
templateUrl: '/components/reports/cmpt-reports-filter-panel/reportsFilterPanel.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-reports-filter-panel) ----# //
controller: function ($scope, $q, $location, stringSvc, $rootScope, institutionSvc,
                    permissionSvc, workerTypeSvc, entitlementTypeApi,
                    reportHelp, workerApi, stringHelp, userSvc, substituteApi,
                   parseDateFilter, parseAesopDateFilter, skillsApi, ngDialog,
                    arrayHelp,accountingCodeApi,budgetCodeApi, domHelp, dateHelp, $window, featureSvc) {

    var filters = $scope.filters;
    var extraValidators = $scope.extraValidators;
    var allPromises = [];
    if($scope.originalFilters == null){ $scope.originalFilters = '';}
    if($scope.autoExecute == null) {$scope.autoExecute = false;}

    $scope.subSendEmailFeatureEnabled = featureSvc.get('SubAvailabilitySendEmail').enabled;
    var originalFilters = $scope.originalFilters;
    $scope.isExpanded = true;
    $scope.filteredList = [];

    $scope.removeFilter = function(filterToBeRemoved){
        $scope.filteredList.splice($scope.filteredList.indexOf(filterToBeRemoved), 1);
        if (filterToBeRemoved.type == 'school'){
            filters.institutions.splice(filters.institutions.indexOf(filterToBeRemoved.id), 1);
        } else {
            filters.workerTypes.splice(filters.workerTypes.indexOf(filterToBeRemoved.id), 1);
        }
    }

    // Get mnemonics that this view needs
    var strings = $scope.strings = stringSvc.getStrings([
        'ts.summaryReport.status.saved',
        'ts.summaryReport.status.revised',
        'Pending',
        'Approved',
        'ts.summaryReport.summaryApproved',
        'ts.summaryReport.status.rejected',
        'ts.summaryReport.status.paperTimesheet',
        'ConfirmationNumberPound',
        'Dashboard.Filter.Label.View',
        'Reports.CriteriaPanel.Label.Date',
        'Reports.CriteriaPanel.Label.DateRange',
        'Reports.CriteriaPanel.Label.Schools',
        'Reports.CriteriaPanel.Label.allSchools',
        'Reports.CriteriaPanel.Label.Employees',
        'Reports.CriteriaPanel.Label.allEmps',
        'Reports.CriteriaPanel.Label.EmployeeTypes',
        'Reports.CriteriaPanel.Label.allEmpTypes',
        'Reports.CriteriaPanel.Label.AbsenceReasons',
        'Reports.CriteriaPanel.Label.allAbsReasons',
        'Reports.CriteriaPanel.Label.VacancyReasons',
        'Reports.CriteriaPanel.Label.allVacReasons',
        'Reports.CriteriaPanel.Label.VacancyProfiles',
        'Reports.CriteriaPanel.Label.allVacProf',
        'Reports.CriteriaPanel.Label.Substitutes',
        'Reports.CriteriaPanel.Label.allSubs',
        'Reports.CriteriaPanel.Label.Type',
        'Reports.CriteriaPanel.Label.Absences',
        'Reports.CriteriaPanel.Label.FillStatus',
        'Reports.CriteriaPanel.Label.Filled',
        'Reports.CriteriaPanel.Label.ReportDate',
        'Reports.CriteriaPanel.Label.Username',
        'Reports.CriteriaPanel.Label.Status',
        'Reports.CriteriaPanel.Label.OrderBy',
        'AbsenceInteractive.Label.GroupBy',
        'Report.Criteria.Label.SubPerfRatingBetween',
        'Report.Criteria.Label.SubExpRatingBetween',
        'Reports.EmployeeStatus.Active',
        'Reports.EmployeeStatus.Inactive',
        'Reports.EmployeeStatus.ActiveAndInactive',
        'Report.Label.EmployeeStatus.ActiveOrInactive',
        'Reports.EmployeeType.Workers',
        'Report.Label.VacancyProfiles',
        'Reports.EmployeeType.WorkersAndVacancyProfiles',
        'Report.Label.EmployeeType.NoWorkerOrVacancy',
        'Report.Label.Month',
        'Reports.Filter.ShowEmpExclusion',
        'Reports.Filter.ViewBy',
        'State',
        'Yes',
        'No',
        'Dismiss',
        'Error',
        'Validation.Message.Field.StartDate',
        'Validation.Message.DateRangeDaysTooLarge',
        'Validation.Message.Substring.IsInvalid',
        'Validation.Message.StartDateAfterEndDate',
        'Validation.Message.Field.EndDate',
        'Validation.Message.EndDateBeforeStartDate',
        'Validation.Message.MustEnter',
        'Validation.Message.Field.ConfirmationNumber',
        'Validation.Message.ConfirmationNumbersOnly',
        'Validation.Message.YouMustSelectASchoolBeforeSearching',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
        'Reports.CriteriaPanel.Label.ResetFilters',
        'ShowReportsLastRun',
        'WithinTheLastWeek',
        'WithinTheLastMonth',
        'WithinTheLastYear',
        'Name',
        'AnyTime',
        'Access',
        'All',
        'Public',
        'Published',
        'Button.text.PrintPDF',
        'SelectFromDate',
        'SelectToDate',
        'SelectDate',
        'Reports.CriteriaPanel.Filter.Schools',
        'Reports.CriteriaPanel.Select.EmployeeTypes',
        'Report',
        'Filter',
        'SubPrefersLocation',
        'Both',
        'AvailableSub.Text.Excluded',
        'SubProfile.text.Email',
        'PleaseSelectOneSubstitute'
    ]);

    $scope.showPrintButton = (angular.isDefined($scope.showPrintButton)) ? $scope.showPrintButton : true;
    $scope.autoExecute = (angular.isDefined($scope.autoExecute)) ? $scope.autoExecute : false;

    // View Model properties
    var vm = $scope.vm = {
        isProcessing: false,
        institutions: [],
        workers: [],
        workerTypes: [],
        substitutes: [],
        absenceReasons: [],
        vacancyReasons: [],
        vacancyProfiles: [],
        skills: [],
        months: [],
        years: [],
        presetDaySpans: [],
        errorMessages: '',
        dateError: false,
        startDateError: false,
        endDateError: false,
        absrIdError: false,
        instIdError: false,
        qTipHtml:qTipHtml(),
        canViewVacancies: permissionSvc.iHave('ABSR.VACANCY'),
        strings: stringSvc.getStrings([
            'ConfirmationNumberPound',
            'Absences',
            'Vacancies',
            'AbsencesVacancies',
            'Report.FillStatus.Filled',
            'Report.FillStatus.Unfilled',
            'Report.FillStatus.SubNotNeeded',
            'Reports.CriteriaPanel.Label.PrintPageBreaks',
            'Reports.CriteriaPanel.Button.Search',
            'Reports.CriteriaPanel.Button.Print',
            'Unapproved',
            'Approved',
            'Denied',
            'PartiallyApproved',
            'Reports.CriteriaPanel.Label.ShowSkills',
            'Reports.CriteriaPanel.Label.DateRange',
            'Reports.CriteriaPanel.Label.ResetFilters'
        ]),
        printSummaryValues: [],
        printSummaryTotals: [],

        //Properties to show or hide dropdowns
        //------------------------------------
        showInstitutions:true,
        showWorkerTypes:true,
        showWorkers:true,
        showEntitlementTypes: true,
        showVacancyEntitlementTypes: true,
        showVacancyProfiles: true,
        //------------------------------------
        validation: {
            dateRange: function() {
                if (!reportHelp.IsDateValid(filters.dateRange.startDate)) {
                    //start date not valid
                    vm.startDateError = true;
                    return $scope.strings['Validation.Message.Field.StartDate'] + ' ' + $scope.strings['Validation.Message.Substring.IsInvalid'];
                } else if (!reportHelp.IsDateValid(filters.dateRange.endDate)) {
                    //end date not valid
                    vm.endDateError = true;
                    return $scope.strings['Validation.Message.Field.EndDate'] + ' ' + $scope.strings['Validation.Message.Substring.IsInvalid'];
                } else if (!reportHelp.IsBefore(filters.dateRange.startDate, filters.dateRange.endDate)) {
                    //start date after end date
                    vm.startDateError = true;
                    return $scope.strings['Validation.Message.StartDateAfterEndDate'];
                } else if (!reportHelp.IsAfter(filters.dateRange.endDate, filters.dateRange.startDate)) {
                    //end date is not after start date
                    vm.endDateError = true;
                    return $scope.strings['Validation.Message.EndDateBeforeStartDate'];
                } else if (!reportHelp.DateRangeLessMax(filters.dateRange.startDate, filters.dateRange.endDate)) {
                    //search for greater then 365
                    vm.startDateError = true;
                    vm.endDateError = true;
                    return stringHelp.replace($scope.strings['Validation.Message.DateRangeDaysTooLarge'], '{0}', 365);
                } else if (reportHelp.IsBefore(filters.dateRange.startDate, '1/1/1900')) {
                    //start date less then system date
                    vm.endDateError = true;
                    vm.startDateError = true;
                    return 'Value of ' + parseDateFilter(filters.dateRange.startDate, 'M/d/yyyy') + ' is less than the minimum value of 01/01/1900';
                } else {
                    return '';
                }
            },
            date: function() {
                if (reportHelp.IsBefore(filters.date, '1/1/1900')) {
                    //start date less then system date
                    vm.dateError = true;
                    return 'Value of ' + parseDateFilter(filters.date, 'M/d/yyyy') + ' is less than the minimum value of 01/01/1900';
                } else if(!reportHelp.IsDateValid(filters.date)){
                    vm.dateError = true;
                    return $scope.strings['Validation.Message.Field.StartDate'] + ' ' + $scope.strings['Validation.Message.Substring.IsInvalid'];
                }else{
                    return '';
                }
            },
            absrId: function() {
                if (!reportHelp.LengthNot0(filters.absrId)) {
                    //absrid not entered
                    vm.absrIdError = true;
                    return stringHelp.replace($scope.strings['Validation.Message.MustEnter'], '{0}', $scope.strings['Validation.Message.Field.ConfirmationNumber']);
                } else if (!reportHelp.OnlyNumbers(filters.absrId)) {
                    vm.absrIdError = true;
                    return $scope.strings['Validation.Message.ConfirmationNumbersOnly'];
                } else {
                    return '';
                }
            },
            instId: function() {
                if (!reportHelp.LengthNot0(filters.instId)) {
                    vm.instIdError = true;
                    return $scope.strings['Validation.Message.YouMustSelectASchoolBeforeSearching'];
                } else {
                    return '';
                }
            }
        },
        removeMessages: function() {
            vm.errorMessages = '';
            vm.endDateError = false;
            vm.startDateError = false;
            vm.dateError = false;
            vm.absrIdError = false;
            vm.instIdError = false;
        },
        reportType: $scope.isDailyReport == true ? "dailyReport" : null,
        optionValues: []
    };


    //For Report Writer drop-down of specific previous date span
    if (isKeyPresent('presetDaySpan')) {
        vm.presetDaySpans = [
            { sort: 1, id: 1, value: $scope.strings['WithinTheLastWeek'] },
            { sort: 2, id: 2, value: $scope.strings['WithinTheLastMonth'] },
            { sort: 3, id: 3, value: $scope.strings['WithinTheLastYear'] },
            { sort: 4, id: null, value: $scope.strings['AnyTime'] }
        ];
    }

    //For Sub Preference, Sub Excluded drop-down values as Yes/No/Both
    vm.optionValues = [
        { id: false, value: $scope.strings['No'] },
        { id: true, value: $scope.strings['Yes'] },
        { id: null, value: $scope.strings['Both'] },
    ];

    if(isKeyPresent('institutions') || isKeyPresent('institution')){
        institutionSvc.getTreeData().then(function (tree) {
            vm.institutions = [];
            buildInstMultiSelectData(tree, 0);
            vm.showInstitutions = vm.institutions.length > 0;
        });
        allPromises.push(institutionSvc.ready);
    }

    if(isKeyPresent('workerTypes')){
        workerTypeSvc.ready.then(function (data) {
            vm.workerTypes = data.map(function (v, i, a) {
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
            vm.showWorkerTypes = vm.workerTypes.length > 0;

        });
        allPromises.push(workerTypeSvc.ready);
    }

    if(isKeyPresent('absenceReasons')){
        var _deferAbsenceReason = $q.defer();
        entitlementTypeApi.queryCached({
            fields: '(id,name,notesToAdminRequired)'
        }).then(function (reasons) {
            vm.absenceReasons = reasons.map(function (v, i , a) {
                return { id: v.id, value: v.name ,enabled: true};
            }).sort(function (a, b) {
                if (a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
                if (a.value.toLowerCase() > b.value.toLowerCase()) { return 1; }
                return 0;
            });
            vm.showEntitlementTypes = vm.absenceReasons.length > 0;
            return _deferAbsenceReason.resolve();
        });
        allPromises.push(_deferAbsenceReason.promise);
    }
    if(isKeyPresent('workers')){
        var _deferWorkers = $q.defer();
        workerApi.get({
            includeInactive: true,
            fields: '(id,firstName,lastName,isActive)'
        })
        .then(function (data) {
            vm.workers = data.map(function (v, i, a){
                var name = ((!v.isActive) ? '* ' : '') + v.lastName + ', ' + v.firstName;
                return{
                    id:v.id,
                    value:name,
                    enabled:true
                };
            });
            vm.showWorkers = vm.workers.length > 0;
            return _deferWorkers.resolve();
        });
        allPromises.push(_deferWorkers.promise);
    }
    if(isKeyPresent('substitutes')){
        var _deferSubstitutes = $q.defer();
        substituteApi.get({
            fields: '(id,firstName,middleName,lastName,isActive)'
        })
        .then(function (data) {
            vm.substitutes = data.map(function (v, i, a){
                var name = ((!v.isActive) ? '* ' : '') + v.lastName + ', ' + v.firstName + ' ' + v.middleName;
                return{
                    id: v.id,
                    value: name,
                    enabled:true
                };
            });
            return _deferSubstitutes.resolve();
        });
        allPromises.push(_deferSubstitutes.promise);
    }

    //Don't bother loading if no permission
    if (vm.canViewVacancies) {
        if(isKeyPresent('vacancyProfiles')){
            var _deferVacancyProfile = $q.defer();
            workerApi.get({
                includeWorkers: false,
                includeVacancies: true,
                fields: '(id,firstName,lastName)'
            })
            .then(function (data) {
                vm.vacancyProfiles = data.map(function (v, i, a){
                    return{
                        id:v.id,
                        value: (v.firstName == null || v.firstName === '') ? v.lastName : v.lastName+', '+v.firstName,
                        enabled:true
                    };
                });
                vm.showVacancyProfiles = vm.vacancyProfiles.length > 0;
                return _deferVacancyProfile.resolve();
            });
            allPromises.push(_deferVacancyProfile.promise);
        }
        if(isKeyPresent('vacancyReasons')){
            var _deferVacancyReason = $q.defer();
            entitlementTypeApi.queryCached({
                isVacancyType:true,
                fields: '(id,name,notesToAdminRequired)'
            }).then(function (reasons) {
                vm.vacancyReasons = reasons.map(function (v, i , a) {
                    return { id: v.id, value: v.name ,enabled: true};
                }).sort(function (a, b) {
                    if (a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
                    if (a.value.toLowerCase() > b.value.toLowerCase()) { return 1; }
                    return 0;
                });
                vm.showVacancyEntitlementTypes = vm.vacancyReasons.length > 0;
                return _deferVacancyReason.resolve();
            });
            allPromises.push(_deferVacancyReason.promise);
        }
    }

    if(isKeyPresent('skills')){
        var _deferSkills = $q.defer();
        skillsApi.get()
        .then(function (data) {
            data.sort(arrayHelp.sort('description'));
            vm.skills = data.map(function (v, i, a){
                return{
                    id: v.id,
                    value: v.description,
                    enabled: true
                };
            });
            return _deferSkills.resolve();
        });
        allPromises.push(_deferSkills.promise);
    }

    if(isKeyPresent('orderBy')){
        $scope.$watch('filters.orderBy', function (newValue,oldValue) {
            filters.orderByOptions.forEach(function(v,i,a){
                if(v.value === newValue){
                    filters.orderByTitle = v.display;
                }
            });
        }, true);
    }

    if (isKeyPresent('monthYear')) {
        vm.months = [];
        var years = vm.years = [];
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();

        for (var i = currentYear + 1; i >= 1999; i--) {
            years.push(i);
        }
        vm.years = years;
        vm.months = dateHelp.getMonths();
    }



    function validateFilters() {
        var f, error = '';
        for (f in filters) {
            if (vm.validation[f] != null) {
                error = vm.validation[f]();
                if (error !== '') {
                    break;
                }
            }
            if (extraValidators != null && extraValidators[f] != null) {
                error = extraValidators[f]();
                if (error !== '') {
                    break;
                }
            }
        }
        if (error !== '') {
            vm.errorMessages = error;
            return false;
        } else {
            return true;
        }

    }

    function resetFilters(){
        var f;
        if(originalFilters!==''){
            for (f in originalFilters) {
                filters[f] = angular.copy(originalFilters[f]);
            }
        }
        $location.search('');
    }

    function buildInstMultiSelectData(node, nestLevel) {
        var i, len;

        if (node.isAvailable) {
            vm.institutions.push({
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


    function isKeyPresent(key) {
        return filters.hasOwnProperty(key);
    }

    function processPrintSummary() {
        var v;
        vm.printSummaryValues = [];
        vm.printSummaryTotals = [];

        if (isKeyPresent('absrId')) {
            vm.printSummaryValues.push({
                key: 'absrIdTitle',
                value: strings['ConfirmationNumberPound']
            });

            vm.printSummaryValues.push({
                key: 'absrId',
                value:  filters.absrId
            });
        }

        if (isKeyPresent('dateRange')) {
            vm.printSummaryValues.push({
                key: 'dateRangeTitle',
                value: strings['Reports.CriteriaPanel.Label.DateRange']
            });

            var startDate = parseAesopDateFilter(filters.dateRange.startDate);
            var endDate = parseAesopDateFilter(filters.dateRange.endDate);

            vm.printSummaryValues.push({
                key: 'dateRange',
                value: startDate !== endDate ? startDate + ' - ' + endDate : startDate
            });
        }

        if (isKeyPresent('monthYear')) {
            vm.printSummaryValues.push({
                key: 'monthYearTitle',
                value: strings['Report.Label.Month'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'monthYear',
                value: vm.months[filters.monthYear.month-1].value + ' ' + filters.monthYear.year
            });
        }

        if (isKeyPresent('absenceType')) {
            v = strings['Reports.CriteriaPanel.Label.Type'] + ':';

            vm.printSummaryValues.push({
                key: 'absenceTypeTitle',
                value: v
            });

            v = '';

            if (filters.absenceType.includeAbsences && filters.absenceType.includeVacancies) {
                v += vm.strings['AbsencesVacancies'] + ' ';
            } else {
                if (filters.absenceType.includeAbsences) {
                    v += vm.strings['Absences'] + ' ';
                }
                if (filters.absenceType.includeVacancies) {
                    v += vm.strings['Vacancies'] + ' ';
                }
            }

            vm.printSummaryValues.push({
                key: 'absenceType',
                value: v
            });
        }

        if (isKeyPresent('filledStatus')) {
            v = strings['Reports.CriteriaPanel.Label.FillStatus'] + ': ';

            vm.printSummaryValues.push({
                key: 'filledStatusTitle',
                value: v
            });

            v = '';

            if (filters.filledStatus.includeFilled) {
                v += vm.strings['Report.FillStatus.Filled'] + ', ';
            }
            if (filters.filledStatus.includeUnfilled) {
                v += vm.strings['Report.FillStatus.Unfilled'] + ', ';
            }
            if (filters.filledStatus.includeNoSubRequired) {
                v += vm.strings['Report.FillStatus.SubNotNeeded'];
            }
            vm.printSummaryValues.push({
                key: 'filledStatus',
                value: v
            });
        }

        if (isKeyPresent('institutions')) {
            vm.printSummaryValues.push({
                key: 'institutionsTitle',
                value: strings['Reports.CriteriaPanel.Label.Schools'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'institutions',
                value: getSelectedOptions(filters.institutions, vm.institutions, strings['Reports.CriteriaPanel.Label.allSchools'])
            });
        }

        if (isKeyPresent('employeeExclusion')) {
            vm.printSummaryValues.push({
                key: 'employeeExclusionTitle',
                //value: 'Employee Excluded:'
                value: strings['Reports.Filter.ShowEmpExclusion']
            });

            if (filters.employeeExclusion) {
                vm.printSummaryValues.push({
                    key: 'employeeExclusion',
                    value: strings['Yes']
                });
            } else {
                vm.printSummaryValues.push({
                    key: 'employeeExclusion',
                    value: strings['No']
                });
            }
        }

        if (isKeyPresent('workers')) {
            vm.printSummaryValues.push({
                key: 'workersTitle',
                value: strings['Reports.CriteriaPanel.Label.Employees'] + ': '
            });

            vm.printSummaryValues.push({
                key: 'workers',
                value: getSelectedOptionsSemicolon(filters.workers, vm.workers, strings['Reports.CriteriaPanel.Label.allEmps'])
            });
        }

        if (isKeyPresent('workerTypes')) {
            vm.printSummaryValues.push({
                key: 'workerTypesTitles',
                value: strings['Reports.CriteriaPanel.Label.EmployeeTypes'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'workerTypes',
                value: getSelectedOptions(filters.workerTypes, vm.workerTypes, strings['Reports.CriteriaPanel.Label.allEmpTypes'])
            });
        }

        if (isKeyPresent('employeesVacancies')) {
            v = strings['Reports.CriteriaPanel.Label.Type'] + ':';

            vm.printSummaryValues.push({
                key: 'employeesVacanciesTitle',
                value: v
            });

            v = '';
            if (filters.employeesVacancies.includeWorkers && filters.employeesVacancies.includeVacancies) {
                v += strings['Reports.EmployeeType.WorkersAndVacancyProfiles'];
            } else if (!filters.employeesVacancies.includeWorkers && !filters.employeesVacancies.includeVacancies) {
                v += strings['Report.Label.EmployeeType.NoWorkerOrVacancy'];
            } else {
                if(filters.employeesVacancies.includeWorkers){
                    v += strings['Reports.EmployeeType.Workers'];
                }
                if(filters.employeesVacancies.includeVacancies){
                    v += strings['Report.Label.VacancyProfiles'];
                }
            }
            vm.printSummaryValues.push({key:'activeStatus',value:v});
        }

        if (isKeyPresent('activeStatus')) {
            v = strings['Reports.CriteriaPanel.Label.Status'] + ':';

            vm.printSummaryValues.push({
                key: 'activeStatusTitle',
                value: v
            });

            v = '';
            if (filters.activeStatus.includeActive && filters.activeStatus.includeInactive) {
                v += strings['Reports.EmployeeStatus.ActiveAndInactive'];
            } else if (!filters.activeStatus.includeActive && !filters.activeStatus.includeInactive) {
                v += strings['Report.Label.EmployeeStatus.ActiveOrInactive'];
            } else {
                if(filters.activeStatus.includeActive){
                    v += strings['Reports.EmployeeStatus.Active'];
                }
                if(filters.activeStatus.includeInactive){
                    v += strings['Reports.EmployeeStatus.Inactive'];
                }
            }
            vm.printSummaryValues.push({key:'activeStatus',value:v});
        }


/*      JPP - WE ARE NOT USING THIS ANYWHERE (possibly was originally intended as vac profiles?)
        if (isKeyPresent('vacancies')) {
            vm.printSummaryValues.push({
                key: 'vacanciesTitle',
                value: strings['Reports.CriteriaPanel.Label.VacancyProfiles'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'vacancies',
                value: getSelectedOptions(filters.vacancies, vm.vacancies, strings['Reports.CriteriaPanel.Label.allVacProf'])
            });
        }*/

        // DTN - WE ARE NOT USING THIS ANYWHERE IN THE CODEBASE
        // if (isKeyPresent('vacancyTypes')) {
        //     vm.printSummaryValues.push({
        //         key: 'vacancyTypesTitle',
        //         value: 'Vacancy Type(s):'
        //     });

        //     vm.printSummaryValues.push({
        //         key: 'vacancyTypes',
        //         value: getSelectedOptions(filters.vacancyTypes, vm.vacancyTypes, 'All Vacancies Types')
        //     });
        // }

        if (isKeyPresent('substitutes')) {
            vm.printSummaryValues.push({
                key: 'substitutesTitle',
                value: strings['Reports.CriteriaPanel.Label.Substitutes'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'substitutes',
                value: getSelectedOptionsSemicolon(filters.substitutes, vm.substitutes, strings['Reports.CriteriaPanel.Label.allSubs'])
            });
        }

        if (isKeyPresent('absenceReasons')) {
            vm.printSummaryValues.push({
                key: 'absenceReasonsTitle',
                value: strings['Reports.CriteriaPanel.Label.AbsenceReasons'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'absenceReasons',
                value: getSelectedOptions(filters.absenceReasons, vm.absenceReasons, strings['Reports.CriteriaPanel.Label.allAbsReasons'])
            });
        }

        if (vm.canViewVacancies && isKeyPresent('vacancyReasons')) {
            vm.printSummaryValues.push({
                key: 'vacancyReasonsTitle',
                value: strings['Reports.CriteriaPanel.Label.VacancyReasons'] + ':'
            });

            vm.printSummaryValues.push({
                key: 'vacancyReasons',
                value: getSelectedOptions(filters.vacancyReasons, vm.vacancyReasons, strings['Reports.CriteriaPanel.Label.allVacReasons'])
            });
        }

        if (vm.canViewVacancies && isKeyPresent('vacancyProfiles')) {
            vm.printSummaryValues.push({
                key: 'vacancyProfilesTitle',
                value: strings['Reports.CriteriaPanel.Label.VacancyProfiles'] + ': '
            });

            vm.printSummaryValues.push({
                key: 'vacancyProfiles',
                value: getSelectedOptions(filters.vacancyProfiles, vm.vacancyProfiles, strings['Reports.CriteriaPanel.Label.allVacProf'])
            });
        }

        if (isKeyPresent('approvalStatus')) {
            v = strings['State'] + ': ';

            vm.printSummaryValues.push({
                key: 'approvalStatusTitle',
                value: v
            });

            v = '';

            if (filters.approvalStatus.includeUnApproved) {
                v += vm.strings['Unapproved'] + ', ';
            }
            if (filters.approvalStatus.includeApproved) {
                v += vm.strings['Approved'] + ', ';
            }
            if (filters.approvalStatus.includeDenied) {
                v += vm.strings['Denied'] + ', ';
            }
            if (filters.approvalStatus.includePartialApproved) {
                v += vm.strings['PartiallyApproved'] + ', ';
            }

            if (v.lastIndexOf(', ') === v.length - 2) {
                v = v.slice(0, -2);
            }

            vm.printSummaryValues.push({
                key: 'approvalStatus',
                value: v
            });
        }

         if (isKeyPresent('timeSheetStatus')) {
            v = strings['State'] + ': ';

            vm.printSummaryValues.push({
                key: 'timeSheetStatusTitle',
                value: v
            });

            v = '';

            if(filters.timeSheetStatus.includeSaved){
               v += strings['ts.summaryReport.status.saved'] + ', ';
            }
            if(filters.timeSheetStatus.includeRevised){
                v += strings['ts.summaryReport.status.revised'] + ', ';
            }
            if(filters.timeSheetStatus.includePending){
                v += strings['Pending'] + ', ';
            }
            if(filters.timeSheetStatus.includeApproved){
                v += strings['Approved'] + ', ';
            }
            if(filters.timeSheetStatus.includeSystemApproved){
                v += strings['ts.summaryReport.summaryApproved'] + ', ';
            }
            if(filters.timeSheetStatus.includeRejected){
                v += strings['ts.summaryReport.status.rejected'] + ', ';
            }
            if(filters.timeSheetStatus.includePaperTimeSheet){
                v += strings['ts.summaryReport.status.paperTimesheet'] + ', ';
            }

            if (v.lastIndexOf(', ') === v.length - 2) {
                v = v.slice(0, -2);
            }

            vm.printSummaryValues.push({
                key: 'timeSheetStatus',
                value: v
            });
        }

        if (isKeyPresent('orderBy')) {
            vm.printSummaryValues.push({
                key: 'orderByTitle',
                value: strings['Reports.CriteriaPanel.Label.OrderBy']
            });

            vm.printSummaryValues.push({
                key: 'orderBy',
                value: getFilterOption(filters.orderBy)
            });
        }

        vm.printSummaryTotals.push({
            key: 'reportDateTitle',
            value: strings['Reports.CriteriaPanel.Label.ReportDate'] + ':'
        });

        vm.printSummaryTotals.push({
            key: 'reportDate',
            value: getReportExecutionDateTime()
        });

        userSvc.ready.then(function(userData) {
            vm.printSummaryTotals.push({
                key: 'usernameTitle',
                value: strings['Reports.CriteriaPanel.Label.Username'] + ':'
            });

            vm.printSummaryTotals.push({
                key: 'username',
                value: userData.firstName + ' ' + userData.lastName
            });
        });


    }
     function qTipHtml () {
        return '<div class="view-tooltip"> ' +
               '     <div class="list-view"> ' +
               '         <span class="icon"></span> ' +
               '         <span class="description">View all results on one page.</span> ' +
               '     </div>' +
               '     <div class="tab-view">' +
               '         <span class="icon"></span> ' +
               '         <span class="description">View results in a tabular view for quick access to each absence type.</span> ' +
               '     </div> ' +
               '</div>';
    }

    function getReportExecutionDateTime() {
        var now = new Date();
        return parseAesopDateFilter(now, 'hh:mm T');
        //return now.toUTCString();
    }

    function getFilterOption(search) {
        var result;
        for (var i = 0; i < filters.orderByOptions.length; i++) {
            if (filters.orderByOptions[i].value === search) {
                result = filters.orderByOptions[i].title;
                break;
            }
        }
        return result;
    }

    function getSelectedOptions(selected, options, type) {
        var result = '',
            i, x;

        if(options.length === 1 && selected.length === 1){
            return options[0].value;
        }
        else if ((selected.length === options.length) || (options.length > 0 && selected.length === 0)) {
            result = type;
            return result;
        } else {
            for (i = 0; i < selected.length; i++) {
                for (x = 0; x < options.length; x++) {
                    if (selected[i] === options[x].id) {
                        result += options[x].value + ', ';
                        break;
                    }
                }
            }

            if (result.lastIndexOf(', ') === result.length - 2) {
                result = result.slice(0, -2);
            }
            return result;
        }
    }

    function getSelectedOptionsSemicolon(selected, options, type) {
        var result = '',
            i, x;

        if ((selected.length === options.length) || (options.length > 0 && selected.length === 0)) {
            result = type;
            return result;
        } else {
            for (i = 0; i < selected.length; i++) {
                for (x = 0; x < options.length; x++) {
                    if (selected[i] === options[x].id) {
                        result += options[x].value + '; ';
                        break;
                    }
                }
            }

            if (result.lastIndexOf('; ') === result.length - 2) {
                result = result.slice(0, -2);
            }
            return result;
        }
    }

    $scope.$watch('filters.institutions', function () {
        var schoolInFilteredList = $scope.filteredList.filter( function(item) { return item.type == 'school'; } );
        if (schoolInFilteredList.length > 0){
            $scope.filteredList.splice($scope.filteredList.indexOf(schoolInFilteredList[0]), 1);
        }
        if (filters.institutions.length > 0) {
            var filteredSchoolObject = vm.institutions.filter(function (institution) { return institution.id == filters.institutions[0];});        
            filteredSchoolObject[0].type = 'school';
            $scope.filteredList.push(filteredSchoolObject[0]);
        }
    });

    $scope.$watchCollection('filters.workerTypes', function () { 
        if ($scope.filteredList !=null && $scope.filteredList.length > 0){       
            $scope.filteredList = $scope.filteredList.filter(function(item) { return item.type == 'school'; });
        }
        
        if (filters.workerTypes != null && filters.workerTypes.length > 0){
            filters.workerTypes.forEach(element => {
                var filteredWorkerTypeObject = vm.workerTypes.filter(function(workertType) { return workertType.id == element });
                filteredWorkerTypeObject[0].type = 'workerType';
                $scope.filteredList.push(filteredWorkerTypeObject[0]);
            });
        }
    });

    function getSelectedRecipientsCount(){
        var gridCheckboxes = $("ul.grid-rows .checkbox:checked");
        return gridCheckboxes.length;
    }

    $rootScope.$on("searchfromDatePickerInputBox", function (event, newDate) {
             go.search(newDate); ngDialog.closeAll();
    });
    // Actions that can be bound to from the view
    var go = $scope.go = {
        isKeyPresent: isKeyPresent,
        getSelectedRecipientsCount:getSelectedRecipientsCount,
        search: function (newDate) {
            if(!vm.isProcessing){
                if(filters.absenceType){
                   filters.absenceType.includeVacancies = !vm.canViewVacancies ? false : filters.absenceType.includeVacancies;
                }
                vm.errorMessages = '';
                vm.endDateError = false;
                vm.startDateError = false;
                vm.dateError = false;
                vm.absrIdError = false;
                vm.instIdError = false;
                if (validateFilters()) {
                    if (vm.errorMessages === '') {
                        vm.isProcessing = true;
                        $scope.action(newDate).then(function (){
                            vm.isProcessing = false;
                            processPrintSummary();
                        });
                    }
                }
            }
        },
        download: function(){
          var url = $scope.downloadUrl()
          if(url){
            //console.log(url);
            window.open(url, '_blank');
          }
        },
        views: function(val){
            $scope.filters.isListView = val;
        },
        createEmail: function(){
            var checkboxes = $(".checkbox:checked");
            var emailColumn = $(".email-cell");
            var bcc = "";            
            var index = emailColumn.index();
            
            checkboxes.each(function() {
                bcc += ";" + $(this).parents(".grid-row").children().eq(index).text();
            });
            
            if(go.getSelectedRecipientsCount() > 0){
                $window.open('mailto:?bcc=' + bcc);
            } 
        },
        resetFilters: resetFilters
    };

    $scope.$on('$destroy', $scope.$root.$on('report-go-search', go.search));
    $scope.$on('$destroy', $scope.$root.$on('report-reset-filters', go.resetFilters));

    if ($scope.autoExecute) {
        $q.all(allPromises).then(function (){
            go.search();
        });
    }
}
// #-- END Component (cmpt-reports-filter-panel) --# //
// #-----------------------------------------------# //
};});}());
