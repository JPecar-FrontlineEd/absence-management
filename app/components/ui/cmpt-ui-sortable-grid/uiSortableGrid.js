(function() {'use strict';angular.module('aesop')
.directive('cmptUiSortableGrid', function () {return {

// directive options
restrict: 'E',
scope: {
	columns: '=',
	dataset: '=',
	sort: '=?',
	isLoading: '=?',
	actions: '=?',
	trackBy: '@',
	parentVm:'=?',
	defaultRowHeight: '@',
	idPrefix: '=?',
	disableInviewPlugin: '=?',
	isSubAvailabilityReport: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-sortable-grid/uiSortableGrid.html',

// #-------------------------------------------# //
// #---- Component (cmpt-ui-sortable-grid) ----# //
controller: function ($scope, stringSvc, domHelp) {

	$scope.sort = $scope.sort || {};
	$scope.isLoading = $scope.isLoading || false;
	if ($scope.actions == null) { $scope.actions = {}; }
	if ($scope.actions == null) { $scope.actions={}; }
	if ($scope.trackBy == null) { $scope.trackBy = ''; }
	if ($scope.parentVm == null) { $scope.parentVm = {}; }
	if ($scope.disableInviewPlugin == null)  {$scope.disableInviewPlugin = false; }

	// View Model properties
	var vm = $scope.vm = {
		colClasses: {},
		colStyles: {},
		defaultSort: {},
		showNoData: true,
		rowTemplate: '',
		trackBy: '',
		rowData: [],
		rowHeightTotal: 0,
		rowHeightCount: 0,
		avgRowHeight: null,
		printing: false,
		idPrefix: $scope.idPrefix
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = {};
	var defaultTemplate = '<span once-text="row[\'{key}\']"></span>';

	// Actions that can be bound to from the view
	var go = $scope.go = {
		fractionClass: function (frac) {
			return '-u-' + frac.replace('/', '-');
		},
		sortCol: function (idx) {
			var colName;

			if (idx == null) {
				colName = getFirstSortableColumn();
			} else {
				if ($scope.columns[idx] && !$scope.columns[idx].sortable) { return; }
				colName = $scope.columns[idx] && $scope.columns[idx].key || '';
			}

			if (colName === $scope.sort.byColumn) {
				$scope.sort.direction = ($scope.sort.direction === 'asc') ? 'desc' : 'asc';
			} else {
				$scope.sort.byColumn = colName;
				$scope.sort.direction = 'asc';
			}
		},
		getSortClass: function (colName) {
			if (colName !== $scope.sort.byColumn) {
				return 'fa-unsorted';
			} else {
				return 'fa-sort-' + ($scope.sort.direction === 'asc' ? 'up' : 'down');
			}
		},
		rowInView: function (row) {
			domHelp.rAF(function () {
				if (row.isInView) {
					row.$height = getRowHeight(row);
					vm.rowHeightTotal += row.$height;
					vm.rowHeightCount += 1;
					vm.avgRowHeight = Math.round(vm.rowHeightTotal / vm.rowHeightCount);
				}
			});
		},
		selectRow: function($event) {
			var selectedRow = angular.element($event.currentTarget);
			var selectedCheckbox = selectedRow.children().eq(0).children().eq(0);
			
			if (selectedRow.hasClass("selectedRow")){
				selectedRow.removeClass("selectedRow");
				selectedCheckbox.prop('checked', false);
			} else {
				selectedRow.addClass("selectedRow");
				selectedCheckbox.prop('checked', true);
			}
		},
		masterCheckboxClick: function(){
			var isMasterCheckboxChecked = $(".masterCheckbox").eq(0).is(":checked");
			var checkboxes = $(".checkbox");
			
			for(var i = 0; i < checkboxes.length; i++){
				var row = $(".cmpt-template-substitute-link").eq(i).parent().parent();
				var checkbox = row.children().eq(0).children().eq(0);

				isMasterCheckboxChecked ? row.addClass("selectedRow") : row.removeClass("selectedRow");
				checkbox.prop('checked', isMasterCheckboxChecked);
			}
		}
	};

	function getRowHeight(row) {
		if (row.$index == null) { return null; }
		var rowEl = $scope.$container[0].getElementsByClassName('row-' + row.$index)[0].getElementsByClassName('grid-row');
		return (rowEl.length ? rowEl[0].clientHeight : null);
	}

	function sortByCol(colName, reverse) {
		$scope.dataset.sort(colSort(colName, reverse));
	}

	function colSort (colName, reverse) {
		var rev = reverse ? -1 : 1;
		return function (a, b) {
			var out = 0;
			if (a[colName] > b[colName]) { out = 1; }
			if (a[colName] < b[colName]) { out = -1; }
			return out * rev;
		};
	}

	function getFirstSortableColumn () {
		var cols = $scope.columns,
			len = cols.length,
			i = 0;

		for (; i < len; i += 1) {
			if (cols[i].sortable) { return cols[i].key; }
		}

		return '';
	}

	 function doSort() {
		var sort = $scope.sort,
			colName = sort.byColumn || getFirstSortableColumn(),
			reverse = (!sort.direction || sort.direction.toLowerCase() === 'asc') ? false : true;
			// if we have a column to sort on. DO IT!
		if (colName) { sortByCol(colName, reverse); }
	}

	$scope.$watch('columns', function (cols) {
		vm.colClasses = {};
		vm.colStyles= {};
		vm.trackBy = $scope.trackBy;
		$scope.sort.byColumn = null;
		$scope.sort.direction = null;

		var loadStrings = stringSvc.getStrings(cols.map(function (v, i, a) {
				return v.name;
			})),
			dynWidthMode = true,
			totalColWidthAmt = cols.reduce(function (amt, col) {
				if (!dynWidthMode) { return 0; }
				if (col.width == null) { return amt; }
				if (col.width.indexOf('/') >= 0 || col.width.indexOf('%') >= 0) {
					dynWidthMode = false;
					return 0;
				}

				return amt + parseInt(col.width, 10);
			}, 0);

		Object.keys(loadStrings).forEach(function (v) {
			if (v !== '$promise') {
				strings[v] = loadStrings[v];
			}
		});

		vm.rowTemplate = '';

		cols.forEach(function (col, i) {
			if (col.width != null) {
				if (dynWidthMode) {
					vm.colStyles[col.key] = { width: ((parseInt(col.width, 10) / totalColWidthAmt) * 100) + '%' };
				} else if (col.width.indexOf('/') !== -1) {
					vm.colClasses[col.key] = go.fractionClass(col.width || '1');
				}else{
					vm.colStyles[col.key] = { width: col.width };
				}
			}
			col.template = col.template || defaultTemplate.replace('{key}',col.key);
			col.sortable = (col.sortable == null) ? true : col.sortable;
			col.cls = col.cls || '';

			if (col.isIndex) { vm.trackBy = col.key; }

			if (col.defaultSort) {
				$scope.sort.byColumn = col.key;
				$scope.sort.direction = col.defaultSort;
			}

			if (col.key == 'masterCheckbox' && $scope.isSubAvailabilityReport){
				col.headerTemplate = '<span>' + col.name + '</span>';
			} else {
				col.headerTemplate = col.headerTemplate || '<span>{{ strings[col.name] }}</span>';
			}

			vm.rowTemplate += '<div class="' + vm.colClasses[col.key] + ' ' + col.key + '-cell grid-cell" ' +
				'ng-class="{\'sorted\': sort.byColumn === \'' + col.key + '\'}" ng-style="vm.colStyles[\'' + col.key + '\']">';
			if (col.labelFor) {
				vm.rowTemplate += '<label for=\'{{ vm.idPrefix + $index }}\'>' + col.template.replace() + '</label></div>';
			} else {
				vm.rowTemplate += col.template.replace() + '</div>';
			}
		});

		if ($scope.sort.byColumn == null) { $scope.sort.byColumn = getFirstSortableColumn(); }
		if ($scope.sort.direction == null) { $scope.sort.direction = 'asc'; }

		vm.defaultSort = angular.copy($scope.sort);
		doSort();
	});

	$scope.$watchCollection('sort', doSort);
	$scope.$watch(
		// watch function
		function(s) {
			return s.dataset.filter(function(row) {
				return !row.hidden;
			}).length;
		},
		// execute when watch function output changes
		function (count) {
			vm.showNoData = !count;
		}
	);
    
	$scope.$watch('dataset', function (nData, oData) {
		doSort();

		vm.rowData = nData;
		vm.avgRowHeight = parseInt($scope.defaultRowHeight, 10) || null;
		vm.rowHeightTotal = 0;
		vm.rowHeightCount = 0;
	});

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

// #-- END Component (cmpt-ui-sortable-grid) --# //
// #-------------------------------------------# //
};});}());