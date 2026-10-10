(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateOrderBy', function () {return {

// directive options
restrict: 'E',
scope: {
	items:'=',
	selected:'=',
	allowDropDown: '=?'
},
transclude:true,
replace: true,
templateUrl: '/components/template/cmpt-template-order-by/templateOrderBy.html',

// #--------------------------------------------# //
// #---- Component (cmpt-template-order-by) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		property: 'initial value'
	};

	var iscope = $scope.iscope = $scope;
	$scope.allowDropDown = ($scope.allowDropDown !== null) ? $scope.allowDropDown : true;

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

// #-- END Component (cmpt-template-order-by) --# //
// #--------------------------------------------# //
};});}());