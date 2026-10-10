(function() {'use strict';angular.module('aesop')
.controller('ChangePinCtrl', function ($scope, $q, stringSvc, tokenSvc, toastHelp, userApi) {
// #-----------------------------# //
// #------- ChangePinCtrl -------# //

    // this is a route controller
    var route = this;

    route.strings = stringSvc.getStrings([
        'PinFormat',
        'ChangeyourPin',
        'PinChangeSuccessfulMessage',
        'ChangeMOSPinBelow',
        'ChangeDistrictPinBelow',
        'OldPin',
        'NewPin',
        'ConfirmNewPin',
        'ClearForm',
        'SaveChanges',
        'Success',
        'NewPinCannotBeTheSameAsOldPin',
        'PinTooShort',
        'PinTooLong',
        'PinNotNumeric',
        'ValuesDidNotMatch',
        'ChangePin.Label.RequirementsHeader',
        'ChangePin.Label.NotSameAsOld',
        'ChangePin.Label.NotInSequence',
        'ChangePin.Label.RepeatedCharacterLimit'
    ]);

    // View Model properties
    route.vm = {
        pinObj: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        loading: false,
        oldPinInvalid: false,
        newPinInvalid: false,
        confirmNewPinInvalid: false
    };

    function validatePin(){
        resetInvalids();

        if ($scope.changePin.newPin.$error.minlength) {
            toastHelp.error([route.strings['PinTooShort']], 'Error');
            route.vm.newPinInvalid = true;
            return false;
        }
        if ($scope.changePin.newPin.$error.maxlength) {
            toastHelp.error([route.strings['PinTooLong']], 'Error');
            route.vm.newPinInvalid = true;
            return false;
        }
        if ($scope.changePin.newPin.$error.pattern) {
            toastHelp.error([route.strings['PinNotNumeric']], 'Error');
            route.vm.newPinInvalid = true;
            return false;
        }
        //old and new cannot be the same
        if (route.vm.pinObj.oldPassword === route.vm.pinObj.newPassword) {
            toastHelp.error([route.strings['NewPinCannotBeTheSameAsOldPin']], 'Error');
            route.vm.newPinInvalid = route.vm.oldPinInvalid = true;
            return false;
        }
        //confirm newPin matches confirmNewPin
        if (route.vm.pinObj.newPassword !== route.vm.pinObj.confirmNewPassword) {
            toastHelp.error([route.strings['ValuesDidNotMatch']], 'Error');
            route.vm.newPinInvalid = route.vm.confirmNewPinInvalid = true;
            return false;
        }

        return true;
    }

    function clearForm(setPristine) {
        if (setPristine) {
            $scope.changePin.$setPristine();
        }
        route.vm.pinObj.oldPassword = '';
        route.vm.pinObj.newPassword = '';
        route.vm.pinObj.confirmNewPassword = '';
    }
    function resetInvalids() {
        toastHelp.clear();
        route.vm.newPinInvalid = route.vm.oldPinInvalid = route.vm.confirmNewPinInvalid = false;
    }

    // Actions that can be bound to from the view
    route.go = {
        changePin: function () {
            if (validatePin()) {
                toastHelp.clear();
                route.vm.loading = true;
                var _defer = $q.defer();
                userApi.changePin(route.vm.pinObj).then(function (data){
                    route.vm.loading = false;
                    route.go.clearForm();
                    tokenSvc.set(data.token, true);
                    toastHelp.success([route.strings['PinChangeSuccessfulMessage']], route.strings['Success']);
                    return _defer.resolve();
                }, function(reasons){
                    route.vm.loading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
            } else {
                clearForm(false);
            }
        },
        clearForm: function () {
            clearForm(true);
            resetInvalids();
        }
    };

// #----- END ChangePinCtrl -----# //
});}());