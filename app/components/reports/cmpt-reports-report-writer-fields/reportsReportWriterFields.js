(function() {'use strict';angular.module('aesop')
.directive('cmptReportsReportWriterFields', function () {return {

// directive options
restrict: 'E',
scope: {
	header: '@',
	fields: '=',
	allowFixedText: '=?'
},
replace: true,
templateUrl: '/components/reports/cmpt-reports-report-writer-fields/reportsReportWriterFields.html',

// #-------------------------------------------------------# //
// #---- Component (cmpt-reports-report-writer-fields) ----# //
controller: function ($scope, stringSvc, arrayHelp) {

	if ($scope.allowFixedText == null) { $scope.allowFixedText = false; }
	if ($scope.fields == null) { $scope.fields = []; }

	// View Model properties
	var vm = $scope.vm = {
		headerText: $scope.header,
		fieldCnt: 0,
		allowFixedText: $scope.allowFixedText,
		showfixedText: false,
		expanded: false,
		columns: [],
		dataset: [],
		displayFieldConfig: {}
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'ShowFixedTextFormat',
		'Report.Field.UnnamedStaticField',
		'Report.Field.UnnamedComboField',
		'Report.Field.UnnamedBranchField'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};

	//Settings for unnamed display field types
	vm.displayFieldConfig = {
		'1': { count: 0, defaultText: strings['Report.Field.UnnamedStaticField'] },
		'2': { count: 0, defaultText: strings['Report.Field.UnnamedComboField'] },
		'3': { count: 0, defaultText: strings['Report.Field.UnnamedBranchField'] }
	};


	//Returns text to use for field name (comes from different properties depending on the type)
	//  - field (ApiRwReportConfigField)
	function getDisplayName(field) {
		var displayName = '';

		//Check for user-specified field name
		if (field.name !== null && field.name.length > 0) {
			displayName = field.name;
		} else {
        	displayName = field.field != null ? field.field.friendlyFieldName : '';
    	}

        //Set default text for display fields without names (static, branch, combo)
        if (field.configFieldType === 1 && displayName.length === 0) {
        	var type = field.displayFieldType + '';
			vm.displayFieldConfig[type].count += 1;
			var fieldCount = vm.displayFieldConfig[type].count;
			var fieldName = vm.displayFieldConfig[type].defaultText + ' ' + fieldCount;
			displayName = fieldName;
        }

        return displayName;
	}


	$scope.$watch('fields', function (fields) {
		var sortedFields = angular.copy(fields);
		vm.fieldCnt = sortedFields.length;

        //Reset display field counts
		for (var i = 1; i <= 3; i++ ) {
			vm.displayFieldConfig[i+''].count = 0;
		}

		//Sorted before mapping so default field names reflect number of that
		//  field type ('Unnamed Branch Field 1', etc)
        sortedFields.sort(arrayHelp.sort('order'));

		var fieldList = sortedFields.map(function(f) {
			f.displayName = getDisplayName(f);
            return f;
        });

        vm.dataset = fieldList;

		if (vm.allowFixedText) {
			loadFixedTextColumns();
		}
	}, true);

	function loadFixedTextColumns() {
		vm.columns = [{
			key: 'name', width: '12/24',
            name: 'Name',
            noTitle: true,
            sortable: false,
            template:'{{ row.displayName }}'
		}, {
			key: 'length', width: '4/24',
            name: 'Length',
            noTitle: true,
            sortable: false,
            template:'{{ row.fieldLength }}'
		}, {
			key: 'align', width: '4/24',
            name: 'Align',
            noTitle: true,
            sortable: false,
            template:'{{ row.align }}'
		}, {
			key: 'padWith', width: '4/24',
            name: 'PadWith',
            noTitle: true,
            sortable: false,
            template:'{{ row.paddingCharacter }}'
		}];
	}
}

// #-- END Component (cmpt-reports-report-writer-fields) --# //
// #-------------------------------------------------------# //
};});}());