(function() {'use strict';angular.module('aesop')
.directive('cmptSubstituteAbsenceExistingAbsences', function () {return {

// directive options
restrict: 'E',
scope: {
	formValue: '='
},
replace: true,
templateUrl: '/components/substitute-absence/cmpt-substitute-absence-existing-absences/substituteAbsenceExistingAbsences.html',

// #---------------------------------------------------------------# //
// #---- Component (cmpt-substitute-absence-existing-absences) ----# //
controller: function ($scope, stringSvc, substituteAbsenceVal, substituteAbsencesApi, timeFilter, parseDateFilter) {

	var subAbsenceVal = $scope.substituteAbsenceVal = substituteAbsenceVal;

	// View Model properties
	var vm = $scope.vm = {
		isLoading: true,
		absences:[]
	};


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Substitute.Absence.Existing.LoadingSubstituteAbsences',
		'Substitute.Absence.Existing.NoSubstituteAbsences',
		'Substitute.Absence.Existing.SubstituteAbsenceList',
		'Substitute.Absence.Existing.TitleMessage'
	]);


	$scope.$watch('substituteAbsenceVal.date',fetchResult);


	function fetchResult () {
		if(subAbsenceVal.institution == null){
			return;
		}
		if(subAbsenceVal.substitute == null){
			return;
		}
		if($scope.formValue !== undefined && $scope.formValue.$invalid){
			return;
		}

		var filter = {
			startDate: parseDateFilter(subAbsenceVal.date,'MM/dd/yyyy'),
			endDate: parseDateFilter(subAbsenceVal.date,'MM/dd/yyyy'),
			instIds: subAbsenceVal.institution.id,
			subIds: subAbsenceVal.substitute.id
		}
		substituteAbsencesApi.get(filter).then(function (data){
			vm.absences = data.map((x) => {
				return { id: x.id, times: timeFilter(x.startTime) + '-' + timeFilter(x.endTime) };
			}).filter((x) => {
				return x.id !== subAbsenceVal.id;
			});
			vm.isLoading = false;
		});
	}






	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-substitute-absence-existing-absences) --# //
// #---------------------------------------------------------------# //
};});}());