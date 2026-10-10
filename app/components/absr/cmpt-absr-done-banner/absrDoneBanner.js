(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrDoneBanner', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
transclude: true,
templateUrl: '/components/absr/cmpt-absr-done-banner/absrDoneBanner.html',

// #-------------------------------------------# //
// #---- Component (cmpt-absr-done-banner) ----# //
controller: function ($scope, absrStateVal,stringSvc, permissionSvc) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic ={
		absecneType: isVacancy ? 'Vacancy' : 'Absence'
	};
	// View Model properties
	var vm = $scope.vm = {
		substituteLink:null
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Absence.Create.Text.YourConfirmationNumberIs',
		'PermanantSubWasAssigned',
		'Vacancy',
		'Absence'
	]);

	vm.substituteLink = substituteLink();

	function substituteLink () {
		if(absrState.substitute){
			var substitute = absrState.substitute;
			var nameHtml = substitute.firstName + ' '+ substitute.lastName;
			if(permissionSvc.iHave('SUB.SubViewGeneral')){
				nameHtml = '<a href="/substitute/'+ substitute.id +'" title="'+ nameHtml +'">'+ nameHtml +'</a>';
			}
			return strings['PermanantSubWasAssigned'].replace('{0}', nameHtml).replace('Absence',mnemonic.absecneType);
		}
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
	};
}

// #-- END Component (cmpt-absr-done-banner) --# //
// #-------------------------------------------# //
};});}());