(function() {'use strict';angular.module('aesop')
.directive('cmptDevPermissionTool', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/dev/cmpt-dev-permission-tool/devPermissionTool.html',

// #----------------------------------------------# //
// #---- Component (cmpt-dev-permission-tool) ----# //
controller: function ($scope, storageSvc, permissionSvc, allPermissionsVal) {

	if ($scope.$root.env.notProd === false) { return; }

	// View Model properties
	var vm = $scope.vm = {
		categories: Object.keys(allPermissionsVal),
		permissionKeys: {},
		permissions: {},
		expanded: {},
		searchText: ''
	};

	vm.categories.forEach(function (cat) {
		vm.permissionKeys[cat] = Object.keys(allPermissionsVal[cat].items);
	});

	$scope.allPermissions = allPermissionsVal;

	// Actions that can be bound to from the view
	var go = $scope.go = {
		toggleCategory: function (cat) {
			vm.expanded[cat] = !vm.expanded[cat];
		},
		togglePermission: function (cat, perm) {
			vm.permissions[cat] = vm.permissions[cat] || {};

			if (vm.permissions[cat][perm]) {
				delete vm.permissions[cat][perm];
				if (Object.keys(vm.permissions[cat]).length === 0) {
					delete vm.permissions[cat];
				}
			} else {
				vm.permissions[cat][perm] = true;
			}

			savePermissions();
		}
	};

	permissionSvc.ready.then(function (permissions) {
		vm.permissions = permissions;
	});

	function savePermissions () {
		var data = Object.keys(vm.permissions).map(function (cat) {
			return {
				category: cat,
				items: Object.keys(vm.permissions[cat]).map(function (perm) {
					return { type: perm };
				})
			};
		});

		storageSvc.save({
			key: 'permissions',
			data: data,
			expires: 5
		});
	}
}

// #-- END Component (cmpt-dev-permission-tool) --# //
// #----------------------------------------------# //
};});}());