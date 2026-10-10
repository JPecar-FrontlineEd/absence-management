(function() {'use strict';angular.module('aesop')
.directive('cmptUiTextboxV2', function ($filter, domHelp) {return {

// directive options
restrict: 'E',
scope: {
	name:'@',
	type: '@',
	valueText:'=',
	formValue:'=',
	placeholder: '@',
	enabled:'=?',
	readOnly:'=?',
	readOnlyPlaceholder: '@',
	maxLength:'=?',
	required: '=?',
	filter: '@',
	onBlur: '=?'
},
replace: true,
transclude:true,
templateUrl: '/components/ui/cmpt-ui-textbox-v2/uiTextboxV2.html',

// #----------------------------------------# //
// #---- Component (cmpt-ui-textbox-v2) ----# //
controller: function ($scope, $timeout, stringSvc) {

	if($scope.enabled == null){
		$scope.enabled = true;
	}
	if($scope.readOnly == null){
		$scope.readOnly = false;
	}
	if($scope.maxLength == null){
		$scope.maxLength = '';
	}
	if($scope.required == null){
		$scope.required = false;
	}
	if($scope.name == null){
		$scope.name = '';
	}
	if($scope.type == null){
		$scope.type = '';
	}
	if($scope.filter == null){
		$scope.filter = '';
	}
	if($scope.placeholder == null){
		$scope.placeholder = '';
	}
	if($scope.readOnlyPlaceholder == null){
		$scope.readOnlyPlaceholder = '';
	}

	var vm = $scope.vm = {
		fieldValue: $scope.valueText
	};

	$scope.go = {
		onBlur: () => {
				if($scope.onBlur != null){
					$timeout(()=> {	$scope.onBlur($scope.valueText);	}, 10);
				}
		}
	};


},
compile: function (elem,attrs){

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
		post: function(scope, element, attributes, controller, transcludeFn){
			if (scope.filter) {
				(function () {
					var args = scope.filter.split(' '),
						filter = args.shift();

					scope.$watch('valueText', function (val) {
						scope.vm.fieldValue = val;
					});

					scope.$watch('vm.fieldValue', function (val) {
						goFilter(val);
					});

					function goFilter(value) {
						scope.$root.safeApply(function () {
							var filterResult = $filter(filter).apply(null, [value].concat(args));
							if (filterResult !== '') {
								scope.valueText = scope.vm.fieldValue = filterResult;
							} else {
								scope.valueText = scope.vm.fieldValue;
							}
						});
					}
				}());
			}else{
				scope.$watch('valueText', function (val) {
					scope.vm.fieldValue = val;
				});

				element.find('input').on('change',function(e){
					scope.$root.safeApply(function () {
						var value = element.find('input').val();
						if (value.trim().length > 0) {
							scope.valueText = value;
						}else{
							scope.valueText = '';
						}
					});
				});
			}
		}
	};

}

// #-- END Component (cmpt-ui-textbox-v2) --# //
// #----------------------------------------# //
};});}());
