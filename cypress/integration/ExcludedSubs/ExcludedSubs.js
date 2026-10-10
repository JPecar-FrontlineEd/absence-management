const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureHelperForPreferences = require('../../helpers/fixtureHelperForPreferences');

const Preferences = require('../../fixtures/ExcludedSubs/AddSubs');
const ExclusionList = require('../../fixtures/ExcludedSubs/ExclusionList');
const Institution = require('../../fixtures/ExcludedSubs/institution');
const CallGroup = require('../../fixtures/ExcludedSubs/callGroup');


let fixtures;
let preferenceListFixtures;
describe('Excluded Substitutes UI regression tests', function() {
    before(() => {
        cy.server()
        fixtures = fixtureFactory(cy);
        fixtures.passthroughOrganization();
        fixtures.institutions();
        fixtures.campusUser();
        fixtures.products();
        fixtures.workerTypes();
        fixtures.notifications();

        // preferenceListFixtures = fixtureHelperForPreferences(cy);
        // preferenceListFixtures.mockGettingExclusionList(true);
        cy.route({
            method: 'GET',
            url: '/api/v1.0/institutions/5400',
            response: Institution(true)
        }).as('getInstitution');

        cy.route({
            method: 'GET',
            url: '/api/v1.0/locations/5400/CallGroup',
            response: CallGroup()
        }).as('getCallGroup');

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=true',
            response: ExclusionList()
        }).as('getExclusionList');

        cy.visit('/settings/school/5400/excluded-substitutes');
        cy.wait(['@getInstitution','@getCallGroup','@getExclusionList'])
    });

    context('1. Excluded Substitutes non state change checks', function() {

        it('Verify correct url', () => {
            cy.url().should('include', '/settings/school/5400/excluded-substitutes');
        });

        it('Active tab check', function() {
            cy.get('.tabs > .active').contains('Excluded Substitutes')
                .and('be.visible');
        });

        it('Checking Grid headers', function() {
            cy.get('.left-section').contains('Excluded Substitutes')
                .and('be.visible');
            cy.get('.-u-8-24 > .col-title').contains('Name')
                .and('be.visible');
            cy.get('.-u-12-24 > .col-title').contains('Comments')
                .and('be.visible');
            cy.get('.select-th > .col-title').contains('Select')
                .and('be.visible');
            cy.get('.action-th > .col-title').contains('Action')
                .and('be.visible');
        });

        it('Data Grid integration tests', function() {
            cy.get('[sub-id="6481145"] > .-g > .action-cell > .fa-pencil').as('row1Edit');
            cy.get('[sub-id="6481145"] > .-g > .select-cell > .ng-valid').as('row1CheckBox');
            cy.get('[sub-id="6481145"] > .-g > .-u-12-24').as('row1CommentsBox');
            cy.get('[sub-id="7221034"] > .-g > .-u-12-24').as('row2CommentsBox');
            cy.get('[sub-id="7221034"] > .-g > .-u-8-24 > .no-rating').as('row1NoRatingLabel');
            cy.get('[sub-id="7221034"] > .-g > .-u-8-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').as('row2EmployeeName');
            cy.get('[sub-id="6481145"] > .-g > .-u-8-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').as('row1EmployeeName');
            cy.get('@row1EmployeeName').contains('6TVCEmployee, YgeAp')
                .and('be.visible');
            cy.get('@row1CommentsBox').contains('<img src=x onerror=alert(123) />')
                .and('be.visible');
            cy.get('@row2EmployeeName').contains('Abbott, Noemy')
                .and('be.visible');
            cy.get('@row1NoRatingLabel').contains('(No Rating)')
                .and('be.visible');
            cy.get('@row2CommentsBox').contains('No call no show on 5-11')
                .and('be.visible');
            cy.get('.ngrateit-background').should('be.visible');
            cy.get('@row1CheckBox').should('not.be.checked');
            cy.get('@row1Edit').should('be.visible');
        });

        it('Tab visibility checks', function() {
            cy.get('.tabs > :nth-child(1)').contains('General Information')
                .and('be.visible');
            cy.get('.tabs > :nth-child(2)').contains('Time Settings')
                .and('be.visible');
            cy.get('.tabs > :nth-child(3)').contains('Preferred Substitutes')
                .and('be.visible');
            cy.get('.tabs > :nth-child(5)').contains('Shared Files')
                .and('be.visible');
        });

        it('Add Subs permission check', function() {
            cy.get('.actions-header > .substitute-actions > .fl-positive').contains('Add Substitute(s)');
            cy.get('.actions-footer > .substitute-actions > .fl-positive').contains('Add Substitute(s)');
        });
    });

    context('2. Excluded Substitutes Add sub checks', function() {

        it('Adding new subs', function() {
            cy.server()
            preferenceListFixtures = fixtureHelperForPreferences(cy);
            preferenceListFixtures.mockAddingNewExclusions();
            cy.get('.actions-header > .substitute-actions > .fl-positive').click();
        });

        it('Step 1-Grid header checks', function() {
            cy.get('.letter-header').contains('Search by Letter')
                .and('be.visible');
            cy.get('[ng-show="isLoaded && showHeader"] > .-u-24-24').contains('Substitute Name')
                .and('be.visible');
            cy.get('.selected-subs > .header').contains('Selected Substitutes')
                .and('be.visible'); 
        });

        it('Step 1-Button options state check', function() {
            cy.get(':nth-child(1) > .actions > a.fl-button').first().as('bckToExcludeBtn');
            cy.get('@bckToExcludeBtn').contains('Back to Excluded Substitutes')
                .and('be.visible');
            cy.get(':nth-child(1) > .actions > .fl-positive').as('nextBtn');
            cy.get('@nextBtn').contains('Next')
                .and('be.visible');
            cy.get('@nextBtn').should('have.attr','class','fl-button fl-positive fl-disabled');
        });

        it('Step 1-Add subs Data Grid integration tests', function() {
            cy.get('.row-0-0 > .-g > .-u-24-24 > .cmpt-template-substitute-link').as('row1SubName');
            cy.get('@row1SubName').contains('Abbott119, Agustin');
            cy.get('.no-subs-selected').contains('Currently, there are no Substitutes selected')
                .and('be.visible');
            cy.get('.-u-24-24 > .cmpt-template-feedback-rating > .ngrateit > .ngrateit-star_wrapper > .ngrateit-background').should('be.visible');
            cy.get('.row-0-0 > .-g > .-u-24-24 > .no-rating').contains('(No Rating)')
                .and('be.visible');
        });

        it('Step 1-Selecting subs for exclusion',function() {
            cy.get('.row-0-1 > .-g > .checkbox').check();
            cy.get('.row-0-1 > .-g > .checkbox').should('be.checked');
            cy.get('.row-0-3 > .-g > .checkbox').check();
            cy.get('.row-0-3 > .-g > .checkbox').should('be.checked');
            cy.get('.row-0-5 > .-g > .checkbox').check();
            cy.get('.row-0-5 > .-g > .checkbox').should('be.checked');
            cy.get(':nth-child(3) > .cmpt-template-feedback-rating > .ngrateit > .ngrateit-star_wrapper > .ngrateit-background').as('selectedSubRating');
            cy.get('@selectedSubRating').should('be.visible');
            cy.get(':nth-child(1) > .sub-name').contains('Abbott234, Una')
                .and('be.visible');
            cy.get('.selected-sub-list > :nth-child(1) > .no-rating').contains('No Rating')
                .and('be.visible');
            cy.get(':nth-child(2) > .sub-name').contains('Abernathy321, Imelda');
            cy.get('.selected-sub-list > :nth-child(1) > .no-rating').contains('No Rating')
                .and('be.visible');
            cy.get(':nth-child(1) > .remove-sub').should('be.visible');
            cy.get(':nth-child(2) > .remove-sub').should('be.visible');
        });

        it('Step 1-Removing 1 Sub from selected sub list', function() {
            cy.get(':nth-child(2) > .remove-sub').click();
            cy.get(':nth-child(2) > .sub-name').contains('Abernathy588, Russ')
                .and('be.visible');
            cy.get(':nth-child(3) > .remove-sub').should('not.be.visible');
            cy.get(':nth-child(2) > .remove-sub').should('not.be.checked');
        });

        it('Step 1-Submitting selected sub list', function() {
            cy.get(':nth-child(1) > .actions > .fl-positive').click();
        });

        it('Step 2-Comments required checks', function() {
            cy.get('.-u-14-24 > .col-title > :nth-child(1)').as('commentsLabel');
            cy.get('.header > .actions > .fl-positive').as('addToListBtn');
            cy.get('[sub-id="7313001"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .notes-characters-left').as('topCharactersRemainingLabel');
            cy.get('[sub-id="7213318"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .notes-characters-left').as('btmCharactersRemainingLabel');
            cy.get('@commentsLabel').contains('Comments');
            cy.get('@topCharactersRemainingLabel').contains('256 character(s) left')
                .and('be.visible');
            cy.get('@btmCharactersRemainingLabel').contains('256 character(s) left')
                .and('be.visible');
        });

        it('Step 2-Comments required negative state checks', function() {
            cy.get('.header > .actions > .fl-positive').as('addToListBtn');
            cy.get('[sub-id="7313001"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .notes-characters-left').as('topCharactersRemainingLabel');
            cy.get('[sub-id="7213318"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .notes-characters-left').as('btmCharactersRemainingLabel');
            cy.get('@addToListBtn').should('have.attr','class','fl-button fl-positive fl-disabled');
            cy.get('[sub-id="7313001"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .ng-pristine').type('Forgot to assign homework.');
            cy.get('.input > .ng-pristine').click();
            cy.get('.header > .actions > .fl-positive').click();
            cy.get('@topCharactersRemainingLabel').contains('230 character(s) left')
                .and('be.visible');
            cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div > div.add-subs > div > ng-form > div.sub-sections.sub-comments-required > div > ul > li:nth-child(2) > ng-form > div.-u-14-24.comments-cell.grid-cell > div > div > div.validation-messages').as('commentsReqMessage');
            cy.get('@commentsReqMessage').contains('Exclusion comments are required')
                .and('be.visible');
        });

        it('Step 2-Fill comments',function (){
            cy.get('.header > .actions > .fl-positive').as('addToListBtn');
            cy.get('[sub-id="7313001"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .notes-characters-left').as('topCharactersRemainingLabel');
            cy.get('[sub-id="7213318"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .notes-characters-left').as('btmCharactersRemainingLabel');
            cy.get('[sub-id="7213318"] > .-g > .-u-14-24 > .cmpt-ui-textarea-v2 > .input > .ng-pristine').type('Late for the third time.');
            cy.get('@addToListBtn').should('have.attr','class','fl-button fl-positive');
            cy.get('@topCharactersRemainingLabel').contains('230 character(s) left')
                .and('be.visible');
            cy.get('@btmCharactersRemainingLabel').contains('232 character(s) left')
                .and('be.visible');
        });

        it('Final step-saving excluded subs', function() {
            cy.server()
            // preferenceListFixtures = fixtureHelperForPreferences(cy);
            // preferenceListFixtures.mockModifiedExclusionListSave();
            cy.route({
                method:'PUT',
                url: '/api/v1.0/CallGroups/179888/Preferences',
                response: Preferences()
            }).as('putPreferences');
        
            cy.route({
                method:'GET',
                url: '/api/v1.0/CallGroups/179888/Preferences?excluded=true',
                response: ExclusionList()
            }).as('getExclusionList');

            cy.get('.header > .actions > .fl-positive').click();
            cy.wait(['@putPreferences','@getExclusionList']);
        });

    });
    context('3. Editing an existing list', function(){
        it('Opening the record for editing', function(){
            cy.get('[sub-id="7083515"] > .-g > .action-cell > .fa-pencil').click();
            cy.get('[sub-id="7083515"] > .-g > .action-cell > .fa-times').as('cancelEditBtn');
            cy.get('@cancelEditBtn').should('be.visible');
            cy.get('[sub-id="7083515"] > .-g > .action-cell > .fl-positive').as('saveEditBtn');
            cy.get('@saveEditBtn').should('be.visible');
            cy.get('@saveEditBtn').should('have.attr','class','fl-button fl-positive fa fa-check ng-scope fl-disabled');
        });

        it('Comments required validation checks', function(){
            cy.get('.input > .ng-pristine').click();
            cy.get('[sub-id="7083515"] > .-g > .action-cell > .fl-positive').as('saveEditBtn');
            cy.get('@saveEditBtn').click();
            cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div.ng-scope > div:nth-child(1) > div.cmpt-call-group-excluded-list.ng-isolate-scope > ul > li:nth-child(3) > ng-form > div.comments-cell.grid-cell.-u-13-24 > div > div > div.validation-messages.ng-active').as('validationMessage');
            cy.get('@validationMessage').contains('Exclusion comments are required')
                .and('be.visible');
            cy.get('.input > .ng-pristine').type('Testing');
            cy.get('@validationMessage').should('have.attr','class','validation-messages ng-inactive');
        });

        it('Canceling out of an edit', function(){
            cy.get('.input > .ng-valid-maxlength').focus()
            cy.get('.input > .ng-valid-maxlength').clear()
            cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div.ng-scope > div:nth-child(1) > div.cmpt-call-group-excluded-list.ng-isolate-scope > ul > li:nth-child(3) > ng-form > div.comments-cell.grid-cell.-u-13-24 > div > div > div.validation-messages.ng-active').as('validationMessage');
            cy.get('@validationMessage').contains('Exclusion comments are required')
                .and('be.visible');
            cy.get('[sub-id="7083515"] > .-g > .action-cell > .fa-times').click();
        });

        it('Removing a sub', function(){
            preferenceListFixtures = fixtureHelperForPreferences(cy);
            preferenceListFixtures.mockExclusionListDelete();
            cy.get('[sub-id="7204715"] > .-g > .select-cell > .ng-valid').click();
            cy.get('[sub-id="7204715"] > .-g > .select-cell > .ng-valid').should('be.checked');
            cy.get('[sub-id="7204715"] > .-g > .action-cell > .fa-pencil').should('have.attr','class','fl-button fa fa-pencil ng-scope fl-disabled');
            cy.get('.actions-header > .substitute-actions > .fl-negative').contains('Remove Selected Substitute(s)')
                .and('be.visible');
            cy.get('.actions-header > .substitute-actions > .fl-negative').click();
            cy.get('.actions-header > .substitute-actions > .fl-positive').should('be.visible');
        });

    });


    // context('Excluded Substitutes - State change checks for Required Comments', function () {
    //   beforeEach(() => {
    //     cy.server();
    //     fixtures = fixtureFactory(cy);
    //     fixtures.passthroughOrganization();
    //     fixtures.institutions();
    //     fixtures.user();
    //     fixtures.products();
    //     fixtures.workerTypes();
    //     fixtures.permissionProfiles();
    //     fixtures.notifications();

    //     cy.route({
    //       method: 'GET',
    //       url: '/api/v1.0/institutions/5400',
    //       response: Institution()
    //     });

    //     cy.route({
    //       method: 'GET',
    //       url: '/api/v1.0/locations/5400/CallGroup',
    //       response: { "data": { "id": 179888, "callGroupOrder": 0, "name": "Bush Elementary", "orgId": 10810, "ownerType": 3, "ownerId": 5400, "maxVisibilityMinutes": 43200, "minVisibilityMinutes": 240, "visibilityHours": 80, "visibilityPercent": 75, "lastSortTime": "0001-01-01T00:00:00", "nextRoundRobinIndex": 0 }, "messages": [], "success": true, "modelState": {} }
    //     });

    //     cy.route({
    //       method: 'GET',
    //       url: '/api/v1.0/CallGroups/179888/Preferences?excluded=true',
    //       response: ExclusionList()
    //       // { "data": [{ "id": 6510187, "comments": null, "commentsExcluded": "Filler text for testing", "substitute": { "id": 3360162, "firstName": "MISTY", "middleName": "", "lastName": "FANGROW", "absenceFeedback": null, "isActive": true, "email": null, "externalId": null, "identifier": "908000002", "phone": "6107240207", "isDeleted": false, "pin": null, "orgId": null, "skills": [], "resume": null, "photo": null }, "excluded": true, "favoriteRank": null, "maxVisibilityMinutes": null, "minVisibilityMinutes": null, "visibilityHours": null, "visibilityPercent": null, "order": null, "institution": null, "worker": null }, { "id": 39980131, "comments": null, "substitute": { "id": 3360162, "firstName": "Lorraine", "middleName": "M.", "lastName": "Fogg", "absenceFeedback": null, "isActive": true, "email": "LorraineMFogg@jourrapide.com", "externalId": null, "identifier": "MVS126815", "phone": "2142079382", "isDeleted": false, "pin": null, "orgId": null, "skills": [], "resume": null, "photo": null }, "excluded": true, "favoriteRank": null, "maxVisibilityMinutes": null, "minVisibilityMinutes": null, "visibilityHours": null, "visibilityPercent": null, "order": null, "institution": null, "worker": null }, { "id": 39760987, "comments": "???????????????????????????????????????????????????????????????????????????????", "substitute": { "id": 6510187, "firstName": "Caevakybae", "middleName": "", "lastName": "6qt9LwSUB", "absenceFeedback": null, "isActive": true, "email": null, "externalId": null, "identifier": "6qt9Lw3n", "phone": "4847598107", "isDeleted": false, "pin": null, "orgId": null, "skills": [], "resume": null, "photo": null }, "excluded": true, "favoriteRank": null, "maxVisibilityMinutes": null, "minVisibilityMinutes": null, "visibilityHours": null, "visibilityPercent": null, "order": null, "institution": null, "worker": null }, { "id": 39980132, "comments": null, "substitute": { "id": 7004153, "firstName": "Phoebe", "middleName": "", "lastName": "Romaguera220", "absenceFeedback": null, "isActive": true, "email": null, "externalId": null, "identifier": "haCXRzKgDYPg", "phone": "7998954683", "isDeleted": false, "pin": null, "orgId": null, "skills": [], "resume": null, "photo": null }, "excluded": true, "favoriteRank": null, "maxVisibilityMinutes": null, "minVisibilityMinutes": null, "visibilityHours": null, "visibilityPercent": null, "order": null, "institution": null, "worker": null }], "messages": [], "success": true, "modelState": {} }
    //     });
    //     cy.visit('/settings/school/5400/excluded-substitutes');
    //   });

});