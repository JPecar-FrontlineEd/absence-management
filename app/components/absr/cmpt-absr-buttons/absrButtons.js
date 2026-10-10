(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrButtons', function () {return {

// directive options
restrict: 'E',
scope: {
	isLoading:'=',
	message:'=',
	unlockOnly: '=' //need the ability to unlock only. don't care about any other functionality in here.
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-buttons/absrButtons.html',

// #---------------------------------------# //
// #---- Component (cmpt-absr-buttons) ----# //
controller: function ($scope, $state, $stateParams, ngDialog, absrSvc, permissionSvc, absrStateVal, stringSvc, absenceRequestApi, toastHelp, scrollHelp, locationHelp, featureSvc, $rootScope,storageSvc) {

	var absrState = $scope.absrState = absrStateVal;
	var substitute = absrState.substitute;
	var isVacancy = absrState.worker.isVacancy;
    var mnemonic =  {
        saveAbsence: isVacancy ?  'Absence.Button.Text.SaveVacancy' : 'Absence.Button.Text.SaveAbsence',
        saveAndAssign: isVacancy ?  'Absence.Button.Text.SaveVacancyAndAssign' : 'Absence.Button.Text.SaveAbsenceAndAssign',
        saveAndReassign: isVacancy ?  'Absence.Button.Text.SaveVacancyAndReassign' : 'Absence.Button.Text.SaveAbsenceAndReassign',
        editAbsence: isVacancy ? 'Absence.Buttons.Text.EditVacancy' : 'Absence.Button.Text.EditAbsence',
		splitButton: isVacancy? 'Absence.Button.Text.SplitVacancy':'Absence.Button.Text.SplitAbsence',
		variationViewButton: 'Absence.Button.Text.Variation',
		dayViewButton: 'Absence.Button.Text.Day'
    };

	var buttons = [];
	var isDayVariationSwitchEnabled = featureSvc.get("AngularAbsenceDayVariationSwitch").enabled;
	if (!isDayVariationSwitchEnabled) { storageSvc.save({ key: 'selectedView',data: 'btnVariation',persistent: true});}
	$scope.selectedView =  storageSvc.load("selectedView");

	if (!$scope.unlockOnly) {
		if(absrState.editMode){
			buttons = [{
				title: mnemonic.saveAbsence,
				icon: 'fa-check',
				cls: 'fl-positive auto-save-absence marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnSave',
				action: saveAction,
				isVisible: function (){
					if ($scope.selectedView != 'btnDay'){
					if(!absrState.context.canEdit || absrState.absr.isLocked){
						return false;
					}
					return true;
				}
				return false;
				}
			},{
				title: (substitute) ?  mnemonic.saveAndReassign : mnemonic.saveAndAssign,
				icon:'fa-check',
				cls:'green-color marginLeftRight5' + ' auto-' + substitute ? 'save-reassign' : 'save-assign',
				loading: false,
				type: 'button',
				id: 'btnSaveAndAssign',
				action: function saveAssignAction(){
					var button = this;
					if(!button.loading){
						button.loading = true;
						globalProcessing(true);
						globalMessage(strings['Process.text.saving'] + ' ' + (isVacancy? strings['Vacancy']: strings['Absence']));
						absrSvc.saveAbsence(absrStateVal).then(
							function () {
								storageSvc.clear('formDirty');
								globalMessage(strings['Process.text.UpdatingRecord']);
								absrSvc.setupAbsrState(absrState.id, absrState.editMode).then(function (){
									if (locationHelp.hasDestination()) {
										locationHelp.redirect('/abs-mgt/absences/detail/'+absrState.id+'/availableSubstitutes', locationHelp.currentSearch());
									} else {
										absrState.editMode = false;
										$state.go('base.detail.availableSubstitutes');
									}
									button.loading = false;
								}, function (reason){
									toastHelp.error(reason.errors, 'Error');
									globalProcessing(false);
									button.loading = false;
								});
							},
							function (rejection) {
								globalProcessing(false);
								button.loading = false;

								// Seperate out the save failure from save absence.
								if (rejection != null) {
									absrSvc.saveFailure(absrStateVal,rejection.rejectData);
								}

								if (absrStateVal.errorElement) {
									scrollHelp.scrollTo(absrStateVal.errorElement);
									absrStateVal.errorElement = null;
								}
								absrSvc.handleSaveErrors(rejection).then(function (action) {
									if (action.retry) { saveAssignAction.call(button); }
								});
							}
						);
					}
				},
				isVisible: function (){
					if ($scope.selectedView != 'btnDay'){
						if(!absrState.context.canEdit || absrState.absr.isLocked){
							return false;
						}
						return absrState.context.canAssignSub;
					}	
					return false;				
				}
			},{
				title: 'Cancel',
				icon: '',
				cls:'auto-cancel marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnCancel',
				action: function(){
					storageSvc.clear('formDirty');
					if (locationHelp.hasDestination()) {
						locationHelp.goToDestination();
					} else {
						$state.go('base.detail.view');
					}
				},
				isVisible: function (){
					if(!absrState.context.canEdit || absrState.absr.isLocked){
						return false;
					}
					return true;
				}
			},{
				title: 'Save',
				icon: '' ,
				cls: 'fl-primary auto-save-absence marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnSave',
				action: saveAction,
				isVisible: function (){
					if ($scope.selectedView == 'btnDay'){
					if(!absrState.context.canEdit || absrState.absr.isLocked){
						return false;
					}
					return true;
				}
				return false;
				}
			},{
				title: 'Delete',
				icon:'fa-times',
				cls:'fl-negative right auto-delete marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnDelete',
				action: function(){ processDelete(); },
				isVisible: function (){
					if(!absrState.context.canEdit || absrState.absr.isLocked){
						return false;
					}
					//return absrState.context.canDelete;
					return !absrState.absr.isDenied &&
					absrState.context.canDelete;
				}
			}];
		}else{
			buttons = [{
				title: mnemonic.editAbsence,
				icon: '',
				cls: 'auto-edit-absence marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnEdit',
				action: function(){
					storageSvc.clear('formDirty');
					var button = this;
					button.loading = true;
					globalProcessing(true);
					globalMessage(strings['Process.text.preparing'] + ' ' + (isVacancy? strings['Vacancy']: strings['Absence']) + ' ' +strings['Process.text.ForEdit']);
					$state.go('base.detail.edit').then(
						function () {}, // success
						function () {	// failure
							button.loading = false;
							globalProcessing(false);
							globalMessage('');
						}
					);
				},
				isVisible: function (){
					if (absrState.absr.isLocked) {
						return false;
					}
					return absrState.context.canEdit ;
				}
			},{
				title: mnemonic.splitButton,
				icon:'',
				cls:'auto-split marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnSplit',
				action: function(){
					storageSvc.clear('formDirty');
					$state.go('base.detail.split');
				},
				isVisible: function (){
					if(!absrState.context.canEdit || absrState.absr.isLocked){
						return false;
					}
					return absrState.absr.absences.length > 1 && absrState.context.canSplit;
				}
			},{
				title: 'Dashboard.Header.Button.Reconcile',
				icon:'',
				cls:'auto-edit-reconcile marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnGoToReconcile',
				action: function(){
					storageSvc.clear('formDirty');
					$state.go('base.detail.reconciliation');
				},
				isVisible: function (){
					if(absrState.absr.isLocked){
						return false;
					}
					var reconciliableAbsences = absrState.absr.absences.filter(function(a) { return a.canReconciled === true; });
					return absrState.absr.absences.length > 1 &&
					reconciliableAbsences.length > 0;
				}
			},{
				title: 'Dashboard.Header.Button.Reconcile',
				icon:'fa-check',
				cls:'fl-positive' + ' auto-reconcile marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnReconcile',
				action: function(){
					var button = this;
					if(!button.loading){
						globalProcessing(true);
						globalMessage('reconciling');
						var absIds = absrState.absr.absences.map(function (v){ return v.id; }).join(',');
						button.loading = true;
						absrSvc.reconcile($stateParams.absrid, absIds).then(function(){
							storageSvc.clear('formDirty');
							globalProcessing(false);
							globalMessage('');
							button.loading = false;
							absrState.absr.absences[0].isReconciled = true;
							absrState.absrVariations[0].absences[0].isReconciled = true;
						},function (rejectReasons){
							globalProcessing(false);
							globalMessage('');
							rejectReasons.$messages.forEach(function (reason){
								if(typeof reason.message === 'string'){
									toastHelp.error(reason.message, 'Error');
								}else{
									absrState.absrVariations[0].errors[reason.field].push(reason.message);
								}
							});
							button.loading = false;
						});
					}
				},
				isVisible: function (){
					if(absrState.absr.isLocked){
						return false;
					}
					return absrState.absr.absences.length === 1 &&
					!absrState.absr.absences[0].isReconciled &&
					absrState.absr.absences[0].canReconciled;
				}
			},{
				title: 'Absence.Button.Text.Unreconcile',
				icon:'fa-times',
				cls:'auto-unreconcile marginLeftRight5',
				loading: false,
				type: 'button',
				id: 'btnUnreconcile',
				action: function(){
					var button = this;
					if(!button.loading){
						globalProcessing(true);
						globalMessage('unreconciling');
						var absIds = absrState.absr.absences.map(function (v){ return v.id; }).join(',');
						button.loading = true;
						absrSvc.unreconcile($stateParams.absrid, absIds).then(function(){
							storageSvc.clear('formDirty');
							globalProcessing(false);
							globalMessage('');
							button.loading = false;
							absrState.absr.absences[0].isReconciled = false;
							absrState.absrVariations[0].absences[0].isReconciled = false;
						},function (rejectReasons){
							globalProcessing(false);
							globalMessage('');
							rejectReasons.$messages.forEach(function (reason){
								absrState.absrVariations[0].errors[reason.field].push(reason.message);
							});
							button.loading = false;
						});
					}
				},
				isVisible: function (){
					if(absrState.absr.isLocked){
						return false;
					}
					return absrState.absr.absences.length === 1 &&
					absrState.absr.absences[0].isReconciled &&
					absrState.absr.absences[0].canReconciled;
				}
			},{
				title: 'ViewBy',
				cls:'right fontBold',
				loading: false,
				type: 'label',
				isVisible: function (){
					return isDayVariationSwitchEnabled;
				}
			},{
				title: mnemonic.dayViewButton,
				cls:'auto-edit-absence right positionRelative capitalizeFirstLetter right29pc',
				loading: false,
				type: 'button',
				id: 'btnDay',
				action: function(){
					storageSvc.clear('formDirty');
					storageSvc.save({
						key: 'selectedView',
						data: 'btnDay',
						persistent: true
					});
					toggleButtons();
					$state.go('base.detail.view');
				},
				isVisible: function (){
					return isDayVariationSwitchEnabled;
				}
			},{
				title: mnemonic.variationViewButton,
				cls:'auto-edit-absence right switchButtonMargins',
				loading: false,
				type: 'button',
				id: 'btnVariation',
				action: function(){
					storageSvc.clear('formDirty');
					storageSvc.save({
						key: 'selectedView',
						data: 'btnVariation',
						persistent: true
					});
					toggleButtons();
					$state.go('base.detail.view');
				},
				isVisible: function (){
					return isDayVariationSwitchEnabled;
				}
			},{
				title: 'Delete',
				icon:'fa-times',
				cls:'fl-negative right auto-delete positionRelative marginLeftRight5 left34pc',
				loading: false,
				type: 'button',
				id: 'btnDelete',
				action: function(){ processDelete(); },
				isVisible: function (){
					if(!absrState.context.canEdit || absrState.absr.isLocked){
						return false;
					}
					return !absrState.absr.isDenied &&
					absrState.context.canDelete;
				}
			}
		];
		}
	}

	var canUnlock = permissionSvc.iHave('ABSR.UNLOCK');
	if (canUnlock) {
		let unlockBtn = {
			title: 'Unlock',
			type: 'button',
			icon: '',
			cls: 'unlock marginLeftRight5',
			action: function(){
				var button = this;
				if(!button.loading){
					button.loading = true;
					globalProcessing(true);
					globalMessage(strings['Unlocking']);
					absenceRequestApi.unlock({absrid: $stateParams.absrid, forceUnlock: true}).then(
						function(){
							button.loading = true;
							storageSvc.clear('formDirty');
							if ($scope.unlockOnly) {
								//unlockOnly mode means we should stay on the screen we started on.
								absrState.absr.isLocked = false;
							} else {
								//if we have other action buttons available, go to the proper state
								if (absrState.context.canEdit) {
									$state.go('base.detail.edit');
								} else {
									$state.go('base.detail.view');
								}
							}

							globalProcessing(false);
							button.loading = false;
						}, function (reason){
							toastHelp.error(reason.errors, 'Error');
							globalProcessing(false);
							button.loading = false;
						});
				}
			},
			isVisible: function (){
				return absrState.absr.isLocked;
			}
		};
		buttons.splice(0, 0, unlockBtn)
	}

	function processDelete(){
		if (absrState.context.hasTimeSheetData) {
			absrSvc.showTimesheetDataDialog().then(function(){
				absrSvc.showDeleteDialog().then(function(){
					storageSvc.clear('formDirty');
					returnToCreate();
				});
			});
		} else {
			absrSvc.showDeleteDialog().then(function(){
				storageSvc.clear('formDirty');
				returnToCreate();
			});
		}
	}
	function returnToCreate(){
		if (isVacancy) {
			locationHelp.redirect('/abs-mgt/absences/create-vacancy');
		} else {
			locationHelp.redirect('/abs-mgt/absences/create-absence');
		}
	}

	function globalProcessing (isLoading) {
		$scope.isLoading = isLoading;
	}

	function globalMessage (message){
		$scope.message = message;
	}

	function toggleButtons(){
		if (storageSvc.load("selectedView") == "btnDay"){
			$scope.selectedView = 'btnDay';
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[0]).addClass('activeSwitchButton');
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[1]).removeClass('activeSwitchButton');
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[2]).addClass('activeSwitchButton');
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[3]).removeClass('activeSwitchButton');
		} else {
			$scope.selectedView = 'btnVariation';
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[0]).removeClass('activeSwitchButton');
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[1]).addClass('activeSwitchButton');
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[2]).removeClass('activeSwitchButton');
			angular.element(document.querySelectorAll('.auto-edit-absence:not(.marginLeftRight5)')[3]).addClass('activeSwitchButton');
		}
		$rootScope.$emit("viewChanged", $scope.selectedView);
		absrStateVal.hasError = false;
	}

	function saveAction(){
		var button = this;
		if(!button.loading){
			button.loading = true;
			globalProcessing(true);
			globalMessage(strings['Process.text.saving'] + ' ' + (isVacancy? strings['Vacancy']: strings['Absence']));

			for(var i = absrStateVal.absr.absences.length - 1; i >= 0; i--){
				if(absrStateVal.absr.absences[i].isDeleted == true){
					absrStateVal.absr.absences.splice(i,1);
				}
			}
			absrSvc.saveAbsence(absrStateVal).then(
				function() {
					globalMessage(strings['Process.text.UpdatingRecord']);
					if (locationHelp.hasDestination() || absrState.editMode) {
						absrState.editMode = false;
					}
					storageSvc.clear('formDirty');
					absrSvc.setupAbsrState(absrState.id, absrState.editMode).then(function (){
						if (locationHelp.hasDestination()) {
							locationHelp.goToDestination();
						} else {
							$state.go('base.detail.view');										
						}
						button.loading = false;
					}, function (reason){
						toastHelp.error(reason.errors, 'Error');
						globalProcessing(false);
						button.loading = false;
					});
				},
				function (rejection) {
					globalProcessing(false);
					button.loading = false;

					// Seperate out the save failure from save absence.
					if (rejection != null) {
						absrSvc.saveFailure(absrStateVal,rejection.rejectData);
					}

					if (absrStateVal.errorElement) {
						scrollHelp.scrollTo(absrStateVal.errorElement);
						absrStateVal.errorElement = null;
					}
					absrSvc.handleSaveErrors(rejection).then(function (action) {
						if (action.retry) { saveAction.call(button); }
					});
				}
			);
		}
	}

	// View Model properties
	var vm = $scope.vm = {
		buttons: buttons
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings(
		buttons.map(function (v) {
			return v.title;
		}).concat([
			'Process.text.saving',
			'Process.text.UpdatingRecord',
			'Process.text.canceling',
			'Process.text.preparing',
			'Process.text.ForEdit',
			'Absence',
			'Vacancy',
			'Unlock',
			'Unlocking',
			'LockWarning',
			'Absence.Button.Text.Day',
			'Absence.Button.Text.Variation',
			'ViewBy'
		])
	);
	
	// Actions that can be bound to from the view
	var go = $scope.go = {};
}

// #-- END Component (cmpt-absr-buttons) --# //
// #---------------------------------------# //
};});}());
