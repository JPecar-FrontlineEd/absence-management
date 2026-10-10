(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrReview', function () {return {

// directive options
restrict: 'E',
scope: {
	variation: '='
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-review/absrReview.html',

// #--------------------------------------# //
// #---- Component (cmpt-absr-review) ----# //
controller: function ($scope, $filter, stringSvc, absrStateVal,config, storageSvc, absrSvc, featureSvc) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		reasonTitle: isVacancy ? 'VacancyReason' : 'AbsenceReason'
	};
	$scope.selectedView = storageSvc.load("selectedView");
	$scope.showCustomBreakTime = absrSvc.showHideAbsenceBreakTime($scope.variation);

	var organizationSettings = storageSvc.load('organizations')[0].settings;
	$scope.canDeductCustomBreakTime = organizationSettings.ShowBreakTimeForCustomAbsences;

	var relatedFiles = $filter('instRelatedFiles')(absrState.relatedFiles, absrState.absrInstIds);

	// View Model properties
	var vm = $scope.vm = {
		files : absrState.uploadedFiles.concat(relatedFiles)
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.reasonTitle,
		'Time',
		'SubstituteReportTime',
		'BudgetCode',
		'AccountingCode',
		'NotesAndAttachments',
		'NotesToAdmin',
		'NotesToAdminOnly',
		'NotesToSub',
		'Attachments',
		'NonPayTime',
		'TimeAbsent',
		'Notes',
		'NoneSelected',
		'DeductBreak'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		downloadLink: function (file){
			return config.apiEndpoint + '/v1.0/Files/' + file.id + '/Download?key=' + window.escape(file.downloadKey);
		}
	};
}

// #-- END Component (cmpt-absr-review) --# //
// #--------------------------------------# //
};});}());