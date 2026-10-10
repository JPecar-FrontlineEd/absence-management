(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Service (searchSvc) -----# //
	app.factory('searchSvc', function ($q, $location, $window, absrSvc, toastHelp, featureSvc, stringSvc, searchApi, storageSvc, permissionSvc, userType, userSvc, config ) {

		var resultObj = {
	    	searchFor : "",
	    	apiObj : {},
			hasAbsr : false,
			hasVacancy : false,
			hasWorkers : false,
			hasSubs: false,
			hasSchools: false,
			hasVacancyProfiles: false,
			matchCt : 0,
			absr : {},
			vacancy : {},
            workers :[],
			subs: [],
			schools: [],
			vacancyProfiles: [],
            error: "",
            offset: 0,
			set : function(searchFor, apiData) {			
				this.searchFor = searchFor;
				this.apiObj = apiData;
				
				//Can't use counts to determine hasxxxx since count values are BEFORE the server limits to 50 items
				//so its possible counts.Sub > 0 even though apiData.Subs is not available to the client.
				this.hasAbsr = (apiData.Absr ? true : false);
				this.hasVacancy = (apiData.Vacancy ? true : false);
				this.hasWorkers = (apiData.Workers ? true : false);
				this.hasSubs = (apiData.Subs ? true : false);
				this.hasSchools = (apiData.Schools ? true : false);
				this.hasVacancyProfiles = (apiData.VacancyProfiles ? true : false);

				var counts = apiData.Counts[0];
				this.matchCt = counts.Total;
				
				this.absr = apiData.Absr;
                this.vacancy = apiData.Vacancy;
                this.workers = apiData.Workers == undefined ? this.workers : (this.offset != 0 ? this.workers.concat(apiData.Workers) : apiData.Workers);
                this.subs = apiData.Subs == undefined ? this.subs : (this.offset != 0 ? this.subs.concat(apiData.Subs) : apiData.Subs);
                this.schools = apiData.Schools == undefined ? this.schools : (this.offset != 0 ? this.schools.concat(apiData.Schools) : apiData.Schools);
                this.vacancyProfiles = apiData.VacancyProfiles == undefined ? this.vacancyProfiles : (this.offset != 0 ? this.vacancyProfiles.concat(apiData.VacancyProfiles) : apiData.VacancyProfiles);
			},
			reset: function() {
				this.apiObj = {};
				this.hasAbsr = false
				this.hasVacancy = false;
				this.hasWorkers = false;
				this.hasSubs = false;
				this.hasSchools = false;
				this.hasVacancyProfiles = false;
				this.matchCt = 0;
				this.absr = {};
				this.vacancy = {};
				this.workers = [];
				this.subs = [];
				this.schools = [];
				this.vacancyProfiles = [];
			}
	    }
	    
	    var counts = {
	    	totalSearches: 0,
	    	totalMatches: 0,
	    	thisMatches: 0,
	    	incr: function(numMatches)
	    	{
	    		this.totalSearches += 1;
	    		this.totalMatches += numMatches;
	    		this.thisMatches = numMatches;
	    	}
	    }

		function search (text) {
			var _defer = $q.defer();
			var strings = stringSvc.getStrings([
				'AbsrIsNull'
			]);

			featureSvc.ready
				.then(
					function() { 
						var globalSearchFeature = featureSvc.get("AngularGlobalSearch", false); 
						if (globalSearchFeature.enabled) { 
							searchGlobal(text, _defer);
						} 
						else {
							searchAbsrOnly(text, strings, _defer);
						}
					}, 
					function() { 
						 searchAbsrOnly(text, strings);
	 				}
				);			
			
			return _defer.promise;
		}

		function searchGlobal(text, searchPromise)
		{
			// Check if ReactGlobalSearchForOU feature flag is enabled for Organization Users
			var reactGlobalSearchFeature = featureSvc.get("ReactGlobalSearchForOU", false);

			if (reactGlobalSearchFeature.enabled) {
				// Redirect to React global search page
				$window.location.href = config.navigatorBaseUrl +'/search.asp?searchFor=' + encodeURIComponent(text);
			} else {
				// Use Angular global search page
				//use querystring since searching can use special characts which can't be in a path
				$location.url('/search/search?searchFor=' + text);	
			}

			searchPromise.resolve();
		}
		
		function searchAbsrOnly (text, strings, searchPromise) {
			if(isNaN(text) || !/^[0-9]{5,9}$/.test(text)){
				toastHelp.clear();
				toastHelp.error(strings['AbsrIsNull'],'Error');
				searchPromise.reject();
			}
			else {
				var absrId = parseInt(text);				 
				if (!storageSvc.load("formDirty")){
				absrSvc
					.setupAbsrState(absrId, null)
					.then(
						function (){
							storageSvc.clear("formDirty");
							navigateToAbsr(absrId);
							searchPromise.resolve();
						}, 
						function (reasons){
							toastHelp.clear();
							toastHelp.error(reasons.errors,'Error');
							searchPromise.reject();
						}
					);
				}else if(storageSvc.load("formDirty")){
					absrSvc.confirmNavigateAway('/abs-mgt/absences/detail/' + absrId + '/view');
					searchPromise.resolve();
				}
			}
		}
		
		function navigateToAbsr(absrId)
		{
			$location.url('/abs-mgt/absences/detail/' + absrId + '/view');
		}

        function doSearch(searchString, selectedEmployeeTypes = null, isActive = null, maxFetchCount = 200, offset = 0)
		{
			var _defer = $q.defer();
            if (offset == 0) {
                resultObj.reset();
            }

            resultObj.offset = offset;
            var apiGeneralSearch1 = searchApi.generalSearch({ searchFor: searchString, searchTypes: selectedEmployeeTypes, isActive: isActive, maxFetchCount: maxFetchCount, offset: offset });

			var allAPICalls = $q.all(
				{ 
					search1: apiGeneralSearch1 
				})
				.then(
					function (d) {
						if (searchString != "") { resultObj.set(searchString, d.search1); }
						if (!searchString || searchString.trim().length == 0)
						{
							resultObj.error = "You must specify a search value.";
							return false;
						}
						counts.incr(resultObj.matchCt);
						console.log(counts);		
		            	_defer.resolve(resultObj);
		  			}, 
		  			function (err) {
						if (searchString != "") {
							_defer.reject({ errors: err.$messages });
							return $q.reject(err.$messages);
						}
					}
				);

			return _defer.promise;
		}

		return {
			search: search,
			navigateToAbsr: navigateToAbsr,
			doSearch: doSearch,
			getCounts: function() { return counts; }
		};

	});
	// #--- END Service (searchSvc) ---# //
	// #-------------------------------# //

}());