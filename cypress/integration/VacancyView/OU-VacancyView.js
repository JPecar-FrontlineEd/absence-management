const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');


let fixtures;
let vacancyFixtures;
describe('OU-Vacancy view', function (){
  
  before(() => {
    cy.server();
    fixtures = fixtureFactory(cy);
    fixtures.passthroughOrganization();
    fixtures.institutions();
    fixtures.orgUser();
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

it('Validating Sub name links', function(){
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.cmpt-absr-top-section-summary > div > div.top-details > div.-u-14-24.right-section > div.status > span.bold > div > div > div > div > span > a').as('subNameLink');
    cy.get('.status > .cmpt-template-absence-request-status > [ng-if="absrState.needSub && !absrState.absr.isDeleted"] > div.ng-binding > .cmpt-template-substitute-link > span.ng-scope > .ng-binding').as('summarySubNameLink');
    cy.get('@subNameLink').contains('Una Abbott234').should('have.attr','href','/navigator/sub_general.asp?x=x&TB2=TAB1&TB1=TAB1&sub_id=7313001')
    .and('be.visible');
    cy.get('@summarySubNameLink').contains('Una Abbott234').should('have.attr','href','/navigator/sub_general.asp?x=x&TB2=TAB1&TB1=TAB1&sub_id=7313001');
});

it('Validating Feedback link', function(){
    cy.get('[ng-if="vm.canSeeWorkerFeedbackLink"] > .ng-binding').contains('Leave Feedback about Substitute')
    .and('be.visible');
    cy.get('[ng-if="vm.canSeeSubFeedbackLink"] > .ng-binding').contains('Leave Feedback from Substitute')
    .and('be.visible');
});

it('Checking Create another vacancy link', function(){
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps.ng-isolate-scope > div.next-steps > div.create-another-absence-link.ng-scope > a').as('createAnotherVacancyLink');
    cy.get('.create-another-absence-link').contains('Create another vacancy for this vacancy profile')
    .and('be.visible');
    cy.get('@createAnotherVacancyLink').should('have.attr','href','/absences/create-vacancy-details?workerId=7083803');
});

it('Validating the Vacancy name link', function(){
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.cmpt-absr-top-section-summary > div > div.top-details > div.-u-10-24.left-section > div.worker-title.cmpt-template-worker-link.ng-isolate-scope > div > span > a').as('vacancyNameLink');
    cy.get('@vacancyNameLink').contains('Test itinerant').should('have.attr','href','/navigator/vp_general.asp?x=x&TB1=TAB1&TB2=&work_id=7083803');
   
});

// This section will be needed when permissions are undertaken
// it('Checking for remove and reassign options', function(){
//     cy.get('.fl-positive').as('reassignSubButton')
//     cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps > div.next-steps > div:nth-child(2) > a:nth-child(1)').as('removeSubButton')
//     cy.get('@removeSubButton').contains('Remove Sub')
//     .and('be.visible')
//     cy.get('@reassignSubButton').contains('Reassign Sub')
//     .and('be.visible')
// })


});