const fixtureFactory = require('../../helpers/fixtureHelper');
const VacancyProfileList = require('../../fixtures/VacancySelect/VacancyProfileList');

let fixtures;
describe('CU- Vacancy Create- Vacancy select', function (){
  
  before(() => {
    cy.server();
    fixtures = fixtureFactory(cy);
    fixtures.passthroughOrganization();
    fixtures.institutions();
    fixtures.campusUser();
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
    cy.url().should('contain', '/absences/create-vacancy');
    cy.get('.title').contains('Vacancy: Create Vacancy');
});

it('Checking grid data and group headers', function(){
    cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .-u-24-24').contains('Test itinerant')
    .and('be.visible');
    cy.get(':nth-child(2) > :nth-child(2) > .grid-rows > .grid-row > .-g > .-u-24-24').contains('US8544')
    .and('be.visible');
});

it('Checking progress bar mneumonic', function(){
    cy.get('.cmpt-step-progress > .active').contains('Select Profile')
    .and('be.visible');
});

});

