(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAvailableSubTimeCell', function () {return {

// directive options
restrict: 'E',
scope: {
	width:'=',
	check:'=',
	timeString:'='
},
replace: true,
templateUrl: '/components/template/cmpt-template-available-sub-time-cell/templateAvailableSubTimeCell.html',

// #-----------------------------------------------------------# //
// #---- Component (cmpt-template-available-sub-time-cell) ----# //
controller: function ($scope, stringSvc) {

	var check = $scope.check;
	var timeString = $scope.timeString;
	// View Model properties
	var vm = $scope.vm = {
		cssClass: cssClass()
	};

	function cssClass () {

		if(!check){
			if(timeString.length > 0){
				return 'fa fa-clock-o';
			}else{
				return 'fa fa-times';
			}
		}
		return '';
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-template-available-sub-time-cell) --# //
// #-----------------------------------------------------------# //
};});}());