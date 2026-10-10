const fixtureFactory = require('../../helpers/fixtureHelper');
const Institution = require('../../fixtures/SchoolSettings/GeneralInformation');

let fixtures;
describe('CU-Building General information page', function (){
  
  before(() => {
    cy.server();
    fixtures = fixtureFactory(cy);
    fixtures.passthroughOrganization();
    fixtures.institutions();
    fixtures.campusUser();
    fixtures.products();
    fixtures.workerTypes();
    fixtures.notifications();
});

before(() => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/api/v1.0/institutions/5398',
    response: Institution()
    });

  cy.visit('/settings/school/5398/general-info');
});

it('Confirming the page has loaded', function(){
    cy.url().should('contain','/settings/school/5398/general-info');
    cy.get('.tabs > .active').contains('General Information');
});

it('Validating header label data', function(){
    cy.get('.heading').contains('School Settings')
        .and('be.visible');
    cy.get('h3.ng-binding').contains('Dawes Ave School')
        .and('be.visible');
    cy.get('.section-heading').contains('General Information')
        .and('be.visible');
});

it('Checking for the correct tabs', function(){
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.cmpt-ui-tabs > div > a.active > span > span').contains('General Information');
    cy.get('.tabs > :nth-child(2)').contains('Time Settings')
        .and('be.visible');
    cy.get('.tabs > :nth-child(3)').contains('Preferred Substitutes')
        .and('be.visible');
    cy.get('.tabs > :nth-child(4)').contains('Excluded Substitutes')
        .and('be.visible');
    cy.get('.tabs > :nth-child(5)').contains('Shared Files')
        .and('be.visible');
});

it('Validating School Name data', function(){
    cy.get('.container > .content > :nth-child(1) > :nth-child(1)').contains('School Name:')
        .and('be.visible');
    cy.get('.container > .content > :nth-child(1) > :nth-child(1)').contains('Dawes Ave School')
        .and('be.visible');
});

it('Validating Address 1 data', function(){
    cy.get('.container > .content > :nth-child(2) > :nth-child(1)').contains('Address 1:')
        .and('be.visible');
    cy.get('.container > .content > :nth-child(2) > :nth-child(1)').contains('14 Atwater Blvd')
        .and('be.visible');
});

it('Validating Address 3 data', function(){
    cy.get('.content > :nth-child(3) > :nth-child(1)').contains('Address 3:')
        .and('be.visible');
});

it('Validating City', function(){
    cy.get('.content > :nth-child(4) > :nth-child(1)').contains('City:')
        .and('be.visible');
    cy.get('.content > :nth-child(4) > :nth-child(1)').contains('Malvern')
        .and('be.visible');
});

it('Validating State data', function(){
    cy.get('.content > :nth-child(5) > :nth-child(1)').contains('State:')
        .and('be.visible');
    cy.get('.content > :nth-child(5) > :nth-child(1)').contains('PA')
        .and('be.visible');
});

it('Validating Zip code data', function(){
    cy.get('.content > :nth-child(5) > :nth-child(1)').contains('Zip Code:')
        .and('be.visible');
    cy.get('.content > :nth-child(5) > :nth-child(1)').contains('19355')
        .and('be.visible');
});

it('External Number data check', function(){
    cy.get('.content > :nth-child(1) > :nth-child(2)').contains('External Number:')
        .and('be.visible');
    cy.get('.content > :nth-child(1) > :nth-child(2)').contains('5')
        .and('be.visible');
});

it('Validating address 2 data', function(){
    cy.get('.container > .content > :nth-child(2) > :nth-child(2)').contains('Address 2:')
        .and('be.visible');
    cy.get('.container > .content > :nth-child(2) > :nth-child(2)').contains('243 Galmont Blvd')
        .and('be.visible');
});

it('Address 4 data checks', function(){
    cy.get('.content > :nth-child(3) > :nth-child(2)').contains('Address 4:')
        .and('be.visible');  
});

it('Building phone number data check', function(){
    cy.get('.content > :nth-child(4) > :nth-child(2)').contains('Phone:')
        .and('be.visible'); 
    cy.get('.content > :nth-child(4) > :nth-child(2)').contains('5557844286')
        .and('be.visible'); 
});

it('Building fax number data check', function(){
    cy.get('.content > :nth-child(5) > :nth-child(2)').contains('Fax:')
        .and('be.visible'); 
    cy.get('.content > :nth-child(5) > :nth-child(2)').contains('5557844287')
        .and('be.visible'); 
});

it('Get directions button checks', function(){
    cy.get('.fl-button').should('have.attr','href','http://maps.google.com/maps?daddr=14+Atwater+Blvd+Malvern+PA+19355+');
    cy.get('.fl-button').contains('Get Directions')
        .and('be.visible');
});

it('Location selector check', function(){
    cy.get('.school-selector').contains('Select a School')
        .and('be.visible');
    cy.get('.ng-not-empty').should('be.visible');
    cy.get('.ng-not-empty').contains('Dawes Ave School');
});

});