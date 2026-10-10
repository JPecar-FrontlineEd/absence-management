(function() {'use strict';angular.module('aesop')
.directive('cmptTopnavSearch', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/topnav/cmpt-topnav-search/topnavSearch.html',

// #----------------------------------------# //
// #---- Component (cmpt-topnav-search) ----# //
controller: function ($scope, stringSvc, searchSvc, $timeout, featureSvc) {

    // View Model properties
    var vm = $scope.vm = {
        searchFocused: false,
        searchText: null,
        isSearching: false,
        searchErrors:[]
    };

    // Get mnemonics that this component needs
    stringSvc.ready.then(function () {
        $scope.strings = stringSvc.getStrings([
            'AdminWeb.TobBar.SearchHere',
            'AbsrIsNull',
		    'Navigation.Top.MenuItem.Search'
        ]);
    });

    // Actions that can be bound to from the view
    var go = $scope.go = {
        toggleSearchSelected: function () {
            if (!vm.searchFocused) {
                vm.searchFocused = true;
            }
        },
        clearSearch: function (e) {
            e.preventDefault();
            vm.searchText = null;
            vm.searchFocused = true;
         },
        search: function (){
            vm.searchErrors.length = 0;
            $timeout(function(){
                if(!vm.isSearching){
                    if(vm.searchText === null){
                        return null;
                    }

                    vm.isSearching = true;
                    searchSvc.search(vm.searchText).then(function(){
                        vm.isSearching = false;
                        vm.searchText = null;
                        vm.searchFocused = false;
                    },function(){
                        vm.isSearching = false;
                    });
                }
            },100);
        }
    };
}

// #-- END Component (cmpt-topnav-search) --# //
// #----------------------------------------# //
};});}());