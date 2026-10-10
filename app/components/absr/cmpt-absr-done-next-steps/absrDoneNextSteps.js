(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDoneNextSteps', function () {return {

// directive options
restrict: 'E',
scope: {
	isLoading: '=',
	message: '='
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-done-next-steps/absrDoneNextSteps.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-absr-done-next-steps) ----# //
controller: function ($q, $scope, $location, stringSvc, approvalSvc, absrSvc, userSvc,absrStateVal, absenceRequestApi, toastHelp) {

	var absrState = $scope.absrState = absrStateVal;
	var canAssignSub = absrState.context.canAssignSub;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		viewAbsrButtonText: isVacancy ? 'Absence.Create.ViewVacancy' : 'Absence.Create.ViewAbsence',
		createAnotherText : isVacancy ? 'Absence.Reciept.Text.CreateAnotherVacancy' : 'Absence.Reciept.Text.CreateAnotherAbsence'
	};
	// View Model properties
	var vm = $scope.vm = {
		isAvaiableSubLoading: false,
		comment: '',
		canAssignSub: canAssignSub
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Reciept.Text.NextSteps',
		mnemonic.viewAbsrButtonText,
		'Absence.Reciept.Text.AssignSubToThisPosition',
		'Absence.Reciept.Text.ReassignSubToThisPosition',
		'Absence.Reciept.Text.ViewProfileFor',
		'Absence.Reciept.Text.LogoutOfAesop',
		mnemonic.createAnotherText,
		'Absence.Button.Text.Approve',
		'Absence.Button.Text.Deny',
		'Absence.Button.Text.DenyPart',
		'Process.text.UpdatingRecord'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		view: function (){
			$location.url('/abs-mgt/absences/detail/'+ absrState.id +'/view');
		},
		assignSub: function(){
			if(!vm.isAvaiableSubLoading){
				vm.isAvaiableSubLoading = true;
				var lockAbsr = absenceRequestApi.lock({absrid: absrState.id}, {});
				lockAbsr.then(function (){
					$location.url('/abs-mgt/absences/detail/'+ absrState.id +'/availableSubstitutes');
				}, function (err) {
					vm.isAvaiableSubLoading = false;
					toastHelp.error(err.$messages,'Error');
				});
			}
		},
		createAbsence: function (){
			$location.url('/abs-mgt/absences/'+ (isVacancy ? 'create-vacancy':'create-absence'));
		},
		logOut: function (){
			userSvc.logout();
		},
		approve: approve,
		deny: deny,
		denyPart: denyPart
	};


	function approve () {
		if(!vm.processingApproval){
			vm.processingApproval = true;
			approveAction(true).then(function(){
				vm.processingApproval = false;
			},function (){
				vm.processingApproval = false;
			});
		}
	}

	function deny () {
		if(!vm.processingApproval){
			vm.processingApproval = true;
			approveAction(false).then(function(){
				vm.processingApproval = false;
			},function (){
				vm.processingApproval = false;
			});
		}
	}

	function approveAction (forApprove) {
		var _defer = $q.defer();
		approvalSvc[forApprove ? 'approve': 'deny'](absrState.id,vm.comment, '').then(function (){
			absrSvc.setupAbsrState(absrState.id, absrState.editMode)
				.then(function (){
					return _defer.resolve();
				}, function (reasons){
					toastHelp.error(reasons.errors,'Error');
					return _defer.reject();
			});
		}, function (reason){
			toastHelp.error(reason.$messages, 'Error');
			return _defer.reject();
		});
		return _defer.promise;
	}

	function denyPart() {
		var _defer = $q.defer();
		approvalSvc.showDenyPart(absrState.absr).then(function(data) {
			$scope.isLoading = true;
			$scope.message = strings['Process.text.UpdatingRecord'];

			var getRelated = absenceRequestApi.relatedAbsrs({absrid: data.currentAbsr.id,
            	fields: 'id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked'});			
			getRelated.then(function(relatedAbsrs){
				var absrStateVal = absrSvc.absrModelToStateVal(data.currentAbsr, data.currentAbsr.context, relatedAbsrs);
				absrSvc.resetState(absrStateVal);
				$scope.isLoading = false;
			});

			// DTN - 10/14/2015
			// absrSvc.setupAbsrState(absrState.id, absrState.editMode)
			// 	.then(function (){
			// 		return _defer.resolve();
			// 	}, function (reasons){
			// 		toastHelp.error(reasons,'Error');
			// 		return _defer.reject();
			// });
		});
		return _defer.promise;
	}
}

// #-- END Component (cmpt-absr-done-next-steps) --# //
// #-----------------------------------------------# //
};});}());