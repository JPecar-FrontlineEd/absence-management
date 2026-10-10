(function() {'use strict';angular.module('aesop')
.controller('SchoolExcludedSubstitutesCtrl', function ($scope, schoolDetailsVal, stringSvc,orgSvc,permissionSvc,callGroupApi,toastHelp,domHelp,arrayHelp) {
// #---------------------------------------------# //
// #------- SchoolExcludedSubstitutesCtrl -------# //

    // this is a route controller
    var route = this;

     var orgData = orgSvc.getOrgData();

     var canViewSubAvgScore = (orgData[0].settings.workLeaveFeedback ||
                            orgData[0].settings.workViewSubstituteAverageFeedbackScore ||
                            orgData[0].settings.subViewFeedback) &&
                            permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore');

     var dataRows = [];

     var callGroupId = schoolDetailsVal.callgroup.defaults.id;

    // View Model properties
    route.vm = {
        canViewList:permissionSvc.iHave('PREFLIST.View'),
        canEditList:permissionSvc.iHave('PREFLIST.Exclude'),
        enableAddSubs:false,
        removingSub:false,
        selected:[],
        loadingPrefs:true,
        preferences:[],
        prefEditing:false,
        enableExcludedList:true,
        callGroupId: callGroupId
    };

    $scope.strings = stringSvc.getStrings([
        'InstSelector.Tab.Header.Text.ExcludedSubstitutes',
        'PreferredSub.Button.Text.AddSubstitutes',
        'PreferredSub.Button.Text.RemovingSubstitutes',
        'PreferredSub.Button.Text.RemoveSelectedSubstitutes',
        'PreferredSub.Text.GetStartedByAddingSubstitutes'
    ]);

    $scope.$watch('route.vm.prefEditing', function (newValue,oldValue) {

            if(newValue !== oldValue){
                route.vm.enableAddSubs = !newValue;
                route.vm.enableRemoveSubs = !newValue;
            }
    });

    $scope.$watch('route.vm.showAddSubs', function (newValue,oldValue) {
             if(newValue !== oldValue){
                if(!newValue && route.vm.addingSubs){
                    route.vm.enableAddSubs = newValue;
                    route.vm.enableRemoveSubs = newValue;
                    route.vm.enablePrefList = newValue;
                    route.vm.loadingPrefs =true;
                }

            }
    });

    $scope.$watch('route.vm.addingSubs', function (newValue,oldValue) {
             if(newValue !== oldValue){
                if(!newValue){
                    GetPreferences();
                }

            }
    });

    // Actions that can be bound to from the view
     var go = $scope.go = {
        AddSubs:function(){
            if(route.vm.enableAddSubs){
                route.vm.showAddSubs = !route.vm.showAddSubs;
            }
        },
        removeSelected:removeSelected
    };

    function processResults(data){


        //route.vm.preferences = data.map(function(d) {
          dataRows = data.map(function(d){

            d.origComments = d.comments == null ? '' : d.comments;
            d.origCommentsExcluded = d.commentsExcluded == null ? '' : d.commentsExcluded;
            d.substituteName = d.substitute != null ? d.substitute.lastName + ', '+ d.substitute.firstName : '';
            if(d.substitute.middleName !== ''){
                d.substituteName += ' '+d.substitute.middleName;
            }
            d.canViewSubAvgScore =  canViewSubAvgScore && d.substitute;
            d.feedBackScore = (d.substitute && d.substitute.absenceFeedback !== null) ? d.substitute.absenceFeedback.avgScore : 0;
            d.feedBackTotal = (d.substitute && d.substitute.absenceFeedback !== null) ? d.substitute.absenceFeedback.numberOfRatings:0;
            d.selected = false;
            d.editMode = false;
            d.editable = true;
            d.saving=false;
            d.validationMessages = '';
            d.cls = '';
            return d;
        });

        dataRows.sort(arrayHelp.sort('substituteName'));


        paintNextGridRow();
    }

    function paintNextGridRow() {
        if (dataRows.length > 0) {
            route.vm.preferences.push(dataRows.shift());
            domHelp.rAF().then(function () {
                paintNextGridRow();
            });
        }

    }

    function removeSelected(){

        if(route.vm.selected.length!==0){
            var selected = [];
            var i = route.vm.selected.length;
            for(; i--;){
                selected.push(route.vm.selected[i].substitute.id);
            }

             route.vm.removingSub = true;

            var subIds = selected.join();
            route.vm.loadingPrefs  = true;
            callGroupApi.deletePreferences({'id': callGroupId,'subIds':subIds,'forPreferredList':true})
                        .then(function(prefs) {
                            route.vm.preferences = route.vm.preferences.filter(function (v) { return route.vm.selected.indexOf(v) === -1; });
                           route.vm.loadingPrefs  = false;
                           route.vm.selected = [];
                           route.vm.enableAddSubs = true;
                            route.vm.removingSub = false;
                        }, function (reason) {
                            toastHelp.error(reason.$messages, 'Error');
                            route.vm.removingSub = false;
                        });
        }
    }

    function GetPreferences(){
        route.vm.preferences=[];
        route.vm.loadingPrefs =true;
        callGroupApi.getPreferences({'id': callGroupId,'excluded':true})
                    .then(function(prefs) {
                       processResults(prefs);
                       route.vm.loadingPrefs  = false;
                       route.vm.enableExcludedList = true;
                       route.vm.enableAddSubs = true;
                    }, function (reason) {

                        toastHelp.error(reason.$messages, 'Error');
                    });
    }

    GetPreferences();

// #----- END SchoolExcludedSubstitutesCtrl -----# //
});}());