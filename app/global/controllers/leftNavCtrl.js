(function() {'use strict';angular.module('aesop')
.controller('LeftNavCtrl', function ($scope, $timeout, menuSvc, stringSvc) {
// #---------------------------# //
// #------- LeftNavCtrl -------# //

	// View Model properties
	var vm = $scope.vm = {
		navCollapsed: true,
		showAdSpot: false
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		toggleNavCollapsed: function (e, state) {
			if (e && e.stopImmediatePropagation) { e.stopImmediatePropagation(); }
			vm.navCollapsed = (state != null) ? state : !vm.navCollapsed;
			vm.showAdSpot = !vm.navCollapsed;
			if (vm.navCollapsed) {
				$timeout(function () {
					if (vm.navCollapsed) {
						$scope.$broadcast('menu-set-to-current');
					}
				}, 300);
			}
		}
	};

	menuSvc.ready
		.then(function () {
			vm.visible = true;
			$scope.$root.safeDigest($scope);
			return stringSvc.ready;
		})
		.then(function () {
			vm.navCollapsed = false;
			$scope.$root.safeDigest($scope);

			$timeout(function () {
				$scope.$broadcast('menu-set-to-current');

				$timeout(function () {
					go.toggleNavCollapsed(null, true);
				}, 500);

			}, 600);
		});

// #----- END LeftNavCtrl -----# //
});}());