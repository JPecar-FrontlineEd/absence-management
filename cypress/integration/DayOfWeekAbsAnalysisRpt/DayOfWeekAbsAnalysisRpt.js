const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceReasons = require('../../fixtures/RptFilterData/AbsenceReasons');
const VacancyProfiles = require('../../fixtures/RptFilterData/VacancyProfiles');
const SubstituteFilterList = require('../../fixtures/RptFilterData/SubstituteFilterList');
const EmployeeFilterList = require('../../fixtures/RptFilterData/EmployeeFilterList');
const VacancyReasonFilterList = require('../../fixtures/RptFilterData/VacancyReasons');
const DowRptData = require('../../fixtures/AbsenceData/DowReportDataList');

let fixtures;
describe('CU- Day of Week Absence Analysis', function (){
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
        url: 'api/v1.0/workers?fields=(id,firstName,lastName)&includeVacancies=true&includeWorkers=false',
        response: VacancyProfiles()
    })

    cy.route({
        method: 'GET',
        url: '/api/v1.0/AbsenceReasons?fields=(id,name,notesToAdminRequired)',
        response: AbsenceReasons()
    })

    cy.route({
        method: 'GET',
        url: '/api/v1.0/AbsenceReasons?fields=(id,name,notesToAdminRequired)&isVacancyType=true',
        response: VacancyReasonFilterList()
    })

    cy.visit('reports/absence/dow-absence-analysis');

  });

  it('Checking that the correct page has loaded', function(){
    cy.url().should('contain','reports/absence/dow-absence-analysis');
    cy.get('.cmpt-reports-switcher > .header').should('be.visible');
  });

  it('Checking Report Label', function(){
    cy.get('h3.ng-binding').contains('Day of Week Absence Analysis')
    .and('be.visible');
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

  it('Checking Filled, Unfilled, Sub Not needed filter state', function(){
    cy.get('.filled-status > :nth-child(1) > .checkbox').should('be.checked')
    .and('be.visible');
    cy.get('.filled-status > :nth-child(2) > .checkbox').should('be.checked')
    .and('be.visible');
    cy.get(':nth-child(3) > .checkbox').should('be.checked')
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

    it('Validating the user has Search and Print options', function(){
        cy.get('.fl-primary').contains('Search')
        .and('be.visible');
    });

    it('Running the Report',function(){
        cy.server()

        cy.route({
            method: 'GET',
            url: /\/api\/v1.0\/Absences\?absEntIds=&endDate=.*&fields=\(date,IsVacancy,entitlement\(name\),percentOfDay\)&includeAbsences=true&includeDeletedSubs=true&includeFilled=true&includeNoSubRequired=true&includeUnfilled=true&includeVacancies=true&instIds=&startDate=.*&subIds=&useAlwaysOnDb=true&vacEntIds=&vacProfIds=&wkIds=&wktIds=/,
            response: DowRptData()
        });
        cy.get('.fl-primary').click()
        cy.get('.header-content').contains('Day of Week Absence Analysis')
        .and('be.visible');
        cy.get('.print > .cmpt-ui-print-button').contains('Print')
        .and('be.visible');
    });

    it('Ensure bar graph area displays',function(){
        cy.get('.bar-graph-bars').should('be.visible');
        cy.get('[style="height: 100%; width: 13.4286%; left: 0%;"] > .bar-value').contains('18')
        .and('be.visible');
        cy.get('[style="height: 33.3333%; width: 13.4286%; left: 14.4286%;"] > .bar-value').contains('6')
        .and('be.visible');;
        cy.get('[style="height: 72.2222%; width: 13.4286%; left: 28.8571%;"] > .bar-value').contains('13')
        .and('be.visible');
        cy.get('[style="height: 83.3333%; width: 13.4286%; left: 43.2857%;"] > .bar-value').contains('15')
        .and('be.visible');
        cy.get('[style="height: 11.1111%; width: 13.4286%; left: 57.7143%;"] > .bar-value').contains('2')
        .and('be.visible');
        cy.get('[style="height: 0%; width: 13.4286%; left: 72.1429%;"] > .bar-value').contains('0')
        .and('be.visible');
        cy.get('[style="height: 0%; width: 13.4286%; left: 86.5714%;"] > .bar-value').contains('0')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(1)').contains('Monday')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(2)').contains('Tuesday')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(3)').contains('Wednesday')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(4)').contains('Thursday')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(5)').contains('Friday')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(6)').contains('Saturday')
        .and('be.visible');
        cy.get('.graph-day-labels > :nth-child(7)').contains('Sunday')
        .and('be.visible');
    });

    it('Ensuring the color key is available', function(){
        cy.get('.fl-hint').should('be.visible');
        cy.get('.EnforceNote2Admin > .ng-binding').contains('EnforceNote2Admin');
        cy.get('.Jury > .ng-binding').contains('Jury');
        cy.get('.PrintToPDF242 > .ng-binding').contains('PrintToPDF242');
        cy.get('.PrintToPDF559 > .ng-binding').contains('PrintToPDF559');
        cy.get('.PrintToPDF88 > .ng-binding').contains('PrintToPDF88');
        cy.get('.Illness > .ng-binding').contains('Illness');
        cy.get('.Personal > .ng-binding').contains('Personal');
        cy.get('.PrintToPDF528 > .ng-binding').contains('PrintToPDF528');
        cy.get('.PrintToPDF61 > .ng-binding').contains('PrintToPDF61');
        cy.get('.Training > .ng-binding').contains('Training');
    });

    it('Checking Data Grid headers', function(){
        cy.get('.header-content').contains('Day of Week Absence Analysis')
        .and('be.visible');
        cy.get('.group-row').contains('Absence Reasons')
        cy.get('[ng-show="isLoaded && showHeader"] > .Mon-th').contains('Mon')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Tue-th').contains('Tue')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Wed-th').contains('Wed')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Thu-th').contains('Thu')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Fri-th').contains('Fri')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Sat-th').contains('Sat')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Sun-th').contains('Sun')
        .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .Total-th').contains('Total')
        .and('be.visible');
    });

    it('Reviewing absence reason list', function(){
        cy.get('.grid-footer > .-u-8-24').scrollIntoView();
        cy.get('.row-0-0 > .-g > .-u-8-24').contains('EnforceNote2Admin')
        .and('be.visible');
        cy.get('.row-0-1 > .-g > .-u-8-24').contains('Illness')
        .and('be.visible');
        cy.get('.row-0-2 > .-g > .-u-8-24').contains('Jury')
        .and('be.visible');
        cy.get('.row-0-3 > .-g > .-u-8-24').contains('Personal Day')
        .and('be.visible');
        cy.get('.row-0-4 > .-g > .-u-8-24').contains('PrintToPDF242')
        .and('be.visible');
        cy.get('.row-0-5 > .-g > .-u-8-24').contains('PrintToPDF528')
        .and('be.visible');
        cy.get('.row-0-6 > .-g > .-u-8-24').contains('PrintToPDF559')
        .and('be.visible');
        cy.get('.row-0-7 > .-g > .-u-8-24').contains('PrintToPDF61')
        .and('be.visible');
        cy.get('.row-0-8 > .-g > .-u-8-24').contains('PrintToPDF88')
        .and('be.visible');
        cy.get('.row-0-9 > .-g > .-u-8-24').contains('Training')
        .and('be.visible');
        cy.get('.grid-footer > .-u-8-24').contains('Totals:')
        .and('be.visible');
    });

    it('Review First Row totals', function(){
        cy.get('.row-0-0 > .-g > .Mon-cell').contains('3')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Tue-cell').contains('0')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Wed-cell').contains('1')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Thu-cell').contains('2')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Fri-cell').contains('0')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Sat-cell').contains('0')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Sun-cell').contains('0')
        .and('be.visible');
        cy.get('.row-0-0 > .-g > .Total-cell').contains('6')
        .and('be.visible');
    });

    it('Reviewing Totals Row data', function(){
        cy.get('.SumMon-cell').contains('18')
        .and('be.visible');
        cy.get('.SumTue-cell').contains('6')
        .and('be.visible');
        cy.get('.SumWed-cell').contains('13')
        .and('be.visible');
        cy.get('.SumThu-cell').contains('15')
        .and('be.visible');
        cy.get('.SumFri-cell').contains('2')
        .and('be.visible');
        cy.get('.SumSat-cell').contains('0')
        .and('be.visible');
        cy.get('.SumSun-cell').contains('0')
        .and('be.visible');
        cy.get('.WeekTotal-cell').contains('54')
        .and('be.visible');
    });



}); 