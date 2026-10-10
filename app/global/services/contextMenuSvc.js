(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Service (contextMenuSvc) -----# //
	app.factory('contextMenuSvc', function ($q, contextMenuDataVal, routePermissionSvc, stringSvc, permissionSvc) {

		var _defer = $q.defer(),
			personalizedMenu = [];

		function processMenuData(data) {
			var menuData = [];
			data.forEach(function (item) {
				var obj,
					routeToBeChecked = item.URL.split('asp?')[0] + 'asp',
					permission = routePermissionSvc.checkRoute(routeToBeChecked),
					visible = routePermissionSvc.checkRouteVisible(item.URL);

				 if (permission && visible) {
					obj = {
                        group: item.Group,
                        text : getString(item.Text),
                        URL  : item.URL
					};

					menuData.push(obj);
				 }
			});
			return menuData;
		}

		function getString(mnemonic) {
			return stringSvc.getStrings([mnemonic])[mnemonic];
		}

		$q.all([stringSvc.ready, permissionSvc.ready]).then(function () {
			personalizedMenu = processMenuData(contextMenuDataVal);
			_defer.resolve(personalizedMenu);
		});

		return {
			ready: _defer.promise,
		};
	});
	// #--- END Service (contextMenuSvc) ---# //
	// #-----------------------------# //

}());
