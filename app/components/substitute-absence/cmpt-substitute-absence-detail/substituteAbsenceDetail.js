(function() {'use strict';angular.module('aesop')
.directive('cmptSubstituteAbsenceDetail', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/substitute-absence/cmpt-substitute-absence-detail/substituteAbsenceDetail.html',

// #----------------------------------------------------# //
// #---- Component (cmpt-substitute-absence-detail) ----# //
controller: function ($scope, $filter, $q, subAbsenceSvc, ssAsync, accountingCodeApi, orgSvc,
						permissionSvc, entitlementTypeApi,cancellationReasonApi, absrVariationHelp,
						stringSvc, substituteAbsenceVal, institutionSvc, timeFilter, toastHelp) {


	var form = {};
	var subAbsenceVal = $scope.substituteAbsenceVal = substituteAbsenceVal;
	const isNew = subAbsenceVal.id === 0;
	//DE11573 - Edit permissions only apply when editing an existing Sub Absence
	const canEditDate = permissionSvc.iHave('SUBABS.EDITDTLSDATE') || isNew;
	const canEditEnttType = permissionSvc.iHave('SUBABS.EDITDTLSENTT') || isNew;
	const canEditAccCodes = permissionSvc.iHave('SUBABS.EDITDTLSACCD') || isNew;
	const showAccCodes = permissionSvc.iHave('SUBABS.DTLSACCD');
	const allowedDow = orgSvc.getOrgData()[0].settings.AllowedDOW;
	const pastAbsenceDate = subAbsenceSvc.pastAbsenceDate();
	const customAccountingCodeLength = 50;
	const dateLength = 10;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Date',
		'School',
		'AbsenceReason',
		'Time',
		'EnterValidAMPMTime',
		'AccountingCode',
		'NoneSelected',
		'Validation.Institution.Required',
		'Validation.Date.Required',
		'Validation.Date.Format',
		'Validation.AbsenceReason.Required',
		'Validation.StartTime.Required',
		'Validation.StartTime.BeforeEndTime',
		'Validation.EndTime.Required',
		'Validation.EndTime.AfterStartTime',
		'Validation.AccountingCode.Custom.Required',
		'Validation.AccountingCode.Custom.Length',
		'Validation.Date.length',
		'Substitute.Absence.View.Preparing',
		'Validation.Date.CannotSelectThisDatePast',
		'Validation.Date.CannotSelectThisDOW'
	]);

	// View Model properties
	var vm = $scope.vm = {
		customAccountingCodeLength: customAccountingCodeLength,
		dateLength: dateLength,
		institutionList: [],
		entitlementTypeList: [],
		accountingCodeList: [],
		date: $filter('date')(new Date(subAbsenceVal.date),'MM/dd/yyyy'),
		titleDate: null,
		editable:{
			institution: subAbsenceVal.editMode,
			date: subAbsenceVal.editMode && canEditDate,
			startTime: subAbsenceVal.editMode,
			endTime:  subAbsenceVal.editMode,
			entitlementType: subAbsenceVal.editMode && canEditEnttType,
			accountingCode: subAbsenceVal.editMode && canEditAccCodes,
		},
		canEdit: null,
		statusText: strings['Substitute.Absence.View.Preparing'],
		instDependentDataReady: false,
		allowedDow: allowedDow,
		pastAbsenceDate: pastAbsenceDate,
		SelectSubstituteDate: 'SelectSubstituteDate'
	};


	$scope.$watch('substituteAbsenceVal.date', function (date){
		vm.titleDate = $filter('date')(new Date(date),'MMMM d');
	});

	if(!isNew){
		substituteAbsenceVal.startTime = timeFilter(subAbsenceVal.startTime);
		substituteAbsenceVal.endTime = timeFilter(subAbsenceVal.endTime);
	}

	subAbsenceSvc.cancellationReasons().then(function(allCancellationreasons){
		vm.institutionList = subAbsenceSvc
								.institutionList(allCancellationreasons)
								.map(function(x) { return { id:x.id, value: x.name }; });


		//If there is any instution to paint the dropdown
		//and the institution on Val is present in the dropdown.
		if(vm.institutionList.length && (isNew || vm.institutionList.filter(x => x.id === substituteAbsenceVal.institution.id).length)){
			vm.canEdit = true;
			$scope.$watch('substituteAbsenceVal.institution.id', function (instId, oInst){
				if(instId){
					ssAsync(function* (){
						//Reseting the List of accounting code and enetitlement type to empty
						vm.accountingCodeList = [];
						vm.entitlementTypeList = [];

						vm.instDependentDataReady = false;

						// making call to get the valid entitlementtypes
						var entitlementTypes = yield subAbsenceSvc.getEntitlementTypes(instId, allCancellationreasons);
						var entitlementTypesForVm = entitlementTypes.map(function (v, i , a) {	return { id: v.id, value: v.name };	});
						if(!subAbsenceVal.editMode && entitlementTypes.filter(x => x.id === substituteAbsenceVal.entitlementType.id).length === 0){
							entitlementTypesForVm.push(setupDropdownWithDefault('entitlementType')[0]);
						}
						vm.entitlementTypeList = entitlementTypesForVm;

						// if substitute absence is new and any thing assigned on the entitlementtyoe that need to be reset to null on eery inst change
					 	substituteAbsenceVal.entitlementType = absrVariationHelp.setDefaultDropdownOption({
						 	options: vm.entitlementTypeList,
						 	item: substituteAbsenceVal.entitlementType
					 	});

						if(isNew && (instId !== oInst)){
							var institution = institutionSvc.oneById(instId);
							resetTimes(institution);
						}

						if(showAccCodes){
							var codes = yield accountingCodeApi.queryCached({	instId: instId,	fields: '(id,name)'	});
							vm.accountingCodeList = codes.map(function (v, i , a) {	return { id: v.id, value: v.name };	});
							substituteAbsenceVal.accountingCode = absrVariationHelp.setDefaultDropdownOption({
								options: vm.accountingCodeList,
							 	item: substituteAbsenceVal.accountingCode
							});

						}

						vm.instDependentDataReady = true;
					})();
				}else{
					vm.instDependentDataReady = true;
				}
			});
		}else{
			vm.canEdit = false;
			vm.institutionList = setupDropdownWithDefault('institution');
			vm.entitlementTypeList = setupDropdownWithDefault('entitlementType');
			setupNonEditableView('institution|entitlementType|date|startTime|endTime|accountingCode', vm.canEdit);
			vm.instDependentDataReady = true;
		}
	}, function(){
		vm.canEdit = false;
	});



	function resetTimes (institution) {
		var startTime = institution.subStartTime.length ? institution.subStartTime : institution.startTime;
		var endTime  = institution.subEndTime.length ? institution.subEndTime : institution.endTime;
		substituteAbsenceVal.startTime = timeFilter(startTime);
		substituteAbsenceVal.endTime = timeFilter(endTime);

	}


	function setupNonEditableView (fields, canEdit) {
		var editableFields = fields.split('|');
		Object.keys(vm.editable).forEach(function (key){
			if(editableFields.indexOf(key) > -1){
				vm.editable[key] = canEdit;
			}
		});
	}


	function setupDropdownWithDefault (type) {
		return [{ id: substituteAbsenceVal[type].id, value: substituteAbsenceVal[type].name }];
	}


	//==============  Validation Block ===============================
	// Validation of time in comparison
	function validateDate(val) {
		var absenceDate = Date.parse(val);
		if(absenceDate != null && form.date){
			validateDOW(absenceDate);
			validatePastDate(absenceDate);
		}
	}

	function validateDOW (absenceDate) {
		form.date.$setValidity('allowedDOW', allowedDow[absenceDate.getDay()]);
	}

	function validatePastDate(absenceDate) {
		form.date.$setValidity('absencePastDate', (absenceDate >= pastAbsenceDate));
	}

	function validateTime() {
		if(substituteAbsenceVal.startTime != null && substituteAbsenceVal.endTime != null){
			var startTime = Date.parse(substituteAbsenceVal.startTime);
			var endTime = Date.parse(substituteAbsenceVal.endTime);
			form.startTime.$setValidity('decoratortimecomparison', startTime.getTime() < endTime.getTime());
			form.endTime.$setValidity('decoratortimecomparison', endTime.getTime() > startTime.getTime());
		}
	}
	//================================================================


	// Actions that can be bound to from the view
	var go = $scope.go = {
		validateDate,
		validateTime,
		sortByNameWithCustomAtBottom: function (a, b) {
			if (a.value.toLowerCase() === 'custom') { return 1; }
			if (b.value.toLowerCase() === 'custom') { return -1; }
			if (a.value < b.value) { return -1; }
			if (a.value > b.value) { return 1; }
			return 0;
		},
		initilizeForm: function (value){
			form =  value;
		}
	};
}

// #-- END Component (cmpt-substitute-absence-detail) --# //
// #----------------------------------------------------# //
};});}());
