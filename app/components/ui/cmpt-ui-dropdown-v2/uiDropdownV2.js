(function() {'use strict';angular.module('aesop')
.directive('cmptUiDropdownV2', function () {return {

// directive options
restrict: 'E',
scope: {
	optionsArray:'=',		// the array of options (id and value props required on each object)
	valueSelected:'=',		// the selected object from the optionsArray
	enabled:'=',			// is dropdown should be enabled or disabled
	readOnly:'=',			// if true, no dropdown is shown (text instead)
	sortBy: '=?', 			// object prop name to sort using ("!" = don't sort)
	uniqueMarkerClass: '=',	// a unique identifier class that can be used to uniquely identify this control
	allowBlank:'=?',		// if false, don't off a "select one" option and auto select the first
	required: '=?',
	name: '@',
	formValue:'='
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-dropdown-v2/uiDropdownV2.html',

// #-----------------------------------------# //
// #---- Component (cmpt-ui-dropdown-v2) ----# //
controller: function ($scope, stringSvc) {

	$scope.sortBy = $scope.sortBy != null ? $scope.sortBy : 'value';
	if($scope.required == null){
		$scope.required = false;
	}
}

// #-- END Component (cmpt-ui-dropdown-v2) --# //
// #-----------------------------------------# //
};});}());