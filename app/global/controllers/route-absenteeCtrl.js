(function() {'use strict';angular.module('aesop')
.controller('AbsenteeCtrl', function ($q, $scope,stringSvc,$window,tokenSvc,
                                      userPreferenceSvc, absenceApi,
                                      reportHelp,scrollHelp, parseDateFilter,
                                      parseAesopDateFilter, timeFilter, browserDetectHelp,
                                      gridCellHelp,toastHelp,orgSvc,canvasHelp,
                                      shiftTypesSvc, arrayHelp, urlHelp, formHelp) {
// #----------------------------# //
// #------- AbsenteeCtrl -------# //

    // this is a route controller
    var route = this;
    var currentSearchFilters = {};


    

    $scope.$root.setTitle('Absentee Report');

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'Reports.Title.Absentee',
        'Reports.Results.Label.InitialInstructions',
        'Table.Header.Date',
        'Table.Header.Conf#',
        'Name',
        'School',
        'Reason',
        'Table.Header.Duration',
        'Table.Header.Substitute',
        'NoRecordsFound',
        'Reports.Results.SubNotNeeded',
        'Reports.Results.DurationColumn.Break',
        'Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified',
        'Summary',
        'DR.Summary.Graph.Text.NoAbsencesOrVacancies',
        'DR.Summary.Label.Totals',
        'DR.Summary.Label.Total',
        'DR.Summary.Label.NeedSub',
        'DR.Summary.Label.NoSubNeeded',
        'DR.Summar.Legend.Header.ReadingTheReport',
        'DR.Summary.Legend.Text.NoFillNeeded',
        'Unfilled',
        'DR.Summary.Legend.Text.Filled',
        'Reports.GroupSummary.Label.TotalAbsencesVacancies',
        'Reports.GroupSummary.Label.TotalAbsences',
        'Reports.GroupSummary.Label.TotalVacancies',
        'Validation.Message.DateRangeDaysTooLargeForRun',
        'DR.Tab.Table.Data.Text.Emp',
        'DR.Tab.Table.Data.Text.Sub',
        'BudgetCode',
        'PayCode',
        'Reports.Results.Held',
        'Reports.CriteriaPanel.Button.Print',
        'DR.Summary.Label.Totals',
        'DR.Summary.Label.Total',
        'DR.Summary.Label.NeedSub',
        'DR.Summary.Label.NoSubNeeded',
        'Button.text.PrintPDF'
    ]);


    // View Model properties
   route.vm = {
        isLoading: false,
        dataLoaded: false,
        summary: {
            filled: 0,
            unfilled: 0,
            noNeedSub: 0
        },
        filters: {
            dateRange:{startDate: new Date(), endDate: new Date()},
            absenceType:{includeAbsences:true, includeVacancies:true},
            filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
            institutions:[],
            workers:[],
            workerTypes:[],
            substitutes:[],
            absenceReasons:[],
            vacancyReasons:[],
            vacancyProfiles:[],
            orderBy:'dateForSorting',
            orderByTitle:'dateFormatted',
            orderByOptions:[{value:'dateForSorting',title:'Date',display:'dateFormatted'},{value:'workerName',title:'Employee',display:'workerName'}],
            printPageBreaks:false,
            includeDeletedSubs: true,
            fields: '(id,absrId,institution(id,name),date,lastUpdated,entitlement(id,name),shiftType,payCode(description),budgetCode(description),' +
                'absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,absenceDuration,absenceBreakDuration,' +
                'worker(id,firstName,middleName,lastName,title,workerType(title)),substitute(id,firstName,middleName,lastName),' +
                'DeductBreakFromAbsenceDuration,IsHeld,NeedSub,IsVacancy,lastApprovedAction,startDate,endDate)'
        },
        validation:{
             dateRange: function (){
                 if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,null,'employee',route.vm.filters.workers)){
                     return reportHelp.InjectValuesToResource(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'],'employee',route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate);
                 }else{
                    return '';
                 }
             }
        },
        columns:[{
                key: 'dateFormatted', width: '2/24',
                name: 'Table.Header.Date',
                noTitle:true,
                sortable: false,
                template: '<span>{{row.dateFormatted}}</span>'
            },  {
                key: 'absrId', width: '3/24',
                name: 'Table.Header.Conf#',
                sortable: false,
                template:'<cmpt-template-confirmation-link absrid="{{ row.absrId }}" ></cmpt-template-confirmation-link>' +
                '<div ng-if="row.IsVacancy">Vacancy</div><div ng-if="!row.IsVacancy">Absence</div>'
            },  {
                key: 'name', width: '5/24',
                name: 'Name',
                sortable: false,
                template: '<div><cmpt-template-worker-link worker-id="{{ row.worker.id }}" worker-name="{{ row.workerName }}"></cmpt-template-worker-link>' +
                            '<div class="title">{{row.worker.title}}</div>' +
                            '<div class="employee-type">{{row.worker.workerType.title}}</div>' +
                          '</div>'
            },  {
                key: 'institution', width: '5/24',
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
                template: '<div >{{ row.entitlement.name }}</div>'+
                '<div class="budget-code" ng-if="row.canViewBudgetCode && row.budgetCode!== null"><label>'+route.strings['BudgetCode']+':</label> {{row.budgetCode.description}}</div>'+
                '<div class="pay-code" ng-if="row.canViewPayCode && row.payCode!== null"><label>'+route.strings['PayCode']+':</label> {{row.payCode.description}}</div>'
            },  {
                key: 'duration', width: '2/24',
                name: 'Table.Header.Duration',
                noTitle:true,
                sortable: false,
                template: '<div ng-if="row.shiftType===4"><div class="durationTime">{{row.durationFormatted}}</div>'+
                '<div class="breaktime" ng-if="row.DeductBreakFromAbsenceDuration" title="[{{row.durationText}} : {{row.breakFormatted}}]">[{{row.durationText}}: {{row.breakFormatted}}]</div></div>'+
                '<div class="hide-print" ng-if="row.shiftType!==4" ng-bind-html="row.durationHtml"></div>' +
                '<div class="no-screen" ng-if="row.shiftType!==4">{{row.durationTitle}}</div>'
            },  {
                key: 'substitute', width: '3/24',
                name: 'Table.Header.Substitute',
                noTitle:true,
                sortable: false,
                template: '<div ng-if="row.NeedSub && row.IsHeld"><span class="held">'+route.strings['Reports.Results.Held']+'</span></div>'+
                '<div ng-if="row.substitute != null && row.NeedSub && !row.IsHeld"><cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link></div>'+
                '<div ng-if="!row.NeedSub">'+route.strings['Reports.Results.SubNotNeeded']+'</div>'
            }],
            footerTemplate: '<div ng-if="summaryData.includeAbs && summaryData.includeVac">'+route.strings['Reports.GroupSummary.Label.TotalAbsencesVacancies']+': {{summaryData.count}}</div>'+
                '<div ng-if="summaryData.includeAbs && !summaryData.includeVac">'+route.strings['Reports.GroupSummary.Label.TotalAbsences']+': {{summaryData.count}}</div>'+
                '<div ng-if="!summaryData.includeAbs && summaryData.includeVac">'+route.strings['Reports.GroupSummary.Label.TotalVacancies']+': {{summaryData.count}}</div>',
                processSummary: function (rows) {
                return {
                    includeVac: route.vm.filters.absenceType.includeVacancies,
                    includeAbs: route.vm.filters.absenceType.includeAbsences,
                    count: rows.length
                };
        },
        dataSet:[],
        sortGroupBy: 'confNumForSorting',
        expanded: userPreferenceSvc.get('reportGraphs','absenteeReport')
    };


    if(route.vm.expanded == null){
        userPreferenceSvc.set('reportGraphs','absenteeReport', true);
        route.vm.expanded = userPreferenceSvc.get('reportGraphs','absenteeReport');
    }

    function processResults(data) {
        route.vm.summary.noNeedSub = 0;
        route.vm.summary.filled = 0;
        route.vm.summary.unfilled = 0;
        var orgData = orgSvc.getOrgData();
        var subName;

        route.vm.dataSet = data.map(function(d) {
            if (d.NeedSub === false) {
                route.vm.summary.noNeedSub += 1;
            } else if (d.substitute === null) {
                route.vm.summary.unfilled += 1;
            } else {
                route.vm.summary.filled += 1;
            }

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

            d.confNumForSorting = d.absrId;
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
            d.dateRangeSort = parseDateFilter(d.startDate,'yyyy/MM/dd') + '-' + parseDateFilter(d.endDate,'yyyy/MM/dd');
            d.canViewBudgetCode = orgData[0].settings.ShowAbsenteeReportBudgetCode;
            d.canViewPayCode = orgData[0].settings.ShowAbsenteeReportPayCode;
            return d;
        });
    }

    //Flipping the Order By setting on the report filter panel should update what
    //the sorting needs to be set to within each group of the grid (DE10969)
    $scope.$watch('route.vm.filters.orderBy', function (groupBy) {
        if (groupBy === 'dateForSorting') {
            route.vm.sortGroupBy = 'confNumForSorting';
        } else {
            route.vm.sortGroupBy = 'dateForSorting';
        }
    });

    // Actions that can be bound to from the view
    route.go = {
        callToServer: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                currentSearchFilters = angular.copy(route.vm.filters);
                var filter = reportHelp.convertAbsenceFilter(currentSearchFilters);
                absenceApi.get(filter).then(function (data){
                    route.strings.$promise.then(function (){
                        processResults(data);
                        route.vm.isLoading = false;
                        route.vm.dataLoaded = true;
                        return _defer.resolve();
                    });
                },function(reasons){
                    route.vm.isLoading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
            }
        },
        downloadUrl: function(){
          if(route.vm.dataLoaded){
            var imageStr = (route.vm.expanded) ? canvasHelp.get('#bar').dataUrl() : '';
            var reportDownloadUrl = urlHelp.apiRoot + '/v1.0/AbsenteeReport?token=' + tokenSvc.get();
            var filter = reportHelp.convertAbsenceFilter(currentSearchFilters);
            delete filter.fields;
            filter.img = imageStr;
            filter.printPageBreaks = currentSearchFilters.printPageBreaks;
            filter.orderBy = currentSearchFilters.orderBy;
            formHelp.download(reportDownloadUrl, filter);
          }
        },
        downloadPdf: function(){
          if(route.vm.dataLoaded){
            route.go.downloadUrl();
          }
        },
        toggleCollapse: function (){
            route.vm.expanded = !route.vm.expanded;
            userPreferenceSvc.set('reportGraphs','absenteeReport', route.vm.expanded);
        }
    };

// #----- END AbsenteeCtrl -----# //
});}());
