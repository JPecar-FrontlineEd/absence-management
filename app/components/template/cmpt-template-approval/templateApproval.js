(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateApproval', function () {return {

// directive options
restrict: 'E',
scope: {
	requiresApproval: '=',
	isApproved:'=',
	pendingApproved: '=?',
	isDenied: '=',
	isPartiallyApproved: '=',
	numApproved: '=?',
	useLongTooltip: '=?',
	absrId:'=?',
	approverLevel:'=?',
	wrapTextInLine:'=?',
	isDeleted:'=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-approval/templateApproval.html',

// #--------------------------------------------# //
// #---- Component (cmpt-template-approval) ----# //
controller: function ($scope, stringSvc) {

	//set defaults for optional params
	if ($scope.pendingApproved==null){
		$scope.pendingApproved = false;
	}
	if ($scope.numApproved==null){
		$scope.numApproved = 0;
	}
	if ($scope.useLongTooltip==null) {
		$scope.useLongTooltip = false;
	}

	// View Model properties
	var vm = $scope.vm = {
		cssClass: '',
		tooltip: '',
		iconContent: '',
		approvalText: ''
	};

	var strings = $scope.strings = stringSvc.getStrings([
		'Approved',
        'ApprovalPending',
        'Unapproved',
        'Denied',
        'PartiallyApproved',
        'NoApprovalRequired',
        'Approval.Tooltip.Text.CurrentlyUnapproved',
        'Approval.Tooltip.Text.AbsenceApproved',
        'Approval.Tooltip.Text.AbsencePartiallyApproved',
        'Approval.Tooltip.Text.AbsenceDenied'
	]);

	//setting up the data for painting
	$scope.$watchGroup(['pendingApproved',
						'isApproved',
						'isPartiallyApproved',
						'isDenied',
						'numApproved'],function(){
		if ($scope.pendingApproved) {
			vm.cssClass = 'pending-approved';
			vm.tooltip = strings['ApprovalPending'];
			vm.iconContent = '<i class="fa fa-check"></i>';
			vm.approvalText = strings['ApprovalPending'];
		}
		else {

			if ($scope.isApproved) {
				vm.cssClass = 'approved';
				vm.tooltip = strings['Approved'];
				vm.iconContent = '<a href="/abs-mgt/absences/detail/'+ $scope.absrId +'/log/approver"><i class="fa fa-check"></i></a>';
				vm.approvalText = strings['Approved'];
			}

			if ($scope.isPartiallyApproved) {
				vm.cssClass = 'partial';
				vm.tooltip = $scope.useLongTooltip ? strings['Approval.Tooltip.Text.AbsencePartiallyApproved'] : strings['PartiallyApproved'];
				vm.iconContent = '<a href="/abs-mgt/absences/detail/'+ $scope.absrId +'/log/approver">'+ $scope.numApproved +'/'+$scope.approverLevel +'</a>';
				vm.approvalText = strings['PartiallyApproved'];
			}

			if ($scope.isDenied) {
				vm.cssClass = 'denied';
				vm.tooltip = $scope.useLongTooltip ? strings['Approval.Tooltip.Text.AbsenceDenied'] : strings['Denied'];
				vm.iconContent = '<a href="/abs-mgt/absences/detail/'+ $scope.absrId +'/log/approver"><i class="fa fa-times denied"></i></a>';
				vm.approvalText = strings['Denied'];
			}

			if (!$scope.isApproved && !$scope.isDenied && !$scope.isPartiallyApproved) {
				vm.cssClass = 'unapproved';
				vm.tooltip = $scope.useLongTooltip ? strings['Approval.Tooltip.Text.CurrentlyUnapproved'] : strings['Unapproved'];
				vm.iconContent = '<i class="fa fa-check requiresApproval"></i>';
				vm.approvalText = strings['Unapproved'];
			}
		}
	});
}

// #-- END Component (cmpt-template-approval) --# //
// #--------------------------------------------# //
};});}());