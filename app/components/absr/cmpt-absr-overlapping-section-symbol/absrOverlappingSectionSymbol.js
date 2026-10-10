(function () {
    'use strict'; angular.module('aesop')
        .directive('cmptAbsrOverlappingSectionSymbol', function () {
            return {

                // directive options
                restrict: 'E',
                scope: {
                    text: "="
                },
                replace: true,
                templateUrl: '/components/absr/cmpt-absr-overlapping-section-symbol/absrOverlappingSectionSymbol.html',

                controller: function ($scope) {
                    $scope.isAbsence = $scope.text == 'A';
                    $scope.isInServiceDay = $scope.text == 'IS';
                    $scope.isClosedDay = $scope.text == 'C';
                }
            };
        });
}());
