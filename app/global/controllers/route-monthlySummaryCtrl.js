(function() {'use strict';angular.module('aesop')
.controller('MonthlySummaryCtrl', function ($q, $scope, stringSvc, absenceRequestApi, reportHelp, scrollHelp, parseDateFilter, toastHelp) {
// #-----------------------------------------# //
// #------- MonthlySummaryCtrl -------# //

    // this is a route controller
    var route = this;

    route.strings = stringSvc.getStrings([
        'Reports.Title.AbsenceMonthlySummary',
        'Reports.Results.Label.InitialInstructions',
        'NoRecordsFound',
        'Reports.CriteriaPanel.Button.Print'
    ]);

    var currentDate = new Date();

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            dateRange:{startDate: new Date(), endDate: new Date()},
            monthYear: {month:currentDate.getMonth()+1, year:currentDate.getFullYear()},
            absenceType:{includeAbsences:true, includeVacancies:true},
            //filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired:true},
            approvalStatus:{includeUnApproved: true,includeApproved:true, includeDenied:false, includePartialApproved:true},
            institutions:[],
            workers:[],
            workerTypes:[],
            userNameData: true,
            fields: '(isHeld,needSub,substitute(id),absences(date))'
        },
        validation:{
            // dateRange: function (){
            //     if(!reportHelp.ExtraValidationDateRange(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate,6)){
            //         return route.strings['Validation.Message.DateRangeDaysTooLargeForRun'];
            //     }
            // }
        },
        dataSet:[],
        monthString: '',
        yearString: ''
    };

    function setDateRange() {
        var startDate = new Date(route.vm.filters.monthYear.year, route.vm.filters.monthYear.month-1, 1);
        var endDate = new Date(route.vm.filters.monthYear.year, route.vm.filters.monthYear.month, 0);
        route.vm.filters.dateRange.startDate = parseDateFilter(startDate, 'MM/dd/yyyy');
        route.vm.filters.dateRange.endDate = parseDateFilter(endDate, 'MM/dd/yyyy');
    }

    // Actions that can be bound to from the view
    route.go = {
        callToServer: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                setDateRange();
                var filter = reportHelp.convertAbsenceRequestFilter(route.vm.filters);
                absenceRequestApi.get(filter).then(function (data){
                    route.strings.$promise.then(function (){
                        route.vm.monthString = parseDateFilter(new Date(route.vm.filters.monthYear.year, route.vm.filters.monthYear.month-1, 1), 'MMMM');
                        route.vm.yearString = parseDateFilter(new Date(route.vm.filters.monthYear.year, route.vm.filters.monthYear.month-1, 1), 'yyyy');

                        route.vm.dataSet = data;
                        //need to change the dataset array in some way so the watch in the month
                        //component will pick up that change and paint the page correctly
                        if (data.length === 0) {
                            route.vm.dataSet = [{}];
                        }
                        route.vm.isLoading = false;
                        route.vm.dataLoaded = true;
                    });
                    return _defer.resolve();
                },function(reasons){
                    route.vm.isLoading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
            }
        }
    };

// #----- END MonthlySummaryCtrl -----# //
});}());