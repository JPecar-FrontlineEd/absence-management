(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDetailsNotes', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-details-notes/absrDetailsNotes.html',

// #---------------------------------------------# //
// #---- Component (cmpt-absr-details-notes) ----# //
controller: function ($scope, stringSvc, absrStateVal,$location) {

	var absrState = $scope.absrState = absrStateVal;
	var absrVariations = absrState.absrVariations;
	var editMode = absrState.editMode;
	var isVacancy = absrState.worker.isVacancy;
    var isCreateMode = isVacancy ? $location.url().includes('create-vacancy-details') : $location.url().includes('create-absence-details');
	// View Model properties
	var vm = $scope.vm = {
		editable:{
			notesToAdmin: isCreateMode? true : editMode && absrState.context.editNotesToAdmin,
			notes:isCreateMode? true : editMode && absrState.context.editNotes,
			adminOnlyNotes:isCreateMode? true : editMode && absrState.context.editAdminNotesOnly,
		}
	};

	// var validation = {
	// 	administratorNotes: function(){
	// 		var errors = [];
	// 		var notesToAdministrator= absrState.administratorNotes;
	// 		var entitlementTypesRequiredNotes = absrVariations.filter(function(el){ return el.entitlementType && el.entitlementType.notesRequired; });

	// 		if(notesToAdministrator == '' && entitlementTypesRequiredNotes.length > 0){
	// 			errors.push(strings.NoteToAdminRequired.replace('{0}', entitlementTypesRequiredNotes[0].entitlementType.value));
	// 		}
	// 		return errors;
	// 	}
	// };

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'NoteToAdminRequired',
		'NotesToAdminDescription',
		'NotesToAdminOnlyDescription',
		'NotesToAdminOnly',
		'NotesToSubDescription',
		'NotesToSub',
		'NotesToAdmin',
		'Notes',
		'NotesAndAttachments',
		'MentionNotesToAdministrator',
		'MentionNotesToSubstitute',
		'MentionAdminOnlyNotes',
		'Expanded',
		'Collapsed'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};


	// $scope.$watch('absrState.lastUpdated', function (){
	// 	absrState.validate = function () {
	// 		var errorCount = 0;
	// 		Object.keys(vm.errors).forEach(function (key){
	// 			vm.errors[key] = validation[key] && validation[key]() || [];
	// 			errorCount += vm.errors[key].length;
	// 		});
	// 		return (errorCount === 0);
	// 	};
	// });
}

// #-- END Component (cmpt-absr-details-notes) --# //
// #---------------------------------------------# //
};});}());