(function() {'use strict';angular.module('aesop')
.directive('cmptUiCalendarButton', function () {return {

// directive options
restrict: 'E',
scope: {
	baseLink: '@',
	dateModel: '='
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-calendar-button/uiCalendarButton.html',

// #---------------------------------------------# //
// #---- Component (cmpt-ui-calendar-button) ----# //
controller: function ($scope, $filter, stringSvc) {

	var vm = $scope.vm = {
		month: formatMonth(),
		date: ($scope.dateModel || (new Date())).getDate()
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Dashboard.Header.Print.Label'
	]);

	function formatMonth() {
		return $filter('date')($scope.dateModel || (new Date()), 'MMM');
	}

	$scope.$watch('dateModel', function (newDate) {
		vm.month = formatMonth();
		vm.date = ($scope.dateModel || (new Date())).getDate();
	});
}

// #-- END Component (cmpt-ui-calendar-button) --# //
// #---------------------------------------------# //
};});}());