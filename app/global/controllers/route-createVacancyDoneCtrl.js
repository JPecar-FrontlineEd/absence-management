(function() {'use strict';angular.module('aesop')
.controller('CreateVacancyDoneCtrl', function ($scope, stringSvc, absrStepProgressStateVal, absrStateVal) {
// #-------------------------------------# //
// #------- CreateVacancyDoneCtrl -------# //

     var absrState = $scope.absrState = absrStateVal;
     // View Model properties
    var vm = $scope.vm = {
        steps: absrStepProgressStateVal.types.vacancy
    };


    // Get mnemonics that this component needs
    var strings = $scope.strings = stringSvc.getStrings([
        'Absence.Create.Text.VacancySummaryFor',
        'Vacancy',
        'Absence.Create.Text.CreateVacancy',
        'Absence.Create.Text.Your',
        'Absence.Create.Text.HasBeenScheduled'
    ]);

    // Actions that can be bound to from the view
    var go = $scope.go = {};

// #----- END CreateVacancyDoneCtrl -----# //
});}());