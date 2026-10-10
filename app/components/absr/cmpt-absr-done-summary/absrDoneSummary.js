(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDoneSummary', function () {return {

// directive options
restrict: 'E',
scope:true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-done-summary/absrDoneSummary.html',

// #--------------------------------------------# //
// #---- Component (cmpt-absr-done-summary) ----# //
controller: function ($filter, $scope, stringSvc, absrStateVal, ngDialog,config) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		reasonTitle: isVacancy ? 'VacancyReason' : 'AbsenceReason'
	};


	var relatedFiles = $filter('instRelatedFiles')(absrState.relatedFiles, absrState.absrInstIds);

	// View Model properties
	var vm = $scope.vm = {
		files : absrState.uploadedFiles.concat(relatedFiles)
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Substitute',
		'Required',
		'NotesToAdmin',
		'Yes',
		'No',
		'None',
		'Attachments',
		'File',
		'Files',
		'School',
		'Absence.Reciept.Text.Start/End Times',
		'ViewFile',
		mnemonic.reasonTitle,
		'SubstituteReportTime',
		'BudgetCode',
		'AccountingCode',
		'AbsenceReciept.Files.Dialog.Title.Text',
		'dialog.actions.button.ok'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		showFiles: function(){
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
		},
		parseTime: function (time){
			return Date.parse(time);
		}
	};
}

// #-- END Component (cmpt-absr-done-summary) --# //
// #--------------------------------------------# //
};});}());