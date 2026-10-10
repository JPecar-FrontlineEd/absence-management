const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceReasons = require('../../fixtures/RptFilterData/AbsenceReasons');
const VacancyProfiles = require('../../fixtures/RptFilterData/VacancyProfiles');
const SubstituteFilterList = require('../../fixtures/RptFilterData/SubstituteFilterList');
const EmployeeFilterList = require('../../fixtures/RptFilterData/EmployeeFilterList');
const AbsMonthlySummaryData = require('../../fixtures/AbsenceData/AbsMonthlySummaryRptData');

let fixtures;
describe('CU- Absence Monthly Summary Report', function (){
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

    

    cy.visit('reports/absence/monthly-summary');

  });

  it('Checking that the correct page has loaded', function(){
    cy.url().should('contain','reports/absence/monthly-summary');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.month.ng-scope').should('be.visible');

  });

  it('Testing Month Selector integration', function(){
    cy.get('.month').should('be.visible');
    cy.get('.month > .date-select').as('monthSelector')
    cy.get('@monthSelector').select('January')
    cy.get('@monthSelector').should('contain','January')
    cy.get('@monthSelector').select('February')
    cy.get('@monthSelector').should('contain','February')
    cy.get('@monthSelector').select('March')
    cy.get('@monthSelector').should('contain','March')
    cy.get('@monthSelector').select('April')
    cy.get('@monthSelector').should('contain','April')
    cy.get('@monthSelector').select('May')
    cy.get('@monthSelector').should('contain','May')
    cy.get('@monthSelector').select('June')
    cy.get('@monthSelector').should('contain','June')
    cy.get('@monthSelector').select('July')
    cy.get('@monthSelector').should('contain','July')
    cy.get('@monthSelector').select('August')
    cy.get('@monthSelector').should('contain','August')
    cy.get('@monthSelector').select('September')
    cy.get('@monthSelector').should('contain','September')
    cy.get('@monthSelector').select('October')
    cy.get('@monthSelector').should('contain','October')
    cy.get('@monthSelector').select('November')
    cy.get('@monthSelector').should('contain','November')
    cy.get('@monthSelector').select('December')
    cy.get('@monthSelector').should('contain','December')
    cy.get('@monthSelector').select('December')
  });

  it('Testing Year Selector integration', function(){
    cy.get('.year').should('be.visible');
    cy.get('.year > .date-select').as('yearSelector')
    cy.get('@yearSelector').select('2017')
    cy.get('@yearSelector').should('contain','2017');
    cy.get('@yearSelector').select('2016')
    cy.get('@yearSelector').should('contain','2016');
    cy.get('@yearSelector').select('2015')
    cy.get('@yearSelector').should('contain','2015');
    cy.get('@yearSelector').select('2014')
    cy.get('@yearSelector').should('contain','2014');
  });

  it('Report switcher check', function(){
    cy.get('.cmpt-reports-switcher > .filter').should('be.visible');
  });

  it('Initial absence & vacancy filter state check', function(){
    cy.get('.absence-type > :nth-child(1) > .checkbox').as('absenceFilterCheckBox');
    cy.get('.ng-scope > .checkbox').as('vacancyFilterCheckBox')
    cy.get('@absenceFilterCheckBox').should('be.checked');
    cy.get('@absenceFilterCheckBox').should('be.visible');
    cy.get('@vacancyFilterCheckBox').should('be.checked');
    cy.get('@vacancyFilterCheckBox').should('be.visible')
  });

  it('Initial schools filter state check', function(){
    cy.get('.schools').contains('All Schools')
    .and('be.visible');
  });

    it('Initial Employee filter state check', function(){
        cy.get('.employees').contains('All Employees')
        .and('be.visible');
    });

    it('Initial Employee type filter state check', function(){
        cy.get('.employee-types').contains('All Employee Types')
        .and('be.visible');
    });


  it('Setting filter state for data integration tests', function(){
    cy.get('.year > .date-select').as('yearSelector');
    cy.get('.month > .date-select').as('monthSelector');
      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();
      if (currentMonth != 'March'){
        cy.get('@monthSelector').select('March')
      };
      if ('@yearSelector' != '2018'){
          cy.get('@yearSelector').select('2018')
      };
      
  });

  it('Running report', function(){
      cy.server()
      
      cy.route({
        method: 'GET',
        url: /\/api\/v1.0\/absencerequests\?endDate=.*&fields=\(isHeld,needSub,substitute\(id\),absences\(date\)\)&includeAbsences=true&includeApproved=true&includeDenied=false&includePartialApproved=true&includeUnApproved=true&includeVacancies=true&instIds=&startDate=.*&useAlwaysOnDb=true&userNameData=true&wkIds=&wktIds=/,
        response: AbsMonthlySummaryData()
    });
        cy.get('.fl-primary').click()
        cy.get('.header-content').contains('Absence Monthly Summary')
        cy.get('.absence-type').contains('Absences')
        .and('be.visible');
        cy.get('.absence-type').contains('Vacancies')
        .and('be.visible');
  });

  it('Checking data grid headers', function(){
    cy.get('.label > .ng-binding').contains('March 2018')
    cy.get('.sunday-th').contains('Sunday')
    .and('be.visible');
    cy.get('.monday-th').contains('Monday')
    .and('be.visible');
    cy.get('.tuesday-th').contains('Tuesday')
    .and('be.visible');
    cy.get('.wednesday-th').contains('Wednesday')
    .and('be.visible');
    cy.get('.thursday-th').contains('Thursday')
    .and('be.visible');
    cy.get('.friday-th').contains('Friday')
    .and('be.visible');
    cy.get('.saturday-th').contains('Saturday')
    .and('be.visible');
  });

  it('Ensuring date and day match with the grid', function(){
    cy.get('.row-0 > .-g > .sunday-cell > .summaryDay').contains('25')
    .and('be.visible');
    cy.get('.row-0 > .-g > .monday-cell > .summaryDay').contains('26')
    .and('be.visible');
    cy.get('.row-0 > .-g > .tuesday-cell > .summaryDay').contains('27')
    .and('be.visible');
    cy.get('.row-0 > .-g > .wednesday-cell > .summaryDay').contains('28')
    .and('be.visible');
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay').contains('1')
    .and('be.visible');
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay').contains('2')
    .and('be.visible');
    cy.get('.row-0 > .-g > .saturday-cell > .summaryDay').contains('3')
    .and('be.visible');
  });

  it('Grid data integration tests- Thursday Total', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > .total').as('totalRow')
    cy.get('@totalRow').contains('Total:')
    cy.get('@totalRow').contains('16')

  });

  it('Grid data integration tests- Thursday fill not needed', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > :nth-child(2)').as('fillNotNeededRow')
    cy.get('@fillNotNeededRow').contains('Fill NOT Needed:');
    cy.get('@fillNotNeededRow').contains('0');
  });

  it('Grid data integration tests- Thursday Fill Needed', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > :nth-child(3)').as('filledNeededRow')
    cy.get('@filledNeededRow').contains('Fill Needed:');
    cy.get('@filledNeededRow').contains('16');
  });

  it('Grid data integration tests- Thursday Filled', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > :nth-child(4)').as('filledRow')
    cy.get('@filledRow').contains('Filled:');
    cy.get('@filledRow').contains('4');
  });

  it('Grid data integration tests- Thursday Unfilled', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > :nth-child(5)').as('unfilledRow')
    cy.get('@unfilledRow').contains('UnFilled:')
    cy.get('@unfilledRow').contains('12')
  });

  it('Grid data integration tests- Thursday Held', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > :nth-child(6)').as('heldRow')
    cy.get('@heldRow').contains('Held:')
    cy.get('@heldRow').contains('0')
  });

  it('Grid data integration tests- Thursday Fill Rate', function(){
    cy.get('.row-0 > .-g > .thursday-cell > .summaryDay > .ng-scope > .group.highlight').as('fillRateRow')
    cy.get('@fillRateRow').contains('Fill Rate:');
    cy.get('@fillRateRow').contains('25%');
  });


  it('Grid data integration tests- Friday Total', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > .total').as('totalRow')
    cy.get('@totalRow').contains('Total:')
    cy.get('@totalRow').contains('16')

  });

  it('Grid data integration tests- Friday Fill Not Needed', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > :nth-child(2)').as('fillNotNeededRow')
    cy.get('@fillNotNeededRow').contains('Fill NOT Needed:');
    cy.get('@fillNotNeededRow').contains('0');
  });

  it('Grid data integration tests- Friday Fill Needed', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > :nth-child(3)').as('filledNeededRow')
    cy.get('@filledNeededRow').contains('Fill Needed:');
    cy.get('@filledNeededRow').contains('16');
  });

  it('Grid data integration tests- Friday Filled', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > :nth-child(4)').as('filledRow')
    cy.get('@filledRow').contains('Filled:');
    cy.get('@filledRow').contains('8');
  });

  it('Grid data integration tests- Friday Unfilled', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > :nth-child(5)').as('unfilledRow')
    cy.get('@unfilledRow').contains('UnFilled:')
    cy.get('@unfilledRow').contains('8')
  });

  it('Grid data integration tests- Friday Held', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > :nth-child(6)').as('heldRow')
    cy.get('@heldRow').contains('Held:')
    cy.get('@heldRow').contains('0')
  });

  it('Grid data integration tests- Friday Fill Rate', function(){
    cy.get('.row-0 > .-g > .friday-cell > .summaryDay > .ng-scope > .group.highlight').as('fillRateRow')
    cy.get('@fillRateRow').contains('Fill Rate:');
    cy.get('@fillRateRow').contains('50%');
  });

  it('Week Groupings data check', function(){
    cy.get('.weekData > .grid-header > .weekRange-th').scrollIntoView()
    cy.get('.weekData > .grid-rows > .row-0 > .-g > .weekRange-cell').contains('Mar 1')
    .and('be.visible');
    cy.get('.weekData > .grid-rows > .row-0 > .-g > .weekRange-cell').contains('-3')
    .and('be.visible');
    cy.get('.row-1 > .-g > .weekRange-cell').contains('Mar 4')
    .and('be.visible');
    cy.get('.row-1 > .-g > .weekRange-cell').contains('-10')
    .and('be.visible');
    cy.get('.row-2 > .-g > .weekRange-cell').contains('Mar 11')
    .and('be.visible');
    cy.get('.row-2 > .-g > .weekRange-cell').contains('-17')
    .and('be.visible');
    cy.get('.row-3 > .-g > .weekRange-cell').contains('Mar 18')
    .and('be.visible');
    cy.get('.row-3 > .-g > .weekRange-cell').contains('-24')
    .and('be.visible');
    cy.get('.row-4 > .-g > .weekRange-cell').contains('Mar 25')
    .and('be.visible');
    cy.get('.row-4 > .-g > .weekRange-cell').contains('-31')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekRange-cell').contains('Monthly Total:')
  });

  it('Summary Section data integration', function(){
    cy.get('.weekData > .grid-rows > .row-0 > .-g > .weekTotal-cell').contains('32')
    .and('be.visible');
    cy.get('.row-1 > .-g > .weekTotal-cell').contains('69')
    .and('be.visible');
    cy.get('.row-2 > .-g > .weekTotal-cell').contains('47')
    .and('be.visible');
    cy.get('.row-3 > .-g > .weekTotal-cell').contains('1')
    .and('be.visible');
    cy.get('.row-4 > .-g > .weekTotal-cell').contains('0')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekTotal-cell').contains('149')
    .and('be.visible');
  });

  it('Summary section header check', function(){
    cy.get('.weekData > .grid-header > .weekFillNotNeeded-th').contains('Fill NOT Needed')
    .and('be.visible');
    cy.get('.weekData > .grid-header > .weekFillNeeded-th').contains('Fill Needed')
    .and('be.visible');
    cy.get('.weekData > .grid-header > .weekFilled-th').contains('Filled')
    .and('be.visible');
    cy.get('.weekData > .grid-header > .weekUnFilled-th').contains('Unfilled')
    .and('be.visible');
    cy.get('.weekData > .grid-header > .weekHeld-th').contains('Held')
    .and('be.visible');
    cy.get('.weekData > .grid-header > .weekFillRate-th').contains('Fill Rate')
    .and('be.visible');
  });

  it('Summary Total Row data check', function(){
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekFillNotNeeded-cell').contains('0')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekFillNeeded-cell').contains('149')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekFilled-cell').contains('57')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekUnFilled-cell').contains('92')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekHeld-cell').contains('0')
    .and('be.visible');
    cy.get('.weekSummary > .grid-rows > .row-container > .-g > .weekFillRate-cell').contains('38.26%')
    .and('be.visible');
  });

  it('Checking for Print option', function(){
    cy.get('.header-content > .cmpt-ui-print-button').should('be.visible');
  });

});