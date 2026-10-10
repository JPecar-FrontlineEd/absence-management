(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateDayExtensions', function () {return {

// directive options
restrict: 'E',
scope: {
	extensions:'=?'		// the array of extensions
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-day-extensions/templateDayExtensions.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-day-extensions) ----# //
controller: function ($scope, absrStateVal) {

	var dayView = $scope.dayView = {
		confirmationNumber: absrStateVal.absr.id,
		extensions: $scope.extensions
	}
}

// #-- END Component (cmpt-template-day-extensions) --# //
// #---------------------------------------------------# //
};});}());