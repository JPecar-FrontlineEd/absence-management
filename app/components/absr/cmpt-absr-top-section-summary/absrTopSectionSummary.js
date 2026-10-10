(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrTopSectionSummary', function () {return {

// directive options
restrict: 'E',
scope:true,
replace: true,
transclude:true,
templateUrl: '/components/absr/cmpt-absr-top-section-summary/absrTopSectionSummary.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-absr-top-section-summary) ----# //
controller: function ($scope, $state, $stateParams, $filter, $location, stringSvc, absrStateVal,absrVariationHelp, absenceRequestApi, toastHelp) {

	var absrState = $scope.absrState = absrStateVal;
	var absrVariations = absrState.absrVariations;
	var absr = absrState.absr;
	var isVacancy = absrState.worker.isVacancy;
	var mnemonic = $scope.mnemonic = {
		relatedFilesText: isVacancy ? 'createVacancy.label.relatedVacancies' : 'createAbsences.label.relatedAbsences',
		returnToDetailsText: isVacancy ? 'Button.ReturnToVacancyDetails' : 'Button.ReturnToAbsenceDetails'
	};
	var backValue = $stateParams.back;

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		mnemonic.relatedFilesText,
		mnemonic.returnToDetailsText,
		'LastUpdate',
		'Created',
		'HoursPerDay',
		'Status',
		'Button.ReturnToReport',
		'CreateAbsence.Button.Text.RenotifyFavoriteSubs'
	]);

	// View Model properties
	var vm = $scope.vm = {
		allDates :allDates(),
		created: $filter('date')(new Date(absr.created),'short'),
		lastUpdated: '',
		hasDestination: $stateParams.hasOwnProperty('back'),
		returnText: (backValue && backValue.indexOf('/report') !== -1) ? strings['Button.ReturnToReport'] : strings[mnemonic.returnToDetailsText],
		renotifyProcessing: false,
		showRenotifyButton: true
	};

	$scope.$watch('absrState.lastUpdated', function (){
		vm.lastUpdated = $filter('date')(new Date(absrState.lastUpdated),'short');
		vm.allDates = allDates();
	});
	
	$scope.$root.$on('$stateChangeSuccess', function(event, toState) {
		if ((toState.url.indexOf('/feedback') !== 0) && $state.includes('base.detail')){
			vm.hasDestination = false;
		}
	});


	// Actions that can be bound to from the view
	var go = $scope.go = {
		back: function(){
			if (backValue != null && backValue.indexOf('/report') !== -1) {
				$location.url(backValue);
			} else {
				//make sure a clean copy of the absr will be loaded when returning
				absrState.lastFetch = null;
				$location.url('/abs-mgt/absences/detail/'+absrState.id+'/view');
			}
		},
		renotify: function (){
			if (absrStateVal.absr.isLocked)
				return;

			if(!vm.renotifyProcessing){
				vm.renotifyProcessing = true;
				absenceRequestApi.renotify({absrid: absrStateVal.id}, {}).then(function (){
					toastHelp.info('Email has been sent', 'Success');
					vm.showRenotifyButton = false;
					vm.renotifyProcessing = false;
				}, function (reason){
					vm.showRenotifyButton = true;
					vm.renotifyProcessing = false;
					toastHelp.error(reason.$messages, 'Error');
				});
			}
		}
	};

	function allDates () {
		var datesArray = [];
		for (var i = absrState.absrVariations.length - 1; i >= 0; i--) {
			var variationData = absrState.absrVariations[i];
			 datesArray = datesArray.concat(variationData.dates);
		}
		return absrVariationHelp.dateString(datesArray, absrState.context.dragSelectDOW);
	}
}

// #-- END Component (cmpt-absr-top-section-summary) --# //
// #---------------------------------------------------# //
};});}());