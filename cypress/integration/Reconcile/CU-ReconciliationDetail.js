const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsData = require('../../fixtures/Reconciliation Details/AbsData');
const AbsReasons = require('../../fixtures/RptFilterData/AbsenceReasons');
const AccountingCodes = require('../../fixtures/RptFilterData/AccountingCodes');
const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
const PayCodes = require('../../fixtures/RptFilterData/PayCodes');

let fixtures;
describe('CU- Reconciliation Details page', function (){
  
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
    url: '/api/v1.0/absencerequests?accountingCodeData=true&checkForLock=true&endDate=03/07/2018&forReconciliation=true&includeAbsences=true&includeAllDateAbsences=false&includeDeletedWorkers=false&includeDenied=false&includeFilled=true&includeNoSubRequired=true&includeNotReconciled=true&includeReconciled=false&includeUnfilled=true&includeVacancies=true&instIds=&startDate=03/07/2018&useAlwaysOnDb=true',
    response: AbsData()
    });

  cy.route({
    method: 'GET',
    url: /\/api\/v1.0\/AbsenceReasons\?fields=\(id,name,notesToAdminRequired\)&instId=.*&isVacancyType=false&workId=.*/,
  response: AbsReasons()   
    });

  cy.route({
    method: 'GET',
    url: /\/api\/v1.0\/accountingcodes\?fields=\(id,name\)&instId=.*&workId=.*/,
  response: AccountingCodes()
    });

  cy.route({
    method: 'GET',
    url: '/api/v1.0/budgetcodes',
    response: BudgetCodes()
    });

  cy.route({
    method: 'GET',
    url: '/api/v1.0/paycodes',
    response: PayCodes()
    });

  cy.visit('/absences/reconcile/details?dateRange.startDate=03%2F07%2F2018&dateRange.endDate=03%2F07%2F2018&filledStatus.includeFilled&filledStatus.includeUnfilled&filledStatus.includeNoSubRequired&institutions=&institutionsMultiple=false&maxDate=02%2F27%2F2018&state=includeNotReconciled');

});

it('Validating the correct page has loaded', function(){
  cy.server();
  cy.url().should('contain','/absences/reconcile/details?dateRange.startDate=03%2F07%2F2018&dateRange.endDate=03%2F07%2F2018&filledStatus.includeFilled&filledStatus.includeUnfilled&filledStatus.includeNoSubRequired&institutions=&institutionsMultiple=false&maxDate=02%2F27%2F2018&state=includeNotReconciled')
  cy.get('body > div.main-content > div > ui-view > ui-view > div > div.header > h3').contains('Reconciliation Details: For ')
  cy.get(':nth-child(4) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .actions > .details-button').should('be.visible');
});

it('Checking header information', function(){
  cy.get('body > div.main-content > div > ui-view > ui-view > div > div.header > h3 > b').contains('Wednesday, 3/7/2018')
  .and('be.visible');
  cy.get('.prev-button > .fl-button').contains('Reconciliation Summary')
  .and('be.visible');
});

it('Date Stepper check', function(){
  cy.get('.previous').should('be.visible');
  cy.get('.previous > .fa').should('be.visible');
  cy.get('.next').should('be.visible');
  cy.get('.next > .fa').should('be.visible');
});

it('Initial filter state check', function(){
  cy.get('.school').contains('All Schools')
  .and('be.visible');
  cy.get('.absenceReasons').contains('All Reasons')
  .and('be.visible');
  cy.get('.budgetCodes').contains('All Budget Codes')
  .and('be.visible');
  cy.get('.accountingCodes').contains('All Accounting Codes')
  .and('be.visible');
});

it('Filled status state check', function(){
  cy.get('.filter > .section-title').contains('Filled status:')
  .and('be.visible');
  cy.get('.filter > :nth-child(2) > .checkbox').should('be.checked')
  .and('be.visible')
  cy.get('.filter > :nth-child(2) > span').contains('Filled')
  .and('be.visible');
  cy.get('.filter > :nth-child(3) > .checkbox').should('be.checked')
  .and('be.visible')
  cy.get('.filter > :nth-child(3) > span').contains('Unfilled')
  .and('be.visible');
  cy.get('.filter > :nth-child(4) > .checkbox').should('be.checked')
  .and('be.visible')
  cy.get('.filter > :nth-child(4) > span').contains('Sub Not Needed')
  .and('be.visible');
});

it('Checking grid header', function(){
  cy.get('.title-item-count').contains('2')
  .and('be.visible');
  cy.get('.btn-reconcile-all > .fl-button').contains('Reconcile All')
  .and('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .status > .icon > .fa-paperclip').should('be.visible');
});

it('Validating grid data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .status > .type').contains('Absence');
  cy.get('body > div.main-content > div > ui-view > ui-view > div > div.bottom-results > div:nth-child(3) > div > div > div.-g.detail-header.grid-heading > div.status.-u-18-24 > div > div > span').contains('Stamm779, Kattie');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .status > .times').contains('Full Day (7:00 AM-3:00 PM)');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .status > .icon > .fa-paperclip').should('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .actions > .details-button').should('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .detail-header > .actions > [ng-if="vm.canReconcile"] > .fl-button-sm').contains('Reconcile')
  .and('be.visible');
});

it('Reviewing absence confirmation num data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .first > :nth-child(1) > .cmpt-template-confirmation-link > .ng-binding').as('confLink')
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .first > :nth-child(1) > .label').contains('Confirmation #:')
  .and('be.visible');
  cy.get('@confLink').contains('224980986')
  .and('be.visible');
  cy.get('@confLink').should('have.attr','href','/absences/detail/224980986/view');
});

it('Verifying correct Employee type data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .first > :nth-child(2) > .label').contains('Employee Type:')
  .and('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .first > :nth-child(2) > .content').contains('Teacher')
  .and('be.visible');
});

it('Verifying location data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .first > :nth-child(3) > .label').contains('Location')
  .and('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .first > :nth-child(3) > .content').contains('Adams Middle School')
  .and('be.visible');
});

it('Verifying Report times data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .second > .content-group > .label').contains('Report Times:')
  .and('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .second > .content-group > .content > .ng-binding').contains('(7:15 AM-3:30 PM)')
  .and('be.visible');
});

it('Validating absence reason data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .third > .cmpt-reconcile-edit-section > [ng-show="vm.mainDataReady && vm.instDependantDataReady"] > .reasons > label > .text').contains('Absence Reason:')
  .and('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .third > .cmpt-reconcile-edit-section > [ng-show="vm.mainDataReady && vm.instDependantDataReady"] > .reasons > .element > .cmpt-ui-dropdown').should('be.visible')
  .and('be.visible');
});

it('Checking budget code data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .third > .cmpt-reconcile-edit-section > [ng-show="vm.mainDataReady && vm.instDependantDataReady"] > .budget-codes > label > .text').contains('Budget Code:')
  .and('be.visible');
  cy.get('.budget-codes > .element > .cmpt-ui-dropdown > .ng-not-empty').should('be.visible')
  .and('be.visible');
});

it('Checking Accounting Code data', function(){
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .third > .cmpt-reconcile-edit-section > [ng-show="vm.mainDataReady && vm.instDependantDataReady"] > .accounting-codes > label > .text').contains('Accounting Code:')
  .and('be.visible');
  cy.get(':nth-child(3) > .cmpt-reconcile-absence-details > :nth-child(1) > .details > .third > .cmpt-reconcile-edit-section > [ng-show="vm.mainDataReady && vm.instDependantDataReady"] > .accounting-codes > .element > .cmpt-ui-dropdown > .ng-valid').should('be.visible');
});

it('Reviewing notes data', function(){
  cy.get('.fa-file-text').should('be.visible');
  cy.get('.fa-file-text').trigger('mouseover');
  cy.get('#qtip-0-content > div > div:nth-child(1) > label').as('notesToSub');
  cy.get('#qtip-0-content > div > div:nth-child(2) > label').as('notesToAdmin');
  cy.get('@notesToSub').contains('Notes to Substitute');
  cy.get('@notesToSub').should('be.visible');
  cy.get('#qtip-0-content > div > div:nth-child(1) > span').contains('Voluptas excepturi commodi voluptatem.');
  cy.get('@notesToAdmin').should('be.visible');
  cy.get('@notesToAdmin').contains('Notes to Administrator');
  cy.get('#qtip-0-content > div > div:nth-child(2) > span').should('be.visible');
  cy.get('#qtip-0-content > div > div:nth-child(2) > span').contains('Ea eos quia accusamus sunt dolorem impedit est.');
  cy.get('.fa-file-text').trigger('mouseleave');
  //TBD clicking on the paper clip icon to check for attachments
});

});