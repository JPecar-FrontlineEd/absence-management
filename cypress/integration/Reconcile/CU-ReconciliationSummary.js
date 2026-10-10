const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceList = require('../../fixtures/Reconcile/ReconciliationSummary');
const EmptyDataSet = require('../../fixtures/Reconcile/InitialDataSet')

let fixtures;
describe('CU- Reconciliation Summary page', function (){
  
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
        url: /\/api\/v1.0\/absencerequests\?endDate=.*&fields=absences\(date,isReconciled,canReconciled\)&forReconciliation=true&includeAllDateAbsences=false&includeDeletedWorkers=false&includeDenied=false&includeFilled=true&includeNoSubRequired=true&includeNotReconciled=true&includeReconciled=true&includeUnfilled=true&instIds=&startDate=.*&useAlwaysOnDb=true/,
        response: EmptyDataSet()
  });

  cy.visit('/absences/reconcile?dateRange.startDate=01%2F27%2F2018&dateRange.endDate=02%2F26%2F2018&absenceType.includeAbsences&absenceType.includeVacancies&selectedInst=&state=includeNotReconciled&includeAllDateAbsences=false&accountingCodeData&attachmentData');


});
it('Checking that the correct page has loaded', function(){
    cy.url().should('contain','/absences/reconcile?dateRange.startDate=01%2F27%2F2018&dateRange.endDate=02%2F26%2F2018&absenceType.includeAbsences&absenceType.includeVacancies&selectedInst=&state=includeNotReconciled&includeAllDateAbsences=false&accountingCodeData&attachmentData')
    cy.get('body > div.main-content > div > ui-view > ui-view > div > h3').contains('Reconciliation Summary')
    
});

it('Checking the initial Fill status filter', function(){
    cy.get('.filled-status > :nth-child(1)').contains('Filled')
    .and('be.visible')
    cy.get('.filled-status > :nth-child(2)').contains('Unfilled')
    .and('be.visible')
    cy.get('.filled-status > :nth-child(3)').contains('Sub Not Needed')
    .and('be.visible')
    cy.get('.title').contains('Date Range:')
    .and('be.visible')

});

it('Validating initial school filter status', function(){
    cy.get('.schools').contains('All Schools')
});

it('Ensuring the user has the ability to search', function (){
    cy.get('.fl-primary').contains('Search')

})

it('Checking Filled filter checkbox', function(){
    cy.get(':nth-child(1) > .checkbox').as('filledCheckbox')
    cy.get('@filledCheckbox').should('be.checked')
    cy.get('@filledCheckbox').uncheck({force: false})
    .should('not.be.checked')
    cy.get('@filledCheckbox').check({force: false})
    .should('be.checked')
});

it('Checking Unfilled filter checkbox', function(){
    cy.get(':nth-child(2) > .checkbox').as('unfilledCheckbox')
    cy.get('@unfilledCheckbox').should('be.checked')
    cy.get('@unfilledCheckbox').uncheck({force: false})
    .should('not.be.checked')
    cy.get('@unfilledCheckbox').check({force: false})
    .should('be.checked')
});

it('Checking Sub Not Needed filter checkbox', function(){
    cy.get(':nth-child(3) > .checkbox').as('subNotNeeded')
    cy.get('@subNotNeeded').should('be.checked')
    cy.get('@subNotNeeded').uncheck({force: false})
    .should('not.be.checked')
    cy.get('@subNotNeeded').check({force: false})
    .should('be.checked')
});

it('Checking Hint Labeling', function(){
    cy.get('.fl-hint').as('hint');
    cy.get('@hint').contains('How to Reconcile/Unreconcile events:')
    .and('be.visible');
    cy.get('@hint').contains('Access the Details screen for each day by clicking on the number of the events on each day that are reconciled or not reconciled.')
    .and('be.visible');
    cy.get('@hint').contains('On the details screen, you can reconcile, unreconcile and modify the details of each event individually or all at the same time.')
    .and('be.visible');
});

it('Opening the start date selector', function(){
    cy.get('[got-error="vm.startDateError"] > .ui-datepicker-trigger').click();
});

it('Setting the start date', function(){
    var pickermonth = (Cypress.$('.ui-datepicker-month').text());
    while (pickermonth != 'January') {
        Cypress.$('.ui-datepicker-prev .ui-icon').trigger('click');
        
        pickermonth = (Cypress.$('.ui-datepicker-month').text()); 
    };
});

it('Setting the month', function(){
    cy.get(':nth-child(5) > :nth-child(1) > .ui-state-default').click()
});

it('Opening the End date selector',function(){
    cy.get('[got-error="vm.endDateError"] > .ui-datepicker-trigger').click();
});

it('Setting the end data', function(){
    var pickermonth = (Cypress.$('.ui-datepicker-month').text());
    while (pickermonth != 'February') {
        Cypress.$('.ui-datepicker-prev .ui-icon').trigger('click');
        
        pickermonth = (Cypress.$('.ui-datepicker-month').text()); 
    }; 
});

it('Setting the month', function(){
    cy.get(':nth-child(5) > :nth-child(3) > .ui-state-default').click()
});

it('Running the report', function(){
    cy.server()

    cy.route({
        method: 'GET',
        url: /\/api\/v1.0\/absencerequests\?endDate=.*&fields=absences\(date,isReconciled,canReconciled\)&forReconciliation=true&includeAllDateAbsences=false&includeDeletedWorkers=false&includeDenied=false&includeFilled=true&includeNoSubRequired=true&includeNotReconciled=true&includeReconciled=true&includeUnfilled=true&instIds=&startDate=.*&useAlwaysOnDb=true/,
        response: AbsenceList()
  });

    cy.get('.fl-primary').click()

});

it('Checking column headers', function(){
    cy.get('.content-panel > :nth-child(2) > .-u-8-24').contains('Date')
    .and('be.visible');
    cy.get('.-u-10-24').contains('Reconciled Summary')
    .and('be.visible');
    cy.get('.content-panel > :nth-child(2) > .-u-5-24').contains('Not reconciled')
    .and('be.visible');

});

it('Checking grid Date data', function(){
    cy.get(':nth-child(7) > .grid-header > .-u-1-24').click();
    cy.get(':nth-child(3) > .grid-header > .-u-8-24').contains('January 28 - February 3, 2018')
    cy.get('.content-panel > :nth-child(4) > .grid-header > .-u-8-24').contains('February 4 - February 10, 2018')
    cy.get(':nth-child(5) > .grid-header > .-u-8-24').contains('February 11 - February 17, 2018')
    cy.get(':nth-child(6) > .grid-header > .-u-8-24').contains('February 18 - February 24, 2018')
    cy.get('.expanded > .grid-header > .-u-8-24').contains('February 25 - February 27, 2018')
    cy.get('.expanded > ul > :nth-child(1) > .-u-8-24').contains('Sunday, February 25, 2018')
    cy.get('.expanded > ul > :nth-child(2) > .-u-8-24').contains('Monday, February 26, 2018')
    cy.get('.expanded > ul > :nth-child(3) > .-u-8-24').contains('Tuesday, February 27, 2018')
    cy.get('.footer > .-u-8-24').contains('Total Events')
});

it('Checking Reconciled Summary Counts', function(){
    cy.get(':nth-child(3) > .grid-header > .-u-3-24').contains('13/222')
    cy.get('.content-panel > :nth-child(4) > .grid-header > .-u-3-24').contains('2/112')
    cy.get(':nth-child(5) > .grid-header > .-u-3-24').contains('5/75')
    cy.get(':nth-child(6) > .grid-header > .-u-3-24').contains('3/67')
    cy.get('.expanded > .grid-header > .-u-3-24').contains('0/33')
    cy.get('.expanded > ul > :nth-child(1) > .-u-3-24').contains('0/0')
    cy.get('.expanded > ul > :nth-child(2) > .-u-3-24').contains('0/19')
    cy.get('.expanded > ul > :nth-child(3) > .-u-3-24').contains('0/14')
    cy.get('.footer > .-u-3-24').contains('23/509')
});

it('Checking Not Reconciled Counts', function(){
    cy.get(':nth-child(3) > .grid-header > .-u-5-24').contains('209')
    cy.get('.content-panel > :nth-child(4) > .grid-header > .-u-5-24').contains('110')
    cy.get('.content-panel > :nth-child(5) > .grid-header > .-u-5-24').contains('70')
    cy.get('.content-panel > :nth-child(6) > .grid-header > .-u-5-24').contains('64')
    cy.get('.expanded > .grid-header > .-u-5-24').contains('33')
    cy.get('.expanded > ul > :nth-child(1) > .-u-5-24').contains('0')
    cy.get('.expanded > ul > :nth-child(2) > .-u-5-24 > .fl-button > .badge').contains('19')
    cy.get('.expanded > ul > :nth-child(3) > .-u-5-24 > .fl-button > .badge').contains('14')
});

it('Checking Reconcilation by day counts', function(){
    cy.get(':nth-child(3) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(3) > ul > :nth-child(1) > .-u-8-24').contains('Sunday, January 28, 2018')
    cy.get(':nth-child(3) > ul > :nth-child(1) > .-u-3-24 > .lnk-reconcile').contains('0/0')
    cy.get(':nth-child(3) > ul > :nth-child(1) > .-u-5-24 > .day-no-items').contains('0')
    cy.get(':nth-child(3) > ul > :nth-child(2) > .-u-8-24').contains('Monday, January 29, 2018')
    cy.get(':nth-child(3) > ul > :nth-child(2) > .-u-3-24 > .lnk-reconcile').contains('0/42')
    cy.get(':nth-child(3) > ul > :nth-child(2) > .-u-5-24 > .fl-button').should('be.visible')
    cy.get(':nth-child(3) > ul > :nth-child(2) > .-u-5-24 > .fl-button > .badge').contains('42')
    cy.get(':nth-child(3) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(3) > ul > :nth-child(2) > .-u-5-24 > .fl-button').should('not.be.visible')
});

it('Checking Reconcilation 2nd Row counts', function(){
    cy.get('.content-panel > :nth-child(4) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(4) > ul > :nth-child(2) > .-u-8-24').contains('Monday, February 5, 2018')
    cy.get(':nth-child(4) > ul > :nth-child(2) > .-u-3-24 > .lnk-reconcile').contains('0/61')
    cy.get(':nth-child(4) > ul > :nth-child(2) > .-u-5-24 > .fl-button').contains('Reconcile')
    cy.get(':nth-child(4) > ul > :nth-child(2) > .-u-5-24 > .fl-button > .badge').contains('61')
    cy.get('.content-panel > :nth-child(4) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(4) > ul > :nth-child(6) > .-u-8-24').should('not.be.visible')
});

it('Opening week carrots', function(){
    cy.get(':nth-child(5) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(5) > ul > :nth-child(4) > .-u-8-24').should('be.visible')
    cy.get(':nth-child(5) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(6) > .grid-header > .-u-1-24').click()
    cy.get(':nth-child(6) > ul > :nth-child(3) > .-u-5-24 > .fl-button').should('be.visible')
    cy.get(':nth-child(6) > .grid-header > .-u-1-24').click()
});

});