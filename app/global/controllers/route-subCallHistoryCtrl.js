(function() {'use strict';angular.module('aesop')
.controller('SubCallHistoryCtrl', function ($q, $scope, stringSvc, substituteApi, reportHelp, dateHelp, stringHelp, toastHelp, parseAesopDateFilter, parseDateFilter) {
// #----------------------------------# //
// #------- SubCallHistoryCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'NoRecordsFound',
        'Reports.Title.SubstituteCallHistory',
        'Table.Header.DateTime',
        'Table.Header.StartEnd',
        'Table.Header.Conf#',
        'Reports.GroupSummary.Label.TotalCalls',
        'Reports.Results.Label.InitialInstructions',
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
            dateRange: { startDate: dateHelp.addDays(new Date(), -1), endDate: new Date() },
            substitutes:[],
            fields: '(AbsrId,SubId,SubLastName,SubFirstName,SubMiddleName,AbsrStart,AbsrEnd,InstId,Institution,LineStatus,Status,Direction,StartTime)'
        },
        columns:[
            {
                key: 'StartTime', width: '2/24',
                name: 'Table.Header.DateTime',
                noTitle: true,
                sortable: false,
                defaultSort: 'asc',
                template:'{{row.StartTime | parseAesopDate}}<br/>{{row.StartTime | time:"h:mm:ss T"}}'
            },
            {
                key: 'Direction', width: '2/24',
                name: 'Direction',
                noTitle: true,
                sortable: false,
                template: '{{row.Direction}}'
            },
            {
                key: 'Status', width: '2/24',
                name: 'Status',
                noTitle: true,
                sortable: false,
                template: '{{row.Status}}'
            },
            {
                key: 'LineStatus', width: '2/24',
                name: 'Line',
                noTitle: true,
                sortable: false,
                template: '{{row.LineStatus}}'
            },
            {
                key: 'SubFullName', width: '4/24',
                name: 'Substitute',
                sortable: false,
                template: '<cmpt-template-substitute-link substitute-id="{{ row.SubId }}" substitute-name="{{ row.SubFullName }}"></cmpt-template-substitute-link>'
            },
            {
                key: 'Institution', width: '5/24',
                name: 'School',
                noTitle: true,
                sortable: false,
                template: '<cmpt-template-institution-link inst-id="{{ row.InstId }}" inst-name="{{ row.Institution }}" invalid-text="N/A"></cmpt-template-institution-link>'
            },
            {
                key: 'AbsrStartEnd', width: '4/24',
                name: 'Table.Header.StartEnd',
                noTitle: true,
                sortable: false,
                template:'{{row.AbsrStartEnd}}'
            },
            {
                key: 'AbsrId', width: '3/24',
                name: 'Table.Header.Conf#',
                noTitle: true,
                sortable: false,
                template: '<cmpt-template-confirmation-link absrid="{{ row.AbsrId }}" invalid-text="N/A" ></cmpt-template-confirmation-link>'
            }
        ],
        validation:{
            dateRange: function (){
                var error = '';
                var maxDaySpan = 7;
                if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate, maxDaySpan, null, route.vm.filters.substitutes)) {
                    error = stringHelp.replace(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'], '{0}', maxDaySpan);
                    error = stringHelp.replace(error, '{1}', route.strings['Substitute']);
                }
                return error;
            }
        },
        dataSet:[]
    };

    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                var filter = reportHelp.convertCallHistoryFilter(route.vm.filters);
                substituteApi.callHistory(filter).then(function (data){
                    route.vm.dataSet = data.map(function(d) {
                        d.SubFullName = d.SubLastName + ', ' + d.SubFirstName+' '+d.SubMiddleName;
                        d.AbsrStartEnd = (d.AbsrStart !== null) ? parseAesopDateFilter(d.AbsrStart) + ' - ' + parseAesopDateFilter(d.AbsrEnd) : '';
                        return d;
                    });
                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;
                    return _defer.resolve();
                },
                function(reasons){
                    route.vm.isLoading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
            }
        }
    };

// #----- END SubCallHistoryCtrl -----# //
});}());