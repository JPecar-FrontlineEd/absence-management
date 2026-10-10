(function() {'use strict';angular.module('aesop')
.directive('cmptSearchSearchContainer', function () {return {

// directive options
restrict: 'E',
scope: {
	initialResult: '='
},
replace: true,
templateUrl: '/components/search/cmpt-search-search-container/searchSearchContainer.html',

// #--------------------------------------------------# //
// #---- Component (cmpt-search-search-container) ----# //
controller: function ($scope, stringSvc, searchSvc, $location, phoneFormatFilter, userSvc, userType, permissionSvc, institutionSvc, arrayHelp, featureSvc, $rootScope) {
	var adminUserType = null;
	var queryString = $location.search();
	$scope.isGlobalSearchEnabled = featureSvc.get('AngularGlobalSearchFilter').enabled;
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
        'Search',
        'ConfirmationPoundShortCamelCase',
        'Vacancy',
        'Employee',
		'VacancyProfile',
        'Substitute',
        'School',
        'Phone',
        'SubProfile.label.Email',
        'Absence.Button.Text.CreateAbsence',
        'Absence.Button.Text.CreateVacancy',
        'absrItenerant.Step1.text.note',
        'Absence',
        'NoRecordsFound',
        'Search.NoRecordsFoundExplanation',
        'Search.RefineYourSearch',
        'Search.SearchResultsFound',
        'Search.SearchResultFound',
        'Search.Searching',
        'Search.InstHierarchy',
        'Worker.Fulfillment.DoesNotNeedSub',
		'Worker.Fulfillment.CanDecide',
		'Private',
		'Active',
		'Inactive',
		'Both',
		'Dashboard.ConfirmationNumber.Input.Placeholder',
		'Reports.CriteriaPanel.Label.Type',
		'Absence.Create.Text.Profile',
		'ConfirmationNumber',
		'GlobalSearch.Label.SearchTypeFilter',
		'GlobalSearch.Label.ActiveInactiveFilter',
		'Search.SearchFieldErrorMessage'
    ]);

    var searchCountsObj = {
    	totalSearches: 0,
		totalMatches: 0,
		thisMatches: 0
    }

    var orgUserHrefs = {
    	emp : "/navigator/te_general.asp?x=x&TB2=TAB1&TB1=TAB1&work_id={personid}",
    	sub : "/navigator/sub_general.asp?x=x&TB2=TAB1&TB1=TAB1&sub_id={personid}",
    	school: "/navigator/s_general.asp?inst_id={instid}",
    	schoolHierarchy: "/navigator/s_select.asp",
		vacancyProfile: "navigator/vp_general.asp?x=x&work_id={profileid}"
    }

    var campusUserHrefs = {
    	emp : "",
    	sub : "/substitute/{personid}",
    	school: "/settings/school/{instid}/general-info",
    	schoolHierarchy: "/settings/school/general-info",
		vacancyProfile: ""
    }

    //Permissions
	var canCreateVacancyBase = 	//This matches routePermissionVal.js
		permissionSvc.iHave("ABSR.VACANCY") && 
		permissionSvc.iHave("ABSR.VACANCYEDIT") &&
		permissionSvc.iHave("PSEUDO.UsesVacancies") &&
		permissionSvc.iHave("ABSR.CREATE");

    //Action			Org User 	 				Campus User
    //-------------		--------------------		------------------------
    //View Employee 	EMP.EMPVIEWGENERAL			No perm (assume false)... 
    //View Sub 			SUB.SUBVIEWGENERAL			SUB.SUBVIEWGENERAL
    //View School 		INST.INSTVIEWGENERAL		No perm (assume true)...
	//View VacProf      VACPROF.VACVIEWGENERAL      No perm (assume false)...
    var orgUserPerms = {
    	canViewEmp : permissionSvc.iHave("EMP.EMPVIEWGENERAL"),
    	canViewSub : permissionSvc.iHave("SUB.SUBVIEWGENERAL"),
    	canViewSchool : permissionSvc.iHave("INST.INSTVIEWGENERAL"),
		canViewVacancyProfile : permissionSvc.iHave("VACPROF.VACVIEWGENERAL"),
    	canCreateAbsence : permissionSvc.iHave("ABSR.CREATE"),
		canCreateVacancy : canCreateVacancyBase,
		canCreateVacancyPrivate : canCreateVacancyBase && permissionSvc.iHave("ABSR.VACPRIVATEEDIT")
    }

    var campusUserPerms = {
    	canViewEmp : false,
    	canViewSub : permissionSvc.iHave("SUB.SUBVIEWGENERAL"),
    	canViewSchool : true,
		canViewVacancyProfile : false, 
    	canCreateAbsence : permissionSvc.iHave("ABSR.CREATE"),
		canCreateVacancy : canCreateVacancyBase,
		canCreateVacancyPrivate : canCreateVacancyBase && permissionSvc.iHave("ABSR.VACPRIVATEEDIT")
    }

    var resultsObj = {
    	svcObj : {},
		hasAbsr : false,
		hasVacancy : false,
		hasWorkers : false,
		hasSubs: false,
		hasSchools: false,
		hasVacancyProfiles: false, 
		showSearching: false,
		showSummary : false,
        showNothingFound: false,
        showWarning: false,
		isNavigatingNow: true,
		matchCt : 0,
		set : function(searchFor, svcData) {
			function emphasizeSearchForPerson(person, searchString)
			{
				person.LastName = emphasizeSearch(person.LastName, searchString, 3);
				person.FirstName = emphasizeSearch(person.FirstName, searchString, 2);
				person.FullName = person.LastName + ", " + person.FirstName;
				person.Identifier = (person.Identifier 
					? emphasizeSearch(person.Identifier, searchString)
					: null
					);
				person.Phone = (person.Phone
					? formatPhone(person.Phone, searchString)
					: null
					)
				person.Email = (person.Email 
					? emphasizeSearch(person.Email, searchString)
					: null
					);
			}

			
			this.svcObj = svcData;
			this.searchFor = svcData.searchFor;
			this.hasAbsr = svcData.hasAbsr;
            this.hasVacancy = svcData.hasVacancy;
            //once you get workers then this.hasWorkers has to be true for next setof records as well. Until the value is false then assign the value(svcData.hasWorkers) coming from service. Same applicable for this.hasSubs, this.hasSchools, this.hasVacancyProfiles
            this.hasWorkers = this.hasWorkers ? true : svcData.hasWorkers;
            this.hasSubs = this.hasSubs ? true : svcData.hasSubs;
            this.hasSchools = this.hasSchools ? true :  svcData.hasSchools;
            this.hasVacancyProfiles = this.hasVacancyProfiles ? true :  svcData.hasVacancyProfiles;
			this.matchCt = svcData.matchCt;
			this.showSearching = false;
            this.showSummary = true;
            this.showWarning = this.matchCt > 50;
			this.showNothingFound = this.matchCt == 0;
			this.showError = false; 
            vm.moreRowsAvailable = vm.results.matchCt - vm.offset > vm.maxFetchCount;
			if (this.hasWorkers) {
				var searchString = this.searchFor;
				svcData.workers.map(
					function(person, index, array) {
						function setupTooltip(person) {
							//Don't setup the tooltip if the admin can see the employee
							//and there is somewhere to link to
							if (vm.permissions.canViewEmp && vm.hrefs.emp != "") return;

							//Resolve InstIds
							var instIds = person.InstIds.split(',');
							var schools = instIds.map(
								function (id) {
									var inst = institutionSvc.oneById(id);
									return {
										id: id,
										instName: inst.name
									};
								}
							);
							schools.sort(arrayHelp.sort('instName'));

							//Create tooltipData
							person.tooltipData = {
								type: person.WktName,
								name: person.LastName + ',' + person.FirstName,
								identifier: person.Identifier,
								data: [{
									val: person.Title,
									icon: 'fa-users'
								},{
									val: '<span>' + schools.reduce(function(prev,curr){return prev + curr.instName + '<br>' },'') + '</span>',
									icon: 'fa-institution'
								},{
									val: phoneFormatFilter(person.Phone),
									icon: 'fa-phone'
								}]
		                	};
		                	if (person.NeedsFulfillment == 0) {
		                    	person.tooltipData.data.push({ val: strings['Worker.Fulfillment.DoesNotNeedSub'] });
		                	};
		                	if (person.NeedsFulfillment == 2) {
		                    	person.tooltipData.data.push({ val: strings['Worker.Fulfillment.CanDecide'] });
		                	};
						}	                

						//Create the tooltipData property
						setupTooltip(person);

						//Find/highlight the search string
						emphasizeSearchForPerson(person, searchString);			
					}
				);
			}

			if (this.hasSubs)
			{
				var searchString = this.searchFor;
				svcData.subs.map(
					function(person, index, array) {
						//Find/highlight the search string
						emphasizeSearchForPerson(person, searchString);	
					}
				);
			}

			if (this.hasSchools)
			{
				var searchString = this.searchFor;
				svcData.schools.map(
					function(school, index, array) {
						//Find/highlight the search string
						school.Name = emphasizeSearch(school.Name, searchString);
						school.ExternalId = emphasizeSearch(school.ExternalId, searchString);
					}
				);
			}

			if (this.hasVacancyProfiles) {
				var searchString = this.searchFor;
				svcData.vacancyProfiles.map(
					function(profile, index, array) {
						function setupTooltip(profile) {
							//Don't setup the tooltip if the admin can see the vacancyProfile
							//and there is somewhere to link to
							if (vm.permissions.canViewVacancyProfile && vm.hrefs.vacancyProfile != "") return;

							//Resolve InstIds
							var instIds = profile.InstIds.split(',');
							var schools = instIds.map(
								function (id) {
									var inst = institutionSvc.oneById(id);
									return {
										id: id,
										instName: inst.name
									};
								}
							);
							schools.sort(arrayHelp.sort('instName'));

							//Create tooltipData
							profile.tooltipData = {
								type: profile.WktName,
								name: profile.Name,
								identifier: profile.Identifier,
								data: [{
									val: '<span>' + schools.reduce(function(prev,curr){return prev + curr.instName + '<br>' },'') + '</span>',
									icon: 'fa-institution'
								}]
		                	};
							if (profile.IsPrivate) {
		                    	profile.tooltipData.data.push({ val: "This vacancy profile is marked PRIVATE" });
		                	};
						}	                

						//Create the tooltipData property
						//setupTooltip(profile);

						//Find/highlight the search string
						profile.Name = emphasizeSearch(profile.Name, searchString);
						profile.Identifier = emphasizeSearch(profile.Identifier, searchString);
						profile.PCN = emphasizeSearch(profile.PCN, searchString);
					}
				);
			}

		},
		reset: function() {
			this.svcObj = {};
			this.showSearching = false;
            this.showSummary = false;
            this.showWarning = false;
			this.showError = false;
			this.showNothingFound = false;
			this.isNavigatingNow = true;
		},
		toString : function() { return JSON.stringify(this.svcObj); }
    }

	//Added the few identifier like 4 for vacancy profile and 1 for schools and 0 for the confirmation number to identify 
	$scope.searchTypeValues = [ 
		{ id : 2, title : strings['Employee']}, 
		{ id : 3, title : strings['Substitute'] }, 
		{ id : 4, title : strings['VacancyProfile'] },  
		{ id : 1, title : strings['School'] }, 
		{ id : 0, title : strings['Dashboard.ConfirmationNumber.Input.Placeholder'] } 
	]

	$scope.activeInactiveOptionsValues = {
		Active: strings["Active"],
		InActive: strings["Inactive"],
		Both: strings["Both"]
	}

	// View Model properties
	var vm = $scope.vm = {	
		searchCounts: searchSvc.getCounts(),
		strings: strings,
		searchFor: queryString.searchFor,
		qsNavigateNow : (queryString.navNow ? (queryString.navNow.toLowerCase() == 'true' ? true : false) : true),   
		qsShowRaw : (queryString.showRaw ? (queryString.showRaw.toLowerCase() == 'true' ? true : false) : false),
		qsShowCounts : (queryString.showCounts ? (queryString.showCounts.toLowerCase() == 'true' ? true : false) : false),
		results: resultsObj,
		hrefs: {},	//set later
		permissions: {},	//set later
		initialResult: $scope.initialResult,
		showSchoolHierarchyLink: adminUserType == userType.org ? true : ($scope.initialResult.apiObj != null ? $scope.initialResult.apiObj.VisibleInstCount > 1 : false),
		searchTypes : $scope.searchTypeValues.map(function (v, i, a) {
			return {
				id: v.id,
				value: v.title,
				enabled: true
			};
		}),
		activeInactiveOptions: [{
			id: 1,
			title: strings['Active'],
			value: $scope.activeInactiveOptionsValues.Active
		},{
			id: 0,
			title: strings['InActive'],
			value: $scope.activeInactiveOptionsValues.InActive
		},{
			id: null,
			title: strings['Both'],
			value: $scope.activeInactiveOptionsValues.Both
		}],
		labelSearchTypeFilter : strings['GlobalSearch.Label.SearchTypeFilter'],
		labelActiveInactiveFilter : strings['GlobalSearch.Label.ActiveInactiveFilter'],
        labelSearchBox: strings['Search'],
        maxFetchCount: 200,
        nextPage: 1,
        offset: 0,
        moreRowsAvailable: false,
		searchFocused: false
	}

    $scope.filters = { selectedEmployeeTypes: null, activeInactiveVal: vm.activeInactiveOptions[0] };
	var filters = $scope.filters;
	$scope.filteredList = [];

	$scope.$watchCollection('filters.selectedEmployeeTypes', function () {  
		$scope.filteredList = [];    
        if (filters.selectedEmployeeTypes != null && filters.selectedEmployeeTypes.length > 0){
            filters.selectedEmployeeTypes.forEach(element => {
                var filteredSearchTypeObject = vm.searchTypes.filter(function(searchType) { return searchType.id == element });
                $scope.filteredList.push(filteredSearchTypeObject[0]);
            });
        }
    });

	$scope.removeFilter = function(filterToBeRemoved){
        $scope.filteredList.splice($scope.filteredList.indexOf(filterToBeRemoved), 1);
		filters.selectedEmployeeTypes.splice(filters.selectedEmployeeTypes.indexOf(filterToBeRemoved.id), 1);
    }
	
	// Actions that can be bound to/from the view
	var go = $scope.go = {
		doSearch: doSearch,
		formatPhone: formatPhone,
		emphasizeSearch: emphasizeSearch,
		buildLink: buildLink,
		navigatedNow: $scope.navigatedNow,
		fetchData: fetchData
	};

	//Once we know the user type, we can setup the hrefs to use
    userSvc.ready.then(
    	function (user) {
			adminUserType = user.UserType;
			vm.hrefs = (adminUserType == userType.org || adminUserType == userType.csRep ? orgUserHrefs : campusUserHrefs);
			vm.permissions = (adminUserType == userType.org || adminUserType == userType.csRep ? orgUserPerms : campusUserPerms);
			vm.empNameAsLink = (vm.permissions.canViewEmp && vm.hrefs.emp != "");
			vm.subNameAsLink = (vm.permissions.canViewSub && vm.hrefs.sub != "");
			vm.schoolNameAsLink = (vm.permissions.canViewSchool && vm.hrefs.school != "");
            vm.vacProfNameAsLink = (vm.permissions.canViewVacancyProfile && vm.hrefs.vacancyProfile != "");
            if (!okToSearch()) return;
			if (!$scope.isGlobalSearchEnabled) {
				doSearch(); 
			}
		}
	);

    //Register a watch on the querystring parameter 'searchFor' and 'searchType'
    $scope.$watchGroup([function () { return $location.search().searchType; }, function () { return $location.search().searchFor; }],
        function (newValues) {
            if ($location.path() != "/search/search") return;	//Navigating away from the page?
            var isAnySearchParameterChanged = false;
            if (newValues[0] != undefined && newValues[0] != '' && vm.searchType != newValues[0]) {
                vm.searchType = newValues[0]; // Current searchType value
                filters.selectedEmployeeTypes = vm.searchType != null ? [parseInt(vm.searchType)] : [];
                isAnySearchParameterChanged = true;
            }
            if (newValues[1] != undefined && newValues[1] != '' && vm.searchFor != newValues[1]) {
                vm.searchFor = newValues[1]; // Current searchFor value
                isAnySearchParameterChanged = true;
            }
            if (isAnySearchParameterChanged) {
                vm.results.reset(); //Prep for the search;
                vm.searchFocused = true;
                doSearch();
            }
        });


	function okToSearch()
	{
		//If the controller passed a search result... use it
        if (vm.initialResult != null && Object.keys(vm.initialResult).length !== 0 && vm.initialResult)
		{
			vm.results.set(vm.searchFor, vm.initialResult);
			vm.initialResult = null;
			return false;
		}
	
		//Check if the user is searching for blank
		if (!vm.searchFor || vm.searchFor.trim().length == 0) 
		{
			vm.results.showError = true;
			return false;
		}		

		return true;
	}

    function fetchData() {
        vm.offset = vm.nextPage * vm.maxFetchCount;
        var selectedEmployeeTypes = filters.selectedEmployeeTypes != null && filters.selectedEmployeeTypes.length > 0 ? filters.selectedEmployeeTypes.join(",") : null;
        var globalSearch = searchSvc.doSearch(vm.searchFor, selectedEmployeeTypes, filters.activeInactiveVal.id, vm.maxFetchCount, vm.offset);
        globalSearch.then(
            function (data) {
                vm.nextPage = vm.nextPage + 1;
                vm.results.set(vm.searchFor, data);
            },
            function () { alert("Failure") }
        );
           
	}
	
    function doSearch() {
        vm.offset = 0;
        vm.nextPage = 1;
        vm.moreRowsAvailable = false;
		vm.results.reset(); //Prep for the search;
		
		if (!okToSearch()) return;

		vm.results.showSearching = true;
		var selectedEmployeeTypes = filters.selectedEmployeeTypes != null && filters.selectedEmployeeTypes.length > 0 ? filters.selectedEmployeeTypes.join(",") : null;
        var globalSearch = $scope.isGlobalSearchEnabled ? searchSvc.doSearch(vm.searchFor, selectedEmployeeTypes, filters.activeInactiveVal.id, vm.maxFetchCount, vm.offset) : searchSvc.doSearch(vm.searchFor, null, null, 50, 0);
		
		globalSearch.then(
				function(data) {
					vm.results.set(vm.searchFor, data);
					vm.searchCounts = searchSvc.getCounts();
					vm.showSchoolHierarchyLink = (adminUserType == userType.org 
						? true
						: vm.results.svcObj.apiObj.VisibleInstCount > 1);
					navigateNow();
				},
				function() {alert("Failure")}
			);
			
			$rootScope.$emit("globalSearchTextChange", {searchFor:vm.searchFor, searchType:vm.searchType});
	}

	function formatPhone(unformatted, searchString)
	{
		function addStr(stringToAddTo, idx, str) {
    		return stringToAddTo.slice(0, idx) + str + stringToAddTo.slice(idx);
		}

		function combineFormattedAndEmphasized(unformatted, formatted, emphasized) {
			//Only handle if we have a (xxx)yyy-zzzz phone number
			if (unformatted.length != 10) return emphasized;

			//var doLog = unformatted == "4107088675";

			var eReplaced = "(" + emphasized
								.replace("<em>", "{")
								.replace("</em>", "}");

			var fReplaced = formatted.replace(") ", ")");

			//if (doLog) console.log(eReplaced + "..." + fReplaced);

			var idxEmStart = eReplaced.indexOf("{");
			var idxEmEnd = eReplaced.indexOf("}");

			var idxCloseParen = fReplaced.indexOf(")");
			var idxHyphen = fReplaced.indexOf("-");

			//if (doLog) console.log("EmStart:" + idxEmStart + ",EmEnd:" + idxEmEnd + ",CloseParen:" + idxCloseParen + ",Hyphen:" + idxHyphen);

			var combined = addStr(eReplaced, idxHyphen + 
				(idxHyphen <= idxEmStart 
					? -1
					: (idxHyphen > idxEmStart && idxHyphen < idxEmEnd ? 0 : 1)), "-");
			//if (doLog) console.log(combined);
			combined = addStr(combined, idxCloseParen 
				+ (idxCloseParen <= idxEmStart 
					? 0 
					: (idxCloseParen > idxEmStart && idxCloseParen < idxEmEnd ? 1 : 2)), ")");
			//if (doLog) console.log(combined);


			combined = combined
				.replace("{", "<em>")
				.replace("}", "</em>")
				.replace(")", ") ")
				;

			//Example
			//  unformatted = 6103476876
			//  fReplaced = (610)347-6876
			//  eReplaced = 6103{4768}76
			//	combined = (610)3{47-68}76

			return combined;//emphasized + "..." + formatted + "..." + combined;
		}

		var formatted = phoneFormatFilter(unformatted);
		var emphasized = emphasizeSearch(unformatted, searchString);
		if (emphasized.includes("<em>")) {
			return combineFormattedAndEmphasized(unformatted, formatted, emphasized);
		}
		else return formatted;
	}

	function emphasizeSearch(stringToHighlight, searchString, mode)
	{
		if (!stringToHighlight) return stringToHighlight;

		//Modes
		//  1 - use full search string
		//	2 - use first part of search string (if there is a first part)
		//	3 - use last part of search string (if there is a last part)
		if (!mode) mode = 1;

		var searchStringToUse = searchString;
		if (mode == 2 || mode == 3)
		{
			var parts = searchString.split(' ');
			if (parts.length > 1)
			{
				if (mode == 2) searchStringToUse = parts[0];
				else searchStringToUse = parts[parts.length - 1];
			}	
		}

		var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
		var search = searchStringToUse.replace(specials, "\\$&");
		var regex = new RegExp('(' + search + ')', 'i');		//not 'gi'... only get first occurence
		var displayText = stringToHighlight.replace(regex, '<em>$1</em>'); //
		
		return displayText;
	}

	function navigateNow()
	{
		if 	(
			(vm.results.matchCt != 1) ||
		 	(!vm.qsNavigateNow) ||
		 	((!vm.results.hasAbsr && !vm.results.hasVacancy))
		 	)
		{
			vm.results.isNavigatingNow = false;
			return;
		}

		//Only navigate now if the 1 object is an ABSR or VACANCY
		if (vm.results.hasAbsr)
		{
			searchSvc.navigateToAbsr(vm.results.svcObj.absr.Id);
		}
		else if (vm.results.hasVacancy)
		{
			searchSvc.navigateToAbsr(vm.results.svcObj.vacancy.Id);
		}
	}

	function buildLink(unreplaced, toReplace, withWhat)
	{
		var replaced = unreplaced.replace(toReplace, withWhat);
		return replaced;
	}
}

// #-- END Component (cmpt-search-search-container) --# //
// #--------------------------------------------------# //
};});}());