(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAbsrSplitCancellationReason', function () {return {

// directive options
restrict: 'EA',
scope: true,
replace: true,
templateUrl: '/components/template/cmpt-template-absr-split-cancellation-reason/cmpt-template-absr-split-cancellation-reason.html',

// #----------------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-remove-options) ----# //
controller: function ($scope, $filter, $state, stringSvc, absrSvc, absrStateVal, substituteApi, absenceRequestApi, cancellationReasonApi, toastHelp, domHelp, ngDialog, featureSvc) {

	var route = this;
	var absrState = $scope.absrState = absrStateVal;
	var context = absrState.context;
	var substitute = absrState.substitute;
	var isVacancy = absrState.worker.isVacancy;
	var cancelReasons = [];
	var dialogData = $scope.ngDialogData;
	var angularSplitAbsenceFeature = featureSvc.get("AngularSplitAbsences").enabled;
	
	var mnemonic = $scope.mnemonic = {
        splitButton: isVacancy ? 
			angularSplitAbsenceFeature ? 'SplitVacancy.Header.Button.Save' : 'SplitVacancy.Header.Button.Create' : 
			angularSplitAbsenceFeature ? 'SplitAbsence.Header.Button.Save': 'SplitAbsence.Header.Button.Create',
        splitButtonConfirm: isVacancy ? 'SplitVacancy.ConfirmSplit.Button.Save' : 'SplitAbsence.ConfirmSplit.Button.Save',
        splitConfirmHeader: isVacancy ? 
			angularSplitAbsenceFeature ? 'SplitVacancy.CreateSplit.Dialog.Title': 'SplitVacancy.ConfirmSplit.Dialog.Title' : 
			angularSplitAbsenceFeature ? 'SplitAbsence.CreateSplit.Dialog.Title': 'SplitAbsence.ConfirmSplit.Dialog.Title',
        splitSuccessMsg: isVacancy ? 
			angularSplitAbsenceFeature ? 'SplitVacancy.MessageBar.Success.Toast' : 'SplitVacancy.MessageBar.Success.Message' :
			angularSplitAbsenceFeature ? 'SplitAbsence.MessageBar.Success.Toast' : 'SplitAbsence.MessageBar.Success.Message',
		splitSuccessMultipleMsg: isVacancy ? 'SplitVacancy.MessageBar.Success.MultipleToast' : 'SplitAbsence.MessageBar.Success.MultipleToast',
        splitSuccessTitle: isVacancy ? 'SplitVacancy.MessageBar.Success.Title' : 'SplitAbsence.MessageBar.Success.Title',
        splitRemoveSub: isVacancy ? 'SplitVacancy.RemoveSub.Label' : 'SplitAbsence.RemoveSub.Label'
    };
	
	// View Model properties
	var vm = $scope.vm = {
 		cancellationReasons: [],
		cancellationReason: 0,
		strings: {},
		isSingleAbsence: dialogData.isSingleAbsence,
		splitIndividual: dialogData.splitIndividual,
		removeSub: dialogData.removeSub,
		dialogId: dialogData.dialogId,
		gridData: dialogData.selectedDates,
		loading: false,
		columns: [{
			key: 'date', width: '24/24',
			name: 'Date',
			cls: '',
			sortable: false
		}]
	};

	cancellationReasonApi.queryCached().then(function(reasons){ 
		vm.cancellationReasons = reasons.map(function(v, i, a) {
			return { id: v.id, value: v.description };
		});
	});
	
		// Get mnemonics that this component needs
	var standardStrings = $scope.strings = stringSvc.getStrings([
		'Substitute',
		'From',
		'Remove',
		'Cancel',
		'Absense.Label.Text.CancellationReasons',
		'SplitAbsence.ConfirmSplit.Dialog.Title',
		'SplitAbsence.ConfirmSplit.Button.Save',
		'NoneSelected'
	]);

	var mneumonics = stringSvc.getStrings(
		// use the cancel mnemonic and all the dynamic mnemonics
		['Cancel'].concat(Object.keys(mnemonic).map(function (k) { return mnemonic[k]; }))
	);
	
	vm.strings = angular.extend({}, standardStrings, mneumonics);
	
	var go = $scope.go = {
		split: function(){
			splitAbsence(0, $scope.$parent.ngDialogData.buttons[0])
		}	
	};
	
	function exitSplitMode(datesToSplit) {
		if(absrState.editMode){
			$state.go('base.detail.edit');
		} else {
			absrState.absr.absences = absrState.absr.absences.filter(function(absence) {
				for (var i in datesToSplit) {
				  if (absence.id === datesToSplit[i].id) { return false; }
				};
				return true;
			  });

			  $state.reload();
			}
	}

	function splitAbsence(dialogId, button) {
		
		vm.loading = true;

		//only pass in a value if the request is cancelling a sub
		var subCancelReasonId = 0;
		if (vm.removeSub && (vm.cancellationReason)) {
			subCancelReasonId = vm.cancellationReason.id;
		}

		if(vm.isSingleAbsence || !vm.splitIndividual) {
			absenceRequestApi.split({
				absrid: absrState.id,
				removeSub: vm.removeSub,
				splitAbs: dialogData.selectedDates
					.map(function (row) { return row.id; })
					.join(','),
				subCancelReasonId: subCancelReasonId
			}, {}).then(
				function (result) {
					absrSvc.setupAbsrState(absrState.id, absrState.editMode)
						.then(function () {
							toastHelp.success(
								vm.strings[mnemonic.splitSuccessMsg] +
								' <a href="/abs-mgt/absences/detail/' + result.absrid + '/view">' + result.absrid +'</a>',
								vm.strings[mnemonic.splitSuccessTitle].replace('{0}', 3),
								false
							);
							button.loading = false;
							ngDialog.close();
						})
						.then(exitSplitMode(dialogData.selectedDates));
				},
				function (error) {
					vm.loading = false;
					toastHelp.error(error.$messages, 'Split Absence');
					ngDialog.close();
				}
			);
		} else {
			absenceRequestApi.splitIndividually({
				absrid: absrState.id,
				removeSub: vm.removeSub,
				splitAbs: dialogData.selectedDates
					.map(function (row) { return row.id; })
					.join(','),
				subCancelReasonId: subCancelReasonId
			}, {}).then(
				function (result) {
					absrSvc.setupAbsrState(absrState.id, absrState.editMode)
						.then(function () {
							toastHelp.success(
								vm.strings[mnemonic.splitSuccessMultipleMsg].replace('{0}', dialogData.selectedDates.length),
								vm.strings[mnemonic.splitSuccessTitle].replace('{0}', 3),
								false
							);
							button.loading = false;
							ngDialog.close();
						})
						.then(exitSplitMode(dialogData.selectedDates));
				},
				function (error) {
					vm.loading = false;
					toastHelp.error(error.$messages, 'Split Absence');
					ngDialog.close();
				}
			);
		}
	}
}

// #-- END Component (cmpt-template-available-sub-remove-options) --# //
// #----------------------------------------------------------------# //
};});}());


