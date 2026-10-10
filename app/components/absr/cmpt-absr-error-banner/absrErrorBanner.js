(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrErrorBanner', function () {return {

// directive options
restrict: 'E',
scope:{
    errorMessage :'=?',
    removeBackgroundColor : '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/absr/cmpt-absr-error-banner/absrErrorBanner.html',

// #-------------------------------------------# //
// #---- Component (cmpt-absr-done-banner) ----# //
controller: function () {

}   
};});}());