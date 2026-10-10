(function() {'use strict';angular.module('aesop')
.controller('cmptUserAccessEmailModal', function ($scope, stringSvc, userAccessApi, toastHelp, ngDialog, formHelp) {

	var strings = $scope.strings = stringSvc.getStrings([
		'Success',
		'Error',
		'Cancel',
		'Email',
		'Required',
		'Validation.Field.MaxLength',
		'Validation.Email.Required',
		'EmailSaved',
		'EmailNotSaved',
		'UserAccess.EnterEmailPrompt'
	]);

	// View Model properties
	var vm = $scope.vm = {
		dialog: this,
		user: $scope.ngDialogData.user,
		buttons: [],
		maxEmailChars: 80
	};
	vm.email = $scope.ngDialogData.user.email;
	vm.actionText = !!vm.email ? 'Update' : 'Set',
	vm.buttons = [{
                    name:'SaveEmail',
                    title: vm.actionText + ' Email',
                    cls: 'fl-button fl-primary',
                    disableWhenFormInvalid: false,
                    loading: false,
                    action: function(emailForm) {
                    	if (emailForm.$invalid) {
                    		formHelp.setTouched(emailForm);
							return;
						}
						if (!emailForm.$dirty) { //no changes? just exit.
							closeDialog(emailForm);
							return;
						}
                    	var button = this;
                    	if (!button.loading) {
                    		button.loading = true;
	                    	userAccessApi.setEmail({id: vm.user.userKey, email: vm.email}).then(
								function success(data) {
									vm.user.email = vm.email;
									toastHelp.success(strings['EmailSaved'], strings['Success']);
		                    		closeDialog(emailForm);
								},
								function failure(data) {
									var msg = data.$messages[0];
									if (!msg) {
										msg = strings['EmailNotSaved'];
									}
									toastHelp.error(msg, strings['Error']);
									button.loading = false;
								}
							);
						}
                    }
                },
                {
                    name:'Cancel',
                    title: strings['Cancel'],
                    icon:'fa-times',
                    cls:'fl-button',
                    disableWhenFormInvalid: false,
                    action: closeDialog
                }];

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};

	function closeDialog(emailForm){
		if(emailForm.$invalid) {
			emailForm.$setUntouched(); //set form untouched to hide any validation errors
	  	}
        ngDialog.close(vm.dialog.id);
    }

})})();

