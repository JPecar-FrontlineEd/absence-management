const fixtureFactory = require('../../helpers/fixtureHelper');
const StaffList = require('../../fixtures/StaffList/StaffList');

let fixtures;
describe('Staff List Regression tests', function (){
 before(() => {
    cy.server();
    fixtures = fixtureFactory(cy);
    fixtures.passthroughOrganization();
    fixtures.institutions();
    fixtures.campusUser();
    fixtures.products();
    fixtures.workerTypes();
    fixtures.notifications();

    
    cy.visit('/reports/employee/staff-list');

  });

  it('Checking initial School Filter state', function(){
      cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div.cmpt-reports-filter-panel > div.filter-section.hide-print > div.filter.schools').contains('All Schools')
        .and('be.visible');
      cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect > .type-label').contains('Schools')
        .and('be.visible');
      cy.get('body > div.main-content > div > ui-view > ui-view > div > h3').contains('Staff List')
        .and('be.visible');
  });

  it('Checking initial Employee type Filter state', function(){
    cy.get('.employee-types > .cmpt-ui-multiselect > .label').contains('All Employee Types')
      .and('be.visible');
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .type-label').contains('Employee Types')
      .and('be.visible');
  });

  it('Checking initial employee-vacancy type filter', function(){
    cy.get('.employees-vacancies > .title').contains('Type:')
      .and('be.visible');
    cy.get('.employees-vacancies > :nth-child(2) > .checkbox').as('employeeTypeChkBx');
    cy.get('@employeeTypeChkBx').should('be.checked');
    cy.get('.employees-vacancies > :nth-child(3) > .checkbox').as('vacancyTypeChkBx');
    cy.get('@vacancyTypeChkBx').should('be.checked');
  });

  it('Checking initial Status filter state',function(){
    cy.get('.active-status > .title').contains('Status:')
      .and('be.visible');
    cy.get('.active-status > :nth-child(2) > .checkbox').as('activeChkBx');
    cy.get('@activeChkBx').should('be.checked');
    cy.get('.active-status > :nth-child(2)').contains('Active')
      .and('be.visible');
    cy.get('.active-status > :nth-child(3) > .checkbox').as('inactiveChkBx');
    cy.get('@inactiveChkBx').should('not.be.checked');
    cy.get('.active-status > :nth-child(3)').contains('Inactive');
  });

  it('Header Label Check', function(){
    cy.get('.header-content > .label').contains('Staff List')
    .and('be.visible');
  });

  it('No Data label state check', function(){
    cy.get('.no-data').contains('To begin, please perform a search above.');
  });

  it('Running the report',function(){
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1.0/workers?fields=(id,firstName,middleName,lastName,loginId,pin,identifier,institution(id,name),isVacancy,isActive,isItinerant,needSub,workerType(title),title,absenceFeedback,needFulfilment,phone)&includeActive=true&includeFeedback=true&includeInactive=false&includeVacancies=true&includeWorkers=true&instIds=&wktIds=',
      response: StaffList()

    })
    cy.get('.fl-primary').click();
    cy.get('.fl-primary').contains('Search');
    cy.get('.cmpt-ui-print-button').contains('Print')
    .and('be.visible');
  });

  it('Summary section check', function(){
    cy.get('.bar > .title').should('be.visible');
    cy.get('.collapsable').click()
    cy.get('.graph-title').should('not.be.visible');
    cy.get('.collapsable').click();
    cy.get('.graph-title').should('be.visible');
  });

  it('checking column headers', function(){
    cy.get('.data-col > [style="width: 20%;"]').contains('Employee')
    .and('be.visible');
    cy.get('.data-col > :nth-child(2)').contains('Login ID')
    .and('be.visible');
    cy.get('.data-col > :nth-child(3)').contains('PIN')
    .and('be.visible');
    cy.get('.data-col > :nth-child(4)').contains('Identifier')
    .and('be.visible');
    cy.get('.data-col > :nth-child(5)').contains('Active')
    .and('be.visible');
    cy.get('.data-col > :nth-child(6)').contains('Needs Sub')
    .and('be.visible');
    cy.get('.data-col > :nth-child(7)').contains('Avg Sub Experience')
    .and('be.visible');
    cy.get('.data-col > :nth-child(8)').contains('Ratings')
    .and('be.visible');
  });

  it('Group headers check', function(){
    cy.get('.dataset-0 > .dataset-container > .group-heading').as('schoolGrouping')
    cy.get('@schoolGrouping').contains('Adams Middle School')
    .and('be.visible');
    cy.get('.group-row > .ng-scope').as('employeeTypeHeader')
    cy.get('@employeeTypeHeader').contains('Teacher')
    .and('be.visible');
  });

  it('Grid data integration tests', function(){
    cy.get('.fl-primary').scrollIntoView();
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel.loaded > div.data-set.not-ready-for-print > div.dataset-0 > div > div.cmpt-ui-grouped-grid.ng-isolate-scope.not-ready-for-print > ul > li > ul > li > div > div.name-cell.cell-0.grid-cell > div > div.cmpt-template-worker-link > div > span').as('nameCell')
    cy.get('@nameCell').contains('Zpe7Employee, CdJsz')
    .and('be.visible');

  })

});