(function() {'use strict';angular.module('aesop')
.directive('cmptContextMenu', function () {return {

    // directive options
    restrict: 'E',
    templateUrl: '/components/template/cmpt-context-menu/contextMenu.html',

// #--------------------------------------------# //
// #---- Component (cmpt-context-menu) ----# //

controller: function ($scope, $rootScope) {

    $rootScope.$on("contextMenuDataChanged", function (event,contextMenuData, linkText) {
        $scope.contextMenuData = contextMenuData;
        $scope.linkText = linkText;
        $scope.$digest();
    });
}

// #-- END Component (cmpt-context-menu) --# //
// #--------------------------------------------# //
};});}());