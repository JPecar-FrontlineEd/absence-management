(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateSubstituteLink', function () {return {

// directive options
restrict: 'E',
scope: {
	substituteId:'@',
	substituteName:'@',
	showNameAsLink: '=?',
	showLinkFollowingName: '=?',
	fromDailyReports: '=?',
	wrapTextInLine:'=?',
	isDailyReport: '=?',
	isAbsrDeleted:'=?'
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-substitute-link/templateSubstituteLink.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-substitute-link) ----# //
controller: function ($scope, hyperlinkSvc,userSvc) {
	if($scope.showNameAsLink == null) {
		$scope.showNameAsLink= null;
	}

	if($scope.showLinkFollowingName == null) {
		$scope.showLinkFollowingName= null;
	}
	if($scope.fromDailyReports && userSvc.isCampusUser())
	{
		$scope.link = hyperlinkSvc.subLinkForCampusUser($scope.substituteId);
	}
	else{
		$scope.link = hyperlinkSvc.subLink($scope.substituteId);
	}
	
}

// #-- END Component (cmpt-template-substitute-link) --# //
// #---------------------------------------------------# //
};});}());