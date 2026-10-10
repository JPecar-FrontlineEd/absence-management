(function () {
	'use strict'; var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Service (menuSvc) -----# //
	app.factory('menuSvc', function ($q, menuDataVal, routePermissionSvc, stringSvc, permissionSvc, featureSvc, config) {

		var _defer = $q.defer(),
			personalizedMenu = [];

		$q.all([stringSvc.ready, permissionSvc.ready, featureSvc.ready]).then(function () {
			personalizedMenu = processMenuData(menuDataVal);

			// remove the dashboard item for org users
			if (!permissionSvc.iHave('PSEUDO.ISCAMPUSUSER')) {
				personalizedMenu = personalizedMenu.filter(function (mItem) {
					return mItem.route !== '/';
				});
			}

			_defer.resolve(personalizedMenu);
		});

		function getRoute(item, parentItem) {
			if ((parentItem && parentItem.prefix === "Master_Data-Substitute") && item.route) {
				if (item.route.includes("ec-employee")) {
					return item.route.replace("ec-employee", "fc-directory")
				}
				if (item.route.includes("absmgmt-employee")) {
					return item.route.replace("absmgmt-employee", "fc-directory")
				}
			}

			return item.route;
		}

		function processMenuData(data, parent) {
			var menuData = [];
			data.forEach(function (item) {
				const route = getRoute(item, parent);
				var obj,
					uniqueId = '',		// used to build out a unique string that reflects menu hierarchy (i.e. menu-item-master_data-worker-add)
					permission = route && routePermissionSvc.checkRoute(route),
					visible = route && routePermissionSvc.checkRouteVisible(route);

				if (permission && visible) {
					// parent will not be provided if on 1st level of menu hierarchy
					// combine the prefix and the mnemonic of the current item
					uniqueId = (parent ? parent.prefix + '-' : '') + generateUniqueId(item.title);

					obj = {
						title: getString(item.title),
						shortCutKey: permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') ? null : item.shortCutKey,
						icon: item.icon,
						route: item.route,
						routeMatchers: item.routeMatchers,
						id: 'menu-item-' + uniqueId.toLowerCase(),		// all menu item ids are lowercase for consistency
						useTitle: item.useTitle,
						prefix: uniqueId
					};

					if (item.target) {
						obj.target = item.target;
					}

					// Check if ReactGlobalSearchForOU feature flag is enabled for Global Search routes
					var reactGlobalSearchEnabled = featureSvc.get("ReactGlobalSearchForOU", false).enabled;
					var legacyGlobalSearchRoute = config.navigatorBaseUrl + '/search.asp?searchFor=&searchTypes=';
					var angularGlobalSearchRouteType2 = '/search/search?searchFor=&searchType=2';
					var angularGlobalSearchRouteType3 = '/search/search?searchFor=&searchType=3';
					if (reactGlobalSearchEnabled && (item.route === angularGlobalSearchRouteType2 || item.route === angularGlobalSearchRouteType3)) {
						// Use 'url' property for full page navigation to React app
						obj.route = item.route === angularGlobalSearchRouteType2 ?
							legacyGlobalSearchRoute + '2' :
							legacyGlobalSearchRoute + '3';
					}

					if (item.children && item.children.length) {
						// pass the parent (obj) into the recursive call so we have access to the "prefix" property
						// as we work our way down the nested levels of the menu hierarchy
						obj.children = processMenuData(item.children, obj);
					}

					if (obj.children && obj.children.length || !obj.children) {
						menuData.push(obj);
					}
				}
			});
			return menuData;
		}

		function getRouteObject(routeList, routeMatch) {
			for (var i = 0; i < routeList?.length; i++) {
				if (routeMatch === routeList[i].route) {
					return routeList[i];
				}
			}
		}

		function generateUniqueId(mnemonic) {
			return mnemonic.substring(mnemonic.lastIndexOf('.') + 1);
		}

		function getString(mnemonic) {
			return stringSvc.getStrings([mnemonic])[mnemonic];
		}

		return {
			ready: _defer.promise,

			findChildRoutes: function (section) {
				var currMenuObject = personalizedMenu;
				if (currMenuObject) {
					section.split('/').forEach(function (v, i, a) {
						if (v !== '') {
							currMenuObject = (currMenuObject?.children && currMenuObject?.children != null) 
							? getRouteObject(currMenuObject.children, currMenuObject.route + '/' + v) 
							: getRouteObject(currMenuObject, '/' + v);
						}
					});
					return (currMenuObject?.children && currMenuObject?.children != null) ? currMenuObject.children : null;
				}
			}
		};
	});
	// #--- END Service (menuSvc) ---# //
	// #-----------------------------# //

}());
