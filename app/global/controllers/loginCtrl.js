(function() {'use strict';angular.module('aesop')
.controller('LoginCtrl', function ($scope, loginApi, tokenSvc, $window) {
// #-------------------------# //
// #------- LoginCtrl -------# //

    $scope.$root.setTitle('Login');
    document.getElementById('pre-loader').style.display = 'none';

    // View Model properties
    var vm = this.vm = {
        user: '',
        pin: ''
    };

    // Actions that can be bound to from the view
    var go = this.go = {
        login: function () {
            loginApi.save({loginId: vm.user, pin: vm.pin}).then(function (data) {
                tokenSvc.set(data.token);
                //$window.location.href = '/security/user-access'; //TODO REMOVEME
               $window.location.href = '/'; //TODO REPLACEME

            });
        }
    };


// #----- END LoginCtrl -----# //
});}());
