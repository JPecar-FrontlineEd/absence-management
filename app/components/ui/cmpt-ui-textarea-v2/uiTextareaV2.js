(function() {'use strict';angular.module('aesop')
.directive('cmptUiTextareaV2', function () {return {

// directive options
restrict: 'E',
scope: {
	name:'@',
	valueText:'=',
	formValue:'=',
	placeholder: '@',
	enabled:'=?',
	readOnly:'=?',
	readOnlyPlaceholder: '@',
	minLength:'=?',
	maxLength:'=?',
	required: '=?',
	onBlur: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-textarea-v2/uiTextareaV2.html',

// #--------------------------------------# //
// #---- Component (cmpt-ui-textarea-v2) ----# //
controller: function ($scope, stringSvc) {

	if($scope.enabled == null){
		$scope.enabled = true;
	}
	if($scope.readOnly == null){
		$scope.readOnly = false;
	}
	if($scope.minLength == null){
		$scope.minLength = '';
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
			scope.$watch('valueText', function (val) {
				scope.vm.fieldValue = val;
			});

			element.find('textarea').on('change',function(e){
				scope.$root.safeApply(function () {
					var value = element.find('textarea').val();
					if (value.trim().length > 0) {
						scope.valueText = value;
					}else{
						scope.valueText = '';
					}
				});
			});
		}
	};

}

// #-- END Component (cmpt-ui-textarea-v2) --# //
// #--------------------------------------# //
};});}());