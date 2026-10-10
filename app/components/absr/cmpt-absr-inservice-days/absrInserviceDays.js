(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrInserviceDays', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-inservice-days/absrInserviceDays.html',

// #----------------------------------------------# //
// #---- Component (cmpt-absr-inservice-days) ----# //
controller: function ($scope, stringSvc, absrStateVal) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		singleInServiceDays: isVacancy ? 'VacancyWithInServiceDay' : 'AbsenceRequestWithInServiceDay',
		multipleInServiceDays : isVacancy ? 'VacancyWithInServiceDays' : 'AbsenceRequestWithInServiceDays'
	};
	// View Model properties
	var vm = $scope.vm = {
		expanded:false,
		relatedInserviceAbsrs: relatedInserviceAbsrs(),
		currentAbsrHasInserviceDays:currentAbsrHasInserviceDays()
	};


	function relatedInserviceAbsrs () {
		return absrState.related.filter(function (absr){
			return absr.absences.filter(function (abs){return abs.closedDay !== null && abs.closedDay.closedDayType === 2 ;}).length > 0;
		});
	}

	function currentAbsrHasInserviceDays () {
		return absrState.absr.absences.filter(function (abs){return abs.closedDay !== null && abs.closedDay.closedDayType === 2 ;}).length > 0;
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.singleInServiceDays,
		mnemonic.multipleInServiceDays,
		'MovedTo',
		'AbsenceFallsOnInServiceDay'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};

	$scope.$watch('absrState.related', function (newState) {
		vm.relatedInserviceAbsrs = relatedInserviceAbsrs();
		if (vm.relatedInserviceAbsrs.length == 1 && vm.relatedInserviceAbsrs[0].absences.length == 1){
			$scope.isSingleInServiceDay = true;
		} else {
				$scope.isSingleInServiceDay = false;
			}
	 });
	$scope.$watch('absrState.lastUpdated', function(newState){
		vm.currentAbsrHasInserviceDays = currentAbsrHasInserviceDays(); 
	});
}

// #-- END Component (cmpt-absr-inservice-days) --# //
// #----------------------------------------------# //
};});}());
