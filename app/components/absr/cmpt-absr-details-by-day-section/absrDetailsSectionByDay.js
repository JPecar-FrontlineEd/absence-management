(function () {
    'use strict'; angular.module('aesop')
        .directive('cmptAbsrDetailsSectionByDay', function () {
            return {

                // directive options
                restrict: 'E',
                scope: true,
                replace: true,
                templateUrl: '/components/absr/cmpt-absr-details-by-day-section/absrDetailsSectionByDay.html',

                controller: function ($scope,absrSvc,stringSvc,dateHelp,ngDialog) {
                    var absrState = $scope.absrState = absrSvc.getState();
                    absrState.absr.absences.sort(function (a, b) {
                        if(new Date(a.date).getTime() == new Date(b.date).getTime())
                        {
                           return 0;
                        }
                        return (new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1);
                    });

                    $scope.normalDayAbsences = absrState.absr.absences.filter(x=>x.closedDay === null);
                    $scope.inServiceDayAbsences = absrState.relatedAbsences.filter(x=>x.closedDay !=null && x.closedDay.closedDayType ===2);
                    $scope.closedDayAbsences = absrState.absr.absences.filter(x=>x.closedDay !=null && x.closedDay.closedDayType ===1);

                    $scope.isEditing = $scope.absrState.editMode;
                    $scope.isExpanded = true;
                    absrState.isAddDaysEditCreateMode = true; 
                    absrSvc.setFlags(absrState);
                    
                    var go = $scope.go = {
                    showAddDaysDialog: function()
                        {
                        var dialog = ngDialog.open({
                           
                            template:'/components/absr/cmpt-absr-details-by-day-section/add-days.html',
                            closeByDocument: false,
                            showClose: true,
			                closeByEscape: false,
                            closeByNavigation: false,
                            className:'ngdialog-theme-default custom-width-700',
                            data: {
                                header:$scope.strings['AddDaysTo'] + $scope.strings[mnemonic.typeTitle],
                            }
                            
                        });
                    },
                   
                }
                var isVacancy = absrState.worker.isVacancy;
                    var mnemonic = $scope.mnemonic = {
                        typeTitle: isVacancy ? 'Vacancy' : 'Absence',
                     }

                    $scope.strings = stringSvc.getStrings([
                        'ViewingByDay',
                        'AddDay',
                        'AddDaysTo',
                        'Absence',
                        'Vacancy',
                        'Expanded',
                        'Collapsed',
                        'AbsenceRequestHeaderWithClosedDays',
                        'AbsenceRequestHeaderWithClosedDay',
                        'AbsenceRequestHeaderWithInServiceDay',
                        'AbsenceRequestHeaderWithInServiceDays',
                        'ClosedDay',
                        'ClosedDays',
                        'InServiceDay',
                        'InServiceDays'
                    ]);

                }

            };
        });
}());
