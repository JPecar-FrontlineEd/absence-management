(function() {'use strict';angular.module('aesop')
.directive('cmptReferenceDataBalanceYear', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/reference-data/absence-reasons/cmpt-reference-data-balance-year/referenceDataBalanceYear.html',

// #------------------------------------------------------# //
// #---- Component (cmpt-reference-data-balance-year) ----# //
controller: function ($q, $scope, stringSvc,
					organizationApi, toastHelp, dateHelp,
					permissionSvc, ngDialog) {


	const canEdit = permissionSvc.iHave('REFDATA.REFDATAEDIT');

	// View Model properties
	var vm = $scope.vm = {
		canEdit,
		loading: false,
		label: null,
		balanceYearVm: {}
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Error',
		'Success',
		'Save',
		'Cancel',
		'Edit',
		'balanceYear.Save.message',
		'balanceYear.modal.body.text',
		'balanceYear.modal.header.EditBalanceYearStart',
		'balanceYear.label.BalanceYearStart',
		'balanceYear.hireDate',
		'balanceYear.label.ByUserHireDate'
	]);

	fetchBalanceStartDate();

	$scope.$watch('vm.balanceYearVm.month', function(nMonth,oMonth){
		if(angular.isUndefined(nMonth)) { return; }
		var dayList = dateHelp.getDaysByMonth(nMonth.id).map(function(x) { return { id: x, value: x }; });
		vm.balanceYearVm.dayList = dayList;
		if((vm.balanceYearVm.day && dayList.filter(x => x.id === vm.balanceYearVm.day.id).length === 0)){
			vm.balanceYearVm.day = { id: 1, value: 1 };
		}
		setStartDate();
	});

	$scope.$watch('vm.balanceYearVm.day', function(nDay,oDay){
		if(angular.isUndefined(nDay)) { return; }
		if(angular.equals(nDay,oDay)) { return; }
		setStartDate();
	});



	function setupBalanceYearVm(balanceYear) {
		var month = Date.parse(balanceYear.startDate).toString('M');
		var day = Date.parse(balanceYear.startDate).getDate();
		var monthList =  dateHelp.getMonths();
		var dayList = dateHelp.getDaysByMonth(month).map(function(x) { return { id: x, value: x }; });

		balanceYear.month = monthList.filter(x => x.id === parseInt(month))[0];
		balanceYear.day = dayList.filter(x => x.id === day)[0];
		balanceYear.monthList = monthList;
		balanceYear.dayList = dayList;
		vm.balanceYearVm = balanceYear;
		vm.label = balanceYear.isHireDate ? strings['balanceYear.hireDate'] :  dateHelp.monthDateOrdinal(balanceYear.startDate);
	}
	function setStartDate() {
		var date = new Date();
		var year = date.getFullYear();
		var month = vm.balanceYearVm.month.id - 1;
		var day = (vm.balanceYearVm.day) ? vm.balanceYearVm.day.id : 1;
		vm.balanceYearVm.startDate = new Date(year, month, day).toString('MM/dd/yyyy');
	}
	function fetchBalanceStartDate() {
		vm.loading = true;
		organizationApi.balanceStartDate().then(function(balanceYear){
			go.copyHandler.set(balanceYear);
			setupBalanceYearVm(balanceYear);
			vm.loading = false;
		}, function(error){
			vm.loading = false;
			toastHelp.error(error.$messages, strings['Error']);
		});
	}


	function balanceYearDialog() {
		var dialog = ngDialog.open({
			template: '/components/reference-data/absence-reasons/templates/balance-year-modal.html',
			closeByDocument: false,
      closeByNavigation: false,
			showClose: false,
			data: {
				header: strings['balanceYear.modal.header.EditBalanceYearStart'],
	            body: strings['balanceYear.modal.body.text'],
				balanceYearVm: vm.balanceYearVm,
				strings,
				buttons: [{
					title: strings['Save'],
					loading: false,
					cls:'fl-button fl-positive',
					action: function() {
						var button = this;
						if(!button.loading){
							button.loading = true;
							save().then(function(balanceYear){
								go.copyHandler.set(balanceYear);
								setupBalanceYearVm(balanceYear);
								toastHelp.success(strings['balanceYear.Save.message'], strings['Success']);
								button.loading = false;
								ngDialog.close(dialog.id);
							}, function (error) {
								button.loading = false;
								toastHelp.error(error.$messages, strings['Error']);
							});
						}
					}
				},{
					title: strings['Cancel'],
					loading: false,
					cls:'fl-button',
					action: function() {
						setupBalanceYearVm(go.copyHandler.get());
						ngDialog.close(dialog.id);
					}
				}]
			}
		});
	}

	function save() {
		var _defer = $q.defer();
		var method = (vm.balanceYearVm.id > 0) ? 'update' : 'create';
		organizationApi[method + 'BalanceStartDate']({ id: vm.balanceYearVm.id }, vm.balanceYearVm).then(function(data){
			_defer.resolve(data);
		}, function(error){
			_defer.reject(error);
		});
		return _defer.promise;
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		balanceYearDialog,
		copyHandler: (function(){
			var copy = {};
			return {
				set: function(data) { copy = angular.copy(data); },
				get: function(){ return angular.copy(copy); }
			};
		})()
	};
}

// #-- END Component (cmpt-reference-data-balance-year) --# //
// #------------------------------------------------------# //
};});}());
