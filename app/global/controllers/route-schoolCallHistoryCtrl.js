(function() {'use strict';angular.module('aesop')
.controller('SchoolCallHistoryCtrl', function ($q, $scope, stringSvc, institutionApi, reportHelp, dateHelp, stringHelp, toastHelp, parseDateFilter) {
// #-------------------------------------# //
// #------- SchoolCallHistoryCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'NoRecordsFound',
        'Reports.Title.SchoolCallHistory',
        'Table.Header.DateTime',
        'Table.Header.StartEnd',
        'Table.Header.Conf#',
        'Reports.GroupSummary.Label.TotalCalls',
        'Reports.Results.Label.InitialInstructions',
        'Validation.Message.DateRangeDaysTooLargeForRun',
        'Employee',
        'Reports.CriteriaPanel.Button.Print'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            dateRange: { startDate: dateHelp.addDays(new Date(), -7), endDate: new Date() },
            institutions:[],
            fields: '(AbsrId,Institution,SubLastName,SubFirstName,SubMiddleName,AbsrStart,AbsrEnd,WorkId,WorkFullName,SubId,Direction,Status,LineStatus,StartTime)'
        },
        columns:[
            {
                key: 'StartTime', width: '3/24',
                name: 'Table.Header.DateTime',
                noTitle: true,
                template:'{{row.StartTime | parseAesopDate}}<br/>{{row.StartTime | time:"h:mm:ss T"}}'
            },
            {
                key: 'Direction', width: '2/24',
                name: 'Direction',
                noTitle: true,
                template: '{{row.Direction}}'
            },
            {
                key: 'Status', width: '2/24',
                name: 'Status',
                noTitle: true,
                template: '{{row.Status}}'
            },
            {
                key: 'LineStatus', width: '2/24',
                name: 'Line',
                noTitle: true,
                template: '{{row.LineStatus}}'
            },
            {
                key: 'SubFullName', width: '5/24',
                name: 'Substitute',
                template: '<cmpt-template-substitute-link substitute-id="{{ row.SubId }}" substitute-name="{{ row.SubFullName }}"></cmpt-template-substitute-link>'
            },
            {
                key: 'WorkFullName', width: '4/24',
                name: 'Employee',
                template: '<cmpt-template-worker-link worker-id="{{ row.WorkId }}" worker-name="{{ row.WorkFullName }}"></cmpt-template-worker-link>'
            },
            {
                key: 'AbsrStartEnd', width: '4/24',
                name: 'Table.Header.StartEnd',
                noTitle: true,
                template:'{{row.AbsrStart | parseAesopDate}} - {{row.AbsrEnd | parseAesopDate}}'
            },
            {
                key: 'AbsrId', width: '2/24',
                name: 'Table.Header.Conf#',
                noTitle: true,
                template: '<cmpt-template-confirmation-link absrid="{{ row.AbsrId }}" ></cmpt-template-confirmation-link>'
            }],
        footerColumns:[
            {
                key: 'StartTime', width: '3/24',
                noTitle: true,
                template: route.strings['Reports.GroupSummary.Label.TotalCalls'] + ':',
            },
            {
                key: 'count', width: '21/24',
                noTitle: true,
                template: '{{group.count}}'
            }],
        validation:{
            dateRange: function (){
                var error = '';
                var maxDaySpan = 7;
                if(!reportHelp.ExtraValidationDateRange(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate, maxDaySpan)) {
                    error = stringHelp.replace(route.strings['Validation.Message.DateRangeDaysTooLargeForRun'], '{0}', maxDaySpan);
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
                institutionApi.callHistory(filter).then(function (data){
                    route.vm.dataSet = data.map(function(d) {
                        d.SubFullName = d.SubLastName + ', ' + d.SubFirstName+' '+d.SubMiddleName;
                        return d;
                    });
                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;
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

// #----- END SchoolCallHistoryCtrl -----# //
});}());