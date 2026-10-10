(function() {'use strict';angular.module('aesop')
.directive('cmptCurrentStep', function () {return {

// directive options
restrict: 'E',
scope: {
	currentStep: '=',
	steps: '=',
	enableNext: '='
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-current-step/currentStep.html',

// #--------------------------------------------# //
// #---- Component (cmpt-current-step) ----# //
controller: function ($scope, $location, stringSvc, featureSvc, storageSvc, absrSvc, absrStateVal,ngDialog) {
	var stepStrings = [
		'Absence.Create.Text.NextStep',
		'Absence.Create.Text.FillOutDetails',
		'Absence.Create.Text.Review&Confirm',
		'absrItenerant.Step2.Footer.label.PreviousStep',
		'Absence.Button.Text.Variation',
		'Absence.Button.Text.Day',
		'ViewBy',
		'AddDaysTo',
		'Vacancy',
		'Absence'
	];

	var mnemonic = $scope.mnemonic = {
		typeTitle: $location.url().includes('-vacancy') ? 'Vacancy' : 'Absence',
		}
	var isDayVariationSwitchEnabled = featureSvc.get("AngularAbsenceDayVariationSwitch").enabled;
	if (!isDayVariationSwitchEnabled) { storageSvc.save({ key: 'selectedView',data: 'btnVariation',persistent: true});}	
	$scope.selectedView = storageSvc.load("selectedView") == null? 'btnVariation' : storageSvc.load("selectedView");
	var showDayVariationSwitch = storageSvc.load("showDayVariationSwitch") == null? false: storageSvc.load("showDayVariationSwitch");
	var rightSectionColumnClass = '-u-12-24';
	var buttons = [];
	buttons = [{
			title: 'ViewBy',
			cls:'left fontBold',
			loading: false,
			type: 'label',
			isVisible: function (){
				return isDayVariationSwitchEnabled;
			}
		},{
		title: 'Absence.Button.Text.Day',
		cls:'left capitalizeFirstLetter',
		loading: false,
		type: 'button',
		id: 'btnDay',
		action: function(){
			
			if (absrStateVal.absrVariations != null){
				absrStateVal.absr =[];
				absrStateVal.absr.absences = [];
				absrSvc.stateValToAbsrModel(absrStateVal,true).absences.forEach(function(absence){
					absrStateVal.absr.absences.push(absence);
				});
				absrStateVal.absrVariations = [];
				$scope.absrStateVal = absrSvc.getStateValFromAbsence(absrStateVal.absr.absences, absrStateVal.context, absrStateVal);
			}
			storageSvc.save({
				key: 'selectedView',
				data: 'btnDay',
				persistent: true
			});
			toggleButtons();
			storageSvc.clear('formDirty');
		},
		isVisible: function (){
			return isDayVariationSwitchEnabled;
		}
	},{
		title: 'Absence.Button.Text.Variation',
		cls:'left switchButtonMargins',
		loading: false,
		type: 'button',
		id: 'btnVariation',
		action: function(){
			storageSvc.save({
				key: 'selectedView',
				data: 'btnVariation',
				persistent: true
			});

			if (absrStateVal.absr != null && absrStateVal.absr.absences.length > 0){
				absrStateVal.absrVariations = [];
				$scope.absrStateVal = absrSvc.getStateValFromAbsence(absrStateVal.absr.absences, absrStateVal.context, absrStateVal);
			}else{
				absrStateVal.absrVariations = [];
				absrStateVal.absrVariations.push(angular.copy(absrSvc.blankAbsrStateVal.absrVariations[0]));
				
			}
			toggleButtons();
			storageSvc.clear('formDirty');
			storageSvc.save({
				key: 'noDaysAlertShown',
				data: false,
				persistent: false
			});			
			
		},
		isVisible: function (){
			return isDayVariationSwitchEnabled;
		}
	}];

	// View Model properties
	var vm = $scope.vm = {
		nextSteps: [$scope.steps[$scope.currentStep + 1] || null],
		prevSteps: [$scope.steps[$scope.currentStep - 1] || null]
	};

	if (vm.nextSteps[0] && vm.nextSteps[0].buttons) {
		vm.nextSteps = vm.nextSteps[0].buttons;
	}

	if (vm.prevSteps[0] && vm.prevSteps[0].buttons) {
		vm.prevSteps = vm.prevSteps[0].buttons;
	}

	stepStrings = stepStrings.concat(vm.nextSteps.map(function (step) {
		return step && step.title || null;
	}));

	stepStrings = stepStrings.concat(vm.prevSteps.map(function (step) {
		return step && step.title || null;
	}));

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings(stepStrings);


	// Actions that can be bound to from the view
	var go = $scope.go = {
		toNextStep: function (route,allowedToRoute) {
			showHideDayVariationSwitch(route);
			if(allowedToRoute){
				$location.url(route);
			}
			storageSvc.clear('formDirty');
		},
		toPreviousStep: function(route){
			showHideDayVariationSwitch(route);
			$location.url(route);
			storageSvc.clear('formDirty');
		},
		showAddDaysDialog: function () {
			var dialog = ngDialog.open({

				template: '/components/absr/cmpt-absr-details-by-day-section/add-days.html',
				closeByDocument: false,
				showClose: true,
				closeByEscape: false,
				closeByNavigation: true,
				className: 'ngdialog-theme-default custom-width-700',
				data: {
					header: $scope.strings['AddDaysTo'] + $scope.strings[mnemonic.typeTitle],
				}

			});
		}

	};

	function toggleButtons(){
		if (storageSvc.load("selectedView") == "btnVariation"){
			$scope.selectedView = 'btnVariation';
			angular.element(document.getElementsByClassName('auto-edit-absence')[1]).addClass('activeSwitchButton');
			angular.element(document.getElementsByClassName('auto-edit-absence')[0]).removeClass('activeSwitchButton');
			angular.element(document.getElementsByClassName('auto-edit-absence')[3]).addClass('activeSwitchButton');
			angular.element(document.getElementsByClassName('auto-edit-absence')[2]).removeClass('activeSwitchButton');
			document.getElementsByClassName('cmpt-absr-create-new-absence-by-day')[0].style.display = 'none';
			document.getElementsByName('byVariationForm')[0].style.display = 'block';
			if (absrStateVal.absr == null || absrStateVal.absr.absences.length == 0) {
				document.getElementById('noDaysAlertRow').style.display = 'none';
			}
		} else {
			$scope.selectedView = 'btnDay';
			angular.element(document.getElementsByClassName('auto-edit-absence')[1]).removeClass('activeSwitchButton');
			angular.element(document.getElementsByClassName('auto-edit-absence')[0]).addClass('activeSwitchButton');
			angular.element(document.getElementsByClassName('auto-edit-absence')[3]).removeClass('activeSwitchButton');
			angular.element(document.getElementsByClassName('auto-edit-absence')[2]).addClass('activeSwitchButton');
			document.getElementsByClassName('cmpt-absr-create-new-absence-by-day')[0].style.display = 'block';
			document.getElementsByName('byVariationForm')[0].style.display = 'none';
			if (absrStateVal.absr.absences == undefined || absrStateVal.absr.absences.length == 0) {
				go.showAddDaysDialog();
			}
		}
		absrStateVal.hasError = false;
		absrStateVal.stateValErrors.administratorNotes = [];
	}

	function showHideDayVariationSwitch(route){
		if (route == '/abs-mgt/absences/create-absence-review' || route == '/abs-mgt/absences/create-vacancy-review'){
			if (absrStateVal.absr == null || absrStateVal.absr.absences.length == 0) {
				document.getElementById('noDaysAlertRow').style.display = 'block';
				storageSvc.save({
					key: 'noDaysAlertShown',
					data: true,
					persistent: false
				});
			}
			rightSectionColumnClass = '-u-6-24';
		} else {
			rightSectionColumnClass = '-u-12-24';
			absrStateVal.hasError = false;
		}
		if (route == '/abs-mgt/absences/create-absence-save' || route == '/abs-mgt/absences/create-vacancy-save'){
			storageSvc.save({
				key: 'alreadyAbsenceCheckRequired',
				data: 'false',
				persistent: false
			});
		}
	}

	vm.buttons = buttons;
	vm.showDayVariationSwitch = showDayVariationSwitch;
	vm.rightSectionColumnClass = rightSectionColumnClass;
}

// #-- END Component (cmpt-current-step) --# //
// #--------------------------------------------# //
};});}());