const fixtureFactory = require('../../helpers/fixtureHelper');
const RelatedConf = require('../../fixtures/AbsView/RelatedConf');
const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');
const AccountingCodeCall = require('../../fixtures/AbsView/AccountingCodeCall');
const Files = require('../../fixtures/AbsView/AbsFiles');
const AbsenceReasons = require('../../fixtures/AbsView/AbsenceReasons');
const AbsenceView = require('../../fixtures/AbsView/AbsView');
const BudgetCodes = require('../../fixtures/AbsView/BudgetCodes');
const Paycodes = require('../../fixtures/AbsView/PayCodes');
const AbsenceLogData = require('../../fixtures/AbsView/AbsenceLog');
const Approvers = require('../../fixtures/AbsView/Approvers');

let fixtures;
describe('CU - Absence Log', function (){
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
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224976352/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
        response: RelatedConf()
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224976352/Files',
        response: Files()
    });
    cy.route({
        method: 'GET',
        url: 'api/v1.0/workers/8323397/RelatedFiles?asOfDate=01/11/2018',
        response: RelatedFiles()
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=5408&workId=8323397',
        response: AccountingCodeCall()
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=5408&isVacancyType=false&workId=8323397',
        response: AbsenceReasons()
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/budgetcodes',
        response: BudgetCodes()
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/paycodes',
        response: Paycodes()
    });
    cy.route({
        method: 'GET',
        url: '/api/v1.0/absencerequests/224976352/AbsenceLog',
        response: AbsenceLogData()
    });
    cy.route({
        method: 'GET',
        url: 'api/v1.0/absencerequests/224976352/Approvers',
        response: Approvers()
    });

    cy.visit('absences/detail/224976352/log/absence');
  });
  

it('Validating the absence log tab is appearing', function(){
    cy.get('.tabs > :nth-child(2)').contains('Absence Log')
    .and('be.visible');

});

it('Checking the column headers', function(){
    cy.get('.grid-header > .-u-8-24').contains('Description')
    .and('be.visible');
    cy.get('.who-th').contains('Who')
    .and('be.visible');
    cy.get('.where-th').contains('Where')
    .and('be.visible');
    cy.get('.date-th').contains('Date')
    .and('be.visible');
    cy.get('.status-th').contains('Status')
    .and('be.visible');
});

it('Checking log data', function(){
    cy.get('.row-6 > .-g > .-u-8-24').as('row6UpdatedInfo');
    cy.get('.row-0 > .-g > .-u-8-24 > .ng-binding').contains('Split from ID=224976235')
    .and('be.visible');
    cy.get('.row-0 > .-g > .where-cell').contains('Automated Process');
    cy.get('.row-0 > .-g > .date-cell').contains('1/8/2018 4:00:25 PM');
    cy.get('.row-0 > .-g > .status-cell').contains('Created');
    cy.get('.row-2 > .-g > .-u-8-24').contains('Absence Date 1/11/2018 Reconciled');
    cy.get('.row-2 > .-g > .who-cell').contains('CampusUser, Automation_4');
    cy.get('.row-2 > .-g > .where-cell').contains('Campus user web');
    cy.get('.row-2 > .-g > .date-cell').contains('2/12/2018 1:25:55 PM');
    cy.get('.row-2 > .-g > .status-cell').contains('Reconciled');
    cy.get('@row6UpdatedInfo').contains('Absence Reason:');
    cy.get('@row6UpdatedInfo').contains('From: EnforceNote2Admin');
    cy.get('@row6UpdatedInfo').contains('To: Personal Day');
    cy.get('@row6UpdatedInfo').contains('Budget Code:');
    cy.get('@row6UpdatedInfo').contains('From: Certified Teacher');
    cy.get('@row6UpdatedInfo').contains('To: Nursing Staff');
    cy.get('@row6UpdatedInfo').contains('TimeAbsence');
    cy.get('@row6UpdatedInfo').contains('From: 07:00');
    cy.get('@row6UpdatedInfo').contains('To: 01:00');
    cy.get('@row6UpdatedInfo').contains('Non-Pay Time');
    cy.get('@row6UpdatedInfo').contains('From: 00:00');
    cy.get('@row6UpdatedInfo').contains('To: 00:30');
});

});
