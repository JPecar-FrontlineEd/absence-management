(function() {'use strict';angular.module('aesop')
.controller('FeedbackCtrl', function ($q, $scope, $state, $location, stringSvc, institutionSvc, permissionSvc, orgSvc, absenceRequestApi, reportHelp, scrollHelp, locationHelp, parseDateFilter, toastHelp) {
// #----------------------------# //
// #------- FeedbackCtrl -------# //


    //Make sure service are ready
    var orgData = orgSvc.getOrgData();
    var canViewSubAvgScore = (orgData[0].settings.workLeaveFeedback ||
                            orgData[0].settings.workViewSubstituteAverageFeedbackScore ||
                            orgData[0].settings.subViewFeedback) &&
                            permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore');
    var canViewEmpAvgScore = (orgData[0].settings.subLeaveFeedback ||
                            orgData[0].settings.subViewFeedback) &&
                            permissionSvc.iHave('ABSRFeedBk.ViewSubExpFeedBack');
    var canViewFeedback = permissionSvc.iHave('ABSRFeedBk.ViewFeedBack');
    var canViewSubExpFeedback = permissionSvc.iHave('ABSRFeedBk.ViewSubExpFeedBack');

    // this is a route controller
    var route = this;

    route.strings = stringSvc.getStrings([
        'Reports.Title.AbsenceFeedback',
        'NoRating',
        'Report.Result.Label.NoFeedback',
        'Details',
        'Reports.Results.Label.InitialInstructions',
        'NoRecordsFound',
        'Reports.CriteriaPanel.Button.Print'
    ]);
    // View Model properties
    route.vm = {
         isLoading: false,
         dataLoaded: false,
         filters: {
            dateRange:{startDate: null, endDate: null},
            institutions:[],
            workers:[],
            workerTypes:[],
            substitutes:[],
            substitutePerformance:{ min: null, max: null },
            substituteExperience:{ min: null , max: null },
            fields: '(id,worker(id,firstName,middleName,lastName,absenceFeedback,isVacancy),startDate,endDate,' +
                'substitute(id,firstName,middleName,lastName,absenceFeedback),absences(id,institution(id,isAvailable,name)),feedBack)'
        },
        columns:[{
            key: 'dateRange', width: '4/24',
            name: 'Table.Header.Date',
            sortable: false,
            //defaultSort: 'asc',
            template: '<span>{{row.dateRange}}</span>'
        },{
            key: 'id', width: '2/24',
            name: 'Table.Header.Conf#',
            sortable: false,
            template:'<cmpt-template-confirmation-link absrid="{{ row.id }}" ></cmpt-template-confirmation-link>'
        }, {
            key: 'substitute', width: '10/24',
            name: 'Table.Header.Substitute',
            sortable: false,
            template: '<div ng-if="row.substitute != null"> ' +
                      '<cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link>'+
                      '<cmpt-template-feedback-rating ng-if="row.canViewSubAvgScore" average-score="row.feedBackScore" total-number-of-rating="row.feedBackTotal"></cmpt-template-feedback-rating>' +
                      '<div class="no-rating" ng-if="row.canViewSubAvgScore && row.feedBackScore <= 0">('+ route.strings['NoRating'] +')</div>' +
                      '</div>'
        },{
            key: 'name', width: '4/24',
            name: 'Table.Header.Employee',
            sortable: false,
            template: '<div><cmpt-template-worker-link worker-id="{{ row.worker.id }}" worker-name="{{ row.workerName }}"></cmpt-template-worker-link></div>'+
                      '<div><cmpt-template-feedback-rating ng-if="row.canViewEmpAvgScore" average-score="row.workerFeedBackScore" total-number-of-rating="row.workerFeedBackTotal"></cmpt-template-feedback-rating></div>' +
                      '<div class="no-rating" ng-if="row.canViewEmpAvgScore && row.workerFeedBackScore <= 0">('+ route.strings['NoRating'] +')</div>'
        },{
            key: 'institutions', width: '4/24',
            name: 'Table.Header.School',
            sortable: false,
            template: '<div class="multi-value" ng-class="{\'not-available\': !row.institution.isAvailable}" title="{{row.institution.name}}">{{ row.institution.name }}</div>'
        }],
        dataSet:[]
    };




    if(canViewFeedback){
        route.vm.columns[2].width = '7/24';
        route.vm.columns.splice(3,0,{
            key: 'substitutePerformacne', width: '3/24',
            name: 'Table.Header.SubPerformance',
            sortable: false,
            template: '<div ng-if="row.haveAbsenceFeedbackRatingOfSub"><cmpt-template-feedback-rating average-score="row.absenceFeedbackRatingOfSub"></cmpt-template-feedback-rating><a href="" ng-click="actions.feedbackAboutSubstitute(row.id)">'+ route.strings['Details'] +'</a></div>' +
                      '<div class="no-rating" ng-if="!row.haveAbsenceFeedbackRatingOfSub">'+ route.strings['Report.Result.Label.NoFeedback'] +'</div>'
        });
    }


    if(canViewSubExpFeedback){
        route.vm.columns[2].width = canViewFeedback ? '4/24' : '7/24';
        route.vm.columns.splice((canViewFeedback ? 5 : 4),0,{
            key: 'substituteExperience', width: '3/24',
            name: 'Table.Header.SubExperience',
            sortable: false,
            template: '<div ng-if="row.haveAbsenceFeedbackRatingOfSubExperiecne"><cmpt-template-feedback-rating average-score="row.absenceFeedbackRatingOfSubExperiecne"></cmpt-template-feedback-rating><a href="" ng-click="actions.feedbackFromSubstitute(row.id)">'+ route.strings['Details'] +'</a></div>' +
                      '<div class="no-rating" ng-if="!row.haveAbsenceFeedbackRatingOfSubExperiecne">'+ route.strings['Report.Result.Label.NoFeedback'] +'</div>'
        });
    }


    function processResults (data) {
        route.vm.dataSet = data.map(function(d) {
            d.workerName = d.worker.isVacancy ? d.worker.lastName : d.worker.lastName + ', ' + d.worker.firstName;
            d.dateRange = d.startDate === d.endDate ? parseDateFilter(d.startDate,'M/d/yyyy') : parseDateFilter(d.startDate,'M/d/yyyy') + ' - ' + parseDateFilter(d.endDate,'M/d/yyyy');
            d.substituteName = d.substitute != null ? d.substitute.firstName + ' ' + d.substitute.lastName : '';
            d.institution = d.absences[0].institution;
            // Following properties are to paint the substitute column
            d.canViewSubAvgScore =  canViewSubAvgScore && d.substitute && d.substitute.absenceFeedback;
            d.feedBackScore = (d.substitute && d.substitute.absenceFeedback !== null) ? d.substitute.absenceFeedback.avgScore : 0;
            d.feedBackTotal = (d.substitute && d.substitute.absenceFeedback !== null) ? d.substitute.absenceFeedback.numberOfRatings:0;
            // Following properties are to paint the substitute Performance column
            d.haveAbsenceFeedbackRatingOfSub = d.feedBack && d.feedBack.ratingOfSub && d.feedBack.ratingOfSub > 0;
            d.absenceFeedbackRatingOfSub = d.haveAbsenceFeedbackRatingOfSub ? d.feedBack.ratingOfSub : 0;
            //Following properties are to paint the worker feedback
            d.canViewEmpAvgScore =  canViewEmpAvgScore && d.worker.absenceFeedback;
            d.workerFeedBackScore = d.worker.absenceFeedback !== null ? d.worker.absenceFeedback.avgScore : 0;
            d.workerFeedBackTotal = d.worker.absenceFeedback !== null ? d.worker.absenceFeedback.numberOfRatings:0;
            // Following properties are to paint the substitute Experience column
            d.haveAbsenceFeedbackRatingOfSubExperiecne = d.feedBack && d.feedBack.ratingOfSubsExperience && d.feedBack.ratingOfSubsExperience > 0;
            d.absenceFeedbackRatingOfSubExperiecne = d.haveAbsenceFeedbackRatingOfSubExperiecne ? d.feedBack.ratingOfSubsExperience : 0;
            return d;
        });

    }

    angular.element(document).ready(function () {
        fetchInitialResults();
    });
    function fetchInitialResults() {
        if (locationHelp.hasSearch()) {
            locationHelp.parseSearch(route.vm.filters);
            makeCallToApi();
        }else{
            route.vm.filters.dateRange.startDate = new Date();
            route.vm.filters.dateRange.endDate = new Date();
            route.vm.filters.substitutePerformance = { min: 0, max: 5 };
            route.vm.filters.substituteExperience = { min: 0, max: 5 };
        }
    }

    function makeCallToApi() {
        if(!route.vm.isLoading){
            toastHelp.clear();
            var _defer = $q.defer();
            route.vm.isLoading = true;
            route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
            route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
            var filter = reportHelp.convertAbsenceRequestFilter(route.vm.filters);
            filter.feedbackTotalData = true;
            absenceRequestApi.get(filter).then(function (data){
                var flatObj = locationHelp.flattenObject(route.vm.filters);
                locationHelp.updateSearch(flatObj);
                processResults(data);
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
    }

    // Actions that can be bound to from the view
    route.go = {
        callToServer: makeCallToApi,
        feedbackAboutSubstitute: function(absrId) {
            $state.go('base.detail.substituteFeedback', {absrid: absrId, back: $location.url()}, {reload: true});
        },
        feedbackFromSubstitute: function(absrId) {
            $state.go('base.detail.workerFeedback', {absrid: absrId, back: $location.url()}, {reload: true});
        }
    };

// #----- END FeedbackCtrl -----# //
});}());