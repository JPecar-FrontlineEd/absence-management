(function() {'use strict';angular.module('aesop')
.directive('cmptUiToggleSwitch', function () {return {

// directive options
restrict: 'E',
scope: {
	boolModel:'=',
	positiveLabel:'@',
	negativeLabel:'@',
	enable:'=',
	readOnly:'='
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-toggle-switch/uiToggleSwitch.html',

// #-------------------------------------------# //
// #---- Component (cmpt-ui-toggle-switch) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		label: $scope.boolModel ? $scope.positiveLabel : $scope.negativeLabel,
		switchAlternate: $scope.boolModel ? 'on' : 'off'
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	$scope.$watch('vm.switchAlternate',function(switchState){
		$scope.boolModel = switchState === 'on';
		vm.label = $scope.boolModel ? $scope.positiveLabel : $scope.negativeLabel;
	});


	// Actions that can be bound to from the view
	var go = $scope.go = {
	};
}

// #-- END Component (cmpt-ui-toggle-switch) --# //
// #-------------------------------------------# //
};});}());