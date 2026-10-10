(function() {'use strict';angular.module('aesop')
.directive('cmptTopnavNotifications', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/topnav/cmpt-topnav-notifications/topnavNotifications.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-topnav-notifications) ----# //
controller: function ($scope, $state, $location, stringSvc, userSvc, notificationsSvc) {

	// View Model properties
	var vm = $scope.vm = {
		count: 0,
		showCount: false,
		notificationsObj: notificationsSvc.stateObj
	};

	// Get mnemonics that this component needs
	stringSvc.ready.then(function () {
		$scope.strings = stringSvc.getStrings([
		'Navigation.Top.MenuItem.Alerts'
		]);
	});

	//only show the notification count and link when the user is logged in
	userSvc.ready.then(function(){
		vm.showCount = true;
	});

	// Actions that can be bound to from the view
	var go = $scope.go = {
		notifications: function () {
			$state.go('base.notifications');
		}
	};

	//Keep the count of notifications in sync
	$scope.$watch('vm.notificationsObj.count', function (cnt) {
		vm.count = cnt;
    });
}

// #-- END Component (cmpt-topnav-notifications) --# //
// #-----------------------------------------------# //
};});}());