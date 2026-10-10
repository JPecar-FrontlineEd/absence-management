(function() {'use strict';angular.module('aesop')
.controller('SubSignInCtrl', function ($q, $scope, stringSvc, orgSvc, shiftTypesSvc, tokenSvc, absenceApi, reportHelp, scrollHelp, toastHelp, parseDateFilter, timeFilter, arrayHelp, urlHelp, formHelp) {
// #-----------------------------# //
// #------- SubSignInCtrl -------# //

    // this is a route controller
    var route = this;
    var orgData = orgSvc.getOrgData();
    var showReason = orgData[0].settings.showAbsReasonOnSubSignIn;
    var currentSearchFilters = {};


    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'Reports.Title.SubSignIn',
        'Reports.Results.Label.InitialInstructions',
        'Table.Header.Date',
        'Table.Header.Conf#',
        'Table.Header.Substitute',
        'Table.Header.Signature',
        'Table.Header.Employee',
        'Table.Header.StartEnd',
        'AbsenceReason',
        'VacancyReason',
        'Report.Label.BreakDuration',
        'ExternalID',
        'Duration',
        'NoRecordsFound',
        'Validation.Message.DateRangeDaysTooLargeForRun',
        'Reports.CriteriaPanel.Button.Print',
        'Button.text.PrintPDF'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            dateRange:{startDate: new Date(), endDate: new Date()},
            absenceType:{includeAbsences:true, includeVacancies:true},
            filledStatus: {includeFilled: true, includeUnfilled: false, includeNoSubRequired:false},
            institutions:[],
            workers:[],
            workerTypes:[],
            substitutes:[],
            vacancyProfiles:[],
            orderBy:'dateForSorting',
            orderByTitle:'dateFormatted',
            orderByOptions:[{value:'dateForSorting',title:'Date',display:'dateFormatted'},{value:'workerName',title:'Employee',display:'workerTitle'}],
            printPageBreaks:false,
            fields: '(id,absrId,substituteStartTime,substituteEndTime,absenceStartTime,absenceEndTime,breakDuration,duration,vacancyDuration,absenceDuration,' + 
                'shiftType,substituteShiftType,worker(id,firstName,middleName,lastName,externalId,workerType(title),title),IsVacancy,' +
                'substitute(id,firstName,middleName,lastName,externalId),date,institution(id,name),DeductBreakFromAbsenceDuration,entitlement(name))'
        },
        columns: [],
        dataSet: [],
        sortBy:''
    };

    if(showReason){
        route.vm.filters['absenceReasons'] = [];
        route.vm.filters['vacancyReasons'] = [];
    }


    function getReportColumns(){
        var cols = [{
                key: 'substitute', width: '6/24',
                name: 'Table.Header.Substitute',
                sortable: false,
                noTitle: true,
                template: '<div><cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link></div>' +
                            '<div><cmpt-template-institution-link inst-id="{{ row.institution.id }}" inst-name="{{ row.institution.name }}" invalid-text="N/A"></cmpt-template-institution-link></div>' +
                            '<div class="external-id" ng-if="row.substitute.externalId != null">' +
                                '<div>{{row.externalIdHeader}}:</div>' +
                                '<div>{{row.substitute.externalId}}</div>' +
                            '</div>'
            }, {
                key: 'date', width: '5/24',
                name: 'Table.Header.Date',
                sortable: false,
                noTitle: true,
                template: '{{ row.date | parseDate:"fullDate" }}'
            }, {
                key: 'signature', width: '7/24',
                name: 'Table.Header.Signature',
                sortable: false,
                noTitle: true,
                template:'<div class="line"><span class="x-mark">x</span></div>'
            },  {
                key: 'duration', width: '4/24',
                name: 'Table.Header.StartEnd',
                sortable: false,
                noTitle: true,
                template: '<div ng-if="row.DeductBreakFromAbsenceDuration" title="{{row.breakTip}}">{{row.durationText}}</div>' +
                		  '<div ng-if="!row.DeductBreakFromAbsenceDuration">{{row.durationText}}</div>' +
                            '<div class="duration-text">{{row.durationStart}} - {{row.durationEnd}}</div>' +
                            (showReason ? '<div>{{ row.reasonHeader }}:</div><div>{{ row.entitlement.name }}</div>' : '')
            },  {
                key: 'name', width: '5/24',
                name: 'Table.Header.Employee',
                sortable: false,
                noTitle: true,
                template: '<div><cmpt-template-worker-link worker-id="{{ row.worker.id }}" worker-name="{{ row.workerName }}"></cmpt-template-worker-link>' +
                            '<div class="title">{{row.worker.title}}</div>' +
                            '<div class="employee-type">{{row.worker.workerType.title}}</div>' +
                            '<div class="external-id" ng-if="row.worker.externalId != null">' +
                                '<div>{{row.externalIdHeader}}:</div>' +
                                '<div>{{row.worker.externalId}}</div>' +
                            '</div>'
            },  {
                key: 'id', width: '2/24',
                name: 'Table.Header.Conf#',
                sortable: false,
                noTitle: true,
                template: '<cmpt-template-confirmation-link absrid="{{ row.absrId }}" ></cmpt-template-confirmation-link>'
            }];

        //remove columns based on what we are grouping/ordering on
        if (route.vm.filters.orderBy === 'workerName') {
            cols.splice(4,1);
            route.vm.sortBy = 'dateForSorting';
        } else {
            cols.splice(1,1);
            route.vm.sortBy = 'workerName';
        }

        route.vm.columns = cols;
    }

    function processResults(data) {
        route.vm.dataSet = data.map(function(d) {
            var hasSubTimes = (d.substituteStartTime !== null && d.substituteStartTime !== '');
            var shiftType = (hasSubTimes) ? d.substituteShiftType : d.shiftType;

            d.workerName = d.IsVacancy ? d.worker.lastName : d.worker.lastName + ', ' + d.worker.firstName;
            d.workerTitle = (d.IsVacancy ? d.worker.lastName : d.worker.lastName + ', ' + d.worker.firstName) + ' ('+d.worker.workerType.title+')';
            if (d.worker.externalId != null) {
                d.workerTitle += ' - ' + route.strings['ExternalID'] + ': ' + d.worker.externalId;
            }
            d.substituteName = d.substitute != null ? d.substitute.firstName + ' ' + d.substitute.lastName : '';
            d.dateFormatted = parseDateFilter(d.date,'fullDate');
            d.dateForSorting = parseDateFilter(d.date,'yyyy/MM/dd');
            d.reasonHeader = d.IsVacancy ? route.strings['VacancyReason'] : route.strings['AbsenceReason'];
            d.externalIdHeader = route.strings['ExternalID'];
            d.durationStart = hasSubTimes ? timeFilter(d.substituteStartTime) : timeFilter(d.absenceStartTime);
            d.durationEnd = hasSubTimes ? timeFilter(d.substituteEndTime) : timeFilter(d.absenceEndTime);
            d.breakTip = route.strings['Report.Label.BreakDuration'] + d.breakDuration;
            var shiftTypeObj = shiftTypesSvc.oneById(shiftType);

            d.durationText = shiftTypeObj != null ? shiftTypeObj.title : route.strings['Duration'] + ': '+ d.duration;
            if (shiftType === 4) {
                var duration = (hasSubTimes) ? d.vacancyDuration : d.absenceDuration;
                d.durationText = route.strings['Duration'] + ': ' + timeFilter(duration, 'HH:mm');
            }

            d.absenceStartFormatted = timeFilter(d.absenceStartTime);
            d.absenceEndFormatted = timeFilter(d.absenceEndTime);
            d.subStartFormatted = timeFilter(d.substituteStartTime);
            d.subEndFormatted = timeFilter(d.substituteEndTime);
            return d;
        }).sort(arrayHelp.multiLevelSort([route.vm.filters.orderBy,route.vm.sortBy]));
    }

    // Actions that can be bound to from the view
    route.go = {
        callToServer: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                //need just the date part and not the time
                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                currentSearchFilters = angular.copy(route.vm.filters);
                var filter = reportHelp.convertAbsenceFilter(route.vm.filters);
                absenceApi.get(filter).then(function (data){
                    route.strings.$promise.then(function (){
                        getReportColumns();
                        processResults(data);
                        route.vm.isLoading = false;
                        route.vm.dataLoaded = true;

                    });
                    return _defer.resolve();
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
            var reportDownloadUrl = urlHelp.apiRoot + '/v1.0/SubstituteSignInReport?token=' + tokenSvc.get();
            var filter = reportHelp.convertAbsenceFilter(currentSearchFilters);
            delete filter.fields;
            filter.printPageBreaks = currentSearchFilters.printPageBreaks;
            filter.orderBy = currentSearchFilters.orderBy;
            formHelp.download(reportDownloadUrl, filter);
          }
        },
         downloadPdf: function(){
          if(route.vm.dataLoaded){
            route.go.downloadUrl();
          }
        }
    };

// #----- END SubSignInCtrl -----# //
});}());