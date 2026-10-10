const fixtureFactory = require('../helpers/fixtureHelper');
const Institution = require('../fixtures/ExcludedSubs/institution');
const PreferenceList = require('../fixtures/ExcludedSubs/PreferenceList');
const CallGroup = require('../fixtures/ExcludedSubs/callGroup');
const ExcludNewSubs = require('../fixtures/ExcludedSubs/exclusionAddList');
const Preferences = require('../fixtures/ExcludedSubs/AddSubs');
const SuccessfulCall = require('../fixtures/ExcludedSubs/SuccessfulCall');
const ExclusionList = require('../fixtures/ExcludedSubs/ExclusionList');
const AlteredPreferenceList = require('../fixtures/ExcludedSubs/AlteredPreferenceList');
const AddNewSubsList = require('../fixtures/ExcludedSubs/exclusionAddList');
const AddedSubsToPreferenceList = require('../fixtures/ExcludedSubs/AddToPreferenceList');

const fixture = (cy) => {
const mockAddingNewExclusions = () =>{

    cy.route({
        method:'GET',
        url:'/api/v1.0/CallGroups/179888/AvailableSubstitutes?forPreferredList=false&mask=&maxRecords=50&offSet=0',
        response: ExcludNewSubs()
    });
}

const mockModifiedExclusionListSave = () =>{
    
    cy.route({
        method:'PUT',
        url: '/api/v1.0/CallGroups/179888/Preferences',
        response: Preferences()
    });

    cy.route({
        method:'GET',
        url: '/api/v1.0/CallGroups/179888/Preferences?excluded=true',
        response: ExclusionList()
    });
}

const mockExclusionListDelete = () =>{

    cy.route({
        method:'DELETE',
        url: '/api/v1.0/CallGroups/179888/Preferences?forPreferredList=true&subIds=7204715',
        response: SuccessfulCall()
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

const mockGettingExclusionList = (cmntsReq) =>{

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
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=true',
            response: ExclusionList()
        });
}

const mockPreferenceListEditSave = () =>{

        cy.route({
            method: 'PUT',
            url: '/api/v1.0/callGroups/179888',
            response: SuccessfulCall()
        });

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=false',
            response: PreferenceList()
        });
}
const mockRemoveSub = () =>{

        cy.route({
            method: 'DELETE',
            url: '/api/v1.0/CallGroups/179888/Preferences?forPreferredList=true&subIds=48163,48239',
            response: SuccessfulCall()
        });
}

const mockSaveEdit = () =>{

        cy.route({
            method: 'PUT',
            url: '/api/v1.0/CallGroups/179888/Preferences',
            response: SuccessfulCall()
        });
}

const mockAlteredPreferenceListEditSave = () =>{

        cy.route({
            method: 'PUT',
            url: '/api/v1.0/callGroups/179888',
            response: SuccessfulCall()
        });

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=false',
            response: AlteredPreferenceList()
        });
}

const mockAddSubsList = () =>{

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/AvailableSubstitutes?forPreferredList=true&mask=&maxRecords=50&offSet=0',
            response: AddNewSubsList()
        });
}

const mockClickingAddToPreferredList = () =>{

        cy.route({
            method: 'PUT',
            url: '/api/v1.0/CallGroups/179888/Preferences',
            response: SuccessfulCall()
        });

        cy.route({
            method: 'GET',
            url: '/api/v1.0/CallGroups/179888/Preferences?excluded=false',
            response: AddedSubsToPreferenceList()
        });
}


return {
    mockAddingNewExclusions,
    mockPreferenceCalls,
    mockGettingExclusionList,
    mockPreferenceListEditSave,
    mockRemoveSub,
    mockSaveEdit,
    mockAlteredPreferenceListEditSave,
    mockAddSubsList,
    mockClickingAddToPreferredList,
    mockModifiedExclusionListSave,
    mockExclusionListDelete,
}

}

module.exports = fixture;