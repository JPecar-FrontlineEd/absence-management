(function() {'use strict';angular.module('aesop')
.controller('WebtimeTimesheetSummaryCtrl', function ($q, $filter, stringSvc, reportHelp, toastHelp, parseDateFilter, timeSheetApi, locationHelp, arrayHelp, institutionSvc) {
// #-------------------------------------------# //
// #------- WebtimeTimesheetSummaryCtrl -------# //

	// this is a route controller
	var route = this;
	route.strings = stringSvc.getStrings([
		'ts.summaryReport.title',
		'Reports.CriteriaPanel.Button.Print',
		'NoRecordsFound',
		'Reports.Results.Label.InitialInstructions',
		'ts.summaryReport.label.tsnum',
		'ts.summaryReport.label.tsnum',
		'ts.summaryReport.label.timePeriod',
		'Substitute',
		'School',
		'ts.summaryReport.label.hours',
		'ts.summaryReport.label.units',
		'Status',
		'ts.summaryReport.label.released',
		'Approver',
		'ts.summaryReport.label.approvedTime',
		'Log'
	]);

	// View Model properties
	route.vm = {
		isLoading: false,
        dataLoaded: false,
        totalPeriods:null,
        totalHours:null,
        totalUnits:null,
        filters: {
            dateRange:{startDate: null, endDate: null},
            absenceType:{includeAbsences:true, includeVacancies:true},
            timeSheetStatus: {includeSaved: true,includeRevised: true,includePending: true,includeApproved: true,includeSystemApproved: true,includeRejected: true,includePaperTimeSheet: true},
            institutions:[],
            workers:[],
            substitutes:[],
            vacancyProfiles:[],
            orderBy:'timePeriod',
            orderByTitle:'timePeriod',
            orderByOptions:[{
            	value:'timePeriod',
            	title:'Time Period',
            	display:'timePeriod'
            },{
            	value:'substitute',
            	title:'Substitute',
            	display:'Substitute'
            }]
        },
        validation:{
             dateRange: function (){
                 if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,null,'employee',route.vm.filters.workers)){
                     return reportHelp.InjectValuesToResource(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'],'employee',route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate);
                 }else{
                    return '';
                 }
             }
        },
        columns:[{
        	key: 'timesheetNumber', width: '2/24',
            name: 'ts.summaryReport.label.tsnum',
            noTitle:true,
            sortable: false,
            template: '<span><a href="/WebTime/TimeSheet?SubId={{ row.substitute.id }}&TspId={{ row.tsp_id }}&TsId={{ row.timeSheetId }}">{{ row.timeSheetId }}</a></span>'
        },{
        	key: 'timePeriod', width: '3/24',
            name: 'ts.summaryReport.label.timePeriod',
            noTitle:true,
            sortable: false,
            template: '<span><a href="/WebTime/TimeSheet?SubId={{ row.substitute.id }}&TspId={{ row.tsp_id }}&TsId={{ row.timeSheetId }}">{{ row.timePeriod.name }}</a></span>'
        },{
        	key: 'substitute', width: '3/24',
            name: 'Substitute',
            noTitle:true,
            sortable: false,
            template: '<cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substitute.name }}" ></cmpt-template-substitute-link>'
        },{
        	key: 'school', width: '2/24',
            name: 'School',
            noTitle:true,
            sortable: false,
            template: '<span title="{{row.institute.name}}">{{ row.institute.name }}</span>'
        },{
        	key: 'hours', width: '2/24',
            name: 'ts.summaryReport.label.hours',
            noTitle:true,
            sortable: false,
            template: '<span>{{ row.hours }}</span>'
        },{
        	key: 'units', width: '2/24',
            name: 'ts.summaryReport.label.units',
            noTitle:true,
            sortable: false,
            template: '<span>{{ row.units }}</span>'
        },{
        	key: 'status', width: '2/24',
            name: 'Status',
            noTitle:true,
            sortable: false,
            template: '<span>{{ row.status }}</span>'
        },{
        	key: 'released', width: '3/24',
            name: 'ts.summaryReport.label.released',
            noTitle:true,
            sortable: false,
            template: '<span title="{{ row.released }}">{{ row.released }}</span>'
        },{
        	key: 'approver', width: '2/24',
            name: 'Approver',
            noTitle:true,
            sortable: false,
            template: '<span title="{{ row.approver }}">{{ row.approver }}</span>'
        },{
        	key: 'time', width: '2/24',
            name: 'ts.summaryReport.label.approvedTime',
            noTitle:true,
            sortable: false,
            template: '<span>{{ row.approveTime }}</span>'
        },{
        	key: 'log', width: '1/24',
            name: 'Log',
            noTitle:true,
            sortable: false,
            template: '<span><a href="/WebTime/TimeSheet/{{ row.timeSheetId }}/Log?back=summaryreport">Log</a></span>'
        }],
        footerColumns:[{
            key: 'Total', width: '24/24',
            template: '<span>Periods: {{ group.items.length }}</span>' +
            		'<span>Hours: {{ group.totalHours }}</span>'	+
            		'<span>Units: {{ group.totalUnits }}</span>'
        }],
        dataSet:[],
        processGroup: function (group){
        	var totalHours = 0;
        	group.items.forEach(function (item) { totalHours += item.hours; });
        	group.totalHours = (totalHours === 0) ? 0 : parseFloat(totalHours.toFixed(6));
			var totalUnits = 0;
        	group.items.forEach(function (item) { totalUnits += item.units; });
        	group.totalUnits = totalUnits;
        	return group;
        }
	};


	function processResults (data) {
		var totalHours = 0;
		var totalUnits = 0;
        var dataSet = data.map(function (ts){
			var timePeriod = $filter('parseAesopDate')(ts.tsp_startDate) + ' - ' + $filter('parseAesopDate')(ts.tsp_endDate);
			var subId = ts.sub_id;
			var instId = ts.inst_id;
            var subname =  ts.sub_lastName + ', ' + ts.sub_firstName;
			var result = {
                startDate: new Date(ts.tsp_startDate),
				timeSheetId: ts.ts_id,
				timePeriod: {id: ts.ts_id, name:timePeriod, sortText: $filter('parseDate')(ts.tsp_startDate,'yyyy/MM/dd') },
				tsp_id: ts.tsp_id,
				substitute: {id: subId, name: subname, sortText: subname },
				institute: {id: instId, name: ts.inst_name, sortText: ts.inst_name},
				hours: ts.hours,
				units: ts.units,
				status: ts.ts_status,
				released: (ts.latestRelease.length > 0) ? $filter('date')(new Date(ts.latestRelease),'medium'): '',
				approver: ts.ts_approver,
				approveTime: (ts.ts_approverDate.length > 0) ?  $filter('date')(new Date(ts.ts_approverDate),'medium'): ''
			};
            result['group'] =  result[route.vm.filters.orderBy].name.toUpperCase();  //'<span class="'+ result[route.vm.filters.orderBy].id +'">' +
            result['sortText'] = result[route.vm.filters.orderBy].sortText.toUpperCase();
            result['itemSort'] = (route.vm.filters.orderBy === 'timePeriod') ? result.substitute.name : result.startDate;

			return result;
		});
        route.vm.dataSet = dataSet.sort(arrayHelp.multiLevelSort(['sortText','itemSort']));
		route.vm.totalPeriods = route.vm.dataSet.length;
    	route.vm.dataSet.forEach(function (item) { totalHours += item.hours; });
		route.vm.totalHours = (totalHours === 0) ? 0 : parseFloat(totalHours.toFixed(6));
    	route.vm.dataSet.forEach(function (item) { totalUnits += item.units; });
		route.vm.totalUnits = totalUnits;

	}

    angular.element(document).ready(function () {
        fetchInitialResults();
        initializeOrderByOptions();
    });

    function fetchInitialResults() {
        if (locationHelp.hasSearch()) {
            locationHelp.parseSearch(route.vm.filters);
            makeCallToApi();
        }else{
            route.vm.filters.dateRange.startDate = new Date();
            route.vm.filters.dateRange.endDate = new Date();
        }
    }

    function initializeOrderByOptions() {

        //only allow order by school if there are multiple schools.
        var myInsts = institutionSvc.getMyInstitutions();
        if (myInsts.length > 1) {
            route.vm.filters.orderByOptions.push({
                value:'institute',
                title:'School',
                display:'School'
            });
        }
    }



    // Actions that can be bound to from the view
    route.go = {
         callToServer: makeCallToApi
    };

    function makeCallToApi () {
        if(!route.vm.isLoading){
            toastHelp.clear();
            var _defer = $q.defer();
            route.vm.isLoading = true;
            route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
            route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
            var filter = reportHelp.convertTimesheetFilter(route.vm.filters);
            filter.tsStatusIds = statusIds();
            timeSheetApi.get(filter).then(function (data){
                var flatObj = locationHelp.flattenObject(prepFilters());
                locationHelp.updateSearch(flatObj);
                processResults(data);
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


	function statusIds () {
		var status = route.vm.filters.timeSheetStatus;
		var ids = [];
		if(status.includeSaved){
			ids.push(1);
		}
		if(status.includeRevised){
			ids.push(6);
		}
		if(status.includePending){
			ids.push(2);
		}
		if(status.includeApproved){
			ids.push(3);
		}
		if(status.includeSystemApproved){
			ids.push(4);
		}
		if(status.includeRejected){
			ids.push(5);
		}
		if(status.includePaperTimeSheet){
			ids.push(8);
		}
		return ids.join(',');
	}

    function prepFilters(){
        var filters = angular.copy(route.vm.filters);
        if (filters != null) {
            delete filters['orderByOptions'];
        }
        return filters;
    }


// #----- END WebtimeTimesheetSummaryCtrl -----# //
});}());