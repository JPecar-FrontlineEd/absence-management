(function() {'use strict';angular.module('aesop')
.directive('cmptReconcileDetailFilterPanel', function () {return {

// directive options
restrict: 'E',
scope: {
	filters: '=',
	isDataRendered: '=?'
},
replace: true,
templateUrl: '/components/reconcile/cmpt-reconcile-detail-filter-panel/reconcileDetailFilterPanel.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-reconcile-detail-filter-panel) ----# //
controller: function ($scope, stringSvc, permissionSvc) {

	var filters = $scope.filters;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Report.FillStatus.Filled',
		'Report.FillStatus.Unfilled',
		'Report.FillStatus.SubNotNeeded',
		'Reconciliation.Label.Text.FilledStatus',
		'Absences',
		'Vacancies',
		'Reports.CriteriaPanel.Label.Type',
		'State',
		'AbsenceLog.Text.Reconciled',
		'Reconciliation.Header.Text.NotReconcilied',
		'Schools',
		'Reports.CriteriaPanel.Select.AllSchools'
	]);
	var allSchoolsText = strings['Reports.CriteriaPanel.Select.AllSchools'];

	// View Model properties
	var vm = $scope.vm = {
        canViewBudgetCodes: permissionSvc.iHave('ABSR.DTLSBDCD'),
        canViewAccountingCodes: permissionSvc.iHave('ABSR.DTLSACCD'),
        canViewVacancies: permissionSvc.iHave('ABSR.VACANCY'),
        instDefaultText: allSchoolsText
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		isKeyPresent: isKeyPresent
	};

	function isKeyPresent(key) {
        return filters.hasOwnProperty(key);
    }
}

// #-- END Component (cmpt-reconcile-detail-filter-panel) --# //
// #--------------------------------------------------------# //
};});}());