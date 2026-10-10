(function() {'use strict';angular.module('aesop')
.controller('AbsenceApproverLogCtrl', function (absenceRequestApi, $stateParams, absrStateVal, toastHelp, stringSvc, identityMgmtSvc, $location) {
// #--------------------------------------# //
// #------- AbsenceApproverLogCtrl -------# //

    // this is a route controller
    var route = this;
    var absrState = absrStateVal;

    // View Model properties
    route.vm = {
        isLoading: true,
        cols: [
            {
                key: 'description', width: '11/24',
                name: 'Description',
                sortable: false,
                template: '{{row.description}}'
            },
            {
                key: 'who', width: '4/24',
                name: 'Who',
                sortable: false,
                template: '<cmpt-change-log change-log="row"></cmpt-change-log>'
            },
            {
                key: 'where', width: '3/24',
                name: 'Where',
                sortable: false,
                template: '{{row.where}}'
            },
            {
                key: 'date', width: '4/24',
                name: 'Date',
                sortable: false,
                template: '{{row.date}}'
            },
            {
                key: 'status', width: '2/24',
                name: 'Status',
                sortable: false,
                template: '{{row.status}}'
            }
        ],
        data: []
    };


    route.strings = stringSvc.getStrings([
        'AbsenceLog.text.NoRecordFound',
        'NoApprovalRequired'
    ]);

    if (absrStateVal.worker.isVacancy) {
        //There is no approver log for vacancies... just go to VIEW mode on the vacancy.
        var url = $location.url();
        $location.url(url.replace("log/approver", "view"));
    }
    else { 
        if (absrState.absr.requiresApproval) {
            absenceRequestApi.approverLog({absrid:$stateParams.absrid}).then(function(data) {
                route.vm.data = data;
                route.vm.isLoading = false;
            }, function(rejection) {
                toastHelp.error(rejection.$messages, 'Error');
                route.vm.isLoading = false;
            });
        }
        else {
            route.vm.isLoading = false;
        }
    }


// #----- END AbsenceApproverLogCtrl -----# //
});}());