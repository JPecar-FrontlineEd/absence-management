(function () {
	'use strict'; angular.module('aesop')
		.directive('cmptAbsrCreateNewByDaySection', function () {
			return {

				// directive options
				restrict: 'E',
				replace: true,
				transclude: true,
				templateUrl: '/components/absr/cmpt-absr-create-new-by-day-section/absrCreateNewAbsenceByDay.html',

				// #-------------------------------------------------# //
				controller: function ($scope, stringSvc, ngDialog, absrSvc, storageSvc) {
					var absrState = $scope.absrState = absrSvc.getState();
					$scope.isExpanded = true;					
					$scope.showAbsences = false;
					$scope.showNoDaysAlert = storageSvc.load('noDaysAlertShown') == null? false: storageSvc.load('noDaysAlertShown');
					var isVacancy = absrState.worker.isVacancy;
					var mnemonic = $scope.mnemonic = {
						typeTitle: isVacancy ? 'Vacancy' : 'Absence',
						}

					if (absrState.absrVariations.startDate != null){
						$scope.showAbsences = true;
					}

					$scope.strings = stringSvc.getStrings([
						'ViewingByDay',
						'AddDay',
						'NoAbsenceDaysAddedYet',
						'AddAtleastOneAbsence',
						'NoVacancyDaysAddedYet',
						'AddAtleastOneVacancy',
						'Absence.Create.Text.Step',
						'Absence.Create.Text.FillOut',
						'Absence',
						'Vacancy',
						'Absence.Create.Text.DetailsFor',
						'Absence.Create.Text.CreateAbsence',
						'Absence.Create.Text.CreateVacancy',
						'AddDaysTo',
						'Vacancy',
						'Absence',
						'Expanded',
						'Collapsed'
					]);

					var go = $scope.go = {
						showAddDaysDialog: function () {
							var dialog = ngDialog.open({

								template: '/components/absr/cmpt-absr-details-by-day-section/add-days.html',
								closeByDocument: false,
								showClose: true,
								closeByEscape: false,
								closeByNavigation: false,
								className: 'ngdialog-theme-default custom-width-700',
								data: {
									header: $scope.strings['AddDaysTo'] + $scope.strings[mnemonic.typeTitle],
								}

							});
						},
					}

					if ((absrState.absr == null || absrState.absr.absences.length == 0)  && storageSvc.load("selectedView") == "btnDay" && !storageSvc.load("noDaysAlertShown")) {
						go.showAddDaysDialog();
					}

				}
			};
		});
}());