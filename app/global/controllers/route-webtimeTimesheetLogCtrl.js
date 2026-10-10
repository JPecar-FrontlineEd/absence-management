(function() {'use strict';angular.module('aesop')
.controller('WebtimeTimesheetLogCtrl', function ($stateParams, stringSvc, timeSheetApi, toastHelp,$window,$scope,$location) {
// #---------------------------------------# //
// #------- WebtimeTimesheetLogCtrl -------# //

	// this is a route controller
	var route = this;
	var tsId = $stateParams.tsId;

	// View Model properties
	route.vm = {
		tsId: tsId,
		isLoading: true,
		backText:'',
        cols:[
	        {
	            key: 'description', width: '8/24',
	            name: 'Description',
	            sortable: false,
	            template: '<div>{{row.description}}</div><div>{{ row.state }}</div>'
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
	            template: '{{row.lastUpdate}}'
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
	route.strings = stringSvc.getStrings([
		'AbsenceLog.text.NoRecordFound',
		'ts.log.subHeading',
		'ts.log.title',
		'{%rrABSWSubWeb%}',
		 'Description',
		 'Who',
		 'Where',
		 'Date',
		 'Status'
	]);

	timeSheetApi.log({tsid: tsId}).then(function(data){
        route.vm.data = data.map(function (a){
        	return a;
        }).sort(function (a,b){
            return new Date(a.lastUpdate) - new Date(b.lastUpdate);
        });
        route.vm.isLoading = false;
    }, function(rejection) {
        toastHelp.error(rejection.$messages, 'Error');
        route.vm.isLoading = false;
    });

	// Actions that can be bound to from the view
	route.go = $scope.go =  {
		GoBack: function () {
			$window.history.back();
		}
	};

	function getQueryParameters(){
		var queryString = $location.search();
		if(queryString.back){
			if(queryString.back === 'summaryreport'){
				route.vm.backText='Back to Time Sheet Summary Report';
			}else if(queryString.back === 'details'){
				route.vm.backText='Back to Time Sheet Details';
			}

		}

	}

	getQueryParameters();

// #----- END WebtimeTimesheetLogCtrl -----# //
});}());