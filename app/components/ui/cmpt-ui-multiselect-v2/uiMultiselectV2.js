(function() {'use strict';angular.module('aesop')
.directive('cmptUiMultiselectV2', function () {return {

// directive options
restrict: 'E',
scope: {
	type: '@',
	width: '@',
	labelAll: '@',
	items: '=',
	name: '@',
	multiple: '@',
	selected: '=',
	enable:'=?',
	required: '=?',
	formValue:'=?',
	readOnlyPlaceholder: '@'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-multiselect-v2/uiMultiselectV2.html',

// #--------------------------------------------# //
// #---- Component (cmpt-ui-multiselect-v2) ----# //
controller: function ($scope, stringSvc) {

	const multiSelect = $scope.multiSelect = ($scope.multiple != null && $scope.multiple === 'true');
	const required = $scope.required = ($scope.required != null && $scope.required);

	if($scope.width == null) { $scope.width = '100%'; }

	// View Model properties
	var vm = $scope.vm = {
		selectedItems: [],
		stylingClass: stylingClass()
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'NoneSelected'
	]);

	if($scope.readOnlyPlaceholder == null){
		$scope.readOnlyPlaceholder = strings['NoneSelected'];
	}

	$scope.$watchCollection('selected',function(selectedIds){
		vm.selectedItems = $scope.items.filter(x => selectedIds.indexOf(x.id) >= 0).map(x => x.value);
	});



	function stylingClass() {
		if(multiSelect && required){
			return 'multiSelect-and-required';
		}else if(multiSelect && !required){
			return 'multiSelect-and-not-required';
		}else if(!multiSelect && required){
			return 'not-multiSelect-and-required';
		}else{
			return 'not-multiSelect-and-not-required';
		}
	}


	if($scope.required){
		$scope.$watchCollection('selected',function(nVal,oVal){
			if(!angular.equals(nVal,oVal)) {
				if($scope.formValue == null) { throw new Error('Need form object in order for required validation to work.'); }
				$scope.formValue.$setDirty();
				$scope.formValue.$setTouched();
			}
		});
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
	};
}
// #-- END Component (cmpt-ui-multiselect-v2) --# //
// #--------------------------------------------# //
};});}());
