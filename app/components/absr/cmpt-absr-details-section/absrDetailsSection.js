(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDetailsSection', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-details-section/absrDetailsSection.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-absr-details-section) ----# //
controller: function ($scope, $state,  $stateParams, stringSvc, ngDialog, absrSvc, absrVariationHelp, scrollHelp, dateHelp, storageSvc) {

	// View Model properties
	var vm = $scope.vm = {
		variationIndex: 0,
		allDates: [],
		dateConflictBeingResolved: false
	};

	var absrState = $scope.absrState = absrSvc.getState();
	//var absrVariations = absrState.absrVariations;

	// if there are errors on this absrState, handle them now
	absrSvc.handleSaveErrors().then(function (err) {
		if (err.retry) {
			// DE12055
			// when user try to Save or SaveAndAssign absence request
			// server can respond with 412 precondition failed
			// we have to show a warning dialog and user can "Save and Continue"
			// but previosuly we were not tracking which button user has clicked
			//
			// here we are checking what user had clicked and redirecting user to the page
			// where user intended to go.
			//
			// this parameter is set on the '$stateChangeError' on router.js file
			// also each of these routes have this parameter defualt as 'null'
			var assignedAndSaveClicked = $stateParams.assignedClicked !== null && $stateParams.assignedClicked;
			$state.go((assignedAndSaveClicked) ? 'base.absrCreateAndAssign' : 'base.absrCreateSave');
		}
	});

	$scope.$on('$viewContentLoaded', function() {
		if(absrState.errorElement){
			scrollHelp.scrollTo(absrState.errorElement);
		}
	});

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'absrItenerant.Step2.button.text.AddVariations',
		'DeleteThisVariation'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		addVariation: function (index) {
			var data = angular.copy(absrState.absrVariations[index]);
			data.dates.length = 0;
            data.isVariationReasonEditCreateMode = true;
			data.allowDeleted = false;
			data.isEditable = true;
			data.newVariation = true;
			absrState.absrVariations.push(data);
		},
		removeVariation: function(index){
			var data = absrState.absrVariations[index];
			if(data.dates.length > 0){
				showDeleteVariationDialog(index);
			}else{
				deleteVariation(index);
			}
		},
		detectConflict: function(index){
			var conflictingDates =[];
			var thisVariation = absrState.absrVariations[index];
			var locked = false;


			if(thisVariation != null){
				populateAllDates();
				conflictingDates = thisVariation.dates;
				if(thisVariation.institution == null) { return; }
				for (var i = absrState.absrVariations.length - 1; i >= 0; i--) {
					if(i === index){ continue; }
					var otherVariation = absrState.absrVariations[i];
					if(otherVariation.institution == null) { continue; }
					if(checkShiftAndTimeOverlap(thisVariation,otherVariation)){
						if (!otherVariation.isEditable) { locked = true; }
						conflictingDates = conflictingDates.concat(otherVariation.dates);
					}
				}
				var duplicates = conflictingDates.filter(function(el,i,a){ return i !== a.indexOf(el);});
				if (duplicates.length > 0 && !thisVariation.dateConflictResolved && !$scope.vm.dateConflictBeingResolved) {
					$scope.vm.dateConflictBeingResolved = true;
					showConflictDialog(index, duplicates, locked, thisVariation);
				}
			}
		},
		detectVacancyConflict: function (index) {
			if (!absrState.editMode || !absrState.context.showVacancyTimes
				|| !absrState.context.editVacancyTimes || !absrState.needSub
				|| (absrState.absr === null && !absrState.context.needSub))
				return;
			var conflictingDates = [];
			var thisVariation = absrState.absrVariations[index];
			var locked = false;

			if (thisVariation != null) {
				populateAllDates();
				conflictingDates = thisVariation.dates;
				for (var i = absrState.absrVariations.length - 1; i >= 0; i--) {
					if (i === index) { continue; }
					var otherVariation = absrState.absrVariations[i];
					if (otherVariation.institution == null) { continue; }
					if (checkVacancyTimeOverlap(thisVariation, otherVariation)) {
						if (!otherVariation.isEditable) { locked = true; }
						conflictingDates = conflictingDates.concat(otherVariation.dates);
					}
				}
				var duplicates = conflictingDates.filter(function (el, i, a) { return i !== a.indexOf(el); });
				if (duplicates.length > 0 && !thisVariation.dateVacancyConflictResolved && !$scope.vm.dateConflictBeingResolved) {
					$scope.vm.dateConflictBeingResolved = true;
					showVacancyConflictDialog(index, duplicates, locked, thisVariation);
				}
			}
		}
	};

	function populateAllDates () {
		var i = absrState.absrVariations.length;
		vm.allDates.length = 0;
		for (; i-- ;) {
			var variationData = absrState.absrVariations[i];
			vm.allDates = vm.allDates.concat(variationData.dates);
		}
	}
	function showVacancyConflictDialog (index, duplicates, locked, variation) {
		var resolveOptions = [];
		resolveOptions.push({id:1, value: 'Remove from this variation'});
		if (!locked) {
			resolveOptions.push({id:2, value: 'Keep on this variation and remove from all others'});
		}
		resolveOptions.push({ id: 3, value: 'Resolve manually' });

		var dialog = ngDialog.open({
			template:'/components/absr/cmpt-absr-details-section/date-conflict.html',
			closeByDocument: false,
			showClose:false,
			closeByEscape:false,
			closeByNavigation:true,
			data: {
				header: 'Resolve Conflicts',
				title: 'The following dates contain substitute report times that overlap with a previous variation. What would you like to do?',
				resolveOptions: resolveOptions,
				conflictingDates: absrVariationHelp.dateString(duplicates,absrState.context.dragSelectDOW,'EEE, MMM d'),
				selectedId: 1,
				buttons: [{
					title: 'Ok',
					cls:'fl-button fl-primary',
					action: function(obj){
						if (obj.id === 1) {
							$scope.vm.dateConflictBeingResolved = false;
							resolveConflictsFromThisVariation(index, duplicates);
						} else if (obj.id === 2) {
							$scope.vm.dateConflictBeingResolved = false;
							resolveConflictsFromOtherVariations(index, duplicates);
						} else if (obj.id === 3) {
							$scope.vm.dateConflictBeingResolved = false;
							variation.dateVacancyConflictResolved = true;
						}
						ngDialog.close(dialog.id);
						populateAllDates();
					}
				}]
			}
		});
	}
	function showConflictDialog(index, duplicates, locked, variation) {
		if (storageSvc.load("selectedView") != 'btnDay'){
			var resolveOptions = [];
			resolveOptions.push({ id: 1, value: 'Remove from this variation' });
			if (!locked) {
				resolveOptions.push({ id: 2, value: 'Keep on this variation and remove from all others' });
			}
			resolveOptions.push({ id: 3, value: 'Resolve manually' });

			var dialog = ngDialog.open({
				template: '/components/absr/cmpt-absr-details-section/date-conflict.html',
				closeByDocument: false,
				showClose: false,
				closeByEscape: false,
				closeByNavigation: true,
				data: {
					header: 'Resolve Conflicts',
					title: 'The following dates overlap with a previous variation. What would you like to do?',
					resolveOptions: resolveOptions,
					conflictingDates: absrVariationHelp.dateString(duplicates, absrState.context.dragSelectDOW, 'EEE, MMM d'),
					selectedId: 1,
					buttons: [{
						title: 'Ok',
						cls: 'fl-button fl-primary',
						action: function (obj) {
							if (obj.id === 1) {
								$scope.vm.dateConflictBeingResolved = false;
								resolveConflictsFromThisVariation(index, duplicates);
							} else if (obj.id === 2) {
								$scope.vm.dateConflictBeingResolved = false;
								resolveConflictsFromOtherVariations(index, duplicates);
							} else if (obj.id === 3) {
								$scope.vm.dateConflictBeingResolved = false;
								variation.dateConflictResolved = true;
							}
							ngDialog.close(dialog.id);
							populateAllDates();
						}
					}]
				}
			});
		}
	}

	function resolveConflictsFromThisVariation (index,duplicateDates) {
   		var variationData = absrState.absrVariations[index];
        for (var l = 0; l <= duplicateDates.length; l++) {
            if (variationData.dates.indexOf(duplicateDates[l]) !== -1) {
               variationData.dates.splice(variationData.dates.indexOf(duplicateDates[l]), 1);
            }
        }
	}

	function resolveConflictsFromOtherVariations (index,duplicateDates) {
		for (var i = absrState.absrVariations.length - 1; i >= 0; i--) {
			if (i === index) { continue; }
			var variationData = absrState.absrVariations[i];
	   		for (var l = 0; l <= duplicateDates.length; l++) {
 				if (variationData.dates.indexOf(duplicateDates[l]) !== -1) {
               		variationData.dates.splice(variationData.dates.indexOf(duplicateDates[l]), 1);
            	}
	   		}
		}
	}

	function checkShiftAndTimeOverlap(actualGroup, comparingGroup) {
		if (actualGroup.absenceShiftType != null){
			var actualGroupShiftType = parseInt(actualGroup.absenceShiftType.id);
			var comparingGroupShiftType = parseInt(comparingGroup.absenceShiftType.id);
			if (actualGroupShiftType === 1) {
				switch (comparingGroupShiftType) {
					case 1:
					case 2:
					case 3:
						return checkForOverlappingDates(actualGroup.dates, comparingGroup.dates);
					default:
						//Check for time Conflicts
						return haveOverlaps(actualGroup, comparingGroup);
				}
				return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
			}else if(actualGroupShiftType === 2){
				switch (comparingGroupShiftType) {
					case 1:
					case 2:
						return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
					case 3:
						return false;
					default:
						//Check for time Conflicts
						return haveOverlaps(actualGroup, comparingGroup);
				}
			}else if(actualGroupShiftType === 3){
				switch (comparingGroupShiftType) {
					case 1:
						return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
					case 2:
						return false;
					case 3:
						return checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
				default:
						//Check For time Conflicts
						return haveOverlaps(actualGroup, comparingGroup);
				}
			}else{
					//Check for time Conflicts
					return haveOverlaps(actualGroup, comparingGroup);
			}
		}
	}

	function checkVacancyTimeOverlap(actualGroup, comparingGroup) {
		if (actualGroup.absenceShiftType != null){
			var actualGroupShiftType = parseInt(actualGroup.vacancyShiftType.id);
			var comparingGroupShiftType = parseInt(comparingGroup.vacancyShiftType.id);
			if (actualGroupShiftType === 4 || comparingGroupShiftType === 4) {
				return haveVacancyOverlaps(actualGroup, comparingGroup);
			} else {
				return false; //If neither time is custom checkShiftAndTimeOverlap will catch any errors
			}
		}
	}

	function haveOverlaps(actualGroup, comparingGroup) {
	    var actualGroupStartTime = dateHelp.parseTime(actualGroup.absenceStartTime);
	    var actualGroupEndTime = dateHelp.parseTime(actualGroup.absenceEndTime);

	    var comparingGroupStartTime = dateHelp.parseTime(comparingGroup.absenceStartTime);
	    var comparingGroupEndTime = dateHelp.parseTime(comparingGroup.absenceEndTime);

	    var haveOverlappingDates = checkForOverlappingDates(actualGroup.dates,comparingGroup.dates);
	    var haveOverlappingTime = checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime);

	    return haveOverlappingDates && haveOverlappingTime;
	}

	function haveVacancyOverlaps(actualGroup, comparingGroup) {
		var actualGroupStartTime = dateHelp.parseTime(actualGroup.vacancyStartTime);
		var actualGroupEndTime = dateHelp.parseTime(actualGroup.vacancyEndTime);

		var comparingGroupStartTime = dateHelp.parseTime(comparingGroup.vacancyStartTime);
		var comparingGroupEndTime = dateHelp.parseTime(comparingGroup.vacancyEndTime);

		var haveOverlappingDates = checkForOverlappingDates(actualGroup.dates, comparingGroup.dates);
		var haveOverlappingTime = checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime);

		return haveOverlappingDates && haveOverlappingTime;
		}

	function checkForOverlappingDates(actualGroupDates,comparingGroupDates){
		var dates = actualGroupDates.concat(comparingGroupDates).map(function (dateString) {
			return {
				date: dateString,
				ms: (new Date(dateString)).getTime()
			};
		}).sort(function (a, b) { return a.ms - b.ms; });

		var duplicates = dates.filter(function(v, i, a){
			return v.ms === (a[i+1] || {}).ms;
		}).map(function (v) { return v.date; });

		return duplicates.length > 0;
	}

	function checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime) {
		var haveStartTimeOverlaps = (comparingGroupStartTime >= actualGroupStartTime && comparingGroupStartTime < actualGroupEndTime);
		var haveEndTimeOverlaps = (actualGroupStartTime >= comparingGroupStartTime && actualGroupStartTime < comparingGroupEndTime);
		return haveStartTimeOverlaps || haveEndTimeOverlaps;
	}

	function showDeleteVariationDialog (index) {
		var dialog = ngDialog.open({
			template:'/components/absr/cmpt-absr-details-section/cancel-delete.html',
			closeByDocument: false,
			data: {
				header:'Confirm Delete',
				title: 'Are you sure you want to delete this variation? This action cannot be undone.',
				buttons: [{
					title: 'Delete',
					cls:'fl-button fl-negative',
					action: function(){
						deleteVariation(index);
						ngDialog.close(dialog.id);
					}
				},{
					title: 'Cancel',
					cls:'fl-button',
					action: function(){
						ngDialog.close(dialog.id);
					}
				}]
			}
		});
	}
	function deleteVariation (index) {
		absrState.absrVariations.splice(index,1);
		populateAllDates();
	}




}

// #-- END Component (cmpt-absr-details-section) --# //
// #-----------------------------------------------# //
};});}());
