(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubAssignCell', function () {return {

// directive options
restrict: 'E',
scope: {
	subRow:'='
},
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-assign-cell/templateAvailableSubAssignCell.html',

// #-------------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-assign-cell) ----# //
controller: function ($scope, $state, stringSvc, absrSvc, absrStateVal, ngDialog, substituteApi, toastHelp, locationHelp) {

	var subRow = $scope.subRow;
	var absrState = $scope.absrState = absrStateVal;
	var substitute = absrState.substitute;

	// View Model properties
	var vm = $scope.vm = {
		state:{
			isProcessing: false
		},
		cssClass: subRow.isAssignable ? '':'fl-disabled',
		canAssignSub: absrStateVal.context.canAssignSub,
		canRemoveSub: absrStateVal.context.canRemoveSub,
		isSubAssigned: substitute && subRow.id === substitute.id,
		actionText: ''
	};



	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'AbsenceForm.Button.RemoveSub',
		'Assign',
		'Reassign',
		'AvailableSub.Dialog.Body.Text',
		'AvailableSub.Text.ConfirmAssignment',
		'AvaiableSub.Text.SubstituteFor',
		'Cancel',
		'SubstituteAssignedSuccessfully',
		'AbsenceLog.Text.SubstituteAssigned'
	]);


	vm.actionText = absrState.substitute !== null ? strings['Reassign'] : strings['Assign'];


	// Actions that can be bound to from the view
	var go = $scope.go = {
		assign: function(){
			if (absrStateVal.absr.isLocked)
				return;

			if (subRow.isAssignable){
				var dialog = ngDialog.open({
					template:'/components/template/cmpt-template-available-sub-assign-cell/assign-substitute.html',
					closeByDocument: false,
					closeByNavigation:true,
					showClose :false,
					data: {
						header: vm.actionText +' '+ strings['AvaiableSub.Text.SubstituteFor'] +' # '+ absrStateVal.id,
						substitute: subRow,
						state: vm.state,
						strings: strings,
						buttons: [{
							title: vm.actionText,
							cls:'fl-positive',
							icon: 'fa-check',
							action:  function(){ assignAction(this,dialog.id); }
						},{
							title: strings['Cancel'],
							cls:'normal-btn',
							icon:'',
							action: function(){ cancelAction(dialog.id); }
						}]
					}
				});
			}
		},
		showRemoveSubDialog: function(){
			if (absrStateVal.absr.isLocked)
				return;

			var dialog = ngDialog.open({
				template:'/global/modals/available-sub-remove-options.html',
				closeByDocument: false,
				closeByNavigation:true,
				data: {
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


	function assignAction (self,dialogId) {
		if(!vm.state.isProcessing){
			self.icon = 'fa-spinner fa-spin';
			vm.state.isProcessing = true;
			substituteApi.assignSub({
				id: subRow.id,
				absrId: absrState.id,
				isSubOverworked:subRow.isSubOverWorked,
			}).then(function (data) {
				toastHelp.info([strings['SubstituteAssignedSuccessfully']], strings['AbsenceLog.Text.SubstituteAssigned']);
				vm.state.isProcessing = false;
				if (locationHelp.hasDestination() && absrState.editMode) {
					absrState.editMode = false;
				}
				absrSvc.setupAbsrState(absrState.id, absrState.editMode)
				.then(function (){
					ngDialog.close(dialogId);
					if (locationHelp.hasDestination()) {
						locationHelp.goToDestination();
					} else {
						$state.go((absrState.editMode)? 'base.detail.edit':'base.detail.view');
					}
				}, function (reasons){
					toastHelp.error(reasons.errors,'Error');
				});
			}, function (reasons){
				vm.state.isProcessing = false;
				ngDialog.close(dialogId);
				toastHelp.error(reasons.$messages, 'Error');
			});
		}
	}

	function cancelAction (dialogId) {
		if(!vm.state.isProcessing){
			vm.state.isProcessing = false;
			ngDialog.close(dialogId);
		}
	}

}

// #-- END Component (cmpt-template-available-sub-assign-cell) --# //
// #-------------------------------------------------------------# //
};});}());