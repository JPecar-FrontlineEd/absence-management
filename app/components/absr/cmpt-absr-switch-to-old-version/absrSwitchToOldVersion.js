(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrSwitchToOldVersion', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-switch-to-old-version/absrSwitchToOldVersion.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-absr-switch-to-old-version) ----# //
controller: function ($q, $scope, stringSvc, $location, userSvc, featureSvc, userApi, toastHelp, $log, $window, navUrlProviderSvc, navUrlMappingSvc, tokenSvc, absrSvc, config, ngDialog, absrStateVal, absenceRequestApi) {
	const 	absenceRequestFeature = 'AngularAbsenceRequestForOU',
			absrModeChoiceFeature = "AbsrModeChoice";
	const 	absrModeChoicePreferenceCode = "AbsrMode",
			absrModeChoiceValueIsAngular = "2",
			absrModeChoiceValueIsAsp	= "1";
	const preferenceObj = {
		id: 3, 
		code: absrModeChoicePreferenceCode, 
		value: absrModeChoiceValueIsAsp 
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'OptIn.UseOldVersion',
		'OptIn.ErrorOnSwitchToOld'
	]);

	// View Model properties
	var vm = $scope.vm = {
		showSwitchButton: function() { return showPrompt() },
		path: "",
		absrinfo: { id: 0, locked: false, editMode: false },
		strings: strings
	};



	// Actions that can be bound to from the view
	var go = $scope.go = {
		switch: function () { 
			if($scope.absrState.absr != null && !$scope.absrState.absr.isLocked && $scope.absrState.absr.isLockedByCurrentUser){
				event.preventDefault();
				absrSvc.confirmNavigateAwayFromAvailableSubstitute();
			}
			else{
				handleSwitchRequest();
			}			
		}
	};

	$scope.$watch(
		function() {
			return $location.url();
		},
		function(currVal, prevVal) {
			vm.path = currVal;
		}
	);

	function handleSwitchRequest()
	{
		updatePreferenceAndRedirectToNavigator();
	}


	function updatePreferenceAndRedirectToNavigator()
	{
		updatePreference()
			.then(
				function() { 
					redirectToNavigator();
				},
				function(reasons) { 
					toastHelp.error(strings['OptIn.ErrorOnSwitchToOld'], 'Error'); 
					$log.error("An error occured trying to update the user preference: " + reasons.$messages[0]);
				}
			);

	}

	function redirectToNavigator()
	{
		navUrlProviderSvc.rebuildMappings();
		navUrlMappingSvc.resetNavUrlMappingVal();

		let url = $location.url();
		let map = navUrlMappingSvc.getMapping(url);
				
		let redirectUrl = config.navigatorBaseUrl + map.path;
		redirectUrl += (redirectUrl.indexOf('?') > 0 ? "&" : "?") + 'token=' + tokenSvc.get();
		redirectUrl += "&UPREFSYNC=3-AbsrMode-1";
						
		$log.info("Switch to old version url: " + redirectUrl);
		$window.location.href = redirectUrl;
	}
	
	function showPrompt()
	{
		const isOrgUser = userSvc.isOrgUser();
		const angularAbsenceCreate = featureSvc.get(absenceRequestFeature).enabled;
		const absrModeChoice = featureSvc.get(absrModeChoiceFeature).enabled;
		const pref = userSvc.getUserPreference(absrModeChoicePreferenceCode);
		const userChoseAng = (pref ? pref.value == absrModeChoiceValueIsAngular : angularAbsenceCreate);
		let validPageState = true;
		if (vm.path.includes("/abs-mgt/absences/detail") && vm.path.includes("/edit")) validPageState = false;
		if (vm.path.includes("/abs-mgt/absences/detail") && vm.path.includes("/split")) validPageState = false;
		if (vm.path.includes("/abs-mgt/absences/detail") && vm.path.includes("/reconciliation")) validPageState = false;
			
		return  (validPageState && isOrgUser && absrModeChoice && userChoseAng);
	}
    
    function updatePreference() {
    	var _defer = $q.defer();
    	userSvc.updatePreference(preferenceObj)
	    	.then(
	    		function(data) { _defer.resolve();	},
	    		function(reasons) {	_defer.reject(reasons);	}
	    		);
        return _defer.promise;
    }
}

// #-- END Component (cmpt-absr-switch-to-old-version) --# //
// #-----------------------------------------------------# //
};});}());