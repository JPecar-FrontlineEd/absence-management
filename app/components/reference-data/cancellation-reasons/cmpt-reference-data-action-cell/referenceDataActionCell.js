(function() {'use strict';angular.module('aesop')
.directive('cmptReferenceDataActionCell', function () {return {

// directive options
restrict: 'E',
scope: {
	data:'='
},
replace: true,
templateUrl: '/components/reference-data/cancellation-reasons/cmpt-reference-data-action-cell/referenceDataActionCell.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-reference-data-action-cell) ----# //
controller: function ($scope, stringSvc) {

	// View Model properties
	var vm = this.vm = {
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		"delete": function(){
			$scope.$emit('delete-ref-data',{id: $scope.data.id});
		},
		"edit": function(){
			$scope.$emit('edit-ref-data', {row: $scope.data});
		},
		"cancel": function() {
			$scope.$emit('cancel-edit-ref-data', {row: $scope.data});
		},
		"save": function() {
			$scope.$emit('save-ref-data', {row: $scope.data});
		}
	};
}

// #-- END Component (cmpt-reference-data-action-cell) --# //
// #-----------------------------------------------------# //
};});}());