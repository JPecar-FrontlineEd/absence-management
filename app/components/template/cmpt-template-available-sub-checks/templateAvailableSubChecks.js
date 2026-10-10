(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubChecks', function () {return {

// directive options
restrict: 'E',
scope: {
	width: '=',
	subRow:'=',
	substitute:'='
},
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-checks/templateAvailableSubChecks.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-checks) ----# //
controller: function ($scope, stringSvc, orgSvc) {

	var subRow = $scope.subRow;
	var substitute = $scope.substitute;
	var orgData = orgSvc.getOrgData();
	var usingWorkLimits = orgData[0].settings.usesDailyLimits ||
					orgData[0].settings.usesWeeklyLimits ||
					orgData[0].settings.usesMonthlyLimits ||
					orgData[0].settings.usesParentMonthlyLimits ||
					orgData[0].settings.usesParentWeeklyLimits;
	// View Model properties
	var vm = $scope.vm = {
		isSubAssigned: isSubAssigned(subRow.id),
		passesAllChecks: subRow.passesAllChecks,
		usingWorkLimits: usingWorkLimits
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'AvailableSub.Text.ThisSubAlreadyAssigned',
		'AvailableSub.Text.QualifiedAndAvailable',
		'AvailableSub.Text.QualifiedAndAssigned'
	]);


	function isSubAssigned (id) {
		return substitute && id === substitute.id;
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};
}

// #-- END Component (cmpt-template-available-sub-checks) --# //
// #--------------------------------------------------------# //
};});}());