(function() {'use strict';angular.module('aesop')
.controller('DailyReportCtrl', function ($scope, $q, $location, $timeout, $filter,
                                        permissionSvc, stringSvc, dailyReportSvc, orgSvc, institutionSvc, userPreferenceSvc,
                                        absenceRequestApi, workerApi,
                                        ngDialog, parseDateFilter, config,
                                        iconHelp, toastHelp, reportHelp, domHelp,featureSvc, storageSvc, shiftTypesSvc, dateHelp) {
// #-------------------------------# //
// #------- DailyReportCtrl -------# //

    $scope.$root.setTitle('Daily Report');

    var queryString = $location.search();
    var dateFromSession = storageSvc.load("startDate");
    var date = '';
    if( queryString['date'] != null ){
        date = Date.parse(queryString['date']);
    }
    else{
        if(dateFromSession != null){
            date = Date.parse(dateFromSession);
            storageSvc.clear("startDate");
         }
         else{
            date= new Date();
         }
    }
    var triggerPrint = queryString['print'] != null ? true : false;
    var resultsTimer, lastRequest;

    // this is a route controller
    var route = this;
    route.strings = stringSvc.getStrings([
        'DR.Header.Text.DailyReport',
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
        'Absence',
        'Cancelled',
        'Closed',
        'DR.Tab.Cancelled.NoRecord',
        'DR.Tab.Closed.NoRecord',
        'DR.Dialog.Notes.Text.NotesToSubstitute',
        'DR.Dialog.Notes.Text.NotesToAdministrator',
        'DR.Dialog.Notes.Text.AdminOnlyNotes',
        'Close',
        'Notes',
        'Summary',
        'AbsenceReciept.Files.Dialog.Title.Text',
        'dialog.actions.button.ok',
        'DR.Summary.Label.Totals',
        'DR.Summary.Label.Total',
        'DR.Summary.Label.FillRate',
        'Reports.CriteriaPanel.Button.Print',
        'NotViewableBySubstituteOrEmployee',
        'NotViewableBySubstitute',
        'Shift.EmployeeTimes',
        'Shift.SubstituteTimes',
        'ExternalID'
    ]);
    var orgData = orgSvc.getOrgData();
    var usingApproval = orgData[0].settings.usesAbsenceApproval;
    var usingCancelClosedMode = orgData[0].settings.usesCancelClosedMode;
    var canViewBudgetCode = permissionSvc.iHave('ABSR.DTLSBDCD') && orgData[0].settings.showDailyReportBudgetCode;
    var canViewPayCode = permissionSvc.iHave('ABSR.DTLSPYCD') && orgData[0].settings.showDailyReportPayCode;
    var canViewAdminOnlyNotes = permissionSvc.iHave('ABSR.VIEWDTLSADMINNOTES');
    var sidekickCampusEnabled = featureSvc.get("SidekickCampus").enabled;
    var sidekickNavigatorEnabled = featureSvc.get("SidekickNavigator").enabled;
    var isCampusUser = permissionSvc.iHave('PSEUDO.ISCAMPUSUSER');
		
   
    var institutionTemplate = '<div class="multi-value" ng-class="{\'not-available\': !item.inst.isAvailable}" ng-repeat="item in row.institutions" ><cmpt-template-institution-link  is-daily-report = true  inst-id="{{item.inst.id}}" inst-name="{{item.inst.name}}" show-name-in-bold = "true" show-name-as-link="item.inst.isAvailable" wrap-text-in-line="true"></cmpt-template-institution-link></div>';
    var shiftTemplate = '<div  ng-repeat="item in row.institutions" ng-class="{\'not-available\': !item.inst.isAvailable}" class="multi-value">' + 
                            '<div class="time-wrapper">' + 
                                '<div class="pt-2">'+route.strings['Shift.EmployeeTimes']+'</div>' + 
                                '<div class="shift-time">{{ item.absenceTime }}</div>' +
                            '</div>' + 
                            '<div ng-if="row.canViewSubTimes" class="time-wrapper">' + 
                                
                                '<div class="pt-3">'+route.strings['Shift.SubstituteTimes']+'</div>' + 
                                '<div class="shift-time">{{ item.vacancyTime }}</div>' +
                            '</div>' + 
                            '<hr class="variation-diff-bar" ng-if="row.institutions.length > 1 && row.institutions.length-1 != $index"></hr>' + 
                        '</div>';

    var workerTemplate = dailyReportSvc.getConfig('worker').template;
    if (orgData[0].settings.showDailyReportEmployeeExtId) {
        workerTemplate += '<div class="external-id multi-value" ng-if="row.workerExternalId != null">' +
                                    '<span class="wrap-words external-label">'+route.strings['ExternalID']+'</span>'+' -' + 
                                    '<span class="wrap-words" title="{{ row.workerExternalId }}">{{ row.workerExternalId }}</span>' +
                                '</div>';
    }

    var confirmationTemplate = '<div class="inline-records">' +
                                    '<span class="sub-title">{{ row.absrTypeStr }}</span>' +
                                '</div>' +
                                '<div class="inline-records">' +
                                    '<cmpt-template-confirmation-link is-daily-report = true absrid="{{ row.id }}" ></cmpt-template-confirmation-link>' +
                                '</div>' +
                                '<div class="inline-records-date">' +
                                    '<div class="date">{{ row.date }}</div>' +
                                    '<div class="time">{{ row.time }}</div>' +
                                '</div>' +
                                '<cmpt-template-day-span-indicator class="hide-print" ng-if="row.hasDaysInPast || row.hasDaysInFuture" has-days-in-past="row.hasDaysInPast" has-days-in-future="row.hasDaysInFuture" ></cmpt-template-day-span-indicator>'

    var substituteTemplate = dailyReportSvc.getConfig('substitute').template;
    if (orgData[0].settings.showDailyReportSubstituteExtId) { 
        substituteTemplate += '<div class="external-id" ng-if="row.subExternalId != null">' +
                                    '<span class="wrap-words external-label">'+route.strings['ExternalID']+'</span>'+' -' + 
                                    '<span class="wrap-words" title="{{ row.subExternalId }}">{{ row.subExternalId }}</span>' +
                                '</div>';
    }
    substituteTemplate += '<span class="phone" ng-if="row.subPhone != null">Phone: {{ row.subPhone | phoneFormat }}</span>';
    
    var notesHeaderTemplate = dailyReportSvc.getConfig('notes').headerTemplate;
    
    var groupByEnum = {
        WorkerType: 'workerType',
        Institution: 'firstInstitution'
    }
     
    // View Model properties
    route.vm = {
        IsHeldVisible: false,
        selectedTab:0,
        fillRate: 0,
        printDate:null,
        isLoading: false,
        dataLoaded: false,
        filters: {
            isListView: true,
            date: date,
            absenceType:{includeAbsences:true, includeVacancies:true},
            institutions:[],
            workerTypes:[],
            groupBy: groupByEnum.Institution,
            groupByOptions: [{
                title: 'Employee Type',
                value: groupByEnum.WorkerType
            },{
                title: 'School',
                value: groupByEnum.Institution
            }],
            sortBy: groupByEnum.WorkerType
        },
        sectionLabel: {
            unfilled: 'Dashboard.Header.Unfilled.Label',
            filled: 'Dashboard.Header.Filled.Label',
            nosub: 'Dashboard.Header.NoSubRequired',
            cancelled:'Cancelled',
            closed: 'Closed'
        },
        noDataLabel: {
            unfilled: 'DR.Tab.Unfilled.NoRecord',
            filled: 'DR.Tab.Filled.NoRecord',
            nosub: 'DR.Tab.NoSub.NoRecord',
            cancelled: 'DR.Tab.Cancelled.NoRecord',
            closed: 'DR.Tab.Closed.NoRecord'
        },
        summary: {
            filled: 0,
            unfilled: 0,
            nosub: 0
        },
        data: {
            unfilled: [],
            filled: [],
            nosub: [],
            cancelled: [],
            closed: []
        },
        columns: {
            unfilled: getUnfilledCols(),
            filled: getFilledCols(),
            nosub: getNoSubCols()
        },
        count: {
            unfilled: 0,
            filled: 0,
            nosub: 0,
            cancelled: 0,
            closed: 0,
        },
        tabKeys:[],
        files:[],
        expanded: userPreferenceSvc.get('reportGraphs','dailyReport'),
        sidekickEnabled: false,
        apiData:{}
    };


    if(route.vm.expanded == null){
        userPreferenceSvc.set('reportGraphs','dailyReport', true);
        route.vm.expanded = userPreferenceSvc.get('reportGraphs','dailyReport');
    }

    if (usingCancelClosedMode) {
        route.vm.columns.cancelled = getCancelledCols();
        route.vm.columns.closed = getClosedCols();
        route.vm.data.cancelled = [];
        route.vm.data.closed = [];

    }
    route.vm.tabKeys = Object.keys(route.vm.columns);

    function getUnfilledCols(isNotesExists, groupBy,notesType){
        var workerTypeOrInstTemplate = (groupBy == groupByEnum.WorkerType? dailyReportSvc.getConfig('institution', {width: '3', template: institutionTemplate}):dailyReportSvc.getConfig('workerType',{width:'3'}));
        createHeaderTemplate(isNotesExists,notesType);
        return [dailyReportSvc.getConfig('confirmation', {width: '3', template: confirmationTemplate}),
                dailyReportSvc.getConfig('notes',{width:'2',headerTemplate: notesHeaderTemplate}),
                dailyReportSvc.getConfig('worker', {width: '3', template: workerTemplate}),
                 workerTypeOrInstTemplate,
                dailyReportSvc.getConfig('shift', {width: '3', template: shiftTemplate}),
                dailyReportSvc.getConfig('duration', {width: '2'}),
                dailyReportSvc.getConfig('reason',{width: '2'})];
    }

    function getFilledCols (isNotesExists,groupBy,notesType) {
        var workerTypeOrInstTemplate  = (groupBy == groupByEnum.WorkerType? dailyReportSvc.getConfig('institution', {template: institutionTemplate}):dailyReportSvc.getConfig('workerType',{width:'3'}));
        createHeaderTemplate(isNotesExists,notesType);
        return [dailyReportSvc.getConfig('confirmation', {width: '3', template: confirmationTemplate}),
                dailyReportSvc.getConfig('notes',{width:'2', headerTemplate: notesHeaderTemplate}),
                dailyReportSvc.getConfig('worker', {template: workerTemplate}),
                workerTypeOrInstTemplate,
                dailyReportSvc.getConfig('shift', {width: '3',template: shiftTemplate}),
                dailyReportSvc.getConfig('duration', {width: '2'} ),
                dailyReportSvc.getConfig('reason',{width: '2'}),
                dailyReportSvc.getConfig('substitute', { width:'2',  template: substituteTemplate })];
    }

    function getNoSubCols (isNotesExists,groupBy,notesType) {
        var  workerTypeOrInstTemplate = (groupBy == groupByEnum.WorkerType? dailyReportSvc.getConfig('institution', {width: '3', template: institutionTemplate}):dailyReportSvc.getConfig('workerType',{width:'3'}));
        createHeaderTemplate(isNotesExists,notesType);
        return [dailyReportSvc.getConfig('confirmation', {width: '3', template: confirmationTemplate}),
                dailyReportSvc.getConfig('notes',{width: '2', headerTemplate: notesHeaderTemplate}),
                dailyReportSvc.getConfig('worker', {width: '3', template: workerTemplate}),
                workerTypeOrInstTemplate,
                dailyReportSvc.getConfig('shift', {width: '3', template: shiftTemplate}),
                dailyReportSvc.getConfig('duration', {width: '2'}),
                dailyReportSvc.getConfig('reason',{width: '2'})];
    }
    function getCancelledCols (isNotesExists,groupBy,notesType) {
        var  workerTypeOrInstTemplate = (groupBy == groupByEnum.WorkerType? dailyReportSvc.getConfig('institution', {width: '3', template: institutionTemplate}):dailyReportSvc.getConfig('workerType',{width:'3'}));
        createHeaderTemplate(isNotesExists,notesType);
        return [dailyReportSvc.getConfig('confirmation', {width:'3', template: confirmationTemplate}),
                dailyReportSvc.getConfig('notes',{width: '2', headerTemplate: notesHeaderTemplate}),
                dailyReportSvc.getConfig('worker', {width: '3', template: workerTemplate}),
                workerTypeOrInstTemplate,
                dailyReportSvc.getConfig('shift', {width: '3', template: shiftTemplate}),
                dailyReportSvc.getConfig('duration', {width: '2'}),
                dailyReportSvc.getConfig('reason',{width: '2'}),
                dailyReportSvc.getConfig('cancelClosedReason',{key: 'cancelReason', width: '3' ,name : 'Dashboard.UnfilledTable.CancelReason.Title'})];
    }
    function getClosedCols (isNotesExists,groupBy,notesType) {
       var  workerTypeOrInstTemplate = (groupBy == groupByEnum.WorkerType? dailyReportSvc.getConfig('institution', {width: '3', template: institutionTemplate}):dailyReportSvc.getConfig('workerType',{width:'3'}));
        createHeaderTemplate(isNotesExists,notesType);
        return [dailyReportSvc.getConfig('confirmation', {width:'3', template: confirmationTemplate}),
                dailyReportSvc.getConfig('notes',{width: '2', headerTemplate: notesHeaderTemplate}),
                dailyReportSvc.getConfig('worker', {width: '3', template: workerTemplate}),
                workerTypeOrInstTemplate,
                dailyReportSvc.getConfig('shift', {width: '3', template: shiftTemplate}),
                dailyReportSvc.getConfig('duration', {width: '2'}),
                dailyReportSvc.getConfig('reason',{width: '2'}),
                dailyReportSvc.getConfig('cancelClosedReason',{key: 'cancelReason', width: '3', name : 'Dashboard.UnfilledTable.ClosedReason.Title'})];
    }

    function createHeaderTemplate(isNotesExists,notesType){
        notesHeaderTemplate = isNotesExists ? headerTemplateWithNotes(notesType) : '<span>Notes</span>';
    }

    function getCodes(){
        if(canViewPayCode || canViewBudgetCode){
            route.vm.columns.unfilled.splice(8, 0, dailyReportSvc.getConfig('code', { width: '4'}));
            //route.vm.columns.unfilled[2].width = (usingApproval ? '3' : '4');
    
            route.vm.columns.filled.splice(9, 0, dailyReportSvc.getConfig('code', { width: '4'}));
    
            route.vm.columns.nosub.splice(8, 0, dailyReportSvc.getConfig('code', { width: '4'}));
            route.vm.columns.nosub[2].width = '4';
    
            if (usingCancelClosedMode) {
                route.vm.columns.cancelled.splice(8, 0, dailyReportSvc.getConfig('code', { width: '4'}));
                route.vm.columns.cancelled[0].width = '3';
                route.vm.columns.cancelled[7].width = '3';
    
                route.vm.columns.closed.splice(8, 0, dailyReportSvc.getConfig('code', { width: '4'}));
                //route.vm.columns.closed[2].width = '3';
            }
        }

        if(route.vm.IsHeldVisible){
            route.vm.columns.unfilled.splice(9, 0, dailyReportSvc.getConfig('held'));
        }

        if (usingApproval) {
            route.vm.columns.unfilled.splice(7, 0, dailyReportSvc.getConfig('approval',{name: 'Status', cls:'', width: '2'}));
            //route.vm.columns.unfilled[1].width = '3';
    
            route.vm.columns.filled.splice(7, 0, dailyReportSvc.getConfig('approval',{name: 'Status', cls:'', width: '2'}));
    
            route.vm.columns.nosub.splice(7, 0, dailyReportSvc.getConfig('approval',{name: 'Status', cls:'',width: '2'}));
        }
    }

    function fetchResults(newDate) {
        var _defer = $q.defer();
        var delay = (resultsTimer == null) ? 0 : 200;
        // cancel the previous request and reset timer
        $timeout.cancel(resultsTimer);
        if (lastRequest && lastRequest.$abort) { lastRequest.$abort(); }

        resultsTimer = $timeout(function () {
            route.vm.printDate = parseDateFilter(newDate == undefined ? route.vm.filters.date : newDate,'fullDate');
            route.vm.isLoading = true;
            var filter = reportHelp.convertAbsenceRequestFilter(route.vm.filters);
            filter.startDate = parseDateFilter(newDate == undefined ? route.vm.filters.date : newDate, 'MM/dd/yyyy');
            filter.includeDeleted = usingCancelClosedMode;
            filter.includeClosed = usingCancelClosedMode;
            filter.includeAllDateAbsences = false;
            //includeAllInstAbsences is needed to display itinerant absences on the DR
            //We do not show itinerant absences anywhere else so this param on the endpoint solves that
            filter.includeAllInstAbsences = permissionSvc.iHave('ABSRMLOC.MultiSchoolAbsences');
            filter.includeClosedDays = true;
            filter.includeDeletedWorkers = false;
            filter.fields = '(' +
                                'id,startDate,endDate,requiresApproval,approvalStatus,heldPastFulfillmentCutoff,isHeld,heldUntil,created,needSub,isCancelled,isClosed,cancelReason,' +
                                'notes,notesToAdmin,notesToAdminOnly,substitute(id,firstName,lastName,phone,externalId),'+
                                'worker(id,isVacancy,firstName,lastName,title,externalId,workerType(id,title),institution(id),HalfDayAMEndTime,HalfDayPMStartTime),'+
                                'absences(DeductBreakFromAbsenceDuration,absenceBreakDuration,date,institution(id),entitlement(name),shiftType,substituteShiftType,budgetCode(description),payCode(description),absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,HalfDayAMEndTime,HalfDayPMStartTime)'+
                                ',fileCount' +
                            ')';
            lastRequest = absenceRequestApi
                .get(filter);
            lastRequest
                .then(processResults)
                .then(function () {
                    return _defer.resolve();
                });

        }, delay);
        return _defer.promise;
    }

    function processResults(data) {
        route.vm.apiData = data;
        route.vm.summary.nosub = 0;
        route.vm.summary.filled = 0;
        route.vm.summary.unfilled = 0;
        if (lastRequest.$aborted) { return; }
        route.vm.data.filled = [];
        route.vm.data.unfilled = [];
        route.vm.data.nosub = [];
        route.vm.tabKeys.forEach(key =>{
            route.vm.count[key]=0;
        });
        if (usingCancelClosedMode) {
            route.vm.data.closed = [];
            route.vm.data.cancelled = [];
        }
       
        var instChildren = (route.vm.filters.institutions != null) ? institutionSvc.getInstAndChildrenIds(route.vm.filters.institutions[0]) : [];
        data.forEach(function (row, i, a) {
            var rowAdded = false;
            var section = dailyReportSvc.absrType(row);
            var obj = dailyReportSvc.processColumnDataForEachAbsence(row); 
            obj.forEach(absence => {

                if(section == "unfilled" && !route.vm.IsHeldVisible)
                {
                    route.vm.IsHeldVisible =  absence.heldPastFulfillmentCutoff || (absence.isHeld && !absence.heldPastFulfillmentCutoff);
                }

                //When multi-room permission is on, we need to apply the school filter on front end as API gives us records
                //of all schools, we also need to check if the row is of multi itinerant employee and there is an intersection of filtered 
                //school with any of multi itinerant employee's school.
                // When permission is off, API gives us the filtered results.
                if(permissionSvc.iHave('ABSRMLOC.MultiSchoolAbsences'))
                {  
                
                    if (route.vm.filters.institutions != null && route.vm.filters.institutions.length && !instOverlap(absence.institutionIds, instChildren) && !(instOverlap(absence.allWorkerInstitutions, route.vm.filters.institutions ) )) {
                        return;
                }
                else if(route.vm.filters.institutions != null && route.vm.filters.institutions.length  && instOverlap(absence.allWorkerInstitutions, route.vm.filters.institutions )){
                    absence.institutions.forEach(function(institution){
                        if(institution.inst.id != route.vm.filters.institutions)
                        {
                            institution.inst.isAvailable = false;
                        }
                    });
                    absence.absenceReasons.forEach(function(reason){
                            if(reason.instId != route.vm.filters.institutions){
                                reason.isAvailable = false;
                            }
                    });
                    absence.cls = absence.institutions[0].inst.isAvailable ? '' : 'not-available';
                }
                }
                
                    absence.groupTitleTemplate =
                    [{
                         key: groupByEnum.Institution,
                         value:'<div><cmpt-template-institution-link is-daily-report="true" show-name-in-bold="true" inst-id="'+absence.institutions[0].inst.id+'" inst-name="'+absence.institutions[0].inst.name+'" show-name-as-link="'+ absence.institutions[0].inst.isAvailable +'"></cmpt-template-institution-link></div>',
                     },
                     {
                         key: groupByEnum.WorkerType,
                         value:absence.workerType
                     }];
                route.vm.data[section].push(absence);
                rowAdded =true;
            });
            if(rowAdded){
                route.vm.count[section]++;
            }
        });

        if(route.vm.filters.groupBy == groupByEnum.Institution){
            route.vm.filters.sortBy = groupByEnum.WorkerType;
        }
        else{
            route.vm.filters.sortBy = groupByEnum.Institution;
        }

        appendLegend(route.vm.data.unfilled,'unfilled');
        appendLegend(route.vm.data.filled,'filled');
        appendLegend(route.vm.data.nosub,'noSub');
        if(usingCancelClosedMode){
            appendLegend(route.vm.data.cancelled,'cancelled');
            appendLegend(route.vm.data.closed,'closed');
        }
        getCodes();
        route.vm.isLoading = false;
        route.vm.dataLoaded = true;
        route.vm.summary.nosub = route.vm.count["nosub"];
        route.vm.summary.filled =  route.vm.count["filled"];
        route.vm.summary.unfilled = route.vm.count["unfilled"];
        route.vm.fillRate = 0;
        route.vm.fillRate = calcFillRate();
        if(triggerPrint){
            $timeout(function (){
                $scope.$root.$emit('beforePrint');

                domHelp.rAF().then(function () {
                    domHelp.rAF().then(function () {
                        window.print();
                        $scope.$root.$emit('afterPrint');
                        triggerPrint = false;
                    });
                });
            }, 300);
        }
    }

    function headerTemplateWithNotes(notesType){
        var appendTemplate = '';
        appendTemplate +=  '<span>Notes</span><i class="fa fa-info-circle ng-scope" qtip my="left center" at="right center" qtip-class="notes-content shiftInfo-content" style="float:right;"' + 
                            'content="<div class=\'view-qtip\'>';
                            
        notesType.forEach(function(notesType){
            if(notesType.includes('NotesToSub')){
                appendTemplate += '<div ><span class=\'notesToSub-Icon  fa fa-file-text\'</span><abbr class=\'info-text\'>Notes to Sub</abbr></div>';
            }
            if(notesType.includes('NotesToAdmin')){
                appendTemplate += '<div><span class=\'notesToAdministrator-Icon  fa fa-file-text\'</span><abbr class=\'info-text\'>Notes to Administrator <div class=\'subInfo-text\'>(Not viewable by Substitute)</div></abbr></div>';
            }
            if(notesType.includes('AdminOnly') && canViewAdminOnlyNotes){
                appendTemplate += '<div><span class=\'administratorNotes-Icon  fa fa-file-text\'</span><abbr class=\'info-text\'>Administrator Notes <div class=\'subInfo-text\'>(Not viewable by Substitute or Employee)</div></abbr></div>';
            }
            if(notesType.includes('Attachment')){
                appendTemplate += '<div><span class=\'attachments-Icon  fa fa-paperclip\'</span><abbr class=\'info-text\'>Attachments</abbr></div>';
            }
        }) ;                  
        
        appendTemplate += '</div>"></i>';
    
        return appendTemplate;
    }

    function NotesExists(data){
        var notesType = [];
        for (var i = data.length - 1; i >= 0; i--) {
            var row = data[i];
            if ((row.notes != null && row.notes.length > 0) && !notesType.includes('NotesToSub')){
                notesType.push('NotesToSub');
            }
            if ((row.notesToAdmin != null && row.notesToAdmin.length > 0) && !notesType.includes('NotesToAdmin')){
                notesType.push('NotesToAdmin');
            }
            if ((row.notesToAdminOnly != null && row.notesToAdminOnly.length > 0) && !notesType.includes('AdminOnly')){
                notesType.push('AdminOnly');
            }
            if (row.fileCount > 0 && !notesType.includes('Attachment')){
                notesType.push('Attachment');
            }
        }
        return notesType;
    }

    function appendLegend(data,section){
      var groupByFilter =route.vm.filters.groupBy;
        if (data.length > 0) {
            for (var i = data.length - 1; i >= 0; i--) {
                var row = data[i];
                if ((row.notes != null && row.notes.length > 0) || (row.notesToAdmin != null && row.notesToAdmin.length > 0) || (row.notesToAdminOnly != null && row.notesToAdminOnly.length > 0) || row.fileCount > 0){
                   if(section == 'unfilled'){
                    route.vm.columns.unfilled = getUnfilledCols(true,groupByFilter, NotesExists(data)); 
                    break;
                   }else if(section == 'filled'){
                    route.vm.columns.filled = getFilledCols(true, groupByFilter,NotesExists(data)); 
                    break;
                   }else if(section == 'noSub'){
                    route.vm.columns.nosub = getNoSubCols(true, groupByFilter,NotesExists(data)); 
                    break;
                   }else if(section == 'cancelled'){
                    route.vm.columns.cancelled = getCancelledCols(true, groupByFilter,NotesExists(data)); 
                    break; 
                   }else if(section == 'closed'){
                    route.vm.columns.closed = getClosedCols(true, groupByFilter,NotesExists(data)); 
                    break;
                    }
                }else{
                    removeLegend(section);
                }
            }
        }else{
            removeLegend(section);
        }
        
    }

    function removeLegend(section){
        var groupByFilter = route.vm.filters.groupBy;
        if(section == 'unfilled'){
            route.vm.columns.unfilled = getUnfilledCols(false, groupByFilter); 
            }else if(section == 'filled'){
            route.vm.columns.filled = getFilledCols(false,groupByFilter);            
            }else if(section == 'noSub'){
            route.vm.columns.nosub = getNoSubCols(false,groupByFilter);            
            }else if(section == 'cancelled'){
            route.vm.columns.cancelled = getCancelledCols(false,groupByFilter);             
            }else if(section == 'closed'){
            route.vm.columns.closed = getClosedCols(false,groupByFilter);             
            }
    }
  
    function getUploadedFiles (row) {
        var _defer = $q.defer();
        absenceRequestApi.files.get({absrid: row.id}).then(function (data){
            route.vm.files = route.vm.files.concat(data.map(function (v) {
                v.icon = iconHelp.classForFileExt(v.fileExtension);
                return v;
            }));
            return _defer.resolve();
        }, function (reasons){
            toastHelp.error(reasons.$messages, 'Error');
            return _defer.resolve();
        });
        return _defer.promise;
    }
    function getRelatedFiles (row) {
        var _defer = $q.defer();
        workerApi.relatedFiles.get({
            workerId: row.workerId
        }).then(function (data) {
            var relatedFiles = $filter('instRelatedFiles')(data, row.institutionIds);
            route.vm.files = route.vm.files.concat(relatedFiles.map(function (v) {
                v.icon = iconHelp.classForFileExt(v.fileExtension);
                return v;
            }));
            return _defer.resolve();
        }, function (reasons){
            toastHelp.error(reasons.$messages, 'Error');
            return _defer.resolve();
        });
        return _defer.promise;
    }

    function totalFiles (row) {
        var _defer = $q.defer();
        var uploadedFiles = getUploadedFiles(row);
        var relatedFiles = getRelatedFiles(row);
        $q.all([uploadedFiles,relatedFiles]).then(_defer.resolve);
        return _defer.promise;
    }

    function calcFillRate () {
        if(route.vm.summary.filled === 0){
            return 0;
        }
        var per = (route.vm.summary.filled / (route.vm.summary.filled + route.vm.summary.unfilled)) * 100;
        return per.toFixed(1);
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

    window.addEventListener('scroll', function() {  
        var offset = $('.tab-view').offset();
        var index = route.vm.selectedTab;
        if($('.row-0').length == 1 || index == 0)
        {
            index = 0;
        }
        else if($('.row-0').length == 2)
        {
            index = 1;
        }
       
        var desiredWidth = $('.row-0').length > 0 ? $('.row-0') [index].scrollWidth : 0;
        //Cheking the offset value of the tab-view if that increased from the PageYoffset then reseting the size of the report headers
        if (offset != undefined && window.pageYOffset > offset.top && desiredWidth != 0) {
            $('.tab-view .active .header .header-content').width(desiredWidth-12)
            $('.tab-view .active .content-panel .grid-header').width(desiredWidth)
             $(".grid-header").css({ top: '98px' });
             $('.header-content').height(26);
        } else if(desiredWidth != 0){
            $('.tab-view .active .header .header-content').width('100%');
            $('.tab-view .active .content-panel .grid-header').width(desiredWidth);
            $(".grid-header").css({ "maxWidth" : '100%' });
            $('.header-content').height(20);
            $(".grid-header").css({ top: '0px' });
        }
    });

    // Actions that can be bound to from the view
    route.go = {
        callToServer: function (newDate) {
            return fetchResults(newDate);
        },
        showNotes: function (row,selectedNote){
            var header = '';
            var subHeader = '';
            switch(selectedNote) {
                case 'notes':
                    header = route.strings['DR.Dialog.Notes.Text.NotesToSubstitute'];
                  break;
                case 'notesToAdmin':
                    header = route.strings['DR.Dialog.Notes.Text.NotesToAdministrator'];
                    subHeader = route.strings['NotViewableBySubstitute'];
                  break;
                case 'notesToAdminOnly':
                    header = route.strings['DR.Dialog.Notes.Text.AdminOnlyNotes'];
                    subHeader = route.strings['NotViewableBySubstituteOrEmployee'];
                  break;  
                default:
                    header = route.strings['Notes'];
              }
            var dialog = ngDialog.open({
                template:'/global/modals/absr-notes.html',
                closeByDocument: false,
                closeByNavigation:true,
                showClose :false,
                data: {
                    header: header,
                    subHeader: subHeader,
                    strings: route.strings,
                    notes: row.notes != null && selectedNote == 'notes' ? row.notes : '',
                    notesToAdmin: row.notesToAdmin != null && selectedNote == 'notesToAdmin' ? row.notesToAdmin: '',
                    notesToAdminOnly: row.notesToAdminOnly != null && selectedNote == 'notesToAdminOnly' ? row.notesToAdminOnly : '',
                    buttons: [{
                        title: route.strings['Close'],
                        cls:'normal-btn',
                        icon:'',
                        action: function(){ ngDialog.close(dialog.id); }
                    }]
                }
            });
        },
        showAttachments: function (row){
            if(!row.fetchingFiles){
                route.vm.files = [];
                row.fetchingFiles = true;
                totalFiles(row).then(function (){
                    row.fetchingFiles = false;
                    var dialog = ngDialog.open({
                        template:'/components/absr/cmpt-absr-done-summary/file-attachments.html',
                        closeByDocument: false,
                        closeByNavigation:true,
                        data: {
                            header: route.strings['AbsenceReciept.Files.Dialog.Title.Text'],
                            files: route.vm.files,
                            downloadLink: function (file){
                                    return config.apiEndpoint + '/v1.0/Files/' + file.id + '/Download?key=' + window.escape(file.downloadKey);
                            },
                            buttons: [{
                                title: route.strings['dialog.actions.button.ok'],
                                cls:'fl-button',
                                action: function(obj){
                                    ngDialog.close(dialog.id);
                                }
                            }]
                        }
                    });
                });
            }
        },
        selectTab: function(index){
            if(!route.vm.filters.isListView){
                $scope.$root.$emit('clearInViewState');
                route.vm.selectedTab = index;
            }
        },
        toggleCollapse: function (){
            route.vm.expanded = !route.vm.expanded;
            userPreferenceSvc.set('reportGraphs','dailyReport', route.vm.expanded);
        },
        views: function(val){
            route.vm.filters.isListView = val;
        },
        processData: function(groupBy){
            route.vm.filters.groupBy =groupBy;
          processResults(route.vm.apiData);  
        }
    };



// #----- END DailyReportCtrl -----# //
});}());
