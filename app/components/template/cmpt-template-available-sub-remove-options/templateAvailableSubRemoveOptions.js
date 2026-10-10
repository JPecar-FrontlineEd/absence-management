(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubRemoveOptions', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-remove-options/templateAvailableSubRemoveOptions.html',

// #----------------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-remove-options) ----# //
controller: function (ngDialog, $scope, $filter, $state, stringSvc, absrSvc, absrStateVal, substituteApi, cancellationReasonApi, toastHelp, domHelp, absenceRequestApi) {

	var absrState = $scope.absrState = absrStateVal;
	var context = absrState.context;
	var substitute = absrState.substitute;
	var isVacancy = absrState.worker.isVacancy;
	var cancelReasons = [];

	// View Model properties
	var vm = $scope.vm = {
		requestedOptions:[],
		isProcessing: false,
		leadTime: context.leadTimeHoursForPunishSub,
		datesWithinXHoursOfStartingString: datesWithinXHoursOfStartingString(),
		allowSubToSeeJob: false,
		notifySub:true,
		preventSubFromWorking:false,
		requestedBy:4,
		cancellationReasons: [],
		cancellationReason: 0
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Substitute',
		'From',
		'Remove',
		'Cancel',
		'AbsenceForm.RemoveSub.Label.AllowSubToSeeAfterRemoval',
		'AbsenceForm.RemoveSub.Label.NotifySub',
		'AbsenceForm.RemoveSub.Label.PunishSub',
		'AbsenceForm.RemoveSub.Label.RequestedBy',
		'Absense.Label.Text.CancellationReasons',
		'UserType.Administrator',
		'UserType.Substitute',
		'RemoveSub.RequestedBy.Option.SubNoShow',
		'UserType.Employee',
		'AbsenceForm.Button.RemoveSub',
		'Absence.RemoveSub.dialogTitle',
		'CancelAssignment.AsNonSubUser.SuccessMessage',
		'NoneSelected',
		'SelectCancellationReason',
		'SelectRequestedBy',
		'Absence',
		'Deleted',
		'Vacancy',
		'Delete',
		'And'
	]);

	strings.$promise.then(function () {
		vm.requestedOptions = [{
					id:4,
					value: strings['UserType.Administrator']
				},{
					id:6,
					value: strings['UserType.Substitute']
				},{
					id:37,
					value: strings['RemoveSub.RequestedBy.Option.SubNoShow']
				},{
					id:3,
					value: strings['UserType.Employee']
			}];
	});

	cancellationReasonApi.queryCached().then(function(reasons){
		vm.cancellationReasons = reasons.map(function(v, i, a) {
			return { id: v.id, value: v.description };
		});
	});

	function datesWithinXHoursOfStarting () {
		var leadTime = context.leadTimeHoursForPunishSub;
		var punishmentCutoff = (new Date()).add(leadTime).hours();
		var variations  = absrState.absrVariations;
		var dates = [];
		variations.forEach(function (v){
			var startTime = v.vacancyStartTime || '';
			v.dates.forEach(function (date){
				var dateTime = Date.parse(date + ' ' + startTime);
				//==== getting the todays date ====
				//==== setting hours, minutes, seconds and milliseconds to zero ====
				//==== to match the dates only, ignoring hours, minutes, seconds and milliseconds====
				var today = new Date();
				today.setHours(0);
				today.setMinutes(0);
				today.setSeconds(0);
				today.setMilliseconds(0);
				//==== end ====
                if(!(Date.parse(date) < today) && (dateTime < punishmentCutoff)){
                	dates.push(date);
                }
			});
		});
		return dates;
	}

	function datesWithinXHoursOfStartingString () {
		var dates = datesWithinXHoursOfStarting();
        var string = dates.filter(function (el,i,a){
			return a.indexOf(el) === i;
		}).join(', ');
        return string;
	}

	function returnToCreate(){
		absrSvc.resetState();
		if (isVacancy) {
			$state.go('base.vacancyCreateDetails');
		} else {
			$state.go('base.absrCreateDetails');
		}
	}

	function deleteAbsr(cancelSelections) {
		var absrIsVacancy = absrState.worker != null ? absrState.worker.isVacancy : false;
		var deleteAbsenceRequest = absenceRequestApi.deleteAbsr({ absrid: absrState.id, cancelReasonId: cancelSelections.id, cancelNotes: cancelSelections.notes });
		deleteAbsenceRequest.then(function (data) {
			vm.isProcessing = false;
			ngDialog.close(this);
			toastHelp.info([strings['CancelAssignment.AsNonSubUser.SuccessMessage']], strings['Absence.RemoveSub.dialogTitle']);
			var successMessage = (absrIsVacancy ? strings['Vacancy'] : strings['Absence']) + ' #' + absrState.id + ' ' + strings['Deleted'];
			toastHelp.info([successMessage], strings['Success']);
			$state.go('base.detail.view');
			return absrSvc.setupAbsrState(absrState.id, absrState.editMode).then(function(){
				$scope.isInServiceAbsence = false;
				absrState.originalPlusRelatedAbsences = [];

				if (absrState.related.length > 0) {
					absrState.related[0].absences.forEach(function (absence,i) {
						absence.flag = "related"+ i;
						absrState.originalPlusRelatedAbsences.push(angular.copy(absence));
						
					});
				}

				absrState.absr.absences.forEach(function (absence,i) {
					absence.flag="unrelated" + i;
					absrState.originalPlusRelatedAbsences.push(angular.copy(absence));
				   
					if(absence.closedDay != null){
						if(absence.closedDay.closedDayType == 2){
							$scope.isInServiceAbsence = true;
						}                           
					}
				});

				absrState.originalPlusRelatedAbsences.sort(function (a, b) {
					return (new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1);
				});
			});
		}, function (reasons) {
			toastHelp.error(reasons.$messages, 'Error');
		});
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		removeSub: function () {
			if(!vm.isProcessing){
				vm.isProcessing = true;
				if (absrState.context.hasTimeSheetData) {
					absrSvc.showTimesheetDataDialog().then(function(){
						callRemoveSub();
					},function(){
						vm.isProcessing = false;
					});
				} else {
					callRemoveSub();
				}
			}
		},
		//Method to unassign the Substitute and delete the Absence.
		removeSubAndDeleteAbsence: function (deleteAbsence, cancelSelections) {
			if(!vm.isProcessing){
				vm.isProcessing = true;
				if (absrState.context.hasTimeSheetData) {
					absrSvc.showTimesheetDataDialog().then(function(){
						callRemoveSub(deleteAbsence, cancelSelections);
					},function(){
						vm.isProcessing = false;
					});
				} else {
					callRemoveSub(deleteAbsence, cancelSelections);
				}
			}
		},
		showDeleteDialog : function (deleteAbsence, cancelSelections)  {
			if(deleteAbsence) {
				absrSvc.showDeleteDialog(deleteAbsence, cancelSelections);
			} else {
				return;
			}	
		}
	};

	function callRemoveSub(deleteAbsence, cancelSelections){
		substituteApi.removeSub({
							id: substitute.id,
							absrId: absrState.id,
							hideJobFromSub: !vm.allowSubToSeeJob,
							sendSubRemovedNotification: vm.notifySub,
							preventSubFromWorking:vm.preventSubFromWorking,
							requestedBy:vm.requestedBy.id,
							subCancelReasonId: (vm.cancellationReason ? vm.cancellationReason.id : 0)

		})
		.then(function (data) {
				if(deleteAbsence) {
					deleteAbsr(cancelSelections);
				} else {
					toastHelp.info([strings['CancelAssignment.AsNonSubUser.SuccessMessage']], strings['Absence.RemoveSub.dialogTitle']);
					return absrSvc.setupAbsrState(absrState.id, absrState.editMode).then(function(){
						$scope.isInServiceAbsence = false;
						absrState.originalPlusRelatedAbsences = [];
	
						if (absrState.related.length > 0) {
							absrState.related[0].absences.forEach(function (absence,i) {
								absence.flag = "related"+ i;
								absrState.originalPlusRelatedAbsences.push(angular.copy(absence));
								
							});
						}
	
						absrState.absr.absences.forEach(function (absence,i) {
							absence.flag="unrelated" + i;
							absrState.originalPlusRelatedAbsences.push(angular.copy(absence));
						   
							if(absence.closedDay != null){
								if(absence.closedDay.closedDayType == 2){
									$scope.isInServiceAbsence = true;
								}                           
							}
						});
	
						absrState.originalPlusRelatedAbsences.sort(function (a, b) {
							return (new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1);
						});
					});
				}
		},function (reasons){
			vm.isProcessing = false;
			toastHelp.error(reasons.$messages, 'Error');
		});
	}
}

// #-- END Component (cmpt-template-available-sub-remove-options) --# //
// #----------------------------------------------------------------# //
};});}());


