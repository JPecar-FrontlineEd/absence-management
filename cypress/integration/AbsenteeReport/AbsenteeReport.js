
const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceReasons = require('../../fixtures/RptFilterData/AbsenceReasons');
const VacancyProfiles = require('../../fixtures/RptFilterData/VacancyProfiles');
const SubstituteFilterList = require('../../fixtures/RptFilterData/SubstituteFilterList');
const EmployeeFilterList = require('../../fixtures/RptFilterData/EmployeeFilterList');
const VacancyReasonsFilterList = require('../../fixtures/RptFilterData/VacancyReasons');
const AbsData = require('../../fixtures/AbsenteeReport/AbsData');


let fixtures;
describe('CU- Absentee Report tests', function (){
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
		url: '/api/v1.0/AbsenceReasons?fields=(id,name,notesToAdminRequired)',
		response: AbsenceReasons()
	})

    cy.route({
      method: 'GET',
      url: '/api/v1.0/workers?fields=(id,firstName,lastName)&includeVacancies=true&includeWorkers=false',
      response: VacancyProfiles()
    })
   
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
      url: '/api/v1.0/AbsenceReasons?fields=(id,name,notesToAdminRequired)&isVacancyType=true',
      response: VacancyReasonsFilterList()
    })
    


    cy.visit('/reports/absence/absentee');

  });

  it('Checking that the correct page loaded', function(){
    cy.url().should('contain','reports/absence/absentee');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.cmpt-reports-switcher.hide-print').contains('ABSENCE REPORTS')
    .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > h3').contains('Absentee Report');

  });

  it('Checking initial Absence & Vacancy filter state', function(){
    cy.get('.absence-type > :nth-child(1) > .checkbox').should('be.checked')
    .and('be.visible');
    cy.get('.ng-scope > .checkbox').should('be.checked')
  });

  it('Checking Filled, Unfilled, Sub Not needed filter state', function(){
    cy.get('.filled-status > :nth-child(1) > .checkbox').should('be.checked')
    .and('be.visible');
    cy.get('.filled-status > :nth-child(2) > .checkbox').should('be.checked')
    .and('be.visible');
    cy.get(':nth-child(3) > .checkbox').should('be.checked')
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

  it('Validating the Absence Reasons filter is set to all types', function(){
    cy.get('.absenceReasons').contains('All Absence Reasons')
    .and('be.visible');
  });

  it('Validating the Vacancy Reasons filter is set to all types', function(){
    cy.get('.vacancyReasons').contains('All Vacancy Reasons')
    .and('be.visible');
  });

  it('Validating the Vacancy Profile filter is set to All Profiles', function(){
    cy.get('.vacancyProfiles').contains('All Vacancy Profiles')
    .and('be.visible');
  });

  it('Confirming order by filter is set to Date', function(){
    cy.get('span.ng-scope > :nth-child(1) > .ng-pristine').should('be.checked')
    cy.get('span.ng-scope > :nth-child(2) > .ng-pristine').should('not.be.checked')
  });

  it('Confirming Print with Page breaks is not selected', function(){
    cy.get('.print-page-breaks > .ng-binding > .checkbox').should('not.be.selected')
  });

  it('Ensuring that no data has been loaded', function(){
    cy.get('.no-data > ng-transclude > .ng-binding').contains('To begin, please perform a search above.')
    .and('be.visible');
  });

  it('Checking data grid header text', function(){
    cy.get('.header-content').contains('Absentee Report')
  });


  it('Running the report', function(){
    cy.server()

    cy.route({
        method: 'GET',
		url: /\/api\/v1.0\/Absences\?absEntIds=&endDate=.*&fields=\(id,absrId,institution\(id,name\),date,lastUpdated,entitlement\(id,name\),shiftType,payCode\(description\),budgetCode\(description\),absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,absenceDuration,absenceBreakDuration,worker\(id,firstName,middleName,lastName,title,workerType\(title\)\),substitute\(id,firstName,middleName,lastName\),DeductBreakFromAbsenceDuration,IsHeld,NeedSub,IsVacancy,lastApprovedAction,startDate,endDate\)&includeAbsences=true&includeDeletedSubs=true&includeFilled=true&includeNoSubRequired=true&includeUnfilled=true&includeVacancies=true&instIds=&startDate=.*&subIds=&useAlwaysOnDb=true&vacEntIds=&vacProfIds=&wkIds=&wktIds=/,
		response: AbsData()
    })
   
    cy.get('.fl-primary').should('be.visible').click();
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div.summary-panel.expanded > div.bar.-g > div.title.-u-23-24.ng-binding').contains('Summary')
    .and('be.visible')
  });

  it('Checking total absence count', function(){
    cy.get('.count').contains('9')
    .should('be.visible')
  });

  it('Validating the correct column headers appear', function(){
    cy.get('.dateFormatted-th').contains('Date')
    .and('be.visible');    
    cy.get('.absrId-th').contains('Conf. #')
    .and('be.visible');
    cy.get('.name-th').contains('Name')
    .and('be.visible');
    cy.get('.institution-th').contains('School')
    .and('be.visible');
    cy.get('.grid-header > .-u-4-24').contains('Reason')
    .and('be.visible');
    cy.get('.duration-th').contains('Duration')
    .and('be.visible');
    cy.get('.substitute-th').contains('Substitute')
    .and('be.visible');
  });

  it('Checking date grouping header', function(){
    cy.get('.row-content > .group-title').contains('3/6/2018')
    .and('be.visible');

  });

  it('Validating date and conf# column data within the grid', function(){
    cy.get('.row-0 > .row-content > .-g > .dateFormatted-cell').contains('3/6/2018')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .absrId-cell > .cmpt-template-confirmation-link').contains('224981292')
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel.loaded > div > ul > li.row-container.row-0 > div > div.-g.grid-row > div.-u-3-24.absrId-cell.grid-cell.ng-scope > div.cmpt-template-confirmation-link.ng-isolate-scope > a').should('have.attr','href','/absences/detail/224981292/view')
    cy.get('.row-0 > .row-content > .-g > .absrId-cell > div.ng-scope').contains('Absence')
    .and('be.visible');
  });

  it('Validating the employee name data', function(){
    cy.get('.row-0 > .row-content > .-g > .name-cell > :nth-child(1) > .cmpt-template-worker-link > div.ng-scope > .ng-binding').contains('Vandervort827, Braxton')
    cy.get('.row-0 > .row-content > .-g > .name-cell > :nth-child(1) > .employee-type').contains('Teacher')
    .and('be.visible');
  });

  it('Data check for the School column', function(){
    cy.get('.row-0 > .row-content > .-g > .institution-cell > .sub-time').as('subTime');
    cy.get('.row-0 > .row-content > .-g > .institution-cell > .emp-time').as('employeeTime');
    cy.get('.row-0 > .row-content > .-g > .institution-cell > .school').contains('Atlantic City HS');
    cy.get('@employeeTime').contains('07:00 AM - 03:00 PM');
    cy.get('@employeeTime').contains('Emp: ');
    cy.get('@subTime').contains('07:30 AM - 03:30 PM');
    cy.get('@subTime').contains('Sub: ');
  });

  it('Validating the Reason column data', function(){
    cy.get('.row-0 > .row-content > .-g > .-u-4-24').contains('Personal Day')
    .and('be.visible');
  });

  it('Validating vacancy data presents correctly', function(){
    cy.get('.full-logo').scrollIntoView()
    cy.get('.row-7 > .row-content > .-g > .absrId-cell').contains('Vacancy')
    .and('be.visible');
    cy.get('.row-7 > .row-content > .-g > .absrId-cell > .cmpt-template-confirmation-link > .ng-binding').contains('224981365');
    cy.get('.row-7 > .row-content > .-g > .absrId-cell > .cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224981365/view')
    cy.get('.row-7 > .row-content > .-g > .-u-4-24 > :nth-child(1)').contains('(Vacancy Position)')
    .and('be.visible');
    cy.get('.row-7 > .row-content > .-g > .-u-4-24 > .budget-code > label').contains('Budget Code:')
    .and('be.visible');
    cy.get('.row-7 > .row-content > .-g > .-u-4-24 > .budget-code').contains('Certified Teacher')
    .and('be.visible');

});

it('Checking filled absence data', function(){
 cy.get('.substitute-cell > div.ng-scope').contains('Annabell Bogan772');
 cy.get('.row-4 > .row-content > .-g > .-u-4-24').contains('Pay Code:')
 cy.get('.row-4 > .row-content > .-g > .-u-4-24').contains(' PA Teaching Certificate')
});

it('Checking total data count', function(){
    cy.get('.summary-footer').contains('Total Absences/Vacancies: 9')
    .and('be.visible');
})

it('Changing the filter to order by employee', function(){
    cy.server()

    cy.route({
        method: 'GET',
		url: /\/api\/v1.0\/Absences\?absEntIds=&endDate=.*&fields=\(id,absrId,institution\(id,name\),date,lastUpdated,entitlement\(id,name\),shiftType,payCode\(description\),budgetCode\(description\),absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,absenceDuration,absenceBreakDuration,worker\(id,firstName,middleName,lastName,title,workerType\(title\)\),substitute\(id,firstName,middleName,lastName\),DeductBreakFromAbsenceDuration,IsHeld,NeedSub,IsVacancy,lastApprovedAction,startDate,endDate\)&includeAbsences=true&includeDeletedSubs=true&includeFilled=true&includeNoSubRequired=true&includeUnfilled=true&includeVacancies=true&instIds=&startDate=.*&subIds=&useAlwaysOnDb=true&vacEntIds=&vacProfIds=&wkIds=&wktIds=/,
		response: AbsData()
    })
   
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div.cmpt-reports-filter-panel.ng-isolate-scope > div.filter-section.hide-print > div.filter.order-by.ng-scope > div > span > label:nth-child(2) > input').check()
    cy.get('.fl-primary').should('be.visible').click();
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel.loaded > div > ul > li.row-container.row-0 > div > div.group-title.ng-scope').should('be.visible')
  });
 
  it('Validating the data when order by employee selected', function(){
    cy.get('.row-0 > .row-content > .-g > .absrId-cell > .cmpt-template-confirmation-link > .ng-binding').as('confNumLink')
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel.loaded > div > ul > li.row-container.row-0 > div > div.group-title.ng-scope').contains('Bergstrom223, Martine')
    .and('be.visible');
    cy.get('@confNumLink').contains('224981294')
    .and('be.visible');
    cy.get('@confNumLink').should('have.attr','href','/absences/detail/224981294/view')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .summary-footer').contains('Total Absences/Vacancies: 1')
    .and('be.visible');
    cy.get('.row-1 > .row-content > .group-title').contains('Boehm421, Trinity')
    .and('be.visible');
  });
});