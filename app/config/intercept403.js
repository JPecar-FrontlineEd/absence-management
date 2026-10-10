(function () {'use strict'; var app = angular.module('aesop');

	var routeAllowed = true;

	app.factory('403Interceptor', function () {

		function checkFor403(req) {
			var isRoutePartial = /^\/routes\//i;
			if (req.method === 'GET' && isRoutePartial.test(req.url) && !routeAllowed) {
				req.url = '/routes/403.html';
			}
			return req;
		}

		return {
			request: checkFor403
		};
	});

	app.run(function ($rootScope, routePermissionSvc,$state, permissionSvc, $location) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams){
			var path = $state.href(toState, toParams).replace(/%252F/gi, '/');
			if($location.$$hash == 'AbsenceFiles'){
				path = path +'#AbsenceFiles';
			}
			if (permissionSvc.ready.$$state.status === 0) {
				permissionSvc.ready.then(function(){
					routeAllowed = routePermissionSvc.checkRoute(path);
				});
			} else {
				routeAllowed = routePermissionSvc.checkRoute(path);
			}			
		});
	});

}());