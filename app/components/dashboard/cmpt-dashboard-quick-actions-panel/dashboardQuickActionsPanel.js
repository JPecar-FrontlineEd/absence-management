(function() {'use strict';angular.module('aesop')
.directive('cmptDashboardQuickActionsPanel', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/dashboard/cmpt-dashboard-quick-actions-panel/dashboardQuickActionsPanel.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-dashboard-quick-actions-panel) ----# //
controller: function ($scope,stringSvc,permissionSvc,stringHelp,absenceRequestApi, searchSvc, toastHelp, parseDateFilter) {

	if(permissionSvc.iHave('!Pseudo.ISCAMPUSUSER')){
		return;
	}

	var totalApprovalDays = 45;
	var totalReconcileDays = 30;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Dashboard.Header.QuickActions.Label',
		'Dashboard.Header.Button.Search',
		'Dashboard.ConfirmationNumber.Input.Placeholder',
		'Dashboard.Header.Button.CreateAbsence',
		'Dashboard.Header.Button.CreateVacancy',
		'Dashboard.Header.Button.Approve',
		'Dashboard.Header.ButtonCaption.Approve',
		'Dashboard.Header.Button.Reconcile',
		'Dashboard.Header.ButtonCaption1.Reconcile',
		'Dashboard.Header.ButtonCaption2.Reconcile',
		'Dashboard.Header.ButtonCaption.NextXDays',
		'Dashboard.Header.ButtonCaption.PastXDays',
		'Dashboard.SearchDialog.FAQ.Message',
		'AbsrIsNull'
	]);

	// View Model properties
	var vm = $scope.vm = {
		searchText: null,
		isSearching: false,
		searchErrors:[],
		approvalCount: 0,
		reconciliationCount:0,
		loadingApprovalCount: true,
		loadingReconciliationCount: true,
		approvalBadgeCaption: stringHelp.replace($scope.strings['Dashboard.Header.ButtonCaption.NextXDays'], '{0}', '<br>' + totalApprovalDays),
		reconcileBadgeCaption: stringHelp.replace($scope.strings['Dashboard.Header.ButtonCaption.PastXDays'], '{0}', '<br>' + totalReconcileDays),
		reconciliationLoadError: false,
		approvalRequestError: false
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		search: function (){
			toastHelp.clear();
			vm.searchErrors.length = 0;
			if(!vm.isSearching){
				if(vm.searchText === null){
					return null;
				}
				if(isNaN(vm.searchText)){
					vm.searchErrors.push(strings['AbsrIsNull']);
					toastHelp.error(vm.searchErrors,'Error');
					return null;
				}
				vm.isSearching = true;
				searchSvc.search(vm.searchText).then(function(){
					vm.isSearching = false;
				},function(){
					vm.isSearching = false;
				});
			}
		}
	};

	permissionSvc.ready.then(function () {
		var now = null,
			startDate = null,
			endDate = null;

		if(permissionSvc.iHave('ABSRAPPRVL.ApproveDeny')){
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 7);
			endDate = new Date();
			endDate.setDate(endDate.getDate() + totalApprovalDays);

			absenceRequestApi.needApprovalCount({
				startDate: parseDateFilter(startDate, 'MM/dd/yyyy'),
				endDate: parseDateFilter(endDate, 'MM/dd/yyyy')
			}).then(function (data) {
				vm.loadingApprovalCount = false;
				vm.approvalRequestError = false;
				vm.approvalCount = data.needApprovalCount;
			}, 
			function(reasons){
				vm.loadingApprovalCount = false;
				vm.approvalRequestError = true;
				console.log(reasons);
				toastHelp.error(reasons.$messages, 'Error');
			});
		}

		
		if(permissionSvc.iHave('ABSR.Approve')){
			now = new Date();
			startDate = new Date(now.setDate(now.getDate() - totalReconcileDays));
			endDate = new Date();
			absenceRequestApi.reconciliationCount({
				startDate: parseDateFilter(startDate, 'MM/dd/yyyy'),
				endDate: parseDateFilter(endDate, 'MM/dd/yyyy')
			}).then(function (data) {
				vm.loadingReconciliationCount = false;
				vm.reconciliationLoadError = false;
				vm.reconciliationCount = data.needsReconciliationCount; 
			}, 
			function(reasons){
				vm.loadingReconciliationCount = false;
				vm.reconciliationLoadError = true;
				console.log(reasons);
				toastHelp.error(reasons.$messages, 'Error');
			});
		}
	});
}

// #-- END Component (cmpt-dashboard-quick-actions-panel) --# //
// #--------------------------------------------------------# //
};});}());
