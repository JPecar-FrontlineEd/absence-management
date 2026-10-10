(function() {'use strict';angular.module('aesop')
.controller('InteractiveCtrl', function ($q, roundNumberFilter, urlHelp, $scope,$timeout,stringSvc,$filter, $window, $location, reportHelp,permissionSvc,orgSvc,toastHelp,parseAesopDateFilter,parseDateFilter, timeFilter,gridCellHelp, absenceInteractiveApi,institutionSvc,absenceApi,shiftTypesSvc, ngDialog,reportWriterApi, reportQueryFilterMapsVal, arrayHelp) {

// #-------------------------------# //
// #------- InteractiveCtrl -------# //

    // this is a route controller
    var route = this, maxDetailRows = 2500, datesUpdated = 0;
    var _searchDefer = $q.defer();

    var totals =  {
            total:0.00,
            filled:0.00,
            unfilled:0.00,
            nosub:0.00,
            needSub:0.00,
            perFilled:0.00,
            perUnfilled:0.00

    };

    var weekday = new Array(7);
        weekday[0]=  'Sunday';
        weekday[1] = 'Monday';
        weekday[2] = 'Tuesday';
        weekday[3] = 'Wednesday';
        weekday[4] = 'Thursday';
        weekday[5] = 'Friday';
        weekday[6] = 'Saturday';

    var months = new Array(12);
        months[0] = 'January';
        months[1] = 'February';
        months[2] = 'March';
        months[3] = 'April';
        months[4] = 'May';
        months[5] = 'June';
        months[6] = 'July';
        months[7] = 'August';
        months[8] = 'September';
        months[9] = 'October';
        months[10] = 'November';
        months[11] = 'December';

    route.downloadDialog = null;

    route.strings = stringSvc.getStrings([
        'Reports.Title.AbsenceInteractive',
        'Reports.CriteriaPanel.Button.Print',
        'Summary',
        'Year',
        'Month',
        'DayOfWeek',
        'Date',
        'AbsenceInteractive.Groupby.Text.Customer',
        'School',
        'WorkerTypeGeneric',
        'Employee',
        'Substitute',
        'Reason',
        'AccountingCode',
        'AccountingCodeExternalId',
        'AbsenceInteractive.Groupby.Text.PercentOfDay',
        'AbsenceInteractive.Groupby.Text.Count',
        'AbsenceInteractive.Header.Text.AbsenceVacancyCounts',
        'AbseneInteractive.Header.Text.AbsenceVacancyPercentages',
        'Total',
        'DR.Summary.Label.NeedSub',
        'Dashboard.Header.Filled.Label',
        'Dashboard.Header.Unfilled.Label',
        'DR.Summary.Label.NoSubNeeded',
        'AbsenceInteractive.Header.Text.OfTotal',
        'Actions',
        'NoRecordsFound',
        'Reports.Results.Label.InitialInstructions',
        'Totals',
        'absrList.button.viewDetails',
        'AbsenceInteractive.Button.Text.DownloadDetails',
        'AbsenceInteractive.Button.Text.DrillDown',
        'Reports.Results.Button.PreviousPage',
        'Reports.DownloadDialog.Template.Instructions',
        'Default',
        'Reports.DownloadDialog.Email.Instructions',
        'Input.Placeholder.EnterYourEmail',
        'Reports.Results.SubNotNeeded',
        'PayCode',
        'BudgetCode',
        'Reports.Results.DurationColumn.Break'
    ]);

    var canViewAccd = permissionSvc.iHave('ABSR.DTLSACCD');
    var canViewBudgetCode = permissionSvc.iHave('ABSR.DTLSBDCD');
    var canViewPayCode = permissionSvc.iHave('ABSR.DTLSPYCD');

    var orgData = orgSvc.getOrgData();
    var ShowAccountingCode = orgData[0].settings.ShowAccountingCode;
    var ShowSchoolCustomerNumber = orgData[0].settings.ShowSchoolCustomerNumber;


    // View Model properties
    var date = new Date();
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        initialGroupBy: null,
        showPrevious: false,
        accountingCodeColumn:false,
        maxDetailRows: maxDetailRows,
        sort:{
            byColumn: 'sortField',
            direction: 'asc'
        },
        filters: {
            dateRange:{startDate: new Date(date.setDate(date.getDate() - date.getDay())), endDate: new Date(date.setDate(date.getDate() - date.getDay()+6))},
            absenceType:{includeAbsences:true, includeVacancies:true},
            filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
            institutions:[],
            workers:[],
            workerTypes:[],
            substitutes:[],
            absenceReasons:[],
            vacancyReasons:[],
            vacancyProfiles:[],
            daysOfWeek:[],
            groupBy:'Date',
            groupByDisplay:'percentDay',
            groupByDisplayOptions:[{value:'percentDay',title:route.strings['AbsenceInteractive.Groupby.Text.PercentOfDay']},
            {value:'count',title:route.strings['AbsenceInteractive.Groupby.Text.Count']}],
            groupByOptions:[{
                value:'Year',title:route.strings['Year']
            },{
                value:'Month',title:route.strings['Month']
            },{
                value:'DayOfWeek',title:route.strings['DayOfWeek']
            },{
                value:'Date',title:route.strings['Date']
            },/*{
                value:'InstitutionCustomerNumber',title:route.strings['AbsenceInteractive.Groupby.Text.Customer']
            },*/{
                value:'Institution',title:route.strings['School']
            },{
                value:'WorkerType',title:route.strings['WorkerTypeGeneric']
            },{
                value:'Worker',title:route.strings['Employee']
            },{
                value:'Substitute',title:route.strings['Substitute']
            },{
                value:'EntitlementType',title:route.strings['Reason']
            },
            /*,{
                value:'AccountingCode',title:route.strings['AccountingCode']
            }*/],
            quickDateRange:true,
            dateManualUpdate:false,
            includeDeletedSubs: true,
            quickSelected:'thisWeek'
        },
        resetFilters:{
                dateRange:{startDate: new Date(date.setDate(date.getDate() - date.getDay())), endDate: new Date(date.setDate(date.getDate() - date.getDay()+6))},
                absenceType:{includeAbsences:true, includeVacancies:true},
                filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
                groupBy:'Date',
                groupByDisplay:'percentDay',
                institutions:[],
                workers:[],
                workerTypes:[],
                substitutes:[],
                absenceReasons:[],
                vacancyReasons:[],
                vacancyProfiles:[],
                quickSelected:'thisWeek'
        },
        columns:[{
                key: 'sortField', width: '3/24',
                name: 'Group By',
                noTitle:true,
                sortable: false,
                defaultSort: 'asc',
                template: '<div ng-if="!row.showTitle" ap-bind-html="row.title"></div>'+
                '<div ng-if="row.showTitle" title="{{row.title}}" ap-bind-html="row.title"></div>'
            },  {
                key: 'total', width: '2/24',
                name: 'Total',
                cls: 'sub-heading',
                sortable: false,
                template:'{{row.Total}}'
            },  {
                key: 'needSub', width: '2/24',
                name: 'DR.Summary.Label.NeedSub',
                cls: 'sub-heading',
                sortable: false,
                template: '{{row.SubRequired}}'
            },  {
                key: 'filled', width: '2/24',
                noTitle:true,
                cls: 'sub-heading',
                name: 'Dashboard.Header.Filled.Label',
                sortable: false,
                template: '{{row.Filled}}'
            },  {
                key: 'unfilled', width: '2/24',
                name: 'Dashboard.Header.Unfilled.Label',
                cls: 'sub-heading',
                sortable: false,
                template: '{{row.Unfilled}}'
            },  {
                key: 'nosub', width: '3/24',
                name: 'DR.Summary.Label.NoSubNeeded',
                cls: 'sub-heading',
                noTitle:true,
                sortable: false,
                template: '{{row.NoSubRequired}}'
            },  {
                key: 'percentFilled', width: '2/24',
                name: 'Dashboard.Header.Filled.Label',
                cls: 'sub-heading',
                noTitle:true,
                sortable: false,
                template: '{{row.PercentFilled}} %'
            },  {
                key: 'percentUnFilled', width: '2/24',
                name: 'Dashboard.Header.Unfilled.Label',
                cls: 'sub-heading',
                noTitle:true,
                sortable: false,
                template: '{{row.PercentUnFilled}} %'
            },  {
                key: 'percenttotal', width: '2/24',
                name: 'AbsenceInteractive.Header.Text.OfTotal',
                cls: 'sub-heading',
                noTitle:true,
                sortable: false,
                template: '{{row.PercentTotal}} %'
            },  {
                key: 'actions', width: '4/24',
                name: 'Actions',
                noTitle:true,
                sortable: false,
                template: '<a class="fl-button-sm" ng-if="row.groupDrillDown!==\'\' && !row.TotalRow"><div class="fl-label" ng-click="actions.drillDown(row)">'+route.strings['AbsenceInteractive.Button.Text.DrillDown']+'</div></a>'+
                '<a class="fl-button-sm" ng-if="row.Total <= '+maxDetailRows+' && !row.TotalRow" ng-click="actions.getDetails(row,false)"><div class="fl-label">'+route.strings['absrList.button.viewDetails']+'</div></a>'+
                '<a class="fl-button-sm" ng-click="actions.downloadDetails(row,false)" ng-if="!row.TotalRow"><div class="fl-label">'+route.strings['AbsenceInteractive.Button.Text.DownloadDetails']+'</div></a>'
            }],
        footerColumns:[],
        data: {
            unfilled: [],
            filled: [],
            nosub: []
        },
        absIntTotals: {},
        dataSet:[],
        abscenceDataSet:[],
        validation:{
             dateRange: function (){
                 /*if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,null,'employee',route.vm.filters.workers)){
                     return reportHelp.InjectValuesToResource(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'],'employee',route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate);
                 }else{
                    return '';
                 }*/
                 return '';
             }
        },
        processGroup:function(group){
           // group.includeVac = route.vm.filters.absenceType.includeVacancies;
           // group.includeAbs = route.vm.filters.absenceType.includeAbsences;

            return group;
        },
        showDetails:false,
        absColumns:[{
            key: 'dateFormatted', width: '2/24',
            name: 'Table.Header.Date',
            noTitle:true,
            sortable: false,
            //defaultSort: 'asc',
            template: '<span>{{row.dateFormatted}}</span>'
        },  {
            key: 'absrid', width: '3/24',
            name: 'Table.Header.Conf#',
            sortable: false,
            template:'<cmpt-template-confirmation-link absrid="{{ row.absrId }}" ></cmpt-template-confirmation-link>' +
            '<div ng-if="row.IsVacancy">Vacancy</div><div ng-if="!row.IsVacancy">Absence</div>'
        },  {
            key: 'name', width: '5/24',
            name: 'Name',
            sortable: false,
            template: '<div><cmpt-template-worker-link worker-id="{{ row.worker.id }}" worker-name="{{ row.workerName }}"></cmpt-template-worker-link></div>' +
                        '<div class="title">{{row.worker.title}}</div>' +
                        '<div class="employee-type">{{row.worker.workerType.title}}</div>'
        },  {
            key: 'institution', width: '4/24',
            noTitle:true,
            name: 'School',
            sortable: false,
            template: '<div class="school">{{row.institution.name}}</div>'+
            '<div class="emp-time"><span>Emp: </span>{{row.startFormatted}} - {{row.EndFormatted}}</div>'+
            '<div class="sub-time" ng-if="row.hasSubTimes"><span>Sub: </span>{{row.subStartFormatted}} - {{row.subEndFormatted}}</div>'
        },  {
            key: 'reason', width: '4/24',
            name: 'Reason',
            sortable: false,
            template: '<div class="absence-reason" title="{{ row.entitlement.name }}">{{ row.entitlement.name }}</div>'+
            '<div class="budget-code" ng-if="row.canViewBudgetCode && row.budgetCode!== null"><label>'+route.strings['BudgetCode']+':</label> {{row.budgetCode.description}}</div>'+
            '<div class="accounting-code" ng-if="row.canViewAccd && row.accountingCode!== null && row.accountingCode.ExternalId.length > 0"><label>'+route.strings['AccountingCodeExternalId']+':</label> {{row.accountingCode.ExternalId}}</div>' +
            '<div class="accounting-code" ng-if="row.canViewAccd && row.accountingCode!== null"><label>'+route.strings['AccountingCode']+':</label> {{row.accountingCode.name}}</div>' +
            '<div class="pay-code" ng-if="row.canViewPayCode && row.payCode!== null"><label>'+route.strings['PayCode']+':</label> {{row.payCode.description}}</div>'
        },  {
            key: 'duration', width: '2/24',
            name: 'Table.Header.Duration',
            noTitle:true,
            sortable: false,
            template: '<div ng-if="row.shiftType===4"><div class="durationTime">{{row.durationFormatted}}</div>'+
            '<div class="breaktime" ng-if="row.DeductBreakFromAbsenceDuration">[{{row.durationText}}: {{row.breakFormatted}}]</div></div>'+
            '<div class="hide-print" ng-if="row.shiftType!==4" ng-bind-html="row.durationHtml"></div>' +
            '<div class="no-screen" ng-if="row.shiftType!==4">{{row.durationTitle}}</div>'
        },  {
            key: 'substitute', width: '4/24',
            name: 'Table.Header.Substitute',
            noTitle:true,
            sortable: false,
            template: '<div ng-if="row.NeedSub && row.IsHeld"><span class="held">'+route.strings['Reports.Results.Held']+'</span></div>'+
            '<div ng-if="row.substitute != null && row.NeedSub && !row.IsHeld"><cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link></div>'+
            '<div ng-if="!row.NeedSub">'+route.strings['Reports.Results.SubNotNeeded']+'</div>'
        }]
    };

    if(ShowSchoolCustomerNumber){
        route.vm.filters.groupByOptions.splice(3,0,{
            value:'InstitutionCustomerNumber',title:route.strings['AbsenceInteractive.Groupby.Text.Customer']+' #'
        });

    }

    if(ShowAccountingCode && canViewAccd){
        route.vm.filters.groupByOptions.push({
            value:'AccountingCode',title:route.strings['AccountingCode']
        });
    }

    // Actions that can be bound to from the view
    route.go = {
        callToServer:fetchResults,
        drillDown: getDrillDown,
        getDetails: getDetails,
        downloadDetails:showDialog,
        loadPreviousSearch: loadPreviousSearch
    };

    function getDayKey(day){
        for(var x=0; x<weekday.length; x++){
            if(weekday[x]===day){
                return x;
            }
        }
        return 0;
    }

    function getMonthKey(month){
        for(var x=0; x<months.length; x++){
            if(months[x]===month){
                return x;
            }
        }
        return 0;
    }

    function getDrillDown(row){

        getFilterValue(row,route.vm.filters, true);
    }

    function processResults(data){

        var title = '';
        //console.log(data);

        totals.total = 0;
        totals.filled = 0;
        totals.unfilled =0;
        totals.nosub = 0;
        totals.needSub = 0;

        var totalAbsences = data.reduce(function(prev,curr,index,array){
            return prev + curr.Filled + curr.Unfilled + curr.NoSubRequired;
        },0);
        totalAbsences = totalAbsences.toFixed(2);


        route.vm.dataSet = data.map(function(d) {
            d.title='';
            switch(route.vm.filters.groupBy){
                case 'Date':
                    title = 'Date';
                    var date = new Date(d.Date);
                    d.title = '<div>'+parseAesopDateFilter(d.Date)+'</div>';
                    d.title += '<div>'+weekday[date.getDay()]+'</div>';
                    d.sortField = parseDateFilter(d.Date, 'yyyy/MM/dd');
                    d.showTitle = false;
                    route.vm.accountingCodeColumn = false;
                    break;
                case 'Year':
                    title = 'Year';
                    d.title = d.Year;
                    d.sortField = d.Year;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = false;
                    break;
                case 'Month':
                    title = 'Month';
                    d.title = d.Month;
                    d.sortField = getMonthKey(d.Month.split(' ')[0]);
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = false;
                    break;
                case 'DayOfWeek':
                    title = 'DayOfWeek';
                    d.title = d.DayOfWeek;
                    d.sortField = getDayKey(d.DayOfWeek);
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = false;
                    break;
                case 'InstitutionCustomerNumber':
                    title = 'AbsenceInteractive.Groupby.Text.Customer';
                    d.title = d.InstitutionCustomerNumber;
                    d.sortField = d.InstitutionCustomerNumber;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = false;
                    break;
                case 'Institution':
                    title = 'School';
                    d.title = d.InstitutionName;
                    d.sortField = d.InstitutionName;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = true;
                    break;
                case 'WorkerType':
                    title = 'WorkerTypeGeneric';
                    d.title = d.WorkerType;
                    d.sortField = d.WorkerType;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = true;
                    break;
                case 'Worker':
                    title = 'Employee';
                    d.title = d.WorkerName;
                    d.sortField = d.WorkerName;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = true;
                    break;
                case 'Substitute':
                    title = 'Substitute';
                    if (d.SubId > 0) {
                        d.title = '<cmpt-template-substitute-link substitute-id="'+d.SubId+'" substitute-name="'+d.SubstituteName+'" ></cmpt-template-substitute-link>';
                    } else {
                        d.title = d.SubstituteName;
                    }
                    d.sortField = d.SubstituteName;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = false;
                    break;
                case 'EntitlementType':
                    title = 'Reason';
                    d.title = d.AbsenceReason;
                    d.sortField = d.AbsenceReason;
                    route.vm.accountingCodeColumn = false;
                    d.showTitle = true;
                    break;
                case 'AccountingCode':
                    title = 'AccountingCode';
                    d.title = d.AccountingCode;
                    d.sortField = d.AccountingCode;
                    route.vm.accountingCodeColumn = true;
                    d.showTitle = true;
                    break;
            }
            d.Filled = d.Filled.toFixed(2);
            d.Unfilled = d.Unfilled.toFixed(2);
            d.NoSubRequired = d.NoSubRequired.toFixed(2);
            d.SubRequired = d.SubRequired.toFixed(2);
            d.Total = d.Total.toFixed(2);

            d.groupDrillDown = groupDrillDown(route.vm.filters.groupBy);
            d.PercentFilled = (d.PercentFilled*100).toFixed(2);
            d.PercentUnFilled = (d.PercentUnFilled *100).toFixed(2);
            d.PercentTotal = ((d.Total/totalAbsences)*100).toFixed(2);
            d.TotalRow = false;
            d.groupedBy = title;

            totals.total +=parseFloat(d.Total*1);
            totals.filled += parseFloat(d.Filled);
            totals.unfilled += parseFloat(d.Unfilled);
            totals.nosub += parseFloat(d.NoSubRequired);
            totals.needSub += parseFloat(d.SubRequired);

            return d;
        });

        // ==============================================================
        // HZ - 06/04/2015
        // This logic below is little wiered but here is the explanation
        // in ui sortable grid component we have watch on the columns array
        // we cannot trigget that watch untill length of an array changes
        // if we want to change the column header dynamically
        // I am doing a shift() which will remove the first element in the column
        // and splicing the it back againg with everything same except new column name
        // this change in the array length trigger the watch in the component.

        route.vm.columns.shift();
        route.vm.columns.splice(0,0,{
                key: 'sortField', width: '3/24',
                headerTemplate: route.strings[title],
                noTitle:true,
                sortable: false,
                defaultSort: 'asc',
                template: '<div ng-if="!row.showTitle" ng-bind-html="row.title"></div>'+
                '<div ng-if="row.showTitle" title="{{row.title}}" ng-bind-html="row.title"></div>'
            });
        // ==============================================================



        totals.perFilled = totals.needSub >0 ? totals.filled/totals.needSub*100:0;
        totals.perUnfilled = 100 - totals.perFilled;
        totals.perTotal = totals.total/totals.total*100;

        var totalObj = {'title':'Totals','Total':totals.total.toFixed(2),'SubRequired':totals.needSub.toFixed(2),'Filled':totals.filled.toFixed(2),'Unfilled':totals.unfilled.toFixed(2),
        'NoSubRequired':totals.nosub.toFixed(2),'PercentFilled':totals.perFilled.toFixed(2),'PercentUnFilled':totals.perUnfilled.toFixed(2),
        'PercentTotal':totals.perTotal.toFixed(2),'TotalRow':true};
        //route.vm.dataSet.push(totalObj);
        //total row will be handled outside of the grouped grid to not interfere with sorting
        route.vm.absIntTotals = totalObj;
    }

    function processAbsenceResults(data){
        //console.log(data);
        route.vm.abscenceDataSet = data.map(function(d) {
            var orgData = orgSvc.getOrgData();
            var subName;

           //if we need middle name for subs
            if(d.substitute === null){
                subName = '';
            }else{
                subName = d.substitute.firstName + ' ';
                if(d.substitute.middleName!==''){
                    subName += d.substitute.middleName+ ' ';
                }
                subName += d.substitute.lastName;
            }

            d.hasSubTimes = (d.substituteStartTime !== null && d.substituteStartTime.length > 0);
            d.workerName = d.IsVacancy ? d.worker.lastName : d.worker.lastName + ', ' + d.worker.firstName;
            d.substituteName = d.substitute != null ? d.substitute.firstName + ' '+ d.substitute.lastName : '';
            d.dateFormatted = parseAesopDateFilter(d.date,'shortDate');
            d.dateForSorting = parseDateFilter(d.date,'yyyy/MM/dd');
            d.subStartFormatted = timeFilter(d.substituteStartTime);
            d.subEndFormatted = timeFilter(d.substituteEndTime);
            d.startFormatted = timeFilter(d.absenceStartTime);
            d.EndFormatted = timeFilter(d.absenceEndTime);
            d.durationFormatted = d.absenceDuration.slice(0,-3);
            d.breakFormatted = d.absenceBreakDuration.slice(0,-3);
            d.durationText = route.strings['Reports.Results.DurationColumn.Break'];

            d.durationHtml = gridCellHelp.shiftTypeCellByAbs(d.shiftType, d.institution.id);
            d.durationTitle = shiftTypesSvc.oneById(d.shiftType).title;

            d.lastApprovedActionDateTime = d.lastApprovedAction != null && d.lastApprovedAction !== '' ? new Date(d.lastApprovedAction) : null;
            //tied to permission profile for viewing these items
            d.canViewAccd =  canViewAccd;
            d.canViewBudgetCode = canViewBudgetCode;
            d.canViewPayCode = canViewPayCode;

            return d;
        }).sort(arrayHelp.sort('dateForSorting'));
    }


    function fetchResults() {
        if(!route.vm.isLoading) {
            toastHelp.clear();
            _searchDefer = $q.defer();
            route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
            route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
            reportHelp.convertAbsenceInteractiveFilter(route.vm.filters, true);
            route.vm.showDetails = false;
            return _searchDefer.promise;
        }
    }

    /*******************************************************Handle Page History*********************************************/

    angular.element(document).ready(function () {
        checkForInitialSearch();
    });

    function makeCallToApi() {
        if (reportHelp.hasSearch()) {
            var params = $location.search();
            reportHelp.reverseMap(params, reportQueryFilterMapsVal.absenceInteractive, route.vm.filters);
            if (route.vm.initialGroupBy === null || !route.vm.dataLoaded) {
                route.vm.initialGroupBy = route.vm.filters.groupBy;
            }
            route.vm.showPrevious = canGoBack();
            route.vm.isLoading = true;
            params.fields = 'Filled,Unfilled,NoSubRequired,SubRequired,Year,Month,DayOfWeek,InstitutionCustomerNumber,InstitutionName,' +
                            'WorkerType,WorkerName,SubstituteName,AbsenceReason,AccountingCode,Total,PercentFilled,PercentUnFilled,SubId,WkId';
            absenceInteractiveApi.get(params).then(function (data){
                route.strings.$promise.then(function (){
                    processResults(data);
                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;
                    return _searchDefer.resolve();
                });
            }, function(reasons){
                route.vm.isLoading = false;
                toastHelp.error(reasons.$messages, 'Error');
                return _searchDefer.resolve();
            });
        }
    }
    function checkForInitialSearch() {
        if (reportHelp.hasSearch()) {
            var searchParams = $location.search();
            if (searchParams['showDetails']) {
                $timeout(function() {
                    route.go.callToServer = fetchAbsencesResults;
                    reportHelp.reverseMap(searchParams, reportQueryFilterMapsVal.absenceInteractive, route.vm.filters);
                    $scope.$apply();
                    $scope.$emit('report-go-search');
                }, 0);
            } else {
                _searchDefer = $q.defer();
                makeCallToApi();
            }
        }
    }
    function loadPreviousSearch(){
        if (reportHelp.hasSearch()) {
            $timeout(function() {
                var searchParams = $location.search();
                route.go.callToServer = fetchResults;
                route.vm.showDetails = false;
                if (route.vm.initialGroupBy != null) {
                    $window.history.back();
                } else {
                    if (searchParams['showDetails']) {
                        var absIntFilter = reportHelp.convertAbsenceInteractiveFilter(route.vm.filters, false);
                        reportHelp.addToHistory(absIntFilter, 'absence');
                    }
                }
                $scope.$apply();
            }, 0);
        }
    }
    function canGoBack() {
        return (route.vm.initialGroupBy !== null && route.vm.initialGroupBy !== route.vm.filters.groupBy) || route.vm.showDetails;
    }
    function clearSearch() {
        route.vm.isLoading = false;
        route.vm.dataLoaded = false;
        route.vm.dataSet = [];
        route.vm.initialGroupBy = route.vm.resetFilters.groupBy;
        route.vm.showPrevious = false;
        route.vm.showDetails = false;
        $scope.$emit('report-reset-filters');
    }

    $scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
        if(urlHelp.isNavigatorUrl(newUrl)) { return; }
        if (reportHelp.hasSearch()) {
            var searchParams = $location.search();
            if (searchParams['showDetails']) {
                route.vm.showDetails = true;
            } else {
                route.vm.showDetails = false;
            }

            if (!route.vm.showDetails) {
                makeCallToApi();
            }
        } else {
            clearSearch();
        }
    });

    /*******************************************************End Handle Page History*********************************************/

    function setAbsIntSearch() {
        $timeout(function() {
            route.go.callToServer = fetchResults;
            $scope.$apply();
        }, 0);
    }


    function getDetails(row, total){

        $timeout(function() {
            route.go.callToServer = fetchAbsencesResults;
            $scope.$apply();
            if(!total){
                route.vm.showDetails = true;
                getFilterValue(row,route.vm.filters, true);
            }else{
                $scope.$emit('report-go-search');
            }
        }, 0);
    }

    function fetchAbsencesResults(){
        if(!route.vm.isLoading){
            toastHelp.clear();
            var _defer = $q.defer();
            route.vm.isLoading = true;
            route.vm.abscenceDataSet = [];
            route.vm.showDetails = true;
            route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
            route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
            var filter = reportHelp.convertAbsenceFilter(route.vm.filters);
            filter.fields = 'absrId,substitute(id,firstName,middleName,lastName),IsVacancy,worker(id,firstName,middleName,lastName,' +
                'title,workerType(title)),date,substituteStartTime,substituteEndTime,absenceStartTime,absenceEndTime,absenceDuration,absenceBreakDuration,shiftType,' +
                'institution(id,name),lastApprovedAction,startDate,endDate,entitlement(id,name),budgetCode(id,description),accountingCode(id,name,ExternalId),' +
                'payCode(id,description),DeductBreakFromAbsenceDuration,NeedSub,IsHeld)';
            route.vm.showPrevious = canGoBack();
            //keep the abs interactive filter in the query string so we can go back if page loads directly to details
            var absIntFilter = reportHelp.convertAbsenceInteractiveFilter(route.vm.filters, false);
            absIntFilter.showDetails = route.vm.showDetails;
            reportHelp.addToHistory(absIntFilter, 'absence');
            absenceApi.get(filter).then(function (data){
                    route.strings.$promise.then(function (){
                        processAbsenceResults(data);
                        route.vm.isLoading = false;
                        route.vm.dataLoaded = true;
                        setAbsIntSearch();
                        return _defer.resolve();
                    });
                },function(reasons){
                    route.vm.isLoading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
            return _defer.promise;
        }
    }


    function groupDrillDown(groupBy){
        switch(groupBy){
            case 'AccountingCode':
                return '';
            case 'Date':
                return 'Institution';
            case 'DayOfWeek':
                return 'Date';
            case 'EntitlementType':
                return 'Worker';
            case 'Institution':
                return 'WorkerType';
            case 'InstitutionCustomerNumber':
                return '';
            case 'Month':
                return 'Date';
            case 'Substitute':
                return '';
            case 'Worker':
                return 'Substitute';
            case 'WorkerType':
                return 'Worker';
            case 'Year':
                return 'Month';
            default:
                return '';
        }
    }

    function getFilterValue(row, filterObj, search){

        switch (filterObj.groupBy)
        {
            case 'AccountingCode':

                break;
            case 'Date':
                filterObj.quickSelected = 'custom';
                filterObj.dateRange.startDate = parseDateFilter(row.Date, 'MM/dd/yyyy');
                filterObj.dateRange.endDate = parseDateFilter(row.Date, 'MM/dd/yyyy');
                break;
            case 'DayOfWeek':
                filterObj.daysOfWeek = [];
                filterObj.daysOfWeek.push(row.DayOfWeek);
                break;
            case 'EntitlementType':
                filterObj.absenceReasons = [];
                filterObj.vacancyReasons = [];
                filterObj.absenceType.includeAbsences = true;
                filterObj.absenceType.includeVacancies=true;
               if(row.VacancyReason){
                    filterObj.vacancyReasons.push(row.ReasonId);
                    filterObj.absenceType.includeAbsences = false;
               }else{
                    filterObj.absenceReasons.push(row.ReasonId);
                    filterObj.absenceType.includeVacancies=false;
               }
               break;
            case 'Institution':
                filterObj.institutions = [];
                filterObj.institutions.push(row.InstId);
                break;
            case 'InstitutionCustomerNumber':
                break;
            case 'Month':
                var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December' ];
                var month = row.Month.split(' ')[0];
                var date = new Date();
                if(months[date.getMonth()] === month){
                    filterObj.quickSelected = 'thisMonth';
                    //Need to force these variables because fetchresults is called before scope variables are updated.
                    filterObj.dateRange.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
                    filterObj.dateRange.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                }else{
                    filterObj.quickSelected = 'custom';
                    var monthId, x;
                    for(x =0; x<months.length; x++){
                        if(months[x] === month){
                            monthId = x;
                        }
                    }
                    filterObj.dateRange.startDate = new Date(date.getFullYear(), monthId, 1);
                    filterObj.dateRange.endDate = new Date(date.getFullYear(), monthId + 1, 0);
                }
                break;
            case 'Worker':
                if (row.IsVacancy) {
                    filterObj.vacancyProfiles = [];
                    filterObj.vacancyProfiles.push(row.WkId);
                } else {
                    filterObj.workers = [];
                    filterObj.workers.push(row.WkId);
                }
                break;
            case 'WorkerType':
                filterObj.workerTypes = [];
                filterObj.workerTypes.push(row.WktId);
                break;
            case 'Year':
                filterObj.quickSelected = 'thisYear';
                //Need to force these variables because fetchresults is called before scope variables are updated.
                var date = new Date();
                filterObj.dateRange.startDate = new Date(date.getFullYear(), 0, 1);
                filterObj.dateRange.endDate = new Date(date.getFullYear(), 11, 31);
                break;
            default:
                //return null;
        }

        if (!route.vm.showDetails) {
            filterObj.groupBy=row.groupDrillDown;
        }

        if(search){
            $scope.$emit('report-go-search');
        }
    }


    /*******************************************************Download Dialog*********************************************/

    function showDialog (row,total) {

        var downloadFilters = angular.copy(route.vm.filters);
        if(!total){
            getFilterValue(row, downloadFilters, false);
        }
        route.downloadDialog = ngDialog.open({
            template:'/routes/abs-mgt/reports/absence/interactive-download.html',
            controller:'AbsInteractiveDownloadCtrl',
            closeByDocument: false,
            closeByNavigation:false,
            className: 'ngdialog-theme-default download-details-dialog',
            //scope:route,
            data: {
                'row':row,
                'routeVm':route.vm,
                'dialog':route.downloadDialog,
                'filters':downloadFilters,
                'totalRow':total
            }
        });

        //allow us to execute a function if specified on close of the dialog
        route.downloadDialog.closePromise.then(function(data){
            if (angular.isFunction(data.value)) {
                data.value();
            }
        });
    }

// #----- END InteractiveCtrl -----# //
});}());
