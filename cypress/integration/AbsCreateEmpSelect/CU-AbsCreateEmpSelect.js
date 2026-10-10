import { setTimeout } from 'timers';
const fixtureFactory = require('../../helpers/fixtureHelper');
const WorkerList = require('../../fixtures/AbsCreateEmpSelect/WorkerList');
const WorkerListSearch = require('../../fixtures/AbsCreateEmpSelect/WorkerListSearch');

let fixtures;
describe('CU-Abs Create employee select', function (){
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

  it('Verify the correct workflow information', function() {
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
    cy.get('.row-2-0 > .-g > .name-cell > .cmpt-template-worker-link > div > .info-qtip > .fa').trigger('mouseover');
    cy.get('#qtip-2-content > .cmpt-template-general-info-tooltip > .data-list > :nth-child(1) > .-u-22-24 > .ng-scope').contains('DIRECTOR CST');
    cy.get('.row-2-0 > .-g > .name-cell > .cmpt-template-worker-link > div > .info-qtip > .fa').trigger('mouseout');
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
 
  it('Verify the ability to search by letter', function(){
    cy.get('.letter-table > :nth-child(1)').contains('A');
    cy.get('.letter-table > :nth-child(2)').contains('B');
    cy.get('.letter-table > :nth-child(3)').contains('C');
    cy.get('.letter-table > :nth-child(4)').contains('D');
    cy.get('.letter-table > :nth-child(5)').contains('E');
    cy.get('.letter-table > :nth-child(6)').contains('F');
    cy.get('.letter-table > :nth-child(7)').contains('G');
    cy.get('.letter-table > :nth-child(8)').contains('H');
    cy.get('.letter-table > :nth-child(9)').contains('I');
    cy.get('.letter-table > :nth-child(10)').contains('J');
    cy.get('.letter-table > :nth-child(11)').contains('K');
    cy.get('.letter-table > :nth-child(12)').contains('L');
    cy.get('.letter-table > :nth-child(13)').contains('M');
    cy.get('.letter-table > :nth-child(14)').contains('N');
    cy.get('.letter-table > :nth-child(15)').contains('O');
    cy.get('.letter-table > :nth-child(16)').contains('P');
    cy.get('.letter-table > :nth-child(17)').contains('Q');
    cy.get('.letter-table > :nth-child(18)').contains('R');
    cy.get('.letter-table > :nth-child(19)').contains('S');
    cy.get('.letter-table > :nth-child(20)').contains('T');
    cy.get('.letter-table > :nth-child(21)').contains('U');
    cy.get('.letter-table > :nth-child(22)').contains('V');
    cy.get('.letter-table > :nth-child(23)').contains('W');
    cy.get('.letter-table > :nth-child(24)').contains('X');
    cy.get('.letter-table > :nth-child(25)').contains('Y');
    cy.get('.letter-table > :nth-child(26)').contains('Z');
    cy.get('.letter-table > :nth-child(27)').contains('All');
  });
   
  it('Verifying the user can proceed',function(){
    cy.get('.bottom > .right-section > .button-section > .fl-button').should('be.visible');
    cy.get('.top > .right-section > .button-section > .fl-button').should('be.visible');
});

}); 