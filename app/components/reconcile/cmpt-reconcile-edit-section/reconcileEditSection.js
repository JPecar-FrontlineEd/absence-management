(function() {'use strict';angular.module('aesop')
.directive('cmptReconcileEditSection', function () {return {

// directive options
restrict: 'E',
scope: {
	absrVal: '=',
	save: '='
},
replace: true,
templateUrl: '/components/reconcile/cmpt-reconcile-edit-section/reconcileEditSection.html',

// #-------------------------------------------------# //
// #---- Component (cmpt-reconcile-edit-section) ----# //
controller: function ($q, $scope, stringSvc, absrSvc, entitlementTypeApi, absenceRequestApi, accountingCodeApi, absrVariationHelp, budgetCodeSvc, payCodeSvc, roundNumberFilter) {

	var absrVal = $scope.absrVal;
	var absence = $scope.absence =  $scope.absrVal.absrVariations[0];
	var initialDataLoaders = [];
	var dataLoaders = [];
	var fullAbsenceObj = absence.absences[0];
	var worker = $scope.worker = absrVal.absr.worker;
	var isVacancy = worker.isVacancy;
	var context = absrVal.context;
	var mnemonic = $scope.mnemonic ={
		missingReason: isVacancy ? 'MissingVacancyType':'MissingEntitlementType',
		reasonTitle: isVacancy ? 'VacancyReason' : 'AbsenceReason'
	};
	absence.isDirty = false;


	// View Model properties
	var vm = $scope.vm = {
		customAccountingCode:'',
		entitlementTypeList: [],
		accountingCodeList: [],
		bugdetCodeList: [],
		payCodeList:[],
		editable:{
			entitlementType: context.editEntitlementType && absence.isEditable && context.canEdit,
			budgetCode: context.editBudgetCode && absence.isEditable && context.canEdit,
			payCode: context.editPayCode && absence.isEditable && context.canEdit,
			hoursSubWorked: context.editHoursSubWorked && absence.isEditable&& context.canEdit,
			accountingCode: context.editAccountingCode && absence.isEditable && context.canEdit
		},
		isProcessing: false,
		instDependantDataReady: false,
		mainDataReady: false,
		canSelectHiddenAbsenceReasons: context.CanSelectHiddenAbsenceReasons
	};

	dataLoaders.push(entitlementTypeApi.queryCached({
		workId: worker.id,
		isVacancyType: isVacancy,
		instId: absence.institution.id,
		fields: '(id,name,notesToAdminRequired,isHiddenReason)',
		canSelectHiddenAbsenceReasons: vm.canSelectHiddenAbsenceReasons
	}).then(function (enttTypes) {
			vm.entitlementTypeList = enttTypes.map(function (v, i, a) {
				return { id: v.id, value: v.name, isHiddenReason: v.isHiddenReason };
			});
		var isHiddenReasonSelected;
		if (absence.entitlementType != null) {
			isHiddenReasonSelected = vm.entitlementTypeList.some(x => x.id === absence.entitlementType.id && x.isHiddenReason);
		}
		if (!vm.canSelectHiddenAbsenceReasons) {
			vm.reconciledHiddenAbsenceReason = absence.isReconciled && isHiddenReasonSelected;
			vm.entitlementTypeList = vm.entitlementTypeList.filter(x => !x.isHiddenReason);
		}
			absence.entitlementType = absrVariationHelp.setDefaultDropdownOption({
				options: vm.entitlementTypeList,
				item: absence.entitlementType,
				allowDeleted: true
			});
	}));

	if(context.showAccountingCode){
		dataLoaders.push(accountingCodeApi.queryCached({
			workId: worker.id,
			instId: absence.institution.id,
			fields: '(id,name)'
		}).then(function (accountingCodes) {
			vm.accountingCodeList = accountingCodes.map(function (v, i , a) {
				return { id: v.id, value: v.name };
			});

			var accountingCode = absence.accountingCode || null;
			absence.accountingCode = absrVariationHelp.setDefaultDropdownOption({
				options: vm.accountingCodeList,
				item: accountingCode,
				allowDeleted: true
			});
		}));
	}

	if(context.showBudgetCode){
		budgetCodeSvc.ready.then(function (budgetCodeData) {
			vm.bugdetCodeList = budgetCodeData.map(function(v){
				return { id:v.id, value: v.description };
			});

			var budgetCode = absence.budgetCode || null;
			absence.budgetCode = absrVariationHelp.setDefaultDropdownOption({
				options: vm.bugdetCodeList,
				item: budgetCode,
				allowDeleted: true
			});
		});
		initialDataLoaders.push(budgetCodeSvc.ready);
	}

	if(context.showPayCode){
		payCodeSvc.ready.then(function (payCodeData){
			vm.payCodeList = payCodeData.map(function(v){
				return { id:v.id, value: v.description };
			});
			absence.payCode = absrVariationHelp.setDefaultDropdownOption({
				options: vm.payCodeList,
				item: absence.payCode,
				allowDeleted: true
			});
		});
		initialDataLoaders.push(payCodeSvc.ready);
	}

	$q.all(initialDataLoaders).then(function () {
		vm.mainDataReady = true;
	});
	$q.all(dataLoaders).then(function () {
		vm.instDependantDataReady = true;
	});

	$scope.$watch('absence.entitlementType.id', function (nVal, oVal){
		if(nVal !== oVal){
			absence.isDirty = true;
		}
	});
	$scope.$watch('absence.accountingCode.id', function (nVal, oVal){
		if(nVal !== oVal){
			absence.isDirty = true;
		}
	});
	$scope.$watch('absence.customAccountingCode', function (nVal, oVal){
		if(nVal !== oVal){
			absence.isDirty = true;
		}
	});
	$scope.$watch('absence.budgetCode.id', function (nVal, oVal){
		if(nVal !== oVal){
			absence.isDirty = true;
		}
	});
	$scope.$watch('absence.payCode.id', function (nVal, oVal){
		if(nVal !== oVal){
			absence.isDirty = true;
		}
	});
	$scope.$watch('absence.subHourWorked', function (nVal, oVal){
		if(nVal !== oVal){
			absence.isDirty = true;
		}
	});

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.reasonTitle,
		mnemonic.missingReason,
		'CreateAbsence.text.HoursSubWorkedInvalid',
		'BudgetCode',
		'AccountingCode',
		'PayCode',
		'HoursSubWorked',
		'Save',
		'SelectAbsenceReason',
		'SelectAccountingCode',
		'SelectBudgetCode',
		'EnterCustomAccountingCode',
		'EnterSubWorkedHours',
		'SelectPayCode'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		save: function(){
			if(absence.isDirty && !vm.isProcessing){
				vm.isProcessing = true;
				fullAbsenceObj.UpdateReconcileState = null;
				$scope.save(absrVal.id, fullAbsenceObj.id).then(function(){
					vm.isProcessing = false;
					absence.isDirty = false;
				}, function(reject){
					vm.isProcessing = false;
				});
			}
		},
		sortByNameWithCustomAtBottom: function (a, b) {
			if (a.value.toLowerCase() === 'custom') { return 1; }
			if (b.value.toLowerCase() === 'custom') { return -1; }
			if (a.value < b.value) { return -1; }
			if (a.value > b.value) { return 1; }
			return 0;
		}
	};
}

// #-- END Component (cmpt-reconcile-edit-section) --# //
// #-------------------------------------------------# //
};});}());