const fixtureFactory = require('../../helpers/fixtureHelper');
const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');

let fixtures;
let absenceFixtures;
describe('CU - Absence View - Org does not have Absence Approvals setting', function() {
    before(() => {
        cy.server();
        fixtures = fixtureFactory(cy);

        //override an org setting to direct the page to load differently.
        var orgSettings = {
            "usesAbsenceApproval": false
        };
        fixtures.passthroughOrganization(orgSettings);

        fixtures.institutions();
        fixtures.campusUser();
        fixtures.products();
        fixtures.workerTypes();
        fixtures.notifications();

        absenceFixtures = fixtureFactoryForAbsence(cy);
        absenceFixtures.mockAbsenceView();

        cy.visit('absences/detail/224976352/view');
    });


    it('Validating Approvers tab is missing because the org setting is OFF', function() {

        cy.get('.tabs > :nth-child(3)').contains('Approvers')
            .and('not.be.visible');

        cy.get('.tabs > :nth-child(4)').contains('Approver Log')
            .and('not.be.visible');
    });


});