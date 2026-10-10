(function() {'use strict';angular.module('aesop')
.controller('DashboardCtrl', function ($scope) {
// #-----------------------------# //
// #------- DashboardCtrl -------# //

    $scope.$root.setTitle('Dashboard');

    // View Model properties
    this.vm = {
        filterDate: new Date(),
        fTypeVacancy: true,
        fTypeAbsence: true,
        institution: null,
        workerType: null,
        counts: {
            unfilled: 0,
            filled: 0,
            nosub: 0
        },
        totalCount: 0,
        percents: {
            filled: 0,
            unfilled: 0
        },
        activeSection: 'unfilled'
    };

// #----- END DashboardCtrl -----# //
});}());