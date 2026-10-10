(function() {'use strict';angular.module('aesop')
.directive('cmptUiSingleselectSortableGrid', function () {return {

// directive options
restrict: 'E',
scope: {
	columns: '=',
	dataset: '=',
	selectedRow: '=',
	sort: '=?',
	isLoading: '=?',
	actions: '=?',
	boxesOnLeft: '@',
	idPrefix: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-singleselect-sortable-grid/uiSingleselectSortableGrid.html',

// #--------------------------------------------------------# //
// #---- Component (cmpt-ui-singleselect-sortable-grid) ----# //
controller: function ($scope, stringSvc) {

	if ($scope.isLoading == null) { $scope.isLoading = false; }
	$scope.boxesOnLeft = $scope.boxesOnLeft === 'true';

	var colLen = $scope.columns.length;

	if ($scope.boxesOnLeft ? $scope.columns[0].key != 'uicheckcol' : $scope.columns[colLen] != 'uicheckcol') {
		$scope.columns[$scope.boxesOnLeft ? 'unshift' : 'push']({
			key: 'uicheckcol',
			name: 'Check',
			cls: 'ui-check-col',
			template:
				'<input type="radio" ng-disabled="{{!!row.$disabled}}" ng-class="{\'hidden\':row.$disabled}" ng-model="row.$selected" ng-click="columns[' +
					($scope.boxesOnLeft ? 0 : colLen) +
					'].check(row)" ng-value="true" id="{{vm.idPrefix + $index}}"/>',
			headerTemplate: '<div></div>',
			sortable: false,
			allselected: false,
			check: function(row) {
				if (row.$selected && row.$disabled === true) {
					row.$selected = null;
					return;
				}
				else {
					if ($scope.selectedRow) {
						$scope.selectedRow.cls = '';
						$scope.selectedRow.$selected = false;
					}
					if (row !== $scope.selectedRow) {
						row.cls = 'selected';
						row.$selected = true;
						$scope.selectedRow = row;
					} else
						$scope.selectedRow = null;
				}
			},
			checkall: function() {
				if (this.allselected) {
					$scope.selected = $scope.dataset.filter(function(row) {
						return row.$disabled !== true;
					});
					$scope.dataset.forEach(function(row) {
						if (row.$disabled) {
							return;
						}
						row.$selected = true;
						row.cls = 'selected';
					});
				} else {
					$scope.dataset.forEach(function(row) {
						if (row.$disabled) {
							return;
						}
						row.$selected = false;
						row.cls = '';
					});
					$scope.selected = [];
				}
			}
		});
	}

	$scope.dataset.forEach(function (row) {
		row.$selected = row === $scope.selectedRow;
		row.cls = row.$selected ? 'selected' : '';
	});

	// View Model properties
	var vm = $scope.vm = {
		columns: $scope.columns,
		idPrefix: $scope.idPrefix
	};
}

// #-- END Component (cmpt-ui-singleselect-sortable-grid) --# //
// #--------------------------------------------------------# //
};});}());