(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAbsenceRequestStatus', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/template/cmpt-template-absence-request-status/templateAbsenceRequestStatus.html',

// #----------------------------------------------------------# //
// #---- Component (cmpt-template-absence-request-status) ----# //
controller: function ($scope, $filter, stringSvc, absrStateVal, parseAesopDateFilter) {


	var absrState = $scope.absrState = absrStateVal;
	var isFilled = absrState.substitute !== null;
	// View Model properties
	var vm = $scope.vm = {
	};

	$scope.$watch('absrState.substitute', function (nVal){
		var isFilled = nVal !== null;
		vm.isFilled = isFilled;
		vm.substituteId =isFilled ? nVal.id :0;
		vm.substituteName= isFilled ? nVal.firstName + ' '+ nVal.lastName : '';
	});

	$scope.$watch('absrState.absr.heldUntil', function (nVal) {
		vm.heldUntilDate = parseAesopDateFilter(nVal, 'short');
	});

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Closed',
		'FilledBy',
		'Cancelled',
		'Unfilled',
		'HeldUntil',
		'NoSubstituteRequired',
		'SendEmailToSubstitute'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-template-absence-request-status) --# //
// #----------------------------------------------------------# //
};});}());