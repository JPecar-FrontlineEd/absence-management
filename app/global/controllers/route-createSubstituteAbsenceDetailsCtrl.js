(function () {
	'use strict'; angular.module('aesop')
		.controller('CreateSubstituteAbsenceDetailsCtrl', function (stringSvc, substituteAbsenceVal, absrStepProgressStateVal) {
			// #--------------------------------------------------# //
			// #------- CreateSubstituteAbsenceDetailsCtrl -------# //
			// 
			// This route supports deep linking via URL parameter:
			// URL: /abs-mgt/substitute-absences/create-substitute-absence-details?subId=123
			// - If subId is provided, substitute data will be loaded automatically
			// - If no subId, uses existing substituteAbsenceVal from workflow
			//

			// this is a route controller
			var route = this;

			var subAbsenceVal = route.substituteAbsenceVal = substituteAbsenceVal;


			route.strings = stringSvc.getStrings([
				'Substitute.Absence',
				'SubstituteAbsence.Create.Text',
				'SubstituteAbsence.Create.Text.Step',
				'Absence.Create.Text.FillOut',
				'Absence',
				'Absence.Create.Text.DetailsFor'
			])


			// View Model properties
			route.vm = {
				steps: absrStepProgressStateVal.types.substituteAbsence
			};

			// Actions that can be bound to from the view
			route.go = {
				someAction: function () {
					route.vm.property = 'something';
				}
			};

			// #----- END CreateSubstituteAbsenceDetailsCtrl -----# //
		});
}());