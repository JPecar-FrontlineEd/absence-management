  const fixtureFactory = require('../../helpers/fixtureHelper');
  const fixtureFactoryForAbsence = require('../../helpers/fixtureHelperForAbsence');
  const WorkerList = require('../../fixtures/AbsCreateEmpSelect/WorkerList');
  const WorkerListSearch = require('../../fixtures/AbsCreateEmpSelect/WorkerListSearch');
  const AccountingCodes = require('../../fixtures/AbsCreateDetails/AccountingCodes');
  const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
  const PayCodes = require('../../fixtures/RptFilterData/PayCodes');
  const AltAccountingCodeList = require('../../fixtures/AbsCreateDetails/AccountingCodes');
  const RelatedFiles = require('../../fixtures/AbsView/RelatedFiles');
  const AbsenceReasonsList = require('../../fixtures/AbsCreateDetails/AbsenceReasonsList');
  const AbsenceRequestWorkerData = require('../../fixtures/AbsCreateDetails/AbsenceRequestWorkerData');

  
  let fixtures;
  let absCreateDetailsFixtures
  describe('CU-Absence Create Details UI tests', function (){
    const mockWorkerRequest = (query = '', response) => cy.route({
      method: 'GET',
      url: `/api/v1.0/workers?fields=(id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)&includeVacancies=false&includeWorkers=true&lastName=${query}&maxRecords=100&offSet=0`,
      response
    });
  
    before(() => {
      cy.server()
      fixtures = fixtureFactory(cy);
      fixtures.passthroughOrganization();
      fixtures.institutions();
      fixtures.campusUser();
      fixtures.products();
      fixtures.workerTypes();
      fixtures.notifications();
  
      // mock the initial request with the full result list
      mockWorkerRequest('', WorkerList());
  
      absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
      absCreateDetailsFixtures.mockAccountingCodeCall();

      cy.visit('absences/create-absence');

    });
    beforeEach(() => cy.server());

    it('Validate Correct Columns are Visible', function() {
      cy.get('.top > .left-section').contains('Step 1: Select Employee')
      cy.get('[ng-show="isLoaded && showHeader"] > .name-th').contains('Name')
      cy.get('[ng-show="isLoaded && showHeader"] > .identifier-th') .should('be.visible')
      cy.get('[ng-show="isLoaded && showHeader"] > .phone-th').should('be.visible')
      cy.get('[ng-show="isLoaded && showHeader"] > .school-th').contains('School');
    });
  
    it('Selecting an employee', function() {
      const searchTerm = 'Alexa';
      // mock the filtered request with the subset result list
      mockWorkerRequest(searchTerm, WorkerListSearch());
      cy.get('.fl-input').focus();
      cy.get('.fl-input').type(searchTerm);
      cy.get('input[value=4628277]').click();
      cy.get('.group-row').contains('A');
    });
       
it('Proceeding to select absence details', function () {
  cy.server()

  cy.route({
  method: 'GET',
  url: '/api/v1.0/budgetcodes',
  response: BudgetCodes()
}).as('getBudgetCodes');

cy.route({
  method: 'GET',
  url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=147026&isVacancyType=false&workId=4628277',
  response: AbsenceReasonsList()
}).as('getAbsenceReasonsList');

cy.route({
  method: 'GET',
  url: '/api/v1.0/paycodes',
  response: PayCodes()
}).as('getPayCodes');

cy.route({
  method: 'GET',
  url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
  response: AltAccountingCodeList()
}).as('getAltAccountingCodeList');

cy.route({
  method: 'GET',
  url: '/api/v1.0/AbsenceRequests/Context?workerid=4628277',
  response: AbsenceRequestWorkerData()
}).as('getAbsenceRequestWorkerData');

cy.route({
  method: 'GET',
  url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
  response: RelatedFiles()
}).as('getRelatedFiles');

    // absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
    // absCreateDetailsFixtures.mockAbsCreateDetails();
    cy.get('.top > .right-section > .button-section > .fl-button').as('topReviewAndConfirmButton');
    cy.get('.bottom > .right-section > .button-section > .fl-button').as('bottomReviewAndConfirmButton');
    cy.get('@bottomReviewAndConfirmButton').should('be.visible');
    cy.get('@topReviewAndConfirmButton').should('be.visible');
    cy.get('@topReviewAndConfirmButton').click();
    cy.wait(['@getBudgetCodes','@getAbsenceReasonsList','@getPayCodes','@getAltAccountingCodeList','@getAbsenceRequestWorkerData','@getRelatedFiles']);  
  });

it('Verifying page labels and data', function () {
  cy.get('[ng-class="{\'one-option\': absrState.context.absenceShiftTypes[0].id === 4}"] > .field > ng-transclude > label.ng-scope').as('absenceTimeLabel');
  cy.get('[ng-class="{\'one-option\': absrState.context.vacancyShiftTypes.length === 1}"] > .field > ng-transclude > label.ng-scope').as('altSubTimeLabel');
  cy.get('.top > .left-section > :nth-child(1)').as('empNameLabel');
  cy.get('.-u-1 > .section-header').as('schoolNameHeader');
  cy.get('@empNameLabel').contains('Step 2: Fill out Absence Details for')
  .and('be.visible');
  cy.get('.cmpt-template-worker-link > div.ng-scope > .ng-binding').should('have.text','Alexander, Joshua');
  cy.get('@empNameLabel').should('have.text','Step 2: Fill out Absence Details for Alexander, Joshua')
  .and('be.visible');
  cy.get('.active > .ng-binding').contains('Fill out Details');
  expect(Cypress.$('.cmpt-step-progress')).to.have.css('background-color','rgba(0, 0, 0, 0)');
  cy.get('@absenceTimeLabel').contains('Time');
  cy.get('@absenceTimeLabel').contains('Please enter a valid time range using the HH:MM AM format.');
  cy.get('@altSubTimeLabel').contains('Substitute Report Time');
  cy.get('@altSubTimeLabel').contains('Please enter a valid time range using the HH:MM AM format.');
  cy.get('.non-pay > label').contains('Non-Pay Time')
  .and('be.visible');
  cy.get('.non-pay > label').contains('Please enter a valid duration using the HH:MM format in 15 minute increments.');
  cy.get('.time-absent > label').contains('Time Absent')
  .and('be.visible');
  cy.get('.time-absent > label').contains('Please enter a valid duration using the HH:MM format.');
  cy.get('.budget-codes > label').contains('Budget Code')
  .and('be.visible');
  cy.get('.accounting-codes > label').contains('Accounting Code')
  .and('be.visible');
}); 

it('Validation test',function (){
  cy.server()
  absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
  absCreateDetailsFixtures.mockAbsCreateDetails();
  cy.get('.top > .right-section > .button-section > .fl-button').click();
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.reasons.ng-scope > div > div > select').should('have.attr','class','ng-empty ng-valid error ng-valid-required');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time-absent.ng-scope > div > div > input').should('have.attr','class','fl-input ng-pristine ng-untouched ng-valid error ng-empty ng-valid-maxlength');
  cy.get('#variation-0 > div.-g.variation > div.-u-8-24.cmpt-absr-date-picker.ng-isolate-scope > div:nth-child(2) > div > div.error-message.ng-binding.ng-scope').should('be.visible');
});

it('Initial absence type data state check', function () {
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div > div > div.time-container > div:nth-child(1) > div > input').as('subStartTime');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div > div > div.time-container > div:nth-child(3) > div > input').as('subEndTime');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(1) > div > div > div.time-container > div:nth-child(1) > div').as('employeeStartTime');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(1) > div > div > div.time-container > div:nth-child(3) > div').as('employeeEndTime');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(1) > div > div > div.cmpt-ui-dropdown.ng-isolate-scope > select').as('shiftSelector');
  cy.get('.cmpt-template-institution-link > .ng-binding').contains('MillVill Valley HS');
  cy.get('@employeeEndTime').contains('04:00 PM');
  cy.get('@employeeStartTime').contains('08:00 AM');
  cy.get('[ng-class="{\'one-option\': absrState.context.absenceShiftTypes[0].id === 4}"] > .field > .element > .cmpt-ui-dropdown > .ng-not-empty').select('Half Day AM')
  cy.get('@employeeStartTime').contains('08:00 AM');
  cy.get('@employeeEndTime').contains('11:30 AM');
  cy.get('@shiftSelector').contains('Half Day AM');
  cy.get('@shiftSelector').select('Half Day PM');
  cy.get('@employeeStartTime').contains('12:30 PM'); 
  cy.get('@employeeEndTime').contains('04:00 PM'); 
  cy.get('@shiftSelector').contains('Half Day PM');
  cy.get('@shiftSelector').select('Custom');
  cy.get('@employeeStartTime').contains('12:30 PM');
  cy.get('@employeeEndTime').contains('04:00 PM') ;
  cy.get('@shiftSelector').contains('Custom');
  cy.get('@shiftSelector').select('Full Day');
});

it('Initial alternate sub time data check', function (){
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(1) > div > div > div.cmpt-ui-dropdown.ng-isolate-scope > select').as('employeeShiftSelector');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div .time-container').as('subStartTime');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div .time-container').as('subEndTime');
  cy.get('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div > div > div.cmpt-ui-dropdown.ng-isolate-scope > select').as('subShiftSelector')

  expect(Cypress.$('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div > div > div.time-container > div:nth-child(1) > div > input')).to.be.disabled;
  expect(Cypress.$('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div > div > div.time-container > div:nth-child(3) > div > input')).to.be.disabled;
  expect(Cypress.$('#variation-0 > div.-g.variation > div.-u-16-24.column-details > div > div.row.time.both > span:nth-child(2) > span:nth-child(2) > div > div > div.cmpt-ui-dropdown.ng-isolate-scope > select')).to.be.disabled;

  cy.get('.cmpt-ui-linking > div').click();
  cy.get('@subShiftSelector').contains('Full Day');
  cy.get('@subStartTime').contains('08:00 AM');
  cy.get('@subEndTime').contains('04:00 PM');

  cy.get('@subShiftSelector').select('Half Day AM');
  cy.get('@subShiftSelector').contains('Half Day AM');
  cy.get('@subStartTime').contains('08:00 AM');
  cy.get('@subEndTime').contains('11:30 AM');

  cy.get('@subShiftSelector').select('Half Day PM');
  cy.get('@subShiftSelector').contains('Half Day AM');
  cy.get('@subStartTime').contains('12:30 PM');
  cy.get('@subEndTime').contains('04:00 PM');
  cy.get('@employeeShiftSelector').contains('Full Day');//Verify the employee shift type hasn't changed
  
  cy.get('@subShiftSelector').select('Custom');
  cy.get('@subShiftSelector').contains('Custom');
  cy.get('@subStartTime').contains('12:30 PM');
  cy.get('@subEndTime').contains('04:00 PM');
});

it('Checking absence reason data', function(){
  cy.get('.reasons > .element > .cmpt-ui-dropdown > .ng-empty').as('absenceReasonSelector');
  cy.get('.reasons > label').contains('Absence Reason')
  .and('be.visible');
  cy.get('@absenceReasonSelector').select('BucketsOFun');
  cy.get('@absenceReasonSelector').select('EnforceNote2Admin');
  cy.get('@absenceReasonSelector').select('Extremely long and !');
  cy.get('@absenceReasonSelector').select('Field Trip');
  cy.get('@absenceReasonSelector').select('HoldTillApprove');
  cy.get('@absenceReasonSelector').select('HoldTillNoAppr');
  cy.get('@absenceReasonSelector').select('Illness');
  cy.get('@absenceReasonSelector').select('Jury Duty');
  cy.get('@absenceReasonSelector').select('Jury Duty MV');
  cy.get('@absenceReasonSelector').select('Nurse');
  cy.get('@absenceReasonSelector').select('Nurses');
  cy.get('@absenceReasonSelector').select('Personal Day');
  cy.get('@absenceReasonSelector').select('Staff Eval');
  cy.get('@absenceReasonSelector').select('Training');
  cy.get('@absenceReasonSelector').select('Transportation');
  cy.get('@absenceReasonSelector').select('Vacation');
});

it('Populating the date selector', function (){
  cy.server()
  absCreateDetailsFixtures = fixtureFactoryForAbsence(cy);
  absCreateDetailsFixtures.mockAbsRelatedFiles();
  cy.get(':nth-child(1) > .cmpt-ui-date-selector-v2 > .input > .ui-datepicker-trigger').click();
  cy.get('#ui-datepicker-div .ui-datepicker-calendar tbody .ui-datepicker-days-cell-over .ui-state-default').click();
  cy.get('#dp1517942897121').should('not.be.empty');
});
 
it('Filling in Time Absent', function(){
  cy.get('.time-absent > .element > .cmpt-ui-textbox > .fl-input').as('timeAbsentInput');
  cy.get('@timeAbsentInput').focus();
  cy.get('@timeAbsentInput').type('00:30{enter}');
});

it('Filling in Non-Pay Data', function(){
  cy.get('.non-pay > .element > .cmpt-ui-textbox > .fl-input').as('nonPayTime');
  cy.get('@nonPayTime').focus();
  cy.get('@nonPayTime').type('{selectall}{backspace}00:30{enter}');
});

it('Checking Budget Code information', function(){
  cy.get('.budget-codes > .element > .cmpt-ui-dropdown > .ng-empty').as('budgetCodeSelector');
  cy.get('@budgetCodeSelector').contains('Select One');
  cy.get('@budgetCodeSelector').select('!@#$%^&*()~`\';,.<>?/=');
  cy.get('@budgetCodeSelector').select('1110E510007530391010300000000000');
  cy.get('@budgetCodeSelector').select('4K Program - General Sub Salary');
  cy.get('@budgetCodeSelector').select('Certified Teacher');
  cy.get('@budgetCodeSelector').select('District-Food Svc-Sub Salary');
  cy.get('@budgetCodeSelector').select('Fine Arts-Sub Salary-Art');
  cy.get('@budgetCodeSelector').select('http://www.amazon.com/s/ref=sr_nr_p_n_condition-ty');
  cy.get('@budgetCodeSelector').select('Nursing Staff');
  cy.get('@budgetCodeSelector').select('Teacher\'s Aide');
  cy.get('@budgetCodeSelector').select('Nursing Staff');
  cy.get('@budgetCodeSelector').select('This is to establish that the max characters can b');
  cy.get('@budgetCodeSelector').select('This really long line needs to fit on the main pag');
  cy.get('@budgetCodeSelector').select('Tranportation');
});

it('Checking Account Code information', function(){
  cy.get('.accounting-codes > .element > .cmpt-ui-dropdown > .ng-empty').as('accountCodeSelector');
  cy.get('@accountCodeSelector').contains('Select One');
  cy.get('@accountCodeSelector').select('This really long line needs to fit on the main pag');
  cy.get('@accountCodeSelector').select('Study Week Tutor');
  cy.get('@accountCodeSelector').select('Private Middle School');
  cy.get('@accountCodeSelector').select('Private Accounting');
  cy.get('@accountCodeSelector').select('Janitorial Services');
  cy.get('@accountCodeSelector').select('http://www.amazon.com/s/ref=sr_nr_p_n_condition-ty');
  cy.get('@accountCodeSelector').select('1110E510007530391010300000000000456784567356834658');
  cy.get('@accountCodeSelector').select('1110E510007530391010300000000000');
  cy.get('@accountCodeSelector').select('!@#$%^&*()~`\';,.<>?/=');
  cy.get('@accountCodeSelector').select('Allocation Test');
  cy.get('@accountCodeSelector').select('Custom');
  cy.get('.element > .ng-pristine').type('12345');//entering in a custom accounting code
});

it('Adding a Variation', function(){
  cy.get('.add-variation').contains('Add New Variation')
  .and('be.visible');
  cy.get('.add-variation > .fl-label').click();
  //Testing the new variation
  cy.get('#variation-1 > .variation > .variation-footer > ng-transclude > .delete-variation').as('deleteVariationButton')
  cy.get('#variation-1 > :nth-child(1) > .-u-1 > .section-header').contains('Variation # 2')
  .and('be.visible');
  cy.get('#variation-1 > .variation > .-u-16-24 > .form > .reasons > .element > .cmpt-ui-dropdown > .ng-valid').select('BucketsOFun')
  cy.get('@deleteVariationButton').contains('Delete This Variation');
  cy.get('@deleteVariationButton').click();
});

it('Absence summary Sub Required State and Data tests', function (){
  cy.get('[ng-class="{\'one-option\': absrState.context.vacancyShiftTypes.length === 1}"] > .field > ng-transclude > label.ng-scope').as('subReportTimeSection');
  cy.get('.date-select').as('subRequiredSelector');
  cy.get('.need-sub').contains('Substitute Required')
  .and('be.visible');
  cy.get('@subRequiredSelector').select('No');
  cy.get('@subReportTimeSection').should('not.be.visible');
  cy.get('@subRequiredSelector').select('Yes');
  cy.get('@subReportTimeSection').should('be.visible');
});

it('Absence summary Hold until state and data tests', function(){
  cy.get('.hold-until > .cmpt-ui-dropdown > .ng-not-empty').as('holdUntilSelector');
  cy.get('.hold-until').contains('Hold Until')
  .and('be.visible');
  cy.get('@holdUntilSelector').contains('Hold For 10 Minute(s)');
  cy.get('@holdUntilSelector').select('No Hold');
  cy.get('@holdUntilSelector').contains('No Hold');
});

it('Validating Absence summary Absence details data', function(){
  cy.get('.item').as('summaryAbsDetails');
  cy.get('@summaryAbsDetails').contains('MillVill Valley HS')
  .and('be.visible');
  cy.get('@summaryAbsDetails').contains('8:00 AM - 4:00 PM')
  .and('be.visible');
  cy.get('@summaryAbsDetails').contains('Vacation')
  .and('be.visible');
});

it('Testing Notes to Admin field', function(){
  cy.get('#admin-notes > .notes-characters-left').contains('250 character(s) left');
  cy.get('#admin-notes').contains('Notes to Administrator')
  .and('be.visible');
  cy.get('#admin-notes').contains('(Viewable only by Administrator and Employee)')
  .and('be.visible');
  cy.get('#admin-notes > :nth-child(2) > .ng-pristine').type('These are notes to the admin.');
  cy.get('#admin-notes > .notes-characters-left').contains('221 character(s) left');
});

it('Testing Notes to Substitute field', function (){
  cy.get('.substitute-notes > .notes-characters-left').contains('250 character(s) left');
  cy.get('.substitute-notes > ng-transclude > .ng-scope').contains('Notes to Substitute')
  .and('be.visible');
  cy.get('.substitute-notes > ng-transclude > .ng-scope').contains('(Viewable by Administrator, Employee, and Substitute)')
  .and('be.visible');
  cy.get('.substitute-notes > :nth-child(2) > .ng-pristine').type('These are notes to the substitute');
  cy.get('.substitute-notes > .notes-characters-left').contains('217 character(s) left');
});

it('Testing the Admin Only Notes field', function (){
  cy.get('.admin-only-notes > .notes-characters-left').contains('250 character(s) left');
  cy.get('.admin-only-notes > ng-transclude > .ng-scope').contains('Admin-Only Notes');
  cy.get('.admin-only-notes > ng-transclude > .ng-scope').contains('(Viewable only by Administrator)');
  cy.get('.admin-only-notes > :nth-child(2) > .ng-pristine').type('These are notes that only the admin can see.');
  cy.get('.admin-only-notes > .notes-characters-left').contains('206 character(s) left');
});

it('Validating user can access the related files information', function(){
  cy.get('.related-files').contains('Related Files')
  .and('be.visible');
  cy.get('.related-files').contains('upload_to_aesop.rtf')
  .and('be.visible');
});

it('Validating user can access the uploaded files information', function(){
  cy.get('.uploaded-files').contains('Uploaded Files')
  .and('be.visible');
  cy.get('.uploaded-files').contains('No Uploaded Files')
  .and('be.visible');
});

it('Validating the user can upload files', function(){
  cy.get('.cmpt-ui-file-upload').contains('DRAG AND DROP')
  .and('be.visible');
  cy.get('.cmpt-ui-file-upload > .fl-button').contains('Choose a file')
  .and('be.visible');
});

it('Checking for next step and previous step options', function(){
  cy.get('.bottom > .left-section > .button-section > .fl-button').as('selectEmployeeButton');
  cy.get('.bottom > .right-section > .button-section > .fl-button').as('reviewAndConfirmButton');
  cy.get('.bottom').contains('Previous Step:');
  cy.get('.bottom').contains('Next Step:');
  cy.get('@selectEmployeeButton').contains('Select Employee')
  .and('be.visible');
  cy.get('@reviewAndConfirmButton').contains('Review & Confirm')
  .and('be.visible');
});

}); 


