(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrWeekdaysCheckboxes', function () {return {

// directive options
restrict: 'E',
scope: {
	variationData:'=',
	datesOnly:'=',
	dragSelectDow: '=',
	dateRange:'=',
	entireDateRange:'='
},
transclude:true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-weekdays-checkboxes/absrWeekDaysCheckboxes.html',
controller: function($scope, $rootScope, absrStateVal)
{
	$scope.enabledCheckboxes = angular.copy($scope.dragSelectDow);
	$scope.isAllowedOnNoAbsenceDays = absrStateVal.context.IsAllowedOnNoAbsenceDays;
	$scope.weekdayArray= ['Su','M','Tu','W','Th','F','Sa'];
	$scope.onClick= function(index){
		var dateRangeDict = [];
		$scope.dragSelectDow[index]=!$scope.dragSelectDow[index];
		$scope.entireDateRange.forEach(element => {
			dateRangeDict.push({key: element, value: $scope.dragSelectDow[new Date(element).getDay()]});
		});

        var dateRangeArray=[];
		dateRangeDict.forEach(date => {
			if(date.value)
			{
				dateRangeArray.push(date.key);
			}
		});
		$scope.dateRange=dateRangeArray;
		$rootScope.$emit("weekDaysCheckboxChanged");
	}
	
	
}
};});}());