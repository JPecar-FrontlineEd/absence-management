import { setTimeout } from 'timers';
const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');

let fixtures;
let absenceFixtures;
describe('OU - Absence View', function() {
    before(() => {
        cy.server();
        fixtures = fixtureFactory(cy);
        fixtures.passthroughOrganization();
        fixtures.institutions();
        fixtures.orgUser();
        fixtures.products();
        fixtures.workerTypes();
        fixtures.notifications();

        absenceFixtures = fixtureFactoryForAbsence(cy);
        absenceFixtures.mockAbsenceView(224976352);

        cy.visit('absences/detail/224976352/view');

    });

    it('Employee name in header is a link', function() {
        cy.get('.worker-title').should('be.visible');
        cy.get('.worker-title').contains('Fahey483, Ariane').should('have.attr', 'href', '/navigator/te_general.asp?x=x&TB2=TAB1&TB1=TAB1&work_id=8323397');
    });

    it('Institution name in variation header is a link', function() {
        cy.get('.cmpt-template-institution-link').as('schoolNameLink');
        cy.get('@schoolNameLink').should('be.visible');
        cy.get('@schoolNameLink').contains('Adams Middle School').should('have.attr', 'href', '/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id=5408');
    });

    it('Checking for the file attachment', function(){
        cy.get('.file').contains('upload_to_aesop.rtf');
    });

    it('Checking absence lock status', function(){
        cy.server()
        absenceFixtures.mockRelatedLockedAbsView();

        cy.get('.top > .fl-button').contains('Edit Absence').as('editButton');
        cy.get('@editButton').click();
        cy.get('.toast').should('be.visible');
        cy.get('.toast').contains('Error').and('be.visible');
        cy.get('.toast-message').contains('This record is currently locked.  Please try again later.')
        cy.get('.top > .fl-button').as('topUnlockButton');
        cy.get('@topUnlockButton').contains('Unlock')
        .and('be.visible');
        cy.get('.bottom > .fl-button').contains('Unlock')
        .and('be.visible');
        cy.get('.toast > .fa').click();
        cy.get('div > a.active.fa.locked').should('be.visible');
    });

    it('Create another absence is a link', function() {     
        cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div:nth-child(1) > div.content-panel > ui-view > div > div.-g > div.-u-6-24.right-side > div.cmpt-absr-next-steps > div.next-steps > div.create-another-absence-link > a').as('createAnotherAbsenceLink');
        cy.get('@createAnotherAbsenceLink').contains('Create another Absence for this Employee');
        cy.get('@createAnotherAbsenceLink').should('have.attr','href','/absences/create-absence-details?workerId=8323397')
        .and('be.visible');
    });


    });


