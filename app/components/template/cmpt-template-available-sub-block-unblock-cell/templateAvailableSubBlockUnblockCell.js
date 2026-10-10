(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubBlockUnblockCell', function () {return {

// directive options
restrict: 'E',
scope: {
	width:'=',
	subRow:'=',
	onBlockUnblock:'='
},
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-block-unblock-cell/templateAvailableSubBlockUnblockCell.html',

// #--------------------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-block-unblock-cell) ----# //
controller: function ($scope, stringSvc, absrStateVal) {

	var subRow = $scope.subRow;

	// View Model properties
	var vm = $scope.vm = {
		text: '',
		cssClass: (subRow.isBlocked)? 'fa fa-ban':'fa fa-circle',
		isProcessing:false,
		onAbsence: absrStateVal.substitute === null ? false : absrStateVal.substitute.id === subRow.id
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'AvailableSub.Text.Block',
		'AvailableSub.Text.Unblock'
	]);
	strings.$promise.then(function (){
		vm.text = (subRow.isBlocked) ? strings['AvailableSub.Text.Unblock']:strings['AvailableSub.Text.Block'];
	});

	// Actions that can be bound to from the view
	var go = $scope.go = {
		onClick: function(){
			if(!vm.isProcessing && !vm.onAbsence){
				vm.isProcessing = true;
				// this function is defined on the absrAvailableSubstituteBottomResult.js
				// after block or unblock operation
				// entire sub row need to be updated to reflect the exact changes.
				$scope.onBlockUnblock(subRow.id);
			}
		}
	};
}

// #-- END Component (cmpt-template-available-sub-block-unblock-cell) --# //
// #--------------------------------------------------------------------# //
};});}());