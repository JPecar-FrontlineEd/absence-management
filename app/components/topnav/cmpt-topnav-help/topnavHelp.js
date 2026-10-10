(function() {'use strict';angular.module('aesop')
.directive('cmptTopnavHelp', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/topnav/cmpt-topnav-help/topnavHelp.html',

// #--------------------------------------# //
// #---- Component (cmpt-topnav-help) ----# //
controller: function ($q, $scope, $window, $location, stringSvc, config, institutionSvc, permissionSvc, orgSvc, featureSvc, userSvc, ssoSvc) {

	// View Model properties
	var vm = $scope.vm = {
		isNavigatorUser: false,
		topLevelInstName: '',
		orgName: '',
		appDisplayName: '',
		contactInfo: {}
	};
	// Get mnemonics that this component needs
	stringSvc.ready.then(function () {
		$scope.strings = stringSvc.getStrings([
			'Navigation.Top.MenuItem.Help',
			'Navigation.Top.MenuItem.Help.ContactPrompt',
			'Navigation.Top.MenuItem.Help.EmailPrompt',
			'Navigation.Top.MenuItem.Help.Resources',
			'Navigation.Top.MenuItem.Help.LearningCenter',
			'Navigation.Label.ContactFrontlineSupport',
			'Phone',
			'Fax'
		]);
	});


	permissionSvc.ready.then(function () {
		institutionSvc.getInstitutions()
			.then(function (instList) {
				vm.topLevelInstName = instList[0].name;
			});

		vm.isNavigatorUser = !permissionSvc.iHave('PSEUDO.ISCAMPUSUSER');
		vm.isCampusUser = permissionSvc.iHave('PSEUDO.ISCAMPUSUSER');
		vm.zendeskEnabled = featureSvc.get('Zendesk').enabled;
		vm.salesForceLearningCenterEnabled = featureSvc.get('SalesForceLearningCenter').enabled;

		if(vm.zendeskEnabled || vm.salesForceLearningCenterEnabled){
			vm.HelpLinkText = $scope.strings['Navigation.Label.ContactFrontlineSupport'];
		}
		else{
			vm.HelpLinkText = $scope.strings['Navigation.Top.MenuItem.Help.LearningCenter'];
		}

		userSvc.ready.then(function(userData){
			vm.currentUserKey = userData.UserType + '-' + userData.loggedInUserId;
		});

		orgSvc.ready.then(function (orgData) {
			vm.orgName = orgData[0].name;
			vm.appDisplayName = orgData[0].appDisplayName;
			vm.contactInfo = orgData[0].orgContactInfo;
			vm.orgXrefId = orgData[0].orgXrefId;
			//also subContactInfo which we can conditionally use in the future.
		});
	});


	// Actions that can be bound to from the view
	var go = $scope.go = {
		toLearningCenter: function () {

			if(vm.salesForceLearningCenterEnabled) {
				let sfUrl = config.salesForceLearningCenterTokenAdapterServiceBaseUrl;
				const sfDestUrl = config.salesForceLearningCenterDestinationUrl;
				sfUrl += "?redirectUrl="+sfDestUrl;
					
				window.open(sfUrl,'_blank');
			}
			else if(vm.zendeskEnabled){

				var currentUserKey = vm.currentUserKey;
				var orgXrefId = vm.orgXrefId;
				var zdUrl = config.zendeskTokenAdapterServiceBaseUrl;
				var flAuth = config.zendeskUseFlauth;
				if(ssoSvc && ssoSvc.IsSSO){
					//if user connected with sso, then idm is not being used so override the flauth setting
					flAuth = false;
				}
				zdUrl += "?brand_id="+config.zendeskBrandId+"&return_to="+config.zendeskDestinationUrl+"&fl_app_user="+currentUserKey+"&fl_org="+orgXrefId
				if(!flAuth){
					zdUrl += "&fl_auth="+config.zendeskAuthUrl;
				}

				window.open(zdUrl,'_blank');
			}else {
				if (vm.isNavigatorUser) {
					window.open(config.learningCenter,'_blank');
				} else {
					window.open(config.campusUserLearningCenter,'_blank');
				}
			}
		},
		toPath: function (path) {
			$location.path(path);
		}
	};
}

// #-- END Component (cmpt-topnav-help) --# //
// #--------------------------------------# //
};});}());
