  const fixtureFactory = require('../../helpers/fixtureHelper');
  const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');
  const WorkerList = require('../../fixtures/AbsCreateEmpSelect/WorkerList');
  const WorkerListSearch = require('../../fixtures/AbsCreateEmpSelect/WorkerListSearch');
  const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
  const PayCodes = require('../../fixtures/RptFilterData/PayCodes');
  const AltAccountingCodeList = require('../../fixtures/AbsCreateDetails/AccountingCodes');
  const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');
  const AbsenceReasonsList = require('../../fixtures/AbsCreateDetails/AbsenceReasonsList');
  const AbsenceRequestWorkerData = require('../../fixtures/AbsCreateDetails/AbsenceRequestWorkerData');

  
  let fixtures;
  let absCreateDetailsFixtures;
  describe('CU-Absence Create Review tests', function (){
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
      fixtures.campusUser();
      fixtures.products();
      fixtures.workerTypes();
      fixtures.notifications();
  
      // mock the initial request with the full result list
      mockWorkerRequest('', WorkerList());
      cy.server();
      absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      absCreateDetailsFixtures.mockAccountingCodeCall();

        cy.visit('absences/create-absence');
    });

    beforeEach(() => cy.server());
    
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
      }).as('getAbsenceReasonsList');
      
      cy.route({
        method: 'GET',
        url: '/api/v1.0/paycodes',
        response: PayCodes()
      }).as('getPayCodes');
      
      cy.route({
        method: 'GET',
        url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
        response: AltAccountingCodeList()
      }).as('getAltAccountingCodeList');
      
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

        // absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
        // absCreateDetailsFixtures.mockAbsCreateDetails();
        cy.get('.top > .right-section > .button-section > .fl-button').as('topReviewAndConfirmButton');
        cy.get('@topReviewAndConfirmButton').should('be.visible');
        cy.get('@topReviewAndConfirmButton').click();
        cy.wait(['@getBudgetCodes','@getAbsenceReasonsList','@getPayCodes','@getAltAccountingCodeList','@getAbsenceRequestWorkerData','@getRelatedFiles']);
      });

    it('Selecting Full day absence type', function () {
      cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(1) > div > div > div.cmpt-ui-dropdown > select').as('shiftSelector')
      cy.get('@shiftSelector').select('Full Day');
    });

    it('Selecting the absence reason', function(){
      cy.get('.reasons > .element > .cmpt-ui-dropdown > .ng-empty').as('absenceReasonSelector');
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
      cy.get('.time-absent > .element > .cmpt-ui-textbox > .fl-input').as('timeAbsentInput');
      cy.get('@timeAbsentInput').focus();
      cy.get('@timeAbsentInput').type('00:30{enter}');
    });

    it('Filling in Non-Pay Data', function(){
      cy.get('.non-pay > .element > .cmpt-ui-textbox > .fl-input').as('nonPayTime');
      cy.get('@nonPayTime').focus();
      cy.get('@nonPayTime').type('{selectall}{backspace}00:30{enter}');
    });

    it('Selecting Budget Code information', function(){
      cy.get('.budget-codes > .element > .cmpt-ui-dropdown > .ng-empty').as('budgetCodeSelector');
      cy.get('@budgetCodeSelector').select('Certified Teacher');
    });

    it('Selecting the Account Code information', function(){
      cy.get('.accounting-codes > .element > .cmpt-ui-dropdown > .ng-empty').as('accountCodeSelector');
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
      // absCreateDetailsFixtures = fixtureFactoryForAbsence(cy); May not need this line and the next line.
      // absCreateDetailsFixtures.mockWorkerDataAndRelatedFilesCalls();
      cy.get('.bottom > .right-section > .button-section > .fl-button').click();
    });

    it('Checking page headers for the correct data', function (){
      cy.get('.top').as('topHeader');
      cy.get('@topHeader').contains('Step 3: Review and Confirm details for');
      cy.get('@topHeader').contains('Alexander, Joshua');
      cy.get('@topHeader').contains('Next Step:');
      cy.get('@topHeader').contains('Create Absence and Assign Sub');
      cy.get('@topHeader').contains('Create Absence');
    });

    it('Validating absence data', function (){
      cy.get('[ng-if="absrState.context.showEntitlementType"]').as('absenceReasonDataRow');
      cy.get('@absenceReasonDataRow').contains('Personal Day');
    });

    it('Validating the absence time data', function (){
      cy.get('[ng-repeat="variation in absrState.absrVariations track by $index"] > .-g > :nth-child(2)').as('absenceTimeRow')
      cy.get('@absenceTimeRow').contains('Time');
      cy.get('@absenceTimeRow').contains('Full Day (08:00 AM-04:00 PM)');
    });

    it('Validating the Sub Report time data', function (){
      cy.get('[ng-if="absrState.needSub && absrState.context.needSub > 0 && absrState.context.showVacancyTimes"]').as('subReportTimeDataRow');
      cy.get('@subReportTimeDataRow').contains('Substitute Report Time')
      .and('be.visible');
      cy.get('@subReportTimeDataRow').contains('Full Day (08:00 AM-04:00 PM)')
      .and('be.visible');
    });

    it('Validating the Non-Pay Time data', function (){
      cy.get('[ng-if="absrState.context.showNonPayTime"]').as('nonPayTimeRow');
      cy.get('@nonPayTimeRow').contains('Non-Pay Time')
      .and('be.visible');
      cy.get('@nonPayTimeRow').contains('00:30');
    });

    it('Validating the Time Absent data', function (){
      cy.get('[ng-if="absrState.context.showAbsenceTime"]').as('timeAbsentDataRow');
      cy.get('@timeAbsentDataRow').contains('Time Absent')
      .and('be.visible');
      cy.get('@timeAbsentDataRow').contains('00:30')
      .and('be.visible');
    });

    it('Validating the Budget Code data', function (){
      cy.get('[ng-if="absrState.context.showBudgetCode"]').as('budgetCodeDataRow');
      cy.get('@budgetCodeDataRow').contains('Budget Code')
      .and('be.visible');
      cy.get('@budgetCodeDataRow').contains('Certified Teacher');
    });

    it('Validating the Account Code data', function(){
      cy.get('[ng-if="absrState.context.showAccountingCode"]').as('accountingCodeRow');
      cy.get('@accountingCodeRow').contains('Accounting Code')
      .and('be.visible');
      cy.get('@accountingCodeRow').contains('Custom')
      .and('be.visible');
      cy.get('@accountingCodeRow').contains('- 12345')
      .and('be.visible');
    });

    it('Validating the Notes to Administrator data', function(){
      cy.get('[ng-if="absrState.context.showNotesToAdmin"]').as('notesToAdminRow');
      cy.get('@notesToAdminRow').contains('Notes to Administrator')
      .and('be.visible');
      cy.get('@notesToAdminRow').contains('These are notes to the admin.')
      .and('be.visible');
    });

    it('Validating the Notes to Substitute data', function(){
      cy.get('.-u-17-24 > :nth-child(2) > :nth-child(3)').as('notesToSubstituteRow');
      cy.get('@notesToSubstituteRow').contains('These are notes to the substitute')
      .and('be.visible');
      cy.get('@notesToSubstituteRow').contains('These are notes to the substitute')
      .and('be.visible');
    });

    it('Validating the Admin-Only Notes', function(){
      cy.get('[ng-if="absrState.context.showNotesToAdminOnly"]').as('adminOnlyNotesRow');
      cy.get('@adminOnlyNotesRow').contains('Admin-Only Notes')
      .and('be.visible');
      cy.get('@adminOnlyNotesRow').contains('These are notes that only the admin can see.')
      .and('be.visible');
    });

    it('Validating the Fill out details and Next step options are available', function(){
      cy.get('.bottom > .left-section > .button-section > .fl-button').contains('Fill out Details')
      .and('be.visible');
      cy.get('.bottom > .right-section > .button-section > .label-green').contains('Create Absence and Assign Sub')
      .and('be.visible');
      cy.get('.bottom > .right-section > .button-section > .fl-positive').contains('Create Absence')
      .and('be.visible');
    });

    it('Validating Absence Summary Data', function(){
      cy.get('.date-select').as('subRequired');
      cy.get('.item').as('summaryAbsenceData');
      cy.get('@summaryAbsenceData').contains('MillVill Valley HS')
      .and('be.visible');
      cy.get('@summaryAbsenceData').contains('8:00 AM - 4:00 PM')
      .and('be.visible');
      cy.get('@summaryAbsenceData').contains('Personal Day')
      .and('be.visible');
      cy.get('.cmpt-ui-dropdown > .ng-not-empty').contains('No Hold');
      cy.get('@subRequired').contains('Yes');
    });

}); 



