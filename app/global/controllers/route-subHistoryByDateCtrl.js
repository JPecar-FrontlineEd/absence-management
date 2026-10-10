(function() {'use strict';angular.module('aesop')
.controller('SubHistoryByDateCtrl', function ($q, $scope, stringSvc, shiftTypesSvc, reportHelp, dateHelp, stringHelp, arrayHelp, absenceApi, gridCellHelp, timeFilter, scrollHelp, toastHelp, parseDateFilter) {
// #------------------------------------# //
// #------- SubHistoryByDateCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'NoRecordsFound',
        'Reports.Title.SubstituteHistoryByDate',
        'Table.Header.Date',
        'Table.Header.FilledReplaced',
        'Table.Header.Conf#',
        'Table.Header.AbsenceVacancyReason',
        'Table.Header.Duration',
        'Table.Header.ActiveEmployee',
        'Table.Header.ActiveSubstitute',
        'Reports.Results.DurationColumn.Break',
        'Reports.Results.Label.InitialInstructions',
        'Reports.GroupSummary.Label.TotalAbsencesVacancies',
        'Validation.Message.DateRangeDaysTooLargeForRun',
        'Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified',
        'Substitute',
        'Reports.CriteriaPanel.Button.Print'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            dateRange: { startDate: new Date(), endDate: new Date() },
            institutions: [],
            substitutes: [],
            printPageBreaks: false,
            includeDeletedSubs: false,
            fields: '(absrId,IsVacancy,worker(id,firstName,middleName,lastName,isActive,title),substitute(id,firstName,middleName,lastName,isActive),' +
                    'entitlement(name),institution(id,name),date,absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,vacancyDuration,' +
                    'vacancyBreakDuration,shiftType,substituteShiftType,DeductBreakFromAbsenceDuration,balanceTrackingType)'
        },
        columns:[
            {
                key: 'absrId', width: '3/24',
                name: 'Table.Header.Conf#',
                noTitle: true,
                template:'<cmpt-template-confirmation-link absrid="{{ row.absrId }}"></cmpt-template-confirmation-link>'
            },
            {
                key: 'date', width: '2/24',
                name: 'Table.Header.Date',
                noTitle: true,
                template:'{{row.date | parseAesopDate}}'
            },
            {
                key: 'replaced', width: '7/24',
                name: 'Table.Header.FilledReplaced',
                noTitle: true,
                template: '<cmpt-template-worker-link worker-id="{{ row.workId }}" worker-name="{{ row.workName }}"></cmpt-template-worker-link>' +
                          '<div class="employee-title">{{ row.workTitle }}</div>' +
                          '<cmpt-template-institution-link inst-id="{{ row.instId }}" inst-name="{{ row.instName }}"></cmpt-template-institution-link>'
            },
            {
                key: 'AbsenceVacancyReason', width: '6/24',
                name: 'Table.Header.AbsenceVacancyReason',
                noTitle: true,
                template: '<div>{{ row.enttName }}</div>' +
                          '<div class="shift-times">{{ row.subStartEnd }}</div>'
            },
            {
                key: 'duration', width: '2/24',
                name: 'Table.Header.Duration',
                noTitle: true,
                template: '<div ng-if="row.willBreakBeDeducted"><div class="durationTime">{{ row.durationFormatted }}</div><div title="[{{row.durationText}} : {{row.breakFormatted}}]" class="breaktime">[{{ row.durationText }}: {{ row.breakFormatted }}]</div></div>' +
                            '<div ng-if="!row.willBreakBeDeducted">' +
                                '<div ng-if="row.itemShiftType === 4"><div class="durationTime">{{ row.durationFormatted }}</div></div>'+
                                '<div class="hide-print" ng-if="row.itemShiftType!==4" ng-bind-html="row.durationHtml"></div>' +
                                '<div class="no-screen" ng-if="row.itemShiftType!==4">{{row.durationTitle}}</div>' +
                            '</div>'
            },
            {
                key: 'activeEmployee', width: '2/24',
                name: 'Table.Header.ActiveEmployee',
                noTitle: true,
                template:'<cmpt-template-boolean value="{{ row.workIsActive }}"></cmpt-template-boolean>'
            },
            {
                key: 'activeSub', width: '2/24',
                name: 'Table.Header.ActiveSubstitute',
                noTitle: true,
                template:'<cmpt-template-boolean value="{{ row.subIsActive }}"></cmpt-template-boolean>'
            }],
        footerColumns:[
            {
                key: 'count', width: '24/24',
                noTitle: true,
                template: route.strings['Reports.GroupSummary.Label.TotalAbsencesVacancies'] + ': {{ group.count }}'
            }],
        validation:{
            dateRange: function (){
                var error = '';
                var maxDaySpan = 92;
                if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate, maxDaySpan, null, route.vm.filters.substitutes)) {
                    error = stringHelp.replace(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'], '{0}', maxDaySpan);
                    error = stringHelp.replace(error, '{1}', route.strings['Substitute']);
                }
                return error;
            }
        },
        dataSet:[]
    };


    function processResults(data) {
        route.vm.dataSet = data.map(function(d) {
            d.workName = d.IsVacancy ? d.worker.lastName : d.worker.lastName + ', ' + d.worker.firstName;
            d.workIsActive = d.worker.isActive;
            d.workTitle = d.worker.title;
            d.subId = d.substitute.id;
            d.subName = d.substitute.lastName + ', ' + d.substitute.firstName+' '+d.substitute.middleName;
            d.subIsActive = d.substitute.isActive;
            d.enttName = d.entitlement.name;
            d.instId = d.institution.id;
            d.instName = d.institution.name;
            d.sortDate = new Date(d.date);
            d.absenceStartEnd = timeFilter(d.absenceStartTime, 'h:mm T') + ' - ' + timeFilter(d.absenceEndTime, 'h:mm T');
            d.subStartEnd = d.absenceStartEnd;
            if (d.substituteStartTime.length > 0) {
                d.subStartEnd = timeFilter(d.substituteStartTime, 'h:mm T') + ' - ' + timeFilter(d.substituteEndTime, 'h:mm T');
            }
            d.durationFormatted = d.vacancyDuration.slice(0,-3);
            d.breakFormatted = d.vacancyBreakDuration.slice(0,-3);
            d.durationText = route.strings['Reports.Results.DurationColumn.Break'];

            //d.durationHtml = gridCellHelp.shiftTypeCellByAbs(d.shiftType);
            d.itemShiftType = (d.IsVacancy || d.substituteShiftType === 0)  ? d.shiftType : d.substituteShiftType;
            d.durationHtml = gridCellHelp.shiftTypeCellByAbs(d.itemShiftType, d.institution.id);
            d.durationTitle = shiftTypesSvc.oneById(d.itemShiftType).title;

            if (d.itemShiftType === 4) {
                d.willBreakBeDeducted = d.DeductBreakFromAbsenceDuration;
            } else if (d.itemShiftType === 1 && d.balanceTrackingType === 2 && d.DeductBreakFromAbsenceDuration) {
                d.willBreakBeDeducted = true;
            } else {
                d.willBreakBeDeducted = false;
            }

            d.groupTitle = '<cmpt-template-substitute-link substitute-id="{{ group.items[0].subId }}" substitute-name="{{ group.items[0].subName }}" ></cmpt-template-substitute-link>';
            return d;
        }).sort(arrayHelp.multiLevelSort(['subName','sortDate']));
    }


    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                var filterOverride =  {
                    absenceType: {
                        includeAbsences: true,
                        includeVacancies: true
                    },
                    filledStatus: {
                        includeFilled: true,
                        includeUnfilled: false,
                        includeNoSubRequired: false
                    },
                    includeDeletedSubs: false
                };

                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                var filter = reportHelp.convertAbsenceFilter(route.vm.filters, filterOverride);
                absenceApi.get(filter).then(function (data){
                    route.strings.$promise.then(function (){
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
        }
    };

// #----- END SubHistoryByDateCtrl -----# //
});}());
