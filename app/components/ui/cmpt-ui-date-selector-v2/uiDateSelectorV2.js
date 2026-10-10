(function() {'use strict';angular.module('aesop')
.directive('cmptUiDateSelectorV2', function (domHelp) {return {

// directive options
restrict: 'E',
scope: {
	name:'@',
	valueText:'=',
	formValue:'=',
	required: '=?',
	maxLength:'=?',
	maxDate: '=?',
	minDate: '=?',
	placeholder: '@',
	onChange: '=?',
	alloweddow: '=?', //array of boolean, each index represent the week of the day
	uniqueId: '@',
	buttonLabel:'=?',
	selectedSchools: '=?',
	selectedLocation: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-date-selector-v2/uiDateSelectorV2.html',

// #----------------------------------------------# //
// #---- Component (cmpt-ui-date-selector-v2) ----# //
controller: function ($scope, $timeout, parseDateFilter, regexHelp,stringSvc,absrStateVal, storageSvc, absrSvc, featureSvc, relatedCalendarDataSvc) {

	var DATE_REGEXP = regexHelp.dateString();

	if($scope.required == null){
		$scope.required = false;
	}
	if($scope.name == null){
		$scope.name = '';
	}

	if($scope.maxLength == null){
		$scope.maxLength = '';
	}

	var datePickerOpen = false;

	if($scope.required == null){
		$scope.required = false;
	}

	if($scope.alloweddow == null){
		$scope.alloweddow = [];
	}

	if($scope.placeholder == null){
		$scope.placeholder = '';
	}

	if($scope.onChange == null){
		$scope.onChange = function(){};
	}

	if($scope.buttonLabel == null) {
		$scope.buttonLabel = '';
	}

	// View Model properties
	var vm = $scope.vm = {
		dummyVal: null
	}

	var buttonLabel = $scope.buttonLabel;
	

	var strings = $scope.strings = stringSvc.getStrings([buttonLabel, 'MultiLocation.OverlapIndicator.Message']);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		setDate: function (date) {
			$scope.$el.datepicker('setDate', date);
		},
		select: function (newDate) {
			$scope.$root.safeApply(function () {
				applyValue(newDate);
			});
		},
		blur:function(value){
			if(!datePickerOpen){
				go.select($scope.$el.val());
			}
		},
		applyLimit: function(){
			$scope.$el.datepicker('option', 'minDate', (DATE_REGEXP.test($scope.minDate) || angular.isDate($scope.minDate)) ? $scope.minDate : null);
			$scope.$el.datepicker('option', 'maxDate', (DATE_REGEXP.test($scope.maxDate) || angular.isDate($scope.maxDate)) ? $scope.maxDate: null);
		}
	};


	function applyValue(val) {
		if (!DATE_REGEXP.test(val)) {
			$scope.onChange(val);
		}else{
			go.applyLimit();
			go.setDate(val);
			var date = $scope.$el.datepicker('getDate').toString('MM/dd/yyyy');
			$scope.onChange(date);
			$scope.valueText = date;
		}
	}

	// View Model properties
	var vm = $scope.vm = {
		jqInputPlugins: {
			datepicker: {
				showOn: 'button',
				buttonText: '',
				buttonLabel: strings[buttonLabel],
				maxDate:$scope.maxDate,
				minDate:$scope.minDate,
				onSelect: go.select,
				beforeShow:function(){
					go.applyLimit();
					datePickerOpen=true;
				},
				onClose:function(){
					datePickerOpen=false;
				}
			}
		},
		uniqueId: $scope.uniqueId,
		showRelatedCalendarData : featureSvc.get("ShowRelatedCalendarData").enabled
	};

	$scope.$watch('valueText', function (nDate) {
		go.setDate(nDate);
		//This dummay val is created just for the validaitons to work
		//whatever value we are setting on value text is also setting on dummay value
		vm.dummyVal = (DATE_REGEXP.test(nDate) || angular.isDate(nDate)) ? nDate : null;
	});

	function monthNameToNum(monthname) {
		var month = months.indexOf(monthname);
		return month ? month : 0;
	}
	var months = [
		'January', 'February', 'March', 'April', 'May',
		'June', 'July', 'August', 'September',
		'October', 'November', 'December'
		];

	$scope.$watch('$el',function (elm) {
		if (!elm) return;
		if (!vm.showRelatedCalendarData) return;

		elm.on("loadComplete", function(){
			if (!datePickerOpen) return;

			let compId = this.id;
			var instituteId = null;
			var isMoreThanOneSchoolSelected = false;
			var relatedCalendarData = null;
			
			if($scope.selectedLocation !== undefined && $scope.selectedLocation !== null){
				instituteId = $scope.selectedLocation.id ? $scope.selectedLocation.id : $scope.selectedLocation;
			}
			else if($scope.selectedSchools!= null && $scope.selectedSchools!= undefined){
				instituteId = $scope.selectedSchools.length == 1? $scope.selectedSchools[0]: undefined;
				isMoreThanOneSchoolSelected = $scope.selectedSchools.length > 1;
			}
			
			if (isMoreThanOneSchoolSelected){
				$scope.$elm.append("<div class='conflictMessage'>" + strings['MultiLocation.OverlapIndicator.Message'] + "</div>");
				return;
			}
			
			instituteId = instituteId ? instituteId : absrStateVal.worker.schoolId;
			var isInstitutionSelected = $scope.selectedSchools !== undefined &&  $scope.selectedSchools !== null && $scope.selectedSchools.length == 1 || ($scope.selectedLocation != undefined || $scope.selectedLocation != null);
			if (!(absrStateVal.worker.schools.length === 1 || isInstitutionSelected)) return;

			var month = $scope.$elm.find('.ui-datepicker-month') != undefined ? monthNameToNum($scope.$elm.find('.ui-datepicker-month').eq(0).text()) : new Date(absrStateVal.absrVariations[0].startDate).getMonth();
			var year = $scope.$elm.find('.ui-datepicker-year') != undefined ? parseInt($scope.$elm.find('.ui-datepicker-year').eq(0).text()) : new Date(absrStateVal.absrVariations[0].startDate).getFullYear();

			let localRci =  relatedCalendarDataSvc.getLocalCachedData(month+1, year, instituteId, compId, "uiDateSelectorV2.js");
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
				relatedCalendarDataSvc.writeDots($scope.$elm, values, absrStateVal.worker.isVacancy, compId, "uiDateSelectorV2.js", false);
			});			 
		});
		
	});

	if($scope.alloweddow.length){
		vm.jqInputPlugins.datepicker['beforeShowDay'] = function (date){
			var day = date.getDay();
			return [($scope.alloweddow[day]),''];
		};
	}
},
compile: function (elem, attrs){
	if(attrs.validations){
		domHelp.applyValidationAttributes(elem, attrs);
	}

	if(attrs.updateOnBlur != null){
		var defaultOpt = '{ updateOn: \'blur\' }';
		elem.find('input').attr('ng-model-options', defaultOpt);
	}
	return {
		pre: function (scope, element, attributes, controller, transcludeFn){

		},
		post: function (scope, element, attributes, controller, transcludeFn){
			scope.$el = element.find('input');
			scope.$elm = $('#ui-datepicker-div');
			scope.$el[0].id = scope.vm.uniqueId;
			$(scope.$el[0]).datepicker(scope.vm.jqInputPlugins.datepicker);
		}
	};

},

// #-- END Component (cmpt-ui-date-selector-v2) --# //
// #----------------------------------------------# //
};});}());
