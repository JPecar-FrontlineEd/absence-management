(function() {'use strict';angular.module('aesop')
.directive('cmptUiMultiDatepicker', function () {return {

// directive options
restrict: 'E',
scope: {
	dateValue:'=',
	otherDates:'=',
	dragSelectdow:'=',
	selectabledow:'=',
	minDate:'=',
	enabled:'=',
	errorMessages:'=',
	disabledDates: '='
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-multi-datepicker/uiMultiDatepicker.html',

// #----------------------------------------------# //
// #---- Component (cmpt-ui-multi-datepicker) ----# //
controller: function ($scope, $timeout, domHelp, stringSvc, absrSvc, absrStateVal, storageSvc, featureSvc, relatedCalendarDataSvc) {
	var otherDates = [];
		// View Model properties
	var vm = $scope.vm = {
		jqMultiDatePlugins: {
			multiDatesPicker:{
				dragSelect:true,
				dragSelectDOW: $scope.dragSelectdow,
				minDate: $scope.minDate,
				selectOtherMonths:true,
				selectableDOW: $scope.selectabledow,
				showOtherMonths:true
			}
		},
		isVacancy : absrStateVal.worker.isVacancy,
		showRelatedCalendarData : featureSvc.get("ShowRelatedCalendarData").enabled
	};


	function addDate (dates,type) {
		if(dates.length > 0){
			$scope.$el.multiDatesPicker('addDates', dates, type);
		}
	}
	function removeDates (dates) {
		if(dates.length > 0){
			$scope.$el.multiDatesPicker('removeDates', dates);
		}
	}
	function editMode (mode) {
		$scope.$el.multiDatesPicker('setEditable', mode);
	}
	function setDates (dates) {
		$scope.dateValue = dates;
		$scope.$root.safeApply();
	}

	var months = [
		'January', 'February', 'March', 'April', 'May',
		'June', 'July', 'August', 'September',
		'October', 'November', 'December'
		];

	function monthNameToNum(monthname) {
		var month = months.indexOf(monthname);
		return month ? month : 0;
	}

	$scope.$on("institutionSelected", function(evt, data){
		$scope.selectedInstId = data;
		$scope.$el.trigger("loadComplete");
	});

	$scope.$watch('$el',function (el) {
		if (!el) return;
		if ($scope.vm.showRelatedCalendarData) {
			el.on("loadComplete", function() {
				let compId = this.id;
				var instituteId = $scope.selectedInstId ? $scope.selectedInstId : absrStateVal.worker.schoolId;
				var isInstitutionSelected = $scope.selectedInstId !== undefined;
				if (!(absrStateVal.worker.schools.length === 1 || isInstitutionSelected)) return;

				var month = $scope.$el.find('.ui-datepicker-month') != undefined ? monthNameToNum($scope.$el.find('.ui-datepicker-month').eq(0).text()) : new Date(absrStateVal.absrVariations[0].startDate).getMonth();
				var year = $scope.$el.find('.ui-datepicker-year') != undefined ? parseInt($scope.$el.find('.ui-datepicker-year').eq(0).text()) : new Date(absrStateVal.absrVariations[0].startDate).getFullYear();

				let localRci = relatedCalendarDataSvc.getLocalCachedData(month+1, year, instituteId, compId, "uiMultiDatepicker.js");
				if (localRci.isPlaceholder && !localRci.getApiRelatedData) return;
				
				if (localRci.getApiRelatedData) {
					var startDate = new Date(year, month, 1).toString('MM/dd/yyyy');
					var endDate = new Date(year, month + 1, 0).toString('MM/dd/yyyy');
					var response = absrSvc.relatedCalendarData(startDate, endDate, absrStateVal.worker.id, instituteId, !absrStateVal.worker.isVacancy, true, absrStateVal.worker.isVacancy);
					response.then((result)=>{
						localRci.saveResults(result);
					})
					.catch((err)=>{
						console.log(err);
					})
				}	
				
				Promise.all([response, localRci.value]).then(function(values) {
					relatedCalendarDataSvc.writeDots($scope.$el, values, absrStateVal.worker.isVacancy, compId, "uiMultiDatePicker.js", true);
				});
			});
		}

		el.on('change',function(){
			var dates = $scope.$el.multiDatesPicker('getDates');
			//determine if the removal of any disabled dates was attempted
			var invalidRemovalDates = $scope.disabledDates.filter(function(d) { return dates.indexOf(d) < 0});
			if (invalidRemovalDates.length > 0){
				dates = dates.concat(invalidRemovalDates);
				addDate(invalidRemovalDates, null);
				$scope.$emit('locked-dates', {dates: invalidRemovalDates});
			}
			setDates(dates);
		});

		if($scope.dateValue.length > 0){
			addDate($scope.dateValue, null);
			$scope.$el.multiDatesPicker('setVisibleDate', $scope.dateValue[0]);
		}

		$scope.$watchCollection('dateValue',function(nDates, oDates){
			if(oDates.length > 0){
				removeDates(oDates);
			}
			if(nDates.length > 0){
				addDate(nDates, null);
			}
		});
		$scope.$watch('enabled',function(value){
			editMode(value);
		});
		$scope.$watchCollection('otherDates',function(nVal,oVal){
			var allDates = [];
			Object.keys(nVal).forEach(function(v){
				allDates = allDates.concat(nVal[v]);
			});

			allDates = allDates.filter(function(v,i){ return allDates.indexOf(v) === i; });

			Object.keys(nVal).forEach(function(v){
				var dates= $scope.$el.multiDatesPicker('getDates');
				$scope.$el.multiDatesPicker('removeDates', otherDates, v);
				otherDates =  nVal[v].filter(function(a){ return dates.indexOf(a) === -1; });
				addDate(otherDates,v);
			});
		});
		$scope.strings = stringSvc.getStrings([
			'Absence',
			'InService',
			'Closed',
			'Vacancy'
		]);
	});
},

link: function (scope, element, attrs) {
	scope.$el = element.find('div.multi-datepicker');
}
// #-- END Component (cmpt-ui-multi-datepicker) --# //
// #----------------------------------------------# //
};});}());
