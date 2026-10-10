(function () {
	'use strict'; angular.module('aesop')
		.controller('AbsenceViewEditCtrl', function ($scope, stringSvc, featureSvc, absrSvc, userSvc, userType, absrStateVal, $rootScope, storageSvc, $location, $state, ngDialog, toastHelp, locationHelp, scrollHelp,
			                                        permissionSvc) {
			// #-----------------------------------# //
			// #------- AbsenceViewEditCtrl -------# //

			// this is a route controller 
			var route = this;
			var variationAbsences = [];
			var oldVariation = angular.copy(absrStateVal);
			var strings = route.strings = stringSvc.getStrings([
				'Absence.Create.Error.Message'
			]);

            
            var userData = userSvc.getUserData();
    
			// View Model properties
			route.vm = {
				loading: false,
				message: '',
				errorMessage: strings['Absence.Create.Error.Message'],
				canUndeleteAbsence: permissionSvc.iHave('ABSR.UNDELETE'),
				isOrgUser: (userData.UserType == userType.org)? true: false
			};
			
			$scope.absrState = absrStateVal;
			$scope.selectedView = 'btnVariation';
			
			if (storageSvc.load("selectedView") == null) {

				var isDayVariationSwitchEnabled = featureSvc.get("AngularAbsenceDayVariationSwitch").enabled;

				if (isDayVariationSwitchEnabled) {
					if (userData.UserType !== userType.campus) {
						$scope.selectedView = 'btnDay';
						storageSvc.save({
							key: 'selectedView',
							data: 'btnDay',
							persistent: true
						});
					}
					else {
						storageSvc.save({
							key: 'selectedView',
							data: 'btnVariation',
							persistent: true
						});
					}
				}
			} else {
				$scope.selectedView = storageSvc.load("selectedView");
			}

			$scope.isEditing = $scope.absrState.editMode;

			$rootScope.$on("viewChanged", function (event, selectedView) {
				$scope.selectedView = selectedView;
			});
			// Actions that can be bound to from the view
			route.go = {

			};

			//on page refresh warning popup shows if dirty flag is true
			window.onbeforeunload = function (event) {
				if ($scope.myForm.$dirty ) {
					return 'changes you made may not be saved';
				}
			};

			$scope.$on('$locationChangeStart', function (event, newUrl) {
				//for new absence and not edit mode 
				if (!absrStateVal.editMode || absrStateVal.absr == null  ) { return; } 

				//to find change in date and set dirty flag
				if ($scope.selectedView == 'btnDay') {
					setDayDirty();
				} else if ($scope.selectedView == 'btnVariation') {
					setVariationDirty();
				}

				//Setting sessionStorage because dirty flag will set to false if tab switches and if dirty flag is true and navigating to other location warning popup shows
				if ($scope.myForm.$dirty && newUrl.includes('/abs-mgt/absences/detail/') && !newUrl.includes('/feedback/')) {										
					event.preventDefault();
					absrSvc.confirmNavigateAway(newUrl);					
					return;
				} else if ($scope.myForm.$dirty) {
					event.preventDefault();
					absrSvc.confirmNavigateAway(newUrl);
				}

				return;
			});

			
			$scope.$on('$stateChangeStart', function (event, newUrl) {
				//for new absence and not edit mode 
				if (!absrStateVal.editMode || absrStateVal.absr == null) { return; } 

				//to find change in date and set dirty flag
				if ($scope.selectedView == 'btnDay') {
					setDayDirty();
				} else if ($scope.selectedView == 'btnVariation') {
					setVariationDirty();
				}

				if ($scope.myForm.$dirty && newUrl.url.includes('/feedback/')) {
					event.preventDefault();
					absrSvc.confirmNavigateAway(newUrl);
				}

				return;
			});


			//setting dirty flag when ByDay date is changed
			function setDayDirty() {
				variationAbsences = [];
				absrStateVal.absrVariations.forEach(function (variation) {
					variation.absences.forEach(function (absence) {
						variationAbsences.push(absence);
					});
				});

				if(variationAbsences.length != absrStateVal.absr.absences.length){
					$scope.myForm.$setDirty();
					return;
				}

				for (var i = absrStateVal.absr.absences.length - 1; i >= 0; i--) {
					if(variationAbsences[i].id == absrStateVal.absr.absences[i].id){
						if (new Date(variationAbsences[i].date).getTime() != new Date(absrStateVal.absr.absences[i].date).getTime()) {
							$scope.myForm.$setDirty();
						}
					}
				}
			}

			//setting dirty flag when Variation date is changed
			function setVariationDirty() {
				if(oldVariation.absrVariations.length != absrStateVal.absrVariations.length){
					$scope.myForm.$setDirty();
					return;
				}
				for (var i = absrStateVal.absrVariations.length - 1; i >= 0; i--) {
					for (var j = absrStateVal.absrVariations[i].dates.length - 1; j >= 0; j--) {
						if(oldVariation.absrVariations[i].absences[i] != null && absrStateVal.absrVariations[i].absences[i] != null){
							if(oldVariation.absrVariations[i].absences[i].id == absrStateVal.absrVariations[i].absences[i].id){
								if (new Date(oldVariation.absrVariations[i].dates[j]).getTime() != new Date(absrStateVal.absrVariations[i].dates[j]).getTime()) {
									$scope.myForm.$setDirty();
								}
							}
						}
					}

				}

			}

			// #----- END AbsenceViewEditCtrl -----# //
			// #-----------------------------------# //
		});
}());