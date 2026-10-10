const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureHelperForPreferences = require('../../helpers/fixtureHelperForPreferences');
const SuccessfulCall = require('../../fixtures/ExcludedSubs/SuccessfulCall');
const AlteredPreferenceList = require('../../fixtures/ExcludedSubs/AlteredPreferenceList');

let fixtures;
let preferenceListFixtures;
describe('Preferred Substitutes UI regression checks', function() {
    before(() => {
        cy.server();
        fixtures = fixtureFactory(cy);
        fixtures.passthroughOrganization();
        fixtures.institutions();
        fixtures.campusUser();
        fixtures.products();
        fixtures.workerTypes();
        fixtures.notifications();

        preferenceListFixtures = fixtureHelperForPreferences(cy);
        preferenceListFixtures.mockPreferenceCalls(true);

        cy.visit('/settings/school/5400/preferred-substitutes');
    });
context('Initial load state checks', function(){ 
    it('Validating the correct page loaded', function (){
        cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div.section-heading.clear > div').contains('Preferred Substitutes')
            .and('be.visible');
        cy.url().should('contain','/settings/school/5400/preferred-substitutes');
    });

    it('Checking the tab status', function(){
        cy.get('.tabs > .active').contains('Preferred Substitutes')
            .and('be.visible');
        cy.get('.tabs > :nth-child(1)').contains('General Information')
            .and('be.visible');
        cy.get('.tabs > :nth-child(2)').contains('Time Settings')
            .and('be.visible');
        cy.get('.tabs > :nth-child(4)').contains('Excluded Substitutes')
            .and('be.visible');
        cy.get('.tabs > :nth-child(5)').contains('Shared Files')
            .and('be.visible');
    });

    it('Checking headers labels', function(){
        cy.get('h3.ng-binding').contains('Bush Elementary')
            .and('be.visible');
        cy.get('.section-heading').contains('Preferred Substitutes')
            .and('be.visible');
        cy.get('.title').contains('Defaults')
            .and('be.visible');
    });

    it('Checking Call sequence settings', function(){
        cy.get('[ng-class="{\'no-edit\': !editable}"] > .-u-5-24 > :nth-child(2)').contains('Use Call Order');
        cy.get('[ng-class="{\'no-edit\': !editable}"] > .-u-5-24 > :nth-child(3)').contains('Use Random Order');
        cy.get(':nth-child(2) > .ng-binding > .ng-pristine').should('be.checked');
        cy.get(':nth-child(3) > .ng-binding > .ng-pristine').should('not.be.checked');
        cy.get(':nth-child(1) > .order-cell').contains('1')
            .and('be.visible');
        cy.get(':nth-child(1) > .order-cell > .ng-scope > .fa').should('be.visible');
    });

    it('Job visibility settings check', function(){
        cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div > div:nth-child(1) > div.cmpt-call-group-pref-list > ul > li:nth-child(1) > div.-u-2-24.hrsVisibility-cell.grid-cell > div:nth-child(1) > div > div').as('empVisibilityDays');
        cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div > div:nth-child(1) > div.cmpt-call-group-pref-list > ul > li:nth-child(1) > div.-u-2-24.hrsVisibility-cell.grid-cell > div:nth-child(2) > div > div').as('empVisibilityHrs');
        cy.get('.-u-11-24 > :nth-child(2)').as('daysLabel');
        cy.get('.-u-11-24 > :nth-child(4)').as('hoursLabel');
        cy.get('.-u-12-24 > .group-title').contains('Job Visibility');
        cy.get('@empVisibilityDays').contains('3')
             .and('be.visible');
        cy.get('@daysLabel').contains('Days')
            .and('be.visible');
        cy.get('@empVisibilityHrs').contains('0')
            .and('be.visible');
        cy.get('@hoursLabel').contains('Hrs')
            .and('be.visible');
    });

    it('Checking for add subs button', function(){
        cy.get('.actions-header > div > .fl-positive').contains('Add Substitute(s)')
            .and('be.visible');
    });

    it('Checking Column headers', function(){
        cy.get('.order-th').contains('Order')
            .and('be.visible');
        cy.get('.grid-header > .-u-5-24').contains('Name')
            .and('be.visible');
        cy.get('.hrsVisibility-th').contains('Visibility')
            .and('be.visible');
        cy.get('.sub-header > :nth-child(1)').contains('Days')
            .and('be.visible');
        cy.get('.sub-header > :nth-child(2)').contains('Hrs')
            .and('be.visible');
        cy.get('.grid-header > .-u-6-24').contains('Comments')
            .and('be.visible');
        cy.get('.select-th').contains('Select')
            .and('be.visible');
        cy.get('.action-th').contains('Action')
            .and('be.visible');
    });

});

context('Data-Grid integration checks', function(){

    it('Order by column data checks', function(){
        cy.get(':nth-child(1) > .order-cell > .ng-scope > .fa').should('be.visible');
        cy.get(':nth-child(1) > .order-cell > .ng-scope').contains('1')
            .and('be.visible');
        cy.get(':nth-child(2) > .order-cell > .ng-scope > .fa').should('be.visible');
        cy.get(':nth-child(2) > .order-cell > .ng-scope').contains('2')
            .and('be.visible');
        cy.get(':nth-child(6) > .order-cell > .ng-scope > .fa').should('be.visible');
        cy.get(':nth-child(6) > .order-cell > .ng-scope').contains('6')
            .and('be.visible');
    });

    it('Name Column Data checks', function(){
        cy.get(':nth-child(1) > .-u-5-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').contains('KNIGHT, DONNA')
        cy.get(':nth-child(1) > .-u-5-24 > .no-rating').contains('(No Rating)')
            .and('be.visible');
        cy.get(':nth-child(2) > .-u-5-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').contains('BORNHEIMER, MARK')
            .and('be.visible');
        cy.get(':nth-child(2) > .-u-5-24 > .no-rating').contains('(No Rating)')
            .and('be.visible');
        cy.get(':nth-child(5) > .-u-5-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').contains('BAXTER, DEBRA')
            .and('be.visible');
        cy.get(':nth-child(5) > .-u-5-24 > .no-rating').contains('(No Rating)')
            .and('be.visible');
    });

    it('Visibility Days column data checks', function(){
        cy.get(':nth-child(1) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .ng-binding').contains('3')
            .and('be.visible');
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .ng-binding').contains('3')
            .and('be.visible');
        cy.get(':nth-child(5) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .ng-binding').contains('3')
            .and('be.visible');
        cy.get(':nth-child(6) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .ng-binding').contains('3')
            .and('be.visible');
    });

    it('Visibility Hours column data checks', function(){
        cy.get(':nth-child(1) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .ng-binding').contains('0')
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .ng-binding').contains('0')
        cy.get(':nth-child(3) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .ng-binding').contains('0')
        cy.get(':nth-child(5) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .ng-binding').contains('0')
        cy.get(':nth-child(6) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .ng-binding').contains('0')
    });

    it('Comments column data check', function(){
        cy.get('.grid-rows > :nth-child(1) > .-u-6-24').contains('Testing out the comments field. <br/>')
        .and('be.visible');
        cy.get(':nth-child(6) > .-u-6-24').contains('Excellent teaching skills')
        .and('be.visible');
        cy.get(':nth-child(2) > .-u-6-24').should('be.visible');
    });

    it('Edit selector column checks', function(){
        cy.get(':nth-child(1) > .select-cell > .ng-pristine').should('not.be.checked')
            .and('be.visible');
        cy.get(':nth-child(2) > .select-cell > .ng-pristine').should('not.be.checked')
            .and('be.visible');
        cy.get(':nth-child(3) > .select-cell > .ng-pristine').should('not.be.checked')
            .and('be.visible');
        cy.get(':nth-child(4) > .select-cell > .ng-pristine').should('not.be.checked')
            .and('be.visible');
        cy.get(':nth-child(5) > .select-cell > .ng-pristine').should('not.be.checked')
            .and('be.visible');
        cy.get(':nth-child(6) > .select-cell > .ng-pristine').should('not.be.checked')
            .and('be.visible');
    });

    it('Edit button checks', function(){
        cy.get(':nth-child(1) > .select-cell > .ng-pristine')
            .and('be.visible');
        cy.get(':nth-child(2) > .select-cell > .ng-pristine')
            .and('be.visible');
        cy.get(':nth-child(3) > .select-cell > .ng-pristine')
            .and('be.visible');
        cy.get(':nth-child(4) > .select-cell > .ng-pristine')
            .and('be.visible');
        cy.get(':nth-child(5) > .select-cell > .ng-pristine')
            .and('be.visible');
        cy.get(':nth-child(6) > .select-cell > .ng-pristine')
            .and('be.visible');
    });
});

context('State change checks', function(){
    preferenceListFixtures = fixtureHelperForPreferences(cy);
    it('Call sequence change checks', function(){
        cy.get(':nth-child(3) > .ng-binding > .ng-pristine').check();
        cy.get(':nth-child(3) > .ng-binding > .ng-valid').should('be.checked');
        cy.get(':nth-child(1) > .order-cell > .ng-scope > .fa').should('not.be.visible');
        cy.get('.-u-6-24 > .fa-times').should('be.visible');
        cy.get('[title="Save Defaults"]').should('be.visible');
        cy.get('[title="Save Defaults"]').contains('Save Defaults');
    });

    it('Preference list edit save', function(){
        cy.server();
        preferenceListFixtures.mockPreferenceListEditSave();
        cy.get('[title="Save Defaults"]').click();
        cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div.ng-scope > div:nth-child(1) > div.cmpt-call-group-pref-list > ul > li:nth-child(1) > div.-u-2-24.order-cell.grid-cell').should('not.be.visible');
        cy.get('.-u-6-24 > .fa-times').should('not.be.visible');
        cy.get('[title="Save Defaults"]').should('not.be.visible');
        //Testing for list reordering to alphbetical order after save
        cy.get(':nth-child(5) > .-u-5-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').contains('Fadel, Tessie')
        cy.get(':nth-child(5) > .-u-6-24').contains('Excellent teaching skills');
    });

    it('Remove Subs state change', function(){
        cy.get(':nth-child(1) > .select-cell > .ng-valid').should('be.visible');
        cy.get(':nth-child(2) > .select-cell > .ng-valid').should('be.visible');
        cy.get(':nth-child(5) > .select-cell > .ng-valid').should('be.visible');
        cy.get(':nth-child(6) > .select-cell > .ng-valid').should('be.visible');
        cy.get(':nth-child(1) > .select-cell > .ng-valid').should('be.visible').click();
        cy.get(':nth-child(6) > .select-cell > .ng-valid').should('be.visible').click();
        cy.get('.actions-header > div.ng-scope > .fl-negative').contains(' Remove Selected Substitute(s)') 
            .and('be.visible');
        cy.get(':nth-child(3) > .ng-binding > .ng-valid').should('have.attr','disabled','disabled');
        cy.get('.ng-binding > .ng-pristine').should('have.attr','disabled','disabled');
        cy.get('[ng-model="vm.visibilityDays"]').should('have.attr','disabled','disabled');
        cy.get('[ng-model="vm.visibilityHours"]').should('have.attr','disabled','disabled');
    });

    it('Removing Sub from List', function(){
        cy.get(':nth-child(1) > .select-cell > .ng-valid').should('be.checked');
        cy.get(':nth-child(6) > .select-cell > .ng-valid').should('be.checked');
        cy.server();
        preferenceListFixtures.mockRemoveSub();
        cy.get('.actions-header > div.ng-scope > .fl-negative').click();
        cy.get(':nth-child(1) > .-u-5-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').contains('BAXTER, DEBRA')
            .and('be.visible');
        cy.get(':nth-child(4) > .-u-5-24 > [ng-if="row.substitute != null"] > .cmpt-template-substitute-link').contains('Fadel, Tessie')
            .and('be.visible');
        cy.get('[ng-model="vm.visibilityDays"]').should('not.have.attr','disabled','disabled');
        cy.get('[ng-model="vm.visibilityHours"]').should('not.have.attr','disabled','disabled');
    });

    it('Edit comments',function(){
        cy.get(':nth-child(1) > .action-cell > .fa-pencil').click();
        cy.get(':nth-child(1) > .-u-6-24 > .cmpt-ui-textarea > .notes-characters-left').as('charactersLeft')
        cy.get('@charactersLeft').contains('256 character(s) left');
        cy.get(':nth-child(1) > .-u-6-24 > .cmpt-ui-textarea > :nth-child(2) > .ng-pristine').focus();
        cy.get(':nth-child(1) > .-u-6-24 > .cmpt-ui-textarea > :nth-child(2) > .ng-pristine').type('Loves to teach 5th Grade Science');
        cy.get('@charactersLeft').contains('224 character(s) left');
        cy.server()
        preferenceListFixtures.mockSaveEdit();
        cy.get(':nth-child(1) > .action-cell > .fa-check').click();
    });

    it('Edit visibility settings', function(){
        cy.get(':nth-child(2) > .action-cell > .fa-pencil').click();
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .fl-input').focus().clear();
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .fl-input').type('0');
        cy.server();
        preferenceListFixtures.mockSaveEdit();
        cy.get(':nth-child(2) > .action-cell > .fa-check').click();  
    });
});

context('Validation checks',function(){
    preferenceListFixtures = fixtureHelperForPreferences(cy);

    it('Visibility days validation check', function(){
        cy.get(':nth-child(2) > .action-cell > .fa-pencil').click();
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .fl-input').focus().clear();
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .fl-input').type('121');
        cy.server();
        preferenceListFixtures.mockSaveEdit();
        cy.get(':nth-child(2) > .action-cell > .fa-check').click();
        cy.get(':nth-child(2) > .error-message-area > .fl-system-message > div').contains('Error!')
            .and('be.visible');
        cy.get(':nth-child(2) > .error-message-area > .fl-system-message > div').contains('There are (1)')
            .and('be.visible');
        cy.get(':nth-child(2) > .error-message-area > .fl-system-message > div').contains('Error(s)')
            .and('be.visible');
        cy.get('.message > .ng-binding').contains('Maximum visibility cannot be greater than 120 Days');
        cy.get(':nth-child(2) > .action-cell > .fa-times').click();
    });

    it('Visibility hrs validation check', function(){
        cy.get(':nth-child(2) > .action-cell > .fa-pencil').click();
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .fl-input').focus().clear();
        cy.get(':nth-child(2) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .fl-input').type('61');
        cy.server();
        preferenceListFixtures.mockSaveEdit();
        cy.get(':nth-child(2) > .action-cell > .fa-check').click();
        cy.get(':nth-child(2) > .error-message-area > .fl-system-message > div').contains('Error!')
            .and('be.visible');
        cy.get(':nth-child(2) > .error-message-area > .fl-system-message > div').contains('There are (1)')
            .and('be.visible');
        cy.get(':nth-child(2) > .error-message-area > .fl-system-message > div').contains('Error(s)')
            .and('be.visible');
        cy.get('.message > .ng-binding').contains('Hours cannot be greater than 60');
        cy.get(':nth-child(2) > .action-cell > .fa-times').click();
    });

    it('Set Preference list visibility', function(){
        cy.get('[ng-model="vm.visibilityDays"]').focus().clear();
        cy.get('[ng-model="vm.visibilityDays"]').type('121');
        cy.get('[ng-model="vm.visibilityHours"]').focus().clear();
        cy.get('[ng-model="vm.visibilityHours"]').type('61');
        cy.server();
        preferenceListFixtures.mockAlteredPreferenceListEditSave();
        cy.get('[title="Save Defaults"]').click();
        cy.get('.-u-6-24 > .fa-times').click();
    });

    it('Set Preference list visibility', function(){
        cy.get('[ng-model="vm.visibilityDays"]').focus().clear();
        cy.get('[ng-model="vm.visibilityDays"]').type('120');
        cy.get('[ng-model="vm.visibilityHours"]').focus().clear();
        cy.get('[ng-model="vm.visibilityHours"]').type('61');
        cy.server();
        preferenceListFixtures.mockAlteredPreferenceListEditSave();
        cy.get('[title="Save Defaults"]').click();
        cy.get('.-u-6-24 > .fa-times').click();
    });

});

context('Visibility edits', function(){
    preferenceListFixtures = fixtureHelperForPreferences(cy);
    it('Set Employee Visibility overrides', function(){
        cy.get(':nth-child(3) > .action-cell > .fa-pencil').click();
        cy.get(':nth-child(3) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .fl-input').focus().clear();
        cy.get(':nth-child(3) > .hrsVisibility-cell > :nth-child(2) > .cmpt-ui-textbox > .fl-input').type('20');
        cy.get(':nth-child(3) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .fl-input').focus().clear();
        cy.get(':nth-child(3) > .hrsVisibility-cell > :nth-child(1) > .cmpt-ui-textbox > .fl-input').type('119');
        cy.server();
        preferenceListFixtures.mockSaveEdit();
        cy.get(':nth-child(3) > .action-cell > .fa-check').click();
    });

    it('Set Preference list visibility', function(){
        cy.get('[ng-model="vm.visibilityDays"]').focus().clear();
        cy.get('[ng-model="vm.visibilityDays"]').type('120');
        cy.get('[ng-model="vm.visibilityHours"]').focus().clear();
        cy.get('[ng-model="vm.visibilityHours"]').type('0');
        cy.server();
        //preferenceListFixtures.mockAlteredPreferenceListEditSave();
        cy.route({
            method: 'PUT',
            url: '/api/v1.0/callGroups/179888',
            response: SuccessfulCall()
        }).as('putSuccessfulCall');

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=false',
            response: AlteredPreferenceList()
        }).as('getAlteredPreferenceList');

        cy.get('[title="Save Defaults"]').click();
        cy.wait(['@putSuccessfulCall','@getAlteredPreferenceList']);
        cy.get(':nth-child(4) > .hrsVisibility-cell').contains('0');
        cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div.ng-scope > div:nth-child(1) > div.cmpt-call-group-pref-list.ng-isolate-scope > ul > li:nth-child(3) > div.-u-2-24.hrsVisibility-cell.grid-cell > div:nth-child(1) > div > div').contains('120');
    });

});

context('Adding subs to preference list', function(){

    it('Clicking add subs btn',function(){
        cy.server();
        preferenceListFixtures.mockAddSubsList();
        cy.get('.actions-header > div.ng-scope > .fl-positive').click();
        cy.get('body > div.main-content > div > ui-view > ui-view > div > div.content-panel > ui-view > div > div.section-heading.clear > div').contains('Preferred Substitutes');
    });

    it('Selecting Subs to add', function(){
        cy.get('.row-0-1 > .-g > .checkbox').check();
        cy.get('.row-0-5 > .-g > .checkbox').check();
        cy.server();
        preferenceListFixtures.mockClickingAddToPreferredList();
        cy.get(':nth-child(1) > .actions > .fl-positive').click();
        cy.get('.title').should('be.visible');
        cy.get('.actions-header > div > .fl-positive').should('be.visible');
        cy.get('.actions-header > div.ng-scope > .fl-positive').contains('Add Substitute(s)')
        cy.get(':nth-child(5) > .-u-5-24 > [ng-if="row.substitute != null"]').contains('Abernathy588, Russ');
        cy.get(':nth-child(6) > .-u-5-24 > [ng-if="row.substitute != null"]').contains('Abbott234, Una');
    });

});

});