(function() {'use strict';angular.module('aesop')
.directive('cmptUiTabs', function () {return {

// directive options
restrict: 'E',
scope: {
	tabs: '='
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-tabs/uiTabs.html',

// #----------------------------------# //
// #---- Component (cmpt-ui-tabs) ----# //
controller: function ($scope, $location, $state, stringSvc) {

	// View Model properties
	var vm = $scope.vm = {};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		changeRoute: function(url){
			$location.path(url).search($location.search());
		}
	};

	function setTab () {
		$scope.tabs.forEach(function (tab) {
			tab.isActive = $state.is(tab.state);
			if (tab.visible === true) {
				tab.isVisible = true;
			} else if (typeof tab.visible === 'function') {
				tab.isVisible = tab.visible();
			} else {
				tab.isVisible = tab.isActive;
			}
		});
	}

	$scope.$on('$destroy', $scope.$root.$on('$stateChangeSuccess', setTab) );
	setTab();
}

// #-- END Component (cmpt-ui-tabs) --# //
// #----------------------------------# //
};});}());
