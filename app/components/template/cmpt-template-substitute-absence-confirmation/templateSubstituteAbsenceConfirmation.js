(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateSubstituteAbsenceConfirmation', function () {return {

// directive options
restrict: 'E',
scope: {
	substituteAbsenceId:'@',
	invalidText:'@'
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-substitute-absence-confirmation/templateSubstituteAbsenceConfirmation.html',

// #-----------------------------------------------------------# //
// #---- Component (cmpt-template-substitute-absence-confirmation) ----# //
controller: function ($scope, stringSvc) {

	var vm = $scope.vm = {
		isValid: $scope.substituteAbsenceId && !isNaN($scope.substituteAbsenceId) && parseInt($scope.substituteAbsenceId, 10) > 0
	};

	if ($scope.invalidText == null) { $scope.invalidText = ''; }
}

// #-- END Component (cmpt-template-substitute-absence-confirmation) --# //
// #-----------------------------------------------------------# //
};});}());