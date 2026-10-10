(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Service (cacheSvc) -----# //
	app.factory('cacheSvc', function ($window, stringSvc, storageSvc, ngDialog) {

		var strings = stringSvc.getStrings([
			'dialog.actions.button.ok'
		]);

		function refreshUser(){
			var dialog = ngDialog.open({
				template:'/global/modals/user-profile-update-confirm.html',
				closeByDocument: false,
				closeByNavigation: false,
				showClose: false,
				data: {
					header: 'Profile Updated',
					message: 'An administrator has made a change that affects your profile. We will refresh your settings to be up to date.',
					buttons: [{
						title: strings['dialog.actions.button.ok'],
						cls:'fl-positive',
						icon: '',
						action:  function(){
							ngDialog.close(dialog.id);
							storageSvc.clear('organizations');
							storageSvc.clear('permissions');
							storageSvc.clear('user');
							storageSvc.clear('institutions');
							$window.location.reload();
						}
					}]
				}
			});
		}

		return {
			refresh: refreshUser
		};

	});
	// #--- END Service (cacheSvc) ---# //
	// #-------------------------------# //

}());