(function() {'use strict';angular.module('aesop')
.controller('CreateVacancyCtrl', function ($scope, $timeout, stringSvc, absrStepProgressStateVal, absrSvc, storageSvc) {
// #---------------------------------# //
// #------- CreateVacancyCtrl -------# //

    // View Model properties
    var vm = $scope.vm = {
        steps: absrStepProgressStateVal.types.vacancy,
        filter: '',
        isVacancy: true
    };

    absrSvc.resetState();
    $scope.$root.setTitle('Create Vacancy');
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
        'Vacancy',
        'Search',
        'Absence.Create.Text.SelectProfile',
        'Absence.Create.Text.CreateVacancy'
    ]);

    // Actions that can be bound to from the view
    var go = $scope.go = {
    };

// #----- END CreateVacancyCtrl -----# //
});}());