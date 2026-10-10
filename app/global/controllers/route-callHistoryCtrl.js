(function() {'use strict';angular.module('aesop')
.controller('CallHistoryCtrl', function ($q, stringSvc, absenceRequestApi, reportHelp, permissionSvc, toastHelp) {
// #-------------------------------# //
// #------- CallHistoryCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'Reports.Title.AbsenceCallHistory',
        'Table.Header.DateTime',
        'Table.Header.StartEnd',
        'Reports.GroupSummary.Label.TotalCalls',
        'Reports.Results.Label.InitialInstructions',
        'NoRecordsFound',
        'Reports.CriteriaPanel.Button.Print'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            absrId: null, //152195435
            fields: '(AbsrId,AbsrStart,AbsrEnd,SubId,SubFirstName,SubMiddleName,SubLastName,Institution,WorkId,WorkFullName,Phone,LineStatus,Status,Direction,StartTime)'
        },
        columns:[
            {
                key: 'StartTime', width: '4/24',
                name: 'Table.Header.DateTime',
                noTitle: true,
                template:'{{row.StartTime | parseAesopDate}} {{row.StartTime | time:"h:mm:ss T"}}'
            },
            {
                key: 'Direction', width: '2/24',
                name: 'Direction',
                noTitle: true,
                template: '{{row.Direction}}'
            },
            {
                key: 'Status', width: '5/24',
                name: 'Status',
                noTitle: true,
                template: '{{row.Status}}'
            },
            {
                key: 'LineStatus', width: '3/24',
                name: 'Line',
                noTitle: true,
                template: '{{row.LineStatus}}'
            },
            {
                key: 'SubFullName', width: '10/24',
                name: 'Substitute',
                sortable: false,
                template: '<cmpt-template-substitute-link substitute-id="{{ row.SubId }}" substitute-name="{{ row.SubFullName }}"></cmpt-template-substitute-link>'
            }
        ],
        dataSet:[]
    };
    route.vm.summaryRow = {
        template: '' +
            '<div class="section">' +
                '<div class="first"><span class="label">School:</span> {{summaryRow.data.institution}}</div>' +
                '<div><span class="label">Teacher:</span> <cmpt-template-worker-link worker-id="{{ summaryRow.data.workId }}" worker-name="{{ summaryRow.data.workFullName }}"></cmpt-template-worker-link></div>' +
                '<div><span class="label">Confirmation#: <cmpt-template-confirmation-link absrid="{{ summaryRow.data.absrId }}" ></cmpt-template-confirmation-link></div>' +
            '</div>' +
            '<div class="section">' +
                '<div class="first"><span class="label">Start Date:</span> {{summaryRow.data.absrStart | parseAesopDate}}</div>' +
                '<div><span class="label">End Date:</span> {{summaryRow.data.absrEnd | parseAesopDate}}</div>' +
            '</div>',
        cssClass: 'summary-row'
    };

    //Check to include phone# column if has permission to view sub phone #
    var canViewPhone = permissionSvc.iHave('Sub.ViewPhone');
    if (canViewPhone) {
        route.vm.columns[4].width = '6/24';
        route.vm.columns.push({
            key: 'Phone',
            width: '4/24',
            name: 'Table.Header.Phone',
            noTitle: true,
            template: '{{row.Phone | phoneFormat}}'
        });
    }

    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                var filter = reportHelp.convertCallHistoryFilter(route.vm.filters);
                absenceRequestApi.callHistory(filter).then(function (data){
                    route.vm.dataSet = data.map(function(d) {
                        d.SubFullName = d.SubLastName + ', ' + d.SubFirstName+' '+d.SubMiddleName;
                        return d;
                    });
                    if (data.length > 0) {
                        route.vm.summaryRow.data = {
                            institution: data[0].Institution,
                            workId: data[0].WorkId,
                            workFullName: data[0].WorkFullName,
                            absrId: data[0].AbsrId,
                            absrStart: data[0].AbsrStart,
                            absrEnd: data[0].AbsrEnd
                        };
                    }
                    //route.vm.summaryRow.data = data[0];
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

// #----- END CallHistoryCtrl -----# //
});}());