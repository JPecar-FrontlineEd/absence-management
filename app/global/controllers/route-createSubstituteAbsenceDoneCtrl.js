(function() {'use strict';angular.module('aesop')
.controller('CreateSubstituteAbsenceDoneCtrl', function ($location, stringSvc, userSvc, subAbsenceSvc,absrStepProgressStateVal, substituteAbsenceVal, toastHelp) {
// #-----------------------------------------------# //
// #------- CreateSubstituteAbsenceDoneCtrl -------# //

	// this is a route controller
	var route = this;

	var subAbsenceVal = route.substituteAbsenceVal = substituteAbsenceVal;


	route.strings = stringSvc.getStrings([
		'Substitute.Absence',
		'SubstituteAbsence.Create.Text',
		'Absence.Create.Text.YourConfirmationNumberIs',
		'Absence',
		'AbsenceReason',
		'Absence.Reciept.Text.Start/End Times',
		'School',
		'Absence.Create.Text.AbsenceSummaryFor',
		'Absence.Reciept.Text.NextSteps',
		'Absence.Create.ViewAbsence',
		'Absence.Reciept.Text.ViewProfileFor',
		'Absence.Reciept.Text.CreateAnotherAbsence',
		'Absence.Reciept.Text.LogoutOfAesop',
		'Absence.Create.Text.Your',
		'Absence.Create.Text.HasBeenScheduled',
		'Absence.Create.Text.PrintThisPage',
		'Absence.Create.Text.DeleteThis',
		'Error'
	]);

	// View Model properties
	route.vm = {
		steps: absrStepProgressStateVal.types.substituteAbsence
	};

	// Actions that can be bound to from the view
	route.go = {
		view: function (){
			$location.url('/abs-mgt/substitute-absences/detail/'+ substituteAbsenceVal.id +'/view');
		},
		parseTime: function (time){
			return Date.parse(time);
		},
		createAbsence: function (){
			$location.url('/abs-mgt/substitute-absences/create-substitute-absence');
		},
		logOut: function (){
			userSvc.logout();
		},
		delete: function(){
			subAbsenceSvc.showDeleteDialog().then(function (){
				$location.url('/abs-mgt/substitute-absences/create-substitute-absence');
			}, function (error){
				toastHelp.error(error.$messages,route.strings['Error']);
			});
		}
	};

// #----- END CreateSubstituteAbsenceDoneCtrl -----# //
});}());
