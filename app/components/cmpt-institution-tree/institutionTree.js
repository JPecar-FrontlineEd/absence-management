(function() {'use strict';angular.module('aesop')
.directive('cmptInstitutionTree', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/generic/cmpt-institution-tree/institutionTree.html',

// #------------------------------------------# //
// #---- Component (cmpt-institution-tree) ----# //
controller: function ($scope, institutionSvc) {

	// View Model properties
	var vm = $scope.vm = {
		tree: {}
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {};

	institutionSvc.getTreeData().then(function (data) {
		vm.tree = data;
	});
}

// #-- END Component (cmpt-institution-tree) --# //
// #------------------------------------------# //
};});}());