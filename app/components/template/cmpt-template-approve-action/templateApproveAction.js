(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateApproveAction', function () {return {

// directive options
restrict: 'E',
scope: {
	absr:'=',
	comment:'='
},
transclude: true,
replace: true,
templateUrl: '/components/template/cmpt-template-approve-action/templateApproveAction.html',

// #--------------------------------------------------# //
// #---- Component (cmpt-template-approve-action) ----# //
controller: function ($scope, $filter, $timeout, stringSvc, approvalSvc, absenceRequestApi, toastHelp, ngDialog) {


	var absr = $scope.absr;
	$scope.cmptScope = $scope;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Approval.Text.DeniedOn',
		'Approval.Text.LastApprovedOn',
		'NotAvailable',
		'Approval.Label.Text.ApprovalStatus',
		'Approval.Label.Text.LastApprovalAction',
		'Approval.Label.Text.PreviousComments',
		'Approval.Label.Text.ApprovalRecieved',
		'Approval.Lablel.Text.Comments',
		'Approval.Dialog.Title.Text',
		'EnterComment'
	]);

	// View Model properties
	var vm = $scope.vm = {
		lastApprovalAction: '',
		approverLevel: null,
		comment: $scope.comment
	};

	$scope.$watch('absr', function (newAbsr){
		vm.lastApprovalAction = approvalStatusString(newAbsr);
	});


	function approvalStatusString (forAbsr) {
		if (forAbsr == null) { forAbsr = absr; }
		var text = null;

		if(forAbsr.approverKey != null){
			if(forAbsr.requiresApproval &&
				(forAbsr.isApproved ||
				forAbsr.isDenied ||
				forAbsr.isPartiallyApproved)){
				text = $filter('date')(forAbsr.lastApprovedAction,'short');
			}
		}else{
			text= strings['NotAvailable'];
		}
		return text;
	}


   absenceRequestApi.approvers({absrid:absr.id}).then(function(data) {
        //figure out max level we have
        vm.approverLevel = data.reduce(function (previousValue, currentValue, index, array){
            return previousValue.approverLevel > currentValue.approverLevel ? previousValue.approverLevel : currentValue.approverLevel;
        }, 0);
    }, function(rejection) {
        toastHelp.error(rejection.$messages, 'Error');
    });


	// Actions that can be bound to from the view
	var go = $scope.go = {

	};




}

// #-- END Component (cmpt-template-approve-action) --# //
// #--------------------------------------------------# //
};});}());