(function() {'use strict';angular.module('aesop')
.controller('AbsInteractiveDownloadCtrl', function ($scope,toastHelp,reportWriterApi,absenceInteractiveApi,$q,ngDialog,stringSvc,permissionSvc,parseDateFilter,reportHelp,urlHelp,arrayHelp,stringHelp,$window) {
// #------------------------------------------# //
// #------- AbsInteractiveDownloadCtrl -------# //
    var dialog = this;
    var data = $scope.ngDialogData;
    var reportExec = null;

    var strings = $scope.strings =  stringSvc.getStrings([
        'Reports.DownloadDialog.Template.Instructions',
        'Default',
        'Reports.DownloadDialog.Email.Instructions',
        'Input.Placeholder.EnterYourEmail',
        'AbsenceInteractive.DownloadDialog.Button.DownloadDetails',
        'AbsenceInteractive.DownloadDialog.Title.DownloadDetails',
        'AbsenceInteractive.Downloaddialog.Button.ResumeDownload',
        'AbsenceInteractive.DownloadDialog.Button.CancelDownload',
        'AbsenceInteractive.DownloadDialog.Button.RetrievingDownload',
        'AbsenceInteractive.DownloadDialog.Button.RetrieveDownload',
        'AbsenceInteractive.DownloadDialog.Validation.SelectTemplate',
        'AbsenceInteractive.DownloadDialog.Validation.EmailInvalid',
        'AbsenceInteractive.DownloadDialog.Label.SelectTemplate',
        'All',
        'Cancel',
        'AbsenceInteractive.DownloadDialog.Button.DownloadStatus'
    ]);

   $scope.showButtonOptions ={
        'CancelDownload':false,
        'Resume':false,
        'Retrieving':false,
        'Cancel':true,
        'Retrieve':true,
        'Download':false,
   };

    $scope.isEmailValid = true;
    $scope.isTemplateSelected = true;
    $scope.canAccessReportWriter = canUserAccessReportWriter();

    $scope.reportDialogData = {
            'dataLoaded':false,
            'header':strings['AbsenceInteractive.DownloadDialog.Title.DownloadDetails'],
            'date':'',
            'mainInstructions':strings['Reports.DownloadDialog.Template.Instructions'],
            'defaultText':strings['Default'],
            'emailInstructions':strings['Reports.DownloadDialog.Email.Instructions'],
            'enterEmail':strings['Input.Placeholder.EnterYourEmail'],
            'configOptions':[],
            'selected':0,
            'defaultTemplate':1,
            'email':'',
            'buttons':[{
                    name:'Resume',
                    title: strings['AbsenceInteractive.Downloaddialog.Button.ResumeDownload'],
                    action: function(obj){
                        //var btnObj = this;
                        //btnObj.icon = 'fa-spinner fa-spin';
                        // using the promise created on call now
                        // changing the icon when call is placed successfully.
                        //route.go.callNow().then(function (){
                            //btnObj.icon = 'fa-check';
                        //});
                    }
                },{
                    name:'CancelDownload',
                    title: strings['AbsenceInteractive.DownloadDialog.Button.CancelDownload'],
                    icon:'fa-times',
                    cls:'fl-negative',
                    action: function(obj){
                        //ngDialog.close($scope.downloadDialog.id);
                        $scope.downloadDialog = null;                              }
                },{
                    name:'Retrieving',
                    title: strings['AbsenceInteractive.DownloadDialog.Button.RetrievingDownload'],
                    icon:'fa-spinner fa-spin',
                    cls: 'fl-primary',
                    action: function(obj){
                        //ngDialog.close($scope.downloadDialog.id);
                        $scope.downloadDialog = null;                              }
                },{
                    name:'Download',
                    title: strings['AbsenceInteractive.DownloadDialog.Button.DownloadDetails'],
                    icon:'',
                    cls: 'fl-positive',
                    action: function(obj){
                        DownloadExecution();
                        $scope.downloadDialog = null;                              }
                },{
                    name:'Retrieve',
                    title: strings['AbsenceInteractive.DownloadDialog.Button.RetrieveDownload'],
                    icon:'fa-check',
                    cls:'fl-primary',
                    action: function(obj){
                        if (!isFormValid()) { return false; }

                        GetReportExecution();
                    }
                },{
                    name:'Cancel',
                    title: strings['Cancel'],
                    icon:'fa-times',
                    action: function(obj){
                        ngDialog.close();
                        $scope.isEmailValid = true;
                        $scope.isTemplateSelected = true;
                        //$scope.downloadDialog = null;                           }
                    }
                }]
        };


    var isRetrieveDownload = false;
    $scope.fieldsEnabled = function() {
        return !isRetrieveDownload;
    }
    $scope.templateSelectEnabled = function() {
        return $scope.fieldsEnabled() && parseInt($scope.reportDialogData.defaultTemplate, 10) === 2 && $scope.canAccessReportWriter;
    }


    function isFormValid() {
        var isValid = true;
        $scope.isEmailValid = true;
        $scope.isTemplateSelected = true;
        var templateOption = parseInt($scope.reportDialogData.defaultTemplate, 10);
        if (templateOption === 2 && $scope.reportDialogData.selected === null) {
            $scope.isTemplateSelected = false;
            isValid = false;
        }
        var email = $scope.reportDialogData.email;
        if (email.length > 0 && !stringHelp.isValidEmail(email)) {
            $scope.isEmailValid = false;
            isValid = false;
        }
        return isValid;
    }

    function listDialogConfigs(){        
        toastHelp.clear();
        var row = data.row;
        $scope.reportDialogData.date = row.title;
        //Call api and load data
        if(!data.routeVm.isLoading && $scope.canAccessReportWriter) {
            var _defer = $q.defer();
            data.routeVm.isLoading = true;
            var filter = {'showAllUsers':true,'reportTypes':1};
            filter.fields = 'id,name';
            reportWriterApi.reports(filter).then(function (d){
                processReportData(d,row);
                data.routeVm.isLoading = false;
                data.routeVm.dataLoaded = true;
                return _defer.resolve();
            },function(reasons){
                data.routeVm.isLoading = false;
                toastHelp.error(reasons.$messages, 'Error');
                return _defer.resolve();
            });
            return _defer.promise;
        }
        if (!$scope.canAccessReportWriter) {
            $scope.reportDialogData.dataLoaded = true;    
        }
    }


    function processReportData(data,row){
        data.sort(arrayHelp.sort('name'));
        data.splice(0, 0, { id: null, name: strings['AbsenceInteractive.DownloadDialog.Label.SelectTemplate']} );
        $scope.reportDialogData.dataLoaded =true;
        $scope.reportDialogData.configOptions = data;
        $scope.reportDialogData.selected=data[0].id;
    }

    var intervalExecutionComplete,loadingExecution=false;

    function GetReportExecution(){
        if(!data.routeVm.isLoading){
            isRetrieveDownload = true;
            toastHelp.clear();
            var _defer = $q.defer();
            //data.routeVm.isLoading = true;
            data.filters.dateRange.startDate = parseDateFilter(data.filters.dateRange.startDate, 'MM/dd/yyyy');
            data.filters.dateRange.endDate = parseDateFilter(data.filters.dateRange.endDate, 'MM/dd/yyyy');
            var filter = reportHelp.convertAbsenceInteractiveFilter(data.filters);
            filter.emailTo=$scope.reportDialogData.email;
            if($scope.reportDialogData.defaultTemplate===0){
                filter.reportConfigId=$scope.reportDialogData.selected;
            }else{
                filter.reportConfigId=null;
            }
            $scope.showButtonOptions.Retrieving = true;
            $scope.showButtonOptions.Retrieve = false;
            filter.fields = 'id,downloadKey';   //These are all we need for this
            absenceInteractiveApi.GetExecution(filter).then(function (d){
                    reportExec = d.exec;
                    intervalExecutionComplete = setInterval(IsExecutionComplete,3000);
                    return _defer.resolve();
                },function(reasons){
                    $scope.showButtonOptions.Retrieving = false;
                    $scope.showButtonOptions.Retrieve = true;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
        }
    }

    function IsExecutionComplete(){
        if(loadingExecution===false){
            loadingExecution=true;
            absenceInteractiveApi.reportExec({'reportExecId': reportExec.id, 'fields': 'complete'}).then(function(d){
                loadingExecution=false;
                if(d.complete){
                    $scope.showButtonOptions.Retrieving = false;
                    $scope.showButtonOptions.Download = true;
                    clearInterval(intervalExecutionComplete);
                }
            });
        }
    }

    function DownloadExecution(){
        //Api expects '2' for csv format
        var downloadUrl = urlHelp.getAbsInteractiveDownloadUrl(reportExec,'2');
        ngDialog.closeAll(function() { $window.location.href = downloadUrl; });
    }

    function canUserAccessReportWriter() {
        //Determine if the current user is able to access any piece of RW
        //Different permissions between CU and OU user types
        if (permissionSvc.iHave('PSEUDO.ISCAMPUSUSER')) {
            if (permissionSvc.iHave('WEBFUNC.ViewRWReports') && 
                    (permissionSvc.iHave('RPTWACCESS.ViewLocked') || permissionSvc.iHave('RPTWACCESS.VIEWPUBLIC') || permissionSvc.iHave('RPTWACCESS.VIEWPUBLISHED'))) {
                return true;
            }
        } else {
            if (permissionSvc.iHave('RPTWACCESS.CREATEPUBLIC')
                    || permissionSvc.iHave('RPTWACCESS.CREATEPUBLISHED')
                    || permissionSvc.iHave('RPTWACCESS.CREATEPRIVATE')
                    || permissionSvc.iHave('RPTWACCESS.ViewLocked')
                    || permissionSvc.iHave('RPTWACCESS.VIEWPUBLIC')
                    || permissionSvc.iHave('RPTWACCESS.VIEWPUBLISHED')
                    || permissionSvc.iHave('RPTWACCESS.EDITPUBLIC')) {
                return true;
            }
        }
        return false;
    }

    listDialogConfigs();

// #----- END AbsInteractiveDownloadCtrl -----# //
});}());