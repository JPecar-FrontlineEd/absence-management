(function() {'use strict';angular.module('aesop')
.directive('cmptUiMultiselectSortableGrid', function () {return {

// directive options
restrict: 'E',
scope: {
	columns: '=',
	dataset: '=',
	selected: '=',
	sort: '=?',
	isLoading: '=?',
	actions: '=?',
	boxesOnLeft: '@',
	idPrefix: '=?',
	disableInviewPlugin: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-multiselect-sortable-grid/uiMultiselectSortableGrid.html',

// #-------------------------------------------------------# //
// #---- Component (cmpt-ui-multiselect-sortable-grid) ----# //
controller: function ($scope, stringSvc) {

	var strings = $scope.strings = stringSvc.getStrings([
		'SelectAll',
		'SelectAbsence'
	]);

	if ($scope.isLoading == null) { $scope.isLoading = false; }
	$scope.boxesOnLeft = $scope.boxesOnLeft === 'true';

	if($scope.disableInviewPlugin == null) { $scope.disableInviewPlugin = false;}

	var colLen = $scope.columns.length;

	if ($scope.boxesOnLeft ? $scope.columns[0].key != 'uicheckcol' : $scope.columns[colLen] != 'uicheckcol') {
		$scope.columns[$scope.boxesOnLeft ? 'unshift' : 'push']({
			key: 'uicheckcol',
			name: 'Check',
			cls: 'ui-check-col',
			template: '<input aria-label="'+ strings['SelectAbsence']+'" type="checkbox" ng-disabled="{{!!row.$disabled}}" ng-class="{\'hidden\':row.$disabled}" ng-model="row.$selected" ng-click="columns[' + ($scope.boxesOnLeft ? 0 : colLen) + '].checkone(row)" id="{{vm.idPrefix + $index}}"/>',
			headerTemplate: '<input aria-label="'+ strings['SelectAll']+'" type="checkbox" ng-model="col.allselected" ng-click="col.checkall()" />',
			sortable: false,
			allselected: false,
			checkone: function (row) {
				if (row.$selected && row.$disabled === true) { row.$selected = null; return; }
				if (row.$selected) {
					row.cls = 'selected';
					$scope.selected.push(row);
					this.allselected = $scope.dataset.every(function (v) { return v.$selected === true || v.$disabled === true; });
				} else {
					row.cls = '';
					$scope.selected = $scope.selected.filter(function (v) { return v !== row; });
					this.allselected = false;
				}
			},
			checkall: function () {
				if (this.allselected) {
					$scope.selected = $scope.dataset.filter(function (row) {
						return row.$disabled !== true;
					});
					$scope.dataset.forEach(function (row) {
						if (row.$disabled) { return; }
						row.$selected = true;
						row.cls = 'selected';
					});
				} else {
					$scope.dataset.forEach(function (row) {
						if (row.$disabled) { return; }
						row.$selected = false;
						row.cls = '';
					});
					$scope.selected = [];
				}
			}
		});
	};

	$scope.dataset.forEach(function (row) {
		row.$selected = $scope.selected.indexOf(row) >= 0;
		row.cls = row.$selected ? 'selected' : '';
	});

	// View Model properties
	var vm = $scope.vm = {
		columns: $scope.columns,
		idPrefix: $scope.idPrefix
	};
},

link: function (scope, elem, attrs) {
	scope.progressive = attrs.progressive != null || undefined;
}

// #-- END Component (cmpt-ui-multiselect-sortable-grid) --# //
// #-------------------------------------------------------# //
};});}());
