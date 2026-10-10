(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDetailsSummarySection', function () {return {

// directive options
restrict: 'E',
scope: {
	reviewMode:'='
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-details-summary-section/absrDetailsSummarySection.html',

// #-------------------------------------------------------# //
// #---- Component (cmpt-absr-details-summary-section) ----# //
controller: function ($scope, domHelp, stringSvc, absrStateVal, permissionSvc, storageSvc) {

	const numVacancies = 10;
	var absrState = $scope.absrState = absrStateVal;
	var context = absrState.context;
	var mnemonic = $scope.mnemonic = {
		summaryHeader: absrState.worker.isVacancy ? 'Absence.Review.Text.VacancySummary': 'Absence.Review.Text.AbsenceSummary',
		defaultStartTime: 'defaultStartTime',
		defaultEndTime: 'defaultEndTime',
		hoursInADay: 'hoursInADay',
		minAbsLength: 'minAbsLength',
		maxAbsLength: 'maxAbsLength',
		hours: 'Absence.HoldOption.Text.Hours'
	};
	var isFilled = (absrState.substitute !== null);

	// View Model properties
	var vm = $scope.vm = {
		editable:{
			needSub: context.editNeedSub && !isFilled,
			hold: true
		},
		expanded: true,
		needSubOptions: [],
        numVacancies: Array(numVacancies).fill().map((x,i)=>i+1),
        markAsLongTermOptions: [],
		canEditLongTermSelection: permissionSvc.iHave('ABSR.EDITLONGTERMSELECTION'),
		canViewLongTermSelection: permissionSvc.iHave('ABSR.VIEWLONGTERMSELECTION'),
		IsMarkAsLongTermEnabled: storageSvc.load('organizations')[0].settings.IsMarkAsLongTermEnabled
    };

	if(context.canHold && absrState.holdOption == null && context.holdOptions.length > 0){
		// set the default hold option
		domHelp.rAF(function () {
			absrState.holdOption = context.holdOptions.filter(function(el){
				return el.id === context.defaultHoldOption;
			})[0] || context.holdOptions[0];
		});
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.summaryHeader,
		'Absence.Review.Text.NumberOfVacancies',
		'Substitute',
		'Required',
		'Absence.HoldOption.Text.HoldUntil',
		'Variation',
		'Yes',
		'No',
		'absrItenerant.Summary.text.NoDatesSelected',
		'NoSchoolSelected',
		'NoReasonSelected',
		'Absene.Summary.Text.TotalGrossPayout',
		'defaultStartTime',
		'defaultEndTime',
		'hoursInADay',
		'maxAbsLength',
		'minAbsLength',
		'Absence.HoldOption.Text.Hours',
		'SelectSubstituteRequired',
		'SelectHoldDuration',
		'SelectNumberOfVacancies',
		'DR.Summary.Label.MarkAsLongTerm'

	]);
	vm.needSubOptions = vm.markAsLongTermOptions = [{
		value: true,
		label: strings['Yes']
	},{
		value :false,
		label: strings['No']
	}];


	// Actions that can be bound to from the view
	var go = $scope.go = {
	};
}

// #-- END Component (cmpt-absr-details-summary-section) --# //
// #-------------------------------------------------------# //
};});}());
