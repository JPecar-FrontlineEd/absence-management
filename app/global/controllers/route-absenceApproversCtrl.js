(function() {'use strict';angular.module('aesop')
.controller('AbsenceApproversCtrl', function ($scope,$stateParams, stringSvc, absrStateVal, absenceRequestApi, toastHelp, $location) {
// #------------------------------------# //
// #------- AbsenceApproversCtrl -------# //

    // this is a route controller
    var route = this;
    var absrState = absrStateVal;

    //Get mnemonics that this component needs
  $scope.strings= route.strings = stringSvc.getStrings([
        'ApproverLevel',
        'Approvers',
        'Approver.Text.UpTo',
        'Approver.Text.OfApprovalRequired',
        'level',
        'level_plural',
        'NoApprovalRequired',
        'SendEmailToApprover'
    ]);
  

// View Model properties
    route.vm = {
        isLoading: true,
        resultCols: [{
                key: 'orgUserName',
                name: 'Name',
                width:  '14/24',
                noTitle: true,
                template: '<cmpt-template-admin-link admin-id="{{ row.orgUserId }}" admin-name="{{ row.orgUserName }}" user-type-id="{{ row.userType }}" show-name-as-link="true"></cmpt-template-admin-link>'
            },{
                key: 'canSendEmail',
                name: 'RecieveNotifications',
                width:  '6/24',
                noTitle: true,
                template: '<i ng-class="{\'fa-check\' : row.canSendEmail, \'fa-times\' : !row.canSendEmail }" class="fa"></i>'
            },{
                key: 'orgUserEmail',
                name: 'Email',
                width:  '4/24',
                noTitle: true,
                template: '<a  ng-if="row.orgUserEmail.length > 0" aria-label="{{strings[\'SendEmailToApprover\']}}" class="fa fa-envelope-o" href="mailto: {{row.orgUserEmail}}"></a>'
            }],
        results: [],
        count: 0
  };

    function processData (data) {
        return data.map(function (row, i, a) {
            row.group = route.strings.ApproverLevel + ': ' + row.approverLevel;
            return row;
        });
    }

    if (absrStateVal.worker.isVacancy) {
        //There is no approvers page for vacancies... just go to VIEW mode on the vacancy.
        var url = $location.url();
        $location.url(url.replace("approvers", "view"));
    }
    else { 
        if (absrState.absr.requiresApproval) {
            //load the approvers data
            absenceRequestApi.approvers({absrid:$stateParams.absrid}).then(function(data) {
                route.strings.$promise.then(function() {
                    route.vm.results = processData(data);
                    //figure out max level we have
                    route.vm.count = data.reduce(function (previousValue, currentValue, index, array){
                        return previousValue.approverLevel > currentValue.approverLevel ? previousValue.approverLevel : currentValue.approverLevel;
                    }, 0);
                    route.vm.isLoading = false;
                });
            }, function(rejection) {
                toastHelp.error(rejection.$messages, 'Error');
                route.vm.isLoading = false;
            });
        } else {
            route.vm.isLoading = false;
        }
    }

// #----- END AbsenceApproversCtrl -----# //
});}());