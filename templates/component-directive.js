(function() {'use strict';angular.module('aesop')
.directive('cmpt{{properCase namespace}}{{properCase name}}', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/{{dashCase namespace}}/cmpt-{{dashCase namespace}}-{{dashCase name}}/{{camelCase namespace}}{{properCase name}}.html',

// #---------------------{{dashes (dashCase namespace)}}-{{dashes (dashCase name)}}--------# //
// #---- Component (cmpt-{{dashCase namespace}}-{{dashCase name}}) ----# //
controller: function ($scope, stringSvc) {

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

// #-- END Component (cmpt-{{dashCase namespace}}-{{dashCase name}}) --# //
// #-----------------------{{dashes (dashCase namespace)}}-{{dashes (dashCase name)}}------# //
};});}());