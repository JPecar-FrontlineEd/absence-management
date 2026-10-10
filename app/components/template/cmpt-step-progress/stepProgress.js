(function() {'use strict';angular.module('aesop')
.directive('cmptStepProgress', function () {return {

// directive options
restrict: 'E',
scope: {
	steps: '=',
	currentStep: '@'
},
replace: true,
templateUrl: '/components/template/cmpt-step-progress/stepProgress.html',

// #---------------------------------------------# //
// #---- Component (cmpt-step-progress) ----# //
controller: function ($scope, stringSvc) {

	var vm = $scope.vm = {
		currentStep: parseInt($scope.currentStep, 10)
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Text.SelectEmployee',
		'Absence.Create.Text.SelectProfile',
		'Absence.Create.Text.FillOutDetails',
		'Absence.Create.Text.Review&Confirm',
		'Done',
		'SubstituteAbsence.Create.Text.SelectSubstitute',
		'SubstituteAbsence.Create.Text.FillOutDetails',
		'SubstituteAbsence.Create.Text.Review&Confirm',
	]);
}

// #-- END Component (cmpt-step-progress) --# //
// #---------------------------------------------# //
};});}());