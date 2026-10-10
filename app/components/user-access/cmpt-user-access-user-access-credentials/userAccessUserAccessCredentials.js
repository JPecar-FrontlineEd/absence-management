(function() {'use strict';angular.module('aesop')
.directive('cmptUserAccessUserAccessCredentials', function () {return {

// directive options
restrict: 'E',
scope: {
	user: '='
},
replace: true,
templateUrl: '/components/user-access/cmpt-user-access-user-access-credentials/userAccessUserAccessCredentials.html',

// #--------------------------------------------------------------# //
// #---- Component (cmpt-user-access-user-access-credentials) ----# //
controller: function ($scope, stringSvc, userAccessApi) {
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'UserAccess.ViewCredentials',
		'UserAccess.UserCredentials',
		'UserAccess.Username',
		'Loading',
		'Error',
		'Email'
	]);

	// View Model properties
	var vm = $scope.vm = {
		credentialsHtml: '',
		user: $scope.user,
		loading: false
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		getCredentials
	};

	function getCredentials() {
		if (!vm.user.credentials) { //get the credentials if we didn't already.
			vm.credentialsHtml = getLoadingHtml();

			if (!vm.loading) {
				vm.loading = true;
				userAccessApi.getUserCredentials({id : vm.user.status.userKey}).then(function success(data) {
					vm.loading = false;
					vm.user.credentials = data;
					vm.credentialsHtml = getCredentialsHtml();
				}, function failure(data) {
					vm.loading = false;
					vm.user.credentials = null;
					vm.credentialsHtml = '<span>' + strings['Error'] + '</span>';
				});
			}
		} else { //we already have this info. make sure the HTML is right.
			vm.credentialsHtml = getCredentialsHtml();
		}
	}

	function getLoadingHtml() {
		return '<div class="qtipCredentials"><cmpt-ui-loader is-loading="true"></cmpt-ui-loader></div>'
	}

	function getCredentialsHtml() {
		var result = '<div class="qtipCredentials">';
		result += '<div class="qtip-label">' + strings['UserAccess.UserCredentials'].toUpperCase() + '</div>';
		result += '<div class="row"><span class="label">' + strings['UserAccess.Username'] + ':</span> <span class="field username">{{vm.user.credentials.username}}</span></div>';
		result += '<div class="row"><span class="label">' + strings['Email'] + ':</span> <span class="field email">{{vm.user.credentials.email}}</span></div>';
		return result;
	}
}

// #-- END Component (cmpt-user-access-user-access-credentials) --# //
// #--------------------------------------------------------------# //
};});}());