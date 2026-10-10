(function() {'use strict';angular.module('aesop')
.directive('cmptUiGrid', function () {return {

// directive options
restrict: 'E',
scope: {
	// data interface
	columns: '=',
	dataset: '=',

	// group config
	groupBy: '=?',
	groupTitleTemplate: '=?',

	// misc config
	headerTemplate: '=?',
	footerTemplate: '=?',
	summaryDataHandler: '=?',
	defaultRowHeight: '@',
	defaultSort: '@',
	trackBy: '@',

	// state
	isLoading: '=?',

	// Disable In-View Plugin
	useInView: '=?',
	//To set in-view to false.
	setInView: '=?'
	
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-grid/uiGrid.html',

// #----------------------------------# //
// #---- Component (cmpt-ui-grid) ----# //
controller: function ($scope, $log, $timeout, stringSvc, gridHelp, domHelp) {

	// locals
	var defaultCellTemplate = '<span once-text="row[\'{key}\']"></span>',
		defaultColumnHeaderTemplate = '<span>{{ strings[col.name] }}</span>',
		defaultGroupTitleTemplate = '{{ row[groupBy] }}';

	// setup scope params and defaults
	if ($scope.groupBy == null) { $scope.groupBy = ''; }
	if ($scope.headerTemplate == null) { $scope.headerTemplate = ''; }
	if ($scope.footerTemplate == null) { $scope.footerTemplate = ''; }
	if ($scope.groupTitleTemplate == null) { $scope.groupTitleTemplate = defaultGroupTitleTemplate; }
	if ($scope.summaryDataHandler == null) { $scope.summaryDataHandler = function (rows) { return {count: rows.length}; }; }
	if ($scope.isLoading == null) { $scope.isLoading = false; }
	if ($scope.useInView == null) { $scope.useInView = true; }
	if ($scope.setInView == null) { $scope.setInView = true; }

	$scope.parent = $scope.$parent;
	// View Model properties
	var vm = $scope.vm = {
		colClasses: {}, colStyles: {},
		sortBy: '', sortDir: 'asc',
		isGrouped: !!($scope.groupBy != null && $scope.groupBy.length),
		trackBy: '',
		rowTemplate: '',
		rowHeightTotal: 0, rowHeightCount: 0,
		showNoData: false,
		printing: false,
		summaryData: {}
	};
	$scope.summaryData = {};

	var strings = $scope.strings = {};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		getSortClass: function (colName) {
			if (colName !== vm.sortBy) {
				return 'fa-unsorted';
			} else {
				return 'fa-sort-' + (vm.sortDir === 'desc' ? 'down' : 'up');
			}
		},
		sortByColumnIdx: function (idx) {
			var cols = $scope.columns, columnKey;

			if (idx == null) {
				columnKey = gridHelp.getFirstSortableColumn(cols);
			} else {
				if (cols[idx] && !cols[idx].sortable) { return; }
				columnKey = cols[idx] && cols[idx].key || '';
			}

			if (columnKey === vm.sortBy) {
				vm.sortDir = (vm.sortDir === 'asc') ? 'desc' : 'asc';
			} else {
				vm.sortBy = columnKey;
				vm.sortDir = 'asc';
			}

			vm.rowData = sortData($scope.dataset);
		},
		showGroupHeader: function (idx) {
			if (!vm.isGrouped) { return false; }
			var group = $scope.groupBy,
				row = vm.rowData[idx],
				rowGroup = row[group],
				prevGroup = vm.rowData[idx - 1] && vm.rowData[idx - 1][group] || null;
			return (!$scope.setInView || row.$isInView || vm.printing) && rowGroup !== prevGroup;
		},
		getGroupTitleTemplate : function(idx){
			if(vm.rowData[idx].groupTitleTemplate != null && vm.rowData[idx].groupTitleTemplate != '' && vm.rowData[idx].groupTitleTemplate != 'undefined')
			{
				return vm.rowData[idx].groupTitleTemplate.find(x=>x.key == $scope.groupBy).value;
			}
			return  $scope.groupTitleTemplate;
		},
		
		showGroupFooter: function (idx) {
			if (!vm.isGrouped) { return false; }
			var group = $scope.groupBy,
				row = vm.rowData[idx],
				rowGroup = row[group],
				nextGroup = vm.rowData[idx + 1] && vm.rowData[idx + 1][group] || null;

			return ( !$scope.setInView || row.$isInView || vm.printing) && rowGroup !== nextGroup;
		},
		rowInView: function (row) {
			domHelp.rAF(function () {
				if (row.$isInView) {
					row.$height = getRowHeight(row);
					vm.rowHeightTotal += row.$height;
					vm.rowHeightCount += 1;
					vm.avgRowHeight = Math.round(vm.rowHeightTotal / vm.rowHeightCount);
				}
			});
		}
	};

	function getRowHeight(row) {
		if (row.$index == null) { return null; }
		var rowEl = $scope.$container[0].getElementsByClassName('row-' + row.$index)[0].getElementsByClassName('row-content');
		return (rowEl.length ? rowEl[0].clientHeight : null);
	}

	function sortData(data) {
		var sorted = [];
		if (!!vm.sortBy) {
			sorted = data.sort(getSortFunction());
		} else {
			//skip sorting if we don't have a sortBy
			sorted = data;
		}

		var i = sorted.length;

		// clear inView data and set new index value
		for (; i-- ;) {
			delete sorted[i].$isInView;
			delete sorted[i].$height;
			sorted[i].$index = i;
		}
		// clear the inView state
		$scope.$root.$emit('clearInViewState');
		
		return sorted;
	}

	function getSortFunction() {
		var rev = (vm.sortDir === 'desc') ? -1 : 1;
		return function (a, b) {
			var out = 0,
				aGroup, bGroup,
				aSort, bSort;

			if (vm.isGrouped) {
				aGroup = gridHelp.prepSortData(a[$scope.groupBy]);
				bGroup = gridHelp.prepSortData(b[$scope.groupBy]);
				if (aGroup > bGroup) { out = 1; }
				else if (aGroup < bGroup) { out = -1; }
			}

			if (vm.isGrouped && out === 0 || !vm.isGrouped) {
				aSort = gridHelp.prepSortData(a[vm.sortBy]);
				bSort = gridHelp.prepSortData(b[vm.sortBy]);
				if (aSort > bSort) { out = (1 * rev); }
				else if (aSort < bSort) { out = (-1 * rev); }
			}

			return out;
		};
	}

	function refreshSummaryData(data) {
		var len = data.length,
			groupBy = $scope.groupBy,
			group = 'all',
			gData = [], i, row, k;

		vm.summaryData = {};

		for (i = 0; i < len; i += 1) {
			row = data[i];
			if (vm.isGrouped) { group = row[groupBy]; }
			gData = vm.summaryData[group] = vm.summaryData[group] || [];
			gData.push(row);
		}

		if (vm.isGrouped) {
			for (k in vm.summaryData) {
				vm.summaryData[k] = $scope.summaryDataHandler(vm.summaryData[k]);
			}
		} else {
			$scope.summaryData = $scope.summaryDataHandler(gData);
		}
	}

	$scope.$watch('columns', function (cols) {

		var totalColWidthAmt = gridHelp.getTotalColumnWidth(cols),
			len = cols.length, col, i;

		// reset some state
		vm.colClasses = {}; vm.colStyles = {};
		vm.sortBy = ''; vm.sortDir = '';
		vm.trackBy = $scope.trackBy != null ? $scope.trackBy : '';
		vm.rowTemplate = '';

		// fetch strings and add them to our scope strings
		angular.extend(strings, stringSvc.getStrings(cols.map(function (v) { return v.name; })));

		for (i = 0; i < len; i += 1) {
			col = cols[i];

			// apply column widths (% or fraction)
			if (col.width != null) {
				if (totalColWidthAmt) {
					vm.colStyles[col.key] = { width: ((parseInt(col.width, 10) / totalColWidthAmt) * 100) + '%' };
				} else if (col.width.indexOf('/') >= 0) {
					vm.colClasses[col.key] = gridHelp.fractionClass(col.width || '1');
				} else {
					vm.colStyles[col.key] = { width: col.width };
				}
			}

			// apply column defaults
			col.template = col.template || defaultCellTemplate.replace('{key}',col.key);
			col.sortable = (col.sortable == null && col.key !== $scope.groupBy) ? true : col.sortable;
			col.cls = col.cls || '';
			col.headerTemplate = col.headerTemplate || defaultColumnHeaderTemplate;

			// check if this col is the index
			if (col.isIndex) { vm.trackBy = col.key; }

			// is this column sorted?
			if (col.sort && !vm.sortBy) {
				vm.sortBy = col.key;
				vm.sortDir = (col.sort === 'asc' || col.sort === 'desc') ? col.sort : 'asc';
			}

			vm.rowTemplate += '<div class="' + vm.colClasses[col.key] + ' ' + col.key + '-cell grid-cell" ' +
				'ng-class="{\'sorted\': sortBy.column === \'' + col.key + '\'}" ng-style="vm.colStyles[\'' + col.key + '\']">' + col.template + '</div>';
		}
		if (!vm.trackBy) { $log.warn('ui-grid: no "isIndex" column specified'); }
		if (!vm.sortBy) { vm.sortBy = $scope.defaultSort || gridHelp.getFirstSortableColumn(cols); }
		if (!vm.sortBy) { $log.warn('ui-grid: no sortable column or default sort value specified'); }
		if (!vm.sortDir) { vm.sortDir = 'asc'; }
	});

	$scope.$watch('defaultSort', function (sortKey, oldSortKey) {
		//DE10969 - There was nothing in place to allow us to update the defaultSort from
		//a consumer of this component and actually change the sorting of the grid
		if (sortKey !== oldSortKey && vm.sortBy === oldSortKey) {
			vm.sortBy = sortKey;
		}
	});

	$scope.$watch('dataset', function (nData, oData) {

		refreshSummaryData(nData);

		vm.rowData = sortData(nData);
		vm.showNoData = nData.length === 0;

		vm.avgRowHeight = parseInt($scope.defaultRowHeight, 10) || null;
		vm.rowHeightTotal = 0;
		vm.rowHeightCount = 0;

		$scope.$root.$emit('clearInViewState');
	});
	$scope.$watch('groupBy', function (group) {
		vm.isGrouped = !!($scope.groupBy != null && $scope.groupBy.length);
		vm.rowData = sortData($scope.dataset);
		refreshSummaryData(vm.rowData);
	});

	// listeners to handle printing conditions
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

// #-- END Component (cmpt-ui-grid) --# //
// #----------------------------------# //
};});}());
