(function() {'use strict';angular.module('aesop')
.directive('cmptUserAccessUser', function () {return {

// directive options
restrict: 'E',
scope: {
	user: '='
},
replace: true,
templateUrl: '/components/user-access/cmpt-user-access-user/userAccessUser.html',

// #-------------------------------------------# //
// #---- Component (cmpt-user-access-user) ----# //
controller: function ($scope, stringSvc, stringHelp, userAccessHelp, config, tokenSvc) {

	(function init() {
		$scope.user.url = getUrl($scope.user);
	})(); //immediately call

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Email',
		'Edit'
	]);

	// View Model properties
	var vm = $scope.vm = {
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		getEmailQtip: getEmailQtip,
		showEmailDialog: userAccessHelp.showEmailDialog
	};

	function getUrl(row) {
		switch (row.userTypeId)
		{
			case 2:
				return config.navigatorBaseUrl + "/te_general.asp?work_id=" + row.userId + "&token=" + tokenSvc.get();
			case 3: 
				return config.navigatorBaseUrl + "/sub_general.asp?sub_id=" + row.userId + "&token=" + tokenSvc.get();
			case 4: 
			case 5:
				return config.navigatorBaseUrl + "/ou_general.asp?ou_type=" + row.userTypeId + "&ou_id=" + row.userId + "&token=" + tokenSvc.get();
		}

		return "Invalid_Link_To_" + row.userTypeId + "_" + row.userId;
	}

	function getEmailQtip(row) {
		if (!row.email) return "";

		var result = "<div class='qtipEmail'>";
		result += "<div class='label'>" + strings['Email'].toUpperCase() + "</div>";
		result += "<div><span class='email'>" + row.email + "</span>";
		result += "<span class='actions'>" + "<a ng-if='user.hasPermissionToEdit' href='' ng-click='go.showEmailDialog(user)'>" + strings['Edit'] + "</a>" + "</span></div>";
		result += "</div>";
		row.emailQtip = result;
	}
}

// #-- END Component (cmpt-user-access-user) --# //
// #-------------------------------------------# //
};});}());