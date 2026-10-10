  const fixtureFactory = require('../../helpers/fixtureHelper');
  const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');
//Remove the list below after build is up to par
  const WorkerList = require('../../fixtures/AbsCreateEmpSelect/WorkerList');
  const WorkerListSearch = require('../../fixtures/AbsCreateEmpSelect/WorkerListSearch');
  const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
  const PayCodes = require('../../fixtures/RptFilterData/PayCodes');
  const AccountingCodes = require('../../fixtures/RptFilterData/AccountingCodes');
  const AltAccountingCodeList = require('../../fixtures/AbsCreateDetails/AccountingCodes');
  const AbsenceReasonsList = require('../../fixtures/AbsCreateDetails/AbsenceReasonsList');
  const AbsenceRequestWorkerData = require('../../fixtures/AbsCreateDetails/AbsenceRequestWorkerData');
  const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');
  const NewAbsSummary = require('../../fixtures/AbsCreateDetails/NewAbsSummary');
  const AbsCreateDone = require('../../fixtures/AbsCreateDetails/AbsCreateDone');
  const Approvers = require('../../fixtures/AbsView/Approvers');

  let fixtures;
  let absCreateDetailsFixtures;
  describe('OU-Absence Create Done UI tests', function (){
    const mockWorkerRequest = (query = '', response) => cy.route({
      method: 'GET',
      url: `/api/v1.0/workers?fields=(id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)&includeVacancies=false&includeWorkers=true&lastName=${query}&maxRecords=100&offSet=0`,
      response
    });
    
    before(() => {
      cy.server();
      fixtures = fixtureFactory(cy);
      fixtures.passthroughOrganization();
      fixtures.institutions();
      fixtures.orgUser();
      fixtures.products();
      fixtures.workerTypes();
      fixtures.notifications();

      mockWorkerRequest('', WorkerList());
      //Bring these calls back once the build process is up to par.
      // absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      // absCreateDetailsFixtures.mockDirAbsCreateDetails();

      absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      absCreateDetailsFixtures.mockAccountingCodeCall();

      cy.visit('absences/create-absence');
    });

      it('Validate Correct Columns are Visible', function() {
        cy.get('.top > .left-section').contains('Step 1: Select Employee');
        cy.get('[ng-show="isLoaded && showHeader"] > .name-th').contains('Name');
      });
    
      it('Selecting an employee', function() {
        const searchTerm = 'Alexa';
        // mock the filtered request with the subset result list
        mockWorkerRequest(searchTerm, WorkerListSearch());
        cy.get('.fl-input').focus();
        cy.get('.fl-input').type(searchTerm);
        cy.get('input[value=4628277]').click();
        cy.get('.group-row').contains('A');
      });
       
      it('Proceeding to select absence details', function () {
        cy.server();
        cy.route({
          method: 'GET',
          url: '/api/v1.0/budgetcodes',
          response: BudgetCodes()
        }).as('getBudgetCodes');
  
        cy.route({
          method: 'GET',
          url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=147026&isVacancyType=false&workId=4628277',
          response: AbsenceReasonsList()
        }).as('getAbsenceReasonList');
    
        cy.route({
          method: 'GET',
          url: '/api/v1.0/paycodes',
          response: PayCodes()
        }).as('getPayCodes');
  
        cy.route({
          method: 'GET',
          url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
          response: AltAccountingCodeList()
        }).as('getAltAccountCodeList');
      
        cy.route({
          method: 'GET',
          url: '/api/v1.0/AbsenceRequests/Context?workerid=4628277',
          response: AbsenceRequestWorkerData()
        }).as('getAbsenceRequestWorkerData');
    
        cy.route({
          method: 'GET',
          url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
          response: RelatedFiles()
        }).as('getRelatedFiles');

        //Bring the calls below back once the build process is up to par.
        //absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
        //absCreateDetailsFixtures.mockAbsCreateDetails();
  
        cy.get('.top > .right-section > .button-section > .fl-button').as('topReviewAndConfirmButton');
        cy.get('@topReviewAndConfirmButton').should('be.visible');
        cy.get('@topReviewAndConfirmButton').click();
        cy.wait(['@getBudgetCodes','@getAbsenceReasonList','@getPayCodes','@getAltAccountCodeList','@getAbsenceRequestWorkerData','@getRelatedFiles'])
      });
      //Bring the calls below back once the build process is up to par.

    //   cy.route({
    //     method: 'GET',
    //     url: '/api/v1.0/workers/4628277?fields=(isVacancy,id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)',
    //     response:{"data":[{"isVacancy":false,"id":4628277,"firstName":"Joshua","lastName":"Alexander","identity":"MV124321","phone":"(210) 212-2122","title":null,"institution":[{"id":147026}],"accountingCode":null,"budgetCode":null,"workerType":{"title":"Teacher"},"needFulfilment":2}],"messages":[],"success":true,"modelState":{}}
    //   }).as('getWorker');
      
    //     cy.route({
    //     method: 'GET',
    //     url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
    //     response: AccountingCodes()
    //   }).as('getAccountingCodes');
  
    //   cy.route({
    //     method: 'GET',
    //     url: '/api/v1.0/budgetcodes',
    //     response: BudgetCodes()
    //   }).as('getBudgetCodes');
  
    //   cy.route({
    //     method: 'GET',
    //     url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=147026&isVacancyType=false&workId=4628277',
    //     response: AbsenceReasonsList()
    //   }).as('getAbsenceReasonsList');
  
    //   cy.route({
    //     method: 'GET',
    //     url: '/api/v1.0/paycodes',
    //     response: PayCodes()
    //   }).as('getPayCodes');
    
    //   cy.route({
    //     method: 'GET',
    //     url: '/api/v1.0/AbsenceRequests/Context?workerid=4628277',
    //     response: AbsenceRequestWorkerData()
    //   }).as('getAbsenceRequestWorkerData');
  
    //   cy.route({
    //     method: 'GET',
    //     url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
    //     response: RelatedFiles()
    //   }).as('getRelatedFiles');

    //     cy.visit('/absences/create-absence-details?workerId=4628277');
    //     cy.url().should('contain','/create-absence-details?workerId=4628277');
    //     cy.wait(['@getWorker','@getAccountingCodes','@getBudgetCodes','@getAbsenceReasonsList','@getPayCodes','@getAbsenceRequestWorkerData','@getRelatedFiles']);
    // });

    it('Verifying page labels and data', function () {
      // cy.get('.top > .right-section > .button-section > .fl-button').as('topReviewAndConfirmButton')
      // cy.get('@topReviewAndConfirmButton').should('be.visible')
      // cy.get('@topReviewAndConfirmButton').click()
      cy.get('.top > .left-section > :nth-child(1)').as('empNameLabel');
      cy.get('@empNameLabel').contains('Alexander, Joshua')
        .and('be.visible');
    }); 

    it('Verify the school name is a link', function (){
      cy.get('.cmpt-template-institution-link').contains('MillVill Valley HS').should('have.attr', 'href', '/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id=147026')
    });

    it('Selecting Full day absence type', function () {
      cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(1) > div > div > div.cmpt-ui-dropdown.ng-isolate-scope > select').as('shiftSelector')
      cy.get('@shiftSelector').select('Full Day');
    });

    it('Selecting the absence reason', function(){
      cy.get('.reasons > .element > .cmpt-ui-dropdown > .ng-empty').as('absenceReasonSelector')
      cy.get('.reasons > label').contains('Absence Reason')
        .and('be.visible');
      cy.get('@absenceReasonSelector').select('Personal Day');
    });

    it('Populating the date selector', function (){
      cy.server();
      absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      absCreateDetailsFixtures.mockAbsRelatedFiles();
      cy.get(':nth-child(1) > .cmpt-ui-date-selector-v2 > .input > .ui-datepicker-trigger').click()
      cy.get('#ui-datepicker-div .ui-datepicker-calendar tbody .ui-datepicker-days-cell-over .ui-state-default').click()
      cy.get('#dp1517942897121').should('not.be.empty');
    });
    
    it('Filling in Time Absent', function(){
      cy.get('.time-absent > .element > .cmpt-ui-textbox > .fl-input').as('timeAbsentInput')
      cy.get('@timeAbsentInput').focus();
      cy.get('@timeAbsentInput').type('00:30{enter}');
    });

    it('Filling in Non-Pay Data', function(){
      cy.get('.non-pay > .element > .cmpt-ui-textbox > .fl-input').as('nonPayTime');
      cy.get('@nonPayTime').focus();
      cy.get('@nonPayTime').type('{selectall}{backspace}00:30{enter}');
    });

    it('Selecting Budget Code information', function(){
      cy.get('.budget-codes > .element > .cmpt-ui-dropdown > .ng-empty').as('budgetCodeSelector')
      cy.get('@budgetCodeSelector').select('Certified Teacher');
    });

    it('Selecting the Account Code information', function(){
      cy.get('.accounting-codes > .element > .cmpt-ui-dropdown > .ng-empty').as('accountCodeSelector')
      cy.get('@accountCodeSelector').select('Custom');
      cy.get('.element > .ng-pristine').type('12345');//entering in a custom accounting code
    });

    it('Selecting not to hold the absence', function(){
      cy.get('.hold-until > .cmpt-ui-dropdown > .ng-not-empty').as('holdUntilSelector');
      cy.get('@holdUntilSelector').select('No Hold');
      cy.get('@holdUntilSelector').contains('No Hold');
    });

    it('Populating the Notes to Admin field', function(){
      cy.get('#admin-notes > :nth-child(2) > .ng-pristine').type('These are notes to the admin.');
    });

    it('Populating the Notes to Substitute field', function (){
      cy.get('.substitute-notes > :nth-child(2) > .ng-pristine').type('These are notes to the substitute');
    });

    it('Populating the Admin Only Notes field', function (){
      cy.get('.admin-only-notes > :nth-child(2) > .ng-pristine').type('These are notes that only the admin can see.');
    });

    it('Proceeding to the review page', function() {
      cy.server();
      absCreateDetailsFixtures.mockWorkerDataAndRelatedFilesCalls(); 
      cy.get('.bottom > .right-section > .button-section > .fl-button').click();
    });

    it('Checking page headers for the correct data', function (){
      cy.get('.top').as('topHeader');
      cy.get('@topHeader').contains('Step 3: Review and Confirm details for');
      cy.get('@topHeader').contains('Alexander, Joshua');
    });

    it('Proceeding to the next confirmation/done page', function(){
      cy.server();
      //absCreateDetailsFixtures.mockAbsDoneCall();
      cy.route({
        method: 'POST',
        url: 'api/v1.0/absencerequests?numVacancies=1&reconcileMode=false',
        response: AbsCreateDone()
        }).as('getAbsCreateDone');
    
        cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224979559?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
        response: NewAbsSummary()
        }).as('getNewAbsSummary');
    
        cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224979559/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
        response: {"data":[],"messages":[],"success":true,"modelState":{}} ,
        }).as('getAbsenceData');
    
        cy.route({
        method: 'GET',
        url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
        response: RelatedFiles()
        }).as('getRelatedFiles');
    
        cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224979559/Files',
        response: {"data":[],"messages":[],"success":true,"modelState":{}} 
        }).as('getAbsenceFiles');
  
        cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224979559/Approvers',
        response: Approvers()
        }).as('getApprovers');

      cy.get('.top > .right-section > .button-section > .fl-positive').click();
      cy.wait(['@getAbsCreateDone','@getNewAbsSummary','@getAbsenceData','@getRelatedFiles','@getAbsenceFiles','@getApprovers'])
    });

    it('Checking top message section', function(){
      cy.get('.message').contains('Your Absence has been scheduled.')
        .and('be.visible');
      cy.get('.sub-message').contains('Your confirmation number is')
        .and('be.visible');
      cy.get('.sub-message').contains('224979559')
        .and('be.visible');
    });

    it('Checking absence summary header', function(){
      cy.get('.cmpt-absr-done-top-bar').as('summaryHeader');
      cy.get('@summaryHeader').contains('Absence Summary for')
        .and('be.visible');
      cy.get('@summaryHeader').contains('Alexander, Joshua')
        .and('be.visible');
      cy.get('@summaryHeader').contains('Print this Page')
        .and('be.visible');
      cy.get('.-u-5-24 > .fa').should('be.visible');
    });

    it('Checking sub required state', function (){
      cy.get('.summary > :nth-child(1)').contains('Substitute Required')
        .and('be.visible');
      cy.get('.summary > :nth-child(1)').contains('Yes')
        .and('be.visible');
    });

    it('Checking Notes to administrator data', function(){
      cy.get('.summary').contains('Notes to Administrator')
        .and('be.visible');
      cy.get('.summary').contains('These are notes to the admin.')
        .and('be.visible');
    });

    it('Checking absence data', function(){
      cy.get('tbody > :nth-child(2) > .label').contains('School');
      cy.get(':nth-child(2) > .cmpt-template-institution-link').contains('MillVill Valley HS');
      cy.get(':nth-child(3) > .label').contains('Absence Reason');
      cy.get('.variation-summary > tbody > :nth-child(3) > :nth-child(2)').contains('Personal Day');
      cy.get(':nth-child(4) > .label').contains('Start/End Times');
      cy.get('.variation-summary > tbody > :nth-child(4) > :nth-child(2)').contains('Full Day (8:00 AM-4:00 PM)');
      cy.get('.row.ng-scope > .label').contains('Substitute Report Time');
      cy.get('.row.ng-scope > :nth-child(2)').contains('Full Day (8:00 AM-4:00 PM)');
      cy.get('.-u-5-24 > .fa').should('be.visible');
    });

    it('Checking Next steps section data', function(){
      cy.get(':nth-child(3) > .-u-10-24 > :nth-child(1)').contains('Next Steps');
      cy.get(':nth-child(2) > .fl-button.ng-binding').contains('View Absence');
      cy.get('.-u-10-24 > :nth-child(2) > .fl-positive').contains('Assign Sub to this Position');
      cy.get('.approval-status').contains('Approval Status:');
      cy.get('.approval-status').contains('Unapproved')
        .and('be.visible');
      cy.get('.approval-recieved').contains('Approvals Received:');
      cy.get('.approval-recieved').contains('0');
      //cy.get('.approval-recieved').contains('2')
      // .and('be.visible');
      cy.get('.approval-action').contains('Last Approval Action:')
        .and('be.visible');
      cy.get('.approval-action').contains('Not Available')
        .and('be.visible');
      cy.get('.approval-comments').contains('Comments:');
      cy.get('.notes-characters-left').contains('255 character(s) left')
        .and('be.visible');
      cy.get(':nth-child(2) > .ng-pristine').type('This is a test of the approval comments text box.');
      cy.get('.notes-characters-left').contains('206 character(s) left');
      cy.get('.create-absence').contains('Create another Absence');
      cy.get('.view-profile').contains('Alexander, Joshua')
        .and('be.visible');
      cy.get('.log-out').contains('Logout of Aesop')
        .and('be.visible');
    });

    it('Verifying the delete and hold options are available', function(){
      cy.get('.cmpt-absr-done-bottom-bar > .fl-negative').contains('Delete this Absence')
        .and('be.visible');
      cy.get('[ng-if="absrState.context.canHold && vm.heldUntil === null"]').contains('Hold for 30 minutes')
        .and('be.visible');
    });

  });



