(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrUndeletePanel', function () {return {

// directive options
restrict: 'E',
scope: {
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-undelete-panel/absrUndeletePanel.html',

// #---------------------------------------# //
// #---- Component (cmpt-absr-buttons) ----# //

controller: function ($scope,stringSvc, $state, absenceRequestApi, substituteApi, toastHelp, $q,absrStateVal,absrSvc,
                        ngDialog, parseDateFilter, orgSvc, dateHelp,$rootScope) {


    // Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
        'Deleted',
        'Status',
        'ts.label.undelete',
        'ClosedConflictHeader',
        'SubConflictHeader',
        'ConflictHeaderMessage',
        'ClosedDayConflictWarning',
        'ClosedDayConflictMessage',
        'SubConflictWarning',
        'SubConflictMessage',
        'InService',
        'Closed',
        'SubConflictPopupHeaderMsg',
        'ConflictPopupHeaderMsg',
        'UndeleteMutilpleConflictMsg',
        'ts.label.cancel',
        'Absence',
        'Vacancy',
        'Vacancies',
        'Absences',
        'MultipleConflictsLinkText',
        'DateConflictLinkText',
        'EmpConflictReasonMessage',
        'EmpConflictMessage',
        'EmpConflictHeaderMessage',
        'Close',
        'NoSubRemovalPermission',
        'DeniedAbsenceRequestHeaderText',
        'DeniedAbsenceRequestMessageText',
        'Undelete.NoAbsenceDay'
    ]);
    var dialog;


    //Parse conflict data from absrStateVal and set into  subConflictFromAbsr and   closedDayConflictFromAbsr and add to subConflictData and closedDayConflict
    

    var absenceRequestConflicts =[]= absrStateVal.absr.AbsenceRequestConflicts;
    var subName = absrStateVal.absr.substitute != null ?absrStateVal.absr.substitute.firstName + ' ' +absrStateVal.absr.substitute.lastName : '';
    var subId = absrStateVal.absr.substitute != null ? absrStateVal.absr.substitute.id: 0;
    var orgData = orgSvc.getOrgData();
    var absenceRequestTypeText = ( absrStateVal.worker.isVacancy) ? strings['Vacancy'] :strings['Absence'];
    var permissionWarning = $scope.permissionWarning = {message : '', isPermitted: true};
    var canRemoveSub = absrStateVal.context.canRemoveSub;
    var isAllowedOnNoAbsenceDays = absrStateVal.context.IsAllowedOnNoAbsenceDays;
    var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var vm = $scope.vm = {
            subConflictData: {
                confirmationNumber: '' ,
                FromDate: '',
                ToDate: '',
                orgName: '',
                institutionName: '',
                isDifferentDistrict: false
            },
            closedDayConflictData: {
                dayType: '' ,
                FromDate: '',
                ToDate: '',
                instId: '',
                institutionName: ''
            },
            subConflict: {
                headerText: strings['SubConflictHeader'],
                message : strings['SubConflictMessage'].replace('{0}',absenceRequestTypeText.toLowerCase()),
                subName: subName,
                subId: subId,
                data: [],
                warningMessage : strings['SubConflictWarning'].replace('{0}','').replace('{1}',absrStateVal.absr.id).replace('{2}',absenceRequestTypeText.toLowerCase())
            },
            empConflict: {
                headerText: strings['EmpConflictHeaderMessage'],
                message : strings['EmpConflictMessage'],
                data: []
            },
            closedDayConflict:{
                headerText: strings['ClosedConflictHeader'],
                message: strings['ClosedDayConflictMessage'].replace('{0}',absenceRequestTypeText.toLowerCase()).replace('{1}', absrStateVal.absr.id).replace('{2}',( absrStateVal.worker.isVacancy) ? strings['Vacancies'] :strings['Absences']),
                data: [],
                warningMessage: strings['ClosedDayConflictWarning'].replace('{1}',absrStateVal.absr.id).replace('{0}',absenceRequestTypeText )
            },
            permissionConflictData:{
                headerText: strings['ConflictPopupHeaderMsg'].replace('{0}',(strings['Absence'] + ' ')),
                headerMessage: strings['ConflictHeaderMessage'],
                warning: permissionWarning
            },
            headerMessage: null,
            isLoading:false,
            isConflict: absenceRequestConflicts.length != 0,
            subConflictCount: 0,
            closedDayConflictCount :0,
            empConflictCount: 0,
            isMultiConflict: true,
            employeeConflictUndeletePanelMessage: '',
            isDenied : absrStateVal.absr.isDenied
    }
   
   mapConflictData(absenceRequestConflicts);
   setHeaderMessage();


    // Actions that can be bound to from the view
	var go = $scope.go = {
        undeleteAction: function (){
            vm.isLoading = true;
            processUndelete().then(function(data)
            {  
                 absrSvc.setupAbsrState(absrStateVal.id, absrStateVal.editMode)
                .then(function (){
                    vm.isLoading = false;
                    if (dialog != undefined) {
                        ngDialog.close(dialog.id);
                    }
                    $state.go('base.detail.view');
                    $rootScope.$emit("absenceUndeleted");
                }, function (reasons){
                    vm.isLoading = false;
                    toastHelp.error(reasons.errors,'Error');
                });
            });
        },
        showConflictPopup: function(){
            dialog = ngDialog.open({
                template:'/components/absr/cmpt-absr-undelete-panel/undelete-absence-conflict.html',
                closeByDocument: false,
                showClose: true,
                closeByEscape: true,
                closeByNavigation: true,
                className:'ngdialog-theme-default custom-width-conflict-700',
                data: {
                    headerMessage: vm.headerMessage,
                    isMultiConflict: vm.isMultiConflict,
                    multipleConflictMessage: strings['UndeleteMutilpleConflictMsg'].replace('{0}',absenceRequestTypeText.toLowerCase()),
                    subConflict: vm.subConflict,
                    closedDayConflict: vm.closedDayConflict,
                    empConflict : vm.empConflict,
                    isDenied : vm.isDenied,
                    deniedMessage : strings['DeniedAbsenceRequestMessageText'],
                    permissionConflictData: vm.permissionConflictData,
                    buttons: [
                    {
                        title:  strings['ts.label.undelete'] + ' ' + absenceRequestTypeText,
                        cls: 'fl-button fl-primary',
                        isEnabled : !permissionWarning.isPermitted ? false : (vm.empConflictCount == 0 && !vm.isDenied),
                        isUndelete: true,
                        marginRight: '',
                        action: function () 
                        {
                            go.undeleteAction();
                            ngDialog.close(dialog.id);
                        }
                    },
                    {
                        title: (vm.isDenied || !permissionWarning.isPermitted) ? strings['Close'] : strings['ts.label.cancel'],
                        cls: 'fl-button',
                        isUndelete: false,
                        marginRight: (vm.isDenied || vm.empConflictCount > 0 || !permissionWarning.isPermitted)? 'marginRight108px': '',
                        isEnabled: true,
                        action: function () 
                        {
                            ngDialog.close(dialog.id);
                        }
                    }]
                }
            });
        },
        undeleteAbsenceRequest: function(){
            validatePermissionsForUndelete();
            if(!vm.isDenied && vm.empConflictCount==0)
            {
                if(vm.isConflict)
                {
                    go.showConflictPopup();
                }
                else
                {
                    go.undeleteAction();
                }
            }
            else
            {
                go.showConflictPopup();
            }
        }
    };

    //Private methods
    function mapConflictData(absenceRequestConflicts)
    {
        absenceRequestConflicts.forEach(function(conflict)
        {
            var absDate = parseDateFilter(conflict.AbsDate, 'MM/dd/yyyy');
            if(conflict.ConflictType == 'Closed/Inservice')
            {   
                var index = vm.closedDayConflict.data.findIndex(
                    x=> x.InstId = conflict.InstId && 
                    x.ToDate >= parseDateFilter(dateHelp.addDays(new Date(absDate), -1), 'MM/dd/yyyy') && x.FromDate <= absDate);
                    
                if(index != -1)
                {
                    if(vm.closedDayConflict.data[index].ToDate < absDate)
                    {
                        vm.closedDayConflict.data[index].ToDate = absDate; 
                    }
                }
                else
                {
                    var obj = angular.copy(vm.closedDayConflictData);
                    obj.FromDate = absDate;
                    obj.ToDate = absDate;

                    if(conflict.ClosedDayType == 1)
                    {
                        obj.dayType = strings['Closed']
                    }
                    else
                    {
                        obj.dayType = strings['InService']
                    }
                    obj.institutionName = conflict.InstitutionName;
                    obj.instId =  conflict.InstId;
                    vm.closedDayConflict.data[vm.closedDayConflictCount] =  obj;
                    vm.closedDayConflictCount++;
                }
            }
            else if(conflict.ConflictType == 'Sub')
            {
                var index = vm.subConflict.data.findIndex(
                    x=> x.confirmationNumber == conflict.AbsrId &&
                    x.ToDate >= parseDateFilter(dateHelp.addDays(new Date(absDate), -1), 'MM/dd/yyyy') && x.FromDate <= absDate);
                    
                if(index != -1)
                {
                    if(vm.subConflict.data[index].ToDate < absDate)
                    {
                        vm.subConflict.data[index].ToDate = absDate; 
                    }
                }
                else
                {
                    var obj = angular.copy(vm.subConflictData);
                    obj.FromDate = absDate;
                    obj.ToDate = absDate;
                    if(conflict.OrgId !=  orgData[0].id)
                    {
                         obj.isDifferentDistrict = true;
                    }
                    obj.institutionName = conflict.InstitutionName;
                    obj.confirmationNumber = conflict.AbsrId;
                    obj.orgName = conflict.OrganizationName
                
                    vm.subConflict.data[vm.subConflictCount] = obj;
                    vm.subConflictCount++;
                }
            }
            else
            {
                var index = vm.empConflict.data.findIndex(
                    x=> x.confirmationNumber == conflict.AbsrId &&
                    x.ToDate >= parseDateFilter(dateHelp.addDays(new Date(absDate), -1), 'MM/dd/yyyy') && x.FromDate <= absDate);
                    
                if(index != -1)
                {
                    if(vm.empConflict.data[index].ToDate < absDate)
                    {
                        vm.empConflict.data[index].ToDate = absDate; 
                    }
                }
                else
                {
                    var obj = angular.copy(vm.subConflictData);
                    obj.ToDate = absDate;
                    obj.FromDate = absDate;

                    if(conflict.OrgId !=  orgData[0].id )
                    {
                         obj.isDifferentDistrict = true;
                    }
                    obj.institutionName = conflict.InstitutionName;
                    obj.confirmationNumber = conflict.AbsrId;
                    obj.orgName = conflict.OrganizationName;
                    vm.empConflict.data[vm.empConflictCount] = obj;
                    vm.empConflictCount++;
                }
            }
        });

        if(vm.subConflictCount>0 && vm.closedDayConflictCount == 0)
        {
            vm.isMultiConflict = false;
        }
    }

    function processUndelete(){
        var _defer = $q.defer();
        if(vm.subConflictCount>0)
        {
            substituteApi.removeSub({id:absrStateVal.absr.substitute.id ,absrId:absrStateVal.id , hideJobFromSub: false, sendSubRemovedNotification: false})
               .then(function(data){
                undeleteAbsence(_defer);
      
            }, function (reason){
                toastHelp.error(reason.$messages, 'Error');
                vm.isLoading =false;
                return _defer.reject();
            });
        }
        else
        {
            undeleteAbsence(_defer);
        }
        return _defer.promise;
    }

    function undeleteAbsence(_defer)
    {
        absenceRequestApi.undeleteAbsence({absrid: absrStateVal.id}, {})
            .then(function (data){
                    return _defer.resolve();
                }, 
                function (reason){
                    toastHelp.error(reason.$messages, 'Error');
                    vm.isLoading =false; 
                    return _defer.reject();
                });
    }

    function setHeaderMessage(){
        
        if(vm.isDenied)
        {
            vm.headerMessage =  strings['DeniedAbsenceRequestHeaderText'];
        }
        else if(vm.closedDayConflict.data.length == 0 && vm.empConflict.data.length ==0 && vm.subConflict.data.length>0)
        {
            vm.headerMessage =  strings['SubConflictPopupHeaderMsg'];
        }
        else if(vm.closedDayConflict.data.length == 0 && vm.empConflict.data.length >0 && vm.subConflict.data.length==0)
        {
            vm.headerMessage = strings['EmpConflictHeaderMessage'];
        }
        else 
        {
            vm.headerMessage = strings['ConflictPopupHeaderMsg'].replace('{0}',absenceRequestTypeText);
        }  
    }

    function validatePermissionsForUndelete() {
        if (!isAllowedOnNoAbsenceDays) {
            checkForNoAbsenceDay();
        }
        if (permissionWarning.isPermitted) {
            checkForRemoveSubPermission();        
        }
    }

    function checkForRemoveSubPermission() {
        if (!canRemoveSub && absrStateVal.absr.substitute != null && vm.subConflictCount > 0) {
            vm.isConflict = true;
            permissionWarning.message = strings['NoSubRemovalPermission'].replace('{0}', absenceRequestTypeText);
            permissionWarning.isPermitted = false;
        }
    }

    function checkForNoAbsenceDay() {
        absrStateVal.absr.absences.forEach(absence => {
            var absenceDay = new Date(absence.date).getDay();
            if (!absrStateVal.context.dragSelectDOW[absenceDay]) {
                vm.isConflict = true;
                permissionWarning.message = strings["Undelete.NoAbsenceDay"].replace('{0}', weekDays[absenceDay]);
                permissionWarning.isPermitted = false;
            }
        });
    }
}

// #-- END Component (cmpt-absr-buttons) --# //
// #---------------------------------------# //
};});}());
