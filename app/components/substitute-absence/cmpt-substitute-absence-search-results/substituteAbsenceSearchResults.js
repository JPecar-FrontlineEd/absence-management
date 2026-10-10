(function() {'use strict';angular.module('aesop')
.directive('cmptSubstituteAbsenceSearchResults', function () {return {

// directive options
restrict: 'E',
scope: {
	filter: '='
},
replace: true,
templateUrl: '/components/substitute-absence/cmpt-substitute-absence-search-results/substituteAbsenceSearchResults.html',

// #------------------------------------------------------------# //
// #---- Component (cmpt-substitute-absence-search-results) ----# //
controller: function ($scope, $location, $timeout, stringSvc, orgSvc,
						permissionSvc, absrStepProgressStateVal, substituteAbsenceVal,
						substituteApi, stringHelp, userSvc) {

	const fetchAmt = 100;
	let nameWidth = 24;
	let phoneWidth = 6;
	let identifierWidth = 6;
	const canViewPhone = permissionSvc.iHave('SUB.ViewPhone') || !permissionSvc.iHave('PSEUDO.ISCAMPUSUSER');
	const canViewIdentifier = (permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && orgSvc.getOrgData()[0].settings.showIdentifierToCampusUser)
							|| (!permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && permissionSvc.iHave('SECURITY.SECSSNVIEW'));
	var subAbsenceVal = $scope.substituteAbsenceVal = substituteAbsenceVal;

	if(canViewPhone){
		nameWidth = nameWidth - phoneWidth;
	}

	if(canViewIdentifier){
		nameWidth = nameWidth - identifierWidth;
	}


	let nameTmpl = '<div ng-class="{ \'selected\' : (row.id == parent.vm.selectedId) }" ng-click="parent.go.selected(row)" ng-dblclick="parent.go.selectSubstitute(row)">' +
					'<input class="input-radio" type="radio" value="{{ row.id }}" ng-model="parent.vm.selectedId"> ' +
					//'{{ row.name }}' +
					'<cmpt-template-substitute-link substitute-id="{{ row.id }}" substitute-name="{{ row.name }}" show-name-as-link="true" show-link-following-name="true"></cmpt-template-substitute-link>' +
					'</div>'
					;
	let phoneTmpl = '<div ng-class="{ \'selected\' : (row.id == parent.vm.selectedId) }" ng-click="parent.go.selected(row)">{{ row.phone }}</div>';
	let identifierTmpl = '<div ng-class="{ \'selected\' : (row.id == parent.vm.selectedId) }" ng-click="parent.go.selected(row)">' +
						//'{{ row.identifier }}' + 
						'<cmpt-template-substitute-link substitute-id="{{ row.id }}" substitute-name="{{ row.identifier }}" show-name-as-link="true"></cmpt-template-substitute-link>' +
						'</div>';

	let nameCol = {
		key: 'name',
		width: nameWidth + '/24',
		sortable: false,
		name: 'Name',
		template: nameTmpl
	}

	let phoneCol = {
		key: 'phone',
		width: phoneWidth + '/24',
		sortable: false,
		name: 'Phone',
		template: phoneTmpl
	}

	let identifierCol = {
		key: 'identifier',
		width: identifierWidth + '/24',
		sortable: false,
		name: 'Absence.Create.Select.Identifier',
		template: identifierTmpl
	}

	// View Model properties
	var vm = $scope.vm = {
		columns:[],
		results:[],
		loading: false,
		selectedId: null
	};


	vm.columns.push(nameCol);
	if(canViewPhone){
		vm.columns.push(phoneCol);
	}
	if(canViewIdentifier){
		vm.columns.push(identifierCol);
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Select.LoadMore',
		'Absence.Create.Select.Identifier',
		'Absence.Create.Select.Text.NoRecordFound'
	]);


	$scope.$watch('filter', function (mask) {
		vm.nextPage = 0;
		if (mask != null) { fetchData(); }
	});



	function fetchData() {
		vm.loading = true;
		var offset = vm.nextPage * fetchAmt;

		substituteApi.get({
			maxRecords: fetchAmt,
			offSet: offset,
			mask: $scope.filter || '',
			includeInactive: false,
			fields: '(id,firstName,lastName,identifier,phone)'
		})
		.then((vm.nextPage ? addResults : setResults))
		.then(function () {
			vm.loading = false;
			vm.nextPage += 1;
		});
	}


	function addResults(data) {
		vm.results = vm.results.concat(processData(data));
		emitViewHasChange();
	}
	function setResults(data) {
		vm.results = processData(data);
		emitViewHasChange();
	}

	function processData(data) {
		vm.moreRowsAvailable = data.$status === 206;
		return data.map(function (row, i, a) {
			var name = [];
			if (row.lastName) { name.push(row.lastName); }
			if (row.firstName) { name.push(row.firstName); }

			return {
				id: row.id,
				group: row.lastName.charAt(0).toUpperCase(),
				firstName: row.firstName,
				lastName: row.lastName,
				name: name.join(', '),
				identifier: row.identifier,
				phone: canViewPhone ? stringHelp.formatPhone(row.phone) : '',
				selected: false
			};
		});
	}

	function emitViewHasChange() {
		$timeout(function () {
			$scope.$root.$emit('clearInViewState');
		},300)
	}



	// Actions that can be bound to from the view
	var go = $scope.go = {
		selected: function (row) {
			vm.selectedId = row.id;
			var substitute = {
				id: row.id,
				firstName: row.firstName,
				lastName: row.lastName,
				name: row.name,
				identifier: row.identifier,
				phone: row.phone
			}
			$scope.substituteAbsenceVal.substitute = substitute;
		},
		selectSubstitute: function(row){
			var route = absrStepProgressStateVal.types.substituteAbsence[1].route;
			$location.path(route);
		},
		fetchData: fetchData
	};
}

// #-- END Component (cmpt-substitute-absence-search-results) --# //
// #------------------------------------------------------------# //
};});}());