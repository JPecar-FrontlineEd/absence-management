const fixtureFactory = require('../../helpers/fixtureHelper');
const AbsenceList = require('../../fixtures/AbsApprove/AbsApproveAbsr');
const AccountCodeList = require('../../fixtures/RptFilterData/AccountingCodes');
const BudgetCodes = require('../../fixtures/RptFilterData/BudgetCodes');
const deniedAbs = require('../../fixtures/AbsApprove/DeniedAbsResponse');
const approveAbsRequest = require('../../fixtures/AbsApprove/ApproveAbsRequest');
const approverList = require('../../fixtures/AbsApprove/ApproverListResponse');
const denyAbsResponse = require('../../fixtures/AbsApprove/DeniedAbsResponse');

let fixtures;
describe('CU- Approve Absence page', function (){
  
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
        url: /\/api\/v1.0\/absencerequests\/approval\?endDate=.*&fields=\(id,startDate,endDate,requiresApproval,isApproved,\+isPartiallyApproved,isDenied,needSub,notes,notesToAdmin,notesToAdminOnly,balanceTrackingType,numApproved,lastApprovedAction,approverKey,canApprove,canDeny,canDenyPart,approverComments,substitute\(id,firstName,lastName\),worker\(id,isVacancy,firstName,middleName,lastName,title\),absences\(id,date,adjustedDurationAmount,absenceDuration,absenceBreakDuration,DeductBreakFromAbsenceDuration,shiftType,institution\(id,name\),entitlement\(name,needsApproval\),budgetCode\(id\),accountingCode\(id,\+isFreeForm\)\)\)&includeApproved=true&includePartialApproved=true&includeUnapproved=true&includedenied=true&startDate=.*/,
        response: AbsenceList()
    });

    cy.route({
        method: 'GET',
        url: '/api/v1.0/budgetcodes',
        response: BudgetCodes()
    });

    cy.route({
        method: 'GET',
        url: '/api/v1.0/accountingcodes?fields=(id,name)',
        response: AccountCodeList()
    });

  cy.visit('/absences/approve');

});

it('Validating the correct page has loaded', function(){
    cy.url().should('contain','/absences/approve');
    cy.get('body > div.main-content > div > ui-view > ui-view > div > h3').contains('Absence: Approvals');
});

it('Checking for the start and end date boxes ', function(){
    cy.get('[date-model="vm.startDate"]').contains('Start Date:');
    cy.get('[date-model="vm.startDate"] > .ui-datepicker-trigger').should('be.visible');
    cy.get('[date-model="vm.endDate"]').contains('End Date:');
    cy.get('[date-model="vm.endDate"] > .ui-datepicker-trigger').should('be.visible');
});

it('Absence Status filter initial state check', function(){
    cy.get('.action-panel > :nth-child(3)').as('filterPanel');
    cy.get('@filterPanel').contains('Status:')
    .and('be.visible');
    cy.get('@filterPanel').contains('Approved')
    .and('be.visible');
    cy.get('@filterPanel').contains('Denied')
    .and('be.visible');
    cy.get('@filterPanel').contains('Partially Approved')
    .and('be.visible');
    cy.get('@filterPanel').contains('Unapproved')
    .and('be.visible');
    cy.get(':nth-child(2) > .ng-pristine').should('be.checked')
    .and('be.visible');
    cy.get(':nth-child(3) > .ng-pristine').should('be.checked')
    .and('be.visible')
    cy.get(':nth-child(3) > :nth-child(4) > .ng-pristine').should('not.be.checked')
    .and('be.visible');
    cy.get(':nth-child(3) > :nth-child(5) > .ng-pristine').should('not.be.checked')
    .and('be.visible');
});

it('Initial state check for approve and deny options', function(){
    cy.get('.header-buttons > .fl-positive').contains('Approve Selected')
    .should('have.attr','ng-class','{\'fl-disabled\':!vm.approveAllCount>0}');
    cy.get('.header-buttons > .fl-negative').contains('Deny Selected')
    .should('have.attr','ng-class','{\'fl-disabled\':!vm.denyAllCount>0}');
});

it('Checking Accounting code selector options', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(4) > select').as('accountCodeSelector');
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(4) > label').contains('Accounting Code:')
    .and('be.visible');
    cy.get('@accountCodeSelector').select('This really long line needs to fit on the main pag');
    cy.get('@accountCodeSelector').contains('This really long line needs to fit on the main pag');
    cy.get('@accountCodeSelector').select('Study Week Tutor');
    cy.get('@accountCodeSelector').contains('Study Week Tutor');
    cy.get('@accountCodeSelector').select('Private Accounting');
    cy.get('@accountCodeSelector').contains('Private Accounting');
    cy.get('@accountCodeSelector').select('http://www.amazon.com/s/ref=sr_nr_p_n_condition-ty');
    cy.get('@accountCodeSelector').contains('http://www.amazon.com/s/ref=sr_nr_p_n_condition-ty');
    cy.get('@accountCodeSelector').select('1110E510007530391010300000000000456784567356834658');
    cy.get('@accountCodeSelector').contains('1110E510007530391010300000000000456784567356834658');
    cy.get('@accountCodeSelector').select('1110E510007530391010300000000000');
    cy.get('@accountCodeSelector').contains('1110E510007530391010300000000000');
    cy.get('@accountCodeSelector').select('!@#$%^&*()~`\';,.<>?/=');
    cy.get('@accountCodeSelector').contains('!@#$%^&*()~`\';,.<>?/=');
    cy.get('@accountCodeSelector').select('Allocation Test');
    cy.get('@accountCodeSelector').contains('Allocation Test');
    cy.get('@accountCodeSelector').select('Custom');
    cy.get('@accountCodeSelector').contains('Custom');

});

it('Filtered data set assertions', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(4) > select').as('accountCodeSelector');
    cy.get('@accountCodeSelector').select('Janitorial Services');
    cy.get('@accountCodeSelector').contains('Janitorial Services');
    cy.get('.count').contains('10')
    .and('be.visible');
    cy.get('.row-0 > .-g > .id-cell').contains('224981894')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-5-24').contains('Kuhic142, Andy')
    .and('be.visible');
    cy.get('.row-0 > .-g > .startDate-cell').contains('3/13/2018')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-1-24 > .fa').should('be.visible');
    cy.get('.row-0 > .-g > .-u-4-24').contains('Personal Day')
    .and('be.visible');
    cy.get('.row-0 > .-g > .duration-cell').contains('8 Hours')
    cy.get('.row-0 > .-g > .-u-6-24 > .fl-negative').contains('Deny')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-6-24 > .fl-positive').contains('Approve')
    .and('be.visible');
    cy.get('.row-0 > .-g > .undefined > .ng-pristine').should('not.be.checked')
    .and('be.visible');
});

it('Grid header check', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(4) > select').as('accountCodeSelector');
    cy.get('.header-buttons > .fl-positive').as('approveSelectedBtn');
    cy.get('.header-buttons > .fl-negative').as('denySelectedBtn');
    cy.get('@accountCodeSelector').select('All Accounting Codes');
    cy.get('.count').contains('33')
    .and('be.visible');
    cy.get('.header-content').contains('Absence Approvals');
    cy.get('@approveSelectedBtn').should('have.attr','class','fl-button fl-positive ng-binding fl-disabled')
    .contains('Approve Selected');
    cy.get('@denySelectedBtn').should('have.attr','class','fl-button fl-negative ng-binding fl-disabled')
    .contains('Deny Selected');
});

it('Budget Code selector check', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(5) > select').as('budgetCodeSelector');
    cy.get('@budgetCodeSelector').select('!@#$%^&*()~`\';,.<>?/=');
    cy.get('@budgetCodeSelector').contains('!@#$%^&*()~`\';,.<>?/=');
    cy.get('@budgetCodeSelector').select('1110E510007530391010300000000000');
    cy.get('@budgetCodeSelector').contains('1110E510007530391010300000000000');
    cy.get('@budgetCodeSelector').select('4K Program - General Sub Salary');
    cy.get('@budgetCodeSelector').contains('4K Program - General Sub Salary')
    cy.get('@budgetCodeSelector').select('District-Food Svc-Sub Salary');
    cy.get('@budgetCodeSelector').contains('District-Food Svc-Sub Salary');
    cy.get('@budgetCodeSelector').select('Fine Arts-Sub Salary-Art');
    cy.get('@budgetCodeSelector').contains('Fine Arts-Sub Salary-Art');
    cy.get('@budgetCodeSelector').select('http://www.amazon.com/s/ref=sr_nr_p_n_condition-ty');
    cy.get('@budgetCodeSelector').contains('http://www.amazon.com/s/ref=sr_nr_p_n_condition-ty');
    cy.get('@budgetCodeSelector').select('Nursing Staff');
    cy.get('@budgetCodeSelector').contains('Nursing Staff');
    cy.get('@budgetCodeSelector').select('Teacher\'s Aide');
    cy.get('@budgetCodeSelector').contains('Teacher\'s Aide');
    cy.get('@budgetCodeSelector').select('This is to establish that the max characters can b');
    cy.get('@budgetCodeSelector').contains('This is to establish that the max characters can b');
    cy.get('@budgetCodeSelector').select('This really long line needs to fit on the main pag');
    cy.get('@budgetCodeSelector').contains('This really long line needs to fit on the main pag');
    cy.get('@budgetCodeSelector').select('Tranportation');
    cy.get('@budgetCodeSelector').contains('Tranportation');
});

it('Filtered Budget Code data assertions', function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(5) > select').as('budgetCodeSelector');
    cy.get('@budgetCodeSelector').select('Certified Teacher');
    cy.get('@budgetCodeSelector').contains('Certified Teacher');
    cy.get('.id-cell').contains('224982153')
    .and('be.visible');
    cy.get('.cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224982153/view')
    .and('be.visible');
    cy.get('.cmpt-template-worker-link > div.ng-scope > .ng-binding').contains('Ullrich214, Camden')
    .and('be.visible');
    cy.get('.startDate-cell').contains('3/9/2018 - 3/15/2018')
    .and('be.visible');
    cy.get('.row-container > .-g > .-u-1-24 > .fa').should('be.visible');
    cy.get('.row-container > .-g > .-u-4-24').contains('Personal Day');
    cy.get('.multi-value').should('be.visible');
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.report-standards.cmpt-approve-bottom-result > div.content-panel.loaded > div > div > ul > li.row-container.row-0 > div > div.-u-2-24.duration-cell.grid-cell > span').as('duration')
    cy.get('@duration').contains('16 Hours')
    .and('be.visible');
    cy.get('.text > .ng-binding').contains('Unapproved');
    cy.get('.-u-6-24 > .fl-positive').contains('Approve')
    .and('be.visible');
    cy.get('.-u-6-24 > .fl-negative').contains('Deny')
    .and('be.visible');
    cy.get('.deny-part').contains('Deny Part')
    .and('be.visible');

});

it('Checking for Approve/Deny options', function(){
    cy.get('.undefined > .ng-valid').first().as('rowApprovalCheckBox')
    cy.get('@rowApprovalCheckBox').check();
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.report-standards.cmpt-approve-bottom-result.ng-isolate-scope > div.content-panel.loaded > div > div > ul > li > div').as('visibleRow');
    cy.get('span > .ng-pristine').should('be.checked');
    cy.get('@visibleRow').should('have.attr','class','-g grid-row  selected');
    cy.get('.header-buttons > .fl-positive').should('have.attr','class','fl-button fl-positive ng-binding')
    .and('be.visible');
    cy.get('.header-buttons > .fl-negative').should('have.attr','class','fl-button fl-negative ng-binding')
    .and('be.visible');
    cy.get('@rowApprovalCheckBox').uncheck();

});

it('Deny part modal check', function (){
    cy.get('.deny-part').click();
    cy.get('.ngdialog-message > .header').contains('DENY PART: Absence Request #224982153')
    .and('be.visible');
    cy.get('.approval-status').contains('Approval Status')
    .and('be.visible');
    cy.get('.approval-status > .cmpt-template-approval > .ng-scope > .text > .ng-binding').contains('Unapproved')
    .and('be.visible');
    cy.get('.grid-header > .-u-3-24').contains('Duration')
    .and('be.visible');
    cy.get('.grid-header > .-u-17-24').contains('Location')
    .and('be.visible');
    cy.get('.absence-list > .cmpt-ui-multiselect-sortable-grid > .cmpt-ui-sortable-grid > .grid-rows > .row-0 > .-g > .-u-4-24 > .ng-binding').contains('3/9/2018')
    .and('be.visible');
    //cy.get('.row-0 > .-g > .-u-3-24 > .cmpt-template-shift-types > .icon-container > .duration-Icon').should('be.visible');
    cy.get('.row-0 > .-g > .-u-17-24').contains('Hamilton Elementary')
    .and('be.visible');
    cy.get('.row-1 > .-g > .-u-4-24 > .ng-binding').contains('3/15/2018')
    .and('be.visible');
    //cy.get('.row-1 > .-g > .-u-3-24 > .cmpt-template-shift-types > .icon-container > .duration-Icon').should('be.visible');
    cy.get('.row-1 > .-g > .-u-17-24 > .ng-binding').contains('Hamilton Elementary')
    .and('be.visible');
    cy.get('.comment-box > span').contains('Comments')
    .and('be.visible');
    cy.get('.notes-characters-left').contains('255 character(s) left')
    .and('be.visible');
    cy.get('.cmpt-ui-textarea > :nth-child(2) > .ng-pristine').type('This is the approval comments text box');
    cy.get('.notes-characters-left').contains('217 character(s) left')
    .and('be.visible');

});

it('Approve Deny part test', function(){
    cy.get('.row-0 > .-g > .undefined > .ng-pristine').as('rowOneCheckBox');
    cy.get('.ngdialog-buttons > .fl-negative').as('denyButton');
    cy.get('@denyButton').should('have.attr','class','fl-button fl-negative fl-disabled');
    cy.get('.absence-list > .cmpt-ui-multiselect-sortable-grid > .cmpt-ui-sortable-grid > .grid-header > .uicheckcol-th > span > .ng-pristine').as('mainApprovalCheckbox');
    cy.get('@mainApprovalCheckbox').check();
    cy.get('.row-0 > .-g > .undefined > .ng-pristine').should('be.checked');
    cy.get('.row-1 > .-g > .undefined > .ng-pristine').should('be.checked');
    cy.get('#ngdialog1 > div.ngdialog-content > div > div.ngdialog-message > div.content > div.absence-list > div > div > ul > li.row-container.row-0 > div').as('gridFirstRow');
    cy.get('@gridFirstRow').should('have.attr','class','-g grid-row  selected');
    cy.get('@denyButton').should('have.attr','class','fl-button fl-negative');
    cy.get('@mainApprovalCheckbox').uncheck();
    cy.get('@rowOneCheckBox').check();
    cy.get('@gridFirstRow').should('have.attr','class','-g grid-row selected');
    cy.get('[ng-click="!button.enabled || button.action()"]').click();
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(5) > select').as('budgetCodeSelector');
    cy.get('@budgetCodeSelector').select('All Budget Codes');
});

it('Deny Part of abs', function(){
    cy.server()
    cy.route({
        method: 'PUT',
        url: /\/api\/v1.0\/absencerequests\/.*\/DenyPart\?comment=&fields=&splitAbs=.*/,
        response: deniedAbs()
    });

    cy.get('.row-1 > .-g > .-u-6-24 > .deny-part').click();
    cy.get('.row-1 > .-g > :nth-child(5) > .ng-pristine').check();
    cy.get('.ngdialog-buttons > .fl-negative').click();
    cy.get('.toast').should('be.visible');
    cy.get('.toast-title').contains('Deny Absence Successful')
    .and('be.visible');
    cy.get('.toast-message').contains('The part(s) of the absence selected was successfully denied. The confirmation number of the denied absence is #')
    .and('be.visible');
    cy.get('.toast-message > a').contains('224983276');
    cy.get('.toast-message > a').should('have.attr','href','/absences/detail/224983276/view');
    cy.get('.toast > .fa').click();
});

it('Abs Approval- Notes to Admin icon data',function(){
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.cmpt-approve-filter-panel > div.action-panel.panel > div:nth-child(5) > select').as('budgetCodeSelector');
    cy.get('@budgetCodeSelector').select('All Budget Codes');
    cy.get('.row-7 > .-g > .id-cell').scrollIntoView();
    cy.get('.row-7 > .-g > .id-cell > .notes > .fa').as('notesIcon');
    cy.get('@notesIcon').should('be.visible');
    cy.get('@notesIcon').trigger('mouseover');
    cy.get('.notes-content > div > label').contains('Notes to Administrator')
    .should('be.visible');
    cy.get('.notes-content > div > span').contains('Asperiores sapiente facilis magni dignissimos suscipit dolorem fuga rerum.')
    .should('be.visible');
    cy.get('@notesIcon').trigger('mouseout');
});

it('Fill status check', () => {
    cy.get('.row-7 > .-g > .-u-1-24 > .fa').as('fillStatusCheckMark');
    cy.get('@fillStatusCheckMark').should('be.visible');
    cy.get('@fillStatusCheckMark').should('have.attr','title','Filled by Margarita Luettgen561');
    
});

it('Checking grid column headers', function(){
    cy.get('.action-section > .item').scrollIntoView();
    cy.get('.grid-header > .-u-1-24').as('fillStatusColumn');
    cy.get('.grid-header > .-u-4-24').as('reasonHeader');
    cy.get('span > .ng-pristine').should('not.be.checked');
    cy.get('.id-th').contains('Conf. #')
    .and('be.visible');
    cy.get('.grid-header > .-u-5-24').contains('Name')
    .and('be.visible');
    cy.get('.startDate-th').contains('Date')
    .and('be.visible')
    cy.get('@fillStatusColumn').should('be.visible');
    cy.get('@reasonHeader').contains('Reason')
    .and('be.visible');
    cy.get('.duration-th').contains('Duration')
    .and('be.visible');
    cy.get('.Status-th').contains('Status')
    .and('be.visible');
    cy.get('.grid-header > .-u-6-24').contains('Actions')
    .and('be.visible');
});

it('Validating grid data', function(){
    cy.get('.row-0 > .-g > .-u-1-24 > .fa').as('statusIcon');
    cy.get('.row-0 > .-g > .undefined > .ng-pristine').should('not.be.checked');
    cy.get('.row-0 > .-g > .id-cell').contains('224982002')
    .and('be.visible');
    cy.get('.row-0 > .-g > .id-cell > .cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224982002/view')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-5-24').contains('Johnson124, Peter')
    .and('be.visible');
    cy.get('.row-0 > .-g > .startDate-cell').contains('3/9/2018 - 3/14/2018')
    .and('be.visible');
    cy.get('@statusIcon').should('be.visible');
    cy.get('@statusIcon').should('have.attr','title','Not Filled');
    cy.get('.row-0 > .-g > .-u-4-24').contains('Personal Day')
    .and('be.visible');
    cy.get('.row-0 > .-g > .duration-cell').contains('16 Hours')
    .and('be.visible');
    cy.get('.row-0 > .-g > .Status-cell > .cmpt-template-approval > .ng-scope > .text > .ng-binding').contains('Unapproved')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-6-24 > .fl-positive').contains('Approve')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-6-24 > .fl-negative').contains('Deny')
    .and('be.visible');
    cy.get('.row-0 > .-g > .-u-6-24 > .deny-part').contains('Deny Part')
    .and('be.visible');
});

it('Approved filter check', function (){
    cy.get(':nth-child(2) > .ng-valid').as('unapprovedChkBox');
    cy.get(':nth-child(3) > .ng-valid').as('partiallyApprovedChkBox');
    cy.get(':nth-child(3) > :nth-child(4) > .ng-valid').as('approvedChkBox');
    cy.get('@unapprovedChkBox').uncheck();
    cy.get('@partiallyApprovedChkBox').uncheck();
    cy.get('@approvedChkBox').check();
    cy.get('.row-0 > .-g > .id-cell').contains('224982028');
    cy.get('.row-0 > .-g > .id-cell > .cmpt-template-confirmation-link > .ng-binding').should('be.visible');
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.report-standards.cmpt-approve-bottom-result > div.content-panel.loaded > div > div > ul > li.row-container.row-0 > div > div.undefined.uicheckcol-cell.grid-cell > input').as('firstRowChkBox');
    cy.get('@firstRowChkBox').should('have.attr','ng-disabled','true');
    cy.get('.row-0 > .-g > .Status-cell > .cmpt-template-approval > .ng-scope > .icon > a > .fa').should('be.visible');
    cy.get('.row-0 > .-g > .-u-6-24').contains('Last Approved on 3/13/2018 10:48 AM');
    cy.get('.count').contains('6');
});

it('Denied filter check', function(){
    cy.get(':nth-child(3) > :nth-child(4) > .ng-valid').as('approvedChkBox');
    cy.get('@approvedChkBox').uncheck();
    cy.get(':nth-child(3) > :nth-child(5) > .ng-valid').as('deniedChkBox');
    cy.get('@deniedChkBox').check();
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.report-standards.cmpt-approve-bottom-result > div.content-panel.loaded > div > div > ul > li.row-container.row-0 > div > div.undefined.uicheckcol-cell.grid-cell > input').as('firstRowChkBox');
    cy.get('@firstRowChkBox').should('have.attr','ng-disabled','true');
    cy.get('.count').contains('2')
    .and('be.visible');
    cy.get('.row-0 > .-g > .id-cell').contains('224983276');
    cy.get('.cmpt-template-confirmation-link > .ng-binding').should('have.attr','href','/absences/detail/224983276/view')
    cy.get('.icon > a > .fa').should('have.attr','class','fa fa-times denied');
    cy.get('.row-container > .-g > .-u-6-24').contains('Denied on 3/23/2018 3:49 PM');
});

it('Partially approved filter check', function(){
    cy.get(':nth-child(3) > .ng-valid').as('partiallyApprovedChkBox');
    cy.get('@partiallyApprovedChkBox').check();
    cy.get('body > div.main-content.no-sidekick > div > ui-view > ui-view > div > div.report-standards.cmpt-approve-bottom-result > div.content-panel.loaded > div > div > ul > li.row-container.row-0 > div > div.undefined.uicheckcol-cell.grid-cell > input').as('firstRowChkBox');
    cy.get('@firstRowChkBox').should('have.attr','ng-disabled','true');
    cy.get('.row-2 > .-g > .undefined > .ng-valid').as('thirdRowChkBox');
    cy.get('@thirdRowChkBox').should('have.attr','ng-disabled','false');
    cy.get('.row-2 > .-g > .-u-5-24').contains('Towne318, Dino')
    .and('be.visible');
    cy.get('.row-2 > .-g > .Status-cell').contains('1')
    .and('be.visible');
    cy.get('.row-2 > .-g > .Status-cell > .cmpt-template-approval > .ng-scope > .icon > a').should('have.attr','href','/absences/detail/224982446/log/approver');
    cy.get(':nth-child(3) > :nth-child(5) > .ng-valid').as('deniedChkBox')
    cy.get('@deniedChkBox').uncheck();
    cy.get('.count').contains('1')
    .and('be.visible');
});

it('Approve absence workflow', function(){
    cy.server()
    cy.route({
        method:'GET',
        url: /\/api\/v1.0\/absencerequests\/.*\/Approvers/,
        response: approverList()
    });
    cy.route({
        method: 'PUT',
        url: /\/api\/v1.0\/absencerequests\/.*\/Approve\?comment=&fields=requiresApproval,numApproved,lastApprovedAction,approverKey,isApproved,isPartiallyApproved,isDenied,canApprove,canDeny,canDenyPart,startDate,endDate,approverComments/,
        response: approveAbsRequest()
    });
    cy.get(':nth-child(2) > .ng-valid').check();
    cy.get('.row-9 > .-g > .-u-5-24').scrollIntoView();
    cy.get('.row-9 > .-g > .-u-6-24 > .fl-positive').click();
    cy.get('.dialog-popup > :nth-child(1) > :nth-child(1)').contains('Approval Status for #224982003');
    cy.get(':nth-child(2) > .cmpt-template-approval > .ng-scope > .text > .ng-binding').contains('Unapproved');
    cy.get('.ngdialog-buttons > .fl-positive').click();
    cy.get('.toast').should('be.visible');
    cy.get('.toast-message').contains('#224982003 has been Approved successfully.')
    .and('be.visible');
});

it('Deny absence workflow', function(){
    cy.server()
    cy.route({
        method:'GET',
        url: /\/api\/v1.0\/absencerequests\/.*\/Approvers/,
        response: approverList()
    });
    cy.route({
        method:'PUT',
        url: /\/api\/v1.0\/absencerequests\/.*\/Deny\?comment=&fields=requiresApproval,numApproved,lastApprovedAction,approverKey,isApproved,isPartiallyApproved,isDenied,canApprove,canDeny,canDenyPart,startDate,endDate,approverComments/,
        response: denyAbsResponse()
    }).as('getdenyAbsResponse');

    cy.get('.row-4 > .-g > .-u-6-24 > .fl-negative').click();
    cy.get('.dialog-popup > :nth-child(1) > :nth-child(1)').should('be.visible');
    cy.get(':nth-child(2) > .cmpt-template-approval > .ng-scope > .text > .ng-binding').contains('Unapproved')
    .and('be.visible');
    cy.get('.ngdialog-buttons > .fl-negative').click();
    cy.wait('@getdenyAbsResponse');
    cy.get('.toast').should('be.visible');
    cy.get('.toast-message').contains('#224981897 has been Denied successfully.')
    .and('be.visible');
});


});