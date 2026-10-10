(function() {'use strict';angular.module('aesop')
.controller('SchoolPreferredSubstitutesCtrl', function ($scope,schoolDetailsVal,stringSvc,orgSvc,callGroupApi,toastHelp,dateHelp,permissionSvc,callGroupHelp,domHelp,arrayHelp) {
// #----------------------------------------------# //
// #------- SchoolPreferredSubstitutesCtrl -------# //

    // this is a route controller
    var route = this;

     var orgData = orgSvc.getOrgData();

     var canViewSubAvgScore = (orgData[0].settings.workLeaveFeedback ||
                            orgData[0].settings.workViewSubstituteAverageFeedbackScore ||
                            orgData[0].settings.subViewFeedback) &&
                            permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore');

    //var canEditComments = permissionSvc.iHave('PREFLIST.COMMENTEDIT');
    //var canViewComments = permissionSvc.iHave('PREFLIST.COMMENTVIEW');
    //var canViewList = permissionSvc.iHave('Permission.PREFLIST.View');
    //var canEditList = permissionSvc.iHave('PREFLIST.Edit');

     var defaults = schoolDetailsVal.callgroup.defaults;
     var callGroupId = defaults.id;

     var dataRows = [];

    // View Model properties
    route.vm = {
        schoolName: schoolDetailsVal.name,
        schoolDefaults:schoolDetailsVal.callgroup.defaults,
        userHrsVisMode: orgData[0].settings.UserHrsVisMode,
        enableReorderButtons: false,
        showOrderColumn:schoolDetailsVal.callgroup.defaults.callGroupOrder === 0,
        enableAddSubs :true,
        enablePrefList:true,
        removingSub:false,
        enableRemoveSubs:false,
        defaultsDirty:false,
        defaultsEditable:false,
        loadingPrefs:true,
        preferences:[],
        canViewList:permissionSvc.iHave('PREFLIST.View'),
        canEditList:permissionSvc.iHave('PREFLIST.Edit'),
        addingSubs: false,
        showAddSubs: false,
        callGroupId: callGroupId,
        selected:[],
        prefEditing:false
    };



    $scope.strings = stringSvc.getStrings([
        'InstSelector.Tab.Header.Text.PreferredSubstitutes',
        'PreferredSub.Button.Text.LoadingSubstitutes',
        'PreferredSub.Button.Text.AddSubstitutes',
        'PreferredSub.Button.Text.RemovingSubstitutes',
        'PreferredSub.Button.Text.RemoveSelectedSubstitutes',
        'PreferredSub.Text.GetStartedByAddingSubstitutes'
    ]);

     /*Currently this watch is triggered when the defaults is saved.*/
    $scope.$on('defaultsUpdated', function (event, args) {
          GetPreferences();
     });


    /*Currently this watch is triggered when the defaults is saved.*/
    /*$scope.$watchCollection('route.vm.schoolDefaults', function (newValue,oldValue) {
            console.log('in watch:',newValue,oldValue);
            if(newValue !== oldValue){
                GetPreferences();
            }
    });*/

    $scope.$watch('route.vm.defaultsDirty', function (newValue,oldValue) {
            if(newValue !== oldValue){
                route.vm.enableAddSubs = !newValue;
                route.vm.enableRemoveSubs = !newValue;
                route.vm.enablePrefList = !newValue;
            }
    });

    $scope.$on('prefediting', function (event, args) {

        route.vm.enableAddSubs = !args.message;
        route.vm.enableRemoveSubs = !args.message;
        route.vm.defaultsEditable = !args.message;
     });

    /*$scope.$watch('route.vm.prefEditing', function (newValue,oldValue) {

            if(newValue !== oldValue){
                route.vm.enableAddSubs = !newValue;
                route.vm.enableRemoveSubs = !newValue;
                route.vm.defaultsEditable = !newValue;
            }
    });*/

    $scope.$watch('route.vm.enableReorderButtons', function (newValue,oldValue) {
             if(newValue !== oldValue){
                //route.vm.enableReorderButtons =!newValue;
                route.vm.enableAddSubs = !newValue;
                route.vm.enableRemoveSubs = !newValue;
                route.vm.enablePrefList = !newValue;
                route.vm.defaultsEditable = !newValue;
            }
    });

    $scope.$watch('route.vm.showAddSubs', function (newValue,oldValue) {
             if(newValue !== oldValue){
                if(!newValue && route.vm.addingSubs){
                    route.vm.enableAddSubs = newValue;
                    route.vm.enableRemoveSubs = newValue;
                    route.vm.enablePrefList = newValue;
                    route.vm.defaultsEditable = newValue;
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

    function GetPreferences(){
        route.vm.loadingPrefs =true;
        callGroupApi.getPreferences({'id': callGroupId,'excluded':false})
                    .then(function(prefs) {
                       processResults(prefs);
                       route.vm.showOrderColumn = parseInt(schoolDetailsVal.callgroup.defaults.callGroupOrder) === 0;
                       route.vm.loadingPrefs  = false;
                       route.vm.defaultsEditable = true;
                       route.vm.enablePrefList = true;
                       route.vm.enableAddSubs = true;
                    }, function (reason) {

                        toastHelp.error(reason.$messages, 'Error');
                    });
    }

    function paintNextGridRow() {
        if (dataRows.length > 0) {
            route.vm.preferences.push(dataRows.shift());
            domHelp.rAF().then(function () {
                paintNextGridRow();
            });
        }
    }

    function revertOrder(){
        if(route.vm.enableReorderButtons){
            for(var x=0; x<route.vm.preferences.length; x++){
                route.vm.preferences[x].order= route.vm.preferences[x].origOrder;
            }

            route.vm.preferences.sort(function(a,b){
                    return a.order - b.order;
            });
            route.vm.enableReorderButtons=false;
        }
    }

    function saveOrder(){
        if(route.vm.enableReorderButtons){
            var callGroupPreferences = [];
            for(var x=0; x<route.vm.preferences.length; x++){
                callGroupPreferences.push(callGroupHelp.prepareForAPICall(route.vm.preferences[x]));
            }
            route.vm.loadingPrefs = true;

            callGroupApi.upsertPreferences({'id': callGroupId},callGroupPreferences)
                    .then(function(prefs) {
                        route.vm.enableReorderButtons=false;
                        route.vm.loadingPrefs = false;
                    }, function (reason) {

                          toastHelp.error(reason.$messages, 'Error');
            });

        }
    }

    function processResults(data){
        if(parseInt(defaults.callGroupOrder) === 0){
            var order = 0,i;


            var nonNullOrderResults = data.filter(function(value){
                return value.order !== null;
            }).sort(arrayHelp.sort('order'));


            for(i=0; i<nonNullOrderResults.length; i++){
                order ++;
                nonNullOrderResults[i].order = order;
            }


            var nullOrderResults = data.filter(function(value){
                return value.order == null;
            });

            i = nullOrderResults.length;
            for(i=0; i<nullOrderResults.length; i++){
                order ++;
                nullOrderResults[i].order = order;
            }

            data = data.sort(arrayHelp.sort('order'));
        }

        route.vm.preferences = [];

        //route.vm.preferences = data.map(function(d) {
          dataRows = data.map(function(d){
            var maxVisMins,minVisMins,visHours;
            maxVisMins = d.maxVisibilityMinutes == null ? defaults.maxVisibilityMinutes : d.maxVisibilityMinutes;
            minVisMins = d.minVisibilityMinutes == null ? defaults.minVisibilityMinutes : d.minVisibilityMinutes;
            visHours = d.visibilityHours == null ? defaults.visibilityHours : d.visibilityHours;
            d.visibilityPercent = d.visibilityPercent == null ? defaults.visibilityPercent : d.visibilityPercent;
            d.origVisibilityPercent = d.visibilityPercent == null ? defaults.visibilityPercent : d.visibilityPercent;
            d.origOrder = d.order;

            d.substituteName = d.substitute != null ? d.substitute.lastName + ', '+ d.substitute.firstName : '';
            if(d.substitute.middleName !== ''){
                d.substituteName += ' '+d.substitute.middleName;
            }
            d.canViewSubAvgScore =  canViewSubAvgScore && d.substitute;
            d.feedBackScore = (d.substitute && d.substitute.absenceFeedback !== null) ? d.substitute.absenceFeedback.avgScore : 0;
            d.feedBackTotal = (d.substitute && d.substitute.absenceFeedback !== null) ? d.substitute.absenceFeedback.numberOfRatings:0;
            d.origComments = d.comments == null ? '' : d.comments;
            d.origMinHrs = dateHelp.getHrsFromMins(minVisMins);
            d.minHrs = dateHelp.getHrsFromMins(minVisMins);
            d.origMinsMins = dateHelp.getHrsRemainingMinsFromMins(minVisMins);
            d.minMins = dateHelp.getHrsRemainingMinsFromMins(minVisMins);
            d.origMaxDays = dateHelp.getDaysFromMins(maxVisMins);
            d.maxDays = dateHelp.getDaysFromMins(maxVisMins);
            d.origMaxHrs = dateHelp.getDaysRemainingHrsFromMins(maxVisMins);
            d.maxHrs = dateHelp.getDaysRemainingHrsFromMins(maxVisMins);
            d.visHours = defaults.visibilityHours;
            d.origCallGroupOrder = defaults.callGroupOrder;
            d.origVisibilityDays = dateHelp.getDaysFromMins(visHours*60);
            d.visibilityDays = dateHelp.getDaysFromMins(visHours*60);
            d.origVisibilityHours = dateHelp.getHrsRemainingMinsFromMins(visHours*60);
            d.visibilityHours = dateHelp.getHrsRemainingMinsFromMins(visHours*60);
            d.visPerErrors = [];
            d.visHrErrors = [];
            d.minMinErrors = [];
            d.minHrErrors = [];
            d.maxDaysErrors = [];
            d.maxHrsErrors = [];
            d.visDaysErrors = [];
            d.selected = false;
            d.editMode = false;
            d.editable = true;
            d.saving=false;
            d.validationMessages = [];
            d.cls = '';
            return d;
        });

        if(parseInt(schoolDetailsVal.callgroup.defaults.callGroupOrder) === 1){
            dataRows.sort(arrayHelp.sort('substituteName'));
        }

        paintNextGridRow();
    }

    GetPreferences();

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
                           route.vm.defaultsEditable = true;
                            route.vm.removingSub = false;
                        }, function (reason) {
                            toastHelp.error(reason.$messages, 'Error');
                            route.vm.removingSub = false;
                        });
        }
    }


    var go = $scope.go = {
        removeSelected:removeSelected,
        AddSubs:function(){
            if(route.vm.enableAddSubs){
                route.vm.showAddSubs = !route.vm.showAddSubs;
            }
        },
        revertPrefOrder:revertOrder,
        savePrefOrder:saveOrder
    };


// #----- END SchoolPreferredSubstitutesCtrl -----# //
});}());