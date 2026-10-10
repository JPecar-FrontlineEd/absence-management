(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrNextSteps', function () {return {

// directive options
restrict: 'E',
scope: {
	isLoading: '=',
	message: '='
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-next-steps/absrNextSteps.html',

// #------------------------------------------# //
// #---- Component (cmpt-absr-next-steps) ----# //
controller: function ($q, $scope, $state, stringSvc, absrSvc, approvalSvc, absenceRequestApi, permissionSvc, absrStateVal, toastHelp, locationHelp, reportHelp, ngDialog, cancellationReasonApi) {

	var absrState = $scope.absrState = absrStateVal;
	var absr = absrState.absr;
	var canViewSubPerfScore = permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore');

	var canViewWorkerFeedback = permissionSvc.iHave('Feedback.View') || permissionSvc.iHave('ABSRFeedBk.ViewFeedBack');
	var canViewSubFeedback =  permissionSvc.iHave('Feedback.View') || permissionSvc.iHave('ABSRFeedBk.ViewSubExpFeedBack');
	var canAddWorkerFeedback = (permissionSvc.iHave('Feedback.Add') || permissionSvc.iHave('ABSRFeedBk.AddFeedback'));
	var canAddSubFeedback = (permissionSvc.iHave('Feedback.Add') || permissionSvc.iHave('ABSRFeedBk.AddSubExpFeedBack'));
	var canEditWorkerFeedback = permissionSvc.iHave('ABSRFeedBk.EditFeedBack');
	var canEditSubFeedback = permissionSvc.iHave('ABSRFeedBk.EditSubExpFeedBack');

	var feedbackAboutSubExists = (absr.feedBack && absr.feedBack.ratingOfSub);
	var feedbackFromSubExists = (absr.feedBack && absr.feedBack.ratingOfSubsExperience);
	var denyPartDialog = null;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Label.Text.NextSteps',
		'Status',
		'Remove',
		'Cancel',
		'AbsenceForm.Button.RemoveSub',
		'Absence.Button.Text.AssignSub',
		'Absecne.Button.Text.ReassignSub',
		'Absence.Button.Text.Approve',
		'Absence.Button.Text.Deny',
		'Absence.Button.Text.DenyPart',
		'Feedback',
		'LeaveFeedbackAboutSubstitute',
		'ViewFeedbackAboutSubstitute',
		'LeaveFeedbackFromSubstitute',
		'ViewFeedbackFromSubstitute',
		'Process.text.UpdatingRecord',
		'Absence.Link.Text.CreateAnotherAbsenceForThisEmployee',
		'Absence.Link.Text.CreateAnotherVacancy'
	]);

	// View Model properties
	var vm = $scope.vm = {
		expanded: true,
		assignBtnText: '...',
		subFeedback: absrState.substitute !== null && canViewSubPerfScore ? absrState.substitute.absenceFeedback : { },
		isAvaiableSubLoading: false,
		comment:'',
		processingApproval: false,
		canSeeWorkerFeedbackLink: canSeeWorkerFeedbackLink(),
		canSeeSubFeedbackLink: canSeeSubFeedbackLink(),
		strAboutSubstitute: feedbackAboutSubExists ? 'ViewFeedbackAboutSubstitute' : 'LeaveFeedbackAboutSubstitute',
		strFromSubstitute: feedbackFromSubExists ? 'ViewFeedbackFromSubstitute' : 'LeaveFeedbackFromSubstitute',
		afterAbsenceStart: reportHelp.DayDiff(new Date(absrSvc.earliestAbsenceDate()), new Date()) > 0,
		canDenyPart: absrState.absr.absences.length > 1,
        shouldShowCreateAnotherAbsenceLink: shouldShowCreateAnotherAbsenceLink() && absrState.absr.worker.isActive,
		createAnotherAbsenceLinkMnemonic: absrState.worker.isVacancy ?
										"Absence.Link.Text.CreateAnotherVacancy" :
										'Absence.Link.Text.CreateAnotherAbsenceForThisEmployee',
		createAnotherAbsenceLink: buildCreateAnotherAbsenceLink(),
	};

	function shouldShowCreateAnotherAbsenceLink() {
		if (absrState.worker.isVacancy) {
			if (absrState.worker.isVacancyPrivate) {
				return permissionSvc.iHave('ABSR.VACPRIVATEEDIT');
			}
			return permissionSvc.iHave('ABSR.VacancyEdit');
		}
		return permissionSvc.iHave('ABSR.Create');
	}

	function buildCreateAnotherAbsenceLink() {
		var url = '/abs-mgt/absences/create-absence-details';
		if (absrStateVal.worker.isVacancy) {
			url = '/abs-mgt/absences/create-vacancy-details'
		}
		url += "?workerId=" + absrStateVal.worker.id;
		return url;
	}


	function getCancellationReasons(){
		cancellationReasonApi.queryCached({
				}).then(function (reasons) {
					 vm.cancellationReasons = reasons;
				});
	}

	function canSeeWorkerFeedbackLink() {
		if (feedbackAboutSubExists) {
			return canViewWorkerFeedback;
		} else {
			return canViewWorkerFeedback && canAddWorkerFeedback;
		}
	}
	function canSeeSubFeedbackLink(){
		if (feedbackFromSubExists) {
			return canViewSubFeedback;
		} else {
			return canViewSubFeedback && canAddSubFeedback;
		}
	}

	//hides the "Deny Part" button if absr is updated to have a single absence
	$scope.$watch('absrState.absr.absences', function (newValue, oldValue) {
		if(newValue !== oldValue){
			if (newValue.length <= 1) {
				vm.canDenyPart = false;
			}
		}
	});


	// Actions that can be bound to from the view
	var go = $scope.go = {
		assignSub: function (){
			if (absrState.absr.isLocked)
				return;

			if(!vm.isAvaiableSubLoading){
				vm.isAvaiableSubLoading = true;
				if (absrState.context.hasTimeSheetData) {
					absrSvc.showTimesheetDataDialog().then(function(){
						callAssignSub();
					},function(){
						vm.isAvaiableSubLoading = false;
					});
				} else {
					callAssignSub();
				}
			}
		},
		approve: approve,
		deny: deny,
		denyPart: denyPart,
		feedbackAboutSubstitute: function() {
			$state.go('base.detail.substituteFeedback', {absrid: absrState.id, back:'details', editMode: !feedbackAboutSubExists}, {reload: true});	
		},
		feedbackFromSubstitute: function() {
			$state.go('base.detail.workerFeedback', {absrid: absrState.id, back:'details', editMode: !feedbackFromSubExists}, {reload: true});
		},
		showRemoveSubDialog: function(){
			if (absrState.absr.isLocked)
				return;

			var dialog = ngDialog.open({
				template:'/global/modals/available-sub-remove-options.html',
				closeByDocument: false,
				closeByNavigation:true,
				data: {
						header: 'Header',
						data: {
							abState: absrState,
							vm: vm
						},
						buttons: [{
							title: strings['Remove'],
							cls:'fl-button fl-negative',
							icon: 'fa-times',
							action: function(obj){
								ngDialog.close(dialog.id);
								}
							},
							{
							title: strings['Cancel'],
							cls:'fl-button',
							action: function(obj){
								ngDialog.close(dialog.id);
							}
						}]
					}
				});
		}
	};

	function callAssignSub(){
		var lockAbsr = absenceRequestApi.lock({absrid: absrState.id}, {});
		lockAbsr.then(function (){
			$scope.absrState.absr.isLockedByCurrentUser  = true;
			$state.go('base.detail.availableSubstitutes');
		}, function (err) {
			vm.isAvaiableSubLoading = false;
			toastHelp.error(err.$messages,'Error');
		});
	}

	function approve () {
		if (absrState.absr.isLocked)
			return;

		if(!vm.processingApproval){
			vm.processingApproval = true;
			approveAction(true).then(function(){
				vm.processingApproval = false;
			},function (){
				vm.processingApproval = false;
			});
		}
	}

	function deny () {
		if (absrState.absr.isLocked)
			return;

		if(!vm.processingApproval){
			vm.processingApproval = true;
			approveAction(false).then(function(){
				vm.processingApproval = false;
			},function (){
				vm.processingApproval = false;
			});
		}
	}

	function approveAction (forApprove) {
		var _defer = $q.defer();
		approvalSvc[forApprove ? 'approve': 'deny'](absrState.id,vm.comment, '').then(function (){
			absrSvc.setupAbsrState(absrState.id, absrState.editMode)
				.then(function (){
					vm.comment = '';
					return _defer.resolve();
				}, function (reasons){
					toastHelp.error(reasons.errors,'Error');
					return _defer.reject();
			});
		}, function (reason){
			toastHelp.error(reason.$messages, 'Error');
			return _defer.reject();
		});
		return _defer.promise;
	}

	function denyPart() {
		if (absrState.absr.isLocked)
			return;

		var _defer = $q.defer();
		approvalSvc.showDenyPart(absrState.absr).then(function(data) {
			$scope.isLoading = true;
			$scope.message = strings['Process.text.UpdatingRecord'];

			var getRelated = absenceRequestApi.relatedAbsrs({absrid: data.currentAbsr.id,
            	fields: 'id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked'});
			getRelated.then(function(relatedAbsrs){
				var absrStateVal = absrSvc.absrModelToStateVal(data.currentAbsr, data.currentAbsr.context, relatedAbsrs);
				absrSvc.resetState(absrStateVal);
				$scope.isLoading = false;
			});

			// DTN - 10/14/2015
			// absrSvc.setupAbsrState(absrState.id, absrState.editMode)
			// 	.then(function (){
			// 		return _defer.resolve();
			// 	}, function (reasons){
			// 		toastHelp.error(reasons,'Error');
			// 		return _defer.reject();
			// });
		});
		return _defer.promise;
	}
}

// #-- END Component (cmpt-absr-next-steps) --# //
// #------------------------------------------# //
};});}());
