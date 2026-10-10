(function() {'use strict';angular.module('aesop')
.directive('cmptSubstituteAbsenceButtons', function () {return {

// directive options
restrict: 'E',
scope: {
	formValue:'='
},
replace: true,
templateUrl: '/components/substitute-absence/cmpt-substitute-absence-buttons/substituteAbsenceButtons.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-substitute-absence-buttons) ----# //
controller: function ($scope, $state, locationHelp, ngDialog,
										orgSvc, permissionSvc, stringSvc, substituteAbsenceVal,
										subAbsenceSvc, toastHelp, ssAsync, substituteAbsencesApi) {

	var subAbsenceVal = $scope.substituteAbsenceVal = substituteAbsenceVal;
	var formValue = $scope.formValue;
	const canEdit = permissionSvc.iHave('SUBABS.EDIT');
	const canDelete = permissionSvc.iHave('SUBABS.DELETE');
	const canUnlock = permissionSvc.iHave('SUBABS.UNLOCK');
	const pastAbsenceDate = subAbsenceSvc.pastAbsenceDate();
	const editMode = subAbsenceVal.editMode;
	let buttons = [];


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Save',
		'Edit',
		'Cancel',
		'Delete',
		'Substitute.Absence.View.Preparing',
		'Substitute.Absence.Text.Saving',
		'Unlock',
		'Unlocking'
	]);

	// View Model properties
	var vm = $scope.vm = {
		buttons: buttons,
		isLoading: false,
		statusText: ''
	};



	let saveBtn = {
		title: strings['Save'],
		icon: 'fa-check',
		cls: 'save fl-positive',
		action: function(){
			if (formValue.$valid && !vm.isLoading) {
				vm.isLoading = true;
				vm.statusText = strings['Substitute.Absence.Text.Saving'];
				subAbsenceSvc.save(substituteAbsenceVal).then(function(e){
					$state.go('base.substituteAbsenceDetail.view').then(function(){
						vm.isLoading  = false;
					});
				}, function(reject){
					vm.isLoading = false;
					if(reject.$status === 409){
						subAbsenceSvc.showWarningDialog(reject).then(function(){
							$state.go('base.substituteAbsenceDetail.view');
						}, function(err){
							if (err) {
								toastHelp.error(err.$messages, 'Error');
							}
						});
					}else{
						toastHelp.error(reject.$messages, 'Error');
					}
				});
			}
		}
	};

	let editBtn = {
		title: strings['Edit'],
		icon: '',
		cls: 'edit',
		action: function(){
			vm.isLoading = true;
			vm.statusText = strings['Substitute.Absence.View.Preparing'];
			$state.go('base.substituteAbsenceDetail.edit').then(function (){
				vm.isLoading = false;
				vm.statusText = '';
			}, function (){
				vm.isLoading = false;
				vm.statusText = '';
			});
		}
	};

	let cancelBtn = {
		title: strings['Cancel'],
		icon: '',
		cls: 'cancel',
		action: function(){
			vm.isLoading = true;
			$state.go('base.substituteAbsenceDetail.view').then(function (){
				vm.isLoading = false;
			});
		}
	};

	let deleteBtn = {
		title: strings['Delete'],
		icon: 'fa-times',
		cls: 'delete fl-negative right',
		action: function(){
			subAbsenceSvc.showDeleteDialog().then(function (){
				locationHelp.redirect('/abs-mgt/reports/substitute/substitute-absences');
			}, function (error){
				toastHelp.error(error.$messages,'Error');
			});
		}
	};

	let unlockBtn = {
		title: strings['Unlock'],
		icon: '',
		cls: 'unlock',
		action: function(){
			vm.isLoading = true;
			vm.statusText = strings['Unlocking'];
			subAbsenceSvc.forceUnlock(substituteAbsenceVal.id).then(function(){
				vm.isLoading = false;
			 	substituteAbsenceVal.isLocked = false;
			}, function(error){
				toastHelp.error(error.$messages,'Error');
				vm.isLoading = false;
			});
		}
	};



	$scope.$watch('substituteAbsenceVal.isLocked', function(nVal,oVal){
		buttons.length = 0;
		if(Date.parse(substituteAbsenceVal.date) >= pastAbsenceDate){
			if(nVal){
				if(canUnlock) { buttons.push(unlockBtn); }
			}else{
				// User has permission to edit and In edit mode
				if(canEdit && editMode){
					buttons.push(saveBtn);
				}

				if(canEdit && !editMode){
					buttons.push(editBtn);
				}

				// User has permission to delete
				if(canDelete){
					buttons.push(deleteBtn);
				}

				// if in edit mode should have the Cancel button
				if(editMode){
					buttons.push(cancelBtn);
				}
			}
		}
	});


	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-substitute-absence-buttons) --# //
// #-----------------------------------------------------# //
};});}());
