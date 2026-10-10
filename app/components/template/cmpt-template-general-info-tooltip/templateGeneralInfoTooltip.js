(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateGeneralInfoTooltip', function () {return {

// directive options
restrict: 'E',
scope: {
	qtipData:'=',
	nameLink: '=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-general-info-tooltip/templateGeneralInfoTooltip.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-template-general-info-tooltip) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		qtipData: $scope.qtipData,
		nameLink: $scope.nameLink
	};

	if (!vm.nameLink) vm.nameLink = '';

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		click: function (item) {
			if(item.action) { item.action(); }
		}
	};
}

// #-- END Component (cmpt-template-general-info-tooltip) --# //
// #--------------------------------------------------------# //
};});}());
