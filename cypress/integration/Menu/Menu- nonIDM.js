import { setTimeout } from 'timers';

const fixtureFactory = require('../../helpers/fixtureHelper');
let fixtures;
describe('Menu no-sidekick non- IDM', function() {
    before(() => {
        cy.server()
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
            response: { "data": { "needApprovalCount": 0 }, "messages": [], "success": true, "modelState": {} }
        })

        cy.route({
            method: 'GET',
            url: /\/api\/v1.0\/AbsenceRequests\/ReconciliationCount\?endDate.*&startDate.*/,
            response: { "data": { "needsReconciliationCount": 0 }, "messages": [], "success": true, "modelState": {} }
        })

        cy.route({
            method: 'GET',
            url: /\/api\/v1.0\/absencerequests\?fields=\(.*\)&includeAllDateAbsences=false&.*useAlwaysOnDb=true/,
            response: { "data": [], "messages": [], "success": true, "modelState": {} }
        })

        cy.visit('/');

    });
    it('Verify page has fully loaded', function() {
        cy.get('.cmpt-ui-date-selector > label').should('be.visible');
        cy.get('.header-content > .label').contains('Unfilled')
        .should('be.visible');
    });

    it('Verify App switcher loaded', function() {
        var switcher = cy.get('.cmpt-topnav-app-switcher')
        switcher.should('be.visible');
        switcher.contains('Absence Management').and('be.visible');
        cy.get('.sub-title').contains('Formerly Aesop').and('be.visible')
        switcher.click()
        cy.get('.active > a > .fa').should('be.visible')
        cy.get('.dropdown > .active').contains('Absence Management')
        cy.get('.dropdown > .active').contains('(Aesop)')
        cy.get('.cmpt-topnav-app-switcher > .dropdown > :nth-child(2)').contains('Time & Attendance')
        cy.get('.cmpt-topnav-app-switcher > .dropdown > :nth-child(2)').contains('VeriTime')
    });

    it('Verify top Nav Options are available', function() {
        cy.get('.cmpt-topnav-search').should('be.visible')
        cy.get('.cmpt-topnav-notifications').should('be.visible')
        cy.get('.icon-left').should('be.visible')
        cy.get('.cmpt-topnav-help').should('be.visible')
        cy.get('.cmpt-topnav-help > span').should('be.visible')
    });

    it('Verify user account switcher is available', function() {
        cy.get('.user-name').contains('campusUser 101475')
        .and('be.visible');
        cy.get('.user-name').click()
        cy.get('[ng-click="go.profile()"]').contains('My Profile')
        .and('be.visible');
        cy.get('[ng-click="go.pin()"]').contains('Pin')
        .and('be.visible');
        cy.get('[ng-click="go.logout()"]').contains('Logout')
        .and('be.visible');
        cy.get('.cmpt-topnav-user').click()
    });


    it('Checking for MAIN MENU options', function(){
        cy.get('#menu-item-dashboard').contains('Dashboard')
        .and('be.visible');
        cy.get('#menu-item-abnseces').contains('Absences')
        .and('be.visible');
        cy.get('#menu-item-reports').contains('Reports')
        .and('be.visible');
        cy.get('#menu-item-settings').contains('Settings')
        .and('be.visible');
    });

    it('Checking ABSENCES menu options', function(){
        cy.get('.menu-item-1 > .main-menu-item-container > .hover-elem').as('absencesMenuOption');
        cy.get('@absencesMenuOption').click();
        cy.get(':nth-child(1) > .sub-menu-item-container').as('createAbsenceMenuOption')
        cy.get('.no-mega > ul > :nth-child(2) > .sub-menu-item-container').as('createVacancyMenuOption')
        cy.get('.no-mega > ul > :nth-child(4) > .sub-menu-item-container').as('approveAbsenceMenuOption')
        cy.get('.no-mega > ul > :nth-child(5) > .sub-menu-item-container').as('reconcileMenuOption')
        cy.get('@createAbsenceMenuOption').contains('Create Absence');
        cy.get('@createVacancyMenuOption').contains('Create Vacancy');
        cy.get('@approveAbsenceMenuOption').contains('Approve');
        cy.get('@reconcileMenuOption').contains('Reconcile');
        cy.get('@absencesMenuOption').click();
    });

    it('Checking SETTINGS Menu options', function(){
        cy.get('#menu-item-settings').as('settingsMenuOptions')
        cy.get('@settingsMenuOptions').click();  
        cy.get('#menu-item-settings-school-general').contains('General Information')
        .and('be.visible');
        cy.get('#menu-item-settings-school-timesettings').contains('Time Settings')
        .and('be.visible');
        cy.get('#menu-item-settings-school-prefsubs').contains('Preferred Substitutes')
        .and('be.visible');
        cy.get('#menu-item-settings-school-exclsubs').contains('Excluded Substitutes')
        .and('be.visible');
        cy.get('#menu-item-settings-school-sharedfiles').contains('Shared Files')
        .and('be.visible');
        cy.get('#menu-item-settings-accountsettings-myprofile').contains('My Profile')
        .and('be.visible');
        cy.get('#menu-item-settings-accountsettings-pin').contains('Pin')
        cy.get('@settingsMenuOptions').click();
        
    });

    it('Validating all the Report Absence menu items are available', function(){
        cy.get('#menu-item-reports').as('reportMenuOption')
        cy.get('@reportMenuOption').click();
        cy.get('#menu-item-reports-absence-subsignin').contains('Substitute Sign In')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-absentee').contains('Absentee Report')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-daily').contains('Daily Report')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-feedback').contains('Absence Feedback')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-approval').contains('Absence Approval Status')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-monthsum').contains('Absence Monthly Summary')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-dow').contains('Day of Week Absence Analysis')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-abscallhistory').contains('Absence Call History')
        .and('be.visible');
        cy.get('#menu-item-reports-absence-absinteractive').contains('Absence Interactive')
        .and('be.visible');
        cy.get('#menu-item-reports').click();
    });

    it('Validating all the third level EMPLOYEE report menu items are available', function(){
        cy.get('#menu-item-reports').click();
        cy.get('.sub-menu-2 > .cmpt-nav-sub-menu > .mega-menu > :nth-child(2) > .group-title').should('be.visible')
        cy.get('#menu-item-reports-employee-staff').contains('Staff List')
        .and('be.visible');
        cy.get('#menu-item-reports').click(); 
    });

    it('Validating all third level SUBSTITUTE menu options are available', function(){
        cy.get('#menu-item-reports').click();
        cy.get('#menu-item-reports-substitute-callhistory').contains('Substitute Call History');
        cy.get('#menu-item-reports-substitute-subavail').contains('Substitute Availability')
        .and('be.visible');
        cy.get('#menu-item-reports-substitute-history').contains('Substitute History By Date')
        .and('be.visible');
        cy.get('#menu-item-reports-substitute-excluded').contains('Excluded Substitutes')
        .and('be.visible');
        cy.get('#menu-item-reports-substitute-substituteabsence').contains('Substitute Absences')
        .and('be.visible');
        cy.get('#menu-item-reports').click();

    });

    it('Validating all third level SCHOOL menu options are available', function(){
        cy.get('#menu-item-reports').click();
        cy.get(':nth-child(4) > .group-title').should('be.visible');
        cy.get('#menu-item-reports-school-callhistory').contains('School Call History')
        .and('be.visible');
        cy.get(':nth-child(5) > .group-title').should('be.visible');
        cy.get('#menu-item-reports-reportwriter').contains('Report Writer')
        .and('be.visible')
        cy.get('#menu-item-reports').click();
   
    });

})