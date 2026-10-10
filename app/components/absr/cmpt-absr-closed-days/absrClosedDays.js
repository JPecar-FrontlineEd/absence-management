(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrClosedDays', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-closed-days/absrClosedDays.html',

// #-------------------------------------------# //
// #---- Component (cmpt-absr-closed-days) ----# //
controller: function ($scope, stringSvc, absrStateVal) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		singleClosedDays: isVacancy ? 'Vacancy.DaysThatFallOnClosedDays' : 'DaysThatFallOnClosedDays',
		multipleClosedDays : isVacancy ? 'Vacancy.DaysThatFallOnClosedDaysMultiple' : 'DaysThatFallOnClosedDaysMultiple'
	};
	// View Model properties
	var vm = $scope.vm = {
		expanded:false,
		closedDayAbsences: []
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.singleClosedDays,
		mnemonic.multipleClosedDays
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};

	$scope.$watchCollection('absrState.absr.absences', function (newAbsenses) {
		vm.closedDayAbsences = newAbsenses.filter(function (v){ return v.closedDay != null && v.closedDay.closedDayType === 1 ;});
	});
}

// #-- END Component (cmpt-absr-closed-days) --# //
// #-------------------------------------------# //
};});}());