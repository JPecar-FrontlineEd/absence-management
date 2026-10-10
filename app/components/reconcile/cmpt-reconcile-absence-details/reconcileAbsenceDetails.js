(function() {'use strict';angular.module('aesop')
.directive('cmptReconcileAbsenceDetails', function () {return {

// directive options
restrict: 'E',
scope: {
	absrVal: '=',
	dismissAction: '=',
    filters: '=?',
    save: '=',
    reCountRecords:'='
},
replace: true,
templateUrl: '/components/reconcile/cmpt-reconcile-absence-details/reconcileAbsenceDetails.html',

// #----------------------------------------------------# //
// #---- Component (cmpt-reconcile-absence-details) ----# //
controller: function ($q, $scope, $filter, stringSvc, absrSvc, permissionSvc, ngDialog, absenceRequestApi, workerApi, toastHelp, iconHelp, locationHelp, roundNumberFilter,config, $rootScope) {

	var absrVal = $scope.absrVal;
	var absence = $scope.absence =  $scope.absrVal.absrVariations[0];
	var fullAbsenceObj = absence.absences[0];
    absenceRequestApi.get({ absrid: fullAbsenceObj.absrId}).then(function(absrData) {
        $scope.fullDaysCount = 0;
        $scope.halfDaysCount = 0;
        $scope.hoursCount = 0;
        absrData.absences.forEach(absence => {
            switch(absence.substituteShiftType){
                case 1: $scope.fullDaysCount++;
                        break;
                case 2:
                case 3: $scope.halfDaysCount++;
                        break;
                case 4: $scope.hoursCount = $scope.hoursCount + parseFloat(convertTimeToHours(absence.vacancyDuration));
                        break;
            }
        }); 
    }); 
	var worker = $scope.worker = absrVal.absr.worker;
	absence.id = fullAbsenceObj.id;
	absence.isReconciled = fullAbsenceObj.isReconciled;
	absence.isProcessed = absence.isProcessed != null ? absence.isProcessed : false;
    absence.isLocked = absrVal.absr.isLocked;
    
    function convertTimeToHours(duration){
        var durationArr = duration.split(':');
        var hours = parseFloat(durationArr[0]) + parseFloat(durationArr[1])/60 + parseFloat(durationArr[2])/3600;
        return hours.toFixed(2);
    }

		// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence', 'Vacancy',
		'ConfirmationNumberPound',
		'WorkerTypeGeneric',
		'Title',
		'Location',
		'Reconciliation.Label.Text.ReportTimes',
		'Substitute',
		'Reconciliation.Label.Text.ReportTimes',
		'ReconciliationList.Title.Text.ProjectedGrossPayout',
		'AbsenceReciept.Files.Dialog.Title.Text',
		'Reason',
		'BudgetCode',
		'Reconciliation.Label.ShortHand.Text.AccountingCode',
		'Reconciliation.Label.Text.HrsWorked',
		'PayCode',
		'dialog.actions.button.ok',
		'DR.Dialog.Notes.Text.NotesToSubstitute',
        'DR.Dialog.Notes.Text.NotesToAdministrator',
        'DR.Dialog.Notes.Text.AdminOnlyNotes',
        'LockWarning',
        'Reconciliation.Button.Text.ViewDetails',
        'Reconciliation.Button.Text.EditDetails',
        'Dashboard.Header.Button.Reconcile',
        'Absence.Button.Text.Unreconcile',
        'AbsenceLog.Text.Unreconciled',
        'AbsenceLog.Text.Reconciled',
        'for', 'hasbeen',
        'Dismiss',
        'Warning',
        'Error',
        'FullDay',
        'FullDays',
        'HalfDay',
        'HalfDays',
        'Hours',
        'Hour',
        'SubDuration' 
	]);


	// View Model properties
	var vm = $scope.vm = {
		absenceTimes: '(' + $filter('date')(parseTime(absence.absenceStartTime),'shortTime') + '-' + $filter('date')(parseTime(absence.absenceEndTime),'shortTime') + ')',
		vacancyTimes: '(' + $filter('date')(parseTime(absence.vacancyStartTime),'shortTime') + '-' + $filter('date')(parseTime(absence.vacancyEndTime),'shortTime') + ')',
		workerName: worker.isVacancy ? worker.lastName : worker.lastName + ', ' + worker.firstName,
		substituteId: (absrVal.substitute !== null) ? absrVal.substitute.id :0,
		substituteName: (absrVal.substitute !== null) ? absrVal.substitute.firstName + ' '+ absrVal.substitute.lastName : '',
		hasNotes:(absrVal.substituteNotes != null && absrVal.substituteNotes.length > 0) || (absrVal.administratorNotes != null && absrVal.administratorNotes.length > 0) || (absrVal.adminOnlyNotes != null && absrVal.adminOnlyNotes.length > 0),
		notesHtml: notesHtmlString(),
		files:[],
		fetchingFiles: false,
		isProcessing: false,
        canReconcile: permissionSvc.iHave('ABSR.Approve'),
        viewReportTimes: permissionSvc.iHave('ABSR.ViewSubTimes')
	};


	function notesHtmlString () {
        var html = '<div class="notes-content">';
        if(absrVal.substituteNotes && absrVal.substituteNotes.length > 0){
            html+= '<div><label>'+ strings['DR.Dialog.Notes.Text.NotesToSubstitute'] +'</label><span>' + absrVal.substituteNotes + '</span></div>';
        }
        if(absrVal.administratorNotes && absrVal.administratorNotes.length > 0){
            html+= '<div><label>'+ strings['DR.Dialog.Notes.Text.NotesToAdministrator'] +'</label><span>' + absrVal.administratorNotes + '</span></div>';
        }
        if(absrVal.adminOnlyNotes && absrVal.adminOnlyNotes.length > 0){
            html+= '<div><label>'+ strings['DR.Dialog.Notes.Text.AdminOnlyNotes'] +'</label><span>' + absrVal.adminOnlyNotes + '</span></div>';
        }
        return html + '</div>';
    }

	function parseTime (time) {
		return Date.parse(time);
	}

	function getUploadedFiles () {
        var _defer = $q.defer();
        absenceRequestApi.files.get({absrid: absrVal.id}).then(function (data){
            vm.files = vm.files.concat(data.map(function (v) {
                v.icon = iconHelp.classForFileExt(v.fileExtension);
                return v;
            }));
            return _defer.resolve();
        }, function (reasons){
            toastHelp.error(reasons.$messages, 'Error');
            return _defer.resolve();
        });
        return _defer.promise;
    }
    function getRelatedFiles () {
        var _defer = $q.defer();
        workerApi.relatedFiles.get({
            workerId: worker.id
        }).then(function (data) {
            var relatedFiles = $filter('instRelatedFiles')(data, [absence.institution.id]);
            vm.files = vm.files.concat(relatedFiles.map(function (v) {
                v.icon = iconHelp.classForFileExt(v.fileExtension);
                return v;
            }));
            return _defer.resolve();
        }, function (reasons){
            toastHelp.error(reasons.$messages, 'Error');
            return _defer.resolve();
        });
        return _defer.promise;
    }

    function totalFiles () {
        var _defer = $q.defer();
        var uploadedFiles = getUploadedFiles();
        var relatedFiles = getRelatedFiles();
        $q.all([uploadedFiles,relatedFiles]).then(_defer.resolve);
        return _defer.promise;
    }

    function saveAbsence(){
        var _defer = $q.defer();
        vm.isProcessing = true;
        $scope.save(absrVal.id, fullAbsenceObj.id).then(function(absrData){
            vm.isProcessing = false;
            absence.isDirty = false;
            return _defer.resolve();
        }, function(rejectData){
            vm.isProcessing = false;
            return _defer.reject(rejectData);
        });
        return _defer.promise;
    }

	// Actions that can be bound to from the view
	var go = $scope.go = {
		reconcileAction: function (){
            if(!vm.isProcessing && !absence.isLocked){
                absence.absences[0].UpdateReconcileState = !absence.isReconciled;
                saveAbsence().then(function(){
                    absence.isReconciled = !absence.isReconciled;
                    absence.isProcessed = true;
                    $rootScope.$emit("absenceReconcileTriggered");
                    $scope.reCountRecords();
                },function(error){
                    if(error) {
                      var messages = error.rejectData.$messages.map(function(m) { return m.message});
                      toastHelp.error(messages);
                    }
                });
            }
		},
        save: $scope.save,
		undoAction: function (){
            if(!vm.isProcessing && !absence.isLocked){
                absence.absences[0].UpdateReconcileState = !absence.isReconciled;
                saveAbsence().then(function(){
                    absence.isReconciled = !absence.isReconciled;
                    absence.isProcessed = false;
                    $scope.reCountRecords();
                },function(){
                    //handle any failure if necessary
                });
            }
		},
		dismiss: function(){
			$scope.dismissAction(absence.id);
		},
		showAttachments: function (){
            if(!vm.fetchingFiles){
                vm.files = [];
                vm.fetchingFiles = true;
                totalFiles().then(function (){
                    vm.fetchingFiles = false;
                    var dialog = ngDialog.open({
                        template:'/components/absr/cmpt-absr-done-summary/file-attachments.html',
                        closeByDocument: false,
                        closeByNavigation:true,
                        data: {
                            header: strings['AbsenceReciept.Files.Dialog.Title.Text'],
                            files: vm.files,
                            downloadLink: function (file){
                                return config.apiEndpoint + '/v1.0/Files/' + file.id + '/Download?key=' + window.escape(file.downloadKey);
                            },
                            buttons: [{
                                title: strings['dialog.actions.button.ok'],
                                cls:'fl-button',
                                action: function(obj){
                                    ngDialog.close(dialog.id);
                                }
                            }]
                        }
                    });
                });
            }
        },
        viewDetails: function() {
            locationHelp.redirect('/abs-mgt/absences/detail/'+absrVal.id+'/view');
        },
        editDetails: function() {
            locationHelp.redirect('/abs-mgt/absences/detail/'+absrVal.id+'/edit', prepFiltersForDetails(), true);
        }
	};

    function prepFiltersForDetails(){
        var filters = angular.copy($scope.filters);
        if (filters != null) {
            delete filters['institutionList'];
            delete filters['absenceReasonList'];
            delete filters['absenceReasonId'];
            delete filters['budgetCodeList'];
            delete filters['budgetCodeId'];
            delete filters['accountingCodeList'];
            delete filters['accountingCodeId'];
            delete filters['states'];
        }
        return filters;
    }
}

// #-- END Component (cmpt-reconcile-absence-details) --# //
// #----------------------------------------------------# //
};});}());