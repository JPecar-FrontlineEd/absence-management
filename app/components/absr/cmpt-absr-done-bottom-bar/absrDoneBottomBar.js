(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDoneBottomBar', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
transclude: true,
templateUrl: '/components/absr/cmpt-absr-done-bottom-bar/absrDoneBottomBar.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-absr-done-bottom-bar) ----# //
controller: function ($q, $scope, $state, stringSvc, absrSvc, absrStateVal, absenceRequestApi, parseAesopDateFilter, locationHelp) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker != null ? absrState.worker.isVacancy : false;
	var mnemonic = $scope.mnemonic = {
		absrType: isVacancy ? 'Vacancy' : 'Absence'
	};

	// View Model properties
	var vm = $scope.vm = {
		isHeld: false,
		heldUntil: absrState.heldUntil,
		holdFor30Processed: false,
		isProcessingHold: false
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Text.HoldFor30Minutes',
		'Absence.Create.Text.DeleteThis',
		'HeldUntil',
		mnemonic.absrType
	]);

	function returnToCreate(){
		if (isVacancy) {
			locationHelp.redirect('/abs-mgt/absences/create-vacancy');
		} else {
			locationHelp.redirect('/abs-mgt/absences/create-absence');
		}
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		processDelete: function () {
			if (absrState.context.hasTimeSheetData) {
				absrSvc.showTimesheetDataDialog().then(function(){
					absrSvc.showDeleteDialog().then(function(){
						returnToCreate();
					});
				});
			} else {
				absrSvc.showDeleteDialog().then(function(){
					returnToCreate();
				});
			}
		},
		processHold: function() {
			var _defer = $q.defer();
			vm.isProcessingHold = true;
			absenceRequestApi.hold({absrid: absrState.id}, {}).then(function(d) {
				var heldUntil = d.heldUntil;
				vm.isHeld = true;
				vm.heldUntil = (heldUntil !== null) ? parseAesopDateFilter(heldUntil, 'short') : '';
				vm.isProcessingHold = false;
				vm.holdFor30Processed = true;
				//Update current absr state
				absrState.absr.heldUntil = heldUntil;
				absrState.absr.isHeld = true;
				return _defer.resolve();
			}, function(){
				return _defer.resolve();
			});
			return _defer.promise;
		}
	};
}

// #-- END Component (cmpt-absr-done-bottom-bar) --# //
// #-----------------------------------------------# //
};});}());