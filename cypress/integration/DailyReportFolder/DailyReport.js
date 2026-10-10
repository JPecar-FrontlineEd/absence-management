const fixtureFactory = require('../../helpers/fixtureHelper');
const DailyReportAbsenceList = require('../../fixtures/DailyReport/DailyReportAbsData')

let fixtures;
describe('CU- Daily Report', function (){

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
        url: /\/api\/v1.0\/absencerequests\?fields=\(.*?\)&includeAbsences=true&includeAllDateAbsences=false&includeAllInstAbsences=true&includeClosed=false&includeClosedDays=true&includeDeleted=false&includeDeletedWorkers=false&includeVacancies=true&instIds=&startDate=.*?&useAlwaysOnDb=true&wktIds=/,
        response: DailyReportAbsenceList()
    });

    cy.visit('reports/absence/daily-report?date=01%2F12%2F2018');

 });

 it('Checking headers to make sure the correct page and information has loaded', function() {
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.cmpt-reports-switcher.hide-print > div').contains('ABSENCE REPORTS');
    cy.get('h3.ng-binding').should('be.visible') ;
    cy.get('h3.ng-binding').contains('Daily Report:');
    cy.get('.bar > .title').contains('Summary');
    cy.get('.cmpt-reports-switcher > .header').contains('ABSENCE REPORTS');
 });

it('Checking Date filter section options', function(){
    cy.get('.previous').should('be.visible');
    cy.get('.today').contains('Today')
    .and('be.visible');
    cy.get('.next').should('be.visible');
});

it('Checking absence and vacancy filters', function(){
    cy.get(':nth-child(1) > .checkbox').should('be.enabled');//absence
    cy.get('.absence-type > :nth-child(1)').contains('Absences')
    .and('be.visible');
    cy.get('.ng-scope > .checkbox').should('be.enabled');//vacancy
    cy.get('.absence-type > .ng-scope').contains('Vacancies')
    .and('be.visible');
});

it('Checking for the correct school filter data', function() {
    cy.get('.schools').contains('All Schools')
    .and('be.visible');
    cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect').contains('Schools')
    .and('be.visible');
    cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect').click();
    cy.get('[ng-if="::!vm.multiselect"] > .ng-binding').contains('All Schools');
    cy.get('.nest-0').contains('Bohs TSD')
    .and('be.visible');
    cy.get(':nth-child(4) > .nest-1').contains('Bohs Elementary Schools');
    cy.get(':nth-child(5) > .nest-2').contains('Bush Elementary');
    cy.get(':nth-child(6) > .nest-2').contains('Dawes Ave School')
    .and('be.visible');
    cy.get(':nth-child(7) > .nest-2').contains('Franklin Elementary');
    cy.get(':nth-child(8) > .nest-2').contains('Hamilton Elementary');
    cy.get(':nth-child(9) > .nest-2').contains('Jordan road School')
    .and('be.visible');
    cy.get(':nth-child(10) > .nest-2').contains('New York Ave. School');
    cy.get(':nth-child(11) > .nest-2').contains('Polk Elementary');
    cy.get(':nth-child(12) > .nest-2').contains('Washington Elementary');
    cy.get(':nth-child(13) > .nest-1').contains('Bohs High Schools');
    cy.get(':nth-child(14) > .nest-2').contains('Atlantic City HS');
    cy.get(':nth-child(15) > .nest-2').contains('Jefferson High');
    cy.get(':nth-child(16) > .nest-2').contains('Mainland Regional HS');
    cy.get(':nth-child(17) > .nest-2').contains('MillVill Valley HS');
    cy.get(':nth-child(18) > .nest-2').contains('Ocean City HS');
    cy.get(':nth-child(19) > .nest-1').contains('Bohs Middle Schools');
    cy.get(':nth-child(20) > .nest-2').contains('Adams Middle School');
    cy.get(':nth-child(21) > .nest-2').contains('Hoover Middle');
    cy.get(':nth-child(22) > .nest-2').contains('MillVill Valley HS');
    cy.get(':nth-child(23) > .nest-2').contains('Roosevelt Intermediate');
});

it('Validating School Search', function(){
    cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-pristine').should('be.visible');
    cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-pristine').type('Hamilton Elementary');
    cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click();

});

it('Checking View filter functionality', function(){
    cy.get('.btn-list-view > .icon').should('be.visible');
    cy.get('.btn-tab-view > .icon').should('be.visible');
    cy.get('.active > .header > .header-content').should('be.visible');
    cy.get('.active > .header > .header-content > .count').contains('6')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .id-cell').contains('224976441')
    .and('be.visible');
    cy.get(':nth-child(2) > .header > .header-content').contains('Filled')
    .and('be.visible');
    cy.get('.btn-tab-view > .icon').click();
    cy.get('#report-lock-header').should('be.visible');
    cy.get('.btn-list-view > .icon').click();
    cy.get('#report-lock-header').should('not.be.visible');
    cy.get('.views > .fa').trigger('mouseover')
    cy.get('.tab-view .description').contains('View results in a tabular view for quick access to each absence type')
    .and('be.visible');
    cy.get('.list-view .description').contains('View all results on one page.')
    .and('be.visible');
    cy.get('.views > .fa').trigger('mouseout');
});

it('Checking Employee type filter and data', function(){
    cy.get('.employee-types').contains('All Employee Types')
    .and('be.visible');
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect').contains('Employee Types')
    .and('be.visible');
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect').click()
    cy.get(':nth-child(2) > .nest-').contains('Admin')
    .and('be.visible');
    cy.get(':nth-child(3) > .nest-').contains('Food Service')
    .and('be.visible');
    cy.get(':nth-child(4) > .nest-').contains('Nurse')
    .and('be.visible');
    cy.get(':nth-child(5) > .nest-').contains('Staff')
    .and('be.visible');
    cy.get(':nth-child(6) > .nest-').contains('Teacher')
    .and('be.visible');
    cy.get(':nth-child(7) > .nest-').contains('Tester')
    .and('be.visible');
    cy.get(':nth-child(8) > .nest-').contains('Transportation')
    .and('be.visible');
});

it('Validating employee type dropdown filter check box functionality', function(){
    cy.get('.employee-types .cmpt-ui-multiselect .dropdown .list-item')
        .contains('Admin')
        .click();
    cy.get('.employee-types .cmpt-ui-multiselect .dropdown .list-item')
        .contains('Staff')
        .click();
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click()
    cy.get('.employee-types .cmpt-ui-multiselect .dropdown .list-item').should('not.be.visible');
    cy.get('.employee-types > .cmpt-ui-multiselect > .label').contains('2 selected');
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect').click();
    cy.get('.employee-types .cmpt-ui-multiselect .dropdown .list-item')
    .contains('Admin')
    .click();
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .view-all').click()
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click()
    cy.get('.employee-types > .cmpt-ui-multiselect > .label').contains('All Employee Types');
    cy.get('.employee-types .cmpt-ui-multiselect .dropdown .list-item').should('not.be.visible');
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect').click();
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .ng-valid').type('Staff')
    cy.get(':nth-child(5) > .nest-').contains('Staff')
    .and('be.visible');
    cy.get(':nth-child(7) > .nest-').contains('Tester')
    .and('not.be.visible');
    cy.get('.employee-types > .cmpt-ui-multiselect > .selector > .ui-multiselect > .dropdown > :nth-child(1) > .search > .dropdown-filter > .fa').click();
});

it('Checking group by filter', function(){
    cy.get('.group-by').contains('Group By');
    cy.get('.group-title > .ng-binding').contains('Teacher')
    .and('be.visible');
    cy.get('.group-by').find('.ng-pristine').select('None');
    cy.get('.group-title > .ng-binding').should('not.be.visible');
});

it('Checking for Search and Print options', function(){
    cy.get('.fl-primary').contains('Search')
    .and('be.visible');
    cy.get('.print > .cmpt-ui-print-button').contains('Print')
    .and('be.visible');
});

it('Validating Summary legend content', function(){
    cy.get('.legend-header').contains('Reading the Report:')
    .and('be.visible');   
    cy.get('.legend').contains('Filled')
    .and('be.visible');
    cy.get('.legend').contains('Unfilled')
    .and('be.visible');
    cy.get('.legend').contains('No Fill Needed')
    .and('be.visible');
    //checking Summary carat
    cy.get('.collapsable').click();
    cy.get('.graph-summary-content > .header').should('not.be.visible');
    cy.get('.collapsable').click();
});

it('Validating Summary Totals information', function(){
    cy.get('.graph-summary-content > .date').contains('Friday, January 12, 2018')
    .and('be.visible');
    cy.get('.graph-summary-content > :nth-child(3)').contains('Total:')
    .and('be.visible');
    cy.get('.graph-summary-content > :nth-child(3)').contains('12')
    .and('be.visible');
    cy.get('.fill-rate').contains('Fill Rate:')
    .and('be.visible');
    cy.get('.fill-rate').contains('50.0%')
    .and('be.visible');
});

it('Checking Unfilled column headers', function (){
    cy.get('.btn-list-view > .icon').click();
    cy.get('.active > .header > .header-content > .count').contains('6')
    .and('be.visible');
    cy.get('.active > .header > .header-content').contains('Unfilled')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .id-th').contains('Conf #')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .workerName-th').contains('Name')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .firstInstitution-th').contains('School')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .firstReason-th').contains('Reason')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .firstShift-th').contains('Shift')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .approval-th').contains('Status')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .created-th').contains('Created')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-header > .codes-th').contains('Codes')
    .and('be.visible');
});

it('Validating Unfilled absence data', () => {
    cy.get('.btn-tab-view > .icon').click();
    cy.get('.row-0 > .row-content > .-g > .id-cell').contains('224976441')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .id-cell').contains('Absence')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .id-cell > .notes > .fa').should('be.visible')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .id-cell > .file-attachments > .fa').should('be.visible')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .workerName-cell').contains('Bauch816, Allene')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .firstInstitution-cell').contains('Adams Middle School')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .firstInstitution-cell > .multi-value > .absence-time').contains('Emp:')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .firstInstitution-cell > .multi-value > .absence-time').contains(' 7:00 AM - 3:00 PM')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .firstInstitution-cell > .multi-value > .vacancy-time').contains('Sub:')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .firstInstitution-cell > .multi-value > .vacancy-time').contains(' 7:15 AM - 3:30 PM')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .firstReason-cell').contains('EnforceNote2Admin');
    //cy.get('.icon-container .duration-Icon').should('be.visible');
    cy.get('.row-0 > .row-content > .-g > .approval-cell').contains('No Approval Required')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .created-cell').contains('1/9/2018')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .created-cell').contains('4:00 PM')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .codes-cell').contains('Bud Code:')
    .and('be.visible');
    cy.get('.row-0 > .row-content > .-g > .codes-cell').contains('Certified Teacher')
    .and('be.visible');
    cy.get('.row-2 > .row-content > .-g > .id-cell > .cmpt-template-day-span-indicator > .day-indicator > .fa-calendar-o').should('be.visible');
    cy.get('.row-2 > .row-content > .-g > .id-cell > .cmpt-template-day-span-indicator > .day-indicator > .fa-long-arrow-right').should('be.visible')
    cy.get('.row-1 > .row-content > .-g > .approval-cell').contains('Approved')
    .and('be.visible');
    cy.get('.active > .content-panel').scrollIntoView();
    cy.get('.row-4 > .row-content > .-g > .approval-cell').contains('Approval pending')
    .and('be.visible');
});

it('Validating Filled Abs tab Data', () => {
    cy.get(':nth-child(2) > .header > .header-content').click()
    cy.get('.active > .header > .header-content').contains('Filled')
    .and('be.visible');
    cy.get('.row-1 > .row-content > .-g > .id-cell > .cmpt-template-day-span-indicator > .day-indicator > .fa-long-arrow-left').should('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-rows > .row-1 > .row-content > .-g > .id-cell').contains('224976553')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-rows > .row-1 > .row-content > .-g > .codes-cell').contains('Pay Code:')
    .and('be.visible');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .grid-rows > .row-1 > .row-content > .-g > .codes-cell').contains('Certified')
    .and('be.visible');
    cy.get('.substitute-th').contains('Substitute')
    .and('be.visible');
    cy.get('.row-3 > .row-content > .-g > .substitute-cell').contains('Raphaelle Schoen552')
    .and('be.visible');
    cy.get('.row-3 > .row-content > .-g > .substitute-cell').contains('Phone: (766) 662-6997')
    .and('be.visible');
});

it('Checking no sub required tab', () => {
    cy.get(':nth-child(3) > .header > .header-content').click();
    cy.get(':nth-child(3) > .header > .header-content').contains('No Sub Required')
    .and('be.visible');
    cy.get(':nth-child(3) > .header > .header-content > .count').contains('0');
    cy.get('.active > .content-panel > .cmpt-ui-grid > .no-data').contains('There are no substitute not required Absences or Vacancies for this date')
    .and('be.visible');
});

it('Checking list of available reports', () => {
    cy.get('.cmpt-reports-switcher > .filter').contains('Select a Report');
    cy.get('.cmpt-reports-switcher > .filter').scrollIntoView();
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Substitute Sign In');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Absentee Report');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Absence Feedback');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Absence Approval Status');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Absence Monthly Summary');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Day of Week Absence Analysis');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Absence Call History');
    cy.get('.cmpt-ui-dropdown > .ng-empty').contains('Absence Interactive');

});


})
