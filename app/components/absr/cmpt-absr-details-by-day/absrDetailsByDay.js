(function () {
	'use strict'; angular.module('aesop')
		.directive('cmptAbsrDetailsByDay', function () {
			return {

				// directive options
				restrict: 'E',
				replace: true,
				transclude: true,
				scope: {
					apshowslide: '=',
					showInServiceAbsences: '=?',
					absence: '=?'
				},
				templateUrl: '/components/absr/cmpt-absr-details-by-day/absrDetailsByDay.html',

				// #-------------------------------------------------# //
				controller: function ($scope, absrStateVal, stringSvc, budgetCodeSvc, $location, storageSvc, absrSvc, featureSvc, relatedCalendarDataSvc) {
					//Create an entry in session storage with name "absrDetailsByDay" and value {"data":{"debug":true}}
					let debug = storageSvc.load("absrDetailsByDayDebug") != null;

					$scope.isExpanded = true;
					$scope.absrState = absrStateVal;
					var dayViewExtensions = [] ;
					var extensionId = $scope.absence.extension ;
					var extensionIdForDisplay = extensionId < 10 ? "0" + extensionId : extensionId ;					
					dayViewExtensions.push(extensionIdForDisplay);					
					$scope.extensions = dayViewExtensions.map(function(e) {
						return { extensionId: e };
					});	
					$scope.inServiceDay = false;
					$scope.isReviewingAbsenceRequest = $location.url().includes('create-absence-review');
					$scope.showCustomBreakTime = absrSvc.showHideAbsenceBreakTime($scope.absence);
					var organizationSettings = storageSvc.load('organizations')[0].settings;
	                $scope.canDeductCustomBreakTime = organizationSettings.ShowBreakTimeForCustomAbsences;

					var abs = $scope.absence;
					if (abs.closedDay != null) {
						if(abs.closedDay.closedDayType ==2){
							$scope.inServiceDay = true;
						}
					}
					
					relatedCalendarDataSvc.clearCache("absrDetailsbyDay.js");

					var vm = $scope.vm = {
						bugdetCodeList: []
					}	
					if ($scope.absrState.context.showBudgetCode) {
                        budgetCodeSvc.ready.then(function (budgetCodeData) {
                            vm.bugdetCodeList = budgetCodeData.map(function (v) {
                                return { id: v.id, value: v.description };
                            });
                        });
					}	
					abs.institution.value = abs.institution.name != null ? abs.institution.name : abs.institution.value;
					if(abs.entitlement == null)
					{
						abs.entitlement = absrStateVal.absrVariations[0].entitlementType;

					}
					abs.entitlement.value = abs.entitlement.name != null ? abs.entitlement.name : abs.entitlement.value;
					if (typeof abs.shiftType != "object") {
						$scope.absrState.context.absenceShiftTypes.forEach(function(absenceShiftType){
							if (absenceShiftType.id == abs.shiftType){
								abs.shiftType = absenceShiftType;
							}
						});
					}
					if (abs.budgetCode != null) {
						abs.budgetCode.value = abs.budgetCode.description != null ? abs.budgetCode.description : abs.budgetCode.value;
					}
					if (abs.accountingCode != null) {
						abs.accountingCode.value = abs.accountingCode.name != null ? abs.accountingCode.name : abs.accountingCode.value;
					}
					if (abs.payCode != null) {
						abs.payCode.value = abs.payCode.description != null ? abs.payCode.description : abs.payCode.value;
					}
					if(abs.userSpecifiedAbsenceDuration != null){
						if (abs.userSpecifiedAbsenceDuration.length == 8 || abs.userSpecifiedAbsenceDuration.length > 8){
							abs.userSpecifiedAbsenceDuration = abs.userSpecifiedAbsenceDuration.substring(0,5);
						}
					}
					if(abs.nonPayTime != null){
						if (abs.nonPayTime.length == 8 || abs.nonPayTime.length > 8){
							abs.nonPayTime = abs.nonPayTime.substring(0,5);
						}
					}
					if (typeof abs.substituteShiftType != "object") {
						$scope.absrState.context.vacancyShiftTypes.forEach(function(vacancyShiftType){
							if (vacancyShiftType.id == abs.substituteShiftType){
								abs.substituteShiftType = vacancyShiftType;
							}
						});
					}

					var weekday = new Array(7);
					weekday[0] = "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";

					$scope.go = {
						parseTime: function (dateTime) {
							return Date.parse(dateTime);
						},
						getDay: function (dateTime) {
							dateTime = Date.parse(dateTime);
							return weekday[dateTime.getDay()];
						}
					};


					$scope.strings = stringSvc.getStrings([
						'ViewingByDay',
						'AddDay',
						'AbsenceTimes',
						'AccountingCode',
						'BudgetCode',
						'HoursSubstituteWorked',
						'NonPayTime',
						'PayCode',
						'SubTimes',
						'TimeAbsent',
						'InServiceDay',
						'ClosedDay',
						'ConfirmationNumber',
						"VacancyTimes",
						'Custom',
						'NoneSelected',
						'DeductBreak'
					]);
				}
			};
		});
}());