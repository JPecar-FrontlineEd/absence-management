const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceReasons = require('../../fixtures/RptFilterData/AbsenceReasons');
const SubstituteFilterList = require('../../fixtures/RptFilterData/SubstituteFilterList');
const EmployeeFilterList = require('../../fixtures/RptFilterData/EmployeeFilterList');
const AbsApprovalStatusRptAbsData = require('../../fixtures/AbsenceData/AbsApprovalStatusRptAbsData');

let fixtures;
describe('CU- Absence Approval Status Report', function (){
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
        url: '/api/v1.0/workers?fields=(id,firstName,lastName,isActive)&includeInactive=true',
        response: EmployeeFilterList()
    })

    cy.route({
        method: 'GET',
        url: '/api/v1.0/substitutes?fields=(id,firstName,middleName,lastName,isActive)',
        response: SubstituteFilterList()
    })

    
    cy.route({
        method: 'GET',
        url: '/api/v1.0/AbsenceReasons?fields=(id,name,notesToAdminRequired)',
        response: AbsenceReasons()
    })

    cy.visit('/reports/absence/approval-status');

    cy.url().should('contain','/reports/absence/approval-status');
    cy.get('h3.ng-binding').contains('Absence Approval Status')
    .and('be.visible');

  });


  it('Validating the school filter is set to all locations', function(){
    cy.get('.schools').contains('All Schools')
    .and('be.visible');
  });

  it('Validating the Employee filter is set to all employees', function(){
    cy.get('.employees').contains('All Employees')
    .and('be.visible');
  });

  it('Validating the Employee Type filter is set to all types', function(){
    cy.get('.employee-types').contains('All Employee Types')
    .and('be.visible');
  });

  it('Validating the Substitutes filter is set to all types', function(){
    cy.get('.substitutes').contains('All Substitutes')
    .and('be.visible');
  });

  it('Validating the select another report dropdown is available', function(){
    cy.get('.cmpt-ui-dropdown > .ng-empty').should('be.visible');
  });

  it('Ensuring that no data has been loaded', function(){
    cy.get('.no-data > ng-transclude > .ng-binding').contains('To begin, please perform a search above.')
    .and('be.visible');
  });

  it('Validating the initial fill status filter state', function(){
    cy.get('.filled-status').contains('Filled')
    .and('be.visible');
    cy.get('.filled-status > :nth-child(1) > .checkbox').should('be.checked');
    cy.get('.filled-status').contains('Unfilled')
    .and('be.visible');
    cy.get('.filled-status > :nth-child(2) > .checkbox').should('be.checked');
    cy.get('.filled-status').contains('Sub Not Needed')
    .and('be.visible');
    cy.get('.filled-status > :nth-child(3) > .checkbox').should('be.checked');

  });

  it('Validating initial Approval filter state', function(){
    cy.get('.approval-status').contains('Unapproved')
    cy.get('.approval-status > :nth-child(1) > .checkbox').should('be.checked');
    cy.get('.approval-status').contains('Approved')
    cy.get('.approval-status > :nth-child(2) > .checkbox').should('be.checked');
    cy.get('.approval-status').contains('Denied')
    cy.get('.approval-status > :nth-child(3) > .checkbox').should('be.checked');
    cy.get('.approval-status').contains('Partially Approved')
    cy.get('.approval-status > :nth-child(4) > .checkbox').should('be.checked');

  });

  it('Ensuring user has search and print options', function(){
    cy.get('.fl-primary').contains('Search')
    .and('be.visible');
    cy.get('.print > .cmpt-ui-print-button')
    .and('be.visible');

  });

  it('Running the Report and checking data grid headers', function(){
    cy.server()
    
    cy.route({
        method: 'GET',
        url: /\/api\/v1.0\/absencerequests\?absEntIds=&endDate=.*&fields=\(id,startDate,endDate,worker\(id,firstName,middleName,lastName,title,workerType\(title\)\),substitute\(id,firstName,middleName,lastName\),absences\(id,entitlement\(name\)\),closedDayAbsences\(id,entitlement\(name\)\),lastApprovedAction,requiresApproval,isApproved,pendingApproved,isDenied,isPartiallyApproved,approverName\)&includeAbsences=true&includeAllDateAbsences=true&includeApproved=true&includeDenied=true&includeFilled=true&includeNoApprovalRequired=false&includeNoSubRequired=true&includePartialApproved=true&includeUnApproved=true&includeUnfilled=true&includeVacancies=false&instIds=&startDate=.*&subIds=&useAlwaysOnDb=true&userNameData=true&wkIds=&wktIds=/,
        response: AbsApprovalStatusRptAbsData()
    })
    cy.get('.fl-primary').click();
    cy.get('.header-content').contains('Absence Approval Status')
    .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.header > div > div.count.ng-binding.loaded').contains('11')
    .and('be.visible');

  });

  it('Validating report column headers', function(){
    cy.get('.dateRange-th').contains('Date')
    .and('be.visible');
    cy.get('.id-th').contains('Conf. #')
    .and('be.visible');
    cy.get('.grid-header > .-u-5-24').contains('Name')
    .and('be.visible');
    cy.get('.reason-th').contains('Reason')
    .and('be.visible');
    cy.get('.substitute-th').contains('Substitute')
    .and('be.visible');
    cy.get('.grid-header > .-u-3-24').contains('Status')
    .and('be.visible');
    cy.get('.approvals-th').contains('Approvals')
    .and('be.visible');
  });

  it('Validating Report Date data', function(){
    cy.get('.row-0 > .-g > .dateRange-cell').contains('3/12/2018')
    .and('be.visible');
  });

  it('Validating Report Confirmation # data', function(){
    cy.get('.row-0 > .-g > .id-cell').as('confNumberCell')
    cy.get('@confNumberCell').contains('224981661')
    .and('be.visible');
    cy.get('.row-0 > .-g > .id-cell > .cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224981661/view');
  });

  it('Validating Report Name and Employee type data', function(){
    cy.get('.row-0 > .-g > .-u-5-24').as('nameCell')
    cy.get('@nameCell').contains('Teacher')
    .and('be.visible');
    cy.get('@nameCell').contains('Tromp455, Consuelo')
    .and('be.visible');
    });

  it('Validating report Reason column data', function(){
    cy.get('.row-0 > .-g > .reason-cell').as('absReasonCell')
    cy.get('@absReasonCell').contains('Personal Day')
    .and('be.visible');
    cy.get('@absReasonCell').contains('Number Of Days: ')
    .and('be.visible');
    cy.get('@absReasonCell').contains('1')
    .and('be.visible');

  });

  it('Validating substitute column data', function(){
    cy.get('.row-1 > .-g > .substitute-cell').contains('Dan Cooper')
    .and('be.visible');
    cy.get('.row-1 > .-g > .substitute-cell > div.ng-scope > .cmpt-template-substitute-link > .ng-binding').should('not.be','visibile')
  });

  it('Validating Status Column data', function(){
    cy.get('.row-5 > .-g > .-u-3-24').contains('Approved')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-3-24').contains('Unapproved')
    .and('be.visible');
    
  });

  it('Validating the approvals column data', function(){
    cy.get('.row-5 > .-g > .approvals-cell').as('approvalCell');
    cy.get('@approvalCell').contains('Automation_2 CampusUser')
    .and('be.visible');
    cy.get('@approvalCell').contains('3/10/2018 06:06 AM')
    .and('be.visible');
  });

  it('Checking multi-day abs information', function(){
    cy.get('.row-10 > .-g > .dateRange-cell').as('dateCell')
    cy.get('@dateCell').scrollIntoView();
    cy.get('@dateCell').contains('3/12/2018 - 3/18/2018')
    .and('be.visible');
    cy.get('.row-10 > .-g > .reason-cell').contains('2')
    .and('be.visible');
    cy.get('.row-10 > .-g > .-u-3-24').contains('Partially Approved');
  });

  it('Checking for locked header Print option', function(){
    cy.get('.header-content > .cmpt-ui-print-button').contains('Print')
    .and('be.visible');
  });

});