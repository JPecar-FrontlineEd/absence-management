(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateVariationExtensionsTooltip', function () {return {

// directive options
restrict: 'E',
scope: {
	extensionList:'=?'		// the array of extensions
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-variation-extensions-tooltip/templateVariationExtensionsTooltip.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-variation-extensions-tooltip) ----# //
controller: function ($scope, stringSvc, absrStateVal) {

	var vm = $scope.vm = {
		confNum: absrStateVal.absr.id,
		extensionList: $scope.extensionList
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings(['ConfirmationNumberPound', 'Date']);
}

// #-- END Component (cmpt-template-variation-extensions-tooltip) --# //
// #---------------------------------------------------# //
};});}());