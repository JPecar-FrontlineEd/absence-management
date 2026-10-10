
(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDetailsAttachments', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-details-attachments/absrDetailsAttachments.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-absr-details-attachments) ----# //
controller: function ($scope, $http, stringSvc, absrSvc, filesApi, absrStateVal, dateHelp,config,$location) {

	// View Model properties
	var vm = $scope.vm = {
	};

	var absrState = $scope.absrState = absrStateVal;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Attachments',
		'UploadedFiles',
		'RelatedFiles'
	]);

	var isVacancy = absrState.worker.isVacancy;
    var isCreateMode = isVacancy ? $location.url().includes('create-vacancy-details') : $location.url().includes('create-absence-details');

	var vm = $scope.vm = {
		editable:{
			attachment: isCreateMode? true : absrState.editMode && absrState.context.showUploadFiles
		}
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		deleteFile: function (index) {
			var file = absrState.uploadedFiles[index];
			if (file.id === 0) {
				absrState.uploadedFiles.splice(index, 1);
			} else {
				filesApi.remove({ id: file.id, objKey: absrState.id}).then(
					function () {
						absrState.uploadedFiles = absrState.uploadedFiles.filter(function (f) {
							return f.id !== file.id;
						});
					},
					function (errors) {
						console.log(' => errors', errors); // REMOVE ME
					}
				);
			}
		},
		downloadLink: function (file){
			return config.apiEndpoint + '/v1.0/Files/' + file.id + '/Download?key=' + window.escape(file.downloadKey);
		}
	};

	if(absrState.id > 0){
		absrSvc.setupAbsrStateUploadedFiles();
	}

	$scope.$watch(
		function (scope) {
			return absrSvc.earliestAbsrDate();
		}, function (earliestDateMs) {
			earliestDateMs = earliestDateMs || (new Date()).getTime();
			var asOfDate = dateHelp.formatDate(new Date(earliestDateMs), 'MM/dd/yyyy')
			absrSvc.setupAbsrStateRelatedFiles(asOfDate);
		}
	);




}

// #-- END Component (cmpt-absr-details-attachments) --# //
// #---------------------------------------------------# //
};});}());