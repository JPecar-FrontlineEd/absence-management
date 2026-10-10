(function () {'use strict';
	describe('testing (ssoSvc)', function () {
		var testCases = [
			  {id: 1,  testCase : 'CheckIsSsoIs1',  isSSO: '1', 			ssoDomain: 'test'		}
			 ,{id: 2,  testCase : 'CheckIsSsoIs2',  isSSO: 1, 				ssoDomain: 'test'		}
			 ,{id: 3,  testCase : 'CheckIsSsoIs3',  isSSO: 1,					ssoDomain: ''				}
			 ,{id: 4,  testCase : 'CheckIsSsoIs4',  isSSO: 1, 				ssoDomain: undefined}
			 ,{id: 5,  testCase : 'CheckIsSsoIs5',  isSSO: 1, 				ssoDomain: null			}
			 ,{id: 6,  testCase : 'CheckIsSsoIs6',  isSSO: 0,	 				ssoDomain: '4564'		}
			 ,{id: 7,  testCase : 'CheckIsSsoIs7',  isSSO: "0", 			ssoDomain: '4564'		}
			 ,{id: 8,  testCase : 'CheckIsSsoIs8',  isSSO: "", 				ssoDomain: '4564'		}
			 ,{id: 9,  testCase : 'CheckIsSsoIs9',  isSSO: undefined, ssoDomain: '4564'		}
			 ,{id: 10, testCase : 'CheckIsSsoIs10', isSSO: null, 			ssoDomain: '4564'		}
			 ,{id: 11, testCase : 'CheckIsSsoIs11', isSSO: "2", 			ssoDomain: 'test'		}
			 ,{id: 12, testCase : 'CheckIsSsoIs11', isSSO: 2, 				ssoDomain: 'test'		}
			 ,{id: 13, testCase : 'Validate expected properties exist', isSSO: 0, ssoDomain: 'test'		}
		];





		// #--------------------------------------# //
		// #----- Service Unit Test (ssoSvc) -----# //

		// jasmine tests for service functions
		it('IsSSO cookie value is 1 and ssoDomain is not blank, IsSSO should be true', function () {
				this.currentTestContext = setupCurrentTest(1);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(true);
		});
		it('IsSSO cookie value is "1" and ssoDomain is not blank, IsSSO should be true', function () {
				this.currentTestContext = setupCurrentTest(2);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(true);
		});
		it('IsSSO cookie value is 1 and ssoDomain is blank, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(3);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		//
		// ,{testCase : 'CheckIsSsoIs4', isSSO: 1, ssoDomain: undefined}
		it('IsSSO cookie value is 1 and ssoDomain is undefined, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(4);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		// ,{testCase : 'CheckIsSsoIs5', isSSO: 1, ssoDomain: null}
		it('IsSSO cookie value is 1 and ssoDomain is null, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(5);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		// ,{testCase : 'CheckIsSsoIs6', isSSO: 0, ssoDomain: '4564'}
		it('IsSSO cookie value is 0 and ssoDomain is populated, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(6);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});

		// ,{testCase : 'CheckIsSsoIs7', isSSO: "0", ssoDomain: '4564'}
		it('IsSSO cookie value is "0" and ssoDomain is populated, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(7);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		// ,{testCase : 'CheckIsSsoIs8', isSSO: "", ssoDomain: '4564'}
		it('IsSSO cookie value is blank and ssoDomain is populated, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(8);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		// ,{testCase : 'CheckIsSsoIs9', isSSO: undefined, ssoDomain: '4564'}
		it('IsSSO cookie value is undefined and ssoDomain is populated, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(9);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});

		// ,{testCase : 'CheckIsSsoIs0', isSSO: null, ssoDomain: '4564'}
		it('IsSSO cookie value is null and ssoDomain is populated, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(10);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		it('IsSSO cookie value is "2" and ssoDomain is not blank, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(11);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});
		it('IsSSO cookie value is 2 and ssoDomain is not blank, IsSSO should be false', function () {
				this.currentTestContext = setupCurrentTest(12);
				expect(this.currentTestContext.ssoService.IsSSO == true).toBe(false);
		});

		it('Validate expected properties exist', function () {
				this.currentTestContext = setupCurrentTest(13);
				expect(this.currentTestContext.ssoService.IsSSO == null).toBe(false);
				expect(this.currentTestContext.ssoService.IsSSO == undefined).toBe(false);
				expect(this.currentTestContext.ssoService.SSODomain == null).toBe(false);
				expect(this.currentTestContext.ssoService.SSODomain == undefined).toBe(false);
		});


		it('ensure all tests were run and passed', function () {
			var missedTests = testCases.filter(function(test){
				return !wasTestSuccessful(test);
			});
			expect(missedTests.length).toBe(0);
		});

		function getTestCase(id){
			var test = testCases.filter(function(item){
				return item.id == id;
			})[0];
			return test;
		}

		afterEach(function() {
        // clean up
				if(this.currentTestContext){
	        this.currentTestContext.$cookies.remove ('IsSso');
					this.currentTestContext.$cookies.remove ('SsoDomain');
					setTestResult(this.currentTestContext.test, true, true)
				}
    });

		function wasTestSuccessful(test){
			return test.testRun && test.testResult;
		}
		function setTestResult(test, wasRun, result){
			test.testRun = wasRun;
			test.testResult = result;
		}


		function setupCurrentTest(currentTestId){
			var ssoService;
			var $cookies;
			var currentTest = getTestCase(currentTestId);
			angular.mock.module(function ($provide) {
		        $provide.decorator ('$cookies', function ($delegate) {
								if(currentTest.isSSO != null ) $delegate.put ('IsSso', currentTest.isSSO);
								if(currentTest.ssoDomain != null ) $delegate.put ('SsoDomain', currentTest.ssoDomain);
		            return $delegate;
		        });
		    });
				angular.mock.inject(function (_$cookies_, _ssoSvc_) {
					ssoService = _ssoSvc_;
					$cookies = _$cookies_;
					// console.log(ssoService);
				});
				return {
						 ssoService : ssoService
						,$cookies: $cookies
						,test: currentTest
				}

		}



		// #--- END Service Unit Test (ssoSvc) ---# //
		// #--------------------------------------# //
	});
}());
