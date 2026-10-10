(function() {'use strict';angular.module('aesop')
.controller('DetailAvailableSubstitutesCtrl', function ($scope, ngDialog, $location, absenceRequestApi, toastHelp, absrStateVal, absrSvc, stringSvc, storageSvc) {
// #----------------------------------------------# //
// #------- DetailAvailableSubstitutesCtrl -------# //

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
    ]);
    
    var organizationSettings = storageSvc.load('organizations')[0].settings;
    var user = storageSvc.load('user');

    // View Model properties
    var vm = $scope.vm = {
        filter: '',
        showQualifiedAndAvailable: user.UserType == 4 
            ? organizationSettings.AvailSubsOnlyQandADefaultON_OU
            : user.UserType == 5 
                ? organizationSettings.AvailSubsOnlyQandADefaultON_CU 
                : true
    };

    $scope.absrState = absrStateVal;

    // Actions that can be bound to from the view
    var go = $scope.go = {
        someAction: function () {
            vm.property = 'something';
        }
    };

    $scope.$on('$locationChangeStart', function (event, newUrl) {
        //for the absence that are locked by other user
        if ( $scope.absrState.absr.isLocked) { return; } 
        
        //for the absence that are locked by current user and leaving absence/vacancy request in locked state
        if($scope.absrState.absr.isLockedByCurrentUser && !newUrl.includes('/availableSubstitutes') ){
            event.preventDefault();
            absrSvc.confirmNavigateAwayFromAvailableSubstitute(newUrl);					
            return;
        }
    });

// #----- END DetailAvailableSubstitutesCtrl -----# //
});}());