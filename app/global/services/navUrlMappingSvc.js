(function () {
	'use strict'; var app = angular.module('aesop');

	// #--------------------------------------# //
	// #----- Service (navUrlMappingSvc) -----# //
	app.factory('navUrlMappingSvc', function ($location, stringHelp, navUrlProviderSvc, config, domHelp, userSvc, storageSvc) {

		var lastPathChecked = '',
			myUserType = 0,
			navUrlMappingVal = [];

		userSvc.ready.then(function (user) {
			myUserType = user.UserType;
		});

		navUrlProviderSvc.ready.then(() => {
			navUrlMappingVal = navUrlProviderSvc.getMappings();
		});


		// ======== API FUNCTIONS ======== //

		function pathNavToAdmin(navPath) {
			var map = pathMap(navPath, 'navToAdmin');
			return map && map.path || null;
		}

		function pathAdminToNav(adminPath) {
			var map = pathMap(adminPath, 'adminToNav');
			return map && map.path || null;
		}

		function verifyCurrentPath(path) {
			if (path == null) { path = $location.path() + window.location.search; }

			// if the last path checked is the same as this one, bail out
			// this will prevent multiple checks from executing
			if (lastPathChecked === path) { return null; }
			lastPathChecked = path;

			var isNavUrl = path.indexOf(config.navigatorPath) === 0,
				m;

			if (isNavUrl) { path = path.replace(config.navigatorPath, ''); }

			if (isNavUrl) {
				m = pathMap(path, 'navToAdmin');
				if (m != null && m.mapping.autoRedirectFor.indexOf(myUserType) !== -1) {
					/**
					 * Handled by the react shell, this isn't needed anymore
					 */
					//autoRedirect(m.path);

					return false; // the path is not correct
				}
			} else {
				m = pathMap(path, 'adminToNav');
				if (m != null && m.mapping.autoRedirectFor.indexOf(myUserType) !== -1) {
					/**
					 * Handled by the react shell, this isn't needed anymore
					 */
					//autoRedirect(config.navigatorPath + m.path);

					return false; // the path is not correct
				}
			}

			return true; // the path is correct
		}

		function isPathValidForUser(path) {
			var m = getMapping(path);
			return !(m != null && m.mapping.autoRedirectFor.indexOf(myUserType) !== -1);
		}

		function getMapping(path) {
			if (path == null) {
				path = $location.path() + window.location.search;
			}

			var isNavUrl = path.indexOf(config.navigatorPath) === 0,
				m;

			if (isNavUrl) {
				path = path.replace(config.navigatorPath, '');
			}

			return pathMap(path, isNavUrl ? 'navToAdmin' : 'adminToNav');
		}

		// ======== HELPER FUNCTIONS ======== //

		function autoRedirect(path) {
			var search = path.split('?')[1] || '';

			path = path.split('?')[0];

			domHelp.rAF(function () {
				$location.path(path).search(search).replace();
			});
		}

		function translateRoute(route, params) {
			return Object.keys(params).reduce(function (route, key) {
				return stringHelp.replaceAll(route, '{' + key + '}', params[key]);
			}, route);
		}

		function queryMatches(queryString, queryMatchers) {
			if (queryMatchers == null) { return true; }
			return Object.keys(queryMatchers).every(function (key) {
				return queryMatchers[key].test(queryString);
			});
		}

		function pathMap(path, type) {
			var i = navUrlMappingVal.length,
				queryString = path.split('?')[1] || '',
				matches = [],
				mapping;

			path = path.split('?')[0];
			var lowerCaseString = queryString.toLowerCase();
			if (lowerCaseString.includes('dailyreport')) {
				if (queryString.includes('startDate')) {
					var startDate = decodeURIComponent(queryString).split('&')[1];
					storageSvc.save({
						key: 'startDate',
						data: startDate.split('=')[1],
						persistent: false
					});
				}
				queryString = queryString.split('&')[0];
			}

			for (; i--;) {
				mapping = navUrlMappingVal[i][type];
				if (mapping.match.path.test(path) && queryMatches(queryString, mapping.match.query)) {
					matches.push(executeMapping(mapping, path, queryString));
				}
			}

			if (matches.length === 0) { return null; }
			matches.sort(function (a, b) {
				return b.specificity - a.specificity;
			});
			return matches[0];
		}

		function executeMapping(mapping, path, queryString) {
			var params = {};
			params = path
				.match(mapping.match.path)
				.reduce(function (params, match, i) {
					params[i] = match; return params;
				}, params);

			if (mapping.match.query) {
				params = Object.keys(mapping.match.query)
					.reduce(function (params, key) {
						params[key] = queryString.match(mapping.match.query[key])[1] || '';
						return params;
					}, params);
			}
			return {
				path: translateRoute(mapping.route, params),
				mapping: mapping,
				specificity: Object.keys(params).length
			};
		}

		return {
			verifyCurrentPath: verifyCurrentPath,
			pathAdminToNav: pathAdminToNav,
			pathNavToAdmin: pathNavToAdmin,
			isPathValidForUser: isPathValidForUser,
			getMapping: getMapping,
			resetNavUrlMappingVal: function () { navUrlMappingVal = navUrlProviderSvc.getMappings(); }
		};

	});
	app.run(function (navUrlMappingSvc) { window.navMap = navUrlMappingSvc; });

	// #--- END Service (navUrlMappingSvc) ---# //
	// #--------------------------------------# //

}());
