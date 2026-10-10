(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateDaySpanIndicator', function () {return {

// directive options
restrict: 'E',
scope: {
	hasDaysInPast:'=',
	hasDaysInFuture:'=',
},
replace: true,
templateUrl: '/components/template/cmpt-template-day-span-indicator/templateDaySpanIndicator.html',

// #------------------------------------------------------# //
// #---- Component (cmpt-template-day-span-indicator) ----# //
controller: function ($scope, stringSvc) {


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Dashboard.Icon.HaveDaysInPast.Title',
		'Dashboard.Icon.HaveDaysInFuture.Title'
	]);


}

// #-- END Component (cmpt-template-day-span-indicator) --# //
// #------------------------------------------------------# //
};});}());