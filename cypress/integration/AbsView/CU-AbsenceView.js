const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');
const AbsenceRequestView = require('../../fixtures/AbsView/AbsView');
const RelatedConfs = require('../../fixtures/AbsView/RelatedConf');
const AbsFiles = require('../../fixtures/AbsView/AbsFiles');
const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');


let fixtures;
let absenceFixtures;
describe('CU - Absence View', function() {
    before(() => {
        cy.server();
        fixtures = fixtureFactory(cy);
        fixtures.passthroughOrganization();
        fixtures.institutions();
        fixtures.campusUser();
        fixtures.products();
        fixtures.workerTypes();
        fixtures.notifications();

        absenceFixtures = fixtureFactoryForAbsence(cy);
        absenceFixtures.mockAbsenceView(224976352);

        cy.visit('absences/detail/224976352/view');

    });


    it('Checking view abs header for the correct page data', function() {
        cy.get('.-u-10-24 > :nth-child(1) > ng-transclude > .ng-binding').contains('View Absence');
        cy.get('.entry-id').should('be.visible');
        cy.get('.entry-id').contains('224976352');
        cy.get('.worker-title').should('be.visible');
        cy.get('.worker-title').contains('Fahey483, Ariane');

    });

    it('Checking Status and Approval header data', function() {
        cy.get('.-u-14-24 > .status').should('be.visible');
        cy.get('.-u-14-24 > .status').contains('Status:')
            .and('be.visible');
        cy.get('.-u-14-24 > .status').contains('Unfilled')
            .and('be.visible');
        cy.get('.-u-14-24 > .status').should('be.visible');
        cy.get('.-u-14-24 > .status').contains('Unapproved')
            .and('be.visible');
    });

    it('Checking hours, created and last update data- header', function() {
        cy.get('.details').should('be.visible');
        cy.get('.details').contains('Hours Per Day:');
        cy.get('.details').contains('8');
        cy.get('.details').contains('1/8/18 4:00 PM');
        cy.get('.details').contains('Last Update: ');
        cy.get(':nth-child(3) > .bold').contains('1/8/18 4:00 PM');
    });

    it('Checking Related conf# Data', function() {
        cy.get('.related-abs-container').should('be.visible');
        cy.get('.related-abs-container').contains('224976235');

    });

    it('Ensuring proper update options are available -CRUD-', function() {
        cy.get('.top > .auto-edit-absence').contains('Edit Absence')
            .and('be.visible');
        cy.get('.top > .fl-positive').contains('Reconcile')
            .and('be.visible');
        cy.get('.top > .fl-negative').contains('Delete')
            .and('be.visible');
        cy.get('.bottom > .auto-edit-absence').contains('Edit Absence')
            .and('be.visible');
        cy.get('.bottom > .fl-positive').contains('Reconcile')
            .and('be.visible');
        cy.get('.bottom > .fl-negative').contains('Delete')
            .and('be.visible');
        expect(Cypress.$('.top > .fl-negative')).to.have.css('background-color', 'rgb(229, 94, 85)')
        expect(Cypress.$('.top > .auto-edit-absence')).to.have.css('background-color', 'rgb(237, 240, 240)');
    });

    it('Checking Secondary header Date and location data', function() {
        cy.get('.-u-1 > .section-header').contains('January 11')
            .and('be.visible');
        cy.get('.section-header > :nth-child(1) > .ng-scope').contains('at')
            .and('be.visible');
        cy.get('.-u-1 > .section-header').contains('Adams Middle School')
            .and('be.visible');
    });

    it('checking section toggles', function() {
        cy.get('.variation-toggler').should('be.visible');
        cy.get('.reasons').should('be.visible');
        cy.get('.variation-toggler').click();
        cy.get('.reasons').should('not.be.visible');
        cy.get('.variation-toggler').click();
        cy.get('.notes-toggler').should('be.visible');
        cy.get('#admin-notes').should('be.visible');
        cy.get('.notes-toggler').click();
        cy.get('#admin-notes').should('not.be.visible');
        cy.get('.notes-toggler').click();
        cy.get('.cmpt-absr-next-steps > .-g > .toggle-summary').should('be.visible');
        cy.get('.cmpt-absr-next-steps > .-g > .toggle-summary').click();
        cy.get('.next-steps > .status').should('not.be.visible');
        cy.get('.cmpt-absr-next-steps > .-g > .toggle-summary').click();
        cy.get('.cmpt-absr-details-summary-section > .-g > .toggle-summary').should('be.visible');
        cy.get('.variations-summary').should('be.visible');
        cy.get('.cmpt-absr-details-summary-section > .-g > .toggle-summary').click();
        cy.get('.variations-summary').should('not.be.visible');
        cy.get('.cmpt-absr-details-summary-section > .-g > .toggle-summary').click();

    });

    it('Validating calendar section information', function() {
        cy.get('.-u-13-24 > .label').contains('From')
            .and('be.visible');
        cy.get('.range-picker > :nth-child(2) > .label').contains('To')
            .and('be.visible');
        cy.get(':nth-child(1) > .date-label').contains('01/11/2018')
            .and('be.visible');
        cy.get(':nth-child(3) > .date-label').contains('01/11/2018')
            .and('be.visible');
        cy.get('.ui-datepicker-month').contains('January')
            .and('be.visible');
        expect(Cypress.$('.\\32 018-01-11 > .ui-state-default')).to.have.css('background-color', 'rgb(154, 187, 229)');
        cy.get('.\\32 018-01-11 > .ui-state-default').contains('11');
        cy.get('.ui-datepicker-next').click();
        cy.get('.ui-datepicker-month').contains('February')
            .and('be.visible');
        cy.get('.ui-datepicker-prev').click();

    });

    it('Validating the correct absence reason data appears', function() {
        cy.get('.reasons').should('be.visible');
        cy.get('.reasons').contains('Absence Reason');
        cy.get('.reasons').contains('EnforceNote2Admin');

    });

    it('Validating the correct absence time data', function() {
        cy.get('[ng-class="{\'one-option\': absrState.context.absenceShiftTypes[0].id === 4}"] > .field > .element > .cmpt-ui-dropdown > .readonly').contains('Full Day')
            .and('be.visible');
        cy.get('[ng-class="{\'one-option\': absrState.context.absenceShiftTypes[0].id === 4}"] > .field > .element > .time-container').contains('07:00 AM')
            .and('be.visible');
        cy.get('[ng-class="{\'one-option\': absrState.context.absenceShiftTypes[0].id === 4}"] > .field > .element > .time-container > :nth-child(3) > .cmpt-ui-textbox > .ng-binding').contains('03:00 PM')
            .and('be.visible');

    });

    it('Validating the correct sub report time data', function() {
        cy.get('[ng-class="{\'one-option\': absrState.context.vacancyShiftTypes.length === 1}"] > .field > ng-transclude > .ng-scope > .text').contains('Substitute Report Time')
            .and('be.visible');
        cy.get('[ng-class="{\'one-option\': absrState.context.vacancyShiftTypes.length === 1}"] > .field > .element > .cmpt-ui-dropdown > .readonly').contains('Full Day')
            .and('be.visible');
        cy.get('[ng-class="{\'one-option\': absrState.context.vacancyShiftTypes.length === 1}"] > .field > .element > .time-container > :nth-child(1) > .cmpt-ui-textbox > .ng-binding').contains('07:15 AM')
            .and('be.visible');
        cy.get('[ng-class="{\'one-option\': absrState.context.vacancyShiftTypes.length === 1}"] > .field > .element > .time-container > :nth-child(3) > .cmpt-ui-textbox > .ng-binding').contains('03:30 PM')
            .and('be.visible');

    });

    it('Checking ancillary absence data', function() {
        cy.get('.non-pay > label > .text').contains('Non-Pay Time')
            .and('be.visible');
        cy.get('.non-pay > .element > .cmpt-ui-textbox > .ng-binding').contains('01:00')
            .and('be.visible');
        cy.get('.time-absent > label > .text').contains('Time Absent')
            .and('be.visible');
        cy.get('.time-absent > .element > .cmpt-ui-textbox > .ng-binding').contains('07:00')
            .and('be.visible');
        cy.get('.budget-codes > label > .text').contains('Budget Code')
            .and('be.visible');
        cy.get('.budget-codes > .element > .cmpt-ui-dropdown > .readonly').contains('Certified Teacher')
            .and('be.visible');
        cy.get('.accounting-codes > .element').contains(' 1110E510007530391010300000000000 ')
            .and('be.visible');

    });

    it('Checking Notes to Administrator information and state', function() {
        cy.get('#admin-notes > ng-transclude > .ng-scope').contains('Notes to Administrator')
            .and('be.visible');
        cy.get('#admin-notes > ng-transclude > .ng-scope > .caption').contains('Viewable only by Administrator and Employee')
            .and('be.visible');
        cy.get('#admin-notes > :nth-child(2) > .label').contains('Aut ab totam et.')
            .and('be.visible');

    });

    it('Checking Notes to Substitute inforamation and state', function() {
        cy.get('.ng-scope > [ng-show="absrState.context.showNotesToAdmin"]').contains('Notes to Substitute')
            .and('be.visible');
        cy.get('.substitute-notes > ng-transclude > .ng-scope > .caption').contains('Viewable by Administrator, Employee, and Substitute')
            .and('be.visible');
        cy.get('.substitute-notes > :nth-child(2) > .label').contains('Voluptatem omnis velit vero repellat reiciendis.')
            .and('be.visible');

    });

    it('Checking Admin-Only Notes information and state', function() {
        cy.get('.admin-only-notes > ng-transclude > .ng-scope').contains('Admin-Only Notes')
            .and('be.visible');
        cy.get('.admin-only-notes > ng-transclude > .ng-scope > .caption').contains('Viewable only by Administrator')
            .and('be.visible');
        cy.get('.admin-only-notes > :nth-child(2) > .label').contains('None')
            .and('be.visible');

    });

    it('Checking File Attachments', function() {
        cy.get('.attachments-header > .ng-binding').contains('File Attachments')
            .and('be.visible');
        cy.get('.uploaded-files > .ng-binding').contains('Uploaded Files')
            .and('be.visible');
        cy.get('.uploaded-files > .no-files').contains('No Uploaded Files')
            .and('be.visible');
        cy.get('.related-files > .ng-binding').contains('Related Files')
            .and('be.visible');
        cy.get('.file').contains('upload_to_aesop.rtf');

    });

    it('Checking Next Steps data and options', function() {
        cy.get('[ng-show="!vm.processingApproval"] > .fl-negative').as('denyBtn');
        cy.get('[ng-show="!vm.processingApproval"] > .fl-positive').as('approveBtn');
        cy.get('[ng-if="!absrState.editMode"] > .fl-button-sm').as('assignSubBtn');
        cy.get('.next-steps > .status').contains('Status:')
            .and('be.visible');
        cy.get('.next-steps > .status').contains('Unfilled')
            .and('be.visible');
        cy.get('@assignSubBtn').contains('Assign Sub')
            .and('be.visible');
        expect(Cypress.$('[ng-if="!absrState.editMode"] > .fl-button-sm')).to.have.css('background-color', 'rgb(38, 162, 106)');
        expect(Cypress.$('[ng-show="!vm.processingApproval"] > .fl-positive')).to.have.css('background-color', 'rgb(38, 162, 106)');
        cy.get('@approveBtn').should('have.attr','ng-click','go.approve()');
        cy.get('@denyBtn').should('have.attr','ng-click','go.deny()');
    });

    it('Checking Next Steps Approval data', function() {
        cy.get(':nth-child(2) > .cmpt-template-approval > .ng-scope > .text > .ng-binding').contains('Unapproved')
            .and('be.visible');
        cy.get('.approval-action').contains('Not Available')
            .and('be.visible');
        cy.get('.approval-comments > .cmpt-ui-textarea > :nth-child(2) > .ng-pristine').focus().type('Adding approval comments');
        cy.get('.approval-comments > .cmpt-ui-textarea > .notes-characters-left').contains('231 character(s) left');
        cy.get('[ng-show="!vm.processingApproval"] > .fl-negative').contains('Deny')
            .and('be.visible');
        cy.get('[ng-show="!vm.processingApproval"] > .fl-positive').contains('Approve')
            .and('be.visible');
    });


    it('Checking Absence Summary data', function() {
        cy.get('.cmpt-absr-details-summary-section > .-g > .ng-binding').contains('Absence Summary')
            .and('be.visible');
        cy.get('.summary-details').contains('Substitute Required')
            .and('be.visible');
        cy.get('.summary-details').contains('Yes')
            .and('be.visible');
        cy.get('.absence-dates').contains('Thursday, January 11, 2018')
            .and('be.visible');
        cy.get('.school-name').contains('Adams Middle School')
            .and('be.visible');
        cy.get('.absence-time').contains('7:00 AM - 3:00 PM')
            .and('be.visible');
        cy.get('.absence-reason').contains('EnforceNote2Admin')
            .and('be.visible');
    });

    it('Checking delete warning modal', function() {
        cy.server()
        cy.get('.top > .fl-negative').contains('Delete')
        cy.get('.top > .fl-negative').click()
        cy.get('.content > .ng-scope > .ng-binding').contains('224976352')
        cy.get('.normal-btn').click();

    });

    it('Validating all available tabs are appearing', function() {
        cy.get('.tabs > :nth-child(2)').contains('Absence Log')
            .and('be.visible');
        cy.get('.tabs > :nth-child(3)').contains('Approvers')
            .and('be.visible');
        cy.get('.tabs > :nth-child(4)').contains('Approver Log')
            .and('be.visible');
        cy.get('.tabs > :nth-child(5)').contains('Available Subs')
            .and('be.visible');
        cy.get('.tabs > :nth-child(6)').contains('Call History')
            .and('be.visible');
        cy.get('.tabs > .active').contains('Absence')
            .and('be.visible');
    });

    it('Clicking and viewing the locked related conf# link', function() {
        cy.server()
        //we're about to click the related absence link which is a locked absence. mock it out first.
        //absenceFixtures.mockAbsenceView(224976235, true);
        var absrId = 224976352;
        var isLocked = 'yes';

        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224976235?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
            response: AbsenceRequestView(absrId, isLocked)
        }).as('getAbsenceRequestView');

        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224976235/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
            response: RelatedConfs()
        }).as('getRelatedConfs');

        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224976352/Files',
            response: AbsFiles()
        }).as('getAbsFiles');

        cy.route({
            method: 'GET',
            url: 'api/v1.0/workers/8323397/RelatedFiles?asOfDate=01/11/2018',
            response: RelatedFiles()
        }).as('getRelatedFiles');

        //TODO a better way to do this would be create it's own test where the locked absence loads with the page... 
        //and make all the assertions about the locks absence state on the page, in it's own test.

        cy.get('body > div.main-content > div > ui-view > ui-view > div > div:nth-child(1) > div.cmpt-absr-top-section-summary > div > div.related-abs-container.ng-scope > span').contains('224976235').click();
        cy.wait(['@getAbsenceRequestView','@getAbsFiles','@getRelatedFiles',]);
        cy.get('.top').contains('This record is currently locked.');
    });

    it('Checking locked absence status', function() {
        cy.get('.top').contains('This record is currently locked.');
        cy.get('.bottom').contains('This record is currently locked.');
        cy.get('fl-button-sm').should('be', 'disabled');
    });

});