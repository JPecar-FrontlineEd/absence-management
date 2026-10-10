(function () {
	'use strict'; var app = angular.module('aesop');

	// #--------------------------------------# //
	// #----- Service (notificationsSvc) -----# //
	app.factory('notificationsSvc', function ($q, notificationsApi, stringSvc, institutionSvc, storageSvc, permissionSvc, toastHelp, ngDialog) {

		var _defer = $q.defer(),
			notifications = storageSvc.load({ key: 'notifications' }),
			notificationState = { notifications: {}, count: 0 },
			strings;


		//other services needed before we can process the notifications
		var services = [stringSvc.ready, institutionSvc.ready, permissionSvc.ready];
		$q.all(services).then(function () {
			strings = stringSvc.getStrings([
				'Dismiss', 'ImportantNotifications'
			]);

			if (notifications) {
				notificationState.notifications = notifications;
				notificationState.count = notifications.length;

				_defer.resolve(notifications);
			} else {
				notificationsApi.get().then(function (data) {
					// cache in memory for reference
					notifications = data;
					notificationState.notifications = notifications;
					notificationState.count = notifications.length;

					// store the raw notifications data
					storageSvc.save({
						key: 'notifications',
						data: data
					});

					//only show dialog if there are notifications to be shown
					if (notifications.filter(function (n) { return n.show; }).length > 0 && permissionSvc.iHave('PSEUDO.ISCAMPUSUSER')) {
						showNotificationsDialog(false);
					}

					_defer.resolve(data);
				});
			}
		});

		function refreshNotifications() {

			var _defer = $q.defer();

			notificationsApi.get().then(function (data) {
				notifications = data;
				notificationState.notifications = notifications;
				notificationState.count = notifications.length;

				storageSvc.save({
					key: 'notifications',
					data: data
				});

				_defer.resolve(data);
			}, function (reasons) {
				_defer.reject(reasons);
			});
			return _defer.promise;
		}

		function getNotifications() {
			return notifications;
		}

		function showNotificationsDialog(showFullList) {
			var _defer = $q.defer();
			var dialog = ngDialog.open({
				template: '/components/template/cmpt-template-notifications/loginNotifications.html',
				className: 'ngdialog-theme-default login-notifications-dialog',
				closeByDocument: false,
				closeByNavigation: true,
				showClose: false,
				data: {
					header: strings['ImportantNotifications'],
					showFullList: showFullList,
					buttons: [{
						title: strings['Dismiss'],
						cls: 'fl-button',
						icon: '',
						action: function () {
							ngDialog.close(dialog.id);
							return _defer.reject();
						}
					}]
				}
			});
			return _defer.promise;
		}

		return {
			ready: _defer.promise,
			getNotifications: getNotifications,
			showNotificationsDialog: showNotificationsDialog,
			refresh: refreshNotifications,
			stateObj: notificationState
		};

	});
	// #--- END Service (notificationsSvc) ---# //
	// #--------------------------------------# //

}());
