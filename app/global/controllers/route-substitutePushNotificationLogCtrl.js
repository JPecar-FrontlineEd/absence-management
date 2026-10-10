(function() {'use strict';angular.module('aesop')
.controller('SubstitutePushNotificationLogCtrl', function ($stateParams, stringSvc, absenceRequestApi, toastHelp) {
// #---------------------------------# //
// #------- SubstitutePushNotificationLogCtrl -------# //

	// this is a route controller
	var route = this;

	// Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
		'CallhistoryLog.text.NoRecordFound',
		'Success',
		'Failure',
		'Notifications',
		'Mobile'
    ]);
	// View Model properties
	route.vm = {
		isLoading: true,
		cols:[
			{
				key: 'SubFullName', 
				width: '9/24',
				sortable: false,
				name: 'SubFullName',
				template:'{{row.SubFullName}}',
				headerTemplate: 'Who'
			},
			{
				key: 'OsLevel', 
				width: '6/24',
				sortable: false,
				name: 'OsLevel',
				template:'{{row.OsLevel}}',
				headerTemplate: 'Where'
			},
			{
				key: 'NotificationDateTime', 
				width: '5/24',
				sortable: false,
	            name: 'NotificationDateTime',
				template:'{{row.NotificationDateTime}}',
				headerTemplate: 'Date'
			},
			{
				key: 'DeliveryFailure', 
				width: '4/24',
				sortable: false,
				name: 'DeliveryFailure',
				template:'{{row.DeliveryFailure}}',
				headerTemplate: 'Status'
			}
        ],
		data:[],
		notificationLabel : route.strings['Mobile'] + ' ' + route.strings['Notifications']
	};

	// Actions that can be bound to from the view
	absenceRequestApi.substitutePushNotificationLogs({absenceRequestId:$stateParams.absrid}).then(function(notificationLogs){
		route.vm.isLoading = false;
		route.vm.data = notificationLogs.map(function(notificationLog) {
			notificationLog.SubFullName = ((notificationLog.SubstituteLastName != null ? notificationLog.SubstituteLastName + ', '  : '')
										+ (notificationLog.SubstituteFirstName != null ? notificationLog.SubstituteFirstName : ''));
			notificationLog.OsLevel = ((notificationLog.Manufacturer != null ? notificationLog.Manufacturer + ' ' : '') 
									+ (notificationLog.Model != null ? notificationLog.Model + ' ' : '') 
									+ (notificationLog.OsLevel != null ? notificationLog.OsLevel : '')),
			notificationLog.NotificationDateTime = notificationLog.NotificationDateTime != null ? new Date(notificationLog.NotificationDateTime).toString("MM/dd/yyyy") + ' ' + new Date(notificationLog.NotificationDateTime).toLocaleTimeString(): '',
			notificationLog.DeliveryFailure = (notificationLog.PublishFailure == 0 && notificationLog.DeliveryFailure == 0) ? route.strings['Success'] : route.strings['Failure']
			return notificationLog;
		});
    }, function(rejection) {
        toastHelp.error(rejection.$messages, 'Error');
        route.vm.isLoading = false;
    });

// #----- END SubstitutePushNotificationLogCtrl -----# //
});}());