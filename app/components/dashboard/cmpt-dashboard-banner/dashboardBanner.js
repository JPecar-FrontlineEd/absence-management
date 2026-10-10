(function() {'use strict';angular.module('aesop')
.directive('cmptDashboardBanner', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/dashboard/cmpt-dashboard-banner/dashboardBanner.html',

// #-------------------------------------------# //
// #---- Component (cmpt-dashboard-banner) ----# //
controller: function ($scope, stringSvc, userSvc) {

	// View Model properties
	var vm = $scope.vm = {
		canOptOutOfNewSite: false,
		dismissBanner: false
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'AdminHome.Welcome.Headline',
		'AdminHome.Welcome.IntroText',
		'AdminHome.Welcome.InstructionText',
		'AdminHome.Welcome.Button.Revert',
		'AdminHome.Welcome.Button.Continue',
		'Dismiss'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		hideBanner: function () {
			vm.dismissBanner = true;
		}
	};

	userSvc.ready.then(function(userData){
		vm.canOptOutOfNewSite = userData.canOptOutOfNewSite;
	});
}

// #-- END Component (cmpt-dashboard-banner) --# //
// #-------------------------------------------# //
};});}());