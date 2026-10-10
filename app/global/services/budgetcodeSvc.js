(function () {
    'use strict'; var app = angular.module('aesop');

    // #-----------------------------------# //
    // #----- Service (budgetCodeSvc) -----# //
    app.factory('budgetCodeSvc', function ($q, storageSvc, budgetCodeApi, permissionSvc) {

        var _defer = $q.defer();

        //Commented out to prevent loading from local storage and set budgetCodeData to null to fetch value from server instead of cache.
        //budgetCodeData = storageSvc.load({key: 'budgetCodes'});
        var budgetCodeData = null;

        if (budgetCodeData == null) {
            permissionSvc.ready.then(function () {
                if (permissionSvc.iHave('ABSR.DTLSBDCD')) {
                    budgetCodeApi.get().then(function (data) {
                        budgetCodeData = data;
                        storageSvc.save({
                            key: 'budgetCodes',
                            data: data
                        });
                        _defer.resolve(budgetCodeData);

                    }, _defer.reject);
                }
            });
        } else {
            _defer.resolve(budgetCodeData);
        }

        function getBudgetCodes() {
            return budgetCodeData;
        }

        return {
            ready: _defer.promise,
            getBudgetCodes: getBudgetCodes
        };

    });
    // #--- END Service (budgetCodeSvc) ---# //
    // #-----------------------------------# //

}());