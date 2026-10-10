(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrTimeField', function () {return {

// directive options
restrict: 'E',
scope: {
	readOnly: '=?',
	enabled: '=',
	instSettings: '=',

	shiftTypeList: '=',
	shiftType: '=',

	startTime: '=',
	endTime: '=',

	startTimeErrors: '=',
	endTimeErrors: '=',

	isSubTime: '=?',
	showByDay: '=?',

	shiftTypeId :'=?',
	shiftFromTime:'=?',
	shiftToTime:'=?',
	shiftSubFromTime:'=?',
	shiftSubToTime:'=?',
	removeShiftTypeDropdown:'=?',
	uniqueId:'@'
},
replace: true,
transclude: true,
templateUrl: '/components/absr/cmpt-absr-time-field/absrTimeField.html',

// #------------------------------------------# //
// #---- Component (cmpt-absr-time-field) ----# //
controller: function ($scope, $filter, stringSvc, dateHelp, absrStateVal, storageSvc) {
	// set isSubTime to a boolean, defaults to false if null or undefined
	var isSubTimeField = $scope.isSubTime = !!$scope.isSubTime,
		instSettings = {},
		shifts = { 1: {}, 2: {}, 3: {} };

	// View Model properties
	var vm = $scope.vm = {
		customShift: (function () {
			return $scope.shiftTypeList.filter(function (v) {
				return v.id === 4;
			})[0] || null;
		}()),
		FromTime:$scope.shiftFromTime != null ? $scope.shiftFromTime:$scope.shiftSubFromTime,
		ToTime:$scope.shiftToTime != null ? $scope.shiftToTime:$scope.shiftSubToTime,
		uniqueId: $scope.uniqueId
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([]);

	// Actions that can be bound to from the view
	var go = $scope.go = {};

	$scope.$watch('instSettings.hasSubDefaultTimes', processInstitutionTimeFields($scope.instSettings));
	$scope.$watch('instSettings', processInstitutionTimeFields);

	function processInstitutionTimeFields(instSettings) {
		var defaultPrefix;
		if (instSettings) {
			// ******************************************** //
			// Setup the default values for the shift types
			// this code assumes we have subDefaultTimes
			//

			// which defaults should we try to use
			defaultPrefix = isSubTimeField ? 'subDefault' : 'default';

			// full-day and half-day AM start time default
			shifts[1].startTime = shifts[2].startTime = $filter('time')(instSettings[defaultPrefix + 'AbsenceStartTime']);
			// full-day and half-day PM end time default
			shifts[1].endTime = shifts[3].endTime = $filter('time')(instSettings[defaultPrefix + 'AbsenceEndTime']);
			// half-day AM end time default
			shifts[2].endTime = $filter('time')(instSettings[defaultPrefix + 'AbsenceHalfDayAMEndTime']);
			// half-day PM start time default
			shifts[3].startTime = $filter('time')(instSettings[defaultPrefix + 'AbsenceHalfDayPMStartTime']);

			//
			// ******************************************** //
			// if we are not using subReportTimes and this is a subTime field
			// we need to calculate the subReportTime values based on the offsets
			//
			if (isSubTimeField && !instSettings.hasSubDefaultTimes) {
				// full-day and half-day AM start time default
				shifts[1].startTime = shifts[2].startTime = dateHelp.offSetTime(
					instSettings.defaultAbsenceStartTime, // original time
					instSettings.defaultVacancyStartOffsetMinutes, // amount to offset
					'hh:mm T' // format we want back
				);
				// full-day and half-day PM end time default
				shifts[1].endTime = shifts[3].endTime = dateHelp.offSetTime(
					instSettings.defaultAbsenceEndTime, // original time
					instSettings.defaultVacancyEndOffsetMinutes, // amount to offset
					'hh:mm T' // format we want back
				);
				// half-day PM start time default
				shifts[3].startTime = dateHelp.offSetTime(
					instSettings.defaultAbsenceHalfDayPMStartTime, // original time
					instSettings.defaultVacancyStartOffsetMinutes, // amount to offset
					'hh:mm T' // format we want back
				);
				// half-day AM end time default
				shifts[2].endTime = dateHelp.offSetTime(
					instSettings.defaultAbsenceHalfDayAMEndTime, // original time
					instSettings.defaultVacancyEndOffsetMinutes, // amount to offset
					'hh:mm T' // format we want back
				);
			}

			setTimes();
		}

	}

	$scope.$watch('shiftType', setTimes);

	// watch for the user to change the start and end times
	// switch shift type to custom
	$scope.$watchGroup(['startTime', 'endTime'], function (newVals) {

		if (newVals[0] != undefined && newVals[1] != undefined) {
		var newStartTime = $filter('time')(newVals[0]),
			newEndTime = $filter('time')(newVals[1]),
			typeId = $scope.shiftType && $scope.shiftType.id || null;

		// WHEN TO GIVE UP
		// when type is already custom
		if (!typeId || typeId === 4) { return; }
		// when custom is not an option
		if (vm.customShift == null) { return; }
		// when the start and end time are not supplied
		if (newStartTime == null || newEndTime == null) { return; }
		// when the shift doesn't have start or end times
		if (shifts[typeId].startTime == null || shifts[typeId].endTime == null) { return; }

		if(isSubTimeField && !$scope.readOnly && !$scope.enabled){
			$scope.startTime = newStartTime =  shifts[typeId].startTime;
			$scope.endTime = newEndTime = shifts[typeId].endTime;
		}

		// if the times changed, set type to custom
		if ((shifts[typeId].startTime !== newStartTime || shifts[typeId].endTime !== newEndTime) && !$scope.readOnly
			&& !$scope.removeShiftTypeDropdown) {
			$scope.shiftType = vm.customShift;
		}
		}
	});

	function setTimes() {
		if (!$scope.removeShiftTypeDropdown){
		var typeId = $scope.shiftType && $scope.shiftType.id || null,
			firstShiftTypeOption = $scope.shiftTypeList[0] && $scope.shiftTypeList[0].id || null;

		if ((typeId != null && typeId < 4 && instSettings) && !$scope.readOnly) {
			$scope.startTime = shifts[typeId].startTime;
			$scope.endTime = shifts[typeId].endTime;

		// if custom is the only option in the list, use the default values from the context
		} else if ($scope.shiftTypeList.length === 1 && firstShiftTypeOption != null) {
			// if the first shift type is 4, we need to default it to full day
			// because shifts[4] doesn't exist.
			if (firstShiftTypeOption === 4 &&
				($scope.startTime == null || $scope.startTime == '') &&
				($scope.endTime == null || $scope.endTime == '')) { firstShiftTypeOption = 1; }
			
				$scope.startTime = ($scope.startTime == null || $scope.startTime == '') ?
									shifts[firstShiftTypeOption].startTime :
									$scope.startTime;

				$scope.endTime = ($scope.endTime == null || $scope.endTime == '') ?
								shifts[firstShiftTypeOption].endTime :
								$scope.endTime;
			}
		}
	}
}

// #-- END Component (cmpt-absr-time-field) --# //
// #------------------------------------------# //
};});}());