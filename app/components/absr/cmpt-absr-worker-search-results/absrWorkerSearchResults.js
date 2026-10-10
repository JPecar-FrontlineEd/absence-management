
(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrWorkerSearchResults', function () {return {

// directive options
restrict: 'E',
scope: {
	filter: '=',
	isVacancy: '=?'
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-worker-search-results/absrWorkerSearchResults.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-absr-worker-search-results) ----# //
controller: function ($location, $scope, absrStepProgressStateVal,stringSvc, orgSvc, absrStateVal, workerApi, institutionSvc, arrayHelp, permissionSvc, userSvc, workerSvc) {
	var fetchAmt = 100;
	var orgData = orgSvc.getOrgData();
	var showIdentifier = orgData[0].settings.showIdentifierToCampusUser && !$scope.isVacancy;
	if (userSvc.isOrgUser()) {
		showIdentifier = permissionSvc.iHave('SECURITY.SECSSNVIEW') && !$scope.isVacancy;
	}

	// View Model properties
	var vm = $scope.vm = {
		columns: [
			{
				key: 'name',
				name: 'Name',
				width: '24/24',
				noTitle: true,
				template: '<label for="{{row.id}}"><cmpt-template-worker-link worker-id="{{ row.id }}" worker-name="{{ row.name }}" worker-tooltip-data="row.toolTipData" show-name-as-link="true" show-link-following-name="' + $scope.isVacancy + '" is-vacancy="' + $scope.isVacancy + '"></cmpt-template-worker-link></label>'
			}
		],
		results: [],
		loading: false,
		moreRowsAvailable: false,
		selectedWorker: []
	};

	$scope.absrState = absrStateVal;
	$scope.isVacancy = ($scope.isVacancy == null) ? false : $scope.isVacancy;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Select.LoadMore',
		'Absence.Create.Select.Text.NoRecordFound',
        'Absence.Create.Select.Identifier',
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		selectWorker: function (row) {
			$scope.absrState.worker = row;
			var type = (row.isVacancy) ? 'vacancy': 'absence';
			var route = absrStepProgressStateVal.types[type][1].route;
			$location.path(route);
		},
		fetchData: fetchData
	};



	if(!$scope.isVacancy){
		vm.columns.splice(1,0,{
			key: 'phone',
			name: 'Phone',
			width: '4/24'
		});
		vm.columns.splice(vm.columns.length,0,{
			key: 'school',
			name: 'School',
			width: '8/24',
			noTitle: true,
			template: '<cmpt-template-institution-link inst-id="{{ row.schoolId }}" inst-name="{{ row.school }}" show-name-as-link="true"></cmpt-template-institution-link>' +
						'<span ng-if="row.moreSchools" class="more" qtip content="{{row.moreSchoolsText}}">(+{{row.moreSchools}})</span>'
		});
		vm.columns[0].width = '12/24';
	}

	if (showIdentifier) {
		vm.columns.splice(1,0,{
			key: 'identifier',
			name: 'Absence.Create.Select.Identifier',
			width: '4/24',
			template: '<cmpt-template-worker-link worker-id="{{ row.id }}" worker-name="{{ row.identifier }}" worker-tooltip-data="" show-name-as-link="true" is-vacancy="' + $scope.isVacancy + '"></cmpt-template-worker-link>'
		});
		vm.columns[0].width = '8/24';
	}

	$scope.$watch('filter', function (mask) {
		vm.nextPage = 0;
		if (mask != null) { fetchData(); }
	});

	$scope.$watch('vm.selectedWorker', function (list){
		if (list.length > 0) {
			$scope.absrState.worker = list[0];
		}
	});

	function fetchData() {
		vm.loading = true;
		var offset = vm.nextPage * fetchAmt;

		workerApi.get({
			maxRecords: fetchAmt,
			offSet: offset,
			lastName: $scope.filter || '',
			includeWorkers: !$scope.isVacancy,
			includeVacancies: $scope.isVacancy,
			fields: '(id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment,HalfDayAMEndTime,HalfDayPMStartTime,DeductBreakFromAbsenceDuration)'
		})
		.then((vm.nextPage ? addResults : setResults))
		.then(function () {
			vm.loading = false;
			vm.nextPage += 1;
		});
	}

	function processData(data) {
		vm.moreRowsAvailable = data.$status === 206;
		return workerSvc.processWorkerApiData(data, $scope.isVacancy, showIdentifier);
	}


	function addResults(data) {
		vm.results = vm.results.concat(processData(data));
	}
	function setResults(data) {
		vm.results = processData(data);
	}
}

// #-- END Component (cmpt-absr-worker-search-results) --# //
// #-----------------------------------------------------# //
};});}());
