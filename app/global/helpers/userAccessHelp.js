(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Helper (userAccessHelp) -----# //
	app.factory('userAccessHelp', function (ngDialog) {

		return {
			showEmailDialog: function(user) {
		        var emailDialog = ngDialog.open({
		            templateUrl: '/components/user-access/cmpt-user-access-email-modal/userAccessEmailModal.html',
		            controller:'cmptUserAccessEmailModal',
		            closeByDocument: true,
		            closeByNavigation:true,
		            className: 'ngdialog-theme-default',
		            data: {
		                'user': user,
		                'dialog': emailDialog,
		            }
		        });
		    }
		};

	});
	// #--- END Helper (userAccessHelp) ---# //
	// #-----------------------------------# //

}());