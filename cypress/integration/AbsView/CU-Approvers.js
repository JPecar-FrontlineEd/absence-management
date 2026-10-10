const fixtureFactory = require('../../helpers/fixtureHelper');
const RelatedConf = require('../../fixtures/AbsView/RelatedConf');
const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');
const AccountingCodes = require('../../fixtures/RptFilterData/AccountingCodes');
const Files = require('../../fixtures/AbsView/AbsFiles');
const AbsenceReasons = require('../../fixtures/AbsView/AbsenceReasons');
const AbsenceView = require('../../fixtures/AbsView/AbsView');
const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
const Paycodes = require('../../fixtures/RptFilterData/PayCodes');
const AbsenceLogData = require('../../fixtures/AbsView/AbsenceLog');
const Approvers = require('../../fixtures/AbsView/Approvers');

let fixtures;
describe('CU - Absence Approvers', function (){
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
      url: '/api/v1.0/absencerequests/224976352?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
      response: AbsenceView()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224976352/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
        response: RelatedConf()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224976352/Files',
        response: Files()
    })
    cy.route({
        method: 'GET',
        url: 'api/v1.0/workers/8323397/RelatedFiles?asOfDate=01/11/2018',
        response: RelatedFiles()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=5408&workId=8323397',
        response: AccountingCodes()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=5408&isVacancyType=false&workId=8323397',
        response: AbsenceReasons()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/budgetcodes',
        response: BudgetCodes()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/paycodes',
        response: Paycodes()
    })
    cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224976352/AbsenceLog',
        response: AbsenceLogData()
    })
    cy.route({
        method: 'GET',
        url: 'api/v1.0/absencerequests/224976352/Approvers',
        response: Approvers()
    })


    cy.visit('/absences/detail/224976352/approvers');

  });
  

it('Validating the absence log tab is appearing', function(){
    cy.get('.tabs > :nth-child(3)').contains('Approvers')
    .and('be.visible');
});

it('Checking the column headers', function(){
    cy.get('[ng-show="isLoaded && showHeader"] > .-u-14-24').contains('Name')
    .and('be.visible')
    cy.get('[ng-show="isLoaded && showHeader"] > .-u-6-24').contains('Receive Notifications')
    .and('be.visible')
    cy.get('[ng-show="isLoaded && showHeader"] > .-u-4-24').contains('Email Address')
    .and('be.visible')
    cy.get(':nth-child(1) > .group-row').contains('Approver Level: 1')
    cy.get(':nth-child(2) > .group-row').contains('Approver Level: 2')
});

it('Checking Approver list data', function(){
    cy.get('.row-0-0 > .-g > .-u-14-24').contains('Adams Middle School Administrator')
    cy.get('.row-0-0 > .-g > .-u-6-24 > .fa').should('be.visible')
    cy.get('.row-0-2 > .-g > .-u-14-24').contains('AutoCheck Checker')
    .and('be.visible')
    cy.get('.row-0-2 > .-g > .-u-4-24 > .fa').should('have.attr', 'href', 'mailto: email@email.com')
    cy.get('.row-1-0 > .-g > .-u-14-24').contains('Automation_4 CampusUser')
    .and('be.visible')
});

});
