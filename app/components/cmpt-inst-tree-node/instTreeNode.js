(function() {'use strict';angular.module('aesop')
.directive('cmptInstTreeNode', function ($compile) {return {

// directive options
restrict: 'E',
scope: {'inst': '='},
replace: true,
templateUrl: '/components/generic/cmpt-inst-tree-node/instTreeNode.html',

// #-----------------------------------------# //
// #---- Component (cmpt-inst-tree-node) ----# //
controller: function () {},
link: function (scope, element, attrs) {
	var inst = scope.inst;
	if (inst.children && inst.children.length) {
		addChildren();
	} else {
		scope.$watch('inst.children', function (nVal) {
			if (nVal && nVal.length) { addChildren(); }
		});
	}

	function addChildren() {
		element.append('<ul><cmpt-inst-tree-node ng-repeat="instObj in inst.children" inst="instObj"></cmpt-inst-tree-node></ul>');
		$compile(element.contents())(scope);
	}
}

// #-- END Component (cmpt-inst-tree-node) --# //
// #-----------------------------------------# //
};});}());