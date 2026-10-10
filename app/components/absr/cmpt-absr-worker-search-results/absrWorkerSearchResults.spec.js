(function () {'use strict';
describe("testing (cmptAbsrWorkerSearchResults)", function() {
  	var el, scope, rootScope, httpBackend, mockOrgSvc, mockInstitutionSvc, mockWorkerApi, deferred;
  	var institutionNamePostfix = 'school'

  beforeEach(function(){
    setupTokenServiceMock("");
    var $rootScope;
    angular.mock.inject(function GetDependencies(_$rootScope_, _tokenSvc_) {
      $rootScope = _$rootScope_;
    });
  });


	beforeEach(inject(function(_orgSvc_, _institutionSvc_, _workerApi_, $q) {
    	deferred = $q.defer();
	    //not testing org data, but there is a requirement on those settings in this directive controller
	    mockOrgSvc = _orgSvc_;
	    spyOn(mockOrgSvc, 'getOrgData').and.callFake(function(){
	    	var orgData = [{ settings: { showIdentifierToCampusUser: true } }];
		 	return orgData;
	    });
	    //control what institution names would be generated when processing worker results
	    mockInstitutionSvc = _institutionSvc_;
	    spyOn(mockInstitutionSvc, 'oneById').and.callFake(function(id){
	    	return { name: id + '_' + institutionNamePostfix };
	    });
	    //allows us to control what promise/data would be returned by "workerApi.get()"
	    mockWorkerApi = _workerApi_;
	    spyOn(mockWorkerApi, 'get').and.returnValue(deferred.promise);
	}));

	beforeEach(inject(function($compile, $rootScope, $httpBackend, _orgSvc_, _institutionSvc_, _workerApi_, $q) {
		httpBackend = $httpBackend;
		rootScope = $rootScope;
		//fake the calls to the API (these are not being tested so empty objects are sufficient)
		$httpBackend.whenGET(window.siteConfig.apiEndpoint + '/v1.0/products').respond({});
		$httpBackend.whenGET(window.siteConfig.apiEndpoint + '/v1.0/users').respond({});
		$httpBackend.whenGET(window.siteConfig.apiEndpoint + '/v1.0/organizations').respond({});
		$httpBackend.whenGET(window.siteConfig.apiEndpoint + '/v1.0/institutions').respond({});
		$httpBackend.whenGET(window.siteConfig.apiEndpoint + '/v1.0/workertypes').respond({});

		//instantiate directive
		el = angular.element('<cmpt-absr-worker-search-results filter=""></cmpt-absr-worker-search-results>')
		$compile(el)($rootScope.$new())
		$rootScope.$digest()

		//grab scope. Depends on type of scope.
		scope = el.isolateScope() || el.scope()
	}));

	it("should order institutions by name for itinerant workers", function() {
		scope.isVacancy = false;	//controls the vacancy flag on the resultset
		deferred.resolve(createMockWorkerResults(true));
		scope.go.fetchData();
		rootScope.$digest();		//forces the promise to be resolved, very important

		var processedResults = scope.vm.results;
		var firstWorker = processedResults[0];
		expect(firstWorker.school).toBe('1_' + institutionNamePostfix);
		expect(firstWorker.schools[0].value).toBe('1_' + institutionNamePostfix);
		expect(firstWorker.schools[1].value).toBe('30_' + institutionNamePostfix);
		expect(firstWorker.schools[2].value).toBe('50_' + institutionNamePostfix);
		expect(firstWorker.schools[3].value).toBe('81_' + institutionNamePostfix);
		expect(firstWorker.schools[4].value).toBe('90_' + institutionNamePostfix);
		expect(firstWorker.schools[5].value).toBe('99_' + institutionNamePostfix);
	});
	it("should add toolTipData for Employees", function() {
		scope.isVacancy = false;	//controls the vacancy flag on the resultset
		deferred.resolve(createMockWorkerResults(true));
		scope.go.fetchData();
		rootScope.$digest();		//forces the promise to be resolved, very important

		var processedResults = scope.vm.results;
		var firstWorker = processedResults[0];
		expect(firstWorker.toolTipData).toBeDefined();
	})
	it("should not add toolTipData for Vacancy Profiles", function() {
		scope.isVacancy = true;		//controls the vacancy flag on the resultset
		deferred.resolve(createMockWorkerResults(true));
		scope.go.fetchData();
		rootScope.$digest();		//forces the promise to be resolved, very important

		var processedResults = scope.vm.results;
		var firstWorker = processedResults[0];
		expect(firstWorker.toolTipData).not.toBeDefined();
	})
	it("should update appropriately when there is more data on the server", function() {
		scope.isVacancy = false;		//controls the vacancy flag on the resultset
		deferred.resolve(createMockWorkerResults(true));
		scope.go.fetchData();
		rootScope.$digest();		//forces the promise to be resolved, very important
		expect(scope.vm.moreRowsAvailable).toBe(true);
	})
	it("should update appropriately when there is no more data on the server", function() {
		scope.isVacancy = false;		//controls the vacancy flag on the resultset
		deferred.resolve(createMockWorkerResults(false));
		scope.go.fetchData();
		rootScope.$digest();		//forces the promise to be resolved, very important
		expect(scope.vm.moreRowsAvailable).toBe(false);
	})


	function createMockWorkerResults(moreResults) {
		var workersInfo = [{
			firstName: 'mock',
			lastName: 'user',
			institution: [
				{id: 99}, {id: 81}, {id: 90}, {id: 1}, {id: 30}, {id: 50}
			],
			workerType: {
				title: 'Teacher'
			}
		}];
		workersInfo.$status = moreResults ? 206 : 200;
		return workersInfo;
	}




	function setupTokenServiceMock(token){
			module(function($provide){
				$provide.service('tokenSvc', function($q){
					var _defer = $q.defer();
					_defer.resolve();
					function get(featureName){
						return {enabled: idmEnabled};
					};
					var mockSvc = {
            ready: _defer.promise,
      			set: function(){},
      			get: function(){return token;},
      			clear: function(){}
					};
					return mockSvc;
				});
		});
	}

})
}());
