(function() {'use strict';angular.module('aesop')
.controller('AbsenceLogCtrl', function ($scope, absenceRequestApi, $stateParams, absrStateVal, stringSvc, toastHelp, identityMgmtSvc) {
// #------------------------------# //
// #------- AbsenceLogCtrl -------# //

    // this is a route controller
    var route = this;

    $scope.$root.setTitle('Absence Log');


    // View Model properties
    route.vm = {
        isLoading: true,
        cols:[
	        {
	            key: 'description', width: '8/24',
	            name: 'Description',
	            sortable: false,
	            template: '<div ng-bind-html="row.description"></div>'
	        },
	        {
	            key: 'who', width: '4/24',
	            name: 'Who',
	            sortable: false,
	            template: '<cmpt-change-log change-log="row"></cmpt-change-log>'
	        },
	        {
	            key: 'where', width: '4/24',
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
	            key: 'status', width: '4/24',
	            name: 'Status',
	            sortable: false,
	            template: '{{row.status}}'
	        }
        ],
        data:[]

    };


    route.strings = stringSvc.getStrings(['AbsenceLog.text.NoRecordFound']);

    absenceRequestApi.absenceLog({absrid:$stateParams.absrid}).then(function(data){
        route.vm.data = data;
        route.vm.isLoading = false;
    }, function(rejection) {
        toastHelp.error(rejection.$messages, 'Error');
        route.vm.isLoading = false;
    });

// #----- END AbsenceLogCtrl -----# //
});}());