(function () {
	'use strict';
	var app = angular.module('aesop');

	app.run(function ($rootScope, $q, $timeout, config, scrollHelp, domHelp, navUrlMappingSvc, permissionSvc, featureSvc) {

		$rootScope.navExpanded = true;
		$rootScope.preloader = {
			loaded: 0,
			total: 0,
			loading: true,
			style: {
				transform: 'translateX(-90%)'
			}
		};

		var sidekickEnabled = false;
		$rootScope.isVeritimeOnlyClass = null;

		$q.all([featureSvc.ready, permissionSvc.ready]).then(() => {
			let sidekickCampusEnabled = featureSvc.get("SidekickCampus").enabled;
			let sidekickNavigatorEnabled = featureSvc.get("SidekickNavigator").enabled;
			let isCampusUser = permissionSvc.iHave('PSEUDO.ISCAMPUSUSER');

			sidekickEnabled = (sidekickCampusEnabled && isCampusUser) || (sidekickNavigatorEnabled && !isCampusUser)

			if(sidekickEnabled) {
				sidekick.store.set('activity-indicator', {url: '/'});
			}

			$rootScope.isVeritimeOnlyClass = permissionSvc.iHave('PSEUDO.IsVeritimeOnly') ? 'fa-logo-absencedata' : 'fa fa-logo-aesop';
		});

		$rootScope.preloader.loading = false;

		$rootScope.homeUrl = '/';

		$rootScope.isVeritimeOnlyClass = null;

		// delay a bit because the default url for a nav user is added to the path
		// mapping on app start, so it's not immediately available.
		domHelp.rAF(function () {
			// check if the main root is valid for the current user
			if (!navUrlMappingSvc.isPathValidForUser('/')) {
				// reset the home url used for the aesop logo link
				$rootScope.homeUrl = config.navigatorPath + navUrlMappingSvc.pathAdminToNav('/');
			}
		});

		var loader = $rootScope.loader = {
			loading: true
		};

		$rootScope.env = {
			showPermissionTool: false,
			notProd: ['dev', 'qa'].indexOf(config.environment) !== -1
		};

		$rootScope.$on('$stateChangeStart', loading);
		$rootScope.$on('$viewContentLoaded', doneLoading);
		$rootScope.$on('$stateChangeError', doneLoading);
		$rootScope.$on('$stateChangeSuccess', scrollTop);

		function loading(e) {
			// check feature
			if(sidekickEnabled) {
				sidekick.events.emit('activity-indicator.visible', true);
			}
			else {
				loader.loading = true;
			}
		}

		function doneLoading() {
			if(sidekickEnabled) {
				sidekick.events.emit('activity-indicator.visible', false);
			}
			else{
				//Ultimately this is trying to be set too quickly (http://stackoverflow.com/questions/21512893/angular-js-show-hide-loading-gif-every-new-route)
				$timeout(function(){
		      		loader.loading = false;
			    }, 500);
			}
		}

		function scrollTop () {
			scrollHelp.scrollToTop();
		}
	});
}());
