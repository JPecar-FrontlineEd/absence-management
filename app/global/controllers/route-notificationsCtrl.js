(function() {'use strict';angular.module('aesop')
.controller('NotificationsCtrl', function (stringSvc) {
// #---------------------------------# //
// #------- NotificationsCtrl -------# //

	// this is a route controller
	var route = this;

	route.strings = stringSvc.getStrings([
        'Notifications'
    ]);

 	var tabs = [{
        title: route.strings['Notifications'],
        route:'/notifications',
        state: 'base.notifications',
        visible: true,
    }];

	// View Model properties
	route.vm = {
		tabs: tabs
	};

	// Actions that can be bound to from the view
	route.go = {};

// #----- END NotificationsCtrl -----# //
});}());