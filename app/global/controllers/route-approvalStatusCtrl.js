(function() {'use strict';angular.module('aesop')
.controller('ApprovalStatusCtrl', function ($q, $scope, stringSvc, absenceRequestApi, reportHelp, scrollHelp, parseAesopDateFilter, parseDateFilter, toastHelp) {
// #----------------------------------# //
// #------- ApprovalStatusCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'Reports.Title.AbsenceApprovalStatus',
        'Reports.Results.Label.InitialInstructions',
        'Table.Header.Date',
        'Table.Header.Conf#',
        'Name',
        'Reason',
        'Table.Header.Substitute',
        'Status',
        'Table.Header.Approvals',
        'Report.Label.NumDays',
        'NoRecordsFound',
        'Validation.Message.DateRangeDaysTooLargeForRun',
        'Reports.CriteriaPanel.Button.Print'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            dateRange:{startDate: new Date(), endDate: new Date()},
            absenceType:{includeAbsences:true, includeVacancies:false},
            filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
            institutions:[],
            workers:[],
            workerTypes:[],
            substitutes:[],
            absenceReasons:[],
            approvalStatus:{includeUnApproved: true,includeApproved:true, includeDenied:true, includePartialApproved:true},
            includeNoApprovalRequired: false,
            includeAllDateAbsences: true,
            userNameData: true,
            fields: '(id,startDate,endDate,worker(id,firstName,middleName,lastName,title,workerType(title)),substitute(id,firstName,middleName,lastName),'+
                'absences(id,entitlement(name)),closedDayAbsences(id,entitlement(name)),lastApprovedAction,requiresApproval,isApproved,pendingApproved,'+
                'isDenied,isPartiallyApproved,approverName)'
        },
        validation:{
            // dateRange: function (){
            //     if(!reportHelp.ExtraValidationDateRange(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,6)){
            //         return route.strings['Validation.Message.DateRangeDaysTooLargeForRun'];
            //     }
            // }
        },
        columns:[{
                key: 'dateRange', width: '2/24',
                name: 'Table.Header.Date',
                sortable: false,
                //defaultSort: 'asc',
                template: '<span>{{row.dateRange}}</span>'
            },  {
                key: 'id', width: '2/24',
                name: 'Table.Header.Conf#',
                sortable: false,
                template:'<cmpt-template-confirmation-link absrid="{{ row.id }}" ></cmpt-template-confirmation-link>'
            },  {
                key: 'name', width: '5/24',
                name: 'Name',
                sortable: false,
                template: '<div><cmpt-template-worker-link worker-id="{{ row.worker.id }}" worker-name="{{ row.workerName }}"></cmpt-template-worker-link></div>' +
                            '<div class="title">{{row.worker.title}}</div>' +
                            '<div class="employee-type">{{row.worker.workerType.title}}</div>'
            },  {
                key: 'reason', width: '4/24',
                name: 'Reason',
                sortable: false,
                template: '<div ng-repeat="reason in row.absReasons" title="{{reason}}">{{ reason }}</div>' +
                            '<div class="number-of-days"><b>'+ route.strings['Report.Label.NumDays'] +': </b>{{row.absCount}}</div>'
            },  {
                key: 'substitute', width: '4/24',
                name: 'Table.Header.Substitute',
                sortable: false,
                template: '<div ng-if="row.substitute != null"><cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link></div>'
            },  {
                key: 'status', width: '3/24',
                name: 'Status',
                sortable: false,
                template: '<cmpt-template-approval requires-approval="row.requiresApproval" is-approved="row.isApproved" pending-approved="row.pendingApproved" ' +
                                'is-denied="row.isDenied" is-partially-approved="row.isPartiallyApproved"></cmpt-template-approval>'
            },  {
                key: 'approvals', width: '4/24',
                name: 'Table.Header.Approvals',
                sortable: false,
                template: '<div class="name" ng-if="row.approverName != null">{{row.approverName}}</div>' +
                            '<div ng-if="row.lastApprovedActionDateTime != null">' +
                                '{{row.lastApprovedActionDateTime | parseAesopDate}} {{row.lastApprovedActionDateTime | time:"hh:mm T"}}</div>'
            }],
        dataSet:[],
        sort: {}
    };

    function processResults(data) {
        data = data.sort(function (a,b){ return new Date(a.startDate) - new Date(b.startDate); });
        route.vm.dataSet = data.filter(function (a){ return a.requiresApproval; }).map(function(d) {
            d.workerName = d.worker.lastName + ', ' + d.worker.firstName;
            d.substituteName = d.substitute != null ? d.substitute.firstName + ' ' + d.substitute.lastName : '';
            d.dateRange = d.startDate === d.endDate ? parseAesopDateFilter(d.startDate) : parseAesopDateFilter(d.startDate) + ' - ' + parseAesopDateFilter(d.endDate);
            d.absCount = d.absences.length + d.closedDayAbsences.length;
            d.absReasons = [];
            d.absences.forEach(function (abs, i, a) {
                if (d.absReasons.indexOf(abs.entitlement.name) === -1) {
                    d.absReasons.push(abs.entitlement.name);
                }
            });
            d.closedDayAbsences.forEach(function (abs, i, a) {
                if (d.absReasons.indexOf(abs.entitlement.name) === -1) {
                    d.absReasons.push(abs.entitlement.name);
                }
            });
            d.lastApprovedActionDateTime = d.lastApprovedAction != null && d.lastApprovedAction !== '' ? new Date(d.lastApprovedAction) : null;
            d.dateRangeSort = parseDateFilter(d.startDate, 'yyyy/MM/dd') + '-' + parseDateFilter(d.endDate, 'yyyy/MM/dd');
            return d;
        });
    }

    // Actions that can be bound to from the view
    route.go = {
        callToServer: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                var filter = reportHelp.convertAbsenceRequestFilter(route.vm.filters);
                absenceRequestApi.get(filter).then(function (data){
                    processResults(data);
                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;
                    route.vm.sort = {
                        byColumn: 'dateRangeSort',
                        direction: 'asc'
                    };
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

// #----- END ApprovalStatusCtrl -----# //
});}());
