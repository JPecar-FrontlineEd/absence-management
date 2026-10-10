import { setTimeout } from 'timers';
const fixtureFactory = require('../../helpers/fixtureHelper');
const WorkerList = require('../../fixtures/AbsCreateEmpSelect/WorkerList');
const WorkerListSearch = require('../../fixtures/AbsCreateEmpSelect/WorkerListSearch');

let fixtures;
describe('OU-Abs create employee select', function (){
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

    //mock the initial request with the full result list
    mockWorkerRequest('', WorkerList());

    setTimeout(function () {
      cy.visit('absences/create-absence');
    }, 0);
    
  });

  beforeEach(() => cy.server());

  it('Validate Correct Columns are Visible', function() {
    cy.get('.top').contains('Step 1: Select Employee');
    cy.get('[ng-show="isLoaded && showHeader"] > .name-th').contains('Name');
    cy.get('[ng-show="isLoaded && showHeader"] > .identifier-th') .should('be.visible');
    cy.get('[ng-show="isLoaded && showHeader"] > .phone-th').should('be.visible');
    cy.get('[ng-show="isLoaded && showHeader"] > .school-th').contains('School');
  });

  it('Verify the correct workflow information', function (){
    cy.get('.active > .ng-binding').contains('Select Employee');
    cy.get('.cmpt-step-progress > :nth-child(2) ').contains('Fill out Details');
    cy.get('.cmpt-step-progress > :nth-child(3) ').contains('Review & Confirm');
  });

  it('Validating tool tip information', function() {
    cy.get('body').click();
    cy.get('.info-qtip > .fa').should('be.visible');
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .name-cell > .cmpt-template-worker-link > div > .info-qtip > .fa').trigger('mouseover');
    cy.get('.cmpt-template-general-info-tooltip > .top-section > :nth-child(1)').contains('Teacher');
    cy.get(':nth-child(3) > .-u-22-24').contains('(978) 327-1298');
    cy.get(':nth-child(2) > .-u-22-24').contains('Bush Elementary');
    cy.get('.cmpt-template-general-info-tooltip > .name').contains('1nL8HEMPLOYEE, Baekahexi');
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .name-cell > .cmpt-template-worker-link > div > .info-qtip > .fa').trigger('mouseout');
    cy.get('.row-2-0 > .-g > .name-cell > .cmpt-template-worker-link > div.ng-scope > .info-qtip > .fa').trigger('mouseover');
    cy.get('#qtip-2-content > .cmpt-template-general-info-tooltip > .data-list > :nth-child(1) > .-u-22-24 > .ng-scope').contains('DIRECTOR CST');
    cy.get('.row-2-0 > .-g > .name-cell > .cmpt-template-worker-link > div.ng-scope > .info-qtip > .fa').trigger('mouseout');
  });

  it('Verify the correct employee information', function(){
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .name-cell').contains('1nL8HEMPLOYEE, Baekahexi');
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .identifier-cell').contains('1nL8HFyN').should('have.attr', 'href' , '/navigator/te_general.asp?x=x&TB2=TAB1&TB1=TAB1&work_id=6948972')
    .and('be.visible');
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .phone-cell').contains('(978) 327-1298')
    .and('be.visible');
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .school-cell').contains('Bush Elementary').should('have.attr', 'href' , '/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id=5400')
    .and('be.visible');
  });

  it('Verify employee search', function() {
    const searchTerm = 'Alexa';
    // mock the filtered request with the subset result list
    mockWorkerRequest(searchTerm, WorkerListSearch());
    cy.get('.fl-input').focus();
    cy.get('.fl-input').type(searchTerm);
    cy.get('input[value=4628277]').click();
    cy.get('.group-row').contains('A');
  });
 
  it('Verifying the user can proceed',function(){
    cy.get('.bottom > .right-section > .button-section > .fl-button').should('be.visible');
    cy.get('.top > .right-section > .button-section > .fl-button').should('be.visible');
});

}); 