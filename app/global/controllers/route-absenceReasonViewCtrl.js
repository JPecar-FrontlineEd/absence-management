(function() {'use strict';angular.module('aesop')
.controller('AbsenceReasonViewCtrl', function ($q, $scope, $location, $rootScope, $state, referenceDataVal,referenceDataAbsenceReasonSvc,
												stringSvc, permissionSvc, institutionSvc, toastHelp,
												arrayHelp, regexHelp, featureSvc,formHelp) {
// #-------------------------------------# //
// #------- AbsenceReasonViewCtrl -------# //

	// this is a route controller
	var form = {};
	var route = this;
	route.referenceDataVal = referenceDataVal;
	const isNew = $state.params.refid === -1;
	const addChild = $state.params.addChild;
	const isBucket = $state.params.isBucket;// || (referenceDataVal.item && referenceDataVal.item.isBucket);
	const timeFormat = 'hh:mm';
	const nameMaxLength = 20;
	const externalIdMaxLength = 50;
	const phoneMenuMaxLength = 2;
	const minUsage = 0.25;
	const maxUsage = 23.99;
	const minBalance = -999;
	const maxBalance = 999;
	const minMaxYearly = 0;
	const maxMaxYearly = 999;
	const canAdd = permissionSvc.iHave('REFDATA.REFDATAADD');
	const canEdit = permissionSvc.iHave('REFDATA.REFDATAEDIT') || (isNew && canAdd);
	const canDelete = permissionSvc.iHave('REFDATA.REFDATADEL');



	if(isNew){
		referenceDataAbsenceReasonSvc.setupNewAbsenceReason(isBucket, addChild);
	}

	referenceDataAbsenceReasonSvc.copyHandler.setCopy(referenceDataVal.item);

	// View Model properties
	route.vm = {
		cssClassSave: (isNew && isBucket) ? 'fl-primary' : 'fl-positive',
		canEdit,
		canAdd,
		canDelete,
		nameMaxLength,
		externalIdMaxLength,
		phoneMenuMaxLength,
		timeFormat,
		institutionList: [],
		workerTypeList: [],
		dataAnalysisCategory: [],
		absenceReason: null,//referenceDataVal.item,
		columns: [],
		dataset:[],
		isProcessing: false,
		minBalance,
		maxBalance,
		minMaxYearly,
		maxMaxYearly,
		minUsage,
		maxUsage,
		instList:[],
		instSelected: []
	};

	route.strings = stringSvc.getStrings([
		'All',
		'Cancel',
		'Save',
		'Name',
		'School',
		'EmployeeTypes',
		'nav.label.settings',
		'Referencedata.AbsenceReason.Text.ExternalId',
		'Referencedata.AbsenceReason.Text.ExternalId2',
		'Referencedata.AbsenceReason.Text.PhoneMenu',
		'Referencedata.AbsenceReason.Text.DataAnalysisCategory',
		'Referencedata.AbsenceReason.Text.TimeUsage',
		'Referencedata.AbsenceReason.Text.MinimumUsage',
		'Referencedata.AbsenceReason.Text.MinimumBalance',
		'Referencedata.AbsenceReason.Text.MaxYearlyUsage',
		'Referencedata.AbsenceReason.Text.PublicToEmployee',
		'Referencedata.AbsenceReason.Text.NeedApproval',
		'Referencedata.AbsenceReason.Text.HoldUntilApproved',
		'Referencedata.AbsenceReason.Text.EnforceBalances',
		'Referencedata.AbsenceReason.Text.EnforceNotesToAdministrator',
		'Referencedata.AbsenceReason.Text.EnterNameHere',
		'referenceData.absenceReason.AddAbsenceReasonToBucket',
		'NoRecordsFound',
		'Hours',
		'Action',
		'AbsenceReason',
		'NoneSelected',
		'Referencedata.AbsenceReason.Text.NewAbsenceReason',
		'Referencedata.AbsenceReason.Text.ViewLanguageDefinitions',
		'Referencedata.AbsenceReason.Text.EditLanguageDefinitions',
		'Referencedata.AbsenceReason.Validation.FieldIsRequired',
		'Referencedata.AbsenceReason.Validation.MaxLength',
		'Referencedata.AbsenceReason.Validation.InvalidFormat',
		'Referencedata.AbsenceReason.Validation.MinimumUsage.InvalidTimeRange',
		'Referencedata.AbsenceReason.Validation.MaxYearlyUsage.InvalidTimeRange',
		'Referencedata.AbsenceReason.Validation.MinBalance.InvalidTimeRange',
		'Referencedata.AbsenceReason.Validation.ValueShouldBeInteger',
		'Referencedata.AbsenceReason.Text.ProcessingRequest',
		'Referencedata.AbsenceReason.Validation.PhoneMenuCannotBeNegative'
	]);

	route.vm.institutionList = institutionSvc.getMyInstitutions().map(function(x) { return { id: x.id, value: x.name }; } );
	referenceDataAbsenceReasonSvc.getDataAnalysisCategory().then(function(data){
		route.vm.dataAnalysisCategory = data.map(function(x){ return { id: x.id, value: x.description }; });
	});
	referenceDataAbsenceReasonSvc.getWorkerTypes().then(function (data) {
		route.vm.workerTypeList = data.map(function (v, i, a) {
			return { id: v.id, value: v.title, enabled: true };
		}).sort(arrayHelp.sort('value'));
	});



	function buildInstMultiSelectData(node, nestLevel) {
		var i, len;

		if (node.isAvailable) {
			route.vm.instList.push({
				id: node.id,
				value: node.name,
				enabled: node.isAvailable,
				nestLevel: nestLevel
			});
		}

		if (node.children && node.children.length) {
			i = 0;
			len = node.children.length;
			for (; i < len; i++) {
				buildInstMultiSelectData(node.children[i], nestLevel + 1);
			}
		}
	}

	institutionSvc.getTreeData().then(function (tree) {
		route.vm.instList = [];
		buildInstMultiSelectData(tree, 0);
	});






	{
		let byPass = referenceDataVal.item == null;
		$scope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){

			//In general if the ITEM on Val is undefined or null don't have to execute any of the following logic.
			if(byPass) { return; }

			//If ITEM is new and we are adding a child that means new ITEM is a bucket and route change for the new child,
			// will trigger this event and still we dont want to execute any logic because we don't want to interrupt the workflow
			if(isNew && toParams.addChild) { return; }

			//Within the same instance of scope if user switches from existing absence reason to a new Absence reason
			// will trigger this event and we don't want to trigger any of the following logic.
			if(referenceDataVal.item == null) { return; }

			$rootScope.$root.loader.loading = false;

			// -If user hit cancel button ignore form dirty state and let user navigate away
			// -If the form is Dirty or User is on the Child is dirty
			// -If user cancel from new child and lands on the new bucket with values populated
			// form will going to be not dirty so we will check object against the object defined in the servce to see if the object is dirty
			// we will promt the use that they have unsave changes they might to consider before we rip the child out of list.
			if(fromParams.doDirtyCheck && (form.$dirty || referenceDataAbsenceReasonSvc.newObjectIsInProcess(route.vm.absenceReason))){
				var path = (toParams.path) ? toParams.path : $location.url();
				event.preventDefault();
				referenceDataAbsenceReasonSvc.showWarningForUnsaveChanges().then(function(response){
					if(response.redirect){
						byPass = true;
						if(isNew){
							referenceDataAbsenceReasonSvc.removeReasonFromList(referenceDataVal.item);
						}else{
							var originalCopy = referenceDataAbsenceReasonSvc.copyHandler.getCopy();
							referenceDataAbsenceReasonSvc.replaceExistingItemWithUpdatedCopy(originalCopy);
						}


						// DE11802
						// forward slashes are not correctly encoding so url nav mapping was
						// not able to match url correctly and redirecting user to a page where they should
						// not suppose to land.
						//
						// After some research
						// https://github.com/angular-ui/ui-router/issues/1119
						// Issue mentioned above tells that new ui-router have solved this issue
						// but i did update ui router library and issue still exist
						// following solution is kind of hack but works.

						// These states are related to absence reason and $state.go works perfectly
						// for all other states $location url navigation is used because it does not so bad encoding.
						const states = ['base.refDataabsenceReason','base.refDataabsenceReason.new','base.refDataabsenceReason.newBucket','base.refDataabsenceReason.view'];
						if(states.indexOf(toState.name) >= 0){
							$state.go(toState, toParams);
						}else{
							$location.url(path);
						}



					}
				});
			}else{
				if(isNew){
					var isChild = referenceDataAbsenceReasonSvc.isChildOfNewBucket(route.vm.absenceReason);
					referenceDataAbsenceReasonSvc.removeReasonFromList(isChild ? route.vm.absenceReason : referenceDataVal.item);
				}
			}
		});
	}



	$scope.$watchCollection('route.vm.absenceReason.workerTypes', function(nVal, oVal){
		if(angular.isUndefined(nVal) || angular.isUndefined(oVal)) { return; }
		if(nVal.length !== oVal.length){
			form.$setDirty();
		}
	});

	$scope.$watch('route.referenceDataVal.item', function (item){
		route.vm.isLastChild = false;
		//After user click Add New reason or Add new bucket
		//In parent route we are delete the item property to reset value
		if(item != null) {

			//Item is new and not a bucket and reference data val item has children then its a new  bucket child setup
			// ADDING NEW CHILD REASON TO THE NEW BUCKET
			if(isNew && !isBucket && item.children){
				route.vm.absenceReason = item.children[0];
			}else{
				route.vm.absenceReason = item;
			}

			if(isBucket && item.children){
				if(route.vm.columns.length === 0){
					route.vm.columns.push(angular.extend(referenceDataAbsenceReasonSvc.tmplConfig.nameCol(), {width: '5/24'}));
					route.vm.columns.push(angular.extend(referenceDataAbsenceReasonSvc.tmplConfig.publicCol(), { width: '4/24' }));
					route.vm.columns.push(angular.extend(referenceDataAbsenceReasonSvc.tmplConfig.needApprovalCol(), { width: '3/24' }));
					route.vm.columns.push(angular.extend(referenceDataAbsenceReasonSvc.tmplConfig.holdUntilApprovedCol(), { width: '4/24' }));
					route.vm.columns.push(angular.extend(referenceDataAbsenceReasonSvc.tmplConfig.enforceBalancesCol(), { width: '3/24' }));
					route.vm.columns.push(angular.extend(referenceDataAbsenceReasonSvc.tmplConfig.requireNotesCol(), { width: '5/24' }));
				}
				route.vm.dataset = item.children;
			}



      if(!isBucket && !isNew && item.parentId) {
          var parent = referenceDataVal.list.find(o => o.id === item.parentId);
          if(parent && parent.children.length === 1) {
              route.vm.isLastChild = true;
          }
      }

			//This watch fires only once on state instantiation
			//On initilization if the Item is a bucket and newObjectIsInProcess that means
			//User was in the process of creating new bucket and get to the adding a new children
			// and cancels from there, landed back here again so we have to set form dirty becasue
			// from user prespective user already worked on it and its dirty
			if(isBucket && referenceDataAbsenceReasonSvc.newObjectIsInProcess(route.vm.absenceReason)){
				form.$setDirty();
			}
		}
	});


	// -------------------- Validation Rules ----------------------------------
	$scope.$watch('route.vm.absenceReason.timeUsage.minimumUsage.allowed', function (val){
		if(!val && form.minimumUsage){
			resetingTimeUsage(form.minimumUsage.$name, val);
			clearFormErrors(form.minimumUsage);
		}
	});

	$scope.$watch('route.vm.absenceReason.timeUsage.maxYearlyUsage.allowed', function (val){
		if(!val && form.maxYearlyUsage){
			resetingTimeUsage(form.maxYearlyUsage.$name, val);
			clearFormErrors(form.maxYearlyUsage);
		}
	});

	$scope.$watch('route.vm.absenceReason.timeUsage.minimumBalance.allowed', function (val){
		if(!val && form.minimumBalance){
			resetingTimeUsage(form.minimumBalance.$name, val);
			clearFormErrors(form.minimumBalance);
		}
	});

	function clearFormErrors(field, type = null) {
		if(type === null) {
			for(var errorType in field.$error) {
				field.$setValidity(errorType, true);
			}
		}
		else {
			field.$setValidity(type, true);
		}
	}

	function validateHours (field, value, min, max) {
		if(parseFloat(value) < min){
			form[field].$setValidity('invalidrange',false);
		}
		else if(parseFloat(value) > max){
			form[field].$setValidity('invalidrange',false);
		}else{
			form[field].$setValidity('invalidrange',true);
		}
	}

	function validateMinimumUsage (field, value) {
		var time = Date.parse(value);
		if(angular.isDate(time)){
			var minutes = time.getMinutes();
			var hours = time.getHours();
			if((hours === 0 && minutes < 15)){
				form[field].$setValidity('invalidtimerange', false);
			}else if((hours === 23 && minutes > 59)){
				form[field].$setValidity('invalidtimerange', false);
			}else{
				form[field].$setValidity('invalidtimerange', true);
			}
		}
	}

	function resetingTimeUsage (field, value) {
		if(!value && form[field]){
			if(form[field].$invalid) { // Put this check back on the first check.
				route.vm.absenceReason.timeUsage[field].value = null;
			}
		}
	}

	function minimumUsage(val) {
		{
			let TIME_REGEXP = regexHelp.decimal();
			if(form.minimumUsage && TIME_REGEXP.test(val)){
				validateHours(form.minimumUsage.$name, val, minUsage, maxUsage);
			} else if (form.minimumUsage && val === null) {
				clearFormErrors(form.minimumUsage, 'invalidrange');
			}
		}
	}
	function maxYearlyUsage(val) {
		{
			let TIME_REGEXP = regexHelp.integer();
			if(form.maxYearlyUsage && TIME_REGEXP.test(val)){
				validateHours(form.maxYearlyUsage.$name, val, minMaxYearly, maxMaxYearly);
			} else if (form.maxYearlyUsage) {
				clearFormErrors(form.maxYearlyUsage, 'invalidrange');
			}
		}

	}
	function minimumBalance(val) {
		{
			let TIME_REGEXP = regexHelp.integer();
			if(form.minimumBalance && TIME_REGEXP.test(val)){
				validateHours(form.minimumBalance.$name, val, minBalance, maxBalance);
			} else if (form.minimumBalance) {
				clearFormErrors(form.minimumBalance, 'invalidrange');
			}
		}
	}

	// -------------------- Validation Rules ----------------------------------

	// Actions that can be bound to from the view
	route.go = {
		minimumUsage,
		maxYearlyUsage,
		minimumBalance,
		initilizeForm: function(value){
			form = value;
		},
		back: function () {
			$state.params.doDirtyCheck = false;
			if(!isNew){
				var originalCopy = referenceDataAbsenceReasonSvc.copyHandler.getCopy();
				referenceDataAbsenceReasonSvc.replaceExistingItemWithUpdatedCopy(originalCopy);
			}
			referenceDataAbsenceReasonSvc.goBack(route.vm.absenceReason);
		},
		save: function(){
			if(form.$invalid) {formHelp.setTouched(form); }
			if(form.$valid && !route.vm.isProcessing && form.$dirty){
				if(isNew && isBucket){
					referenceDataAbsenceReasonSvc.showWarningForChild().then(function(){
						$state.go('base.refDataabsenceReason.new',{ addChild: true });
					});
				}else{
					route.vm.isProcessing = true;
					referenceDataAbsenceReasonSvc.save(referenceDataVal.item).then(function(){
						form.$setPristine();
						route.vm.isProcessing = false;
					}, function(){
						route.vm.isProcessing = false;
					});
				}
			}
		},
		deleteItem: function() {
			referenceDataAbsenceReasonSvc.showWarningPriorToDelete(referenceDataVal.item.isBucket).then(function() {
				route.vm.isProcessing = true;
				referenceDataAbsenceReasonSvc.deleteItem(referenceDataVal.item).then(function(){
					route.vm.isProcessing = false;
					referenceDataAbsenceReasonSvc.removeReasonFromList(referenceDataVal.item, true);
					$state.params.doDirtyCheck = false;
					$state.go('base.refDataabsenceReason');
				}, function() {
					route.vm.isProcessing = false;
				});
			});
		},

		featureSvc: featureSvc,
		openLanguageDefinitionsModal: function(item) {
			referenceDataAbsenceReasonSvc.languageDefinitionsCopy.setCopy(item.languageTexts);
			referenceDataAbsenceReasonSvc.openLanguageDefinitionsModal(item.languageTexts, canEdit).then(function() {
				var originalLanguageDefinitions = referenceDataAbsenceReasonSvc.languageDefinitionsCopy.getCopy();
				//success - passed by reference so everything is already  proeperly set on referenceDataVal.item.
				//but we need to check if things actually changed and set the form as dirty to enable the save button.
				if (!angular.equals(originalLanguageDefinitions, item) ) {

					if(!form.$dirty) {
						form.$setDirty();
					}

					originalLanguageDefinitions = item;
					referenceDataAbsenceReasonSvc.languageDefinitionsCopy.setCopy(originalLanguageDefinitions);
				}
			}, function() {
				//failure - revert back to oringal language texts
				item.languageTexts = referenceDataAbsenceReasonSvc.languageDefinitionsCopy.getCopy();
			});
		},
		sortByNameWithOtherAtBottom: function (a, b) {
			//copying/modifying from absrDetailsVariation.js -> sortByNameWithCustomAtBottom()
			if (a.value.toLowerCase() === 'other') { return 1; }
			if (b.value.toLowerCase() === 'other') { return -1; }
			if (a.value < b.value) { return -1; }
			if (a.value > b.value) { return 1; }
			return 0;
		},
		addAbsenceReasonToBucket: function(){
			if(referenceDataAbsenceReasonSvc.alreadyInProcessOfAddingNew()) { return; }
			var newObj = referenceDataAbsenceReasonSvc.blankObj(false);
			newObj.parentId = referenceDataVal.item.id;
			referenceDataVal.item.children.push(newObj);
			referenceDataAbsenceReasonSvc.setItem(newObj);
			$state.go('base.refDataabsenceReason.new');
		},
	};


// #----- END AbsenceReasonViewCtrl -----# //
});}());
