(function() {'use strict';angular.module('aesop')
.directive('cmptUserAccessAccessStatus', function () {return {

// directive options
restrict: 'E',
scope: {
	row: '=',
},
replace: true,
templateUrl: '/components/user-access/cmpt-user-access-access-status/userAccessAccessStatus.html',

// #----------------------------------------------------# //
// #---- Component (cmpt-user-access-access-status) ----# //
controller: function ($scope, $q, stringSvc, userInviteApi, userRevokeApi, userAccessApi, toastHelp, dateHelp, userAccessHelp, userAccessSvc, ngDialog) {
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'UserAccess.Status.NoEmailAddress',
		'UserAccess.Status.NotLoggedIn',
		'UserAccess.Status.NoAccess',
		'UserAccess.Status.AccessGranted',
		'UserAccess.Action.SetEmail',
		'UserAccess.Action.Revoke',
		'UserAccess.Action.Send',
		'UserAccess.Action.Resend',
		'UserAccess.Status.InvitationSent',
		'UserAccess.Status.InvitationStatusDescr',
		'UserAccess.Status.InvitationStatus',
		'Success',
		'Error',
		'Cancel',
		'UserAccess.Invite.Successful',
		'UserAccess.Invite.Failure',
		'UserAccess.Revoke.Successful',
		'UserAccess.Revoke.Failure',
		'Active',
		'Inactive',
		'UserAccess.Action.Activate',
		'UserAccess.Action.Inactivate',
		'UserAccess.Activate.Successful',
		'UserAccess.Activate.Failure',
		'UserAccess.Inactivate.Successful',
		'UserAccess.Inactivate.Failure',
		'UserAccess.Action.InviteInactive.PromptTitle',
		'UserAccess.Action.InviteInactive.Prompt',
		'UserAccess.Action.InviteInactive.PromptButton',
		'UserAccess.Action.Revoke.PromptTitle',
		'UserAccess.Action.Revoke.Prompt',
	]);

	// View Model properties
	var vm = $scope.vm = {
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		sendInvitation: function () {
			if (!$scope.row.isProcessing){
				warnIfInactiveWhenInviting().then(function() {
					$scope.row.isProcessing = true;
					userInviteApi.inviteUser({id: $scope.row.userKey}).then(
						function success(data) {
							if (!$scope.row.isActive) {
								//if the user was NOT active, he became actived when inviting, so adjust counts.
								var activated = true;
								adjustActiveInactiveCounts(activated);
							}

							var date = dateHelp.formatDate(new Date(), 'MM/dd/yyyy');
							$scope.row.status.invitationDate = date;
							$scope.row.status.invitationEmail = $scope.row.email;
							$scope.row.isActive = true;
							$scope.row.isProcessing = false;

							var msg = strings['UserAccess.Invite.Successful'];
							toastHelp.success(msg, strings['Success']);
		        		},
		        		function failure() {
		        			$scope.row.isProcessing = false;
		        			var msg = strings['UserAccess.Invite.Failure'];
		        			toastHelp.error(msg, strings['Error']);	        			
		        		});
				});
			}
        },
        revokeAccess: function() {
        	if (!$scope.row.isProcessing){
	        	warnWhenRevoking().then(function(){
	        		$scope.row.isProcessing = true;
		        	userRevokeApi.revokeUser({id: $scope.row.userKey}).then(
						function success(data) {
							if ($scope.row.isActive) {
								//if the user was active, he became inactived when revoking, so adjust counts.
								var activated = false;
								adjustActiveInactiveCounts(activated);
							}

							$scope.row.status.accessGranted = false;
							$scope.row.status.invitationDate = '';
							$scope.row.status.invitationEmail = '';
							$scope.row.status.flid = 0;
							$scope.row.isActive = false;
							$scope.row.isProcessing = false;

							var msg = strings['UserAccess.Revoke.Successful'];
							toastHelp.success(msg, strings['Success']);
		        		},
		        		function failure() {
		        			$scope.row.isProcessing = false;
		        			var msg = strings['UserAccess.Revoke.Failure'];
		        			toastHelp.error(msg, strings['Error']);
		        		});
		        });
	        }
        },
        activateUser: function() {
        	if (!$scope.row.isProcessing){
	        	var userKey = $scope.row.userKey;
	        	$scope.row.isProcessing = true;
	        	var response = userAccessApi.activateUser({id: userKey});
	        	response.then(function success(){
	        		$scope.row.isProcessing = false;
	        		activateInactivateSuccessCallback(userKey).then(function() {
		        		var msg = strings['UserAccess.Activate.Successful'];
						toastHelp.success(msg, strings['Success']);

						var activated = true;
						adjustActiveInactiveCounts(activated);
	        		});
	        	},
	    		function failure() {
	    			$scope.row.isProcessing = false;
	    			var msg = strings['UserAccess.Activate.Failure'];
	    			toastHelp.error(msg, strings['Error']);
	    		});
	        }
        },
        inactivateUser: function() {
        	if (!$scope.row.isProcessing){
	        	var userKey = $scope.row.userKey;
	        	$scope.row.isProcessing = true;
		    	var response = userAccessApi.inactivateUser({id: userKey});
	        	response.then(function success() {
	        		$scope.row.isProcessing = false;
	        		activateInactivateSuccessCallback(userKey).then(function() {
						var msg = strings['UserAccess.Inactivate.Successful'];
						toastHelp.success(msg, strings['Success']);

						var activated = false;
						adjustActiveInactiveCounts(activated);
					});
	        	},
	    		function failure() {
	    			$scope.row.isProcessing = false;
	    			var msg = strings['UserAccess.Inactivate.Failure'];
	    			toastHelp.error(msg, strings['Error']);
	    		});
	        }
        },
        getInvitedQtipContent: getInvitedQtipContent,
        showEmailDialog: userAccessHelp.showEmailDialog
	};

	function getInvitedQtipContent(row) {
		if (!row.status.invitationDate) { return ''; }

		var result = '<div class="qtipInvited">';
		result += '<div class="qtip-label">' + strings['UserAccess.Status.InvitationStatus'].toUpperCase() + '</div>';
		result += '<div class="row">' + strings['UserAccess.Status.InvitationStatusDescr'] + ' {{row.status.invitationDate}}</div>';
		result += '<div class="row">Sent to {{row.status.invitationEmail}}</div>';
		row.invitationQtip = result;
	}


	//------------------------------------------------
	// "Are you sure" dialogs
	//------------------------------------------------
	function warnIfInactiveWhenInviting() {
		if ($scope.row.isActive) {
			//don't need to warn if the user is active when inviting.
			var deferred = $q.defer();
			deferred.resolve();
			return deferred.promise;
		}

		var header = strings['UserAccess.Action.InviteInactive.PromptTitle'];
		var message = strings['UserAccess.Action.InviteInactive.Prompt'];
		var buttons = [{
			title: strings['UserAccess.Action.InviteInactive.PromptButton'],
            cls: 'fl-primary' //blue
		},{
			title: strings['Cancel'],
			cls: ''
		}];
		return showDialog(header, message, buttons);
	}

	function warnWhenRevoking() {
		var header = strings['UserAccess.Action.Revoke.PromptTitle'];
		var message = strings['UserAccess.Action.Revoke.Prompt'];
		var buttons = [{
			title: strings['UserAccess.Action.Revoke.PromptTitle'],
            cls: 'fl-negative' //red
		},{
			title: strings['Cancel'],
			cls: ''
		}];
		return showDialog(header, message, buttons);
	}

	function showDialog(header, message, buttons) {
		var dialogPromise = $q.defer();
		let dialog = ngDialog;
		dialog.open({
            template: '/global/modals/alert-html.html',
            closeByDocument: false,
            closeByNavigation: false,
            showClose: false,
            data: {
                header: header,
                body: message,
                buttons: mapButtonsForDialog(dialogPromise, dialog, buttons)
            }
        });
		return dialogPromise.promise;
	}

	function mapButtonsForDialog(promise, dialog, buttons) {
		return buttons.map(function(x) {
			return {
				title: x.title,
				cls: 'fl-button ' + x.cls,
				icon: '', loading: false,
				action: function() {
					ngDialog.close(dialog.id);
					promise[(x.cls.indexOf('fl-primary') >=0 || x.cls.indexOf('fl-negative') >=0) ? 'resolve' : 'reject']();
				}
			};
		});
	}
	//------------------------------------------------


	function activateInactivateSuccessCallback(userKey) {
		//since more than we can predict may have changed, grab the user again and update his status.
		return userAccessApi.getUser({id : userKey}).then(function success(data) {
			$scope.row.isActive = data.isActive;
			$scope.row.status = data.status;
		});
	}

	function adjustActiveInactiveCounts(activated) {
		var valueToAdjustBy = 1;
		if (!activated) {
			valueToAdjustBy = -1;
		}
		userAccessSvc.addToUserCountForTab(userAccessSvc.pageMode.activeUsers, valueToAdjustBy);
		userAccessSvc.addToUserCountForTab(userAccessSvc.pageMode.inactiveUsers, -valueToAdjustBy);
	}

	$scope.$watch('row.email', function (nVal, oVal){
		//when an email is added, decrement the count for No Email tab
        if((oVal === undefined || oVal === null) && nVal !== oVal){
            userAccessSvc.addToUserCountForTab(userAccessSvc.pageMode.noEmail, -1);
        }
    });

}

// #-- END Component (cmpt-user-access-access-status) --# //
// #----------------------------------------------------# //
};});}());