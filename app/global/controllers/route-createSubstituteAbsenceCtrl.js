(function() {'use strict';angular.module('aesop')
.controller('CreateSubstituteAbsenceCtrl', function ($scope, $timeout, stringSvc, subAbsenceSvc, substituteAbsenceVal, absrStepProgressStateVal) {
// #-------------------------------------------# //
// #------- CreateSubstituteAbsenceCtrl -------# //

	// this is a route controller
	var route = this;

	var subAbsenceVal = route.substituteAbsenceVal = substituteAbsenceVal;


	subAbsenceSvc.resetState();
	route.strings = stringSvc.getStrings([
		'Substitute.Absence',
		'SubstituteAbsence.Create.Text',
		'SubstituteAbsence.Create.Text.Step',
		'SubstituteAbsence.Create.Text.SelectSubstitute',
		'Search'
	])

	// View Model properties
	route.vm = {
		canProceed: null,
		steps: absrStepProgressStateVal.types.substituteAbsence,
        filter: ''
	};


	subAbsenceSvc.anyInstituteAvailable().then(function(){
		route.vm.canProceed = true;
	}, function(){
		route.vm.canProceed = false;
	})


	// Actions that can be bound to from the view
	route.go = {
		someAction: function () {
			route.vm.property = 'something';
		}
	};

// #----- END CreateSubstituteAbsenceCtrl -----# //
});}());