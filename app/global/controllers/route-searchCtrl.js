(function() {'use strict';angular.module('aesop')
.controller('SearchCtrl', function ($scope, $location, stringSvc, featureSvc, searchSvc, orgSvc, userSvc, permissionSvc, $rootScope) {
// #--------------------------# //
// #------- SearchCtrl -------# //

	var queryString = $location.search();

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
        'Search',
		'GlobalSearch.Filters.SearchTypes',
		'GlobalSearch.Filters.SearchTypes.Tooltip'
    ]);

	var vm = $scope.vm = {
		canViewPage : false,	//This controls the search component container
		strings : strings,
		initialSearchSvcObj: {},
		isGlobalSearchEnabled: featureSvc.get('AngularGlobalSearchFilter').enabled
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function() {
			console.log("someAction called.");
		}
	};

	if (checkPageAccessAllowed()) {	
		doInitialSearch();		//This will do an initial search and either navigate now or open up the search page.
	};

	function checkPageAccessAllowed() {
		if (!featureSvc.get("AngularGlobalSearch").enabled) {
			$location.url("/invalid/page");
			return false;
		}
		else {
			return true;
		}
	}

	function doInitialSearch() {
		//If nothing to search for... proceed to the inner component to show the error
		if (!(queryString.searchType || queryString.searchFor || (queryString.searchFor && queryString.searchFor.trim().length == 0))) 
		{
			vm.canViewPage = true;
			return;	
		}
		var searchFor = queryString.searchFor || "";
        var globalSearch = featureSvc.get("AngularGlobalSearchFilter").enabled ? searchSvc.doSearch(searchFor, queryString.searchType, 1, 200, 0) : searchSvc.doSearch(searchFor, null, null, 50, 0);

        if (searchFor == '') {
            vm.canViewPage = true;
        }
			globalSearch.then(
				function(data) {
					vm.initialSearchSvcObj = data;
					if (data.matchCt == 1) {
						if (!navigateNow(data)) {
							vm.canViewPage = true;
						}
					}
					else vm.canViewPage = true;
				},
				function() {alert("Failure")}
			);
			$rootScope.$emit("globalSearchTextChange", {searchFor:queryString.searchFor, searchType:queryString.searchType});
	}
	function getReturnUrl() {
		var _returnUrl = "/search/search";

		if ($scope.searchUpdatedValue && $scope.searchUpdatedValue.searchFor){
			_returnUrl += "?searchFor=" + ($scope.searchUpdatedValue.searchFor || "");
		} else if(queryString.searchFor){
			_returnUrl += "?searchFor=" + queryString.searchFor;
		}	 
		if ($scope.searchUpdatedValue && $scope.searchUpdatedValue.searchType){
			_returnUrl += ($scope.searchUpdatedValue.searchFor ? "&searchType=" : "?searchType=") + $scope.searchUpdatedValue.searchType;
		} else if(queryString.searchType){
			_returnUrl += (queryString.searchFor ? "&searchType=" : "?searchType=") + queryString.searchType;
		}
		
		return _returnUrl;
	}
	$rootScope.$on("globalSearchTextChange", function (event, newobject) {
		$scope.searchUpdatedValue = newobject;
		$scope.$apply();
	});


	$scope.$watch("searchUpdatedValue", function () {
				$scope.addOptions && $scope.addOptions.forEach(function (element) {
					element.route = element.route.includes("returnUrl") ? (element.route = element.route.split("returnUrl=")[0] + "returnUrl=" + getReturnUrl()) : element.route;
				});
			});

	$scope.addOptionsValues = {
		AddEmployee: "Employee",
		AddSubstitute: "Substitute",
		AddVacancyProfile: "Vacancy Profile",
		AddSchool: "School",
		AddEmployeeInStaffDirectory: "Employee (Now In Staff Directory)",
		AddSubstituteInStaffDirectory: "Substitute (Now In Staff Directory)"
	}

	$scope.addOptions= [{
		id: 1,
		value: $scope.addOptionsValues.AddEmployee,
		route: "/navigator/te_general.asp?TB2=TAB1&TB1=TAB1&add=true&returnUrl=" + getReturnUrl(),
		isAllowed: function () { 
			var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
			var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
			var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM; //Parent bypass setting
			var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
			return permissionSvc.iHave('EMP.EMPAdd') && permissionSvc.iHave('EMP.EmpViewGeneral') && ((isSSDEnabled && allowPartnerOUtoBypassCHCM && canAdminBypassCHCM) || !(isSSDEnabled || isERPEnabled)); 
		}
	},{
		id: 2,
		value: $scope.addOptionsValues.AddSubstitute,
		route: "/navigator/sub_general.asp?TB2=TAB1&TB1=TAB1&add=true&returnUrl=" + getReturnUrl(),
		isAllowed: function () {
			var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
			var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
			var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM;
			var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ?  userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
			return permissionSvc.iHave('SUB.SubViewGeneral') && permissionSvc.iHave('SUB.SubAdd') && !permissionSvc.iHave('PSEUDO.IsVeritimeOnly') && (!(isSSDEnabled || isERPEnabled) || (isSSDEnabled && allowPartnerOUtoBypassCHCM && canAdminBypassCHCM)); 
		}
	},{
		id: 3,
		value: $scope.addOptionsValues.AddEmployeeInStaffDirectory,
		route: window.siteConfig.GlobalDirectoryLink,
		isAllowed: function () { 
			var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
				var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
				var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM; //Parent bypass setting
				var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
				return permissionSvc.iHave('EMP.EMPAdd') && permissionSvc.iHave('EMP.EmpViewGeneral') && ((isSSDEnabled && allowPartnerOUtoBypassCHCM && !canAdminBypassCHCM) || (isSSDEnabled && !allowPartnerOUtoBypassCHCM) || (!isSSDEnabled && isERPEnabled));
			}
	},{
		id: 4,
		value: $scope.addOptionsValues.AddSubstituteInStaffDirectory,
		route: window.siteConfig.GlobalDirectoryLink,
		isAllowed: function () { 
			var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
				var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
				var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM; //Parent bypass setting
				var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
				return permissionSvc.iHave('SUB.SubAdd') && permissionSvc.iHave('SUB.SubViewGeneral') && ((isSSDEnabled && allowPartnerOUtoBypassCHCM && !canAdminBypassCHCM) || (isSSDEnabled && !allowPartnerOUtoBypassCHCM) || (!isSSDEnabled && isERPEnabled));
			}
	},{
		id: 5,
		value: $scope.addOptionsValues.AddVacancyProfile,
		route: "/navigator/vp_general.asp?TB1=TAB1&TB2=&add=true&returnUrl=" + getReturnUrl(),
		isAllowed: function () { return permissionSvc.iHave('VACPROF.Add') && permissionSvc.iHave('VACPROF.VacViewGeneral') && permissionSvc.iHave('PSEUDO.UsesVacancies'); }
	},{
		id: 6,
		value: $scope.addOptionsValues.AddSchool,
		route: "/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&add=true",
		isAllowed: function () { return permissionSvc.iHave('INST.INSTAdd') && permissionSvc.iHave('INST.INSTViewGeneral'); }
        }];
    $scope.isAddOptionsDropdownVisible = $scope.addOptions.some(el => el.isAllowed() === true);

	window.addEventListener('click', function(e){  
		// If the element exists, we will check for the classList to toggle/show the show class 
		if(!!document.getElementById('addOptionsDropdown')) {
			if (document.getElementById('addOptionsDropdown').contains(e.target)){
				!!document.getElementById("addOptionsDropdownContent") && 
					document.getElementById("addOptionsDropdownContent").classList.toggle("show");
			} else{
				!!document.getElementById("addOptionsDropdownContent") && 
					document.getElementById("addOptionsDropdownContent").classList.remove("show");
			}
		}
	  });

	function navigateNow(data)
	{
		var qsNavigateNow = (queryString.navNow ? (queryString.navNow.toLowerCase() == 'true' ? true : false) : true);   
		if (qsNavigateNow && (data.hasAbsr || data.hasVacancy))
		{
			//Only navigate now if the 1 object is an ABSR or VACANCY
			if (data.hasAbsr)
			{
				searchSvc.navigateToAbsr(data.absr.Id);
			}
			else if (data.hasVacancy) {
				searchSvc.navigateToAbsr(data.vacancy.Id);
			}
			return true;		//Navigated
		}
		else {
			return false;		//Didn't navigate
		}
	}


// #----- END SearchCtrl -----# //
});}());