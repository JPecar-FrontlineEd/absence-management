(function() {'use strict';angular.module('aesop')
.controller('StaffListCtrl', function ($scope, $q, stringSvc, userPreferenceSvc, orgSvc, institutionSvc, permissionSvc, reportHelp, workerApi, scrollHelp, toastHelp, domHelp, arrayHelp) {
// #-----------------------------# //
// #------- StaffListCtrl -------# //

    // this is a route controller
    var route = this;
    var nameColWidth = 70;
    var logindIdColWidth = 10;
    var pinColWidth = 0;
    var identifierColWidth = 0;
    var activeColWidth= 10;
    var needSubColWidth= 10;
    var avgSubExpColWidth= 0;
    var ratingColWidth= 0;
    var orgData = orgSvc.getOrgData();
    var showPinToCampusUser = orgData[0].settings.showPinToCampusUser;
    var showIdentifiersToCampusUser = orgData[0].settings.showIdentifiersToCampusUser;
    var canViewEmpAvgScore = permissionSvc.iHave('ABSRFeedBk.ViewSubExpFeedBack');

    if(showPinToCampusUser){
        pinColWidth = 10;
    }
    if(showIdentifiersToCampusUser){
        identifierColWidth = 15;
    }
    if(canViewEmpAvgScore){
        avgSubExpColWidth = 15;
        ratingColWidth = 10;
    }

    nameColWidth = nameColWidth - pinColWidth - identifierColWidth - avgSubExpColWidth - ratingColWidth;

    route.strings = stringSvc.getStrings([
        'Reports.Title.StaffList',
        'Table.Header.Employee',
        'Reports.Table.Header.LoginID',
        'Reports.Table.Header.PIN',
        'Reports.Table.Header.Identifier',
        'Reports.Table.Header.Active',
        'Reports.Table.Header.NeedsSub',
        'Reports.Table.Header.AvgSubExp',
        'Reports.Table.Header.Ratings',
        'VacancyProfile',
        'Phone',
        'Yes',
        'No',
        'Optional',
        'Summary',
        'Report.Result.Label.NoFeedback',
        'Reports.GroupSummary.Label.Emps',
        'Reports.GroupSummary.Label.ActiveEmps',
        'Reports.GroupSummary.Label.EmpsNeedingSubs',
        'Reports.GroupSummary.Label.ItinerantEmps',
        'Reports.GroupSummary.Label.VacProfs',
        'Reports.GroupSummary.Label.ActiveVacProfs',
        'Reports.GroupSummary.Label.VacProfsNeedingSubs',
        'Reports.GroupSummary.Label.ItinerantVacProfs',
        'NoRecordsFound',
        'Reports.Results.Label.InitialInstructions',
        'Reports.CriteriaPanel.Button.Print'
    ]);


    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            institutions:[],
            workerTypes:[],
            employeesVacancies:{includeWorkers:true, includeVacancies:true},
            activeStatus:{includeActive:true, includeInactive:false},
            fields: '(id,firstName,middleName,lastName,loginId,pin,identifier,institution(id,name),isVacancy,isActive,isItinerant,' +
                    'needSub,workerType(title),title,absenceFeedback,needFulfilment,phone)'
        },
        columns:[{
            key: 'name', width: nameColWidth + '%',
            name: 'Table.Header.Employee'
        },{
            key: 'loginId', width: logindIdColWidth + '%',
            name: 'Reports.Table.Header.LoginID'
        },{
            key: 'Active', width: activeColWidth + '%',
            name: 'Reports.Table.Header.Active'
        },{
            key: 'NeedsSub', width: needSubColWidth + '%',
            name: 'Reports.Table.Header.NeedsSub'
        }],
        dataCols:[{
            key: 'name', width: nameColWidth + '%',
            name: 'Table.Header.Employee',
            sortable: false,
            template: '<div><cmpt-template-worker-link worker-id="{{:: row.id }}" worker-name="{{:: row.name }}"></cmpt-template-worker-link>' +
                        '({{:: row.institution.length }})'+
                        '<div>{{:: row.titleString }}</div>' +
                        '<div>{{:: row.workerType.title }}</div>'+
                        '<div ng-if=":: row.phone.length > 0">'+ route.strings['Phone'] +': {{:: row.phone }}</div>'+
                        '</div>'
        },{
            key: 'loginId', width: logindIdColWidth + '%',
            name: 'Reports.Table.Header.LoginID',
            sortable: false,
            template: '<div ng-if=":: row.loginId">{{:: row.loginId }}</div>'
        },{
            key: 'Active', width: activeColWidth + '%',
            name: 'Reports.Table.Header.Active',
            sortable: false,
            template: '<div ng-if=":: row.isActive">'+ route.strings['Yes'] +'</div>'+
                        '<div ng-if=":: !row.isActive">'+ route.strings['No'] +'</div>'
        },{
            key: 'NeedsSub', width: needSubColWidth + '%',
            name: 'Reports.Table.Header.NeedsSub',
            sortable: false,
            template: '<div>{{:: row.fulfilment }}</div>'
        }],
        dataSet:[],
        employeeChartData: {},
        vacancyProfileChartData: {},
        estimatedRowHeight: 95,
        printing: false,
        expanded: userPreferenceSvc.get('reportGraphs','staffListReport')
    };

    if(route.vm.expanded == null){
        userPreferenceSvc.set('reportGraphs','staffListReport', true);
        route.vm.expanded = userPreferenceSvc.get('reportGraphs','staffListReport');
    }

    if(showPinToCampusUser){
        route.vm.columns.splice(2,0,{
            key: 'PIN', width: pinColWidth + '%',
            name: 'Reports.Table.Header.PIN'
        });
        route.vm.dataCols.splice(2,0,{
            key: 'PIN', width: pinColWidth + '%',
            name: 'Reports.Table.Header.PIN',
            sortable: false,
            template: '<div>{{:: row.pin }}</div>'
        });
    }
    if(showIdentifiersToCampusUser){
        var indexForIdentifiersCol = showPinToCampusUser ? 3: 2;
        route.vm.columns.splice(indexForIdentifiersCol,0,{
            key: 'Identifier', width: identifierColWidth + '%',
            name: 'Reports.Table.Header.Identifier'
        });
        route.vm.dataCols.splice(indexForIdentifiersCol,0,{
            key: 'Identifier', width: identifierColWidth + '%',
            name: 'Reports.Table.Header.Identifier',
            sortable: false,
            template: '<div>{{:: row.identifier }}</div>'
        });
    }
    if(canViewEmpAvgScore){
        var indexForFeedbackCols = route.vm.columns.length;
        route.vm.columns.splice(indexForFeedbackCols,0,{
            key: 'AvgSubExp', width: avgSubExpColWidth + '%',
            name: 'Reports.Table.Header.AvgSubExp'
        });
        route.vm.dataCols.splice(indexForFeedbackCols,0,{
            key: 'AvgSubExp', width: avgSubExpColWidth + '%',
            name: 'Reports.Table.Header.AvgSubExp',
            sortable: false,
            template: '<cmpt-template-feedback-rating ng-if=":: row.canViewEmpAvgScore" average-score=":: row.workerFeedBackScore" total-number-of-rating=":: row.workerFeedBackTotal"></cmpt-template-feedback-rating>' +
                        '<div ng-if=":: !row.canViewEmpAvgScore">'+ route.strings['Report.Result.Label.NoFeedback'] +'</div>'
        });
        route.vm.columns.splice(indexForFeedbackCols + 1,0,{
            key: 'Ratings', width: ratingColWidth + '%',
            name: 'Reports.Table.Header.Ratings'
        });
        route.vm.dataCols.splice(indexForFeedbackCols +1,0,{
            key: 'Ratings', width: ratingColWidth + '%',
            name: 'Reports.Table.Header.Ratings',
            sortable: false,
            template: '<div ng-if=":: row.canViewEmpAvgScore">{{:: row.workerFeedBackTotal }}</div>' +
                        '<div ng-if=":: !row.canViewEmpAvgScore">0</div>'
        });
    }


    // Actions that can be bound to from the view
    route.go = {
        callToServer: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                var filter = reportHelp.convertWorkerFilter(route.vm.filters);
                filter.includeFeedback = true;
                var results=[];
                workerApi.get(filter).then(function (data){
                    resetSummaryData();

                    //DE11653 - Need to know what Insts are actually within our filter based on hierarchy
                    var filteredInstAndChildIds = [];
                    if (route.vm.filters.institutions.length > 0) {
                        filteredInstAndChildIds = institutionSvc.getInstAndChildrenIds(route.vm.filters.institutions[0]);
                    }

                    data.forEach((worker) => {
                        //DE11653 - Filtering out institutions for itinerant workers that weren't requested when filtering the report
                        var institutions = worker.isItinerant && filteredInstAndChildIds.length > 0
                                                ? worker.institution.filter((i) => { return filteredInstAndChildIds.indexOf(i.id) !== -1; })
                                                : worker.institution;
                        var summary = worker.isVacancy ? route.vm.vacancyProfileChartData : route.vm.employeeChartData;

                        summary.total += 1;
                        if (worker.isActive) { summary.active += 1; }
                        if (worker.isItinerant) { summary.itinerant += 1; }
                        if (worker.needSub === 1 || worker.needSub === 2) { summary.subRequired += 1; }
                        institutions.forEach((inst) => {
                            if (results.filter((i) => { return i.id === inst.id; }).length) {
                                var group = results.filter(function (instGroup){ return instGroup.id === inst.id; })[0];
                                group.workers.push(processWorker(worker));
                            } else {
                                results.push({
                                    id: inst.id,
                                    name: institutionSvc.oneById(inst.id).name,
                                    workers: [processWorker(worker)]
                                });
                            }
                        });
                    });
                    results.sort(arrayHelp.sort('name'));
                    results.forEach(function (w){
                        w.workers.sort(arrayHelp.multiLevelSort(['group','name']));
                    });
                    route.vm.dataSet = processSummary(results);
                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;
                    return _defer.resolve();
                },function(reasons){
                    route.vm.isLoading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
            }
        },
        itemInView: function (item) {
            domHelp.rAF(function () {
                if (item.isInView) {
                    item.$height = getItemHeight(item);
                }
            });
        },
        toggleCollapse: function (){
            route.vm.expanded = !route.vm.expanded;
            userPreferenceSvc.set('reportGraphs','staffListReport', route.vm.expanded);
        }
    };

    function getItemHeight(item) {
        if (item.$index == null) { return null; }

        var workerRowsUnknownHeightCount = route.vm.dataSet[item.$index].workers
            .map(function (w) { return !!w.$height; })
            .filter(function (hasHeight) { return !hasHeight; }).length;
        if (workerRowsUnknownHeightCount > 0) { return null; }

        var itemEl = route.$container[0].getElementsByClassName('dataset-' + item.$index)[0].getElementsByClassName('dataset-container');
        return (itemEl.length ? itemEl[0].clientHeight : null);
    }

    function resetSummaryData() {
        route.vm.employeeChartData = {
            total: 0,
            active: 0,
            subRequired: 0,
            itinerant: 0
        };
        route.vm.vacancyProfileChartData = {
            total: 0,
            active: 0,
            subRequired: 0,
            itinerant: 0
        };
    }

    function processWorker (worker) {
        worker.group = worker.workerType.title;
        worker.name = worker.isVacancy ? worker.lastName : worker.lastName + ', ' + worker.firstName;
        worker.titleString = worker.isVacancy ? route.strings['VacancyProfile'] : worker.title;
        worker.canViewEmpAvgScore =  canViewEmpAvgScore && worker.absenceFeedback && worker.absenceFeedback.avgScore !== null;
        var hasFeedback = (worker.absenceFeedback != null && worker.absenceFeedback.avgScore !== null);
        worker.workerFeedBackScore = hasFeedback ? worker.absenceFeedback.avgScore : 0;
        worker.workerFeedBackTotal = hasFeedback ? worker.absenceFeedback.numberOfRatings : 0;
        worker.fulfilment = fulfilment(worker.needFulfilment);
        return worker;
    }


    function fulfilment (needFulfilment) {
        if(needFulfilment === 0){
            return route.strings['No'];
        }
        if(needFulfilment === 1){
            return route.strings['Yes'];
        }
        if(needFulfilment === 2){
            return route.strings['Optional'];
        }
    }

    function processSummary (results) {
        results.forEach(function (item){
            var workers = item.workers.filter(function (a) { return !a.isVacancy; });
            var vacancyProfiles = item.workers.filter(function (a) { return a.isVacancy; });

            item.estimatedHeight = (route.vm.estimatedRowHeight * workers.length) + // rows * estimated height
                                    (workers.filter(function (v, i, a) { return a.indexOf(v) === i; }).length * 34) + // group count * height
                                    188; // grid header row height + statistics footer height

            item.summary = {
                totalWorkers: workers.length,
                activeWorkers: workers.filter(function (a) { return a.isActive; }).length,
                requiringSubWorkers: workers.filter(function (a) { return a.needFulfilment === 1 || a.needFulfilment === 2 ; }).length,
                itinerantWorkers: workers.filter(function (a) { return a.institution.length > 1 ; }).length,
                totalVacancyProfiles: vacancyProfiles.length,
                activeVacancyProfiles: vacancyProfiles.filter(function (a) { return a.isActive; }).length,
                requiringSubVacancyProfiles: vacancyProfiles.filter(function (a) { return a.needFulfilment === 1 || a.needFulfilment === 2 ; }).length,
                itinerantVacancyProfiles: vacancyProfiles.filter(function (a) { return a.institution.length > 1 ; }).length
            };
        });
        return results;
    }

    route.$container = angular.element(document.getElementsByClassName('data-set')[0]);

    $scope.$on('$destroy', $scope.$root.$on('beforePrint', function () {
        scrollHelp.scrollToTop();
        route.vm.printing = true;
    }));
    $scope.$on('$destroy', $scope.$root.$on('afterPrint', function () {
        route.vm.printing = false;
    }));


// #----- END StaffListCtrl -----# //
}

);}());
