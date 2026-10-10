(function() {'use strict';angular.module('aesop')
.controller('SubstituteAbsencesDetailCtrl', function ($scope, $timeout, $stateParams, $state, $filter, substituteAbsencesApi,substituteAbsenceVal, stringSvc, toastHelp) {
// #--------------------------------------------# //
// #------- SubstituteAbsencesDetailCtrl -------# //

	// this is a route controller
	var route = this;
	route.substituteAbsenceVal = $scope.substituteAbsenceVal = substituteAbsenceVal;

	var strings = route.strings = stringSvc.getStrings([
		'Substitute.Absence',
		'Substitute.Absence.Log',
		'Created',
		'LastUpdate',
		'Substitute.Absence.View',
		'Substitute.Absence.Edit',
		'HoursPerDay'
	]);


	// View Model properties
	route.vm = {
		pageLabel: (substituteAbsenceVal.editMode) ? strings['Substitute.Absence.Edit']: strings['Substitute.Absence.View'],
		tabs: [{
			title: strings['Substitute.Absence'],
			cls:'',
			route:'substitute-absences/detail/'+ $stateParams.id +'/view',
			state: 'base.substituteAbsenceDetail.view',
			visible: function(){
				return viewRouteVisible();
			}
		},{
			title: strings['Substitute.Absence'],
			cls:'auto-absence fa ',
			route:'substitute-absences/detail/'+ $stateParams.id +'/edit',
			state: 'base.substituteAbsenceDetail.edit',
			visible: function(){
				return editRouteVisible();
			}
		},{
			title: strings['Substitute.Absence.Log'],
			cls:'auto-log',
			route:'substitute-absences/detail/'+ $stateParams.id +'/log',
			state: 'base.substituteAbsenceDetail.absenceLog',
			visible: function(){
				return true;
			}
		}],
		substituteName: substituteAbsenceVal.substitute.lastName  + ', ' +  substituteAbsenceVal.substitute.firstName,
		created: $filter('date')(new Date(substituteAbsenceVal.created),'short'),
		lastUpdated: '',
		date: $filter('date')(new Date(substituteAbsenceVal.date),'MMMM d'),
		hoursPerDay: calculateHoursPerDay()
	};




	$scope.$watch('substituteAbsenceVal.isLocked', function(nVal,oVal){
		route.vm.tabs[0].cls =  (substituteAbsenceVal.isLocked) ? 'auto-absence fa locked' : 'auto-absence';
	});


	$scope.$watch('substituteAbsenceVal.lastUpdated', function (){
		route.vm.lastUpdated = $filter('date')(new Date(substituteAbsenceVal.lastUpdated),'short');
		route.vm.date = $filter('date')(new Date(substituteAbsenceVal.date),'MMMM d');
	});


	function viewRouteVisible() {
		return $state.is('base.substituteAbsenceDetail.view') ||
				!substituteAbsenceVal.editMode;
	}

	function editRouteVisible() {
		return $state.is('base.substituteAbsenceDetail.edit') ||
				substituteAbsenceVal.editMode;
	}

	function calculateHoursPerDay () {
		var startTime = Date.parse(substituteAbsenceVal.startTime);
		var endTime = Date.parse(substituteAbsenceVal.endTime);
		var milliseconds = Math.abs(endTime - startTime);
		return (milliseconds / 1000 / 60 / 60).toFixed(2);
	}

	$scope.$on('$destroy', function () {
		if (substituteAbsenceVal.editMode && substituteAbsenceVal.id != null) {
			substituteAbsenceVal.lastFetch = null; //ensuring that loadAbsr() in routerConfigSvc will fetch a new absrStateVal (DE7737 and DE9095)
			var unlockAbsr = substituteAbsencesApi.unlock({ id: substituteAbsenceVal.id });
			unlockAbsr.then(function (data) {
				//nothing needs to be done if successful
			}, function (reasons) {
				toastHelp.error(reasons.$messages, 'Error');
			});
		}
	});


	// Actions that can be bound to from the view
	route.go = {
		someAction: function () {
			route.vm.property = 'something';
		}
	};

// #----- END SubstituteAbsencesDetailCtrl -----# //
});}());
