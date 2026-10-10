(function() {'use strict';angular.module('aesop')
.directive('cmptUiGroupedGrid', function () {return {

// directive options
restrict: 'E',
scope: {
	columns: '=',
	footerColumns: '=?',
	dataset: '=',
	groupBy: '=',
	groupTitle: '=?',
	dblclick: '=?',
	selected: '=?',
	multiSelect: '=?',
	actions: '=?',
	isLoaded: '=?',
	summaryRow: '=?',
	processGroup: '=?',
	processRow: '=?',
	printWithBreaks: '=?',
	showHeader: '=?',
	parentVm:'=?',
	defaultRowHeight: '@',
	printing: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-grouped-grid/uiGroupedGrid.html',

// #-------------------------------------------# //
// #---- Component (cmpt-ui-grouped-grid) ----# //
controller: function ($scope, stringSvc, arrayHelp, domHelp) {

	if ($scope.multiSelect == null) { $scope.multiSelect = false; }

	// View Model properties
	var vm = $scope.vm = {
		colClasses: {},
		colStyles: {},
		showNoData: true,
		selectedId: null,
		enableSelection: $scope.hasOwnProperty('selected'),
		multiSelect: $scope.multiSelect,
		hasLoadedAtLeastOnce: false,
		gridRows: [],
		rowHeightTotal: 0,
		rowHeightCount: 0,
		avgRowHeight: null,
		printing: $scope.printing === true || false
	};

	//Main group collection bound to view
	var gridGroups = [];

	$scope.dblclick = $scope.dblclick || function () {};
	$scope.groupBy = $scope.groupBy || '';
	if ($scope.actions == null) { $scope.actions = {}; }
	if ($scope.isLoaded == null) { $scope.isLoaded = true; }
	$scope.footerColumns = $scope.footerColumns || [];
	$scope.summaryRow = $scope.summaryRow || null;
	if ($scope.processGroup == null) { $scope.processGroup = function(g){return g;}; }
	if ($scope.processRow == null) { $scope.processRow = function(r){return r;}; }
	if ($scope.groupTitle == null) { $scope.groupTitle = $scope.groupBy; }
	if ($scope.printWithBreaks == null) { $scope.printWithBreaks = false; }
	if ($scope.showHeader == null) { $scope.showHeader = true;}
	if ($scope.parentVm == null) { $scope.parentVm = {}; }
	$scope.progressive = $scope.progressive && $scope.progressive.toLowerCase() === 'true';

	var dataRefreshCount = 0;

	//Find all columns/fields needing calculated values (sum, avg, etc)
	var calculatedFields = [];
	if ($scope.footerColumns) {
		$scope.footerColumns.forEach(function(col) {
			if (!col.calculations) { return; }
			for (var i = 0; i < col.calculations.length; i++) {
				var calc = col.calculations[i];
				if (calculatedFields.indexOf(calc) === -1) {
					calculatedFields.push(calc);
				}
			}
		});
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		select: function (row) {
			if (vm.enableSelection) {
				$scope.selected = [row];
			}
		},
		selectMultiple: function (row){
			if (vm.enableSelection) {
				var selectedIds = $scope.selected.map(function (s) { return s.id; });
				var index = selectedIds.indexOf(row.id);
				if (index > -1 && selectedIds.length > 0) {
					$scope.selected.splice(index, 1);
				} else {
					$scope.selected.push(row);
				}
			}
		},
		fractionClass: function (frac) {
			return '-u-' + frac.replace('/', '-');
		},
		rowInView: function (group, row) {
			domHelp.rAF(function () {
				if (row.isInView) {
					row.$height = getRowHeight(group, row);
					vm.rowHeightTotal += row.$height;
					vm.rowHeightCount += 1;
					vm.avgRowHeight = Math.round(vm.rowHeightTotal / vm.rowHeightCount);
				}
			});
		}
	};

	function getRowHeight(group, row) {
		if (row.$index == null) { return null; }
		var rowEl = $scope.$container[0].getElementsByClassName('row-' + group.$index + '-' + row.$index)[0].getElementsByClassName('row-item');
		return (rowEl.length ? rowEl[0].clientHeight : null);
	}

	var defaultTemplate = '<span once-text="row[col.key]"></span>';

	$scope.$watch('columns', function (cols) {
		setColumnStyling('data', cols);
	});

	$scope.$watch('footerColumns', function (cols) {
		setColumnStyling('footer', cols);
	});

	function setColumnStyling(columnType, cols) {
		vm.colClasses[columnType] = {};
		vm.colStyles[columnType] = {};

		cols.forEach(function (col) {
			if (col.width.indexOf('/') !== -1) {
				vm.colClasses[columnType][col.key] = go.fractionClass(col.width || '1');
			} else {
				vm.colStyles[columnType][col.key] = vm.colStyles[col.key] || {};
				vm.colStyles[columnType][col.key].width = col.width;
			}

			col.template = col.template || defaultTemplate;
			col.cls = col.cls || '';
			col.noTitle = !!col.noTitle;
			col.autoResolveName = angular.isDefined(col.autoResolveName) ? col.autoResolveName : true;
		});

		var loadStrings = stringSvc.getStrings(cols.map(function (v, i, a) {
			return (v.name) ? v.name : '';
		}));

		loadStrings.$promise.then(function () {
			Object.keys(loadStrings).forEach(function (v) {
				if (v !== '$promise') {
					strings[v] = loadStrings[v];
				}
			});
		});
	}

	if (vm.enableSelection) {
		$scope.$watchCollection('selected', function (rowList) {
			if (!vm.multiSelect) {
				vm.selectedId = rowList[0] && rowList[0].id || null;
			}
		});
	}

	//Build grouped data structure from data
	$scope.$watchCollection('dataset', function (data) {
		vm.hasLoadedAtLeastOnce = dataRefreshCount > 0;
		dataRefreshCount += 1;

		if (vm.multiSelect) {
			var selectedIds = $scope.selected.map(function (s) { return s.id; });
			data = data.map(function(d){
				d.selected = selectedIds.indexOf(d.id) > -1;
				return d;
			});
		}

		vm.showNoData = data.length === 0;
		var itemCount = data.length;

		//Data to be grouped
		if ($scope.groupBy) {
			var curGroup = null;
			for (var i = 0; i < itemCount; i++) {
				var item = data[i],
				    groupVal = item[$scope.groupBy],
				    groupTitle = item[$scope.groupTitle];
				if (curGroup === null || groupVal !== curGroup.name) {
					//Add grouped header row
					if (curGroup !== null) {
						addGroupToGrid(curGroup);
					}
					curGroup = { name: groupVal, title: groupTitle, items: [] };
				}
				curGroup.items.push($scope.processRow(item));
				if (i === itemCount - 1) {
					addGroupToGrid(curGroup);
				}
			}
		}
		else {
			var curGroup = { name: '', items: [] };
			for (var i = 0; i < itemCount; i++) {
				var item = data[i];
				curGroup.items.push($scope.processRow(item));
			}
			if (itemCount > 0) {
				addGroupToGrid(curGroup);
			}
		}

		vm.gridRows = gridGroups;
		gridGroups = [];
		vm.avgRowHeight = parseInt($scope.defaultRowHeight, 10) || null;
		vm.rowHeightTotal = 0;
		vm.rowHeightCount = 0;

		$scope.$root.$emit('clearInViewState');
	});

	function removeRowFromSelected(row){
		var removeIndex = null;
		$scope.selected.forEach(function (v,i,a){
			if (v.id === row.id) {
				removeIndex = i;
			}
		});
		if (removeIndex !== null) {
			$scope.selected.splice(removeIndex,1);
		}
	}

	function addGroupToGrid(group) {
		group.count = group.items.length;

		if (calculatedFields.length > 0){
			group = getGroupWithCalculatedValues(group);
		}

		gridGroups.push($scope.processGroup(group));
	}


	//Possibly perform this during build of group structure to
	//  avoid additional post-work here
	function getGroupWithCalculatedValues(group) {
		for (var i = 0; i < group.count; i++) {
			var item = group.items[i];

			for (var c = 0; c < calculatedFields.length; c++) {
				var calc = calculatedFields[c];

				if (item[calc.key] != null) {
					group[calc.operation] = (!group[calc.operation]) ? {} : group[calc.operation];

					//Sum up the property values
					if (calc.operation.toLowerCase() === 'sum') {
						if (!group[calc.operation][calc.key]) {
							group[calc.operation][calc.key] = 0;
						}
						var numVal = parseFloat(item[calc.key],10);
						group[calc.operation][calc.key] += (!isNaN(numVal)) ? numVal : 0;
					}
				}
			}

			//Round numeric values if rounding is specified
			for (var c = 0; c < calculatedFields.length; c++) {
				var calc = calculatedFields[c];
				if (calc.roundTo) {
					var value = group[calc.operation][calc.key];
					if (!isNaN(value)) {
						group[calc.operation][calc.key] = roundCalculatedGroupValue(value, calc.roundTo);
					}
				}
			}
		}

		return group;
	}

	//Used to round calculated grouped values to decimal place
	function roundCalculatedGroupValue(value, decimals) {
		var zeros = '';
		for (var i = 0; i <= decimals; i++) {
			zeros += '0';
		}
		var roundAmt = parseInt('1' + zeros, 10);
		return Math.round(value * roundAmt) / roundAmt;
	}

	$scope.$on('$destroy', $scope.$root.$on('beforePrint', function () {
		domHelp.rAF().then(function () { vm.printing = true; });
	}));
	$scope.$on('$destroy', $scope.$root.$on('afterPrint', function () {
		vm.printing = false;
	}));
	$scope.$on('$destroy', $scope.$root.$on('uncontroledPrint', function () {
		window.alert('Please use CTRL + P to print this content correctly.');
	}));

},

link: function (scope, elem, attrs) {
	scope.$container = elem;
}

// #-- END Component (cmpt-ui-grouped-grid) --# //
// #-------------------------------------------# //
};});}());
