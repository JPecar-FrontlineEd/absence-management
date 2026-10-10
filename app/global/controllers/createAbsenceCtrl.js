(function() {'use strict';angular.module('aesop')
.controller('CreateAbsenceCtrl', function ($scope, $timeout, stringSvc, absrStepProgressStateVal, absrSvc,storageSvc) {
// #---------------------------------# //
// #------- CreateAbsenceCtrl -------# //

    // View Model properties
    var vm = $scope.vm = {
        steps: absrStepProgressStateVal.types.absence,
        filter: '',
        isVacancy: false
    };

    absrSvc.resetState();
    $scope.$root.setTitle('Create Absence');
    var absrState = $scope.absrState = absrSvc.getState();
    storageSvc.save({
        key: 'showDayVariationSwitch',
        data: false,
        persistent: false
    });
    storageSvc.save({
        key: 'noDaysAlertShown',
        data: false,
        persistent: false
    });

    // Get mnemonics that this component needs
    var strings = $scope.strings = stringSvc.getStrings([
        'Absence.Create.Text.Step',
        'Absence.Create.Text.SelectEmployee',
        'Search',
        'Absence',
        'Absence.Create.Text.CreateAbsence'
    ]);

    // Actions that can be bound to from the view
    var go = $scope.go = {
    };

// #----- END CreateAbsenceCtrl -----# //
});}());