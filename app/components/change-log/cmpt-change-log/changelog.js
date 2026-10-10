(function() {'use strict';angular.module('aesop')
.directive('cmptChangeLog', function () {return {

// directive options
restrict: 'E',
scope: {
	changeLog: '='
},
replace: true,
templateUrl: '/components/change-log/cmpt-change-log/changelog.html',

// #--------------------------------------------------------------# //
// #---- Component (cmpt-change-log) ----# //
controller: function ($scope, stringSvc, identityMgmtSvc) {
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'ImpersonatedBy',
		'Loading',
		'Error'
	]);

	// View Model properties
	var vm = $scope.vm = {
		changeLogHtml: '',
		row: $scope.changeLog,
		loading: false
	};


	// Actions that can be bound to from the view
	var go = $scope.go = {
		getChangeLogDetails
	};

	function getChangeLogDetails() {
		if (!vm.changeLogHtml) { //get the flid details if we didn't already.
			vm.changeLogHtml = getLoadingHtml();

			if (!vm.loading) {
				vm.loading = true;

				identityMgmtSvc.getFlidInformation(vm.row.impersonatorFlid).then(function success(data) {
					vm.loading = false;
					vm.data = data;
					vm.changeLogHtml = getChangeLogHtml();
				}, function failure(data) {
					vm.loading = false;
					vm.data = null;
					vm.changeLogHtml = '<span>' + strings['Error'] + '</span>';
				});
			}
		} else { //we already have this info. make sure the HTML is right.
			vm.changeLogHtml = getChangeLogHtml();
		}
	}

	function getLoadingHtml() {
		return '<div class="qtipChangeLog"><cmpt-ui-loader is-loading="true"></cmpt-ui-loader></div>'
	}

	function getChangeLogHtml() {
		var result = '<div class="qtipChangeLog">';
		result += '<div class="row">'+strings['ImpersonatedBy']+' {{vm.data.lastName}},  {{vm.data.firstName}}</div></div>';
		return result;
	}
}

// #-- END Component (cmpt-change-log) --# //
// #--------------------------------------------------------------# //
};});}());