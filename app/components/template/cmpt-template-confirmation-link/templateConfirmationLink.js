(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateConfirmationLink', function () {return {

// directive options
restrict: 'E',
scope: {
	absrid:'@',
	invalidText:'@',
	isDailyReport: '=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-confirmation-link/templateConfirmationLink.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-template-confirmation-link) ----# //
controller: function ($scope) {

	var vm = $scope.vm = {
		isValid: $scope.absrid && !isNaN($scope.absrid) && parseInt($scope.absrid, 10) > 0
	};

	if ($scope.invalidText == null) { $scope.invalidText = ''; }

}

// #-- END Component (cmpt-template-confirmation-link) --# //
// #-----------------------------------------------------# //
};});}());