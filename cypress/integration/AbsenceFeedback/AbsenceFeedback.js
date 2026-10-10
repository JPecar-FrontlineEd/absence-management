const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceReasons = require('../../fixtures/RptFilterData/AbsenceReasons');
const VacancyProfiles = require('../../fixtures/RptFilterData/VacancyProfiles');
const SubstituteFilterList = require('../../fixtures/RptFilterData/SubstituteFilterList');
const EmployeeFilterList = require('../../fixtures/RptFilterData/EmployeeFilterList');
const VacancyReasonsFilterList = require('../../fixtures/RptFilterData/VacancyReasons');
const AbsWithFeedback = require('../../fixtures/AbsenceData/AbsFeedbackAbsData')

let fixtures;
describe('CU- Absence Feedback Report', function (){
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
        url: '/api/v1.0/workers?fields=(id,firstName,lastName,isActive)&includeInactive=true',
        response: EmployeeFilterList()
    })

    cy.route({
        method: 'GET',
        url: '/api/v1.0/substitutes?fields=(id,firstName,middleName,lastName,isActive)',
        response: SubstituteFilterList()
    })


    cy.visit('reports/absence/feedback');

  });

  it('Verifying that correct page has loaded', function(){
    cy.url().should('contain','reports/absence/feedback');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > h3').contains('Absence Feedback');

  });

  it('Validating the school filter is set to all locations', function(){
    cy.get('.schools').contains('All Schools')
      .and('be.visible');
  });

  it('Validating the Employee filter is set to all employees', function(){
    cy.get('.employees').contains('All Employees')
      .and('be.visible');
  });

  it('Validating the Employee Type filter is set to all types', function(){
    cy.get('.employee-types').contains('All Employee Types')
      .and('be.visible');
  });

  it('Validating the Substitutes filter is set to all types', function(){
    cy.get('.substitutes').contains('All Substitutes')
      .and('be.visible');
  });

  it('Validating the select another report dropdown is available', function(){
    cy.get('.cmpt-ui-dropdown > .ng-empty').should('be.visible')
  });

  it('Ensuring that no data has been loaded', function(){
    cy.get('.no-data > ng-transclude > .ng-binding').contains('To begin, please perform a search above.')
      .and('be.visible');
  });
  
  it('Checking data grid header labeling', function(){
    cy.get('.header-content').contains('Absence Feedback')
      .and('be.visible');
  });

  it('Verifying user is able to access sub perf rating slider', function(){
    cy.get('.substitute-performance').should('be.visible');
    cy.get('.substitute-performance > .title').contains('Substitute Performance Rating Between')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-performance.slider.ng-scope > div > div.markers > label:nth-child(1)').contains('No Rating')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-performance.slider.ng-scope > div > div.markers > label:nth-child(2)').contains('1')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-performance.slider.ng-scope > div > div.markers > label:nth-child(3)').contains('2')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-performance.slider.ng-scope > div > div.markers > label:nth-child(4)').contains('3')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-performance.slider.ng-scope > div > div.markers > label:nth-child(5)').contains('4')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-performance.slider.ng-scope > div > div.markers > label:nth-child(6)').contains('5')
      .and('be.visible');
    cy.get('.substitute-performance > .cmpt-ui-slider > .plg-slider > .ui-slider-range').should('be.visible');
  });

  it('Verifying user is able to access sub experience rating slider', function(){
    cy.get('.substitute-experience').should('be.visible');
    cy.get('.substitute-experience > .title').contains('Substitute Experience Rating Between')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-experience.slider.ng-scope > div > div.markers > label:nth-child(1)').contains('No Rating')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-experience.slider.ng-scope > div > div.markers > label:nth-child(2)').contains('1')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-experience.slider.ng-scope > div > div.markers > label:nth-child(3)').contains('2')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-experience.slider.ng-scope > div > div.markers > label:nth-child(4)').contains('3')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-experience.slider.ng-scope > div > div.markers > label:nth-child(5)').contains('4')
      .and('be.visible');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > div.panel > div > div.filter-section.hide-print > div.filter.no-bg-color.substitute-experience.slider.ng-scope > div > div.markers > label:nth-child(6)').contains('5')
      .and('be.visible');
    cy.get('.substitute-experience > .cmpt-ui-slider > .plg-slider > .ui-slider-range').should('be.visible');
  });

it.skip('Adjusting Sub Perf slider', function(){
    cy.get('.substitute-performance > .cmpt-ui-slider > .plg-slider > [style="left: 0%;"]').trigger('mousedown');
    //Cypress.$('.substitute-performance > .cmpt-ui-slider > .plg-slider > [style="left: 0%;"]').animate({"right": "-=20px"},"slow")

});

it('Running the report and checking column headers', function(){
  
    cy.server();
    cy.route({
        method: 'GET',
        url: /\/api\/v1.0\/absencerequests\?endDate=.*&feedbackTotalData=true&fields=\(id,worker\(id,firstName,middleName,lastName,absenceFeedback,isVacancy\),startDate,endDate,substitute\(id,firstName,middleName,lastName,absenceFeedback\),absences\(id,institution\(id,isAvailable,name\)\),feedBack\)&instIds=&maxSubExpRating=5&maxSubRating=5&minSubExpRating=0&minSubrating=0&startDate=.*&subIds=&useAlwaysOnDb=true&wkIds=&wktIds=/,
        response: AbsWithFeedback()
    });
    cy.get('.fl-primary').click()
    cy.get('.header-content').contains('Absence Feedback')
      .and('be.visible');
    cy.get('.dateRange-th').contains('Date')
      .and('be.visible');
    cy.get('.substitute-th').contains('Substitute')
      .and('be.visible');
    cy.get('.substitutePerformacne-th').contains('Substitute Performance')
      .and('be.visible');
    cy.get('.name-th').contains('Employee')
      .and('be.visible');
    cy.get('.substituteExperience-th').contains('Substitute Experience')
      .and('be.visible');
    cy.get('.institutions-th').contains('School')
      .and('be.visible');
})

it('Verify the report data', function(){
    cy.get('.count').contains('3')
      .and('be.visible');
    cy.get('.row-0 > .-g > .dateRange-cell').contains('3/6/2018')
      .and('be.visible');
    cy.get('.row-0 > .-g > .-u-2-24').contains('224981295')
      .and('be.visible');
    cy.get('.row-0 > .-g > .substitute-cell').contains('Russ Abernathy588')
      .and('be.visible');
    cy.get('.row-0 > .-g > .substitutePerformacne-cell').contains('Details')
      .and('be.visible');
    cy.get('.row-0 > .-g > .name-cell').contains('Gibson710, Rick')
      .and('be.visible');
    cy.get('.row-0 > .-g > .substituteExperience-cell').contains('Details')
      .and('be.visible');
    cy.get('.row-0 > .-g > .institutions-cell').contains('Atlantic City HS')
      .and('be.visible');
    cy.get('.row-0 > .-g > .-u-2-24 > .cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224981295/view');
    cy.get('.row-0 > .-g > .substitutePerformacne-cell > [ng-if="row.haveAbsenceFeedbackRatingOfSub"] > a').should('have.attr','ng-click','actions.feedbackAboutSubstitute(row.id)');
    cy.get('.row-0 > .-g > .substituteExperience-cell > [ng-if="row.haveAbsenceFeedbackRatingOfSubExperiecne"] > a').should('have.attr','ng-click','actions.feedbackFromSubstitute(row.id)');
    cy.get('.row-2 > .-g > .name-cell').contains('Test itinerant').and('be.visible');
});

});