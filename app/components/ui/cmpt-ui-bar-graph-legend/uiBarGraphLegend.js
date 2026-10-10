(function() {'use strict';angular.module('aesop')
.directive('cmptUiBarGraphLegend', function () {return {

// directive options
restrict: 'E',
scope: {
	graphData: '=',
	colors: '=',
	titleHovered: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-bar-graph-legend/uiBarGraphLegend.html',

// #----------------------------------------------# //
// #---- Component (cmpt-ui-bar-graph-legend) ----# //
controller: function ($scope, stringSvc) {
if ($scope.titleHovered == null) { $scope.titleHovered = ''; }

	var colors = $scope.colors = $scope.colors || {};

	var props = $scope.props = $scope;

	// View Model properties
	var vm = $scope.vm = {
		showLegendTitle: true,
		items: []
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {};

	$scope.$watch('graphData', function (data) {
		var index = {};
		vm.items = [];

		data.forEach(function (v) {
			if (index[v.title] == null) {
				// if we don't have good data, bail out
				if (v.label == null || v.title == null) { return; }

				index[v.title] = true;
				vm.items.push({
					title: v.title,
					label: v.label
				});
			}
		});
	});
},
link: function (scope, elem, attrs) {
	if (elem.find('label').text().length === 0) {
		scope.vm.showLegendTitle = false;
	}
}

// #-- END Component (cmpt-ui-bar-graph-legend) --# //
// #----------------------------------------------# //
};});}());