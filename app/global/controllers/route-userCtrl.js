(function() {'use strict';angular.module('aesop')
.controller('UserCtrl', function (stringSvc, permissionSvc, idmAvailableSvc) {
// #------------------------# //
// #------- UserCtrl -------# //

    // this is a route controller
    var route = this;

    route.strings = stringSvc.getStrings([
        'header.DropDown.option.MyProfile', 'Pin'
    ]);

    var tabs = [{
            title: route.strings['header.DropDown.option.MyProfile'],
            route:'user/profile',
            state: 'base.user.profile',
            visible:true
        },{
            title: route.strings['Pin'],
            route:'user/pin',
            state: 'base.user.pin',
            visible: !idmAvailableSvc.IDMIsIdentityProvider()
        }];

    // View Model properties
    route.vm = {
        tabs: tabs
    };

    // Actions that can be bound to from the view
    route.go = {
        someAction: function () {
            route.vm.property = 'something';
        }
    };

// #----- END UserCtrl -----# //
});}());
