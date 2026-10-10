(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDatePicker', function () {return {

// directive options
restrict: 'E',
scope: {
	startDate: '=',
	endDate: '=',
	dateValue:'=',
	otherDates:'=',
	dragSelectdow:'=',
	selectabledow:'=',
	minDate:'=',
	enabled:'=',
	errorMessages:'=',
	isDeletable: '=',
	uniqueId: '=?',
	selectedLocation: '=?'
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-date-picker/absrDatePicker.html',

// #-------------------------------------------# //
// #---- Component (cmpt-absr-date-picker) ----# //
controller: function ($scope, $timeout, stringSvc, regexHelp, arrayHelp ,featureSvc, dateHelp,  absrVariationHelp) {

	// View Model properties
	var vm = $scope.vm = {
		startDate: null,
		endDate: null,
		showRange: true,
		selectabledow: $scope.selectabledow,
		minSystemDate: dateHelp.getMinSystemDate(),
		disabledDates: [],
		uniqueId: $scope.uniqueId,
		SelectFromDate:'SelectFromDate',
		SelectToDate:'SelectToDate'
	};

	//Determine the start and end dates
	$scope.dateValue.sort(arrayHelp.sortDateString);
	if($scope.dateValue.length && absrVariationHelp.isRangeConsecutive($scope.dateValue, $scope.dragSelectdow)){
		vm.startDate = $scope.startDate = $scope.dateValue[0];
		vm.endDate = $scope.endDate = $scope.dateValue[$scope.dateValue.length - 1];
	}

	//Identify days that cannot be removed on the date picker (DE15632)
	if (!$scope.isDeletable){
		vm.disabledDates = $scope.dateValue;
	}

	$scope.$watch('dateValue.length', function(numDates){
		var dates = $scope.dateValue;
		setStartAndEndDates(dates, false);
	});

	function setStartAndEndDates(dates, reset){
		if (dates.length === 1) {
			var date = dates[0];
			if($scope.startDate === null || $scope.startDate.length > 0 || reset) { vm.startDate = $scope.startDate = date; }
			if($scope.endDate === null  || $scope.endDate.length > 0 || reset) { vm.endDate = $scope.endDate = date; }
			vm.showRange = true;
		} else if (dates.length > 1) {
			rangeCalculation(dates);
		} else {
			vm.startDate = $scope.startDate = null;
			vm.endDate = $scope.endDate = null;
			vm.showRange = true;
		}
	}

	function rangeCalculation(dates) {
		vm.showRange = absrVariationHelp.isRangeConsecutive(dates, $scope.dragSelectdow);
		if(vm.showRange){
			vm.startDate = $scope.startDate = dates[0];
			vm.endDate = $scope.endDate = dates[dates.length -1];
		}else{
			vm.startDate= $scope.startDate = null;
			vm.endDate = $scope.endDate = null;
		}
	}

	const isDateABoundaryValue = (date, startDate, endDate) => {
		return (+startDate === +date || +endDate === +date);
	};


	function loopDateRange(startDate, endDate, rangeSelectedFromDt = false) {
		var newRange = [];
		if(startDate == null && endDate == null) { return newRange; }
		if((startDate == null || startDate.length ===0 ) && endDate!=null &&  endDate.length>0 ){startDate = endDate;}
		if((endDate == null|| endDate.length === 0 ) && startDate!=null && startDate.length>0 ) {endDate = startDate;}

		const tempStartDate = new Date(startDate);
		const tempEndDate = new Date(endDate);

		for (var date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
			if($scope.dragSelectdow[date.getDay()] ||
				(rangeSelectedFromDt && isDateABoundaryValue(date, tempStartDate, tempEndDate))){
					newRange.push(date.toString('MM/dd/yyyy'));
			}
		}
		return newRange;
	}



	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'AbsenceRequest.DatePicker.Text.Clear',
		'AbsenceRequest.DatePicker.Text.To',
		'AbsenceRequest.DatePicker.Text.From',
		'AbsenceRequest.DatePicker.Text.CustomDateSelection',
		'AbsenceRequest.DatePicker.Text.SelectDaysYouWillBeOut',
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		changeStartDate: (val) => {
			var value = angular.isDate(val) ? val.toString('MM/dd/yyyy') : val;
			$scope.startDate = value;

			// Check if New Value is equal to Old Value
			if(angular.equals(value,vm.startDate)) { return; }
			// Check if the new Value is invalid
			if(value.length && !regexHelp.dateString().test(value)) { return; }
			// Check if the Second value is also valid then doing comparision
			if(value.length && regexHelp.dateString().test($scope.endDate) &&
				(new Date($scope.startDate) > new Date($scope.endDate))) {
					val = $scope.endDate = vm.endDate = $scope.startDate;
			}
			//if New is empty then setting VM value also to the new value
			if(value.length === 0){
				vm.startDate = val;
			}

			//Determine if we really can make this change based on any disabled dates
			var oldDateList = $scope.dateValue;
			var potentialDateUpdate = loopDateRange(val, vm.endDate, true);
			if (vm.disabledDates.length > 0 && removingDisabledDates(potentialDateUpdate)){
				//If this would remove a disabled date, reset
                $timeout(function(){
              		setStartAndEndDates(oldDateList, true);
                }, 100);
			} else {
				$scope.dateValue = potentialDateUpdate;
			}
		},
		changeEndDate: (val) => {
			var value = angular.isDate(val) ? val.toString('MM/dd/yyyy') : val;
			$scope.endDate = value;

			// Check if New Value is equal to Old Value
			if(angular.equals(value,vm.endDate)) { return; }
			// Check if the new Value is invalid
			if(value.length && !regexHelp.dateString().test(value)) { return; }
			// Check if the Second value is also valid then doing comparision
			if(regexHelp.dateString().test($scope.startDate) &&
				(new Date($scope.endDate) < new Date($scope.startDate))) {
					val = $scope.startDate = vm.startDate = $scope.endDate;
			}
			//if New is empty then setting VM value also to the new value
			if(value.length === 0){
				vm.endDate = val;
			}

			//Determine if we really can make this change based on any disabled dates
			var oldDateList = $scope.dateValue;
			var potentialDateUpdate = loopDateRange(vm.startDate, val, true);
			if (vm.disabledDates.length > 0 && removingDisabledDates(potentialDateUpdate)){
				//If this would remove a disabled date, reset
                $timeout(function(){
              		setStartAndEndDates(oldDateList, true);
                }, 100);
			} else {
				$scope.dateValue = potentialDateUpdate;
			}
		},
		clearDates: () => {
			$scope.dateValue = vm.disabledDates;
			vm.startDate = $scope.startDate = null;
			vm.endDate = $scope.endDate = null;
			vm.showRange = true;
		}
	};

	function removingDisabledDates(newDates){
		//determine if the removal of any disabled dates was attempted
		var invalidRemovalDates = vm.disabledDates.filter(function(d) { return newDates.indexOf(d) < 0});
		if (invalidRemovalDates.length > 0){
			$scope.$emit('locked-dates', {dates: invalidRemovalDates});
			return true;
		} else {
			return false;
		}
	}
}

// #-- END Component (cmpt-absr-date-picker) --# //
// #-------------------------------------------# //
};});}());
