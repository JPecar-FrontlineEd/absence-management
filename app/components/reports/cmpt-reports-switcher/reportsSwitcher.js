(function() {'use strict';angular.module('aesop')
.directive('cmptReportsSwitcher', function () {return {

// directive options
restrict: 'E',
scope: {
	fromDailyReport: '=?'
},
replace: true,
templateUrl: '/components/reports/cmpt-reports-switcher/reportsSwitcher.html',

// #-------------------------------------------# //
// #---- Component (cmpt-reports-switcher) ----# //
controller: function ($scope, $q, $location, menuSvc, stringSvc, stringHelp) {

	var currPath = $location.path();
	var routeSplit = currPath.split('/');
	//remove current view from route
	routeSplit.pop();
	var tSectionName = stringHelp.toTitleCase(routeSplit[routeSplit.length-1]);
	var parentRoute = routeSplit.join('/');

	// Get mnemonics that this component needs
	var menuStrings = $scope.menuStrings = stringSvc.getStrings([
		'Report.Label.SelectReport',
		'Change',
		'ReportGroup.'+tSectionName+'.Title'
	]);

	// View Model properties
	var vm = $scope.vm = {
		reportMenu: [],
		reportMenuVisible: [],
		sectionName: tSectionName,
		defaultText: '',
		defaultReport: null,
		sortBy: 'order',
	};

	menuSvc.ready.then(function(){
		vm.defaultText = menuStrings['Change'] + '...';
		vm.reportMenu = buildReportList(menuSvc.findChildRoutes(parentRoute));
		vm.reportMenu.forEach(function (v, i, a) {
			if (!v.isCurrentRoute) {
				vm.reportMenuVisible.push(v);
			}
		});
	});

	function buildReportList(reports){
		var reportList = [];
		var count = 0;
		reports.forEach(function(item){
			if (item.route != null && item.route !== ''){
				reportList.push({
					value: item.title,
					id: item.route,
					order: count++,
					isCurrentRoute: item.route === $location.path()
				});
			}
		});
		return reportList;
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
		goToReport: function (route) {
			$location.url(route);
		}
	};

	$scope.$watch('vm.defaultReport', function(newValue, oldValue) {
        if (newValue) {
            go.goToReport(newValue.id);
        }
    }, true);
}

// #-- END Component (cmpt-reports-switcher) --# //
// #-------------------------------------------# //
};});}());