(function() {'use strict';angular.module('aesop')
.directive('cmptUiQuickDateSelector', function () {return {

// directive options
restrict: 'E',
scope: {
	startDateModel: '=',
	endDateModel: '=',
	gotError:'=',
	selected: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-quick-date-selector/uiQuickDateSelector.html',

// #-------------------------------------------------# //
// #---- Component (cmpt-ui-quick-date-selector) ----# //
controller: function ($scope, stringSvc,parseDateFilter) {

	if($scope.selected == null ){ $scope.selected = 'thisWeek';}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Reports.Filter.DateRange.ThisWeek',
		'Reports.Filter.DateRange.LastWeek',
		'Reports.Filter.DateRange.ThisMonth',
		'Reports.Filter.DateRange.LastMonth',
		'Reports.Filter.DateRange.ThisYear',
		'Reports.Filter.DateRange.LastYear',
		'Reports.Filter.DateRange.ThisSchoolYear',
		'Reports.Filter.DateRange.LastSchoolYear',
		'Reports.Filter.DateRange.Custom'
	]);

	// Actions that can be bound to from the view

	// View Model properties
	var vm = $scope.vm = {
		quickOptions: [{
			title:strings['Reports.Filter.DateRange.ThisWeek'],
			value:'thisWeek'
		},{
			title:strings['Reports.Filter.DateRange.LastWeek'],
			value:'lastWeek'
		},{
			title:strings['Reports.Filter.DateRange.ThisMonth'],
			value:'thisMonth'
		},{
			title:strings['Reports.Filter.DateRange.LastMonth'],
			value:'lastMonth'
		},{
			title:strings['Reports.Filter.DateRange.ThisYear'],
			value:'thisYear'
		},{
			title:strings['Reports.Filter.DateRange.LastYear'],
			value:'lastYear'
		},{
			title:strings['Reports.Filter.DateRange.ThisSchoolYear'],
			value:'thisSchoolYear'
		},{
			title:strings['Reports.Filter.DateRange.LastSchoolYear'],
			value:'lastSchoolYear'
		},{
			title:strings['Reports.Filter.DateRange.Custom'],
			value:'custom'
		}]
	};



	var go = $scope.go = {

	};

	var date;


	$scope.$watch('selected', function (newValue,oldValue) {
		if(newValue !==oldValue){
			if(newValue!=='custom'){
				date = new Date();


				var ranges = getRangeObject(date);
				$scope.startDateModel = ranges[newValue].start;
				$scope.endDateModel = ranges[newValue].end;
			}

		}
	});

	$scope.$watchGroup(['startDateModel','endDateModel'], function (newDates,oldDates) {
		var start = $scope.startDateModel;
		var end = $scope.endDateModel;
		var found = false;
		date = new Date();
		var ranges = getRangeObject(date);
		angular.forEach(ranges,function(value,key){
			if(parseDateFilter(value.start, 'MM/dd/yyyy')===parseDateFilter(start, 'MM/dd/yyyy') && parseDateFilter(value.end, 'MM/dd/yyyy')===parseDateFilter(end, 'MM/dd/yyyy')){
				$scope.selected = key;
				found = true;
			}
		});

		if(!found){
			$scope.selected='custom';
		}



	});

	function getRangeObject(date){
		var thisYearStartDiff=date.getMonth() > 5 ? 0 : 1;
		var thisYearEndDiff=date.getMonth() < 5 ? 0 : 1;
		var lastYearStartDiff=date.getMonth() > 5 ? 1 : 2;
		var lastYearEndDiff=date.getMonth() < 5 ? 1 : 0;
		return {
			'thisWeek':{
				start : new Date(date.setDate(date.getDate() - date.getDay())),
				end : new Date(date.setDate(date.getDate() - date.getDay()+6))
			},
			'lastWeek':{
				start : new Date(date.setDate(date.getDate() - (date.getDay()+7))),
				end : new Date(date.setDate(date.getDate() - date.getDay()+6))
			},
			'thisMonth':{
				start : new Date(date.getFullYear(), date.getMonth(), 1),
				end : new Date(date.getFullYear(), date.getMonth() + 1, 0)
			},
			'lastMonth':{
				start : new Date(date.getFullYear(), (date.getMonth()-1), 1),
				end : new Date(date.getFullYear(), date.getMonth(), 0)
			},
			'thisYear':{
				start : new Date(date.getFullYear(), 0, 1),
				end : new Date(date.getFullYear(), 11, 31)
			},
			'lastYear':{
				start : new Date((date.getFullYear()-1), 0, 1),
				end : new Date((date.getFullYear()-1), 11, 31)
			},
			'thisSchoolYear':{
				start : new Date(date.getFullYear() - thisYearStartDiff, 6, 1),
				end : new Date(date.getFullYear()+thisYearEndDiff, 5, 30)
			},
			'lastSchoolYear':{
				start : new Date(date.getFullYear() - lastYearStartDiff, 6, 1),
				end : new Date(date.getFullYear()-lastYearEndDiff, 5, 30)
			}
		};
	}


}

// #-- END Component (cmpt-ui-quick-date-selector) --# //
// #-------------------------------------------------# //
};});}());