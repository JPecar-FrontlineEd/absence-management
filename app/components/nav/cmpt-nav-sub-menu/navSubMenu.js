(function() {'use strict';angular.module('aesop')
.directive('cmptNavSubMenu', function ($compile) {return {

// directive options
restrict: 'E',
scope: {
	menuItems: '=',
	level: '@'
},
replace: true,
templateUrl: '/components/nav/cmpt-nav-sub-menu/navSubMenu.html',

// #---------------------------------------# //
// #---- Component (cmpt-nav-sub-menu) ----# //
controller: function ($scope, $location, $state, domHelp) {
	var maxCols = 3,
		columns = 1,
		columnWidth = 240,
		menuColumnHeightMap = {};

	$scope.level = $scope.level == null ? 1 : parseInt($scope.level, 10);

	// View Model properties
	var vm = $scope.vm = {
		activeMenu: null,
		menuIntent: null,
		highlightedMenu: null,
		menuItems: angular.copy($scope.menuItems),
		menuWidth: 240,
		menuItemWidth: '100%'
	};
	vm.isMega = shouldWeMega();
	var leftNav = $scope.leftNav = $scope.$root.findInParentScope('leftNav', $scope);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		navigate: function (menu, idx) {
			if (menu.route && !(menu.children && menu.children.length)) {
				if(menu.route.indexOf('http') === 0){
					window.open(menu.route,'_blank');
				}else{
					$location.url(menu.route);
				}

			} else {
				if (vm.activeMenu !== idx) { vm.activeMenu = idx; }
			}
			//console.log('navigating subnav: ' + idx);
		},
		setActiveMenu: function (idx) {
			vm.menuIntent = idx;
			if (!leftNav.mouseLocked) { 
				vm.activeMenu = idx;
			}
			$scope.$emit('subnav-open');
		} 
	};

	function countNodes(nodeList) {
		var count = 0;

		if (angular.isArray(nodeList) && nodeList.length) {
			count += nodeList.length;
			nodeList.forEach(function (node) {
				count += countNodes(node.children);
			});
		}

		return count;
	}

	function getDeepestLevel(nodeList) {
		var level = 0;
		if (angular.isArray(nodeList) && nodeList.length) {
			level = 1;
			level += nodeList.reduce(function (prev, cur) {
				var lvl = getDeepestLevel(cur.children);
				return prev > lvl ? prev : lvl;
			}, 0);
		}
		return level;
	}

	function shouldWeMega() {
		var totalNodes = countNodes(vm.menuItems),
			deepestLevel = getDeepestLevel(vm.menuItems),
			// criteria for mega menu
			weShouldMega = deepestLevel === 2 && totalNodes <= 30;

		// if we go MEGA, prep the data
		if (weShouldMega) {
			setupMegaMenuData();
			calcColumnHeights();
			adjustColumns(null, null, ambient.getPluginValue('height'));
		}

		return weShouldMega;
	}

	function setupMegaMenuData() {
		var i = vm.menuItems.length,
			menu, otherMenu;

		for (; i-- ;) {
			menu = vm.menuItems[i];
			if (!angular.isArray(menu.children) || !menu.children.length) {
				if (otherMenu == null) {
					otherMenu = {
						title: 'Other',
						children: []
					};
					vm.menuItems.push(otherMenu);
				}
				otherMenu.children.push(vm.menuItems.splice(i, 1)[0]);
			}
		}
	}

	function calcColumnHeights() {
		menuColumnHeightMap = menuColumnHeightMap || {};

		var baseSize = 100,
			groupHeight = 50,
			rowHeight = 38,
			colCount = 1;

		for (; colCount <= maxCols; colCount += 1) {
			menuColumnHeightMap[colCount] = vm.menuItems.reduce(reduceCalcMenuHeight, baseSize);
		}

		// menu height for column count setting
		function reduceCalcMenuHeight (height, menu) {
			// each group takes up 50px of vertical space
			height += groupHeight;
			// add the number of rows pixels
			return height + (Math.ceil(menu.children.length / colCount) * rowHeight);
		}

	}

	function getHighlightedIndex(menu) {
		var path = $location.path(),
			matchRoute = '',
			highlightedIndex = null;

		menu.forEach(function (m, i) {
			var routeMatcherSuccess = (
					m.routeMatchers != null &&
					m.routeMatchers.length > 0 &&
					m.routeMatchers.some(function (r) {
						return r.test && r.test(path); })
				);

			if (path.indexOf(m.route) === 0 || routeMatcherSuccess) {
				if (matchRoute.length < m.route.length) {
					matchRoute = m.route;
					highlightedIndex = i;
				}
			}
		});

		return highlightedIndex;
	}

	function setHighlightedMenu() {
		vm.highlightedMenu = null;
		if (!$state.includes('base.navigator') && $scope.$root.routeVerified) {
			if (vm.isMega) {
				vm.menuItems.forEach(function (menu, groupIdx) {
					var idx = getHighlightedIndex(menu.children);
					if (idx != null) {
						vm.highlightedMenu = (groupIdx * 100) + idx;
					}
				});
			} else {
				vm.highlightedMenu = getHighlightedIndex(vm.menuItems);
			}
		}
	}

	function adjustColumns(act, cls, val) {
		var height = (typeof val === 'number') ? val : val.height,
			i = maxCols - 1,
			prevCol = columns;

		columns = maxCols;
		for (; i ; i--) {
			if (menuColumnHeightMap[i] <= height) {
				columns = i;
			}
		}

		// if the number of columns changed, then set the menu
		// width and trigger a digest
		if (columns !== prevCol) {
			vm.menuItemWidth = (100 / columns) + '%';
			vm.menuWidth = columns * columnWidth;

			// don't do a digest if we are instantiating the first time
			if (act != null) { $scope.$root.safeDigest($scope); }
		}
	}

	if (vm.isMega) {
		ambient.on('update', 'adjust-menu-columns', adjustColumns);
		$scope.$on('$destroy', function () {
			ambient.off('update', 'adjust-menu-columns', adjustColumns);
		});
	} else {
		$scope.$watch('leftNav.mouseLocked', function (locked) {
			if (!locked) { vm.activeMenu = vm.menuIntent; }
		});
	} 
	
	// watch for when the main menu closes and close out any children
	$scope.$watch('leftNav.navActive', function () {
		vm.activeMenu = null;
	});
	
	$scope.$on('$destroy', $scope.$root.$on('setHighlightedMenu', setHighlightedMenu));
	
	setHighlightedMenu();
},
compile: function(tElement, tAttr, transclude) {
	var contents = tElement.contents().remove();
	var compiledContents;
	return function(scope, elem, attrs) {
		if (compiledContents == null) { compiledContents = $compile(contents); }
		if (scope.menuItems != null && scope.menuItems.length > 0) {
			compiledContents(scope, function(clone, scope) {
				elem.append(clone);
			});
		}
	};
}

// #-- END Component (cmpt-nav-sub-menu) --# //
// #---------------------------------------# //
};});}());