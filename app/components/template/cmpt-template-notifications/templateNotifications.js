(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateNotifications', function () {return {

// directive options
restrict: 'E',
scope: {
	showFullList: '=',
	refresh: '=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-notifications/templateNotifications.html',

// #-------------------------------------------------# //
// #---- Component (cmpt-template-notifications) ----# //
controller: function ($scope, stringSvc, notificationsSvc, institutionSvc, toastHelp) {

	$scope.refresh = ($scope.refresh == null) ? false : $scope.refresh;

	// View Model properties
	var vm = $scope.vm = {
		isLoading: false,
		notifications: []
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'SchoolSettings.text.Active'
	]);

	//get the notifications
	vm.isLoading = true;
	if ($scope.refresh) {
		notificationsSvc.refresh().then(function(data){
			processData(data);
			vm.isLoading = false;
		},function(reasons){
			toastHelp.error(reasons.$messages, 'Error');
			vm.isLoading = false;
		});
	} else {
		processData(notificationsSvc.getNotifications());
		vm.isLoading = false;
	}	
	

	function processData(notifications){
		vm.notifications = notifications.map(function (n){
			n.instName = institutionSvc.oneById(n.instId).name;
			return n;
		});
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-template-notifications) --# //
// #-------------------------------------------------# //
};});}());