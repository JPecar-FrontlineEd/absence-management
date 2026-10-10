(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateSchoolSelector', function () {return {

// directive options
restrict: 'E',
scope: {
	link: '='
},
replace: true,
templateUrl: '/components/template/cmpt-template-school-selector/templateSchoolSelector.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-school-selector) ----# //
controller: function ($scope, stringSvc) {

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'schoolList.search.placeholder.schoolName',
        'schoolList.heading.selectSchool',
        'schoolList.Text.NoResultFoundFor',
        'Search'
	]);

	// View Model properties
	var vm = $scope.vm = {
		link: $scope.link,
		filter: ''
	};

	// Actions that can be bound to from the view
	var go = $scope.go = { };
}

// #-- END Component (cmpt-template-school-selector) --# //
// #---------------------------------------------------# //
};});}());