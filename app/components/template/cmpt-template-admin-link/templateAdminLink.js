(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateAdminLink', function () {return {

// directive options
restrict: 'E',
scope: {
	adminId:'@',
	adminName: '@',
	userTypeId:'@',
	showNameAsLink: '=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-admin-link/templateAdminLink.html',

// #----------------------------------------------------# //
// #---- Component (cmpt-template-admin-link) ----# //
controller: function ($scope, stringSvc, hyperlinkSvc) {

	var vm = $scope.vm = {
		link: ''
	};

	//This watch is required to solve timing issues for absrVariationDetails
	vm.link = ($scope.userTypeId == 4
		? hyperlinkSvc.orgUserLink($scope.adminId)
		: hyperlinkSvc.campusUserLink($scope.adminId)
		);


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings(['ApproverName']);
	

}

// #-- END Component (cmpt-template-admin-link) --# //
// #----------------------------------------------------# //
};});}());