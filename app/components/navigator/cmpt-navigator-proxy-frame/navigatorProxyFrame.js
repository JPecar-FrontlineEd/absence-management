(function() {'use strict';angular.module('aesop')
.directive('cmptNavigatorProxyFrame', function ($rootScope, navigatorProxyHelp) {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/navigator/cmpt-navigator-proxy-frame/navigatorProxyFrame.html',

// #------------------------------------------------# //
// #---- Component (cmpt-navigator-proxy-frame) ----# //
controller: function ($scope, $stateParams, $location, $state, $sce, tokenSvc, navUrlMappingSvc, config, domHelp, userSvc, featureSvc) {

	var navPath = config.navigatorPath, // the angular path that is used to access the navigator site (/navigator)
		baseDomain = '//' + config.platformSubDomain + config.topLevelDomain, // the base path for the navigator site
		baseUrl = baseDomain + navPath, //navigatorurl.com/navigator
		nonNavPaths = ['mvc.aspx/','reportwriter/'], // list of files that are not children of the /navigator path
		defaultPath = '/' + userSvc.getUserData().defaultPage; // if no path is defined, use the user default

	// View Model properties
	var vm = $scope.vm = {
		frameIsLoading: true,
		firstLoadComplete: false,
		src: null,
		lostFrameControl: false
	};


	$scope.$watch('vm.frameIsLoading', function(val){
		$rootScope.$root.loader.loading = val;
	});

	// Actions that can be bound to from the view
	var go = $scope.go = {
		// when the navigator iframe changes location, we need to update the
		// main location in the browser.
		handleFramePathChange: function (path) {
			var nonNavPath = getNonNavPath(path),
				navigatorInUrl = nonNavPath === '',
				currentPath = '/' + $stateParams.navigatorPath + getSearchString(),
				pathSplit;

			if (navigatorInUrl) {
				path = path.substr(path.indexOf(navPath) + navPath.length);
			} else {
				path = path.substr(path.indexOf(nonNavPath) - 1);
			}

			if (!pathsMatch(path, currentPath)) {
				if (window.history.replaceState != null) {
					window.history.replaceState({fromNavigator: true}, '', 'navigator' + path);
				} else {
					pathSplit = path.split('?');
					$location.path(navPath + pathSplit[0]).search(pathSplit[1] || '').replace();
				}

				$rootScope.setTitle('Navigator');
				// verifyCurrentPath will return false if the current path is not correct
				// and true if it is. if the path is correct, we are done loading so we can
				// use the inverse of the path being valid to set the "frameIsLoading" value
				vm.frameIsLoading = navUrlMappingSvc.verifyCurrentPath(navPath + path) === false;
			} else {
				// if the paths are the same, then we are not loading
				vm.frameIsLoading = false;
			}
		}
	};

	// called when the main application's location changes. we will need to take that path
	// and use it to determine where we redirect the iFrame to.
	function handleLocationChange() {
		var path = $location.path().replace(navPath, ''),
			nonNavPath = getNonNavPath(path),
			navigatorInUrl = nonNavPath === '',
			iframeLocation, iFrameNewPath;

		// let's assume for now that we are able to control the frame
		vm.lostFrameControl = false;

		try {
			// attempt to access pathname which will throw an
			// error if we don't have writes to the frame content
			iframeLocation = $scope.$iframe[0].contentWindow.location;
			if (iframeLocation.pathname) {}
		} catch(err) {
			iframeLocation = {pathname: '', search: ''};
		}

		if (path.charAt(0) === '/') { path = path.substr(1); }

		// set the title to navigator if we are at a navigator path
		if ($rootScope && path !== location.pathname) { $rootScope.setTitle('Navigator'); }

		// update the iframe location if it is out of sync
		if (!pathsMatch($location.url(), iframeLocation.pathname + iframeLocation.search)) {
			iFrameNewPath = baseDomain + $state.href('base.navigator.path', { navigatorPath: path }).replace(/%252F/g, '/') + getSearchString();
			if (!navigatorInUrl) {
				iFrameNewPath = iFrameNewPath.replace(navPath, '');
			}
			if (iframeLocation.replace && !featureSvc.get("SidekickNavigator").enabled) {
				iframeLocation.replace(iFrameNewPath);
			} else {
				$scope.$iframe[0].src = iFrameNewPath;
				vm.frameIsLoading = true;
			}
		}
	}

	function getNonNavPath(path){
		for(var x=0; x<nonNavPaths.length; x++){
			if(path.indexOf(nonNavPaths[x]) !== -1){
				return nonNavPaths[x];
			}
		}

		return '';
	}

	// compare 2 paths without worrying about urlescaped
	// characters matching perfectly
	function pathsMatch(path1, path2) {
		var p1 = window.unescape(path1),
			p2 = window.unescape(path2);

		if (p1 !== path1 || p2 !== path2) {
			return pathsMatch(p1, p2);
		} else {
			return p1 === p2;
		}
	}

	function getSearchString(includeQuestionMark) {
		var search = $location.search(),
			// default to including the ? at the beginning
			q = includeQuestionMark !== false ? '?' : '';

		return Object.keys(search).reduce(function (queryString, k, i, a) {
			return queryString + (queryString.length ? '&' : q) + k + '=' + window.escape(search[k]);
		}, '');
	}

	(function () {
		var search = getSearchString(),
			nonNavPath = getNonNavPath(baseUrl + '/' + $stateParams.navigatorPath + search),
			navigatorInUrl = nonNavPath === '',
			src = (navigatorInUrl ? baseUrl : baseDomain) + '/' + $stateParams.navigatorPath + search;

		$rootScope.setTitle('Navigator');

		if (!featureSvc.get("SidekickNavigator").enabled) {
			if ($stateParams.navigatorPath != null) {
				vm.src = $sce.trustAsResourceUrl(src);
			} else {
				vm.src = $sce.trustAsResourceUrl(baseUrl + defaultPath);
			}
		}

		// if we loose frame control, kick the user
		$scope.$watch('vm.lostFrameControl', function (kickMe) {
			if (kickMe) { tokenSvc.clear(); }
		});

		// handle when the query string changes but the path does not
		$scope.$watch(function(){ return $location.search(); }, function () {
			if (vm.firstLoadComplete) { domHelp.rAF(handleLocationChange); }
		});

		// handle path changes
		$scope.$on('$destroy', $rootScope.$on('$stateChangeSuccess', handleLocationChange));

		angular.element(document).bind('keydown', proxyKeys);
		$scope.$on('$destroy', function () {
			angular.element(document).unbind('keydown', proxyKeys);
		});

		function proxyKeys(e) {
			var iframe = $scope.$iframe[0],
				cDoc = iframe.contentDocument,
				body = cDoc.body,
				cWin = iframe.contentWindow,
				nav$ = cWin.jQuery,
				evt = nav$.Event('keydown'),
				iFrameLoc = cWin.location.href;

			// creating the data for the event from the original KeyboardEvent
			evt.keyCode = e.originalEvent.keyCode;
			evt.which = e.originalEvent.which;
			evt.altKey = e.originalEvent.altKey;
			evt.shiftKey = e.originalEvent.shiftKey;
			evt.ctrlKey = e.originalEvent.ctrlKey;
			evt.metaKey = e.originalEvent.metaKey;
			evt.view = e.originalEvent.view;

			// this is really hacky, but it works!
			// modifying the global variable "correctPath" which is used to prefix the
			// url for navigation. This fixes a strange issue where document.location = "something.html"
			// is executed at the scope of the main document instead of the iframe.
			// I can't wait for all of this to go away.
			cWin.correctPath = iFrameLoc.substr(0, iFrameLoc.lastIndexOf('/') + 1);

			// trigger the new keyboard event on the iframe's document body
			nav$(body).triggerHandler(evt);
		}
	}());
},

link: function (scope, elem, attrs) {
	var $f = elem.find('iframe'),
		f = $f[0];
	if(typeof($f) === 'undefined'){
		return;
	}

	scope.$iframe = $f;

	f.onload = function () {
		setTimeout(function () {
			// prevent double load event triggering that happens on initial load
			if (!scope.vm.firstLoadComplete) { scope.vm.firstLoadComplete = true; }

			// try to access the iframe and grab references to the various parts of its DOM
			var cDoc, cWin, docEl, fBody;
			try {
				cDoc = f.contentDocument;
				cWin = f.contentWindow;
				docEl = cDoc.documentElement;
				fBody = cDoc.body;
			} catch (err) {
				$rootScope.safeApply(function () { scope.vm.lostFrameControl = true; });
				return;
			}

			navigatorProxyHelp.modifyNavigatorMarkup(cDoc, cWin, docEl, fBody);

			// set iFrame height
			setTimeout(function () { f.style.height = getFrameHeight(); }, 0);

			// handle the path change and turn the loader off
			$rootScope.safeApply(function () {
				scope.go.handleFramePathChange(cDoc.location.href);
			});

			// setup a watcher for when the frame url
			// changes and turn loading back on
			cWin.onbeforeunload = function (e) {
				$rootScope.safeApply(function () {
					scope.vm.frameIsLoading = true;
				});
			};
			cWin.onclick = function (e) {
				$rootScope.$emit('close-menu');

				//recalculate the iFrame height on every click
				//allows us to handle situations where the content hides and shows elements that affect height
				setTimeout(function() {
					f.style.height = getFrameHeight();
				}, 100);
			};
			cWin.$('body a.ctx').mousedown(function (e){
				// Resetting the height back to original state
				f.style.height = getFrameHeight();
				if(e.button === 2){ // checking if the user is right clikcing the mouse
					var elementY = e.pageY, // Getting the 'Y' location of the element clicked
						windowHeight = e.view.window.innerHeight, // getting the height of the window at that time
						ctxType = $(this).attr('ctxtype'),
						ele = cWin.$('body #o' + ctxType + 'CtxMenu')[0],
						elementHeight = $(ele).outerHeight();

					if((elementY + elementHeight) > windowHeight){
						f.style.height = (elementY + elementHeight) + 'px';
					}else{
						f.style.height = getFrameHeight();
					}

				}
			});


			function getFrameHeight() {
				return getHeight() + 'px';
			}

			function getHeight() {
				var heightValues = [fBody.clientHeight];
				Array.prototype.slice.call(docEl.getElementsByClassName('WidgetWebControl'))
					.forEach(function (el, i, a) {
						heightValues.push(el.offsetHeight + el.offsetTop);
					});
				return (Math.max.apply(null, heightValues) + 50);
			}

		}, 100);
	};
}

// #-- END Component (cmpt-navigator-proxy-frame) --# //
// #------------------------------------------------# //
};});}());
