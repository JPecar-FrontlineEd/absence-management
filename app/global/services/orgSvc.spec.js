(function () {'use strict';
	describe('testing (orgService)', function () {
		var orgService;

    var storageSvcMock = {
      load:function (){
        return [{
          applId: 5
        }];
      }
    };


    beforeEach(module('aesop', function($provide){
      //http://www.syntaxsuccess.com/viewarticle/how-to-mock-providers-in-angular
      $provide.factory('storageSvc', function(){
        return storageSvcMock;
      });
    }));
		beforeEach(function () {
			inject(function (_orgSvc_) {
				orgService = _orgSvc_;
			});
		});

		// #--------------------------------------# //
		// #----- Service Unit Test (orgSvc) -----# //

		// jasmine tests for orgService functions
		it('should have a ready property that is a promise', function () {
			// replace below with your real test
      expect(orgService.ready == null).toBe(false);
			expect(typeof orgService.ready.then).toBe('function');
		});

    it('should have the getOrgData function that returns array of Orgs', function(){
      expect(typeof orgService.getOrgData).toBe('function');
      expect(orgService.getOrgData().length).toBeGreaterThan(0);
    });

    it('should have the partner function that returns object with the property of "useAdmin"', function(){
      expect(typeof orgService.partner).toBe('function');
      expect(orgService.partner()).toEqual({ useAdmin: false });
    });

		// #--- END Service Unit Test (orgSvc) ---# //
		// #--------------------------------------# //
	});
}());
