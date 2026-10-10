(function() {'use strict';angular.module('aesop')
.controller('UserProfileCtrl', function ($scope, $q, $window, stringSvc, userSvc, userApi, toastHelp, permissionSvc, idmAvailableSvc, authSvc, $location, impersonationHelp, featureSvc) {
// #-------------------------------# //
// #------- UserProfileCtrl -------# //

    // this is a route controller
    var route = this;

    // View Model properties
    route.vm = {
        saving: false,
        personalInfoObj: {},
        firstNameInvalid: false,
        lastNameInvalid: false,
        emailInvalid: false,
        phoneInvalid: false,
        errorList: [],
        languageList: [],
        originalLanguageId: null,
        showLoginId : !idmAvailableSvc.IDMIsIdentityProvider(),
        languageSettingViewOnly: idmAvailableSvc.IDMIsIdentityProvider() && authSvc.isFrontlineAccountUser() && !authSvc.isOrgImpersonating(),
        isAnyImpersonatingGoingOn: impersonationHelp.impersonationData().isImpersonating ||
                                    authSvc.isFlidImpersonating() ||
                                    authSvc.isOrgImpersonating()
    };

    route.strings = stringSvc.getStrings([
        'header.DropDown.option.MyProfile',
        'Save',
        'GeneralInformation',
        'Name',
        'LoginID',
        'Email',
        'Phone',
        'Language',
        'orgUser.Validation.text.FirstName.required',
        'orgUser.Validation.text.LastName.required',
        'orgUser.Validaiton.text.LoginID.required',
        'orgUser.Validation.text.Email.IncorrectFormat',
        'orgUser.Validation.text.Phone.IncorrectFormat',
        'PersonalInfoSaved',
        'Success',
        'NoneSelected',
        'LanguagePreferenceText',
        'nav.settings.accountSettings',
    ]);

    loadUserProfile();
    function loadUserProfile() {
        var userData = userSvc.getUserData();
        route.vm.personalInfoObj = {
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            emailAddress: userData.emailAddress,
            phoneNumber: userData.phoneNumber,
            languageId: userData.languageId,
            loginId: userData.loginId,
            canEdit: !(featureSvc.get("at_adopt_orgperson_erp").enabled || featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled)
        };
        route.vm.languageList = userData.languages;
        if (route.vm.originalLanguageId === null) {
            route.vm.originalLanguageId = route.vm.personalInfoObj.languageId;
        }
        if (route.vm.languageSettingViewOnly) {
            authSvc.getAccountSettingsUrl($location.absUrl(), true).then(function(url){
                route.vm.idmSettingsUrl = url;
            });
        }
    }

    // Actions that can be bound to from the view
    route.go = {
        updateProfile: function () {
            if (validateProfile()) {
                update().then(function(){
                    $scope.$emit('update-user-data');
                    if (route.vm.originalLanguageId !== route.vm.personalInfoObj.languageId) {
                        //only reload the application if the user's language has changed
                        $window.location.reload();
                    }
                });
            }
        },
        getLanguageFromId(langId) {
            var found = route.vm.languageList.find(function(e) {
                return e.id === langId;
            });
            return found;
        }
    };

    function update() {
        toastHelp.clear();
        route.vm.saving = true;
        var _defer = $q.defer();
        userApi.updateProfile(route.vm.personalInfoObj).then(function (userObj){
            $scope.updateProfile.$setPristine();
            route.vm.saving = false;
            toastHelp.info([route.strings['PersonalInfoSaved']], route.strings['Success']);
            //PUT returns the updated resource
            userSvc.update(userObj);
            return _defer.resolve();
        }, function(reasons){
            route.vm.saving = false;
            toastHelp.error(reasons.$messages, 'Error');
            return _defer.resolve();
        });
        return _defer.promise;
    }

    function validateProfile() {
        resetInvalids();

        if ($scope.updateProfile.phoneNumber.$error.pattern) {
            route.vm.phoneInvalid = true;
            route.vm.errorList.push(route.strings['orgUser.Validation.text.Phone.IncorrectFormat']);
        }


        //if data integration is off, these fields are editable. so validate them.
        if (!(featureSvc.get("at_adopt_orgperson_erp").enabled || featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled)) {
            //Email and Phone number format validation
            if ($scope.updateProfile.emailAddress.$error.pattern) {
                route.vm.emailInvalid = true;
                route.vm.errorList.push(route.strings['orgUser.Validation.text.Email.IncorrectFormat']);
            }
            //First and last name required
            if ($scope.updateProfile.firstName.$error.required) {
                route.vm.errorList.push(route.strings['orgUser.Validation.text.FirstName.required']);
                route.vm.firstNameInvalid = true;
            }
            if ($scope.updateProfile.lastName.$error.required) {
                route.vm.errorList.push(route.strings['orgUser.Validation.text.LastName.required']);
                route.vm.lastNameInvalid = true;
            }
        }

        if (route.vm.errorList.length > 0) {
            toastHelp.error(route.vm.errorList, 'Error');
            return false;
        }

        return true;
    }
    function resetInvalids() {
        toastHelp.clear();
        route.vm.firstNameInvalid = route.vm.lastNameInvalid = route.vm.emailInvalid = route.vm.phoneInvalid = false;
        route.vm.errorList = [];
    }

// #----- END UserProfileCtrl -----# //
});}());
