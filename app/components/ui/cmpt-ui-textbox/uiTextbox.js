(function() {'use strict';angular.module('aesop')
.directive('cmptUiTextbox', function ($filter) {return {

// directive options
restrict: 'E',
scope: {
	valueText:'=',
	placeholder: '@',
	enabled:'=?',
	readOnly:'=?',
	maxLength:'=?',
	errorMessages:'=',
	filter: '@',
	id: '=?',
	label: '=?',
	hideErrorMessage: '=?'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-textbox/uiTextbox.html',

// #-------------------------------------# //
// #---- Component (cmpt-ui-textbox) ----# //
controller: function ($scope, stringSvc) {
	if($scope.enabled == null){
		$scope.enabled = true;
	}
	if($scope.readOnly == null){
		$scope.readOnly = false;
	}
	if($scope.maxLength == null){
		$scope.maxLength = '';
	}
	$scope.vm = {
		fieldValue: $scope.valueText
	};
},

link: function (scope, elem, attrs) {
	if (scope.filter) {
		(function () {
			var args = scope.filter.split(' '),
				lock = false,
				filter = args.shift();

			elem.on('change', goFilter);
			elem.on('keypress', function (e) {
				if (e.keyCode === 13) {
					lock = false;
					elem.blur();
				}
			});
			elem.on('keydown', function (e) {
				lock = true;
			});

			scope.$watch('vm.fieldValue', function () {
				if (lock) { lock = false; }
				else { goFilter(); }
			});

			scope.$watch('valueText', function (val) {
				scope.vm.fieldValue = val;
			});
			// goFilter();

			function goFilter() {
				scope.$root.safeApply(function () {
					var filterResult = $filter(filter).apply(null, [scope.vm.fieldValue].concat(args));
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

		elem.on('keyup',function(e){
			scope.$root.safeApply(function () {
				scope.valueText = elem.find('input').val();
			});
		});
	}
}

// #-- END Component (cmpt-ui-textbox) --# //
// #-------------------------------------# //
};});}());