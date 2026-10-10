(function() {'use strict';angular.module('aesop')
.directive('cmptUiDropdown', function () {return {

// directive options
restrict: 'E',
scope: {
	optionsArray:'=',		// the array of options (id and value props required on each object)
	valueSelected:'=',		// the selected object from the optionsArray
	enabled:'=',			// is dropdown should be enabled or disabled
	readOnly:'=',			// if true, no dropdown is shown (text instead)
	allowBlank:'=?',		// if false, don't off a "select one" option and auto select the first
	errorMessages:'=?',		// array of error messages to show
	sortBy: '=?', 			// object prop name to sort using ("!" = don't sort)
	defaultText: '=?',		// text that should show for the unselected state (ie: "select one")
	labelText: '=?',		// tes that show when the value selected is null
	fieldWidth:'@',			// a static width for the select box
	uniqueMarkerClass: '=',	// a unique identifier class that can be used to uniquely identify this control
	required: '=',
	name:'@',
	id:'=?',
	label:'=?',
	uniqueId: '=?',
	canSelectHiddenAbsenceReasons: '=?',
	reconciledHiddenAbsenceReason: '=?',
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-dropdown/uiDropdown.html',

// #--------------------------------------# //
// #---- Component (cmpt-ui-dropdown) ----# //
controller: function ($scope, stringSvc) {

	var lookupTable = {}, valueIsObject, optionExists,
		initializing = true,
		sortFunction = function defaultDropdownSort (a, b) {
			var sortA = (typeof a[$scope.sortBy] === 'string')? a[$scope.sortBy].toLowerCase() : a[$scope.sortBy].toString();
			var sortB = (typeof b[$scope.sortBy] === 'string')? b[$scope.sortBy].toLowerCase() : b[$scope.sortBy].toString();
			var alphabet = '*!@_.()#^&%-=+01234567989abcdefghijklmnopqrstuvwxyz';
			var index_a = alphabet.indexOf(sortA[0]),
			index_b = alphabet.indexOf(sortB[0]);

			if (index_a === index_b) {
				if (sortA < sortB) {
					return -1;
				} else if (sortA > sortB) {
					return 1;
				}
				return 0;
			} else {
				return index_a - index_b;	
			}
		};

	$scope.allowBlank = $scope.allowBlank != null ? $scope.allowBlank : true;
	$scope.sortBy = $scope.sortBy != null ? $scope.sortBy : 'value';
	$scope.fieldWidth = $scope.fieldWidth != null ? $scope.fieldWidth : null;
	if (typeof $scope.sortBy === 'function') {
		sortFunction = $scope.sortBy;
	}

	if ($scope.errorMessages == null) { $scope.errorMessages = []; }
	$scope.defaultText = $scope.defaultText != null ? $scope.defaultText : 'Select One';
	$scope.labelText = $scope.labelText != null ? $scope.labelText : 'None Selected';

	// View Model properties
	var vm = $scope.vm = {
		selectedValueTitle: $scope.valueSelected && $scope.valueSelected.value || '',
		defaultValue: $scope.defaultText,
		noneAvailable: 'None Available',
		selectedId: null,
		fieldStyles: $scope.fieldWidth !== null ? { width: $scope.fieldWidth } : {},
		uniqueMarkerClass: $scope.uniqueMarkerClass,
		uniqueId: $scope.uniqueId
	};

	$scope.$watch('optionsArray', function (newOptions, oldOptions) {
		var i;
		lookupTable = {};

		// if our new options are null, this cmpt is being instatiated
		// without any options
		if (newOptions == null || !newOptions.length) {
			// if we used to have options, then clear our selection
			if (oldOptions != null && oldOptions.length) {
				console.log(' => clearing', newOptions); // REMOVE ME
			}
			// null options should be an empty array
			newOptions = [];
			// we have no options, don't go any farther
			return;
		}

		if (initializing) {
			valueIsObject = $scope.valueSelected != null && typeof $scope.valueSelected === 'object';
			optionExists = valueIsObject && newOptions.map(function (v) { return v.id; }).indexOf($scope.valueSelected.id) !== -1;
			// handle when the selected value is an object
			if (valueIsObject) {
				// if the selected option is available in the newOptions, select it
				if (optionExists) {
					vm.selectedId = $scope.valueSelected.id;

				} else {
					vm.selectedId = null;
				}

			// check for a valueSelected that is not an object and set it as the default
			} else if ($scope.valueSelected != null) {
				vm.selectedId = $scope.valueSelected;
			}
		}

		// sort the data
		if ($scope.sortBy !== '!') {
			newOptions.sort(sortFunction);
		}

		// build the lookup table
		i = newOptions.length;
		for (; i-- ;) {
			lookupTable[newOptions[i].id] = newOptions[i];
		}

		if (!$scope.allowBlank && newOptions.length && $scope.valueSelected == null) {
			vm.selectedId = newOptions[0].id;
		}
	});

	$scope.$watch('vm.selectedId', function (id){
		if (!$scope.optionsArray.length) {
			//vm.selectedValueTitle = $scope.readOnly ? $scope.valueSelected.value : '';
			vm.selectedValueTitle = $scope.readOnly && $scope.valueSelected ? $scope.valueSelected.value : '';
			return;
		}
		$scope.valueSelected = lookupTable[id] || null;
		vm.selectedValueTitle = $scope.valueSelected && $scope.valueSelected.value || '';
	});

	$scope.$watch('valueSelected', function (item){
		var itemId = (item && item.id != null) ? item.id : item;
		//Resetting to None Selected if we have manually set the itemId to null
		if (itemId === null) { vm.selectedId = itemId; return; }
		if (!$scope.optionsArray.length || lookupTable[itemId] == null) { return; }
		vm.selectedId = itemId;
	});
}

// #-- END Component (cmpt-ui-dropdown) --# //
// #--------------------------------------# //
};});}());