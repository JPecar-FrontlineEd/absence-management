(function() {'use strict';angular.module('aesop')
.controller('CreateAbsenceDetailsCtrl', function ($scope, stringSvc, absrStepProgressStateVal, absrStateVal, storageSvc, featureSvc, userSvc, userType) {
// #----------------------------------------# //
// #------- CreateAbsenceDetailsCtrl -------# //

    // View Model properties
    var vm = $scope.vm = {
        steps: absrStepProgressStateVal.types.absence,
        errorMessage : ''
    };
    $scope.absrState = absrStateVal;
    $scope.selectedView = 'btnVariation';
    var isDayVariationSwitchEnabled = featureSvc.get("AngularAbsenceDayVariationSwitch").enabled;

    if (storageSvc.load("selectedView") == null) {
        var userData = userSvc.getUserData();

        if (isDayVariationSwitchEnabled) {
            if (userData.UserType !== userType.campus) {
                $scope.selectedView = 'btnDay';
            } else {
                $scope.selectedView = 'btnVariation';
            }
            storageSvc.save({
                key: 'selectedView',
                data: $scope.selectedView,
                persistent: true
            });
        }
    } else {
        $scope.selectedView = storageSvc.load("selectedView");
    }
           
    if (isDayVariationSwitchEnabled){
        storageSvc.save({
            key: 'showDayVariationSwitch',
            data: true,
            persistent: false
        });
    }

    // Get mnemonics that this component needs
    var strings = $scope.strings = stringSvc.getStrings([
        'Absence.Create.Text.Step',
        'Absence.Create.Text.FillOut',
        'Absence',
        'Absence.Create.Text.DetailsFor',
        'Absence.Create.Text.CreateAbsence',
        'Absence.Create.Error.Message'
    ]);
    $scope.vm.errorMessage= strings['Absence.Create.Error.Message'];

    // Actions that can be bound to from the view
    var go = $scope.go = {};

// #----- END CreateAbsenceDetailsCtrl -----# //
});}());