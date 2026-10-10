(function () {'use strict';
	describe('testing (service)', function () {
		var service,
				$httpBackend,
				$state,
				deferred,
				entitlementTypeApi,
				$rootScope;

		var objOnClient = {
			id: -1,
			name: '',
			placeHolderName: '',
			group: 0,
			isSelected: true,
			parentId: null,
			isExpanded: false,
			isBucket: false,
			externalIdOne: null,
			externalIdTwo: null,
			phoneMenu: null,
			dataAnalysisCategory: null,
			institution:  null,
			workerTypes: [],
			settings: {
				isPublic: false,
				needApproval: false,
				holdUntilApproved: false,
				enforceBalances: false,
				requireNotes: false
			},
			timeUsage: {
				minimumUsage: {
					allowed: false,
					value: null
				},
				minimumBalance:{
					allowed: false,
					value: null
				},
				maxYearlyUsage:{
					allowed: false,
					value: null
				}
			},
			languageTexts: {}
		};

		var objFromServer = {
			$messages: [],
			id: 0, // Dummy Id
			description: null,
			externalId: null,
			externalId2: null,
			isBucket: false,
			menuNumber: 0,
			parentId: 0,
			dataAnalysisCategory: null,
			workerTypes: [],
			parent: { id: 0 }, //Dummy parentId
			isPublic: true,
			needsApproval: true,
			holdUntilApproved: true,
			enforceEntitlementBalances: true,
			notesToAdminRequired: true,
			languageTexts: null,
			useMinUsageMinutes: false,
			minUsageMinutes: null,
			useMinBalanceMinutes: false,
			minBalanceMinutes: null,
			useMaxUsagePerYearMinutes: false,
			maxUsagePerYearMinutes: null
		};

    var stringSvcMock = {
      getStrings: function(){
        return {
          Cancel: 'Cancel',
          'referenceData.absenceReason.NewBucket': 'New Bucket',
          'referenceData.absenceReason.NewAbsenceReason': 'New Reason',
					'referenceData.absenceReason.AbsenceReasonCreated': 'Absence Reason Created successfully',
					'referenceData.absenceReason.AbsenceReasonSaved': 'Absence Reason updated successfully',
					'Success': 'Success',
					'referenceData.absenceReason.AbsenceReasonDeleted': 'Absence Reason deleted'
        };
      }
    };

    var referenceDataValMock = {};

    var dataAnalysisCategorySvcMock = {
      getDataAnalysisCategory: function(){
        return [];
      }
    };

    var workerTypeApiMock = {
      getForReferenceData: function(){
        return [];
      }
    };

		var institutionSvcMock = {
			oneById: function(){
				return {
					id: 123,
					name: 'Test Institution'
				};
			}
		};



    beforeEach(module('aesop', function($provide){

			//http://www.syntaxsuccess.com/viewarticle/how-to-mock-providers-in-angular
      $provide.factory('stringSvc', function(){
        return stringSvcMock;
      });

      $provide.factory('dataAnalysisCategorySvc', function(){
        return dataAnalysisCategorySvcMock;
      });

			$provide.factory('institutionSvc', function(){
        return institutionSvcMock;
      });

      $provide.factory('workerTypeApi', function(){
        return workerTypeApiMock;
      });


      $provide.value('referenceDataVal', referenceDataValMock);

    }));


    // Reseting the Val before each Test
    beforeEach(module('aesop', function(){
      delete referenceDataValMock.item;
      delete referenceDataValMock.list;
    }));

  	beforeEach(function () {
			inject(function (_$rootScope_,
											_referenceDataAbsenceReasonSvc_,
											_$httpBackend_,
											_$state_,
											_$q_,
											_entitlementTypeApi_) {
				service = _referenceDataAbsenceReasonSvc_;
				$state = _$state_;
				$rootScope = _$rootScope_;
				$httpBackend = _$httpBackend_;
				deferred = _$q_.defer();
				entitlementTypeApi = _entitlementTypeApi_;


				spyOn($state, 'go');
				spyOn(entitlementTypeApi, 'post').and.returnValue(deferred.promise);
				spyOn(entitlementTypeApi, 'put').and.returnValue(deferred.promise);

				$httpBackend.whenGET(/.*/).respond(200, '');
			});
		});


		// #--------------------------------------# //
		// #----- Service Unit Test (referenceDataAbsenceReasonSvc) -----# //

		// jasmine tests for service functions
		it('should have a ready property that is a promise', function () {
			expect(service.ready == null).toBe(false);
			expect(typeof service.ready.then).toBe('function');
		});

		// jasmine tests for service functions
    it('configuration template must be an object with template configs', function () {
			expect(service.tmplConfig == null).toBe(false);
			expect(typeof service.tmplConfig).toBe('object');
      expect(Object.keys(service.tmplConfig).length).toEqual(8);
      expect(Object.keys(service.tmplConfig)[0]).toMatch('nameCol');
      expect(Object.keys(service.tmplConfig)[1]).toMatch('publicCol');
      expect(Object.keys(service.tmplConfig)[2]).toMatch('needApprovalCol');
      expect(Object.keys(service.tmplConfig)[3]).toMatch('holdUntilApprovedCol');
      expect(Object.keys(service.tmplConfig)[4]).toMatch('enforceBalancesCol');
      expect(Object.keys(service.tmplConfig)[5]).toMatch('requireNotesCol');
      expect(Object.keys(service.tmplConfig)[6]).toMatch('institutionCol');
      expect(Object.keys(service.tmplConfig)[7]).toMatch('footerTemplate');
      Object.keys(service.tmplConfig).forEach(function(key){
        	expect(typeof service.tmplConfig[key]).toBe('function');
      });
		});

    // jasmine tests for service functions
    it('verifying the nameCol Template', function () {
			// Arrange
			var strings = {
        Cancel: 'Cancel'
      };
      var nameColTmpl = '<div ng-class="{ \'selected\' : row.isSelected }">' +
					'<span ng-if="row.isBucket" class="toggle" ng-click="parent.route.go.toggle(row)">' +
					'<i class="fa" ng-class="{\'fa-folder-open\': row.isExpanded, \'fa-folder\': !row.isExpanded}"></i>'+
					'</span>' +
					'<div class="view-only" ng-if="row.id <= 0">' +
					'<span ng-show="row.name.length === 0">{{ row.placeHolderName }}</span>'+
					'<span ng-show="row.name.length > 0">{{ row.name }}</span>'+
					'</div>' +
					'<a ng-if="row.id > 0" href="/reference-data/absence-reasons/{{ row.id }}"><span class="ref-name">{{ row.name }}</span></a>' +
					'<span class="cancel" ng-click="parent.route.go.back(row)">'+ strings['Cancel'] +'</span>' +
					'</div>';
			// Act
      var nameColConfig = service.tmplConfig.nameCol();

			// Assert
      expect(typeof nameColConfig).toBe('object');
      expect(nameColConfig.key).toMatch('name');
      expect(nameColConfig.width).toMatch('7/24');
      expect(nameColConfig.sortable).toBe(false);
      expect(nameColConfig.name).toMatch('AbsenceReason.Column.Text.Name');
      expect(nameColConfig.template).toEqual(nameColTmpl);
    });

    // jasmine tests for service functions
    it('verifying the publicCol Template', function () {
      // replace below with your real test
      var publicColTmpl = '<div class="detail-cell" ng-if="row.settings.isPublic!== null"><i class="fa" ng-class="{\'fa-check\': row.settings.isPublic, \'fa-times\': !row.settings.isPublic}"></i></div>';
      var publicColConfig = service.tmplConfig.publicCol();
      expect(typeof publicColConfig).toBe('object');
      expect(publicColConfig.key).toMatch('isPublic');
      expect(publicColConfig.width).toMatch('2/24');
      expect(publicColConfig.sortable).toBe(false);
      expect(publicColConfig.name).toMatch('AbsenceReason.Column.Text.PublicToEmployee');
      expect(publicColConfig.template).toEqual(publicColTmpl);
    });


    // jasmine tests for service functions
    it('verifying the needApprovalCol Template', function () {
			// Arrange
			var needApprovalColTmpl = '<div class="detail-cell" ng-if="row.settings.needApproval!== null"><i class="fa" ng-class="{\'fa-check\': row.settings.needApproval, \'fa-times\': !row.settings.needApproval}"></i></div>';

			// Act
			var needApprovalColConfig = service.tmplConfig.needApprovalCol();

			// Assert
			expect(typeof needApprovalColConfig).toBe('object');
      expect(needApprovalColConfig.key).toMatch('needApproval');
      expect(needApprovalColConfig.width).toMatch('2/24');
      expect(needApprovalColConfig.sortable).toBe(false);
      expect(needApprovalColConfig.name).toMatch('AbsenceReason.Column.Text.NeedsApproval');
      expect(needApprovalColConfig.template).toEqual(needApprovalColTmpl);
    });

    // jasmine tests for service functions
    it('verifying the holdUntilApprovedCol Template', function () {
      // Arrange
      var holdUntilApprovedColTmpl = '<div class="detail-cell" ng-if="row.settings.holdUntilApproved!== null"><i class="fa" ng-class="{\'fa-check\': row.settings.holdUntilApproved, \'fa-times\': !row.settings.holdUntilApproved}"></i></div>';

			// Act
			var holdUntilApprovedColConfig = service.tmplConfig.holdUntilApprovedCol();

			// Assert
			expect(typeof holdUntilApprovedColConfig).toBe('object');
      expect(holdUntilApprovedColConfig.key).toMatch('holdUntilApproved');
      expect(holdUntilApprovedColConfig.width).toMatch('2/24');
      expect(holdUntilApprovedColConfig.sortable).toBe(false);
      expect(holdUntilApprovedColConfig.name).toMatch('AbsenceReason.Column.Text.HoldUntilApproved');
      expect(holdUntilApprovedColConfig.template).toEqual(holdUntilApprovedColTmpl);
    });


    // jasmine tests for service functions
    it('verifying the enforceBalancesCol Template', function () {
			//Arrange
			var enforceBalancesColTmpl = '<div class="detail-cell" ng-if="row.settings.enforceBalances!== null"><i class="fa" ng-class="{\'fa-check\': row.settings.enforceBalances, \'fa-times\': !row.settings.enforceBalances}"></i></div>';

			// Act
			var enforceBalancesColConfig = service.tmplConfig.enforceBalancesCol();

			// Assert
			expect(typeof enforceBalancesColConfig).toBe('object');
      expect(enforceBalancesColConfig.key).toMatch('enforceBalances');
      expect(enforceBalancesColConfig.width).toMatch('2/24');
      expect(enforceBalancesColConfig.sortable).toBe(false);
      expect(enforceBalancesColConfig.name).toMatch('AbsenceReason.Column.Text.EnforceBalances');
      expect(enforceBalancesColConfig.template).toEqual(enforceBalancesColTmpl);
    });


    // jasmine tests for service functions
    it('verifying the requireNotesCol Template', function () {
			// Arrange
			var requireNotesColTmpl = '<div class="detail-cell" ng-if="row.settings.requireNotes!== null"><i class="fa" ng-class="{\'fa-check\': row.settings.requireNotes, \'fa-times\': !row.settings.requireNotes}"></i></div>';

			// Act
			var requireNotesColConfig = service.tmplConfig.requireNotesCol();

			//Assert
			expect(typeof requireNotesColConfig).toBe('object');
      expect(requireNotesColConfig.key).toMatch('requireNotes');
      expect(requireNotesColConfig.width).toMatch('2/24');
      expect(requireNotesColConfig.sortable).toBe(false);
      expect(requireNotesColConfig.name).toMatch('AbsenceReason.Column.Text.RequireNotesToAdmin');
      expect(requireNotesColConfig.template).toEqual(requireNotesColTmpl);
    });


    // jasmine tests for service functions
    it('verifying the institutionCol Template', function () {
      //Arrange
      var institutionColTmpl = '<div title="{{ row.institutionObj.value }}" ng-if="!row.isBucket">{{ row.institutionObj.value }}</div>';

			//Act
			var institutionColConfig = service.tmplConfig.institutionCol();

			//Assert
			expect(typeof institutionColConfig).toBe('object');
      expect(institutionColConfig.key).toMatch('school');
      expect(institutionColConfig.width).toMatch('7/24');
      expect(institutionColConfig.sortable).toBe(false);
      expect(institutionColConfig.name).toMatch('AbsenceReason.Column.Text.School');
      expect(institutionColConfig.template).toEqual(institutionColTmpl);
    });


    // jasmine tests for service functions
    it('setting item to the value object', function () {
			//Arrange
			var item = Object.assign({}, objOnClient);
			//Act
			service.setItem(item);
			//Assert
			expect(typeof service.setItem).toBe('function');
      expect(typeof referenceDataValMock.item).toBe('object');
    });

    // jasmine tests for service functions
    it('get absenceReasons return an array', function () {
      //Arrange
      referenceDataValMock.list = [];
			//Assert
			expect(typeof service.absenceReasons).toBe('function');
      expect(Array.isArray(service.absenceReasons())).toBe(true);
    });

    // jasmine tests for service functions
    it('get data analysis category return an array', function () {
			//Assert
			expect(typeof service.getDataAnalysisCategory).toBe('function');
      expect(Array.isArray(service.getDataAnalysisCategory())).toBe(true);
    });

    // jasmine tests for service functions
    it('get worker types return an array', function () {
      //Assert
      expect(typeof service.getWorkerTypes).toBe('function');
      expect(Array.isArray(service.getWorkerTypes())).toBe(true);
    });

    // jasmine tests for service functions
    it('setupNewAbsenceReason function set item to val that will rendered and item is new and not a bucket', function () {
      //Arrange
      referenceDataValMock.list = [];

			//Act
			service.setupNewAbsenceReason(false,false);
      var item = referenceDataValMock.list[0];

			//Assert
      expect(typeof service.setupNewAbsenceReason).toBe('function');
      expect(typeof referenceDataValMock.item).toBe('object');
      expect(referenceDataValMock.item.id).toEqual(item.id);
      expect(referenceDataValMock.item.name).toEqual(item.name);
      expect(referenceDataValMock.item.placeHolderName).toEqual(item.placeHolderName);
    });

		// jasmine tests for service functions
		it('setupNewAbsenceReason function set item to val that will rendered and item is new and a bucket', function () {
			//Arrange
			referenceDataValMock.list = [];

			//Act
			service.setupNewAbsenceReason(true,false);
			var item = referenceDataValMock.list[0];

			//Assert
			expect(typeof service.setupNewAbsenceReason).toBe('function');
			expect(typeof referenceDataValMock.item).toBe('object');
			expect(referenceDataValMock.item.id).toEqual(item.id);
			expect(referenceDataValMock.item.name).toEqual(item.name);
			expect(referenceDataValMock.item.placeHolderName).toEqual(item.placeHolderName);
		});

		// jasmine tests for service functions
		it('setupNewAbsenceReason function set item to val that will rendered and item is new and not a bucket but item already is set to some existing absence reason', function () {
			//Arrange
			referenceDataValMock.list = [];
			var itemToSet = Object.assign({},objOnClient, { id: 132, name: 'test absence reason' });
			service.setItem(itemToSet);

			//Act
			service.setupNewAbsenceReason(false,false);
			var item = referenceDataValMock.list[0];

			//Assert
			expect(typeof service.setupNewAbsenceReason).toBe('function');
			expect(typeof referenceDataValMock.item).toBe('object');
			expect(referenceDataValMock.item.id).toEqual(item.id);
			expect(referenceDataValMock.item.name).toEqual(item.name);
			expect(referenceDataValMock.item.placeHolderName).toEqual(item.placeHolderName);
		});

		// jasmine tests for service functions
		it('setupNewAbsenceReason function set item to val that will rendered and item is new and a bucket but item already is set to some existing absence reason', function () {
			//Arrange
			referenceDataValMock.list = [];
			var itemToSet = Object.assign({}, objOnClient , { id: 132, name: 'test absence reason' });
			service.setItem(itemToSet);

			//Act
			service.setupNewAbsenceReason(true,false);
			var item = referenceDataValMock.list[0];

			//Assert
			expect(typeof service.setupNewAbsenceReason).toBe('function');
			expect(typeof referenceDataValMock.item).toBe('object');
			expect(referenceDataValMock.item.id).toEqual(item.id);
			expect(referenceDataValMock.item.name).toEqual(item.name);
			expect(referenceDataValMock.item.placeHolderName).toEqual(item.placeHolderName);
		});


		// jasmine tests for service functions
		it('setupNewAbsenceReason function set item to val that will rendered and item is new and a bucket and adding absence reason to the buket', function () {
			//Arrange
			referenceDataValMock.list = [];

			//Act
			//setting up new bucket
			service.setupNewAbsenceReason(true,false);
			//add new child to the new bucket
			service.setupNewAbsenceReason(false,true);
			var item = referenceDataValMock.list[0];

			//Assert
			expect(typeof service.setupNewAbsenceReason).toBe('function');
			expect(typeof referenceDataValMock.item).toBe('object');
			expect(referenceDataValMock.item.id).toEqual(item.id);
			expect(referenceDataValMock.item.name).toEqual(item.name);
			expect(referenceDataValMock.item.placeHolderName).toEqual(item.placeHolderName);
			expect(referenceDataValMock.item.isExpanded).toEqual(true);
			expect(referenceDataValMock.item.children.length).toEqual(1);
			expect(referenceDataValMock.item.children[0].id).toEqual(-1.1);
			expect(referenceDataValMock.item.children[0].parentId).toEqual(-1);

		});

		// jasmine tests for service functions
		it('setupNewAbsenceReason function set item to the val that will rendered and item is new and a bucket and not adding absence reason to the buket', function () {
			//Arrange
			referenceDataValMock.list = [];

			//Act
			//setting up new bucket
			service.setupNewAbsenceReason(true,false);
			//add new child to the new bucket
			service.setupNewAbsenceReason(false,false);
			var item = referenceDataValMock.list[0];

			//Assert
			expect(typeof service.setupNewAbsenceReason).toBe('function');
			expect(typeof referenceDataValMock.item).toBe('object');
			expect(referenceDataValMock.item.id).toEqual(item.id);
			expect(referenceDataValMock.item.name).toEqual(item.name);
			expect(referenceDataValMock.item.placeHolderName).toEqual(item.placeHolderName);
			expect(referenceDataValMock.item.isExpanded).toEqual(false);
			expect(referenceDataValMock.item.children.length).toEqual(0);

		});


		//jasmine tests for service functions
		it('goBack function take user to the reference data absence reason page if item is new bucket', function () {
			//Arrange
			var item = Object.assign({}, objOnClient , { isBucket: true });

			//Act
			service.goBack(item);

			//Assert
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason');
		});

		//jasmine tests for service functions
		it('goBack function take user to the reference data absence reason page if item child of new bucket', function () {
			//Arrange
			referenceDataValMock.list = [];

			//setting up new bucket
			service.setupNewAbsenceReason(true,false);
			//add new child to the new bucket
			service.setupNewAbsenceReason(false,true);

			var item = referenceDataValMock.item.children[0];

			//Act
			service.goBack(item);

			//Assert
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason.newBucket', { addChild: false });
		});

		//jasmine tests for service functions
		it('goBack function take user to the reference data absence reason page if item child of new bucket is null', function () {
			//Arrange
			referenceDataValMock.list = [];
			//setting up new bucket
			service.setupNewAbsenceReason(false,false);

			referenceDataValMock.item.children = null;

			var item = referenceDataValMock.item;

			//Act
			service.goBack(item);

			//Assert
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason' );
		});

		//jasmine tests for service functions
		it('goBack function take user to the reference data absence reason page if item not new', function () {
			//Arrange
			var item = Object.assign({}, objOnClient ,{ id:123, isBucket: true });

			//Act
			service.goBack(item);

			//Assert
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason');
		});

		//jasmine tests for service functions
		it('goBack function take user to the reference data absence reason page if item not a bucket', function () {
			//Arrange
			var item = Object.assign({}, objOnClient , { id:123, isBucket: false });

			//Act
			service.goBack(item);

			//Assert
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason');
		});

		//jasmine tests for service functions
		it('clearSelection will mark all the absence reasons and buckets as not selected', function () {
			//Arrange
			var childItem = Object.assign({}, objOnClient , { id: 2, isSelected: true });
			var item1 = Object.assign({}, objOnClient , { id: 0, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: 1, isSelected: false, isBucket: true ,children: [ childItem ] });

			referenceDataValMock.list = [item1, item2];

			//Act
			service.clearSelection();

			//Assert
			expect(referenceDataValMock.list[0].isSelected).toBe(false);
			expect(referenceDataValMock.list[1].children[0].isSelected).toBe(false);
		});

		//jasmine tests for service functions
		it('removeReasonFromList, if item is null or undefined then nothing will be removed from the list', function () {
			// Arrange
			var childItem = Object.assign({}, objOnClient , { id: 2, isSelected: false });
			var item1 = Object.assign({}, objOnClient , { id: 0, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: 1, isSelected: false, isBucket: true ,children: [ childItem ] });
			referenceDataValMock.list = [item1, item2];

			//Act
			service.removeReasonFromList(null);

			//Assert
			expect(referenceDataValMock.list.length).toEqual(2);
		});

		//jasmine tests for service functions
		it('removeReasonFromList, if item is in the DB we will not remove from list unless user is deleting the absence reason.', function () {
			// Arrange
			var childItem = Object.assign({}, objOnClient , { id: 2, isSelected: false }) ;
			var item1 = Object.assign({}, objOnClient , { id: 0, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: 1, isSelected: false, isBucket: true ,children: [ childItem ] });
			referenceDataValMock.list = [item1, item2];

			//Act
			service.removeReasonFromList(childItem);

			//Assert
			expect(referenceDataValMock.list.length).toEqual(2);
		});


		//jasmine tests for service functions
		it('removeReasonFromList, remove the new absence reason from the list', function () {
			//Arrange
			var childItem = Object.assign({}, objOnClient , { id: 2, isSelected: false }) ;
			var item1 = Object.assign({}, objOnClient , { id: 0, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: 1, isSelected: false, isBucket: true ,children: [ childItem ] });
			referenceDataValMock.list = [item1, item2];

			var item = referenceDataValMock.list[0];
			service.setItem(item);

			//Act
			service.removeReasonFromList(item);

			//Assert
			expect(referenceDataValMock.list.filter(function(x){ x.id === 0; })).toEqual([]);
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(typeof referenceDataValMock.item).toBe('undefined');
		});

		//jasmine tests for service functions
		it('removeReasonFromList, remove the new bucket from the list', function () {
			//Arrange
			var childItem = Object.assign({}, objOnClient , { id: -1.1, isSelected: false, parentId: -1 }) ;
			var item1 = Object.assign({}, objOnClient , { id: 1, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: -1, isSelected: false, isBucket: true ,children: [ childItem ] });
			referenceDataValMock.list = [item1, item2];

			var item = referenceDataValMock.list[1];
			service.setItem(item);

			//Act
			service.removeReasonFromList(item);

			//Assert
			expect(referenceDataValMock.list.filter(function(x){ x.id === 1; })).toEqual([]);
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(typeof referenceDataValMock.item).toBe('undefined');
		});


		//jasmine tests for service functions
		it('removeReasonFromList, remove the new child from the new bucket ', function () {
			//Arrange
			var childItem = Object.assign({}, objOnClient , { id: -1.1, isSelected: false, parentId: -1 }) ;
			var item1 = Object.assign({}, objOnClient , { id: 1, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: -1, isSelected: false, isBucket: true ,children: [ childItem ] });
			referenceDataValMock.list = [item1, item2];


			var item = referenceDataValMock.list[1].children[0];
			service.setItem(item);

			//Act
			service.removeReasonFromList(item);

			//Assert
			expect(referenceDataValMock.list.length).toEqual(2);
			expect(typeof referenceDataValMock.item).toBe('object');
			expect(referenceDataValMock.item.id).toEqual(-1);
		});

		//jasmine tests for service functions
		it('removeReasonFromList, remove the new child from the old bucket ', function () {
			//Arrange
			var childItem = Object.assign({}, objOnClient , { id: -1, isSelected: false, parentId: 2 }) ;
			var item1 = Object.assign({}, objOnClient , { id: 1, isSelected: true });
			var item2 = Object.assign({}, objOnClient , { id: 2, isSelected: false, isBucket: true ,children: [ childItem ] });
			referenceDataValMock.list = [item1, item2];

			var item = referenceDataValMock.list[1].children[0];
			service.setItem(item);

			//Act
			service.removeReasonFromList(item);

			//Assert
			expect(referenceDataValMock.list.length).toEqual(2);
			expect(typeof referenceDataValMock.item).toBe('undefined');
		});


		//jasmine tests for service functions
		it('save, calling save to save new absence reason and adding it to the list.', function () {
			// Arrange
			referenceDataValMock.list = [];
			var itemFromServer = Object.assign({}, objFromServer, { id: 1, description:'New absence reason',$messages: ['Message from Server'] });
			service.setupNewAbsenceReason(false);
			var item = referenceDataValMock.list[0];

			//Act
			service.save(item);
			deferred.resolve(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(typeof referenceDataValMock.item).toBe('undefined');
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason');
		});

		//jasmine tests for service functions
		it('save, calling save to save new bucket absence reason and adding it to the list.', function () {
			// Arrange
			referenceDataValMock.list = [];
			var childItemFromServer = Object.assign({}, objFromServer, {
				id: 2,
				description: 'New Child',
				isBucket: false,
				parentId: 1,
				parent: { id: 1 }
			});
			var itemFromServer = Object.assign({}, objFromServer, {
				id: 1,
				description:'New Bucket absence reason',
				isBucket: true,
				children: [ childItemFromServer ],
				$messages: ['Message from Server']
			});
			//setting up new bucket
			service.setupNewAbsenceReason(true,false);
			//add new child to the new bucket
			service.setupNewAbsenceReason(false,true);
			var item = referenceDataValMock.list[0];

			//Act
			service.save(item);
			deferred.resolve(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(typeof referenceDataValMock.item).toBe('undefined');
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason');
		});


		//jasmine tests for service functions
		it('save, calling save to save existing absence reason and update the list.', function () {
			// Arrange
			var item = Object.assign({} , objOnClient, { id: 12, name: 'Old Name', isBucket: false });
			referenceDataValMock.list = [ item ];
			var itemFromServer = Object.assign({}, objFromServer, {
				id: 12,
				description:'Updated Name',
				isBucket: false,
				$messages: ['Message from Server']
			});
			var updatedItem = Object.assign({}, item, { name: 'Updated Name' });
			service.setItem(updatedItem);

			//Act
			service.save(updatedItem);
			deferred.resolve(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(referenceDataValMock.list[0].name).toBe('Updated Name');
			expect(typeof referenceDataValMock.item).not.toBe('undefined');
		});


		//jasmine tests for service functions
		it('save, calling save to save existing bucket absence reason and update the list.', function () {
			// Arrange
			var bucketItem = Object.assign({}, objOnClient, { id:15, name: 'Old Child name' , parentId: 12} );
			var item = Object.assign({} , objOnClient, { id: 12, name: 'Old Bucket Name', isBucket: true, children: [ bucketItem ] });
			referenceDataValMock.list = [ item ];
			var itemFromServer = Object.assign({}, objFromServer, {
				id: 12,
				description:'Updated Bucket Name',
				isBucket: false,
				$messages: ['Message from Server']
			});
			var updatedItem = Object.assign({}, item, { name: 'Updated Bucket Name' });
			service.setItem(updatedItem);

			//Act
			service.save(updatedItem);
			deferred.resolve(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(referenceDataValMock.list[0].name).toBe('Updated Bucket Name');
			expect(typeof referenceDataValMock.item).not.toBe('undefined');
		});


		//jasmine tests for service functions
		it('save, calling save to save absecne reason in the existing bucket', function () {
			// Arrange
			var bucketItem = Object.assign({}, objOnClient, { id: -1.1, name: 'New Child name' , parentId: 12} );
			var item = Object.assign({} , objOnClient, { id: 12, name: 'Old Bucket Name', isBucket: true, children: [ bucketItem ] });
			referenceDataValMock.list = [ item ];
			var itemFromServer = Object.assign({}, objFromServer, {
				id: 13,
				description:'New Child name',
				isBucket: false,
				$messages: ['Message from Server'],
				parentId: 12,
				parent: { id: 12 }
			});

			service.setItem(bucketItem);

			//Act
			service.save(bucketItem);
			deferred.resolve(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(referenceDataValMock.list[0].children[0].name).toEqual('New Child name');
			expect(referenceDataValMock.list[0].children[0].id).toEqual(13);
			expect(typeof referenceDataValMock.item).toBe('undefined');
			expect($state.go).toHaveBeenCalledWith('base.refDataabsenceReason');
		});


		//jasmine tests for service functions
		it('save, calling save to update existing absecne reason in the existing bucket', function () {
			// Arrange
			var bucketItem = Object.assign({}, objOnClient, { id: 13, name: 'Child name' , parentId: 12} );
			var item = Object.assign({} , objOnClient, { id: 12, name: 'Old Bucket Name', isBucket: true, children: [ bucketItem ] });
			referenceDataValMock.list = [ item ];
			var itemFromServer = Object.assign({}, objFromServer, {
				id: 13,
				description:'Updated Child name',
				isBucket: false,
				$messages: ['Message from Server'],
				parentId: 12,
				parent: { id: 12 }
			});

			service.setItem(bucketItem);

			//Act
			service.save(bucketItem);
			deferred.resolve(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(referenceDataValMock.list[0].children[0].name).toEqual('Updated Child name');
			expect(referenceDataValMock.list[0].children[0].id).toEqual(13);
			expect(typeof referenceDataValMock.item).not.toBe('undefined');
		});

		//jasmine tests for service functions
		it('save, calling save to absecne reason but error occured at the server', function () {
			// Arrange
			var item = Object.assign({} , objOnClient, { name: 'New Absence Reason Name', isBucket: false });
			referenceDataValMock.list = [ item ];
			var itemFromServer = Object.assign({}, objFromServer, {
				$messages: ['Message from Server'],
				$status: 400
			});

			service.setItem(item);

			//Act
			service.save(item);
			deferred.reject(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(typeof referenceDataValMock.item).not.toBe('undefined');
			expect(referenceDataValMock.item.id).toEqual(-1);
			expect(referenceDataValMock.item.name).toEqual('New Absence Reason Name');
		});

		//jasmine tests for service functions
		it('save, calling save to absecne reason but error occured at the server showing the warning', function () {
			// Arrange
			var item = Object.assign({} , objOnClient, { id:12, name: 'Updated Absence Reason Name', isBucket: false });
			referenceDataValMock.list = [ item ];
			var itemFromServer = Object.assign({}, objFromServer, {
				$messages: ['Message from Server'],
				$status: 409,
				id: 12,
				description: 'New Updated Absence Reason Name'
			});

			service.setItem(item);

			//Act
			service.save(item);
			deferred.reject(itemFromServer);
			$rootScope.$apply();


			//Assert
			expect(referenceDataValMock.list.length).toEqual(1);
			expect(typeof referenceDataValMock.item).not.toBe('undefined');
			expect(referenceDataValMock.list[0].id).toEqual(12);
			expect(referenceDataValMock.list[0].name).toEqual('New Updated Absence Reason Name');
			expect(referenceDataValMock.item.id).toEqual(12);
			expect(referenceDataValMock.item.name).toEqual('New Updated Absence Reason Name');
		});



		//jasmine tests for service functions
		it('processItem, converting the object from server to the object on the client side, simple absence reason', function () {
			// Arrange
			var item = Object.assign({} ,
									objFromServer,
									{
										id:12,
										description: 'Absence Reason Name',
										isBucket: false,
										parentId: null,
										isPublic: false,
										needsApproval: false,
										holdUntilApproved: false,
										enforceEntitlementBalances: false,
										notesToAdminRequired: false,
										useMinUsageMinutes: false,
										minUsageMinutes: 60,
										useMinBalanceMinutes: false,
										minBalanceMinutes: 60,
										useMaxUsagePerYearMinutes: false,
										maxUsagePerYearMinutes: 60
									});

			//Act
			var processedItem = service.processItem(item);

			//Assert
			expect(typeof processedItem).toBe('object');
			expect(processedItem.name).toEqual(item.description);
			expect(processedItem.showInstitution).toBe(true);
			expect(typeof processedItem.settings).toBe('object');
			expect(processedItem.settings.isPublic).toBe(false);
			expect(processedItem.settings.needApproval).toBe(false);
			expect(processedItem.settings.holdUntilApproved).toBe(false);
			expect(processedItem.settings.enforceBalances).toBe(false);
			expect(processedItem.settings.requireNotes).toBe(false);
			expect(typeof processedItem.timeUsage).toBe('object');
			expect(Object.keys(processedItem.timeUsage).length).toBe(3);
			Object.keys(processedItem.timeUsage).forEach(function(key){
				expect(typeof processedItem.timeUsage[key]).toBe('object');
			});
			expect(typeof processedItem.timeUsage.minimumUsage).toBe('object');
			expect(Object.keys(processedItem.timeUsage.minimumUsage).length).toBe(2);
			expect(processedItem.timeUsage.minimumUsage.allowed).toBe(false);
			expect(processedItem.timeUsage.minimumUsage.value).toBe(1);
			expect(typeof processedItem.timeUsage.minimumBalance).toBe('object');
			expect(Object.keys(processedItem.timeUsage.minimumBalance).length).toBe(2);
			expect(processedItem.timeUsage.minimumBalance.allowed).toBe(false);
			expect(processedItem.timeUsage.minimumBalance.value).toBe(1);
			expect(typeof processedItem.timeUsage.maxYearlyUsage).toBe('object');
			expect(Object.keys(processedItem.timeUsage.maxYearlyUsage).length).toBe(2);
			expect(processedItem.timeUsage.maxYearlyUsage.allowed).toBe(false);
			expect(processedItem.timeUsage.maxYearlyUsage.value).toBe(1);
		});



		//jasmine tests for service functions
		it('processItem, converting the object from server to the object on the client side, bucket absence reason', function () {
			// Arrange

			var childItem = Object.assign({},
											objFromServer,
											{
												id: 13,
												description: 'Child Absence reason',
												isBucket: false,
												parentId: 12,
												parent: { id: 12 },
												isPublic: false,
												needsApproval: false,
												holdUntilApproved: false,
												enforceEntitlementBalances: false,
												notesToAdminRequired: false,
												useMinUsageMinutes: false,
												minUsageMinutes: 60,
												useMinBalanceMinutes: false,
												minBalanceMinutes: 60,
												useMaxUsagePerYearMinutes: false,
												maxUsagePerYearMinutes: 60
											});
			var item = Object.assign({} ,
									objFromServer,
									{
										id:12,
										description: 'Absence Reason Name',
										isBucket: true,
										parentId: null,
										isPublic: false,
										needsApproval: false,
										holdUntilApproved: false,
										enforceEntitlementBalances: false,
										notesToAdminRequired: false,
										useMinUsageMinutes: false,
										minUsageMinutes: 60,
										useMinBalanceMinutes: false,
										minBalanceMinutes: 60,
										useMaxUsagePerYearMinutes: false,
										maxUsagePerYearMinutes: 60,
										children:[ childItem ]
									});

			//Act
			var processedItem = service.processItem(item);

			//Assert
			expect(typeof processedItem).toBe('object');
			expect(processedItem.name).toEqual(item.description);
			expect(processedItem.isExpanded).toBe(false);
			expect(processedItem.isBucket).toBe(true);
			expect(processedItem.showInstitution).toBe(true);
			expect(typeof processedItem.settings).toBe('object');
			expect(processedItem.settings.isPublic).toBe(null);
			expect(processedItem.settings.needApproval).toBe(null);
			expect(processedItem.settings.holdUntilApproved).toBe(null);
			expect(processedItem.settings.enforceBalances).toBe(false);
			expect(processedItem.settings.requireNotes).toBe(null);
			expect(typeof processedItem.timeUsage).toBe('object');
			expect(Object.keys(processedItem.timeUsage).length).toBe(3);
			Object.keys(processedItem.timeUsage).forEach(function(key){
				expect(typeof processedItem.timeUsage[key]).toBe('object');
			});
			expect(typeof processedItem.timeUsage.minimumUsage).toBe('object');
			expect(Object.keys(processedItem.timeUsage.minimumUsage).length).toBe(2);
			expect(processedItem.timeUsage.minimumUsage.allowed).toBe(false);
			expect(processedItem.timeUsage.minimumUsage.value).toBe(1);
			expect(typeof processedItem.timeUsage.minimumBalance).toBe('object');
			expect(Object.keys(processedItem.timeUsage.minimumBalance).length).toBe(2);
			expect(processedItem.timeUsage.minimumBalance.allowed).toBe(false);
			expect(processedItem.timeUsage.minimumBalance.value).toBe(1);
			expect(typeof processedItem.timeUsage.maxYearlyUsage).toBe('object');
			expect(Object.keys(processedItem.timeUsage.maxYearlyUsage).length).toBe(2);
			expect(processedItem.timeUsage.maxYearlyUsage.allowed).toBe(false);
			expect(processedItem.timeUsage.maxYearlyUsage.value).toBe(1);

			expect(Array.isArray(processedItem.children)).toBe(true);
			expect(processedItem.children[0].parentId).toBe(12);
			expect(processedItem.children[0].settings.isPublic).toBe(false);
			expect(processedItem.children[0].settings.needApproval).toBe(false);
			expect(processedItem.children[0].settings.holdUntilApproved).toBe(false);
			expect(processedItem.children[0].settings.enforceBalances).toBe(false);
			expect(processedItem.children[0].settings.requireNotes).toBe(false);
		});






		// #--- END Service Unit Test (referenceDataAbsenceReasonSvc) ---# //
		// #--------------------------------------# //
	});
}());
