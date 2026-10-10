const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');

let fixtures;
let vacancyFixtures;
describe('CU-Vacancy view', function (){
  
  before(() => {
    cy.server();
    fixtures = fixtureFactory(cy);
    fixtures.passthroughOrganization();
    fixtures.institutions();
    fixtures.campusUser();
    fixtures.products();
    fixtures.workerTypes();
    fixtures.notifications();

    vacancyFixtures = fixtureFactoryForAbsence(cy);
    vacancyFixtures.mockVacancyView(224980405);


  cy.visit('/absences/detail/224980405/view');

});

it('Ensuring the correct page has loaded', function(){
    cy.url().should('contain','/absences/detail/224980405/view');
    cy.get('.-u-10-24').contains('View Vacancy');
});

it('Validating vacancy tabs mnuemonics', function(){
    cy.get('.tabs > .active').contains('Vacancy')
    .and('be.visible');
    cy.get('.tabs > :nth-child(2)').contains('Vacancy Log')
    .and('be.visible');
});

it('Validating Upper right page header data', function(){
    cy.get('.-u-14-24 > .status').as('fillAndApprovalStatus');
    cy.get('@fillAndApprovalStatus').contains('Status:')
    .and('be.visible');
    cy.get('@fillAndApprovalStatus').contains('Filled by')
    .and('be.visible');
});

it('Validating Sub name links', function(){
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.cmpt-absr-top-section-summary > div > div.top-details > div.-u-14-24.right-section > div.status > span.bold > div > div > div > div > span > a').as('subNameLink');
    cy.get('.status > .cmpt-template-absence-request-status > [ng-if="absrState.needSub && !absrState.absr.isDeleted"] > div.ng-binding > .cmpt-template-substitute-link > span > .ng-binding').as('summarySubNameLink');
    cy.get('@subNameLink').contains('Una Abbott234').should('have.attr','href','/substitute/7313001')
    .and('be.visible');
    cy.get('@summarySubNameLink').contains('Una Abbott234').should('have.attr','href','/substitute/7313001');
});

it('Validating Vacancy specific data and labels are correct', function(){
    cy.get('.-u-10-24').contains('View Vacancy');
    cy.get('.reasons').contains('Vacancy Reason')
    .and('be.visible');
    cy.get('.reasons > .element > .cmpt-ui-dropdown > .readonly').contains('(Vacancy Position)')
    .and('be.visible'); 
});

it('Validating Summary Section label', function(){
    cy.get('.cmpt-absr-details-summary-section > .-g').contains('Vacancy Summary')
    .and('be.visible');
    cy.get('.absence-reason').contains('(Vacancy Position)');
});

it('Checking button labels', function(){
    cy.get('.top > .auto-edit-absence').contains('Edit Vacancy')
    .and('be.visible');
    cy.get('.bottom > .auto-edit-absence').contains('Edit Vacancy')
    .and('be.visible');
});

it('Checking Paycode data', function(){
    cy.get('.pay-codes > label').contains('Pay Code')
    .and('be.visible');
    cy.get('.pay-codes > .element > .cmpt-ui-dropdown > .readonly').contains('None Selected')
    .and('be.visible');
});

it('Checking Create another vacancy link', function(){
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps > div.next-steps > div.create-another-absence-link > a').as('createAnotherVacancyLink');
    cy.get('.create-another-absence-link').contains('Create another vacancy for this vacancy profile')
    .and('be.visible');
    cy.get('@createAnotherVacancyLink').should('have.attr','href','/absences/create-vacancy-details?workerId=7083803');
});

it('Checking for remove and reassign options', function(){
    cy.get('.fl-positive').as('reassignSubButton');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps > div.next-steps > div:nth-child(2) > a:nth-child(1)').as('removeSubButton');
    cy.get('@removeSubButton').contains('Remove Sub')
    .and('be.visible');
    cy.get('@reassignSubButton').contains('Reassign Sub')
    .and('be.visible');
});

it('Feedback link checks', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps > div.next-steps > div.feedback.ng-scope > div:nth-child(3) > a').as('feedBackFromSub');
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps > div.next-steps > div.feedback.ng-scope > div:nth-child(2) > a').as('feedBackAboutSub');
    cy.get('@feedBackAboutSub').should('have.attr','ng-click','go.feedbackAboutSubstitute()');
    cy.get('@feedBackFromSub').should('have.attr','ng-click','go.feedbackFromSubstitute()');
});

});