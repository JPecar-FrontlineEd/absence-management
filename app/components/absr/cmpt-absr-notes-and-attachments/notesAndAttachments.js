(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrNotesAndAttachments', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-notes-and-attachments/notesAndAttachments.html',

// #--------------------------------------# //
// #---- Component (cmpt-absr-review) ----# //
controller: function ($scope, stringSvc) {

	var strings = $scope.strings = stringSvc.getStrings([
        'NotesAndAttachments',
        'NotesToAdmin',
        'NotesToSub',
        'Notes',
        'NotesToAdminOnly',
        'Attachments'
	]);

}

// #-- END Component (cmpt-absr-review) --# //
// #--------------------------------------# //
};});}());