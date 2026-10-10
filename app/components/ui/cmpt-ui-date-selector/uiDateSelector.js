(function() {'use strict';angular.module('aesop')
.directive('cmptUiDateSelector', function () {return {

// directive options
restrict: 'E',
scope: {
	dateModel: '=',
	gotError:'=',
	maxDate: '=?',
	minDate: '=?',
	label: '=?',
	reportType: '=?',
	selectedLocation: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-date-selector/uiDateSelector.html',

// #--------------------------------------# //
// #---- Component (cmpt-ui-date-selector) ----# //
controller: function ($scope, $timeout,stringSvc, absrStateVal, storageSvc, absrSvc, featureSvc, relatedCalendarDataSvc) {
	var datePickerOpen = false;

	if ($scope.manualUpdate == null) { $scope.manualUpdate = true;}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		setDate: function (date) {
			$scope.$el.datepicker('setDate', date);
		},
		select: function (newDate) {
			$scope.$root.safeApply(function () {
				go.setDate(newDate);
				$scope.dateModel = $scope.$el.datepicker('getDate');
			});
		},
		blur:function(){
			if(!datePickerOpen){
				go.select($scope.$el.val());
			}
		},
	};

	function monthNameToNum(monthname) {
		var month = months.indexOf(monthname);
		return month ? month : 0;
	}

	var months = [
		'January', 'February', 'March', 'April', 'May',
		'June', 'July', 'August', 'September',
		'October', 'November', 'December'
		];
		
	var showRelatedCalendarData = featureSvc.get("ShowRelatedCalendarData").enabled;

	$scope.$watch('$el',function (elm) {
		if (!elm) return;
		if (!showRelatedCalendarData) return;

		elm.on("loadComplete", function(){
			if (!datePickerOpen) return;

			let compId = this.id;
			var instituteId = null;

			if($scope.selectedLocation !== undefined && $scope.selectedLocation !== null){
				instituteId = $scope.selectedLocation.id ? $scope.selectedLocation.id : $scope.selectedLocation;
			}

			var isInstitutionSelected = $scope.selectedLocation != undefined || $scope.selectedLocation != null;
			if (!isInstitutionSelected) return;

			var month = $scope.$elm.find('.ui-datepicker-month') != undefined ? monthNameToNum($scope.$elm.find('.ui-datepicker-month').eq(0).text()) : new Date(absrStateVal.absrVariations[0].startDate).getMonth();
			var year = $scope.$elm.find('.ui-datepicker-year') != undefined ? parseInt($scope.$elm.find('.ui-datepicker-year').eq(0).text()) : new Date(absrStateVal.absrVariations[0].startDate).getFullYear();

			let localRci =  relatedCalendarDataSvc.getLocalCachedData(month+1, year, instituteId, compId, "uiDateSelector.js");
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
				relatedCalendarDataSvc.writeDots($scope.$elm, values, absrStateVal.worker.isVacancy, compId, "uiDateSelector.js", false);
			});
				
		});					
	});

	// View Model properties
	var vm = $scope.vm = {
		jqInputPlugins: {
			datepicker: {
				showOn: 'button',
				buttonText: '',
				onSelect: go.select,
				maxDate:$scope.maxDate,
				minDate:$scope.minDate,
				beforeShow:function(input, inst){
					datePickerOpen=true;
					// Handle calendar position before showing it.
					// It's not supported by Datepicker itself (for now) so we need to use its internal variables.
					var calendar = inst.dpDiv;

					// Dirty hack, but we can't do anything without it (for now, in jQuery UI 1.8.20)
					setTimeout(function() {
						calendar.position({
							my: 'center top',
							at: 'right bottom',
							collision: 'none',
							of: input
						});
					}, 1);
				},
				onClose:function(){
					datePickerOpen=false;
				}
			}
		}
	};

	$scope.$watch('dateModel', function (nDate) {
		go.setDate(nDate);
	});
},
link: function (scope, element, attrs) {
	scope.$el = element.find('input');
	scope.$elm = $('#ui-datepicker-div');
}
// #-- END Component (cmpt-ui-date-selector) --# //
// #--------------------------------------# //
};});}());
