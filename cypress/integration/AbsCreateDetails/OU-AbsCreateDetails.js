const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');
const WorkerList = require('../../fixtures/AbsCreateEmpSelect/WorkerList');
const WorkerListSearch = require('../../fixtures/AbsCreateEmpSelect/WorkerListSearch');
const AccountingCodes = require('../../fixtures/AbsCreateDetails/AccountingCodes');
const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
const PayCodes = require('../../fixtures/RptFilterData/PayCodes');
const AltAccountingCodeList = require('../../fixtures/AbsCreateDetails/AccountingCodes');
const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');
const AbsenceReasonsList = require('../../fixtures/AbsCreateDetails/AbsenceReasonsList');
const AbsenceRequestWorkerData = require('../../fixtures/AbsCreateDetails/AbsenceRequestWorkerData');

let fixtures;
let absCreateDetailsFixtures;
describe('OU-Absence Create Details UI tests', function (){
    const mockWorkerRequest = (query = '', response) => cy.route({
      method: 'GET',
      url: `/api/v1.0/workers?fields=(id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)&includeVacancies=false&includeWorkers=true&lastName=${query}&maxRecords=100&offSet=0`,
      response
    });
  
    before(() => {
      //cy.server();
      fixtures = fixtureFactory(cy);
      fixtures.passthroughOrganization();
      fixtures.institutions();
      fixtures.orgUser();
      fixtures.products();
      fixtures.workerTypes();
      fixtures.notifications();
  
      // mock the initial request with the full result list
      mockWorkerRequest('', WorkerList());
  
      absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      absCreateDetailsFixtures.mockAccountingCodeCall();
      
        cy.visit('absences/create-absence');
    });

    beforeEach(() => cy.server());
    
    it('Validate Correct Columns are Visible', function() {
        cy.get('.top > .left-section').contains('Step 1: Select Employee');
        cy.get('[ng-show="isLoaded && showHeader"] > .name-th').contains('Name');
        cy.get('[ng-show="isLoaded && showHeader"] > .identifier-th') .should('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .phone-th').should('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .school-th').contains('School');
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

    it('Verifying id link data', function(){
        cy.get('span.ng-scope > .ng-binding').contains('MV124321')
        .and('be.visible');
        cy.get('.cmpt-template-institution-link > .ng-binding').as('schoolName');
        cy.get('@schoolName').contains('MillVill Valley HS')
        .and('be.visible');
        cy.get('@schoolName').should('have.attr','href','/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id=147026')
      });
        
    it('Proceeding to select absence details', function () {
      cy.server()
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

    it('Verifying page labels and data', function () {
        cy.get('.top > .left-section > :nth-child(1)').as('empNameLabel');
        cy.get('span.ng-scope > .ng-binding').as('empNameLink');
        cy.get('@empNameLabel').contains('Alexander, Joshua')
        .and('be.visible');
        cy.get('@empNameLink').should('have.attr','href','/navigator/te_general.asp?x=x&TB2=TAB1&TB1=TAB1&work_id=4628277')
    }); 

    it('Verify the school name is a link', function (){
        cy.get('.cmpt-template-institution-link').contains('MillVill Valley HS').should('have.attr', 'href', '/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id=147026');
      });

      it('Populating the date selector', function (){
        cy.server()
        absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
        absCreateDetailsFixtures.mockAbsRelatedFiles();
        cy.get(':nth-child(1) > .cmpt-ui-date-selector-v2 > .input > .ui-datepicker-trigger').click()
        cy.get('#ui-datepicker-div .ui-datepicker-calendar tbody .ui-datepicker-days-cell-over .ui-state-default').click()
        cy.get('#dp1517942897121').should('not.be.empty')
      });

    it('Selecting an absence reason', function(){
        cy.get('.reasons > .element > .cmpt-ui-dropdown > .ng-empty').select('EnforceNote2Admin');
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

    it('Submitting abs for notes enforcement validation', function(){
      cy.server()
      absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      absCreateDetailsFixtures.mockAbsCreateDetails();
      cy.get('.top > .right-section > .button-section > .fl-button').click();
      cy.get('#admin-notes > :nth-child(2) > .ng-pristine').should('have.attr','ng-class','{\'error\': errorMessages.length > 0}');
    });

});