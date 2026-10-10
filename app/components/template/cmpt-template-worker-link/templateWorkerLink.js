(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateWorkerLink', function () {return {

// directive options
restrict: 'E',
scope: {
	workerId:'@',
	workerName:'@',
	workerTooltipData: '=?',
	showNameAsLink: '=?',
	isVacancy: '=?',
	showLinkFollowingName: '=?',
	wrapTextInLine: '=?',
	isDailyReport: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/template/cmpt-template-worker-link/templateWorkerLink.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-template-worker-link) ----# //
controller: function ($scope, stringSvc, hyperlinkSvc) {
	if($scope.workerTooltipData == null) {
		$scope.workerTooltipData= null;
	}
	
	if($scope.showNameAsLink == null) {
		$scope.showNameAsLink = false;
	}

	if($scope.showLinkFollowingName == null) {
		$scope.showLinkFollowingName = false;
	}

	if($scope.isVacancy == null) {
		$scope.isVacancy = false;
	}	

	$scope.link = ($scope.isVacancy 
		? hyperlinkSvc.vacProfLink($scope.workerId)
		: hyperlinkSvc.empLink($scope.workerId)
		);
}

// #-- END Component (cmpt-template-worker-link) --# //
// #-----------------------------------------------# //
};});}());
