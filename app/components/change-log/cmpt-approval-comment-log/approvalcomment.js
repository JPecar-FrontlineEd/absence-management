(function() {'use strict';angular.module('aesop')
.directive('cmptApprovalCommentLog', function () {return {

// directive options
restrict: 'E',
scope: {
	comment: '='
},
replace: true,
templateUrl: '/components/change-log/cmpt-approval-comment-log/approvalcomment.html',

// #--------------------------------------------------------------# //
// #---- Component (cmpt-approval-comment-log) ----# //
controller: function ($scope, stringSvc, identityMgmtSvc) {
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'ImpersonatedBy',
		'Loading',
		'Error'
	]);

	// View Model properties
	var vm = $scope.vm = {
		commentHtml: '',
		row: $scope.comment,
		loading: false
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		getCommentDetails
	};

	function getCommentDetails() {
		if (!vm.commentHtml) { //get the flid details if we didn't already.
			vm.commentHtml = getLoadingHtml();

			if (!vm.loading) {
				vm.loading = true;

				identityMgmtSvc.getFlidInformation(vm.row.ImpersonatorFlid).then(function success(data) {
					vm.loading = false;
					vm.data = data;
					vm.commentHtml = getChangeLogHtml();
				}, function failure(data) {
					vm.loading = false;
					vm.data = null;
					vm.commentHtml = '<span>' + strings['Error'] + '</span>';
				});
			}
		} else { //we already have this info. make sure the HTML is right.
			vm.commentHtml = getChangeLogHtml();
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

// #-- END Component (cmpt-approval-comment-log) --# //
// #--------------------------------------------------------------# //
};});}());