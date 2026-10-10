(function() {'use strict';angular.module('aesop')
.controller('ReconcileDetailsCtrl', function (stringSvc, reportHelp) {
// #---------------------------# //
// #------- ReconcileDetailsCtrl -------# //

    // this is a route controller
    var route = this;

    route.strings = stringSvc.getStrings([
    	'ReconciliationDetails.Header.Text.ReconciliationDetailFor'
    ]);

    // View Model properties
    route.vm = {
        filters: {
            dateRange:{startDate: new Date(),endDate: new Date()},
            absenceType:{includeAbsences:true, includeVacancies:true},
            filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
            institutions:[],
            absenceReasons:[],
            budgetCodes:[],
            accountingCodes:[]

        },
        validation:{
             dateRange: function (){
                 if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,null,'employee',route.vm.filters.workers)){
                     return reportHelp.InjectValuesToResource(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'],'employee',route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate);
                 }else{
                    return '';
                 }
             }
        }
    };

    // Actions that can be bound to from the view
    route.go = {
        someAction: function () {
            route.vm.property = 'something';
        }
    };

// #----- END ReconcileDetailsCtrl -----# //
});}());
