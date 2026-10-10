import { setTimeout } from 'timers';
const sessionsStateFn = require('../../fixtures/BaseAesopAppMocking/baseIdm/sessions-state');
const fixtureFactory = require('../../helpers/fixtureHelper');
const accessPagePermission = require('../../fixtures/BaseAesopAppMocking/orgSvc/actionPermission');

let fixtures;
describe('Menu Full IDM', function() {
    before(() => {
        cy.server();
        fixtures = fixtureFactory(cy);

        //IDM related stuff
        //TODO this can probably be grouped better into one function?
        fixtures.organizationSvc();
        fixtures.baseIdm();

        //IDM related AESOP Api calls.
        fixtures.roles();
        fixtures.fullIdmOrganization();

        //regular Aesop Mocks
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

        cy.route({
            method:'GET',
            url: /\/PermissionAPI\/api\/ActionPermissions\?organizationId=*/,
            response: accessPagePermission()
        })

        cy.visit('/');

    });
    it('Verify page has fully loaded', function() {
        cy.get('.cmpt-ui-date-selector > label').should('be.visible');
        cy.get('.header-content > .label').contains('Unfilled')
            .should('be.visible');
    });

    it('Verify Sidekick loaded', function() {
        cy.get('.sidekick').should('be.visible');
    });

    it.skip('Verify Sidekick App Switcher loaded', function() {
        var switcher = cy.get('.sk-app-switcher-initialized');
        switcher.should('be.visible');
        switcher.contains('Absence Mgmt');
        switcher.get('.fa-angle-down-after').should('be.visible'); 
    });

    it.skip('Verify Sidekick Org loaded', function() {
        var switcher = cy.get('.sk-org-switcher-initialized');
        switcher.should('be.visible');
        switcher.contains('Mocked Org');
        switcher.get('.fa-angle-down-after').should('be.visible'); 
    });

    it.skip('Verify Sidekick Role Switcher loaded', function() {
        var switcher = cy.get('.sk-user-info-initialized');
        switcher.contains('Andrew Gibson');
        switcher.contains('Campus User');
        switcher.get('.fa-angle-down-after').should('be.visible'); 
    });

    it('Checking for MAIN MENU options', function(){
        cy.get('.sk--back-drop');
        cy.get('.sk--main-menu-title').contains('Dashboard')
            .and('be.visible');
        cy.get('.sk--main-menu-title').contains('Absences')
            .and('be.visible');
        cy.get('.sk--main-menu-title').contains('Reports')
            .and('be.visible');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li:nth-child(4) > a > span.sk--main-menu-title').contains('Settings')
            .and('be.visible');
    });

    it('Checking ABSENCES menu options', function(){
        cy.server()
        cy.route({
            method: 'POST',
            url: '/sessions/state',
            response: sessionsStateFn()
        });
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li:nth-child(2) > a').as('absencesMenuOption');
        cy.get('@absencesMenuOption').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul > li:nth-child(1) > a').as('createAbsenceMenuOption');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li:nth-child(2) > div > div > ul > li:nth-child(2) > a').as('createVacancyMenuOption');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li:nth-child(2) > div > div > ul > li:nth-child(4) > a').as('approveAbsenceMenuOption');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li:nth-child(2) > div > div > ul > li:nth-child(5) > a').as('reconcileMenuOption');
        cy.get('@createAbsenceMenuOption').contains('Create Absence');
        cy.get('@createAbsenceMenuOption').should('have.attr','href','/absences/create-absence');
        cy.get('@createVacancyMenuOption').contains('Create Vacancy');
        cy.get('@createVacancyMenuOption').should('have.attr','href','/absences/create-vacancy');
        cy.get('@approveAbsenceMenuOption').contains('Approve');
        cy.get('@approveAbsenceMenuOption').should('have.attr','href','/absences/approve');
        cy.get('@reconcileMenuOption').contains('Reconcile');
        cy.get('@reconcileMenuOption').should('have.attr','href','/absences/reconcile');
    });

    it('Checking REPORTS menu options', function(){
        cy.get(':nth-child(3) > .sk--main-menu-item-container > .sk--hover-elem').as('reportMenuOption')
        cy.get('@reportMenuOption').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(1) > a').as('absenceMenuOption');
        //cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(2) > a').as('employeeMenuOption');
        cy.get('.sk-submenu-active > .sub-level-1 > :nth-child(1) > .menu-group > :nth-child(2) > .sub-menu-item-container').as('employeeMenuOption');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(3) > a').as('substituteMenuOption');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(4) > a').as('schoolMenuOption');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li.sub-menu-item.sk--menu-action > a').as('reportWriterMenuOption');
        cy.get('@absenceMenuOption').contains('Absence')
            .and('be.visible');
        cy.wait(2000);
        cy.get('.sk-submenu-active > .sub-level-1 > :nth-child(1) > .menu-group > :nth-child(2) > .sub-menu-item-container > span').contains('Employee');
        //.and('be.visible');
        cy.get('@substituteMenuOption').contains('Substitute')
            .and('be.visible');
        cy.get('@schoolMenuOption').contains('School')
            .and('be.visible');
        cy.get('@reportWriterMenuOption').contains('Report Writer');
        cy.get('@reportWriterMenuOption').should('have.attr','href','/reports/report-writer/')
        cy.get('@reportMenuOption').click();
    });

    it('Checking SETTINGS Menu options', function(){
        cy.get(':nth-child(4) > .sk--main-menu-item-container > .sk--hover-elem').as('settingsMenuOptions')
        cy.get('@settingsMenuOptions').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul:nth-child(1) > li.sub-menu-item.sk--child-0-0 > a').as('generalInfoMenuOption')
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul:nth-child(1) > li.sub-menu-item.sk--child-0-1 > a').as('timeSettingsMenuOption')
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul:nth-child(1) > li.sub-menu-item.sk--child-0-2 > a').as('preferedSubsMenuOption')
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul:nth-child(1) > li.sub-menu-item.sk--child-0-3 > a').as('excludedSubsMenuOption')
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul:nth-child(1) > li.sub-menu-item.sk--child-0-4 > a').as('sharedFilesMenuOption')
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div > ul:nth-child(2) > li.sub-menu-item.sk--child-1-0 > a').as('myProfileMenuOption')
        cy.get('@generalInfoMenuOption').contains('General Information');
        cy.get('@generalInfoMenuOption').should('have.attr','href','/settings/school/general-info')
            .and('be.visible');
        cy.get('@timeSettingsMenuOption').contains('Time Settings');
        cy.get('@timeSettingsMenuOption').should('have.attr','href','/settings/school/time-settings')
            .and('be.visible');
        cy.get('@preferedSubsMenuOption').contains('Preferred Substitutes');
        cy.get('@preferedSubsMenuOption').should('have.attr','href','/settings/school/preferred-substitutes')
            .and('be.visible');
        cy.get('@excludedSubsMenuOption').contains('Excluded Substitutes');
        cy.get('@excludedSubsMenuOption').should('have.attr','href','/settings/school/excluded-substitutes')
            .and('be.visible');
        cy.get('@sharedFilesMenuOption').contains('Shared Files');
        cy.get('@sharedFilesMenuOption').should('have.attr','href','/settings/school/shared-files')
            .and('be.visible');
        cy.get('@myProfileMenuOption').contains('My Profile');
        cy.get('@myProfileMenuOption').should('have.attr','href','/user/profile')
            .and('be.visible');
        cy.get('@settingsMenuOptions').click();  
    });

    it('Validating all the third level ABSENCE report menu items are available', function(){
        cy.get(':nth-child(3) > .sk--main-menu-item-container > .sk--hover-elem').as('reportMenuOption')
        cy.get('@reportMenuOption').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(1) > a').as('absenceMenuOption')
        cy.get('@absenceMenuOption').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(1) > a').as('subSignInMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(2) > .sub-menu-item-container').as('absenteeReportMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(3) > .sub-menu-item-container').as('dailyReportMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(4) > .sub-menu-item-container').as('absenceFeedbackMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(5) > .sub-menu-item-container').as('absenceApprovalStatusMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(6) > .sub-menu-item-container').as('absenceMonthlySummaryMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(7) > .sub-menu-item-container').as('dayOfWeekAbsAnalysisMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(8) > .sub-menu-item-container').as('absenceCallHistoryMenuOption')
        cy.get('.sidekick.sk-submenu-active > .no-mega > .menu-group > :nth-child(9) > .sub-menu-item-container').as('absenceInteractiveMenuOption')
        cy.get('@subSignInMenuOption').contains('Substitute Sign In');
        cy.get('@subSignInMenuOption').should('have.attr','href','/reports/absence/sub-sign-in')
            .and('be.visible');
        cy.get('@absenteeReportMenuOption').contains('Absentee Report');
        cy.get('@absenteeReportMenuOption').should('have.attr','href','/reports/absence/absentee')
            .and('be.visible');
        cy.get('@dailyReportMenuOption').contains('Daily Report');
        cy.get('@dailyReportMenuOption').should('have.attr','href','/reports/absence/daily-report')
            .and('be.visible');
        cy.get('@absenceFeedbackMenuOption').contains('Absence Feedback');
        cy.get('@absenceFeedbackMenuOption').should('have.attr','href','/reports/absence/feedback')
            .and('be.visible');
        cy.get('@absenceApprovalStatusMenuOption').contains('Absence Approval Status');
        cy.get('@absenceApprovalStatusMenuOption').should('have.attr','href','/reports/absence/approval-status')
            .and('be.visible');
        cy.get('@absenceMonthlySummaryMenuOption').contains('Absence Monthly Summary');
        cy.get('@absenceMonthlySummaryMenuOption').should('have.attr','href','/reports/absence/monthly-summary')
            .and('be.visible');
        cy.get('@dayOfWeekAbsAnalysisMenuOption').contains('Day of Week Absence Analysis');
        cy.get('@dayOfWeekAbsAnalysisMenuOption').should('have.attr','href','/reports/absence/dow-absence-analysis')
            .and('be.visible');
        cy.get('@absenceCallHistoryMenuOption').contains('Absence Call History');
        cy.get('@absenceCallHistoryMenuOption').should('have.attr','href','/reports/absence/call-history')
            .and('be.visible');
        cy.get('@absenceInteractiveMenuOption').contains('Absence Interactive');
        cy.get('@absenceInteractiveMenuOption').should('have.attr','href','/reports/absence/interactive')
            .and('be.visible');
        cy.get('@absenceMenuOption').click();
    });

    it('Validating all the third level EMPLOYEE report menu items are available', function(){
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(2) > a').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li > a').contains('Staff List');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li > a').should('have.attr','href','/reports/employee/staff-list')
            .and('be.visible');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(2) > a').click(); 
    });

    it('Validating all third level SUBSTITUTE menu options are available', function(){
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(3) > a').click();
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(1) > a').contains('Substitute Call History');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(1) > a').should('have.attr','href','/reports/substitute/sub-call-history')
             .and('be.visible');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(2) > a').contains('Substitute Availability');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(2) > a').should('have.attr','href','/reports/substitute/sub-availability')
            .and('be.visible');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(3) > a').contains('Substitute History By Date');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(3) > a').should('have.attr','href','/reports/substitute/sub-history-by-date')
            .and('be.visible');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(4) > a').contains('Excluded Substitutes');
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(4) > a').should('have.attr','href','/reports/substitute/excluded-subs')
            .and('be.visible');
        // Sub absence menu checks are commented out TBD
        // cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(5) > a').contains('Substitute Absences')
        // cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li:nth-child(5) > a').should('have.attr','href','/reports/substitute/substitute-absences')
        cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(3) > a').click();
    });

    it('Validating all third level SCHOOL menu options are available', function(){
       cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(4) > a').click()
       cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li > a').contains('School Call History');
       cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.sidekick.sk-nav-item-submenu.sub-level-2.sk-nav-item-submenu-initialized.sk-submenu-active > div > ul > li > a').should('have.attr','href','/reports/school/school-call-history')
            .and('be.visible');
       cy.get('body > div.sidekick.sk-nav.sk-nav-initialized > div.sk--top-section > ul > li.sidekick.sk-nav-item.sk--has-children.sk-nav-item-initialized.sk-submenu-active > div > div.no-mega > ul > li:nth-child(4) > a').click();
    });


});