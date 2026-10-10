const fixtureFactory = require('../../helpers/fixtureHelper');
const UnfilledAbsences = require('../../fixtures/Dashboard/DailyAbsences');

let fixtures;
describe('Dashboard Regression tests', function (){
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
			url: /\/api\/v1.0\/AbsenceRequests\/NeedApprovalCount\?endDate=.*startDate=.*/,
			response: {"data":{"needApprovalCount": 10 },"messages":[],"success":true,"modelState":{}}
		});

    cy.route({
      method: 'GET',
      url: /\/api\/v1.0\/AbsenceRequests\/ReconciliationCount\?endDate.*&startDate.*/,
      response: {"data":{"needsReconciliationCount": 30},"messages":[],"success":true,"modelState":{}}
    });
   
    cy.route({
      method: 'GET',
      url: /\/api\/v1.0\/absencerequests\?fields=\(.*\)&includeAllDateAbsences=false&.*useAlwaysOnDb=true/,
      response: UnfilledAbsences()
    });

    cy.route({
      method: 'GET',
      url: '/api/v1.0/absencerequests/1234?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
      response: {"data":[],"messages":["Invalid Absence request Id."],"success":false,"modelState":{}}
    });

    cy.route({
      method: 'GET',
      url: '/api/v1.0/absencerequests/1234/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
      response: {"data":[],"messages":["Invalid Absence request Id."],"success":false,"modelState":{}}
    });
    
    cy.visit('/');

  });
  
  it('Verify unfilled Absence Data', function() {
    cy.get('label > ng-transclude > .ng-binding').contains('Summary for:')
      .and('be.visible');
    cy.get('.header-content').click();
    //cy.get('.row-2 > .row-content > .-g > .firstShift-cell > .cmpt-template-shift-types > .icon-container > .duration-Icon').should('be.visible')
    cy.get('.header-content > .label').should('be.visible');
    cy.get('.header-content > .label').contains('Unfilled');
    cy.get('.unfilled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').should('be.visible');
    cy.get('.unfilled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').contains('3');
    cy.get('.row-0 > .row-content > .-g > .firstReason-cell > .multi-value').contains('Sick with Balances > Sick');
    cy.get('.row-0 > .row-content > .-g > .id-cell > .cmpt-template-confirmation-link > .ng-binding').contains('224975429');
    cy.get('.row-0 > .row-content > .-g > .id-cell > .sub-title').contains('Absence');
    cy.get('.row-0 > .row-content > .-g > .workerName-cell').contains('FAIRCLOTH, DON');
    cy.get('.row-0 > .row-content > .-g > .workerName-cell > .sub-title').contains('AUTOMOTIVE TCHER LHS');
    });

  it('Verify filled absence data', function() {
    cy.get('.filled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').contains('1')
    cy.get('.filled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').click();
    cy.get('.cmpt-template-confirmation-link > .ng-binding').should('be.visible');
    cy.get('.cmpt-template-confirmation-link > .ng-binding').contains('234975515');
    cy.get('.workerName-cell').contains('SILVER, BEN');
    cy.get('.firstInstitution-cell > .multi-value').contains('Bohs Elementary Schools');
    cy.get('.cmpt-template-substitute-link > .ng-binding').contains('SHAWN TAYLOR');
    cy.get('.id-th').contains('Conf #')
      .and('be.visible');
    cy.get('.workerName-th').contains('Name')
      .and('be.visible');
    cy.get('.firstInstitution-th').contains('School')
      .and('be.visible');
    cy.get('.firstReason-th').contains('Reason')
      .and('be.visible');
    cy.get('.firstShift-th').contains('Shift')
      .and('be.visible');
    cy.get('.substitute-th').contains('Substitute')
      .and('be.visible') ;
    cy.get('.codes-th').contains('Codes')
      .and('be.visible');
    cy.get('.created-th').contains('Created') 
      .and('be.visible');
    cy.get('.approval-th').should('be.visible');
  });

  it('Verify no sub required data', function(){
    cy.get('.header-content > .count').contains('1');
    cy.get('.noSub-Absences > .content > .count').click();
    cy.get('.noSub-Absences > .content > .count').contains('1')
      .and('be.visible')
    cy.get('.id-th').contains('Conf #')
      .and('be.visible');
    cy.get('.workerName-th').contains('Name')
      .and('be.visible');
    cy.get('.firstInstitution-th').contains('School')
      .and('be.visible');
    cy.get('.firstReason-th').contains('Reason')
      .and('be.visible');
    cy.get('.firstShift-th').contains('Shift')
      .and('be.visible');
    cy.get('.codes-th').contains('Codes')
      .and('be.visible');
    cy.get('.created-th').contains('Created') 
      .and('be.visible');
    cy.get('.approval-th').should('be.visible');
    cy.get('.header-content > .label').contains('No Sub Required');
    cy.get('.fa-long-arrow-right').should('be.visible');
    cy.get('.cmpt-template-confirmation-link > .ng-binding').contains('224976352');
    cy.get('.workerName-cell').contains('Fahey483, Ariane');
    cy.get('.firstInstitution-cell > .multi-value').contains('Adams Middle School');
    cy.get('.firstReason-cell > .multi-value').contains('EnforceNote2Admin');
    cy.get('.created-cell > .date').contains('1/8/2018');
    cy.get('.budget-code').contains('Certified Teacher')
      .and('be.visible');
    cy.get('.pay-code').contains('None')
      .and('be.visible');
  });

  it('Checking for quick actions buttons', function() {
    cy.get('.title').contains('Quick Actions');
    cy.get('a.quick-button').contains('Create Absence')
      .and('be.visible');
    cy.get('a.quick-button').should('have.attr','href','/absences/create-absence');
    cy.get('a.quick-button').contains('Create Vacancy').should('have.attr','href','/absences/create-vacancy')
      .and('be.visible');
    cy.get('a.quick-button').contains('Approve')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.top-section.main > div.right-column > div > div > div:nth-child(5) > a:nth-child(1)').should('have.attr','href','/absences/approve');
    cy.get('[ng-show="havePermission(\'ABSRAPPRVL.ApproveDeny\')"] > .badge > .ng-binding').contains('10')
    cy.get('a.quick-button').contains('Reconcile')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.top-section.main > div.right-column > div > div > div:nth-child(5) > a:nth-child(2)').should('have.attr','href','/absences/reconcile');
    cy.get('[ng-show="havePermission(\'ABSR.Approve\')"] > .badge > .ng-binding').contains('30');
    cy.get('[ng-show="havePermission(\'ABSRAPPRVL.ApproveDeny\')"] > .badge-caption').contains('in the next 45 days')
      .and('be.visible');
    cy.get('[ng-show="havePermission(\'ABSR.Approve\')"] > .badge-caption').contains('in the past 30 days')
      .and('be.visible');
  });

  it('Checking for the correct column headers', function(){
    cy.get('.id-th').contains('Conf #')
    .and('be.visible');
    cy.get('.workerName-th').contains('Name')
    .and('be.visible');
    cy.get('.firstInstitution-th').contains('School')
    .and('be.visible');
    cy.get('.firstReason-th').contains('Reason')
    .and('be.visible');
    cy.get('.firstShift-th').contains('Shift')
    .and('be.visible');
    cy.get('.created-th').contains('Created') 
    .and('be.visible');
  });

  it('Checking Search validation',function() {

    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/v1.0/absencerequests/1234?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
      response: {"data":[],"messages":["Invalid Absence request Id."],"success":false,"modelState":{}}
    });

    cy.route({
      method: 'GET',
      url: '/api/v1.0/absencerequests/1234/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
      response: {"data":[],"messages":["Invalid Absence request Id."],"success":false,"modelState":{}}
    });

    cy.get('span > .fa').trigger('mouseover');
    cy.get('#qtip-1-content.qtip-content').contains('We are currently only supporting Search by Confirmation Number');
    cy.get('span > .fa').trigger('mouseout');
    cy.get('a.full').contains('Search');
    cy.get('.fl-search > .fl-input').focus();
    cy.get('.fl-search > .fl-input').type('aaa');
    cy.get('.full').click();
    cy.get('.toast').should('be.visible');
    cy.get('.toast').contains('Please supply a valid confirmation number');
    cy.get('.toast > .fa').click();
    cy.get('.fl-search > .fl-input').focus().clear();
    cy.get('.fl-search > .fl-input').focus();
    cy.get('.fl-search > .fl-input').type('1234');
    cy.get('.full').click();
    cy.get('.toast').should('be.visible');
    cy.get('.toast-message').contains('Invalid Absence request Id.');
    cy.get('.toast > .fa').click();
    cy.get('.fl-search > .fl-input').focus().clear();
  });
    
  it('Check Summary section count information', function(){
    cy.get('.total-Absences').should('be.visible');
    cy.get('.total-Absences').contains('5');
    cy.get('.unfilled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').should('be.visible');
    cy.get('.unfilled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').contains('3');
    cy.get('.filled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').should('be.visible');
    cy.get('.filled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .count').contains('1');
    cy.get('.noSub-Absences').should('be.visible');
    cy.get('.noSub-Absences').contains('1');
    cy.get('.unfilled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .percent').should('be.visible');
    //cy.get('.unfilled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .percent').contains('[75.0%]');
    cy.get('.filled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .percent').should('be.visible');
    //cy.get('.filled-Absences > .cmpt-ui-rad-gauge > .display > span > ng-transclude > .content > .percent').contains('25.0%');
  });

  it('Ensuring absence and vacancies options are checked on load', function(){
    cy.get('.absence-vacancy > :nth-child(1) > .ng-pristine').should('be.checked');
    cy.get(':nth-child(2) > .ng-pristine').should('be.checked');
  });

  it('Checking visibility for the correct school list data', function(){
    cy.get('.left-align > .cmpt-ui-multiselect > .label').contains('All Schools')
    cy.get('.left-align > .cmpt-ui-multiselect > .selector > .ui-multiselect > .ui-icon').click();
    cy.get('.left-align > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-pristine').focus();
    cy.get('.left-align > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-pristine').type('Bush Elementary');   
   // cy.get('.left-align > .cmpt-ui-multiselect > .selector > .ui-multiselect').click() ;
    //cy.get('.left-align > .cmpt-ui-multiselect > .selector > .ui-multiselect').invoke('show');
  });
    });
  
    