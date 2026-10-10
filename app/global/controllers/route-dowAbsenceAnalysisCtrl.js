(function() {'use strict';angular.module('aesop')
.controller('DowAbsenceAnalysisCtrl', function ($q, $scope, stringSvc, userPreferenceSvc, absenceApi, reportHelp, scrollHelp, toastHelp, arrayHelp, stringHelp, parseDateFilter) {
// #--------------------------------------# //
// #------- DowAbsenceAnalysisCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'NoRecordsFound',
        'Reports.Title.DayOfWeekAbsenceAnalysis',
        'DR.Summary.Graph.Text.NoAbsencesOrVacancies',
        'Reports.Group.Title.AbsenceReasons',
        'Reports.Group.Title.VacancyReasons',
        'DayOfWeek.Abrv.Mon',
        'DayOfWeek.Abrv.Tue',
        'DayOfWeek.Abrv.Wed',
        'DayOfWeek.Abrv.Thu',
        'DayOfWeek.Abrv.Fri',
        'DayOfWeek.Abrv.Sat',
        'DayOfWeek.Abrv.Sun',
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday',
        'Table.Header.Total',
        'Table.Footer.Totals',
        'NoRecordsFound',
        'Reports.Results.Label.InitialInstructions',
        'Vacancy',
        'Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified',
        'Summary',
        'Reports.CriteriaPanel.Button.Print',
        'Employee'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            dateRange: { startDate: new Date(), endDate: new Date() },
            absenceType: { includeAbsences:true, includeVacancies:true },
            filledStatus: {includeFilled: true, includeUnfilled: true, includeNoSubRequired: true},
            institutions:[],
            workers:[],
            workerTypes:[],
            substitutes:[],
            absenceReasons:[],
            vacancyReasons:[],
            vacancyProfiles:[],
            includeDeletedSubs: true,
            fields: '(date,IsVacancy,entitlement(name),percentOfDay)'
        },
        chartData: [],
        chartColors: {},
        titleHovered: '',
        daysOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ],
        columns:[
            {
                key: 'AbsenceReason', width: '8/24',
                name: '',
                template: '{{ row.entt }}'
            }],
        footerColumns:[
            {
                key: 'Totals', width: '8/24',
                name: 'Totals',
                noTitle: true,
                template: route.strings['Table.Footer.Totals'] + ':'
            }],
        dataSet:[],
        validation:{
            dateRange: function (){
                var error = '';
                var maxDaySpan = 92;
                if(!reportHelp.ExtraValidationDateRangeUnless(route.vm.filters.dateRange.startDate, route.vm.filters.dateRange.endDate, maxDaySpan, null, route.vm.filters.workers)) {
                    error = stringHelp.replace(route.strings['Validation.Message.DateRangeDaysTooLargeForRunUnlessSpecified'], '{0}', maxDaySpan);
                    error = stringHelp.replace(error, '{1}', route.strings['Employee']);
                }
                return error;
            }
        },
        expanded: userPreferenceSvc.get('reportGraphs','DOWAnalysisReport')
    };

    if(route.vm.expanded == null){
        userPreferenceSvc.set('reportGraphs','DOWAnalysisReport', true);
        route.vm.expanded = userPreferenceSvc.get('reportGraphs','DOWAnalysisReport');
    }


    //Generate column configurations
    var daysOfWeek = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var dowColumns = [];
    var dowFooterColumns = [];
    var colWidth = '2/24';
    for (var i = 0; i < daysOfWeek.length; i++) {
        var dow = daysOfWeek[i];
        var col = {
            key: dow,
            width: colWidth,
            name: 'DayOfWeek.Abrv.' + dow,
            noTitle: true,
            template: '{{row.' + dow + '}}'
        };
        dowColumns.push(col);
        var footerCol = {
            key: 'Sum' + dow,
            width: colWidth,
            name: dow,
            noTitle: true,
            calculations: [ { key: dow, operation: 'sum', roundTo: 1 } ],
            template: '{{ group.sum.' + dow + ' || 0 }}'
        };
        dowFooterColumns.push(footerCol);
    }
    dowColumns.push({
        key: 'Total', width: colWidth,
        name: 'Table.Header.Total',
        noTitle: true,
        template: '{{ row.weekTotal }}'
    });
    dowFooterColumns.push({
        key: 'WeekTotal', width: colWidth,
        name: 'WeekTotals',
        noTitle: true,
        calculations: [ { key: 'weekTotal', operation: 'sum', roundTo: 1 } ],
        template: '{{ group.sum.weekTotal }}'
    });
    route.vm.columns =  route.vm.columns.concat(dowColumns);
    route.vm.footerColumns = route.vm.footerColumns.concat(dowFooterColumns);



    function processResults(data) {
        var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        route.vm.hasData = data.length > 0;

        route.vm.chartData = weekDays.map(function (v, i) {
            return {
                title: '',
                dow: i,
                value: 0
            };
        });

        var items = [];
        data.forEach(function(v, i, a) {
            var dow = (new Date(v.date)).getDay();
            var enttGroup = (v.IsVacancy) ? route.strings['Reports.Group.Title.VacancyReasons'] : route.strings['Reports.Group.Title.AbsenceReasons'];
            var enttVac = (v.IsVacancy) ? ' (' + route.strings['Vacancy'] + ')' : '';
            var entitlement = v.entitlement.name + enttVac;
            var itemIndex = arrayHelp.indexOf(items, 'entt', entitlement);
            var isNew = (itemIndex === -1);
            var item = (isNew) ? { } : items[itemIndex];

            var weekDayTotal = (item[weekDays[dow]]) ? item[weekDays[dow]] : 0;

            item[weekDays[dow]] = weekDayTotal + v.percentOfDay;

            if (isNew) {
                item.enttGroup = enttGroup;
                item.entt = entitlement;
                items.push(item);
            } else {
                items[itemIndex] = item;
            }
        });

        route.vm.dataSet = items.map(function(item) {
            item.weekTotal = 0;
            weekDays.forEach(function(v, i, a) {
                if (!item[v]) {
                    item[v] = 0;
                }
                item[v] = Math.round(item[v] * 10) / 10;
                item.weekTotal += item[v];

                //add rounded data to the chart
                route.vm.chartData.push({
                    title: item.entt,
                    label: item.entt,
                    dow: i,
                    value: item[v]
                });
            });
            item.weekTotal = Math.round(item.weekTotal * 10) / 10;
            return item;
        }).sort(arrayHelp.multiLevelSort(['enttGroup','entt']));

        //sort the chart data
        route.vm.chartData.sort(function (a, b) {
            var aVal = a.dow === 0 ? 7 : a.dow,
                bVal = b.dow === 0 ? 7 : b.dow,
                baseSort = 0;

            if (a.title < b.title) { baseSort = -1; }
            if (a.title > b.title) { baseSort = 1; }

            if (baseSort === 0) {
                // sub sort
                return aVal - bVal;
            }
            return baseSort;
        });
    }


    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                var filter = reportHelp.convertAbsenceFilter(route.vm.filters);
                absenceApi.get(filter).then(function (data){
                    route.strings.$promise.then(function (){
                        processResults(data);
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
        },
        toggleCollapse: function (){
            route.vm.expanded = !route.vm.expanded;
            userPreferenceSvc.set('reportGraphs','DOWAnalysisReport', route.vm.expanded);
        }
    };

// #----- END DowAbsenceAnalysisCtrl -----# //
});}());