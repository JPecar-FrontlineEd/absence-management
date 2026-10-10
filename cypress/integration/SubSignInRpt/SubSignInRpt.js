const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceReasons = require('../../fixtures/SubSignInRpt/AbsenceReasons');
const VacancyProfiles = require('../../fixtures/SubSignInRpt/VacancyProfiles');
const SubstituteFilterList = require('../../fixtures/SubSignInRpt/SubstituteFilterList');
const EmployeeFilterList = require('../../fixtures/SubSignInRpt/EmployeeFilterList');
const VacancyReasonsFilterList = require('../../fixtures/SubSignInRpt/VacancyReasons');
const SubSignInSearchData = require('../../fixtures/SubSignInRpt/SubSignInSearchData');

let fixtures;
describe('CU- Substitute Sign In tests', function (){
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
    


    cy.visit('reports/absence/sub-sign-in');

  })

  it('Validating the correct page has loaded', function () {
    cy.get('h3.ng-binding').contains('Substitute Sign In')
    .and('be.visible');
    cy.get('.cmpt-reports-switcher > .header').contains('ABSENCE REPORTS')
    .and('be.visible');

  });

  it('Checking DATE RANGE SELECTOR', function () {
    cy.get('.date-range').contains('Date Range:')
    .and('be.visible');
    //future JTBD add a filter to change the date
   //cy.get('.date-range .date-picker:nth-child(2) input').type("{selectall}{backspace}01'/01'/2018");
  });


   
it('Checking the ABSENCES FILTER CHECKBOX', function() {
  cy.get('.employees > .cmpt-ui-multiselect > .label').should('be.visible');
  cy.get('.absenceReasons > .cmpt-ui-multiselect > .label').should('be.visible');
  cy.get('.absence-type > :nth-child(1) > .checkbox').click();
  cy.get('div.filter.employees.ng-scope.disabled').should('be.visible');
  cy.get('div.filter.absenceReasons.ng-scope.disabled').should('be.visible');
  cy.get('.absence-type > :nth-child(1) > .checkbox').click();
  cy.get('.employees > .cmpt-ui-multiselect > .label').should('be.visible');
  cy.get('.absenceReasons > .cmpt-ui-multiselect > .label').should('be.visible');

});

it('Validating data grid header label and begin search message', function(){
  cy.get('.header-content').contains('Substitute Sign In')
  .and('be.visible');
  cy.get('.no-data > ng-transclude > .ng-binding').contains('To begin, please perform a search above.')
  .and('be.visible');

})

it('Checking the vacancies filter', function() {
  cy.get('.vacancyReasons').should('be.visible');
  cy.get('.vacancyReasons').contains('All Vacancy Reasons');
  cy.get('.vacancyProfiles').should('be.visible');
  cy.get('.vacancyProfiles').contains('All Vacancy Profiles');
  cy.get('.ng-scope > .checkbox').click();
  cy.get('div.filter.vacancyReasons.ng-scope.disabled').should('be.visible');
  cy.get('div.filter.vacancyProfiles.ng-scope.disabled').should('be.visible');
  cy.get('.ng-scope > .checkbox').click();
  cy.get('.vacancyProfiles').should('be.visible');
  cy.get('.vacancyReasons').should('be.visible');

});

it('Validating School filter data and functionality', function(){
  cy.get('.schools').contains('All Schools')
  .and('be.visible');
  cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect').click();
  cy.get(':nth-child(6) > .nest-2').should('be.visible');
  cy.get(':nth-child(6) > .nest-2').click();
  cy.get('.schools').contains('Dawes Ave School');
  cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect').click();
  cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-valid').type('All Schools');
  cy.get('[ng-if="::!vm.multiselect"] > .ng-binding').contains('All Schools')
  .and('be.visible');
  cy.get('[ng-if="::!vm.multiselect"] > .ng-binding').click();
  cy.get('.schools').contains('All Schools')
  .and('be.visible');

});

it('Checking data column headers', function(){

  cy.server();

  cy.route({
    method: 'GET',
    url: /\/api\/v1.0\/Absences\?.*&endDate=.*&startDate=.*/,
    response: SubSignInSearchData()
  })

  cy.get('.fl-primary').click()
  cy.get('[ng-show="isLoaded && showHeader"] > .-u-6-24').contains('Substitute')
  .and('be.visible');
  cy.get('[ng-show="isLoaded && showHeader"] > .-u-7-24').contains('Signature')
  .and('be.visible');
  cy.get('[ng-show="isLoaded && showHeader"] > .-u-4-24').contains('Start/End')
  .and('be.visible');
  cy.get('[ng-show="isLoaded && showHeader"] > .-u-5-24').contains('Employee')
  .and('be.visible');
  cy.get('[ng-show="isLoaded && showHeader"] > .-u-2-24').contains('Conf. #')
  .and('be.visible');
  cy.get('.count').contains('36')
  .and('be.visible');

});




it('Validating EMPLOYEE FILTER functionality', function(){
  cy.get('.employees > .cmpt-ui-multiselect > .selector > .ui-multiselect').as('employeeButton');
  cy.get('.cmpt-reports-switcher > .filter').scrollIntoView();
  cy.get('.employees').contains('All Employees')
  .and('be.visible');
  cy.get('@employeeButton').click();
  cy.get('.employees > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search').should('be.visible');
  cy.get(':nth-child(8) > .nest-').contains('Abbott301, Shana')
  .and('be.visible');
  cy.get('#ms-employees-6').click();
  cy.get('@employeeButton').click();
  cy.get('.employees').contains('Abbott301, Shana')
  .and('be.visible');
  cy.get('@employeeButton').click();
  cy.get('#ms-employees-7').click();
  cy.get('@employeeButton').click();
  cy.get('.employees').contains('2 selected')
  .and('be.visible');
  cy.get('@employeeButton').click();
  cy.get('.employees > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-pristine').type('Abbott41');
  cy.get('#ms-employees-7').click();
  cy.get('.employees > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-valid').clear();
  cy.get('.employees > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-valid').type('Abbott301');
  cy.get('#ms-employees-6').click();
  cy.get('@employeeButton').click();

});

it('Checking EMPLOYEE TYPE filter', function(){
  cy.get('.employee-types').contains('All Employee Types')
  .and('be.visible');
  cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .type-label').contains('Employee Types')
  .and('be.visible');

});

it('Validating SUBSTITUTE FILTER functionality', function(){
  cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect').as('substitutesButton')
  cy.get('.substitutes').contains('All Substitutes')
  .and('be.visible');
  cy.get('@substitutesButton').contains('Substitutes')
  .and('be.visible');
  cy.get('@substitutesButton').click();
  cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(2) > .nest-').contains('6qt9LwSUB, Caevakybae')
  .and('be.visible');
  cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(2) > .nest-').contains('*')
  .and('be.visible');
  cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(3) > .nest-').contains('Cruickshank976, Lance')
  .and('be.visible');
  cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(4) > .nest-').contains('Cummerata358, Marjolaine')
  .and('be.visible');
  cy.get('#ms-substitutes-7').click();
  cy.get('.substitutes').contains('Cummerata854, Oda');
  cy.get('#ms-substitutes-7').click();
  cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click();
  
});

it('Checking Absence reasons filter functionality and data', function(){
  cy.get('.absenceReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect').as('absenceReasonsButton')
  cy.get('.absenceReasons').contains('All Absence Reasons')
  .and('be.visible');
  cy.get('@absenceReasonsButton').contains('Absence Reasons');
  cy.get('@absenceReasonsButton').click();
  cy.get('.absenceReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-valid').type('Nurse');
  cy.get('#ms-absenceReasons-43').click();
  cy.get('.absenceReasons').contains('Nurse');
  cy.get('#ms-absenceReasons-44').click();
  cy.get('.absenceReasons').contains('2 selected');
  cy.get('.absenceReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .view-all').click();
  cy.get('.absenceReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click();

});

it('Checking vacancy reasons filter functionality and data', function(){
  cy.get('.vacancyReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect').as('vacancyReasonsButton');
  cy.get('@vacancyReasonsButton').contains('Vacancy Reasons')
  .and('be.visible');
  cy.get('@vacancyReasonsButton').click();
  cy.get('.vacancyReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(3) > .nest-').contains('Transportation')
  .and('be.visible');
  cy.get('.vacancyReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(2) > .nest-').contains('Temp Position');
  cy.get('.vacancyReasons > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click();

});

it('Checking Vacancy Profile filter data', function() {
  cy.get('.vacancyProfiles').contains('All Vacancy Profiles')
  .and('be.visible');
  cy.get('.vacancyProfiles > .cmpt-ui-multiselect > .selector > .ui-multiselect').click();
  cy.get('.vacancyProfiles > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(2) > .nest-').contains('Test itinerant')
  .and('be.visible');
  cy.get('.vacancyProfiles > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .items > :nth-child(3) > .nest-').contains('US8544')
  .and('be.visible');
  cy.get('.vacancyProfiles > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click();

});

it('Ensuring the user has Order By options', function(){
  cy.get('.order-by').contains('Date')
  .and('be.visible');
  cy.get('.order-by').contains('Employee')
  .and('be.visible');
  cy.get('.order-by').contains('Order By:')
  .and('be.visible');
  cy.get('span.ng-scope > :nth-child(1) > .ng-pristine').check();
  cy.get('span.ng-scope > :nth-child(2) > .ng-pristine').check();
  cy.get('.print-page-breaks').contains('Print with Page Breaks')
  .and('be.visible');

})

it('Ensuring Search and Print options are available', function(){
  cy.get('.fl-primary').contains('Search')
  .and('be.visible');
  cy.get('.action-section > .print-pdf').contains('Print to PDF')
  .and('be.visible');

})

it('Validating the data has loaded', function(){
  cy.get('.row-0-0 > .-g > .-u-6-24').as('subColumnData');
  cy.get('@subColumnData').contains('Atlantic City HS');
  cy.get('@subColumnData').contains('Conor Reichert622');

})

it('Checking for signature line', function (){
  cy.get('div.line').should('be.visible');

})

it('Validating the correct start and end times', function(){
  cy.get('.row-0-0 > .-g > .-u-4-24').as('startEndTime');
  cy.get('@startEndTime').contains('07:00 AM - 03:00 PM')
  .and('be.visible');
  cy.get('@startEndTime').contains('Absence Reason:')
  .and('be.visible');
  cy.get('@startEndTime').contains('Personal Day')
  .and('be.visible');
})

it('Validating Absent employee information', function(){
  cy.get('.row-0-0 > .-g > .-u-5-24').as('employeeData');
  cy.get('@employeeData').contains('Abbott301, Shana')
  .and('be.visible');
  cy.get('@employeeData').contains('Teacher')
  .and('be.visible');

})

it('Validating confirmation number data', function(){
  cy.get('.row-0-0 > .-g > .-u-2-24').contains('224978007')
  .and('be.visible');

})

})