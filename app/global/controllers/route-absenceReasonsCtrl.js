(function() {'use strict';angular.module('aesop')
.controller('AbsenceReasonsCtrl', function ($scope ,$state, $location, $timeout,referenceDataVal,
											stringSvc, permissionSvc, scrollHelp,
											referenceDataAbsenceReasonSvc, featureSvc, toastHelp) {
// #----------------------------------# //
// #------- AbsenceReasonsCtrl -------# //

	// this is a route controller
	var route = this;
	route.strings = stringSvc.getStrings([
		'Report.Label.AbsenceReasons',
		'Referencedata.AbsenceReason.Text.AddAbsenceReason',
		'Referencedata.AbsenceReason.Text.AddAbsenceReasonBucket',
		'Referencedata.AbsenceReason.Description',
		'AbsenceReason.Column.Text.Name',
		'AbsenceReason.Column.Text.PublicToEmployee',
		'AbsenceReason.Column.Text.NeedsApproval',
		'AbsenceReason.Column.Text.HoldUntilApproved',
		'AbsenceReason.Column.Text.EnforceBalances',
		'AbsenceReason.Column.Text.RequireNotesToAdmin',
		'AbsenceReason.Column.Text.School',
		'NoRecordsFound'
	]);


	// View Model properties
	route.vm = {
		shrink: !$state.is('base.refDataabsenceReason'),
		hasScroll: false,
		columns:[],
		dataset: [],
		footerTemplate: null,
		isLoading: true,
		addingNew: false
	};


	route.vm.footerTemplate = referenceDataAbsenceReasonSvc.tmplConfig.footerTemplate();
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.nameCol());
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.publicCol());
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.needApprovalCol());
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.holdUntilApprovedCol());
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.enforceBalancesCol());
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.requireNotesCol());
	route.vm.columns.push(referenceDataAbsenceReasonSvc.tmplConfig.institutionCol());


	referenceDataAbsenceReasonSvc.ready.then(function(){
		route.vm.isLoading = false;
		route.vm.dataset = referenceDataAbsenceReasonSvc.absenceReasons();//.splice(0,10);
		$timeout(function(){
			route.vm.hasScroll = scrollHelp.hasScroll('grid-rows');
		}, 1000);
	}, function(error){
		route.vm.isLoading = false;
		toastHelp.error(error.$messages, 'Error');
	});

	$scope.$on('$stateChangeSuccess',
	function(event, toState, toParams, fromState, fromParams){
		route.vm.shrink = !$state.is('base.refDataabsenceReason');
		route.vm.addingNew = referenceDataAbsenceReasonSvc.alreadyInProcessOfAddingNew();
	});


	function redirectAction(isBucket) {
		referenceDataAbsenceReasonSvc.removeReasonFromList(referenceDataVal.item);
		var state = 'base.refDataabsenceReason.new' + (isBucket ? 'Bucket': '');
		if($state.is(state)){ // If user on the new  absence reason or bucket and re-clicking the same action should setup new item.
			referenceDataAbsenceReasonSvc.setupNewAbsenceReason(isBucket);
		}
		$state.go(state);
	}

	// Actions that can be bound to from the view
	route.go = {
		addAbsenceReason: function(isBucket){
			if(referenceDataAbsenceReasonSvc.alreadyInProcessOfAddingNew()) { return; }
			if(referenceDataVal.item && referenceDataAbsenceReasonSvc.newObjectIsInProcess(referenceDataVal.item)){
				referenceDataAbsenceReasonSvc.showWarningForUnsaveChanges().then(function(response){
					if(response.redirect){
						redirectAction(isBucket);
					}
				});
			}else{
				redirectAction(isBucket);
			}
		},
		addAbsenceReasonToBucket: function(bucket){
			if(referenceDataAbsenceReasonSvc.alreadyInProcessOfAddingNew()) { return; }
			var newObj = referenceDataAbsenceReasonSvc.blankObj(false);
			newObj.id = newObj.id + (-0.1);
			newObj.parentId = bucket.id;
			bucket.children.push(newObj);
			referenceDataAbsenceReasonSvc.setItem(newObj);
			$state.go('base.refDataabsenceReason.new');
		},
		toggle: function (row) {
			row.isExpanded = !row.isExpanded;
		},
		back: function(row){
			$state.params.doDirtyCheck = false;
			var originalCopy = referenceDataAbsenceReasonSvc.copyHandler.getCopy();
			referenceDataAbsenceReasonSvc.replaceExistingItemWithUpdatedCopy((row.id <= 0) ? row : originalCopy);
			referenceDataAbsenceReasonSvc.goBack(row);
		}
	};

// #----- END AbsenceReasonsCtrl -----# //
});}());
