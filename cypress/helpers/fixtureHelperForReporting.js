const fixtureFactory = require('../helpers/fixtureHelper');
const Institution = require('../fixtures/ExcludedSubs/institution');
const PreferenceList = require('../fixtures/ExcludedSubs/PreferenceList');


const fixture = (cy) => {
const mockAddingNewExclusions = () =>{

    cy.route({
        method:'GET',
        url:'/api/v1.0/CallGroups/179888/AvailableSubstitutes?forPreferredList=false&mask=&maxRecords=50&offSet=0',
        response: ExcludNewSubs()
    });
}


const mockPreferenceCalls = (cmntsReq) =>{

        cy.route({
            method: 'GET',
            url: '/api/v1.0/institutions/5400',
            response: Institution(cmntsReq)
        });

        cy.route({
            method: 'GET',
            url: '/api/v1.0/locations/5400/CallGroup',
            response: CallGroup()
        });

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=false',
            response: PreferenceList()
        });
}



return {
    mockAddingNewExclusions,
    mockPreferenceCalls,
}

}

module.exports = fixture;