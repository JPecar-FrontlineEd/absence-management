(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubSimpleCell', function () {return {

// directive options
restrict: 'E',
scope: {
	width:'=',
	check:'=',
	toolTip:'=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-simple-cell/templateAvailableSubSimpleCell.html',

// #-------------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-simple-cell) ----# //
controller: function ($scope, stringSvc) {

	var check = $scope.check;
	if($scope.toolTip == null){
		$scope.toolTip = [];
	}
	var tooltip = $scope.toolTip;

	// View Model properties
	var vm = $scope.vm = {
		cssClass: cssClass(),
		title: tooltip.join('|')
	};


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	function cssClass () {
		if(check){
			return 'fa fa-times';
		}
		return '';
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-template-available-sub-simple-cell) --# //
// #-------------------------------------------------------------# //
};});}());