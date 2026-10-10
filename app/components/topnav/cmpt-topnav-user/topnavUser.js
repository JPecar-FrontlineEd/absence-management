(function() {'use strict';angular.module('aesop')
.directive('cmptTopnavUser', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/topnav/cmpt-topnav-user/topnavUser.html',

// #--------------------------------------# //
// #---- Component (cmpt-topnav-user) ----# //
controller: function ($scope, $location, stringSvc, userSvc, permissionSvc) {

	// View Model properties
	var vm = $scope.vm = {
		userFullName: '',
		userShownName: '',
		logOutShortcutKey: permissionSvc.iHave('PSEUDO.ISCAMPUSUSER') ? '':'(Alt + Q)'
	};

	userSvc.ready.then(function (user) {
		if (user && user.firstName) {
			vm.userFullName = user.firstName + ' ' + user.lastName;

			var firstLength = user.firstName.length;
			var lastLength = user.lastName.length;

			if (firstLength > 12 || firstLength + lastLength > 24 || lastLength > 12)
				vm.userShownName = 'Hi, ' + user.firstName;
			else
				vm.userShownName = user.firstName + ' ' + user.lastName;
		}
	});

	// Get mnemonics that this component needs
	stringSvc.ready.then(function () {
		$scope.strings = stringSvc.getStrings([
			'header.DropDown.option.MyProfile', 'Pin', 'Logout'
		]);
	});

	function setUserName() {
		var userData = userSvc.getUserData();
		if (userData && userData.firstName) {
			vm.userFullName = userData.firstName + ' ' + userData.lastName;

			var firstLength = userData.firstName.length;
			var lastLength = userData.lastName.length;

			if (firstLength > 12 || firstLength + lastLength > 24 || lastLength > 12)
				vm.userShownName = 'Hi, ' + userData.firstName;
			else
				vm.userShownName = userData.firstName + ' ' + userData.lastName;
		}
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		logout: function () {
			userSvc.logout();
		},
		profile: function() {
			$location.path('/user/profile');
		},
		pin: function() {
			$location.path('/user/pin');
		},
		resetName: function() {
			setUserName();
		}
	};

	$scope.$on('$destroy', $scope.$root.$on('update-user-data', go.resetName));
}

// #-- END Component (cmpt-topnav-user) --# //
// #--------------------------------------# //
};});}());