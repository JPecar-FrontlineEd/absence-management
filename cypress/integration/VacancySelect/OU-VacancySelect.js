const fixtureFactory = require('../../helpers/fixtureHelper');
const VacancyProfileList = require('../../fixtures/VacancySelect/VacancyProfileList');

let fixtures;
describe('OU- Vacancy Create- Vacancy select', function (){
  
  before(() => {
    cy.server();
    fixtures = fixtureFactory(cy);
    fixtures.passthroughOrganization();
    fixtures.institutions();
    fixtures.orgUser();
    fixtures.products();
    fixtures.workerTypes();
    fixtures.notifications();


    cy.route({
        method: 'GET',
        url: '/api/v1.0/workers?fields=(id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)&includeVacancies=true&includeWorkers=false&lastName=&maxRecords=100&offSet=0',
        response: VacancyProfileList()
  });

  cy.visit('absences/create-vacancy');

});

it('Check that the correct page was loaded', function(){
    cy.url().should('contain', '/absences/create-vacancy')
    cy.get('.title').contains('Vacancy: Create Vacancy')
});

it('Validating Vacancy Profile View link', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel > div.-g.body-section > div.-u-18-24.search-results > div > div.cmpt-ui-grouped-grid.ng-isolate-scope.not-ready-for-print > ul > li:nth-child(1) > ul > li > div > div > div > div > span > span > a').as('viewLink')
    cy.get('@viewLink').contains('view')
    .should('have.attr','href','/navigator/vp_general.asp?x=x&TB1=TAB1&TB2=&work_id=7083803')
});

it('Checking progress bar and top header mneumonic', function(){
    cy.get('.cmpt-step-progress > .active').contains('Select Profile')
    .and('be.visible')
    cy.get('.top').contains('Step 1: Select Profile')
    .and('be.visible')
});


});

