(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateBoolean', function () {return {

// directive options
restrict: 'E',
scope: {
	value:'@',
	showOnly:'@'
},
replace: true,
templateUrl: '/components/template/cmpt-template-boolean/templateBoolean.html',

// #-------------------------------------------# //
// #---- Component (cmpt-template-boolean) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		text: ''
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Yes',
		'No'
	]);

	//Do we want to show only if Yes or No?
	if ($scope.value !== null) {
		var val = $scope.value === "true";
		var showOnly = ($scope.showOnly) ? $scope.showOnly.toLowerCase() : 'yes,no';
		if (showOnly.indexOf('yes') > -1 && val) {
			vm.text = 'Yes';
		}
		else if (showOnly.indexOf('no') > -1 && !val) {
			vm.text = 'No';
		}
	}

}

// #-- END Component (cmpt-template-boolean) --# //
// #-------------------------------------------# //
};});}());