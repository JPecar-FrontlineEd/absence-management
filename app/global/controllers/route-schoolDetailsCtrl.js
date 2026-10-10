(function() {'use strict';angular.module('aesop')
.controller('SchoolDetailsCtrl', function ($scope, $state, $stateParams, stringSvc, permissionSvc, institutionSvc, schoolDetailsVal) {
// #---------------------------------# //
// #------- SchoolDetailsCtrl -------# //

    // this is a route controller
    var route = this;
    var instId = $stateParams.instId;

    route.strings = stringSvc.getStrings([
        'GeneralInformation',
        'InstSelector.Tab.Header.Text.TimeSettings',
        'InstSelector.Tab.Header.Text.PreferredSubstitutes',
        'InstSelector.Tab.Header.Text.ExcludedSubstitutes',
        'InstSelector.Tab.Header.Text.SharedFiles',
        'schoolList.heading.selectSchool',
        'SchoolSettings.text.SchoolSettings'
    ]);

    var tabs = [{
            title: route.strings['GeneralInformation'],
            route:'/settings/school/'+instId+'/general-info',
            state: 'base.schoolDetails.generalInfo',
            visible:true
        },{
            title: route.strings['InstSelector.Tab.Header.Text.TimeSettings'],
            route:'/settings/school/'+instId+'/time-settings',
            state: 'base.schoolDetails.timeSettings',
            visible:true
        },{
            title: route.strings['InstSelector.Tab.Header.Text.PreferredSubstitutes'],
            route:'/settings/school/'+instId+'/preferred-substitutes',
            state: 'base.schoolDetails.preferredSubs',
            visible: permissionSvc.iHave('PREFLIST.View')
        },{
            title: route.strings['InstSelector.Tab.Header.Text.ExcludedSubstitutes'],
            route:'/settings/school/'+instId+'/excluded-substitutes',
            state: 'base.schoolDetails.excludedSubs',
            visible: permissionSvc.iHave('PREFLIST.View')
        },{
            title: route.strings['InstSelector.Tab.Header.Text.SharedFiles'],
            route:'/settings/school/'+instId+'/shared-files',
            state: 'base.schoolDetails.sharedFiles',
            visible: permissionSvc.iHave('WEBFUNC.UPABSR')
        }];

    // View Model properties
    route.vm = {
        tabs: tabs,
        institution: schoolDetailsVal,
        schoolName: schoolDetailsVal.name,
        institutions: [],
        showInstitutions: true
    };

    var myInsts = institutionSvc.getMyInstitutions();
    route.vm.institutions = myInsts.map(function (i){
        i.value = i.name;
        return i;
    });
    if (route.vm.institutions.length > 1) {
        route.vm.showInstitutions = true;
    } else {
        route.vm.showInstitutions = false;
    }

    // Actions that can be bound to from the view
    route.go = {
        someAction: function () {
            route.vm.property = 'something';
        }
    };

    $scope.$watch('route.vm.institution', function (newInst) {
        if (newInst != null && instId != newInst.id) {
            $state.go($state.current, {instId: newInst.id}, {reload: true});
        }
    });

// #----- END SchoolDetailsCtrl -----# //
});}());