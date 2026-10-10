(function() {'use strict';angular.module('aesop')
.directive('cmptSearchByText', function () {return {

// directive options
restrict: 'E',
scope: {
	filter: '=',
	placeholder: '@'
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-search-by-text/searchByText.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-search-by-text) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {
		placeholder:$scope.placeholder != null ? $scope.placeholder: ''
	};


	var strings = $scope.strings = stringSvc.getStrings([
		vm.placeholder,
		'SearchByText'
	]);

}

// #-- END Component (cmpt-search-by-text) --# //
// #-----------------------------------------------------# //
};});}());
