(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateReconcileState', function () {return {

// directive options
restrict: 'E',
scope: {
	items:'=',
	selected:'='
},
replace: true,
transclude:true,
templateUrl: '/components/template/cmpt-template-reconcile-state/templateReconcileState.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-reconcile-state) ----# //
controller: function ($scope, stringSvc) {

	var iscope = $scope.iscope = $scope;

	// View Model properties
	var vm = $scope.vm = {
		property: 'initial value'
	};

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

// #-- END Component (cmpt-template-reconcile-state) --# //
// #---------------------------------------------------# //
};});}());