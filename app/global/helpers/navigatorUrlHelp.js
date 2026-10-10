(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------------# //
	// #----- Helper (navigatorUrlHelp) -----# //
	app.factory('navigatorUrlHelp', function () {

		//Special handling/override of redirect behavior from token url
		function getTokenRedirectUrl(redirect) {
			//Force to root report writer list based on return .asp file
            if (/reportselection\.asp/i.test(redirect)) {
                return '/abs-mgt/reports/report-writer/';
            }

			//All URLs that need to have /navigator prepended if missing so our navToAdmin mappings will work
			//for both Organization Users and Campus Users
			if (/mvc.aspx\/dataimport/i.test(redirect) || /te_feedback\.asp/i.test(redirect) || /sub_feedback\.asp/i.test(redirect)
				|| (/reportConfigSummary\.asp/i.test(redirect) && !/reports\/report-writer/i.test(redirect))
				|| (/reportExecutionDetails\.asp/i.test(redirect) && !/reports\/report-writer/i.test(redirect))) {
				if (redirect.toLowerCase().indexOf('/navigator') !== 0) { //doesn't start with /navigator
					redirect = '/navigator' + redirect;
				}
				return redirect;
			}

			//Provide direct redirection to the new User Access page for IDM from the ASP site
			if (/admin_UserAccess\.asp/i.test(redirect)) {
				return '/security/user-access';
			}

			if(/navigator\/impersonate.asp/.test(redirect)){
				return '/abs-mgt/impersonate';
			}

			if(/navigator\/(profile|pin).asp/i.test(redirect)){
				var route = /navigator\/(profile|pin).asp/i.exec(redirect);
				return `/abs-mgt/user/${route[1]}`;
			}


			//Leave ASP urls untouched so that Angular can handle the mapping from ASP version to Angular version
			if (/\.asp/i.test(redirect) && !/reports\/report-writer/i.test(redirect) && !/default\.asp/i.test(redirect)) {
				return redirect;
			}

			//Remove .asp portion of route (artifact of redirect from classic site)
			return redirect.replace(/(.+)(\/.+\.aspx?)/i, '$1');
		}

		return {
			getTokenRedirectUrl: getTokenRedirectUrl
		};

	});
	// #--- END Helper (navigatorUrlHelp) ---# //
	// #-------------------------------------# //

}());
