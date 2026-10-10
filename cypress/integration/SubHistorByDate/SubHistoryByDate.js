const fixtureFactory = require('../../helpers/fixtureHelper');
const SubstituteFilterList = require('../../fixtures/RptFilterData/SubstituteFilterList');
const HistoryByDateDataSet = require('../../fixtures/SubHistoryByDate/SubHistoryByDateData');

let fixtures;
describe('Substitute History by date tests', function (){
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
        url: '/api/v1.0/substitutes?fields=(id,firstName,middleName,lastName,isActive)',
        response: SubstituteFilterList()
        }).as('getSubstituteFilterList');

        cy.visit('/reports/substitute/sub-history-by-date');
        cy.wait('@getSubstituteFilterList');

  });
    
    it('Ensuring the correct page has loaded', function(){
        cy.url().should('contain','/reports/substitute/sub-history-by-date');
    });

    it('Check page header data', function(){
        cy.get('.cmpt-reports-switcher > .header').contains('SUBSTITUTE REPORTS');
        cy.get('body > div.main-content > div > ui-view > ui-view > div > h3').contains('Substitute History by Date');
    });

    it('Checking school filter initial state', function(){
        cy.get('.schools > .cmpt-ui-multiselect > .label').contains('All Schools')
            .and('be.visible');
        cy.get('.schools > .cmpt-ui-multiselect > .selector > .ui-multiselect').contains('Schools')
            .and('be.visible');
    });

    it('Checking the substitute filter initial state', function(){
        cy.get('.substitutes > .cmpt-ui-multiselect > .label').contains('All Substitutes')
            .and('be.visible');
        cy.get('.substitutes > .cmpt-ui-multiselect > .selector > .ui-multiselect').contains('Substitutes')
            .and('be.visible'); 
    });

    it('Checking for the print with page breaks option', function(){
        cy.get('.print-page-breaks').contains('Print with Page Breaks')
            .and('be.visible');
        cy.get('.checkbox').should('be.visible');
        cy.get('.checkbox').should('not.be.checked');
    });

    it('Checking for the search and print options', function(){
        cy.get('.fl-primary').contains('Search')
            .and('be.visible');
        cy.get('.print > .cmpt-ui-print-button').contains('Print')
            .and('be.visible');
    });

    it('Checking the data grid header label', function(){
        cy.get('.header-content > .label').contains('Substitute History by Date')
            .and('be.visible'); 
    });

    it('Validating data grids initial state (blank)', function(){
        cy.get('.no-data').should('be.visible');
        cy.get('.no-data').contains('To begin, please perform a search above.');
    });

    it('Clicking the search button', function(){
        cy.server();
        cy.route({
        method: 'GET',
        url: /\/api\/v1.0\/Absences\?endDate=.*&fields=\(absrId,IsVacancy,worker\(id,firstName,middleName,lastName,isActive,title\),substitute\(id,firstName,middleName,lastName,isActive\),entitlement\(name\),institution\(id,name\),date,absenceStartTime,absenceEndTime,substituteStartTime,substituteEndTime,vacancyDuration,vacancyBreakDuration,shiftType,substituteShiftType,DeductBreakFromAbsenceDuration,balanceTrackingType\)&includeAbsences=true&includeDeletedSubs=false&includeFilled=true&includeNoSubRequired=false&includeUnfilled=false&includeVacancies=true&instIds=&startDate=.*&subIds=&useAlwaysOnDb=true/,
        response: HistoryByDateDataSet()
        }).as('getHistoryByDateDataSet');

        cy.get('.fl-primary').click();
        cy.wait('@getHistoryByDateDataSet');
    });

    it('Checking for the filled data grid', function(){
        cy.get('.no-data').should('not.be.visible');
    });

    it('Validating report count data', function(){
        cy.get('.count').contains('27')
            .and('be.visible');
    });

    it('Validating grid headers', function(){
        cy.get('[ng-show="isLoaded && showHeader"] > .-u-3-24').contains('Conf. #')
            .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .date-th').contains('Date')
            .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .-u-7-24').contains('Filled/Replaced')
            .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .-u-6-24').contains('Absence/Vacancy Reason')
            .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .duration-th').contains('Duration')
            .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .activeEmployee-th').contains('Active Employee')
            .and('be.visible');
        cy.get('[ng-show="isLoaded && showHeader"] > .activeSub-th').contains('Active Substitute')
            .and('be.visible');
    });

    it('Checking groupby name headers', function(){
        cy.get(':nth-child(1) > .group-row').contains('Altenwerth592, Emerald')
            .and('be.visible');
        cy.get(':nth-child(2) > .group-row').contains('Ankunding578, Hetti')
            .and('be.visible');
        //cy.get(':nth-child(3) > .group-row').scrollIntoView();
        cy.get(':nth-child(3) > .group-row').contains('Auer886, Jaquan')
            .and('be.visible');  
    });

    it('Checking conf# data', function(){
        cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .-u-3-24 > .cmpt-template-confirmation-link > .ng-binding').contains('224992193');
        cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .-u-3-24 > .cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224992193/view');
        cy.get('.row-3-0 > .-g > .-u-3-24 > .cmpt-template-confirmation-link > .ng-binding').contains('224991979').and('have.attr','href','/absences/detail/224991979/view');
        cy.get('.row-3-1 > .-g > .-u-3-24 > .cmpt-template-confirmation-link > .ng-binding').contains('224991979').and('have.attr','href','/absences/detail/224991979/view');
    });

    it('Checking date data', function(){
        cy.get(':nth-child(1) > .grid-rows > .grid-row > .-g > .date-cell > .ng-binding').contains('5/25/2018');
        cy.get('.row-1-0 > .-g > .date-cell > .ng-binding').contains('5/25/2018');
        cy.get('.row-1-1 > .-g > .date-cell > .ng-binding').contains('5/28/2018');
    });

    it('Checking Filled Replaced data', function(){
        cy.get(':nth-child(2) > :nth-child(1) > .grid-rows > .grid-row > .-g > .-u-7-24').as('row1FillReplaceData');
        cy.get('@row1FillReplaceData').contains('Trantow983, Marisa');
        cy.get('@row1FillReplaceData').contains('Jefferson High');
    });

    it('Absence Vacancy reason data validations', function(){
        cy.get(':nth-child(2) > :nth-child(1) > .grid-rows > .grid-row > .-g > .-u-6-24').contains('Illness');
        cy.get(':nth-child(2) > :nth-child(1) > .grid-rows > .grid-row > .-g > .-u-6-24').contains('7:00 AM - 3:00 PM');

    });

    it('Exceeding the date range limit of 92 days', function(){
        cy.get('[got-error="vm.endDateError"] > .ui-datepicker-trigger').click();
        var i;
        for (i = 0; i< 4; i++) {
            cy.get('.ui-datepicker-next').click();
        };
        cy.get(':nth-child(2) > :nth-child(4) > .ui-state-default').click();
        cy.get('.fl-primary').click();
    });

    it('Checking for exceeded date range error messaging', function(){
        cy.get('.fl-system-message').contains('Sorry, you may not run this report for a date range of longer than 92 days unless you select a specific Substitute')
            .and('be.visible');
        cy.get('strong.ng-binding').contains('Error!')
            .and('be.visible');
        cy.get('.dismiss > .ng-binding').contains('Dismiss')
            .and('be.visible');
        cy.get('.dismiss > .ng-binding').click()
        cy.get('.fl-system-message').should('not.be.visible');
    });

    
});