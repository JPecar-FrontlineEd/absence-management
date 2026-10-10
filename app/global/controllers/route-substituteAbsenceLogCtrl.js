(function() {'use strict';angular.module('aesop')
.controller('SubstituteAbsenceLogCtrl', function ($scope, $stateParams, substituteAbsencesApi, stringSvc, toastHelp) {
// #----------------------------------------# //
// #------- SubstituteAbsenceLogCtrl -------# //

	// this is a route controller
	var route = this;

	$scope.$root.setTitle('Substitute Absence Log');

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
	            template: '{{row.who}}'
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

    substituteAbsencesApi.substituteAbsenceLog({id:$stateParams.id}).then(function(data){
        route.vm.data = data;
        route.vm.isLoading = false;
    }, function(rejection) {
        toastHelp.error(rejection.$messages, 'Error');
        route.vm.isLoading = false;
    });

// #----- END SubstituteAbsenceLogCtrl -----# //
});}());