
(function () {'use strict';
	describe('testing (idmAvailableSvc)', function () {
		var testCases = [
			  createTestCase(1,false,false,false,false,'Validate expected properties exist')
			 ,createTestCase(2,false,false,false,false,'')
			 ,createTestCase(3,false,false,true,false,'')
			 ,createTestCase(4,false,true,false,false,'')
			 ,createTestCase(5,false,true,true,true,'')
			 ,createTestCase(6,true,false,false,false,'')
			 ,createTestCase(7,true,false,true,false,'')
			 ,createTestCase(8,true,true,false,false,'')
			 ,createTestCase(9,true,true,true,false,'')

		];
		///Validate expected properties exist
		it('Validate expected properties exist', function () {
				this.currentTestContext = setupCurrentTest(1);
				expect(this.currentTestContext.idmAvailableService.ready == null).toBe(false);
				expect(typeof this.currentTestContext.idmAvailableService.ready.then).toBe('function');

				expect(this.currentTestContext.idmAvailableService.IDMAvailable == null).toBe(false);
				expect(typeof this.currentTestContext.idmAvailableService.IDMAvailable).toBe('function');
		});


		///IDM-Availble Tests: SSO_Enabled-false | idmEnabled-false | idmConfigEnabled-false | expectedResult-false
		it(getTestCase(2).description, function () {
				this.currentTestContext = setupCurrentTest(2);
				expect(verifyTestCase(this.currentTestContext.test, false, false, false, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-false | idmEnabled-false | idmConfigEnabled-true | expectedResult-false
		it(getTestCase(3).description, function () {
				this.currentTestContext = setupCurrentTest(3);
				expect(verifyTestCase(this.currentTestContext.test, false, false, true, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-false | idmEnabled-true | idmConfigEnabled-false | expectedResult-false
		it(getTestCase(4).description, function () {
				this.currentTestContext = setupCurrentTest(4);
				expect(verifyTestCase(this.currentTestContext.test, false, true, false, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-false | idmEnabled-true | idmConfigEnabled-true | expectedResult-true
		it(getTestCase(5).description, function () {
				this.currentTestContext = setupCurrentTest(5);
				expect(verifyTestCase(this.currentTestContext.test, false, true, true, true)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-true | idmEnabled-false | idmConfigEnabled-false | expectedResult-false
		it(getTestCase(6).description, function () {
				this.currentTestContext = setupCurrentTest(6);
				expect(verifyTestCase(this.currentTestContext.test, true, false, false, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-true | idmEnabled-false | idmConfigEnabled-true | expectedResult-false
		it(getTestCase(7).description, function () {
				this.currentTestContext = setupCurrentTest(7);
				expect(verifyTestCase(this.currentTestContext.test, true, false, true, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-true | idmEnabled-true | idmConfigEnabled-false | expectedResult-false
		it(getTestCase(8).description, function () {
			 this.currentTestContext = setupCurrentTest(8);
			 expect(verifyTestCase(this.currentTestContext.test, true, true, false, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});

		///IDM-Availble Tests: SSO_Enabled-true | idmEnabled-true | idmConfigEnabled-true | expectedResult-false
		it(getTestCase(9).description, function () {
				this.currentTestContext = setupCurrentTest(9);
				expect(verifyTestCase(this.currentTestContext.test, true, true, true, false)).toBe(true);
				expect(this.currentTestContext.idmAvailableService.IDMAvailable()).toBe(this.currentTestContext.test.expectedResult);
		});


		it('ensure all tests were run and passed', function () {
			var missedTests = testCases.filter(function(test){
				return !test.testSuccessful();
			});
			expect(missedTests.length).toBe(0);
		});


		function setTestResult(test, wasRun, result){
			test.testRun = wasRun;
			test.testResult = result;
		}

		///Mock Helpers
		function createTestCase(id, ssoEnabled, idmEnabled, idmConfigEnabled, expectedResult, description){
				return  {
					id: id,
					isSSO: ssoEnabled,
					idmEnabled: idmEnabled,
					idmConfigEnabled:idmConfigEnabled,
					expectedResult : expectedResult	,
					description: description.length > 0 ? description : getTestCaseName(ssoEnabled, idmEnabled, idmConfigEnabled, expectedResult),
					testRun: false,
					testResult: false,
					testSuccessful: function(){
						return this.testRun && this.testResult;
					}
				};
		}

		function getTestCase(id){
			var test = testCases.filter(function(item){
				return item.id == id;
			})[0];
			return test;
		}

		function getTestCaseName(ssoEnabled, idmEnabled, idmConfigEnabled, expectedResult){
			return `IDM-Availble Tests: SSO_Enabled-${ssoEnabled} | idmEnabled-${idmEnabled} | idmConfigEnabled-${idmConfigEnabled} | expectedResult-${expectedResult}`;
		}

		function verifyTestCase(test, isSSO, idmEnabled, idmConfigEnabled, expectedResult){
			var result = true;
			if(test.isSSO != isSSO) result = false;
			if(test.idmEnabled != idmEnabled) result = false;
			if(test.idmConfigEnabled != idmConfigEnabled) result = false;
			if(test.expectedResult != expectedResult) result = false;
			return result;
		}


		afterEach(function(){
			if(this.currentTestContext){
				setTestResult(this.currentTestContext.test, true, true)
			}
		});

		function setupCurrentTest(currentTestId){
				var idmAvailableService;
				var $q;
				var $rootScope;
				var featureService;
				var ssoService;

				var currentTest = getTestCase(currentTestId);
				angular.mock.module('aesop');
				setupSSOServiceMock(currentTest.isSSO, "ssoDomain")
				setupFeatureServiceMock(currentTest.idmEnabled);
				setupConfigMock(currentTest.idmConfigEnabled);

				angular.mock.inject(function GetDependencies(_$rootScope_, _$state_, _ssoSvc_, _featureSvc_, _idmAvailableSvc_) {
					var state = _$state_;
					spyOn( state, 'go' );
					spyOn( state, 'transitionTo' );
					$rootScope = _$rootScope_;
					ssoService = _ssoSvc_;
					featureService = _featureSvc_;
			    idmAvailableService = _idmAvailableSvc_;
			  });
				$rootScope.$apply();
				var counter = 0;
				var waiting = true;
				idmAvailableService.ready.then(function(){
					waiting = false;
				});
				$rootScope.$digest();
				while (waiting && counter < 1000)
				{
					//just make sure that this doesn't end up in an infinte loop or anything
						counter++;
				}
				return {
					 $rootScope : $rootScope
					,ssoService : ssoService
					,featureService: featureService
					,idmAvailableService : idmAvailableService
					,test : currentTest
				}
		}


		function setupSSOServiceMock(isSSO, ssoDomain){
			module(function($provide){
				$provide.service('ssoSvc', function(){
					var mockSvc = {
						IsSSO: isSSO,
						SSODomain: ssoDomain,
						IsMock: true
					};
					return mockSvc;
				});
			});
		}

		function setupFeatureServiceMock(idmEnabled){
				module(function($provide){
					$provide.service('featureSvc', function($q){
						var _defer = $q.defer();
						_defer.resolve();
						function get(featureName){
							return {enabled: idmEnabled};
						};
						var mockSvc = {
							ready: _defer.promise,
							get,
							IsMock: true

						};
						return mockSvc;
					});
			});
		}

		function setupConfigMock(idmConfigEnabled){
			module(function($provide){
				$provide.service('config', function($q){
					return {
						idm :{
							enabled: idmConfigEnabled ? "on" : "off",
							IsMock : true
						}
					};
				});
			});
		}

		// #--- END Service Unit Test (idmAvailableSvc) ---# //
		// #-----------------------------------------------# //
	});
}());
