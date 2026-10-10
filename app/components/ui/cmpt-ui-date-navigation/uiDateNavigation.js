(function() {'use strict';angular.module('aesop')
.directive('cmptUiDateNavigation', function () {return {

// directive options
restrict: 'E',
scope: {
	dateModel: '=',
	onChange: '=?',
	reportType: '=?',
	filters:'=?',
	dateError:'=?'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-date-navigation/uiDateNavigation.html',

// #------------------------------------------# //
// #---- Component (cmpt-ui-date-navigation) ----# //
controller: function ($scope, stringSvc, ngDialog, $rootScope) {


	var filters = $scope.filters;
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	if($scope.onChange == null) {
		$scope.onChange = function (){};
	}

	// View Model properties
	var vm = $scope.vm = {
		dateError: $scope.dateError,
		reportDate : $scope.dateModel
	};

	if(typeof $scope.dateModel != 'object'){
		$scope.dateModel = new Date($scope.dateModel);
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'DR.Today'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		next: function () {
			$scope.dateModel.setDate($scope.dateModel.getDate() + 1);
			vm.reportDate = $scope.dateModel = new Date($scope.dateModel.getTime());
			$scope.onChange();
		},
		prev: function () {
			$scope.dateModel.setDate($scope.dateModel.getDate() - 1);
			vm.reportDate = $scope.dateModel = new Date($scope.dateModel.getTime());
			$scope.onChange();
		},
		today: function () {
			$scope.dateModel = new Date();
			$scope.onChange();
		},
		openInputDatepicker: function(){
			$scope.dialog = ngDialog.open({
				template: '/global/modals/date-selector-with-input.html',
				showClose: false,
				closeByEscape: true,
				closeByNavigation: true,
				closeByDocument: true,
				data: {
					dateModel: $scope.dateModel,
					filters: filters
				}
			});
		}
	}

	$scope.$watch('dateModel', function () {
		vm.reportDate = $scope.dateModel.toLocaleDateString("en-US", options);
	});
   $rootScope.$on("searchfromDatePickerInputBox", function (event, newDate) {
		vm.reportDate = new Date(newDate).toLocaleDateString("en-US", options); 
	}); 
}
// #-- END Component (cmpt-ui-date-navigation) --# //
// #------------------------------------------# //
};});}());