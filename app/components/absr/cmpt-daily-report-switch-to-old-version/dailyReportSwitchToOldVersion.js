(function() {'use strict';angular.module('aesop')
.directive('cmptDailyReportSwitchToOldVersion', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/absr/cmpt-daily-report-switch-to-old-version/dailyReportSwitchToOldVersion.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-daily-report-switch-to-old-version) ----# //
controller: function ($q, $scope, stringSvc, $location, userSvc, featureSvc, userApi, toastHelp, $log, $window, navUrlProviderSvc, navUrlMappingSvc, tokenSvc, config, ngDialog, absrStateVal, absenceRequestApi) {
	const 	dailyReportRequestFeature = 'AngularDailyReportForOU',
            dailyReportModeChoiceFeature = "DailyReportModeChoice";
	const 	dailyReportModeChoicePreferenceCode = "DailyReportMode",
            dailyReportModeChoiceValueIsAngular = "2",
			dailyReportModeChoiceValueIsAsp	= "1";
	const preferenceObj = {
		id: 4, 
		code: dailyReportModeChoicePreferenceCode, 
		value: dailyReportModeChoiceValueIsAsp 
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
		strings: strings
	};



	// Actions that can be bound to from the view
	var go = $scope.go = {
		switch: function () { handleSwitchRequest(); }
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
		redirectUrl += "&UPREFSYNC=4-DailyReportMode-1";
						
		$log.info("Switch to old version url: " + redirectUrl);
		$window.location.href = redirectUrl;
	}
	
	function showPrompt()
	{
		const isOrgUser = userSvc.isOrgUser();
		const angularDailyReport = featureSvc.get(dailyReportRequestFeature).enabled;
		const dailyReportModeChoice = featureSvc.get(dailyReportModeChoiceFeature).enabled;
		const pref = userSvc.getUserPreference(dailyReportModeChoicePreferenceCode);
		const userChoseAng = ((pref != null && pref.value !=null) ? pref.value == dailyReportModeChoiceValueIsAngular : dailyReportModeChoice);
	
		return  (isOrgUser && dailyReportModeChoice && userChoseAng);
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

// #-- END Component (cmpt-daily-report-switch-to-old-version) --# //
// #-----------------------------------------------------# //
};});}());