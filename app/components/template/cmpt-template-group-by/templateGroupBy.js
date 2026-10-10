(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateGroupBy', function () {return {

// directive options
restrict: 'E',
scope: {
	items:'=',
	selected:'=',
	displayBy: '=',
	displayOptions: '=',
	label: '=?',
	action: '=?'
},
transclude:true,
replace: true,
templateUrl: '/components/template/cmpt-template-group-by/templateGroupBy.html',

// #--------------------------------------------# //
// #---- Component (cmpt-template-group-by) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		property: 'initial value'
	};

	var iscope = $scope.iscope = $scope;


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

// #-- END Component (cmpt-template-group-by) --# //
// #--------------------------------------------# //
};});}());