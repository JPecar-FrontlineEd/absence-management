(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateInstitutionTreeNode', function ($compile) {return {

// directive options
restrict: 'E',
scope: {
	'inst': '=',
	'link': '@'
},
replace: true,
templateUrl: '/components/template/cmpt-template-institution-tree-node/templateInstitutionTreeNode.html',

// #---------------------------------------------------------# //
// #---- Component (cmpt-template-institution-tree-node) ----# //
controller: function ($scope, stringHelp) {
	var vm = $scope.vm = {
		link: stringHelp.replace($scope.link, '{0}', $scope.inst.id),
		expanded: true
	};
},
link: function (scope, element, attrs, stringHelp) {
	var inst = scope.inst;
	if (inst.children && inst.children.length) {
		addChildren();
	} else {
		scope.$watch('inst.children', function (nVal) {
			if (nVal && nVal.length) { addChildren(); }
		});
	}

	function addChildren() {
		element.append('<ul ng-class="{collapsed: !vm.expanded}"><cmpt-template-institution-tree-node ng-repeat="instObj in inst.children" inst="instObj" link="'+scope.link+'"></cmpt-template-institution-tree-node></ul>');
		$compile(element.contents())(scope);
	}
}

// #-- END Component (cmpt-template-institution-tree-node) --# //
// #---------------------------------------------------------# //
};});}());