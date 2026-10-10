(function() {'use strict';angular.module('aesop')
.directive('cmptUiMultiselect', function () {return {

// directive options
restrict: 'E',
scope: {
	multiple: '@',
	height: '@',
	width: '@',
	name: '@',
	type: '@',
	labelAll: '@',
	allowSingleItem: '@',
	items: '=',
	selected: '=',
	enable:'=?',
	isGlobalSearch:'=?'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-multiselect/uiMultiselect.html',

// #-----------------------------------------# //
// #---- Component (cmpt-ui-multiselect) ----# //
controller: function ($scope, $q, $timeout, stringSvc, domHelp) {


	const maxItems = 200;
	const minLetter = 3;

	$scope.selected = $scope.selected || [];
	$scope.enable = ($scope.enable != null) ? $scope.enable : true;
	$scope.allowSingleItem = $scope.allowSingleItem === 'true';

	var searchTimeout = null,
		listData = [],
		itemByIdMap = {};

	// View Model properties
	var vm = $scope.vm = {
		minLetter,
		checkMax: true,
		multiselect: $scope.multiple === 'true',
		styles: {
			width: $scope.width || '50%'
		},
		filterText: '',
		filterTextImmediate: '',
		itemList: [],
		label: '',
		labelStyle: {
			'padding-right': 0
		}
	};

	var labelArray;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Filter',
		'ViewAll',
		$scope.type,
		$scope.labelAll
	]);

	// if our labelAll has pipes, we need to fetch the
	// individual resources and concat them together
	if($scope.labelAll.indexOf('|') !== -1){
		// split the resources out
		var splitLabels = $scope.labelAll.split('|');

		// make a request for those resources
		labelArray = stringSvc.getStrings(splitLabels);

		// wait for the resources and the strings request to come back
		$q.all({label: labelArray.$promise, strings: strings.$promise}).then(function (data) {

			// replace the failed resource load (for the piped value) with the resolved value
			strings[$scope.labelAll] = splitLabels.map(function (key) {
				return data.label[key];
			}).join(' ');
		});
	}


	// Actions that can be bound to from the view
	var go = $scope.go = {
		selectNone: function () {
			$scope.selected = [];
		},
		menuHasClosed: function () {
			vm.filterTextImmediate = vm.filterText = '';
		},
		closeMenu: function () {
			$scope.$emit('close-menu');
		},
		matchFilter: function (value) {
			return vm.filterText.length === 0 || value.indexOf(vm.filterText.toLocaleLowerCase()) >= 0;
		},
		selectItem: function (e, item) {
			e.stopPropagation();
			var idx, s = $scope.selected;
			if (vm.multiselect) {
				idx = s.indexOf(item.id);
				if (idx === -1) {
					s.push(item.id);
				} else {
					s.splice(idx, 1);
				}
			} else {
				// set the new one
				if (item != null) {
					if (!item.enabled) { return; }
					$scope.selected = [item.id];
				} else {
					$scope.selected = [];
				}
			}
		},
		cancel: function (e) {
			e.stopPropagation();
		},
		showMenu: function (e) {
			if (vm.singleSelect || !$scope.enable) { e.stopImmediatePropagation(); return; }
			if (vm.itemList !== listData) {
				domHelp.rAF().then(function () {

					vm.itemList = listData;
				});
			}
		}
	};

	function itemById(id) {
		return itemByIdMap[id] || null;
	}

	function calcLabel() {
		var label = $scope.selected.length > 0 ? $scope.selected.length + ' selected' : '',
			item;

		if ($scope.selected.length === 1) {
			item = itemById($scope.selected[0]);
			label = item && item.value || '';
		}

		vm.label = label;
	}

	$scope.$watch('vm.filterTextImmediate', function (nVal) {
		if (nVal !== vm.filterText) {
			$timeout.cancel(searchTimeout);
			searchTimeout = $timeout(function () {
				vm.filterText = nVal;
			}, 50);
		}
	});

	$scope.$watch('items', function (allItems, oldItems) {

		vm.checkMax = (allItems.length > maxItems && $scope.typeEnabledSearch);

		var singleSelect = ($scope.allowSingleItem) ? false : null;

		listData = allItems.map(function (v, i, a) {
			// single select mode?
			if (v.enabled && singleSelect !== false) {
				singleSelect = (singleSelect === null) ? v : false;
			}

			v.checked = $scope.selected.indexOf(v.id) !== -1;
			v.searchValue = v.value.toLocaleLowerCase();
			v.visible = go.matchFilter(v.searchValue);

			// set the index
			v.idx = i;

			itemByIdMap[v.id] = v;
			return v;
		});

		if (singleSelect) {
			vm.singleSelect = true;
			$scope.selected = [singleSelect.id];
		}

		if ($scope.selected.length > 0) {
		 	calcLabel();
		}

		//if the dropdown is already open and data is coming back
		//we want to assign that data to itemList so we can paint it
		if ($scope.$el.find('ul').eq(0).hasClass('active')) {
			vm.itemList = listData;
		}
	});

	$scope.$watch('vm.filterText', function (newSearch, oldSearch) {
		if (newSearch === oldSearch && newSearch === '') { return; }
		var incremental = newSearch.indexOf(oldSearch) === 0;
		vm.itemList.forEach(function (v) {
			if (incremental && !v.visible) { return; }
			v.visible = go.matchFilter(v.searchValue);
		});
	});

	$scope.$watchCollection('selected', function (nIds, pIds) {
		if (typeof nIds === 'number') {
			nIds = [nIds];
			$scope.selected = nIds;
		}

		nIds = nIds || [];
		pIds = pIds || [];

		pIds.forEach(function (v, i, a) {
			if (nIds.indexOf(v) === -1) {
				itemById(v).checked = false;
			}
		});

		nIds.forEach(function (v, i, a) {
			var item;
			if (pIds.indexOf(v) === -1) {
				item = itemById(v);
				if (item != null) { item.checked = true; }
			}
		});

		calcLabel();
	});


	domHelp.rAF().then(function () {
		var selector = $scope.$el[0].getElementsByClassName('selector')[0],
			selectorWidth = window.getComputedStyle(selector).width;

		vm.labelStyle['padding-right'] = selectorWidth;
	});
},
link: function (s, e, a) {
	s.typeEnabledSearch = a.typetoenablesearch != null;
	s.$el = e;
}

// #-- END Component (cmpt-ui-multiselect) --# //
// #-----------------------------------------# //
};});}());
