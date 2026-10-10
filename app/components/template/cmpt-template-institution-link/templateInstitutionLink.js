(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateInstitutionLink', function () {return {

// directive options
restrict: 'E',
scope: {
	instId:'@',
	instName:'@',
	invalidText:'@',
	showNameAsLink: '=?',
	showNameInBold:'=?',
	wrapTextInLine:'=?',
	isDailyReport: '=?',
	isAbsrDeleted:'=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-institution-link/templateInstitutionLink.html',

// #----------------------------------------------------# //
// #---- Component (cmpt-template-institution-link) ----# //
controller: function ($scope, stringSvc, hyperlinkSvc) {

	var vm = $scope.vm = {
		isValid: false,
		link: ''
	};

	//This watch is required to solve timing issues for absrVariationDetails
	$scope.$watch('instId', function (changedInstId){
		vm.isValid = changedInstId && !isNaN(changedInstId) && parseInt(changedInstId, 10) > 0;
		vm.link = hyperlinkSvc.instLink($scope.instId);
	});

	if ($scope.invalidText == null) { $scope.invalidText = ''; }

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	

	//console.log("instID: " + $scope.instId + " vm.isValid: " + vm.isValid + " link: " + $scope.link);
}

// #-- END Component (cmpt-template-institution-link) --# //
// #----------------------------------------------------# //
};});}());