(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubCallCell', function () {return {

// directive options
restrict: 'E',
scope: {
	width:'=',
	subRow:'=',
	onCallNow:'&',
	enabled:'&'
},
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-call-cell/templateAvailableSubCallCell.html',

// #-----------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-call-cell) ----# //
controller: function ($q ,$scope, $timeout, $state, absrSvc, stringSvc, ngDialog, absrStateVal, substituteApi, manualCallsApi,toastHelp) {

	//================== subRow is individual row got back from server ========================
	var subRow = $scope.subRow;
	//================== state of an absence request ========================
	var absrState = $scope.absrState = absrStateVal;
	//================== defining the dialog variable to track the state of the dialog.  ========================
	var dialog = null;
	//================== absence request id ========================
	var absrId = absrStateVal.id;

	var onAbsence =assignToThisAbsence();

	// View Model properties
	var vm = $scope.vm = {
		reasons:'',
		//================== view model that will paint the dialog ========================
		status:{
			callRequestedTime:'...',
			statusText:'...',
			statusId:'...',
			cssClass:'calling'
		},
		//================== boolean that track call is in progress ========================
		isProcessing:false,
		canCall:canMakeCall(),
		onAbsence: onAbsence
	};




	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'CallButton.Text.JobIsFilled',
		'ManualCall.Status.Calling',
		'AvailableSub.Templ.text.AbortedCaption',
		'AvailableSub.Templ.text.RejectedCaption',
		'AvailableSub.Templ.text.CallStatus',
		'AvailableSub.Templ.text.SubstituteName',
		'AvailableSub.Templ.text.CallRequestedTime',
		'AvailableSub.Templ.text.Confirmation',
		'AvailableSub.Templ.text.CallBack',
		'Close',
		'CallButton.Text.CallSubNow',
		'CallDialog.Header.Text.CallingSubstitute',
		'CallButton.Text.MaxCalls',
		'Absence.Text.LockedAbsenceSummary'
	]);

	if(!vm.canCall){
		vm.reasons = subRow.reasonsCannotMakeCall.toString('\n');
	}else{
		if (absrStateVal.absr.isLocked) {
			vm.reasons = strings['Absence.Text.LockedAbsenceSummary'];
		}
		else {
			vm.reasons = strings['CallButton.Text.CallSubNow'];
		}
	}



	strings.$promise.then(function (){
		// watching the enabled if call remanings get to zero
		$scope.$watch('enabled()', function (nVal){
			if(!nVal){
				vm.reasons = strings['CallButton.Text.MaxCalls'];
			}
		});
	});

	// Actions that can be bound to from the view
	var go = $scope.go = {
		callNow: function(){
			if (absrStateVal.absr.isLocked)
				return;

			// Creating the promise to determine when call has placed
			var _defer = $q.defer();
			if(vm.canCall && $scope.enabled()){
				//Checking is already a call in progress
				if(!vm.isProcessing){
					vm.isProcessing = true;
					//Placing a call in the database for IVR to call
					substituteApi.call({id: subRow.id, absrId: absrId}).then(function (data){
						// resolvingthe promise after call is placed successfully
						_defer.resolve();
						// onCallNow is defined on the  absrAvailableSubstituteBottomResult.js
						// this function call will update the Call Remianing count
						$scope.onCallNow();
						//setting the inital status values for the dialog
						setStatus(0,strings['ManualCall.Status.Calling'],'...');
						//calling function to get the status of the call
						getStatus(data.id);
						//checking if the dialog is already open
						if(dialog == null){
							showDialog();
						}
					},function (error){
						_defer.reject();
						vm.isProcessing = false;
						toastHelp.error(error.$messages, 'Error');
					});
				}else{
					//Call is already in progress so just making call to trigger dialog
					showDialog();
				}
			}

			return _defer.promise;
		}
	};


	function canMakeCall() {
		if(!subRow.canCallSubustitute){ return false; }
		if(absrStateVal.substitute !== null){ return false;}
		if(onAbsence){ return false;	}
		return true;
	}
	function assignToThisAbsence () {
		if(absrStateVal.substitute === null) { return false; }
		return absrStateVal.substitute.id === subRow.id;
	}

	function getStatus (id) {
		manualCallsApi.get({id: id}).then(function (data){
			vm.status.callRequestedTime = data.callRequestedTime;
			if (data.callStatusId !== null){
				//when call is accepted
				//refreshing the absrStateVal and redirecting the page to edit or view
				if(data.callStatusId === 5){
					 absrSvc.setupAbsrState(absrState.id, absrState.editMode)
					 .then(function (){
					 	$state.go((absrState.editMode)? 'base.detail.edit':'base.detail.view');
					 }, function (reasons){
					 	toastHelp.error(reasons.errors,'Error');
					 });
				}
				setStatus(data.callStatusId,data.callStatusText,data.callRequestedTime);
				vm.isProcessing = false;
			}else{
				$timeout(function () { getStatus(data.id); },3000);
			}
		}, function (error) {
			vm.isProcessing = false;
			ngDialog.close(dialog.id);
			dialog = null;
			toastHelp.error(error.$messages, 'Error');
		});
	}


	function cssClass (statusId) {
		switch(statusId){
			case 0:
				return 'calling';
			case 5:
				return 'accepted';
			case 6:
			case 7:
				return 'rejected';
			case 9:
				return 'aborted';
		}
	}

	function setStatus (statusid,statusText,requestedTime) {
		vm.status.statusText = statusText;
		vm.status.statusId = statusid;
		vm.status.cssClass= cssClass(statusid);
		vm.status.callRequestedTime = requestedTime;
	}

	function showDialog () {
		dialog = ngDialog.open({
			template:'/components/template/cmpt-template-available-sub-call-cell/call-status.html',
			closeByDocument: false,
			closeByNavigation:false,
			data: {
				header: strings['CallDialog.Header.Text.CallingSubstitute'],
				substituteName: subRow.lastName + ' ' + subRow.firstName,
				status: vm.status,
				absrId: absrId,
				strings: strings,
				buttons: [{
					title: strings['AvailableSub.Templ.text.CallBack'],
					icon:'fa-check',
					cls:'fl-positive',
					action: function(obj){
						var btnObj = this;
						btnObj.icon = 'fa-spinner fa-spin';
						// using the promise created on call now
						// changing the icon when call is placed successfully.
						go.callNow().then(function (){
							btnObj.icon = 'fa-check';
						});
					}
				},{
					title: strings['Close'],
					icon:'',
					cls:'normal-btn',
					action: function(obj){
						ngDialog.close(dialog.id);
						dialog = null;								}
				}]
			}
		});
	}

}

// #-- END Component (cmpt-template-available-sub-call-cell) --# //
// #-----------------------------------------------------------# //
};});}());