(function() {'use strict';angular.module('aesop')
.controller('CreateAbsenceReviewCtrl', function ($scope,stringSvc, absrStepProgressStateVal, absrStateVal, storageSvc) {
// #---------------------------------------# //
// #------- CreateAbsenceReviewCtrl -------# //

    $scope.absrState = absrStateVal;
    const canAssignSub = absrStateVal.context.canAssignSub;

	if (!canAssignSub && absrStepProgressStateVal.types.absence[3].buttons.length > 1) {
      absrStepProgressStateVal.types.absence[3].buttons.shift();
    }

    if (storageSvc.load("selectedView") == 'btnDay'){
        absrStateVal.absrVariations.forEach(function(variation){
            variation.absences.forEach(function(absence){
                if (absence.isDeleted && variation.absences.length == 1){
                    absrStateVal.absrVariations.splice(absrStateVal.absrVariations.indexOf(variation),1);
                }else if (absence.isDeleted && variation.absences.length > 1){
                    variation.absences.splice(variation.absences.indexOf(absence),1);
                    variation.dates.splice(variation.dates.indexOf(absence.date),1);
                }
            })
        })

        for(var i = absrStateVal.absr.absences.length - 1; i >= 0; i--){
            if(absrStateVal.absr.absences[i].isDeleted){
                absrStateVal.absr.absences.splice(i,1);
            }
        }
    }

    $scope.selectedView = storageSvc.load("selectedView");
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

    // View Model properties
    var vm = $scope.vm = {
        steps: absrStepProgressStateVal.types.absence
    };
    

    // Get mnemonics that this component needs
    var strings = $scope.strings = stringSvc.getStrings([
        'Absence.Create.Text.Step',
        'Absence.Create.Text.FillOut',
        'Absence',
        'Absence.Create.Text.ReviewAndConfirmDetailsFor',
        'Absence.Create.Text.CreateAbsenceAndAssignSub',
        'Absence.Create.Text.CreateAbsence',
        'ViewingByDay'
    ]);

    // Actions that can be bound to from the view
    var go = $scope.go = {};
// #----- END CreateAbsenceReviewCtrl -----# //
});}());
