(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrAvailableSubstituteBottomResult', function () {return {

// directive options
restrict: 'E',
scope: {
	showQualified: '=',
	filter: '='
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-available-substitute-bottom-result/absrAvailableSubstituteBottomResult.html',

// #------------------------------------------------------------------# //
// #---- Component (cmpt-absr-available-substitute-bottom-result) ----# //
controller: function ($scope, $stateParams, absrStateVal,stringSvc, permissionSvc, orgSvc, absenceRequestApi, substituteApi,toastHelp, userSvc) {

	var fetchAmt = 50;
	var canAssignSub = permissionSvc.iHave('ABSR.ASSIGNSUB');
	var canCall = permissionSvc.iHave('ABSRPROC.FORCEABSRCALL');
	var canBlock = permissionSvc.iHave('ABSRPROC.BLOCKSUB');
	var canViewSubPhone = permissionSvc.iHave('SUB.ViewPhone') || userSvc.isOrgUser();
	var canViewSubPerfScore = permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore');
	var orgData = orgSvc.getOrgData();
	var usingWorkLimits = orgData[0].settings.usesDailyLimits ||
					orgData[0].settings.usesWeeklyLimits ||
					orgData[0].settings.usesMonthlyLimits ||
					orgData[0].settings.usesParentMonthlyLimits ||
					orgData[0].settings.usesParentWeeklyLimits;
	var showPayCodeOnAssignSubstitutePage = orgData[0].settings.showPayCodeOnAssignSubstitutePage;

	var nameColWidth = 15;
	var assignColWidth = 15;
	var dataColsWidth = 85;
	var callNowColWidth = 6;
	var blockUnblockColWidth = 12;
	var maxManualCallsPerAbsence = orgData[0].settings.maxManualCallsPerAbsence;
	var dataCellWidth;

	// absr state is defined because watching the substitute object
	var absrState = $scope.absrState = absrStateVal;



	if(canAssignSub){
		dataColsWidth = dataColsWidth - assignColWidth;
	}
	if(canCall){
		dataColsWidth = dataColsWidth - callNowColWidth;
	}
	if(canBlock){
		dataColsWidth = dataColsWidth - blockUnblockColWidth;
	}


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Select.LoadMore',
		'Absence.Create.Select.Text.NoRecordFound',
		'AvailableSub.Text.CallNow',
		'AvailableSub.Text.Call',
		'AvailableSub.Header.CallNow',
		'Assign',
		'AvailableSub.Text.BlockUnblock',
		'AvailableSub.Header.BlockUnblock',
		'AvailableSub.Text.SubstituteName',
		'AvailableSub.Text.QualifiedAndAvailableChecks',
		'AvailableSub.Text.AdditionalChecks',
		'NoRating',
		'AvailableSub.Text.SkillMatch',
		'AvailableSub.Header.SkillMatch',
		'AvailableSub.Text.OtherJob',
		'AvailableSub.Header.OtherJobs',
		'AvailableSub.Text.Non-WorkDay',
		'AvailableSub.Header.NonWorkDay',
		'AvailableSub.Text.Excluded',
		'AvailableSub.Header.Excluded',
		'AvailableSub.Text.PreferredSchool',
		'AvailableSub.Header.PreferredSchool',
		'AvailableSub.Text.RejectedBySub',
		'AvailableSub.Header.RejectedBySub',
		'AvailableSub.Text.VisibleToSub',
		'AvailableSub.Header.VisibletoSub',
		'AvailableSub.Text.InSubCallTime',
		'AvailableSub,Header.InSubCallTime',
		'AvailableSub.Text.OverWorked',
		'AvailableSub.Header.Overworked',
		'AvailableSub.Text.CallsRemaining',
		'Absence.NeedSubOff.AssignSubWarning',
		'AvailableSub.Text.Remaining'
	]);



	var columns = [{
			title:'AvailableSub.Text.SkillMatch',
			toolTip:'AvailableSub.Header.SkillMatch'
		},{
			title:'AvailableSub.Text.OtherJob',
			toolTip:'AvailableSub.Header.OtherJobs'
		},{
			title:'AvailableSub.Text.Non-WorkDay',
			toolTip:'AvailableSub.Header.NonWorkDay'
		},{
			title:'AvailableSub.Text.Excluded',
			toolTip:'AvailableSub.Header.Excluded'
		},{
			title:'AvailableSub.Text.PreferredSchool',
			toolTip:'AvailableSub.Header.PreferredSchool'
		},{
			title:'AvailableSub.Text.RejectedBySub',
			toolTip:'AvailableSub.Header.RejectedBySub'
		},{
			title:'AvailableSub.Text.VisibleToSub',
			toolTip:'AvailableSub.Header.VisibletoSub'
		},{
			title:'AvailableSub.Text.InSubCallTime',
			toolTip:'AvailableSub,Header.InSubCallTime'
		}];

	if(usingWorkLimits)	{
		columns.splice(5,0,{
			title:'AvailableSub.Text.OverWorked',
			toolTip:'AvailableSub.Header.Overworked'
		});
	}

	// View Model properties
	var vm = $scope.vm = {
		additionalCheckWidth: null,
		qualifiedCheckWidth: null,
		nameColWidth: nameColWidth + '%',
		assignColWidth: assignColWidth + '%',
		dataColsWidth: dataColsWidth + '%',
		callNowColWidth:  callNowColWidth + '%',
		blockUnblockColWidth: blockUnblockColWidth + '%',
		showActionCol: canCall || canBlock,
		columns: columns,
		loading: false,
		moreRowsAvailable: false,
		resultCols: [],
		results: [],
		nextPage: 0,
		startingAfter:'',
		callsRemaining: null,
		maxManualCallsPerAbsence: maxManualCallsPerAbsence
	};



	dataCellWidth = 100/columns.length;
	for (var i = columns.length - 1; i >= 0; i--) {
		columns[i].width = dataCellWidth + '%';
	}

	vm.additionalCheckWidth = dataCellWidth * 3 + '%';
	vm.qualifiedCheckWidth = dataCellWidth * (columns.length - 3) + '%';
	vm.resultCols = getResultCols();



	$scope.$watch('showQualified', function (nVal, oVal) {
		if(nVal !== oVal){
			vm.nextPage = 0;
			vm.startingAfter = '';
			fetchData();
		}
	});
	$scope.$watch('filter', function (mask) {
		vm.nextPage = 0;
		vm.startingAfter = '';
		if (mask != null) { fetchData(); }
	});

	//if the substitute is removed or assigned call will refresh the available sub page
	$scope.$watch('absrState.substitute', function (nVal, oVal){
		if(nVal !== oVal){
			vm.nextPage = 0;
			vm.startingAfter = '';
			fetchData();
		}
	});


	//Fixing the available sub headings header at top so that users can easily see which check is used for which flag
	const tableHeader = document.getElementById('availableSubHeader');
	const temporaryHeader = tableHeader.cloneNode(true);
	const headerTopPosition = tableHeader.getBoundingClientRect().top;
	temporaryHeader.style.visibility = 'hidden';
	var isAdded = false;
	
	window.addEventListener('scroll', function() {
	  if (window.pageYOffset > headerTopPosition) {
		isAdded=true;
		var desiredWidth = tableHeader.nextSibling.clientWidth; 
		tableHeader.parentNode.appendChild(temporaryHeader);
		tableHeader.style.position = 'fixed';
		tableHeader.style.top = '60px';
		tableHeader.style.zIndex = 999;
		tableHeader.style.width = desiredWidth + 1 + 'px';
	  } else if(isAdded){
			tableHeader.parentNode.removeChild(temporaryHeader);
			tableHeader.style.position = 'static';
			tableHeader.style.top = '';
			isAdded = false;
	  }
	});

	function getResultCols () {

		var colArr = [{
				key: 'name',
				name: 'name',
				width:  vm.nameColWidth,
				template:'<cmpt-template-substitute-link substitute-id="{{ row.id }}" substitute-name="{{ row.name }}" show-name-as-link="true"></cmpt-template-substitute-link>' +
						 '<div ng-if="row.canViewSubPhone" class="phone">{{ row.phone }}</div>' +
						 '<cmpt-template-feedback-rating ng-if="row.canViewSubPerfScore" average-score="row.feedBackScore" total-number-of-rating="row.feedBackTotal"></cmpt-template-feedback-rating>' +
						 '<div class="no-rating" ng-if="row.feedBackScore <= 0 && row.canViewSubPerfScore">('+ strings['NoRating'] +')</div>' +
						 '<div ng-if="row.canViewPayCode" class="paycode">Paycode: <span>{{ row.payCode }}</span></div>' + 
						 '<div ng-if="row.canViewCallHistory" style="margin-top: 4px;"><i class="fa fa-phone" style="color: #db535a;" title="This substitute is in reduced calling mode."></i><a href="navigator/sub_CallHistory.asp?x=x&TB5=Tab16&TB1=TAB5&StartDate={{row.StartDate}}&EndDate={{row.EndDate}}&sub_id={{row.id}}" style="font-size: 11px;">View Call History</a></div>'
			},{
				key: 'dataCol',
				name: 'dataCol',
				width:  vm.dataColsWidth,
				template:'<cmpt-template-available-sub-checks width="row.dataCellWidth" sub-row="row" substitute="row.substitute"></cmpt-template-available-sub-checks>'
			}];

		if(canAssignSub){
			colArr.splice(1,0,{
				key: 'assign',
				name: 'assign',
				width: vm.assignColWidth,
				template: '<cmpt-template-available-sub-assign-cell sub-row="row"></cmpt-template-available-sub-assign-cell>'
			});
		}
		if(canCall){
			colArr.splice(colArr.length, 0,{
				key: 'callNow',
				name: 'callNow',
				width: vm.callNowColWidth,
				template:'<cmpt-template-available-sub-call-cell  width="row.callNowColWidth" sub-row="row" on-call-now="actions.getRemainingCalls()" enabled="parentVm.callsRemaining > 0"></cmpt-template-available-sub-call-cell>'
			});
		}
		if(canBlock){
			colArr.splice(colArr.length, 0,{
				key: 'blockUnblock',
				name: 'blockUnblock',
				width: vm.blockUnblockColWidth,
				template: '<cmpt-template-available-sub-block-unblock-cell width="row.blockUnblockColWidth" sub-row="row" on-block-unblock="actions.onBlockUnblock"></cmpt-template-available-sub-block-unblock-cell>'
			});
		}
		return colArr;
	}

	function fetchData () {
		vm.loading = true;
		absenceRequestApi.availableSubstitutes({
			absrid: $stateParams.absrid,
			showQualifiedAndAvailable: $scope.showQualified,
			maxRecords: fetchAmt,
			mask: $scope.filter || '',
			startingAfter: vm.startingAfter
		},function (u,getResponseHeaders){
			if(getResponseHeaders().datasource){
				//toastHelp.info([getResponseHeaders().datasource], 'Information');
				console.log(' => SubListSource', getResponseHeaders().datasource); // REMOVE ME
			}
		})
		.then(vm.nextPage ? addResults : setResults)
		.then(function (){
			vm.loading = false;
			vm.nextPage += 1;
		});
	}


	function processData (data) {
		vm.moreRowsAvailable = data.$status === 206;
		if(data.length > 0){
			if (vm.moreRowsAvailable) {
				var lastRecord = data[data.length-1];
				vm.startingAfter = lastRecord.lastName + ',' + lastRecord.firstName +','+ lastRecord.id;
			}
			return data.map(function (row, i, a) {
				return modifyRowProperties(row);
			});
		}else{
			return [];
		}

	}


	function addResults (data) {
		vm.results = vm.results.concat(processData(data));
	}
	function setResults (data) {
		vm.results = processData(data);
	}

	function modifyRowProperties (row) {
		row.group = row.lastName.charAt(0).toUpperCase();
		row.assign = '';
		row.actions = '';
		row.name = row.lastName + ', ' + row.firstName;
		row.dataCol = '';
		row.canViewSubPhone = canViewSubPhone;
		row.canViewSubPerfScore = canViewSubPerfScore;
		row.canViewPayCode = showPayCodeOnAssignSubstitutePage && row.payCode && row.payCode.length > 0;
		row.dataCellWidth = dataCellWidth;
		row.callNowColWidth = callNowColWidth;
		row.blockUnblockColWidth= blockUnblockColWidth;
		row.substitute = absrStateVal.substitute;
		row.canViewCallHistory = row.subReducedCallTime != undefined && new Date(row.subReducedCallTime).getFullYear() != 1
								 && new Date(row.subReducedCallTime).getFullYear() != 9999 ? true : false;
		row.subReduceCallingDays = row.subReduceCallingDays * (-1);
		row.EndDate = row.subReducedCallTime;
		var date = addDays(new Date(row.subReducedCallTime), row.subReduceCallingDays);
		row.StartDate = date.toString("yyyy-MM-dd");
		return row;
	}

	function addDays(theDate, days) {
		return new Date(theDate.getTime() + days*24*60*60*1000);
	}
	
	// Actions that can be bound to from the view
	var go = $scope.go = {
		fetchData: fetchData,
		// in call substitute cell, passing this function and updateing the
		// calls remaining which is outside the scope of the call cell painter.
		getRemainingCalls: function (){
			absenceRequestApi.manualCalls({absrid:$stateParams.absrid}).then(function(data){
				if(maxManualCallsPerAbsence >= data.length){
			 		vm.callsRemaining = maxManualCallsPerAbsence - data.length;
			 	}else{
			 		vm.callsRemaining = 0;
			 	}
			 }, function (error){
			 	toastHelp.error(error.$messages,'Error');
			 });
		},
		// Calling this function on block and unblock to update the entire substitue row.
		onBlockUnblock: function(id){
			var index = vm.results.indexOf(vm.results.filter(function (v) { return v.id === id; })[0]);
			var sub = vm.results.filter(function (v) { return v.id === id; })[0];
			substituteApi[sub.isBlocked ? 'unBlock':'block']({id: sub.id, absrId: $stateParams.absrid})
			.then(function(){
				updateAbsrQualifiedSub(id,index);
			},errorHandling);
		}
	};


	function errorHandling (reasons) {
		toastHelp.error(reasons.$messages, 'Error');
	}

	function updateAbsrQualifiedSub (id, index) {
		var newItem;
		substituteApi.absrQualifiedSubstitute({id: id, absrId: $stateParams.absrid})
		.then(function (data){
			newItem = modifyRowProperties(data);
			vm.results.splice(index, 1);
			vm.results.splice(index,0,newItem);
		},errorHandling);
	}

	if(canCall){
		go.getRemainingCalls();
	}
}

// #-- END Component (cmpt-absr-available-substitute-bottom-result) --# //
// #------------------------------------------------------------------# //
};});}());