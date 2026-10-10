(function() {'use strict';angular.module('aesop')
.controller('CreateAbsenceDoneCtrl', function ($scope, stringSvc, absrStepProgressStateVal, absrStateVal) {
// #-------------------------------------# //
// #------- CreateAbsenceDoneCtrl -------# //

    var absrState = $scope.absrState = absrStateVal;
     // View Model properties
    var vm = $scope.vm = {
        steps: absrStepProgressStateVal.types.absence,
        loading: false,
        message:''
    };


    // Get mnemonics that this component needs
    var strings = $scope.strings = stringSvc.getStrings([
        'Absence.Create.Text.AbsenceSummaryFor',
        'Absence',
        'Absence.Create.Text.CreateAbsence',
        'Absence.Create.Text.Your',
        'Absence.Create.Text.HasBeenScheduled'
    ]);

    // Actions that can be bound to from the view
    var go = $scope.go = {};

// #----- END CreateAbsenceDoneCtrl -----# //
});}());