(function() {'use strict';angular.module('aesop')
.controller('CreateSubstituteAbsenceReviewCtrl', function ($filter,stringSvc, substituteAbsenceVal, absrStepProgressStateVal) {
// #-------------------------------------------------# //
// #------- CreateSubstituteAbsenceReviewCtrl -------# //

	// this is a route controller
	var route = this;

	var subAbsenceVal = route.substituteAbsenceVal = substituteAbsenceVal;


	route.strings = stringSvc.getStrings([
		'Substitute.Absence',
		'SubstituteAbsence.Create.Text',
		'SubstituteAbsence.Create.Text.Step',
		'Absence.Create.Text.ReviewAndConfirmDetailsFor',
		'Absence',
		'Date',
		'School',
		'AbsenceReason',
		'Time',
		'AccountingCode',
		'NoneSelected'
	])

	// View Model properties
	route.vm = {
		steps: absrStepProgressStateVal.types.substituteAbsence,
		titleDate: $filter('date')(new Date(subAbsenceVal.date),'MMMM d')
	};

	// Actions that can be bound to from the view
	route.go = {
		someAction: function () {
			route.vm.property = 'something';
		}
	};

// #----- END CreateSubstituteAbsenceReviewCtrl -----# //
});}());