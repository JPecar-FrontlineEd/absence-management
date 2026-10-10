(function() {'use strict';angular.module('aesop')
.controller('CallhistoryLogCtrl', function (absenceRequestApi,$stateParams,permissionSvc,stringSvc,toastHelp) {
// #----------------------------------# //
// #------- CallhistoryLogCtrl -------# //

    // this is a route controller
    var route = this;
    route.vm = {
		isLoading: true,		
        cols:[
	        {
				key: 'StartTime', 
				width: '3/24',
	            name: 'Date',
	            sortable: false,
				template:'{{row.StartTime | parseDate:"M/d/yyyy"}}'
	        },
	        {
				key: 'StartTime', 
				width: '3/24',
	            name: 'Time',
	            sortable: false,
				template:'{{row.StartTime | time:"h:mm T"}}'
			},
	        {
				key: 'Direction', 
				width: '3/24',
	            name: 'Direction',
	            sortable: false,
				template: '{{row.Direction}}'
	        },
	        {
				key: 'Status', 
				width: '3/24',
	            name: 'Status',
	            sortable: false,
	            template: '{{row.Status}}'
	        },
	        {
				key: 'LineStatus', 
				width: '3/24',
	            name: 'Line',
	            sortable: false,
	            template: '{{row.LineStatus}}'
	        },
	        {
				key: 'SubFullName', 
				width: '9/24',
	            name: 'Substitute',
	            sortable: false,
	            template: '<cmpt-template-substitute-link substitute-id="{{ row.SubId }}" substitute-name="{{ row.SubFullName }}" show-name-as-link="true"></cmpt-template-substitute-link>'
	        }
        ],
        data:[]
    };

    route.strings = stringSvc.getStrings(['CallhistoryLog.text.NoRecordFound']);


    var canViewPhone = !permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') //org user can see phone
    	|| (permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && permissionSvc.iHave('Sub.ViewPhone'));
    if(canViewPhone){
            route.vm.cols[5].width='5/24';
            route.vm.cols.push({
                key: 'Phone',
                width: '4/24',
                name: 'Phone',
                sortable: false,
				template:'{{row.Phone | phoneFormat}}'
            });
    }
	
	absenceRequestApi.callHistory({absrid:$stateParams.absrid}).then(function(data){
        route.vm.data = data.map(function(d) {
            d.SubFullName = d.SubFirstName + ' ' + d.SubLastName;
            return d;
        });
        route.vm.isLoading = false;
    }, function(rejection) {
        toastHelp.error(rejection.$messages, 'Error');
        route.vm.isLoading = false;
    });

// #----- END CallhistoryLogCtrl -----# //
});}());