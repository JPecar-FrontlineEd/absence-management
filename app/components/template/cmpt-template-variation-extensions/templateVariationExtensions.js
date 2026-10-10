(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateVariationExtensions', function () {return {

// directive options
restrict: 'E',
scope: {
	extensionList:'=?'		// the array of extensions
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-variation-extensions/templateVariationExtensions.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-variation-extensions) ----# //
controller: function ($scope, absrStateVal) {

	var vm = $scope.vm = {
		confNum: absrStateVal.absr.id,
		extensionList: $scope.extensionList
	}
}

// #-- END Component (cmpt-template-variation-extensions) --# //
// #---------------------------------------------------# //
};});}());