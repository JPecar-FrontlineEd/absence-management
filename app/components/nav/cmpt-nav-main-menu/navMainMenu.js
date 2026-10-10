/* global ambient */
/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
(function() {'use strict';angular.module('aesop')
.directive('cmptNavMainMenu', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/nav/cmpt-nav-main-menu/navMainMenu.html',

// #----------------------------------------# //
// #---- Component (cmpt-nav-main-menu) ----# //
controller: function ($timeout, $scope, $state, $location, stringSvc, menuSvc, domHelp) {

	var navAutoCollapse = ambient.isActive('auto-collapse-nav');

	// View Model properties
	var vm = $scope.vm = {
			userPreferOpen: true,
			activeMenu: null,
			menuIntent: null,
			highlightedMenu: null,
			menuData: undefined,
			collapseBufferPx: 200,
			maxOpacity: 0.8,
			minOpacity: 0.10,
			currentBufferLeft: 0,
			todaysDate: new Date()
		},
		$root = $scope.$root,
		leftNav = $scope.leftNav = {
			mouseLocked: false,
			navActive: false,
		},
		pos = {x: 0, y: 0},
		lastDist = 0,
		unlockMenu,
		collapseBufferPx = 200,
		lastBufferXCoordinate = 0,
		currentBufferXCoordinate = 0,
		maxBufferOpacity = 0.8,
		minBufferOpacity = 0.25;

	// Actions that can be bound to from the view
	var go = $scope.go = {
		toggleExpand: function () {
			$root.navExpanded = !$root.navExpanded;
			if (navAutoCollapse) {
				leftNav.navActive = $root.navExpanded;
				if (!leftNav.navActive) { resetNavExpandState(); }
			} else {
				vm.userPreferOpen = $root.navExpanded;
			}
		},
		deactivateNav: function () {
			$scope.$broadcast('menu-close');
			leftNav.navActive = false;
			resetNavExpandState();
		},
		menuClick: function (menu, idx, evt) {
			//reset the opacity
			go.updateDimmerOpacity('');

			// if we don't have any children but we do have a route, go there
			if (menu.children === undefined && menu.route.length > 0) {
				$location.url(menu.route);
				leftNav.navActive = false;
			}
			// if we have children show the next level
			else if (menu.children && menu.children.length > 0) {
				leftNav.navActive = !leftNav.navActive;
				vm.activeMenu = vm.menuIntent = (leftNav.navActive) ? idx : null;
			}
			// if we aren't the nav icon this isn't the click we are looking for
			else if (evt.target.className.indexOf('nav-icon') === -1) {
				return;
			}

			//we must recalc the close buffer after angular rebinds the menu to the screen
			domHelp.rAF(function() {
				calcMenuTogglePanel(idx);
			});
		},
		closeMenu: function (){
			go.enableOpacityTransition();
			if (!leftNav.navActive && navAutoCollapse) {
				resetNavExpandState();
			}
		},
		changeActiveMenu: function (idx) {
			go.recalcCloseBufferZone(idx);
			if (leftNav.navActive) {
				vm.menuIntent = idx;
				if (!leftNav.mouseLocked) { vm.activeMenu = idx; }

				go.updateDimmerOpacity(maxBufferOpacity);

			}
		},
		clearActiveMenu: function () {
			go.changeActiveMenu(null);
			go.enableOpacityTransition();
		},
		setupTracking: function (x, y) { pos.x = x; pos.y = y; },
		trackMouse: function (evt) {
			var mPos = {x: evt.clientX, y: evt.clientY },
				d = {x: mPos.x - pos.x, y: mPos.y - pos.y },
				dist = Math.sqrt((d.x * d.x) + (d.y * d.y)),
				avgDist = (lastDist + dist) / 2;

			pos = mPos;
			lastDist = dist;

			leftNav.mouseLocked = (avgDist > 2);
			$root.safeDigest($scope);

			$timeout.cancel(unlockMenu);
			unlockMenu = $timeout(go.unlockMenu, 50);
		},
		unlockMenu: function () {
			leftNav.mouseLocked = false;
		},
		bufferedClose: function(){
			go.enableOpacityTransition();
			domHelp.rAF(function(){
			 resetNav();
			});
		},
		trackPosition: function(xCoor){
			lastBufferXCoordinate = currentBufferXCoordinate;
			currentBufferXCoordinate = xCoor - vm.currentBufferLeft;
		},
		calcBufferOpacity: function(){
			var step = 100 / collapseBufferPx,
			opacity = vm.bufferOpacity;

			if (currentBufferXCoordinate === lastBufferXCoordinate) { return; }

			opacity = (step * (collapseBufferPx - currentBufferXCoordinate)) / 100;
			if (opacity > maxBufferOpacity)	{
				opacity = maxBufferOpacity;
			} else if (opacity < minBufferOpacity){
				opacity = minBufferOpacity;
			}
			go.updateDimmerOpacity(opacity);
		},
		recalcCloseBufferZone:	function (activeMenuIdx){
			//we must recalc the close buffer after angular rebinds the menu to the screen
			domHelp.rAF(function(){
				 calcMenuTogglePanel(activeMenuIdx);
			});
 		},
		IsNavActive: function() {
			return leftNav.navActive;
		}
	};

	// pull in personalized menu
	menuSvc.ready.then(function (menu) {
		vm.menuData = menu;
		setHighlightedMenu();
	});

	function resetNavExpandState() {
		$root.navExpanded = (vm.userPreferOpen && !navAutoCollapse);
		vm.activeMenu = vm.menuIntent = null;

	}

	function autoExpandCollapse() {
		navAutoCollapse = ambient.isActive('auto-collapse-nav');
		$root.safeApply(resetNavExpandState);
	}

	function setHighlightedMenu() {
		var path = $location.path(),
			matchRoute = '';

		vm.highlightedMenu = null;
		if (!$state.includes('base.navigator') && $scope.$root.routeVerified) {
			vm.menuData.forEach(function (m, i) {
				// DE12439
				// ADMIN - Vertical Nav - "Absences" not purple if user on Create Substitute Absence
				// additionalRouteCheck method was added later because
				// highlighting the menu on the first level rely on the convention of
				// e.g
				// if the route is '/abs-mgt/absences/**whatever'
				// it match /absecnes with the route on the first level menu option and highlight the menu
				//
				// in case of Substitute absence we missed this convention and menu wasn't highlighting becasue
				// route is '/substitue-absence/**whatever'
				//
				// This addtional check is happy medium between doing an actual fix which is
				// moving all the files into absence folder and renaming all the routes also all the redirection
				// which is more risky
				// then some nasty hardcoded fix
				//
				// Dive into this function for more comments about how this is working.
				if (path.indexOf(m.route) === 0 || addtionalRouteCheck(path,m.route)) {
					if (matchRoute.length < m.route.length) {
						matchRoute = m.route;
						vm.highlightedMenu = i;
					}
				}
			});
		}
		$root.$emit('setHighlightedMenu');
	}


	function addtionalRouteCheck(path, route) {
		// function takes two parameters
		// path - e.g '/substitue-absence/create-substitute-absece'
		// route - e.g '/absence'

		// this regular expression will capture the string from route and ignore '/'
		// e.g. if route == '/absences' the capturing group will be 'absences'
		var routePatternRegex = /\/(.*)/;

		// This variable will going to hold the capturing group value.
		var match = routePatternRegex.exec(route)[1];

		// These next two line will going to dynamically generate the regular expression
		// e.g. if the match == 'absences' the regex will be /\/.*-absences/
		// which means it will going to match all the similar following string
		// -	/substitue-absence
		var pathExp = /\/.*-/;
		var pathPatternRegex = new RegExp(pathExp.source + match);

		// Finally we test the regular expression against the path and return boolean.
		return pathPatternRegex.test(path);
	}

	function resetNav() {
		vm.activeMenu = null;
		go.deactivateNav();
		menuSvc.ready.then(function () { setHighlightedMenu(); });
	}

	function calcMenuTogglePanel(idx) {
		var w = angular.element(document).width(),
			menuw = 0;

		angular.element('nav[class^="cmpt"],nav [class^="cmpt"]:visible').each(function() {
			menuw += angular.element(this).width();
		});

		var toggleMarkerWidth = (w - menuw) - collapseBufferPx;
		vm.closeBufferZone = toggleMarkerWidth;
		vm.currentBufferLeft = menuw;
	}

	$scope.$watch('leftNav.mouseLocked', function (locked) {
		if (!locked) {
			vm.activeMenu = vm.menuIntent;
		}
	});

	$scope.$on('$destroy', $root.$on('$stateChangeSuccess', resetNav));
	$scope.$watch(function(){ return $location.search(); }, resetNav);
	$scope.$on('subnav-open', function(evt){

		go.trackPosition();
		domHelp.rAF(function() {go.recalcCloseBufferZone(); });
	});

	ambient.on('enter', 'auto-collapse-nav', autoExpandCollapse);
	ambient.on('leave', 'auto-collapse-nav', autoExpandCollapse);
	resetNavExpandState();
},

link: function (scope, elem, attrs) {
	elem.on('mouseenter', function (evt) {
		scope.go.setupTracking(evt.clientX, evt.clientY);
		elem.on('mousemove', scope.go.trackMouse);
	});
	elem.on('mouseleave', function (evt) {
		elem.off('mousemove', scope.go.trackMouse);
	});

	var dimmer = elem[0].getElementsByClassName('content-dimmer')[0];

	scope.go.updateDimmerOpacity = function(amount){
		// console.log('setting opacity: ' + amount);
		dimmer.style.opacity = amount;
	};

	scope.go.enableOpacityTransition= function(){
		angular.element(dimmer).removeClass('dim-transition-disable');
		angular.element(dimmer).css('opacity','');
	};
	scope.go.disableOpacityTransition= function(){
		angular.element(dimmer).addClass('dim-transition-disable');
	};
}

// #-- END Component (cmpt-nav-main-menu) --# //
// #----------------------------------------# //
};});}());
