(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateCodes', function () {return {

// directive options
restrict: 'E',
scope: {
	absences:'=',
	wrapTextInLine:'=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-codes/templateCodes.html',

// #-----------------------------------------# //
// #---- Component (cmpt-template-codes) ----# //
controller: function ($scope, institutionSvc, orgSvc) {

	var orgData = orgSvc.getOrgData();

	// View Model properties
	var vm = $scope.vm = {
		absenceList: [],
		orgShowDailyReportBudgetCode: orgData[0].settings.showDailyReportBudgetCode,
		orgShowDailyReportPayCode: orgData[0].settings.showDailyReportPayCode
	};

	vm.absenceList = $scope.absences.map(function (v) {
		var institution = institutionSvc.oneById(v.institution.id || 0);
		v.isAvailable = institution.isAvailable;
		return v;
	});
}

// #-- END Component (cmpt-template-codes) --# //
// #-----------------------------------------# //
};});}());