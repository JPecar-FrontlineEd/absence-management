(function() {'use strict';angular.module('aesop')
.directive('cmptApproveFilterPanel', function () {return {

// directive options
restrict: 'E',
scope: {
	filter:'='
},
replace: true,
templateUrl: '/components/approve/cmpt-approve-filter-panel/approveFilterPanel.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-approve-filter-panel) ----# //
controller: function ($scope, stringSvc, permissionSvc, budgetCodeSvc, accountingCodeApi,absrVariationHelp,reportHelp,parseDateFilter,stringHelp, domHelp) {

	var filter = angular.copy($scope.filter);
	// View Model properties
	var vm = $scope.vm = {
		startDate: new Date().addDays(-7),
		endDate: new Date().addDays(45),
		budgetCodeList: [],
		accountingCodeList:[],
		startDateError:false,
		endDateError:false,
		errorMessages:'',
		filter: filter,
		removeMessages: function() {
			vm.errorMessages = '';
			vm.endDateError = false;
			vm.startDateError = false;
		}
	};

	filter.startDate = $scope.filter.startDate = vm.startDate;
	filter.endDate = $scope.filter.endDate = vm.endDate;

	var canViewBudgetCode = permissionSvc.iHave('ABSR.DTLSBDCD');
	if(canViewBudgetCode){
		budgetCodeSvc.ready.then(function(budgetCodeData){
			if(budgetCodeData.length){
				vm.budgetCodeList = budgetCodeData.map(function(v){
					return { id:v.id, value:v.description };
				});
			}
		});
	}
	var canViewAccountingCode = permissionSvc.iHave('ABSR.DTLSACCD');
	if(canViewAccountingCode){
		// fetch accounting codes
		accountingCodeApi.get({
			fields: '(id,name)'
		}).then(function (accountingCodes) {
			if(accountingCodes.length){
				vm.accountingCodeList =  accountingCodes.map(function(v){
					return { id:v.id, value:v.name };
				});
			}
		});
	}


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'ApprovalList.Label.Text.StartDate',
		'ApprovalList.Label.Text.EndDate',
		'Search',
		'Status',
		'Unapproved',
		'PartiallyApproved',
		'Approved',
		'Denied',
		'AccountingCode',
		'BudgetCode',
		'Option.Text.AllAccountingCodes',
		'Option.Text.AllBudgetCodes',
		'Error',
		'Dismiss',
		'Validation.Message.Field.StartDate',
		'Validation.Message.Substring.IsInvalid',
		'Validation.Message.Field.EndDate',
		'Validation.Message.StartDateAfterEndDate',
		'Validation.Message.EndDateBeforeStartDate',
		'Validation.Message.DateRangeDaysTooLarge',
		'SelectAccountingCode',
		'SelectBudgetCode',
		'SelectFromDate',
		'SelectToDate'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		search: function () {
			vm.removeMessages();
			vm.errorMessages = validateDates();
			if(vm.errorMessages===''){
				filter.startDate = vm.startDate;
				filter.endDate = vm.endDate;
			}
		}
	};

	//this funciton was carried over from reportsfilterpanel.js
	function validateDates() {
		if (!reportHelp.IsDateValid(vm.startDate)) {
			//start date not valid
			vm.startDateError = true;
			return $scope.strings['Validation.Message.Field.StartDate'] + ' ' + $scope.strings['Validation.Message.Substring.IsInvalid'];
		} else if (!reportHelp.IsDateValid(vm.endDate)) {
			//end date not valid
			vm.endDateError = true;
			return $scope.strings['Validation.Message.Field.EndDate'] + ' ' + $scope.strings['Validation.Message.Substring.IsInvalid'];
		} else if (!reportHelp.IsBefore(vm.startDate, vm.endDate)) {
			//start date after end date
			vm.startDateError = true;
			return $scope.strings['Validation.Message.StartDateAfterEndDate'];
		} else if (!reportHelp.IsAfter(vm.endDate, vm.startDate)) {
			//end date is not after start date
			vm.endDateError = true;
			return $scope.strings['Validation.Message.EndDateBeforeStartDate'];
		} else if (!reportHelp.DateRangeLessMax(vm.startDate, vm.endDate)) {
			//search for greater then 365
			vm.startDateError = true;
			vm.endDateError = true;
			return stringHelp.replace($scope.strings['Validation.Message.DateRangeDaysTooLarge'], '{0}', 365);
		} else if (reportHelp.IsBefore(vm.startDate, '1/1/1900')) {
			//start date less then system date
			vm.endDateError = true;
			vm.startDateError = true;
			return 'Value of ' + parseDateFilter(vm.startDate, 'M/d/yyyy') + ' is less than the minimum value of 01/01/1900';
		} else {
			return '';
		}
	}

	$scope.$watchCollection('vm.filter', function (nF, oF) {
		domHelp.rAF().then(function () {
			Object.keys($scope.filter).forEach(function (k) { delete $scope.filter[k]; });
			Object.keys(nF).forEach(function (k) {
				$scope.filter[k] = nF[k];
			});
		});
	});
}

// #-- END Component (cmpt-approve-filter-panel) --# //
// #-----------------------------------------------# //
};});}());