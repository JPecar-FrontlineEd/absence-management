const PassthroughOrg = require('../fixtures/BaseAesopAppMocking/passthrough-organization')
const FullIdmOrg = require('../fixtures/BaseAesopAppMocking/idm-organization')
const ResourceFixture = require('./resourceStringHelper')

const productFn = require('../fixtures/BaseAesopAppMocking/baseIdm/product');
const productaccessUserFn = require('../fixtures/BaseAesopAppMocking/baseIdm/productaccess-user');
const productaccessFn = require('../fixtures/BaseAesopAppMocking/baseIdm/productaccess');
const sessionsFn = require('../fixtures/BaseAesopAppMocking/baseIdm/sessions');
const sessionsStateFn = require('../fixtures/BaseAesopAppMocking/baseIdm/sessions-state');
const organizationBrandFn = require('../fixtures/BaseAesopAppMocking/orgSvc/organization-brand');
const accessPagePermission = require('../fixtures/BaseAesopAppMocking/orgSvc/actionPermission');

const campusUserFn = require('../fixtures/BaseAesopAppMocking/campusUser');
const orgUserFn = require('../fixtures/BaseAesopAppMocking/orgUser');
const rolesFn = require('../fixtures/BaseAesopAppMocking/roles');
const institutionsFn = require('../fixtures/BaseAesopAppMocking/institutions')

const fixture = (cy) => {


    //following example: https://github.com/FrontlineEducation/SuperSuit-UI-Automation-Data-Generation/blob/master/helper/fixtureHelper.js

    cy.window().then(function(win) {
		cy.window().then(win => win.localStorage.clear());
        cy.window().then(win => win.sessionStorage.clear());
        cy.window().then(win => win.sessionStorage.setItem('automation-no-analytics', 'true'));
        cy.window().then(win => win.sessionStorage.setItem('automation-no-auth', 'true'));
        cy.window().then(win => win.sessionStorage.setItem("token", '{"expires":null,"data":"2e622cc8ee9a4197dcd69fe54a4162b9asdfasdfasdf"}'));
    });

    	ResourceFixture(cy);

    const baseIdm = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/sessions',
            response: sessionsFn()
        })
        cy.route({
            method: 'POST',
            url: '/sessions/state',
            response: sessionsStateFn()
        });
        cy.route({
            method: 'GET',
            url: '/api/products/*',
            response: productFn()
        })
        cy.route({
            method: 'GET',
            url: '/productaccessservice/v0/api/users/id/*',
            response: productaccessUserFn()
        })
        cy.route({
            method: 'GET',
            url: '/productaccessservice/v0/api/productlinks?userId=*',
            response: productaccessFn()
        })
    };

    const organizationSvc = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/OrganizationAPI/api/organizations/*?fields=branding',
            
            response: organizationBrandFn()
        })
        //EC was using this mock, but we probably don't need it.
        // cy.route({
        // 	method: 'GET',
        // 	url: '/OrganizationAPI/api/organizations/*',
        // 	response: organizationFn()
        // });

        cy.route({
            method:'GET',
            url: /\/PermissionAPI\/api\/ActionPermissions\?organizationId=*/,
            response: accessPagePermission()
        })
    };

    const fullIdmOrganization = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/organizations',
            response: FullIdmOrg()
        })
    };

    const passthroughOrganization = (overrideSettingsObject) => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/organizations',
            response: PassthroughOrg(overrideSettingsObject)
        })
    };

    const institutions = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/institutions',
            response: institutionsFn()
        
        })
    };

    const campusUser = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/users',
            response: campusUserFn()
        })

        cy.route({
            method: 'GET',
            url: '/api/v1.0/permissionprofiles',
            response: {"data":[{"category":"ABSR","items":[{"type":"DISPLAY"},{"type":"CREATE"},{"type":"ADDDTLS"},{"type":"DELDTLS"},{"type":"DELETE"},{"type":"APPROVE"},{"type":"ASSIGNSUB"},{"type":"REMOVESUB"},{"type":"EXCEEDMAXENTT"},{"type":"SPLIT"},{"type":"DTLSBDCD"},{"type":"DTLSPYCD"},{"type":"VACANCY"},{"type":"VACANCYEDIT"},{"type":"NOABSDOW"},{"type":"OVERRIDENOSUB"},{"type":"DTLSACCD"},{"type":"EDITDTLSDATE"},{"type":"EDITDTLSINST"},{"type":"EDITDTLSENTT"},{"type":"EDITDTLSTIME"},{"type":"EDITDTLSBDCD"},{"type":"EDITDTLSPYCD"},{"type":"EDITDTLSACCD"},{"type":"EDITDTLSSUBHRS"},{"type":"EDITDTLSNOTES"},{"type":"EDITDTLSSUBREQ"},{"type":"OVERRIDEUNQUAL"},{"type":"EDITDTLSWORKADMNOTES"},{"type":"EDITDTLSADMINNOTES"},{"type":"EDITDTLSDURABSENT"},{"type":"EXCEEDWORKENTS"},{"type":"OVERRIDEEXCLUDED"},{"type":"EXCEEDCONSECABSDAYS"},{"type":"RESENDADVEMAILS"},{"type":"DTLSACCDPRIVATE"},{"type":"CUSTOMAG"},{"type":"OVRDSUBNOT"},{"type":"RMVSUBPRVNTWORK"},{"type":"VIEWDTLSADMINNOTES"},{"type":"VIEWTTLASSIGNPAYOUT"},{"type":"EXCEEDMAXABSDURATION"},{"type":"RECONCILEALL"},{"type":"OVERRIDESUBPREF"},{"type":"VIEWSUBTIMES"},{"type":"EDITSUBTIMES"},{"type":"ASSIGNOVERWORKEDSUB"},{"type":"VACPRIVATEEDIT"},{"type":"OVERRIDETASCHED"},{"type":"ASSIGNWHENHELD"},{"type":"ASSIGNAFTERCUTOFF"},{"type":"SHOWPRIVATEENTT"},{"type":"SHOWEXCLUDEDSUBS"},{"type":"CREATEAFTERCUTOFF"},{"type":"OVERRIDESUBNONWORKDAYS"}]},{"category":"ABSR_TS","items":[{"type":"DELETEABSR"},{"type":"DELETEABS"},{"type":"REMOVESUB"},{"type":"EDITABS"},{"type":"EDITABSR"},{"type":"DELABSR_APP"},{"type":"DELABS_APP"},{"type":"REMSUB_APP"},{"type":"EDITABS_APP"},{"type":"EDITABSR_APP"}]},{"category":"ABSRAPPRD","items":[{"type":"DELETE"},{"type":"EDITABSR"}]},{"category":"ABSRAPPRVL","items":[{"type":"APPROVEDENY"},{"type":"DENYITEMS"},{"type":"DENYASSIGNED"},{"type":"DENYPASTCUTOFF"}]},{"category":"ABSREXTD","items":[{"type":"ASSIGNSUB"},{"type":"DELETE"},{"type":"EDITABSR"},{"type":"RECONCILE"},{"type":"REMOVESUB"}]},{"category":"ABSRFEEDBK","items":[{"type":"VIEWFEEDBACK"},{"type":"ADDFEEDBACK"},{"type":"EDITFEEDBACK"},{"type":"ADDSUBEXPFEEDBACK"},{"type":"VIEWSUBEXPFEEDBACK"},{"type":"EDITSUBEXPFEEDBACK"},{"type":"VIEWSUBPERFSCORE"}]},{"category":"ABSRMLOC","items":[{"type":"APPROVE"},{"type":"ASSIGNSUB"},{"type":"DELETE"},{"type":"REMOVESUB"},{"type":"HOLDPROCESSING"},{"type":"MULTISCHOOLABSENCES"}]},{"category":"ABSRPAST","items":[{"type":"APPROVE"},{"type":"ASSIGNSUB"},{"type":"DELETE"},{"type":"REMOVESUB"},{"type":"EDITABSR"},{"type":"EDITABS"}]},{"category":"ABSRPROC","items":[{"type":"PAUSECALL"},{"type":"ABSENCELOG"},{"type":"CALLHISTORY"},{"type":"HOLDPROCESSING"},{"type":"FORCEABSRCALL"},{"type":"BLOCKSUB"}]},{"category":"ADMIN","items":[{"type":"RECORDEMPNAME"}]},{"category":"EMP","items":[{"type":"EMPREGISTER"},{"type":"EMPABSENCESCHED"},{"type":"EMPVIEWCONFIG"}]},{"category":"MISC","items":[{"type":"HELP"}]},{"category":"PREFLIST","items":[{"type":"VIEW"},{"type":"EDIT"},{"type":"EXCLUDE"},{"type":"COMMENTVIEW"},{"type":"COMMENTEDIT"}]},{"category":"RPTABS","items":[{"type":"ABSEXTRACT"},{"type":"SUBSIGNIN"},{"type":"ABSSUMMARY"},{"type":"ABSABSENTEE"},{"type":"APPROVALSTATUS"},{"type":"ABSDOWANAL"},{"type":"FEEDBACK"},{"type":"ABSDAILY"},{"type":"ABSCALLHIST"},{"type":"ABSINTERACTIVE"}]},{"category":"RPTEMP","items":[{"type":"EMPREG"}]},{"category":"RPTSUB","items":[{"type":"SUBAVAILABILITY"},{"type":"SUBHISTBYDATE"},{"type":"SUBEXCLUDED"}]},{"category":"RPTTS","items":[{"type":"MARKPAPER"},{"type":"SUMMARY"}]},{"category":"RPTWACCESS","items":[{"type":"VIEWPUBLIC"},{"type":"VIEWPUBLISHED"},{"type":"VIEWLOCKED"}]},{"category":"RPTWTYPES","items":[{"type":"ABSENCE"},{"type":"ENTT"},{"type":"SUB"},{"type":"WORK"},{"type":"INST"},{"type":"ENTTREF"},{"type":"WKT"},{"type":"ORGUSER"}]},{"category":"SECURITY","items":[{"type":"LASTLOGIN"}]},{"category":"SUB","items":[{"type":"SUBSCHED"},{"type":"SUBVIEWGENERAL"},{"type":"VIEWPHONE"}]},{"category":"SUBABS","items":[{"type":"DISPLAY"},{"type":"CREATE"},{"type":"EDIT"},{"type":"DELETE"},{"type":"EDITDTLSENTT"},{"type":"EDITDTLSDATE"},{"type":"DTLSACCD"},{"type":"EDITDTLSACCD"},{"type":"EDITPAST"},{"type":"EXCEEDMAXYEARLYUSAGE"},{"type":"EXCEEDMINABSDURATION"}]},{"category":"UPLOAD","items":[{"type":"ABSR"}]},{"category":"VACPROF","items":[{"type":"VACPROFILEPRIVEDIT"}]},{"category":"VTOPTIONS","items":[{"type":"PAYROLL_LOCK"},{"type":"TIMESHEET_VIEW"},{"type":"TIMESHEET_REVIEW_VIE"},{"type":"PEOPLE_VIEW"},{"type":"CHANGE_LOG_VIEW"},{"type":"VIEW_IP_RANGES"},{"type":"VIEW_KIOSK_ADMIN"},{"type":"VIEW_BARCODE"},{"type":"VIEW_CLOCK_LOG"},{"type":"VIEW_CLOCK_EXCEPT"},{"type":"VIEW_WORK_SUM"},{"type":"VIEW_WORK_DET"},{"type":"VIEW_SCHEDULES"},{"type":"VIEW_ACCOUNTCODE"},{"type":"VIEW_CHANGELOGLINK"},{"type":"VIEW_TAG_ADMIN"},{"type":"VIEW_VISIBLITY"},{"type":"VIEW_VIS_HIERARCHY"},{"type":"VIEW_TS_REJECT_REASO"},{"type":"VIEW_GENERALSEARCH"},{"type":"VIEW_ORGSETTINGS"},{"type":"VIEW_EVENTTYPES"},{"type":"VIEW_JOBTYPES"},{"type":"CAN_APPROVE_ALL"},{"type":"CAN_REJECT_ALL"},{"type":"CAN_RESET_ALL_PENDIN"},{"type":"CAN_RESET_ALL_SUBMIT"},{"type":"VIEW_SYSTEM_ACTIVITY"},{"type":"VIEW_WORK_SCHEDULES"},{"type":"VIEW_POSITIONS"},{"type":"VIEW_STAFF_GROUPS"},{"type":"VIEW_MASTER_CAL"},{"type":"VIEW_PAYROLL_REVIEW"},{"type":"VIEW_WAGE_CODE_ASSN"},{"type":"VIEW_SCHEDULE_SUMMAR"},{"type":"VIEW_WAGE_OPTIONS"},{"type":"VIEW_USER_SETTINGS"},{"type":"VIEW_BALANCE_HISTORY"},{"type":"VIEW_BALANCE_SUMMARY"},{"type":"CAN_UPDATE_BALANCE"},{"type":"VIEW_HBQ_REPORT"},{"type":"VIEW_VACANCYASSN"},{"type":"VIEW_ADMINSETTINGS"},{"type":"V_ACCOUNTCODE"},{"type":"V_ADMINSETTINGS"},{"type":"V_EVENTTYPES"},{"type":"V_IP_RANGES"},{"type":"V_JOBTYPES"},{"type":"V_KIOSK_ADMIN"},{"type":"V_MASTER_CAL"},{"type":"V_ORGSETTINGS"},{"type":"V_POSITIONS"},{"type":"V_STAFF_GROUPS"},{"type":"V_TAG_ADMIN"},{"type":"V_TS_REJECT_REASO"},{"type":"V_USER_SETTINGS"},{"type":"V_VACANCYASSN"},{"type":"V_VIS_HIERARCHY"},{"type":"V_VISIBLITY"},{"type":"V_WAGE_CODE_ASSN"},{"type":"V_WAGE_OPTIONS"},{"type":"V_WORK_SCHEDULES"},{"type":"APPROVE_SELECT_TS"},{"type":"REJECT_SELECT_TS"},{"type":"RESET_SEL_TS_2_SUBM"},{"type":"RESET_SEL_TS_2_PEND"},{"type":"V_TIMESHEET"},{"type":"USERPROFILE_VIEW"},{"type":"USERPROFILE_EDIT"},{"type":"E_ROUNDING_RULES"},{"type":"V_ROUNDING_RULES"},{"type":"V_ACCOUNTALLOCATION"},{"type":"E_ACCOUNTALLOCATION"},{"type":"V_ADMIN_VISIBILITIES"},{"type":"VIEWAPPROVALCHAIN"},{"type":"VIEWVPROFILESUMMARY"},{"type":"V_PAY_PERIOD_GROUPS"},{"type":"C_PAY_PERIOD_GROUPS"},{"type":"E_PAY_PERIOD_GROUPS"},{"type":"D_PAY_PERIOD_GROUPS"},{"type":"V_MY_USERS_REPORT"},{"type":"V_USERS_GRID"},{"type":"V_MISSINGAPPROVERS"},{"type":"V_ORPHANED_TIMESHEET"},{"type":"V_TCE_COMMENT"},{"type":"E_TCE_COMMENT"},{"type":"CREATE_ONDEMAND_AC"},{"type":"OVERRIDE_AA_FILTER"},{"type":"E_CALENDAR_GROUPS"},{"type":"V_CALENDAR_GROUPS"},{"type":"E_ACCRUAL_PROFILES"},{"type":"V_ACCRUAL_PROFILES"},{"type":"E_APPROVAL_PERIODS"},{"type":"V_APPROVAL_PERIODS"},{"type":"D_APPROVAL_PERIODS"},{"type":"C_APPROVAL_PERIODS"},{"type":"E_ACCRUAL_PERIODS"},{"type":"V_ACCRUAL_PERIODS"},{"type":"D_ACCRUAL_PERIODS"},{"type":"C_ACCRUAL_PERIODS"},{"type":"V_LRBLOGDETAILS"},{"type":"E_ACCRUAL_ELIG_DT"},{"type":"E_IDM_ACCESS"},{"type":"E_DATA_IMPORTS"},{"type":"V_DATA_IMPORTS"}]},{"category":"WEBFUNC","items":[{"type":"ABSCREATE"},{"type":"ABSMODIFY"},{"type":"RPTDAILY"},{"type":"RPTUNFILLED"},{"type":"RPTDOWABSANAL"},{"type":"RPTABSHISTORY"},{"type":"RPTABSENTEE"},{"type":"RPTCALLHIST"},{"type":"RPTSUBAVAIL"},{"type":"RPTEMPREG"},{"type":"RPTVOICEREC"},{"type":"MISCCHANGEPIN"},{"type":"MISCQUICKSTART"},{"type":"MISCPOLLQUESTION"},{"type":"RPTSUBHISTBYDATE"},{"type":"RPTSUBEXCLUSION"},{"type":"RPTSIGNIN"},{"type":"VIEWAPPROVERS"},{"type":"EDITAPPROVERS"},{"type":"PERSONALINFO"},{"type":"APPROVEABSR"},{"type":"APPROVALSTATUSRPT"},{"type":"UPABSR"},{"type":"ABSINTERACTIVE"},{"type":"VIEWSUMMARY"},{"type":"VIEWRWREPORTS"},{"type":"FEEDBACKRPT"}]}],"messages":[],"success":true,"modelState":{}}
        })
    };

    const orgUser = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/users',
            response: orgUserFn()
        });

        cy.route({
            method: 'GET',
            url: '/api/v1.0/permissionprofiles',
            response: { "data": [{ "category": "ABSR", "items": [{ "type": "DISPLAY" }, { "type": "CREATE" }, { "type": "ADDDTLS" }, { "type": "DELDTLS" }, { "type": "DELETE" }, { "type": "APPROVE" }, { "type": "ASSIGNSUB" }, { "type": "REMOVESUB" }, { "type": "EXCEEDMAXENTT" }, { "type": "SPLIT" }, { "type": "DTLSBDCD" }, { "type": "DTLSPYCD" }, { "type": "VACANCY" }, { "type": "VACANCYEDIT" }, { "type": "UNLOCK" }, { "type": "NOABSDOW" }, { "type": "OVERRIDENOSUB" }, { "type": "DTLSACCD" }, { "type": "EDITDTLSDATE" }, { "type": "EDITDTLSINST" }, { "type": "EDITDTLSENTT" }, { "type": "EDITDTLSTIME" }, { "type": "EDITDTLSBDCD" }, { "type": "EDITDTLSPYCD" }, { "type": "EDITDTLSACCD" }, { "type": "EDITDTLSSUBHRS" }, { "type": "EDITDTLSNOTES" }, { "type": "EDITDTLSSUBREQ" }, { "type": "OVERRIDEUNQUAL" }, { "type": "EDITDTLSWORKADMNOTES" }, { "type": "EDITDTLSADMINNOTES" }, { "type": "EDITDTLSDURABSENT" }, { "type": "EXCEEDWORKENTS" }, { "type": "OVERRIDEEXCLUDED" }, { "type": "EXCEEDCONSECABSDAYS" }, { "type": "RESENDADVEMAILS" }, { "type": "DTLSACCDPRIVATE" }, { "type": "CUSTOMAG" }, { "type": "OVRDSUBNOT" }, { "type": "RMVSUBPRVNTWORK" }, { "type": "VIEWDTLSADMINNOTES" }, { "type": "VIEWTTLASSIGNPAYOUT" }, { "type": "EXCEEDMAXABSDURATION" }, { "type": "RECONCILEALL" }, { "type": "OVERRIDESUBPREF" }, { "type": "VIEWSUBTIMES" }, { "type": "EDITSUBTIMES" }, { "type": "ASSIGNOVERWORKEDSUB" }, { "type": "VACPRIVATEEDIT" }, { "type": "ASSIGNOVERWORKEDMOS" }, { "type": "ASSIGNWHENHELD" }, { "type": "ASSIGNAFTERCUTOFF" }, { "type": "SHOWPRIVATEENTT" }, { "type": "SHOWEXCLUDEDSUBS" }, { "type": "CREATEAFTERCUTOFF" }, { "type": "OVERRIDESUBNONWORKDAYS" }] }, { "category": "ABSR_TS", "items": [{ "type": "DELETEABSR" }, { "type": "DELETEABS" }, { "type": "REMOVESUB" }, { "type": "EDITABS" }, { "type": "EDITABSR" }, { "type": "DELABSR_APP" }, { "type": "DELABS_APP" }, { "type": "REMSUB_APP" }, { "type": "EDITABS_APP" }, { "type": "EDITABSR_APP" }] }, { "category": "ABSRAPPRD", "items": [{ "type": "DELETE" }, { "type": "EDITABSR" }] }, { "category": "ABSRAPPRVL", "items": [{ "type": "APPROVEDENY" }, { "type": "DENYITEMS" }, { "type": "DENYASSIGNED" }, { "type": "DENYPASTCUTOFF" }] }, { "category": "ABSREXTD", "items": [{ "type": "ASSIGNSUB" }, { "type": "DELETE" }, { "type": "EDITABSR" }, { "type": "RECONCILE" }, { "type": "REMOVESUB" }] }, { "category": "ABSRFEEDBK", "items": [{ "type": "VIEWFEEDBACK" }, { "type": "ADDFEEDBACK" }, { "type": "EDITFEEDBACK" }, { "type": "ADDSUBEXPFEEDBACK" }, { "type": "VIEWSUBEXPFEEDBACK" }, { "type": "EDITSUBEXPFEEDBACK" }, { "type": "VIEWSUBPERFSCORE" }] }, { "category": "ABSRMLOC", "items": [{ "type": "APPROVE" }, { "type": "ASSIGNSUB" }, { "type": "DELETE" }, { "type": "REMOVESUB" }, { "type": "HOLDPROCESSING" }, { "type": "MULTISCHOOLABSENCES" }] }, { "category": "ABSRPAST", "items": [{ "type": "APPROVE" }, { "type": "ASSIGNSUB" }, { "type": "DELETE" }, { "type": "REMOVESUB" }, { "type": "EDITABSR" }, { "type": "EDITABS" }] }, { "category": "ABSRPROC", "items": [{ "type": "PAUSECALL" }, { "type": "ABSENCELOG" }, { "type": "HOLDPROCESSING" }, { "type": "FORCEABSRCALL" }, { "type": "BLOCKSUB" }] }, { "category": "ADMIN", "items": [{ "type": "RECORDINGS" }] }, { "category": "CHGLOG", "items": [{ "type": "CHGLOGVIEW" }] }, { "category": "DASHBOARD", "items": [{ "type": "CONFIGORG" }, { "type": "CONFIGSELF" }] }, { "category": "DISTLIST", "items": [{ "type": "CREATE" }, { "type": "EDIT" }, { "type": "DELETE" }] }, { "category": "EMP", "items": [{ "type": "EMPADD" }, { "type": "EMPDEL" }, { "type": "EMPACTDEACT" }, { "type": "EMPVIEWGENERAL" }, { "type": "EMPEDITGENERAL" }, { "type": "EMPVIEWCONFIG" }, { "type": "EMPEDITCONFIG" }, { "type": "EMPADDCONFIG" }, { "type": "EMPDELCONFIG" }, { "type": "EMPVIEWPERMISSIONS" }, { "type": "EMPEDITPERMISSIONS" }, { "type": "EMPVIEWENTITLEMENTS" }, { "type": "EMPEDITENTITLEMENTS" }, { "type": "EMPADDENTITLEMENTS" }, { "type": "EMPDELENTITLEMENTS" }, { "type": "LOGINHISTORY" }] }, { "category": "EXTRACT", "items": [{ "type": "PAYROLL EXTRACT" }, { "type": "EXTIMPORTDATA" }, { "type": "EXTIMPORTSTATUSVIEW" }, { "type": "EXTTIMESHEET" }] }, { "category": "INST", "items": [{ "type": "INSTADD" }, { "type": "INSTDEL" }, { "type": "INSTACTDEACT" }, { "type": "INSTVIEWGENERAL" }, { "type": "INSTEDITGENERAL" }, { "type": "INSTVIEWCONFIG" }, { "type": "INSTEDITCONFIG" }, { "type": "INSTPERMSUB" }, { "type": "INSTPERMSUBADD" }, { "type": "VIEWAPPROVERS" }, { "type": "EDITAPPROVERS" }, { "type": "LOGINHISTORY" }, { "type": "ABSR" }] }, { "category": "MISC", "items": [{ "type": "HELP" }, { "type": "LIVECHAT" }, { "type": "AESOPFEEDBACK" }] }, { "category": "ORG", "items": [{ "type": "ORGVIEWGENERAL" }, { "type": "ORGEDITGENERAL" }, { "type": "ORGVIEWCONFIG" }, { "type": "ORGEDITCONFIG" }, { "type": "ORGVIEWCAL" }, { "type": "ORGADDCAL" }, { "type": "ORGDELCAL" }, { "type": "ORGEDITCAL" }, { "type": "ORGVIEWALERT" }, { "type": "ORGADDALERT" }, { "type": "ORGDELALERT" }, { "type": "ORGEDITALERT" }, { "type": "EDITFEEDBACKQS" }, { "type": "VIEWFEEDBACKQS" }] }, { "category": "PREFLIST", "items": [{ "type": "VIEW" }, { "type": "EDIT" }, { "type": "EXCLUDE" }, { "type": "COMMENTVIEW" }, { "type": "COMMENTEDIT" }] }, { "category": "REFDATA", "items": [{ "type": "REFDATAVIEW" }, { "type": "REFDATAADD" }, { "type": "REFDATADEL" }, { "type": "REFDATAEDIT" }] }, { "category": "RPTABS", "items": [{ "type": "ABSDAILY" }, { "type": "ADVNOTICE" }, { "type": "ABSSUMMARY" }, { "type": "ABSCALLHIST" }, { "type": "ABSDOWANAL" }, { "type": "ABSAPPROVAL" }, { "type": "ABSUNFILLED" }, { "type": "ABSASSIGNMENT" }, { "type": "ABSENTPERCENT" }, { "type": "ABSENTBYINST" }, { "type": "SUBSIGNIN" }, { "type": "ABSABSENTEE" }, { "type": "APPROVALSTATUS" }, { "type": "ABSINTERACTIVE" }, { "type": "CANCELEDABSRS" }, { "type": "FEEDBACK" }, { "type": "ABSEXTRACT" }, { "type": "ABSPERFATTND" }] }, { "category": "RPTEMP", "items": [{ "type": "EMPENTBALSUM" }, { "type": "EMPENTBALDET" }, { "type": "EMPREG" }, { "type": "EMPQUALSUBS" }, { "type": "EMPABSHISTORY" }, { "type": "EMPFESKILLS" }, { "type": "EMPITINWORK" }, { "type": "LETTERHISTORY" }] }, { "category": "RPTMISC", "items": [{ "type": "MISCWELCOME" }] }, { "category": "RPTREC", "items": [{ "type": "RECSCHOOLNAMES" }, { "type": "RECEMPNAMES" }, { "type": "RECSUBNAMES" }] }, { "category": "RPTSUB", "items": [{ "type": "SUBAVAILABILITY" }, { "type": "SUBHISTBYDATE" }, { "type": "SUBMOSTCALLED" }, { "type": "SUBREG" }, { "type": "SUBSKILLS" }, { "type": "SUBEXCLUDED" }, { "type": "SUBFULFILLHISTORY" }, { "type": "SUBAVAILJOBS" }, { "type": "SUBPERFORMANCE" }, { "type": "SUBJOBVISHIERARCHY" }, { "type": "SUBMULTIPLE" }, { "type": "SUBINSTPREF" }, { "type": "TIMESHEETS" }, { "type": "SUBNONWORKING" }, { "type": "LETTERHISTORY" }, { "type": "SUBASSGNSUM" }, { "type": "RESTCALLTIME" }, { "type": "SUBUTIL" }, { "type": "SUBCANCEL" }] }, { "category": "RPTTS", "items": [{ "type": "SUMMARY" }, { "type": "OUTSTANDING" }, { "type": "MARKPAPER" }] }, { "category": "RPTWACCESS", "items": [{ "type": "CREATEPUBLIC" }, { "type": "CREATEPUBLISHED" }, { "type": "CREATEPRIVATE" }, { "type": "VIEWPUBLIC" }, { "type": "VIEWPUBLISHED" }, { "type": "EDITPUBLIC" }, { "type": "LETTERWRITER" }, { "type": "SCHEDULE" }, { "type": "DISTRIBUTE" }, { "type": "VIEWLOCKED" }] }, { "category": "RPTWTYPES", "items": [{ "type": "ABSENCE" }, { "type": "ENTT" }, { "type": "SUB" }, { "type": "WORK" }, { "type": "SUBLETTER" }, { "type": "WORKLETTER" }, { "type": "INST" }, { "type": "ENTTREF" }, { "type": "WKT" }, { "type": "ORGUSER" }, { "type": "TIMESHEET" }] }, { "category": "SECURITY", "items": [{ "type": "SECORGUSERVIEW" }, { "type": "SECORGUSERADD" }, { "type": "SECORGUSERDELETE" }, { "type": "SECORGUSEREDIT" }, { "type": "SECPROFILEVIEW" }, { "type": "SECPROFILEADD" }, { "type": "SECPROFILEDELETE" }, { "type": "SECPROFILEEDIT" }, { "type": "SECORGPROFILEVIEW" }, { "type": "SECORGPROFILEADD" }, { "type": "SECORGPROFILEDELETE" }, { "type": "SECORGPROFILEEDIT" }, { "type": "SECINSTVISVIEW" }, { "type": "SECINSTVISADD" }, { "type": "SECINSTVISDELETE" }, { "type": "SECINSTVISEDIT" }, { "type": "SECPINRESET" }, { "type": "SECPINEXPIRE" }, { "type": "SECPINVIEW" }, { "type": "SECSSNVIEW" }, { "type": "SECCAMPUSUSERVIEW" }, { "type": "SECCAMPUSUSERADD" }, { "type": "SECCAMPUSUSEREDIT" }, { "type": "SECCAMPUSUSERDELETE" }, { "type": "SECAPRVPROFILEVIEW" }, { "type": "SECAPRVPROFILEADD" }, { "type": "SECAPRVPROFILEDELETE" }, { "type": "SECAPRVPROFILEEDIT" }, { "type": "SECWORKERTYPEVISVIEW" }, { "type": "SECWORKERTYPEVISADD" }, { "type": "SECWORKERTYPEVISDELE" }, { "type": "SECWORKERTYPEVISEDIT" }, { "type": "LASTLOGIN" }, { "type": "WEBSERVICEAPIKEY" }, { "type": "ACCESSSTATUSVIEW" }, { "type": "ACCESSSTATUSORG" }, { "type": "ACCESSSTATUSPRODUCT" }] }, { "category": "SUB", "items": [{ "type": "SUBSCHED" }, { "type": "SUBADDSUBSCHED" }, { "type": "SUBDELSUBSCHED" }, { "type": "SUBADD" }, { "type": "SUBDEL" }, { "type": "SUBACTDEACT" }, { "type": "SUBVIEWGENERAL" }, { "type": "SUBEDITGENERAL" }, { "type": "SUBVIEWCONFIG" }, { "type": "SUBEDITCONFIG" }, { "type": "SUBADDCONFIG" }, { "type": "SUBDELCONFIG" }, { "type": "SUBVIEWPERMISSIONS" }, { "type": "SUBEDITPERMISSIONS" }, { "type": "ADDLOCLISTS" }, { "type": "DELLOCLLISTS" }, { "type": "EDITLOCLISTS" }, { "type": "VIEWLOCLISTS" }, { "type": "RMVSYSTGENNONWORK" }, { "type": "LOGINHISTORY" }, { "type": "SUBVIEWEXDETAIL" }] }, { "category": "SUBABS", "items": [{ "type": "DISPLAY" }, { "type": "CREATE" }, { "type": "EDIT" }, { "type": "DELETE" }, { "type": "EDITDTLSENTT" }, { "type": "EDITDTLSDATE" }, { "type": "DTLSACCD" }, { "type": "EDITDTLSACCD" }, { "type": "EDITPAST" }, { "type": "UNLOCK" }, { "type": "EXCEEDMAXYEARLYUSAGE" }, { "type": "EXCEEDMINABSDURATION" }] }, { "category": "UPLOAD", "items": [{ "type": "ABSR" }] }, { "category": "VACPROF", "items": [{ "type": "ADD" }, { "type": "DELETE" }, { "type": "VACEDITCONFIG" }, { "type": "VACVIEWCONFIG" }, { "type": "VACEDITGENERAL" }, { "type": "VACVIEWGENERAL" }, { "type": "VACPROFILEPRIVEDIT" }] }, { "category": "VTOPTIONS", "items": [{ "type": "PAYROLL_LOCK" }, { "type": "TIMESHEET_VIEW" }, { "type": "TIMESHEET_REVIEW_VIE" }, { "type": "PEOPLE_VIEW" }, { "type": "CHANGE_LOG_VIEW" }, { "type": "VIEW_IP_RANGES" }, { "type": "VIEW_KIOSK_ADMIN" }, { "type": "VIEW_BARCODE" }, { "type": "VIEW_CLOCK_LOG" }, { "type": "VIEW_CLOCK_EXCEPT" }, { "type": "VIEW_WORK_SUM" }, { "type": "VIEW_WORK_DET" }, { "type": "VIEW_SCHEDULES" }, { "type": "VIEW_ACCOUNTCODE" }, { "type": "VIEW_CHANGELOGLINK" }, { "type": "VIEW_TAG_ADMIN" }, { "type": "VIEW_VISIBLITY" }, { "type": "VIEW_VIS_HIERARCHY" }, { "type": "VIEW_TS_REJECT_REASO" }, { "type": "VIEW_GENERALSEARCH" }, { "type": "VIEW_ORGSETTINGS" }, { "type": "VIEW_EVENTTYPES" }, { "type": "VIEW_JOBTYPES" }, { "type": "CAN_APPROVE_ALL" }, { "type": "CAN_REJECT_ALL" }, { "type": "CAN_RESET_ALL_PENDIN" }, { "type": "CAN_RESET_ALL_SUBMIT" }, { "type": "VIEW_SYSTEM_ACTIVITY" }, { "type": "VIEW_WORK_SCHEDULES" }, { "type": "VIEW_POSITIONS" }, { "type": "VIEW_STAFF_GROUPS" }, { "type": "VIEW_MASTER_CAL" }, { "type": "VIEW_PAYROLL_REVIEW" }, { "type": "VIEW_WAGE_CODE_ASSN" }, { "type": "VIEW_SCHEDULE_SUMMAR" }, { "type": "VIEW_WAGE_OPTIONS" }, { "type": "VIEW_USER_SETTINGS" }, { "type": "VIEW_BALANCE_HISTORY" }, { "type": "VIEW_BALANCE_SUMMARY" }, { "type": "CAN_UPDATE_BALANCE" }, { "type": "VIEW_HBQ_REPORT" }, { "type": "VIEW_VACANCYASSN" }, { "type": "VIEW_ADMINSETTINGS" }, { "type": "V_ACCOUNTCODE" }, { "type": "V_ADMINSETTINGS" }, { "type": "V_EVENTTYPES" }, { "type": "V_IP_RANGES" }, { "type": "V_JOBTYPES" }, { "type": "V_KIOSK_ADMIN" }, { "type": "V_MASTER_CAL" }, { "type": "V_ORGSETTINGS" }, { "type": "V_POSITIONS" }, { "type": "V_STAFF_GROUPS" }, { "type": "V_TAG_ADMIN" }, { "type": "V_TS_REJECT_REASO" }, { "type": "V_USER_SETTINGS" }, { "type": "V_VACANCYASSN" }, { "type": "V_VIS_HIERARCHY" }, { "type": "V_VISIBLITY" }, { "type": "V_WAGE_CODE_ASSN" }, { "type": "V_WAGE_OPTIONS" }, { "type": "V_WORK_SCHEDULES" }, { "type": "APPROVE_SELECT_TS" }, { "type": "REJECT_SELECT_TS" }, { "type": "RESET_SEL_TS_2_SUBM" }, { "type": "RESET_SEL_TS_2_PEND" }, { "type": "V_TIMESHEET" }, { "type": "USERPROFILE_VIEW" }, { "type": "USERPROFILE_EDIT" }, { "type": "E_ROUNDING_RULES" }, { "type": "V_ROUNDING_RULES" }, { "type": "V_ACCOUNTALLOCATION" }, { "type": "E_ACCOUNTALLOCATION" }, { "type": "V_ADMIN_VISIBILITIES" }, { "type": "VIEWAPPROVALCHAIN" }, { "type": "VIEWVPROFILESUMMARY" }, { "type": "V_PAY_PERIOD_GROUPS" }, { "type": "C_PAY_PERIOD_GROUPS" }, { "type": "E_PAY_PERIOD_GROUPS" }, { "type": "D_PAY_PERIOD_GROUPS" }, { "type": "V_MY_USERS_REPORT" }, { "type": "V_USERS_GRID" }, { "type": "V_MISSINGAPPROVERS" }, { "type": "V_ORPHANED_TIMESHEET" }, { "type": "V_TCE_COMMENT" }, { "type": "E_TCE_COMMENT" }, { "type": "CREATE_ONDEMAND_AC" }, { "type": "OVERRIDE_AA_FILTER" }, { "type": "E_CALENDAR_GROUPS" }, { "type": "V_CALENDAR_GROUPS" }, { "type": "E_ACCRUAL_PROFILES" }, { "type": "V_ACCRUAL_PROFILES" }, { "type": "E_APPROVAL_PERIODS" }, { "type": "V_APPROVAL_PERIODS" }, { "type": "D_APPROVAL_PERIODS" }, { "type": "C_APPROVAL_PERIODS" }, { "type": "E_ACCRUAL_PERIODS" }, { "type": "V_ACCRUAL_PERIODS" }, { "type": "D_ACCRUAL_PERIODS" }, { "type": "C_ACCRUAL_PERIODS" }, { "type": "V_LRBLOGDETAILS" }, { "type": "E_ACCRUAL_ELIG_DT" }, { "type": "E_IDM_ACCESS" }, { "type": "E_DATA_IMPORTS" }, { "type": "V_DATA_IMPORTS" }] }, { "category": "WIDGETS", "items": [{ "type": "DAILYABSCT" }, { "type": "WEEKLYABSCT" }, { "type": "DAILYFILLRATE" }, { "type": "WEEKLYFILLRATE" }, { "type": "DAILYABSRATE" }, { "type": "WEEKLYABSRATE" }, { "type": "DAILYPCTSUB" }, { "type": "WEEKLYPCTSUB" }, { "type": "CURRENTPCTABS" }] }], "messages": [], "success": true, "modelState": {} }
        })
    };

    const roles = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/usersessions/Roles?orgXrefId=*',
            response: rolesFn()
        })
    };

    const products = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/products',
            response: { "data": [{ "id": 4045, "mode": "purchased", "productId": 1, "name": "Aesop", "marketingUrl": "http://www.frontlinek12.com/Products/Aesop.html?utm_source=AESOP%20Navigator%20Navigation%20Bar%20App%20Switcher%20Button%20AESOP&utm_medium=Aesop%20Navigator&utm_term=none&utm_content=none&utm_campaign=AESOP%20Navigator%20Navigation%20Bar%20App%20Switcher%20Button%20AESOP", "url": "", "displayName": "Absence Management" }, { "id": 11241, "mode": "purchased", "productId": 2, "name": "VeriTime", "marketingUrl": "http://www.frontlinek12.com/Products/VeriTime.html?utm_source=AESOP%20Navigator%20Navigation%20Bar%20App%20Switcher%20Button%20Veritime&utm_medium=Aesop%20Navigator&utm_term=none&utm_content=none&utm_campaign=AESOP%20Navigator%20Navigation%20Bar%20App%20Switcher%20Button%20Veritime", "url": "System/RedirectToVeritime", "displayName": "Time & Attendance" }], "messages": [], "success": true, "modelState": {} }
        })
    };

    const workerTypes = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/workertypes',
            response: { "data": [{ "id": 1357, "title": "Teacher", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }, { "id": 1358, "title": "Staff", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }, { "id": 1359, "title": "Admin", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }, { "id": 1360, "title": "Nurse", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }, { "id": 107186, "title": "Transportation", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }, { "id": 107187, "title": "Tester", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }, { "id": 107188, "title": "Food Service", "DeductBreakFromAbsenceDuration": null, "BalanceTrackingType": 1 }], "messages": [], "success": true, "modelState": {} }
        })
    };

    const notifications = () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/api/v1.0/notifications',
            response: { "data": [], "messages": [], "success": true, "modelState": {} }
        })
    };
   


    return {
        baseIdm,
        organizationSvc,
        fullIdmOrganization,
        roles,

        passthroughOrganization,
        institutions,
        campusUser,
        orgUser,
        products,
        workerTypes,
        notifications,
    };
};

module.exports = fixture;