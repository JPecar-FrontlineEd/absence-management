(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateInstitutionTree', function () {return {

// directive options
restrict: 'E',
scope: {
	link: '@',
	filter: '='
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-institution-tree/templateInstitutionTree.html',

// #----------------------------------------------------# //
// #---- Component (cmpt-template-institution-tree) ----# //
controller: function ($scope, $q, $timeout, institutionSvc) {

	var resultsTimer, lastRequest;

	// View Model properties
	var vm = $scope.vm = {
		tree: {},
		link: $scope.link
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {};

	institutionSvc.getTreeData().then(function (data) {
		vm.tree = data;
	});

	$scope.$watch('filter', function (search) {
		var delay = (resultsTimer == null) ? 0 : 200;

		// cancel the previous request and reset timer
        $timeout.cancel(resultsTimer);
        if (lastRequest && lastRequest.$abort) { lastRequest.$abort(); }

        resultsTimer = $timeout(function () {
            institutionSvc.getTreeData({key:'name',value:search}).then(function (data) {
				vm.tree = data;
			});
        }, delay);
	});
}

// #-- END Component (cmpt-template-institution-tree) --# //
// #----------------------------------------------------# //
};});}());