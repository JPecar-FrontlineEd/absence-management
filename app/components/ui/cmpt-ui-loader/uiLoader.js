(function() {'use strict';angular.module('aesop')
.directive('cmptUiLoader', function () {return {

// directive options
restrict: 'E',
scope: {
	isLoading: '=',
	statusText: '=?',
	cls: '@'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-loader/uiLoader.html',

// #------------------------------------# //
// #---- Component (cmpt-ui-loader) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {};

},

link: function (scope, elem, attrs) {
	scope.fill = attrs.fill != null;
}

// #-- END Component (cmpt-ui-loader) --# //
// #------------------------------------# //
};});}());