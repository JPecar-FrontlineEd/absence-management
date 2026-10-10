(function() {'use strict';angular.module('aesop')
.controller('DetailCtrl', function ($scope, $stateParams, $state, $location,absrStateVal, absrSvc, stringSvc, permissionSvc, orgSvc, absenceRequestApi, toastHelp, $templateCache) {
// #--------------------------# //
// #------- DetailCtrl -------# //

	var route = this;
	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		pageLabel: isVacancy ?  absrState.editMode ? 'Absence.Edit.ModifyVacancy':'Absence.Create.ViewVacancy': absrState.editMode ? 'Absence.Edit.Text.ModifyAbsence':'Absence.Create.ViewAbsence',
		absenceTabText: isVacancy ? 'Vacancy' : 'Absence',
		logTabText: isVacancy ? 'AbsenceTab.Header.text.VacancyLog' : 'AbsenceTab.Header.text.AbsenceLog'
	};

	var orgData = orgSvc.getOrgData()[0];

	  // Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.pageLabel,
		mnemonic.absenceTabText,
		mnemonic.logTabText,
		'Reconciling',
		'AbsenceTab.Header.text.AvailableSubs',
		'AbsenceTab.Header.text.CallHistory',
		'Approvers',
		'AbsenceTab.Header.text.ApproverLog',
		'Tab.FeedbackFromSubstitute',
		'Tab.FeedbackAboutSubstitute'
	]);

	route.vm = {
		tabs: [{
			title: strings[mnemonic.absenceTabText],
			route:'absences/detail/'+ $stateParams.absrid +'/view',
			state: 'base.detail.view',
			visible: function(){
				return viewRouteVisible() && !showFeedback();
			}
		},{
			title: strings[mnemonic.absenceTabText],
			route:'absences/detail/'+ $stateParams.absrid +'/edit',
			state: 'base.detail.edit',
			visible: function(){
				return editRouteVisible() && !showFeedback();
			}
		},{
			title: strings[mnemonic.absenceTabText] + '<div class="sub-title">Reconciling</div>',
			route:'absences/detail/'+ $stateParams.absrid +'/reconciliation',
			state: 'base.detail.reconciliation',
			visible: function(){
				return reconcileVisible();
			}
		},{
			title: strings[mnemonic.absenceTabText] + '<div class="sub-title">Splitting</div>',
			route:'absences/detail/'+ $stateParams.absrid +'/split',
			state: 'base.detail.split',
			visible: function(){
				return splitVisible();
			}
		},{
			title: strings[mnemonic.logTabText],
			route:'absences/detail/'+ $stateParams.absrid +'/log/absence',
			state: 'base.detail.absenceLog',
			visible: function(){
				return permissionSvc.iHave('ABSRPROC.AbsenceLog') &&  !showFeedback();
			}
		},{
			title: strings['Approvers'],
			route:'absences/detail/'+ $stateParams.absrid +'/approvers',
			state: 'base.detail.approvers',
			visible: function(){
				return orgData.settings.usesAbsenceApproval && !isVacancy && !showFeedback();
			}
		},{
			title: strings['AbsenceTab.Header.text.ApproverLog'],
			route:'absences/detail/'+ $stateParams.absrid +'/log/approver',
			state: 'base.detail.approverLog',
			visible: function(){
				return orgData.settings.usesAbsenceApproval && permissionSvc.iHave('ABSRPROC.AbsenceLog') && !isVacancy &&  !showFeedback();
			}
		},{
			title: strings['AbsenceTab.Header.text.AvailableSubs'],
			route:'absences/detail/'+ $stateParams.absrid +'/availableSubstitutes',
			state: 'base.detail.availableSubstitutes',
			visible: function(){
				return (!isVacancy || permissionSvc.iHave('ABSR.VacancyEdit')) && !showFeedback();
			}
		},{
			title: strings['AbsenceTab.Header.text.CallHistory'],
			route:'absences/detail/'+ $stateParams.absrid +'/log/callhistory',
			state: 'base.detail.CallHistoryLog',
			visible: function(){
				var result = ((!permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && permissionSvc.iHave('RPTABS.ABSCALLHIST'))
					|| (permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && permissionSvc.iHave('ABSRPROC.CallHistory')))
					&& !showFeedback();
				return result;
			}
		},{
			title: 'Mobile History',
			route:'absences/detail/'+ $stateParams.absrid +'/log/substitutePushNotification',
			state: 'base.detail.SubstitutePushNotificationLog',
			visible: function(){
				var result = ((!permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && permissionSvc.iHave('RPTABS.ABSCALLHIST'))
					|| (permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') && permissionSvc.iHave('ABSRPROC.CallHistory')))
					&& !showFeedback();
				return result;
			}
		},{
			title: strings['Tab.FeedbackAboutSubstitute'],
			route:'absences/detail/'+ $stateParams.absrid +'/feedback/substitute',
			state: 'base.detail.substituteFeedback',
			cls:'wide',
			visible: function(){
				return showFeedback() && (permissionSvc.iHave('Feedback.View') || permissionSvc.iHave('ABSRFeedBk.ViewFeedBack'));
			}
		},{
			title: strings['Tab.FeedbackFromSubstitute'],
			route:'absences/detail/'+ $stateParams.absrid +'/feedback/worker',
			state: 'base.detail.workerFeedback',
			cls:'wide',
			visible: function(){
				return showFeedback() && (permissionSvc.iHave('Feedback.View') || permissionSvc.iHave('ABSRFeedBk.ViewSubExpFeedBack'));
			}
		}],
		is403: false,
		template403: $templateCache.get('/routes/403.html')
	};

	$scope.$watch('absrState.absr.isLocked', function(nVal,oVal){
		route.vm.tabs[0].cls = (absrState.absr.isLocked) ? 'fa locked' : '';
	});


	route.go ={
		view: function () {
			$location.url('absences/detail/'+ $stateParams.absrid +'/view');
		}
	};

	function viewRouteVisible() {
		return $state.is('base.detail.view') || (			// we are on the view route OR
			!$state.is('base.detail.reconciliation') &&		// we are not on reconcile or split AND
			!$state.is('base.detail.split') &&
			!absrState.editMode								// we are not in edit mode
		);
	}

	function editRouteVisible() {
		return $state.is('base.detail.edit') || (			// we are on the edit route OR
			!$state.is('base.detail.reconciliation') &&		// we are not on reconcile or split AND
			!$state.is('base.detail.split') &&
			absrState.editMode								// we are in edit mode
		);
	}

	function showFeedback () {
		return $state.is('base.detail.substituteFeedback') || $state.is('base.detail.workerFeedback');
	}

	function splitVisible(){
		return $state.is('base.detail.split');
	}

	function reconcileVisible(){
		return $state.is('base.detail.reconciliation');
	}


	$scope.$on('$destroy', function () {
		if(absrState.editMode && absrState.id != null){
			absrStateVal.lastFetch = null;					//ensuring that loadAbsr() in routerConfigSvc will fetch a new absrStateVal (DE7737 and DE9095)
			var unlockAbsr = absenceRequestApi.unlock({absrid: absrState.id});
			unlockAbsr.then(function (data){
				//nothing needs to be done if successful
			},function (reasons){
				toastHelp.error(reasons.$messages, 'Error');
			});
		}
	});

	//allow child scopes to force a 403 for the entire detail view
	$scope.$on('$destroy', $scope.$root.$on('show-403', function(){ route.vm.is403 = true; }));

// #----- END DetailCtrl -----# //
});}());