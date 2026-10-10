(function() {'use strict';angular.module('aesop')
.controller('SubstituteAbsencesCtrl', function ($q, $scope, domHelp, stringSvc, reportHelp, toastHelp, parseDateFilter, orgSvc, permissionSvc, substituteAbsencesApi, timeFilter) {
// #--------------------------------------# //
// #------- SubstituteAbsencesCtrl -------# //



	// this is a route controller
  var route = this;
  var orgData = orgSvc.getOrgData();
  const showAccountingCode = orgData[0].settings.ShowAccountingCode;
	const canViewAccountingCode = permissionSvc.iHave('SUBABS.DTLSACCD');
  let institutionColWidth = 8;
  let accountingcodeColWidth = 4;
  if(canViewAccountingCode && showAccountingCode){
    institutionColWidth = institutionColWidth - accountingcodeColWidth;
  }

  route.strings = stringSvc.getStrings([
    'Validation.Message.DateRangeDaysTooLargeForRun',
    'Reports.Title.SubstituteAbsence',
    'Table.Header.Date',
    'Table.Header.Duration',
    'Table.Header.Conf#',
    'Table.Header.School',
    'NoRecordsFound',
    'AccountingCode',
    'Reason',
    'Name',
    'Reports.Results.Label.InitialInstructions'
  ]);

	$scope.$root.setTitle(route.strings['Reports.Title.SubstituteAbsence']);



	let today = new Date();
	let startDay = new Date(new Date().setDate(today.getDate()-30));

	// View Model properties
	route.vm = {
		isLoading: false,
		dataLoaded : false,
		filters: {
			absenceType:{includeAbsences:true},
			dateRange:{startDate: parseDateFilter(startDay, 'MM/dd/yyyy'), endDate:  parseDateFilter(today, 'MM/dd/yyyy')},
			institutions:[],
			substitutes:[],
      absenceReasons:[]
		},
		validation:{
       dateRange: function (){
           if(!reportHelp.ExtraValidationDateRange(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate, 90)){
               return reportHelp.InjectValuesToResource(route.strings['Validation.Message.DateRangeDaysTooLargeForRun'],'',route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate, 90);
           }else{
              return '';
           }
       }
    },
    columns: [{
        key: 'subId', width: '2/24',
        name: 'Table.Header.Conf#',
        sortable: false,
        template:'<cmpt-template-substitute-absence-confirmation substitute-absence-id="{{ row.id }}" ></cmpt-template-substitute-absence-confirmation>'
    }, {
        key: 'substituteName', width: '4/24',
        name: 'Name',
        sortable: true,
        template: '<cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}"></cmpt-template-substitute-link>'
    }, {
        key: 'institutionName', width: institutionColWidth + '/24',
        noTitle:true,
        name: 'Table.Header.School',
        sortable: true,
        template: '{{ row.institutionName }}'
    }, {
        key: 'entitlementTypeName', width: '4/24',
        name: 'Reason',
        sortable: true,
        template: '{{ row.entitlementTypeName  }}'
    }, {
        key: 'duration', width: '4/24',
        name: 'Table.Header.Duration',
        noTitle:true,
        sortable: false,
        template: '{{ row.startTimeFormatted }} - {{ row.endTimeFormatted }}'
    },{
        key: 'dateFor', width: '2/24',
        name: 'Table.Header.Date',
        noTitle:true,
        sortable: false,
        template: '<span>{{ row.dateFor }}</span>'
    }],
    dataSet: [],
    sortBy: ''
	};

  if(canViewAccountingCode && showAccountingCode){
    var index = route.vm.columns.length - 1;
    route.vm.columns.splice(index,0,{
        key: 'accountingcode', width: accountingcodeColWidth + '/24',
        name: 'AccountingCode',
        noTitle: true,
        sortable: false,
        template: '{{ row.accountingCode.name }}'
    });
  }




	function processResults(data) {
        route.vm.dataSet.length = 0;
        domHelp.rAF().then(function () {
        route.vm.dataSet = data.map(function(d) {
                            d.substituteName = d.substitute != null ? d.substitute.firstName + ' '+ d.substitute.lastName : '';
	                          d.startTimeFormatted = timeFilter(d.startTime);
                            d.endTimeFormatted = timeFilter(d.endTime);
                            d.institutionName = d.institution.name;
                            d.entitlementTypeName = d.entitlementType.name;
                            d.dateFor = parseDateFilter(d.date, 'MM/dd/yyyy');
                            d.sortableDate = parseDateFilter(d.date, 'yyyy/MM/dd');
                            return d;
                          });
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
          var filter = reportHelp.convertAbsenceFilter(route.vm.filters);
          substituteAbsencesApi.get(filter).then( function(data) {
              processResults(data);
              route.vm.isLoading = false;
              route.vm.dataLoaded = true;
              return _defer.resolve();
            }, function(error) {
              toastHelp.error(error.$messages, 'Error');
              return _defer.reject();
            });
          return _defer.promise;
      }
		}
	};

// #----- END SubstituteAbsencesCtrl -----# //
});}());
