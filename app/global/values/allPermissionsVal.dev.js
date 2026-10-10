(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------------# //
	// #----- Value (allPermissionsVal) -----# //
	app.value('allPermissionsVal', {
		'ABSR': {
			title: 'Absence',
			items: {
				'DISPLAY': 'Absence Request details - View',
				'CREATE': 'Absence Request - Add',
				'EDITDTLS': 'Absence Request details - Edit',
				'ADDDTLS': 'Absence Request details - Add',
				'DELDTLS': 'Absence Request details - Delete',
				'DELETE': 'Absence Request - Delete',
				'APPROVE': 'Absence Request - Reconcile',
				'ASSIGNSUB': 'Absence Request - Assign Sub',
				'REMOVESUB': 'Absence Request - Remove Sub',
				'EXCEEDMAXENTT': 'Absence Request Details - Exceed Max Entitlement Limit for Organization',
				'SPLIT': 'Absence Request - Split',
				'DTLSBDCD': 'Absence Request Details - Show Budget Code',
				'DTLSPYCD': 'Absence Request Details - Show Pay Code',
				'VACANCY': 'Vacancies - View',
				'VACANCYEDIT': 'Vacancies - Manage',
				'UNLOCK': 'Unlock',
				'NOABSDOW': 'Can Enter an Absence for a No Absence Day of the Week',
				'OVERRIDENOSUB': 'Absence Request - Assign Sub When No Sub Is Needed',
				'DTLSACCD': 'Absence Request Details - Show Accounting Code',
				'EDITDTLSDATE': 'Absence Request Details - Edit Date',
				'EDITDTLSINST': 'Absence Request Details - Edit School',
				'EDITDTLSENTT': 'Absence Request Details - Edit Entitlement',
				'EDITDTLSTIME': 'Absence Request Details - Edit Shift/Start and End Times',
				'EDITDTLSBDCD': 'Absence Request Details - Edit Budget Code',
				'EDITDTLSPYCD': 'Absence Request Details - Edit Pay Code',
				'EDITDTLSACCD': 'Absence Request Details - Edit Accounting Code',
				'EDITDTLSSUBHRS': 'Absence Request Details - Edit Sub Hours Worked',
				'EDITDTLSNOTES': 'Absence Request Details - Edit Notes',
				'EDITDTLSSUBREQ': 'Absence Request Details - Edit Substitute Required',
				'OVERRIDEUNQUAL': 'Absence Request - Assign Unqualified Sub',
				'EDITDTLSWORKADMNOTES': 'Absence Request Details - Edit Notes to Admin',
				'EDITDTLSADMINNOTES': 'Absence Request Details - Edit Administrator Only Notes',
				'EDITDTLSDURABSENT': 'Absence Request Details - Edit Time Absent',
				'EXCEEDWORKENTS': 'Absence Request Details - Exceed Max Entitlement Limit for Worker',
				'OVERRIDEEXCLUDED': 'Absence Request - Assign Excluded Sub',
				'EXCEEDCONSECABSDAYS': 'Absence Request Details - Exceed Consecutive Absence Days',
				'RESENDADVEMAILS': 'Resend Advance Emails',
				'DTLSACCDPRIVATE': 'Select Private Accounting Codes',
				'CUSTOMAG': 'Manage Custom Allocation Groups',
				'OVRDSUBNOT': 'Absence Request - Override Substitute Cancellation Notification',
				'RMVSUBPRVNTWORK': 'Absence Request - Remove Substitute and keep Substitute from working other Jobs',
				'VIEWDTLSADMINNOTES': 'Absence Request Details - View Administrator Only Notes',
				'VIEWTTLASSIGNPAYOUT': 'View Total Payout of Assignment',
				'EXCEEDMAXABSDURATION': 'Absence Request - Exceed Minimum/Maximum Absence Duration',
				'RECONCILEALL': 'Absence Request - Reconcile ALL',
				'OVERRIDESUBPREF': 'Absence Request - Assign Overriding Sub Preferences',
				'VIEWSUBTIMES': 'Absence Request Details - View Substitute Times',
				'EDITSUBTIMES': 'Absence Request Details - Edit Substitute Times',
				'ASSIGNOVERWORKEDSUB': 'Absence Request - Assign Overriding Sub Hour Limits',
				'VACPRIVATEEDIT': 'Vacancies Private - Manage'
			}
		},
		'ABSRPROC': {
			title: 'Absence Processing',
			items: {
				'ABSENCELOG': 'Absence Log - View',
				'BLOCKSUB': 'Block Sub From Absence',
				'CALLHISTORY': 'Call History - View',
				'FORCEABSRCALL': 'Force Call for Absence',
				'HOLDPROCESSING': 'Absence Request - Hold Processing',
				'PAUSECALL': 'Absence Request - Pause Calling'
			}
		},
		'ADMIN': {
			title: 'Administrative',
			items: {
				'RECORDEMPNAME': 'Record Worker Names',
				'RECORDINGS': 'Make Recordings'
			}
		},
		'EMP': {
			title: 'Worker',
			items: {
				'EMPREGISTER': 'Worker - View Register',
				'EMPABSENCESCHED': 'Worker - View Absence Schedule',
				'EMPADD': 'Worker - Add',
				'EMPDEL': 'Worker - Delete',
				'EMPACTDEACT': 'Worker - Activate/Deactivate',
				'EMPVIEWGENERAL': 'General Information - View',
				'EMPEDITGENERAL': 'General Information - Edit',
				'EMPVIEWCONFIG': 'Configuration Settings - View',
				'EMPEDITCONFIG': 'Configuration Settings - Edit',
				'EMPADDCONFIG': 'Configuration Settings - Add',
				'EMPDELCONFIG': 'Configuration Settings - Delete',
				'EMPVIEWPERMISSIONS': 'Permissions - View',
				'EMPEDITPERMISSIONS': 'Permissions - Edit',
				'EMPVIEWENTITLEMENTS': 'Entitlements - View',
				'EMPEDITENTITLEMENTS': 'Entitlements - Edit/View Change Log',
				'EMPADDENTITLEMENTS': 'Entitlements - Add',
				'EMPDELENTITLEMENTS': 'Entitlements - Delete',
				'LOGINHISTORY': 'View Login History'
			}
		},
		'MISC': {
			title: 'Miscellaneous',
			items: {
				'HELP': 'View help guides',
				'LIVECHAT': 'Allow Live Chat',
				'AESOPFEEDBACK': 'Allow Application Feedback'
			}
		},
		'SUB': {
			title: 'Substitute',
			items: {
				'SUBREGISTER': 'Substitute - View Register',
				'SUBSCHED': 'Schedule - View',
				'SUBADDSUBSCHED': 'Schedule - Add',
				'SUBDELSUBSCHED': 'Schedule - Delete',
				'SUBEDITSUBSCHED': 'Schedule - Edit',
				'SUBADD': 'Substitute - Add',
				'SUBDEL': 'Substitute - Delete',
				'SUBACTDEACT': 'Substitute - Activate/Deactivate',
				'SUBVIEWGENERAL': 'General Information - View',
				'SUBEDITGENERAL': 'General Information - Edit',
				'SUBVIEWCONFIG': 'Skills Settings - View',
				'SUBEDITCONFIG': 'Skills Settings - Edit',
				'SUBADDCONFIG': 'Skills Settings - Add',
				'SUBDELCONFIG': 'Skills Settings - Delete',
				'SUBVIEWPERMISSIONS': 'Permissions - View',
				'SUBEDITPERMISSIONS': 'Permissions - Edit',
				'ADDLOCLISTS': 'Preferred Rooms - Add',
				'DELLOCLLISTS': 'Preferred Rooms - Delete',
				'EDITLOCLISTS': 'Preferred Rooms - Edit',
				'VIEWLOCLISTS': 'Preferred Rooms - View',
				'VIEWPHONE': 'Substitute - View Phone Number',
				'RMVSYSTGENNONWORK': 'Remove System Generated Non Work Day',
				'LOGINHISTORY': 'View Login History',
				'SUBVIEWEXDETAIL': 'View External Details'
			}
		},
		'WEBFUNC'   : {
			title: 'Web Functions',
			items: {
				'ABSCREATE': 'Can View Create Absence Hyperlink',
				'ABSMODIFY': 'Can View Modify Absence Hyperlink',
				'RPTDAILY': 'Can View Daily Report',
				'RPTUNFILLED': 'Can View Unfilled Absences Report',
				'RPTDOWABSANAL': 'Can View Day Of Week Absence Analysis Report',
				'RPTABSHISTORY': 'Can View Absence Monthly Summary Report',
				'RPTABSENTEE': 'Can View Absentee Report',
				'RPTCALLHIST': 'Can View Absence Call History Report',
				'RPTSUBAVAIL': 'Can View Substitute Availability Report',
				'RPTEMPREG': 'Can View Worker Register Report',
				'RPTVOICEREC': 'Can View Voice Recording Report',
				'MISCCHANGEPIN': 'Can View Change Pin Hyperlink',
				'MISCQUICKSTART': 'Can View Quick Start Guide Hyperlink',
				'MISCPOLLQUESTION': 'Can Answer Aesop Poll Questions',
				'RPTSUBHISTBYDATE': 'Can View Sub History By Date Report',
				'RPTSUBEXCLUSION': 'Can View Sub Exclusion Report',
				'RPTSIGNIN': 'Can View Sub Sign In Report',
				'VIEWAPPROVERS': 'Timesheets - View Approver schedule',
				'EDITAPPROVERS': 'Timesheets - Edit Approver schedule',
				'PERSONALINFO': 'Campus Users - Edit Personal Information',
				'APPROVEABSR': 'Can View Approve Absence Hyperlink',
				'APPROVALSTATUSRPT': 'Can View Absence Approval Report',
				'UPABSR': 'Upload Absence/Vacancy Files',
				'ABSINTERACTIVE': 'Can View Absence Interactive Report',
				'VIEWSUMMARY': 'Timesheets - View Summary Report',
				'VIEWRWREPORTS': 'Report Writer - View Public and Published Reports',
				'FEEDBACKRPT': 'Can View Absence Feedback Report'
			}
		},
		'ORG': {
			title: 'Organization',
			items: {
				'VIEWGENERAL': 'General Information - View',
				'EDITGENERAL': 'General Information - Edit',
				'ORGVIEWGENERAL': 'General Information - View',
				'ORGEDITGENERAL': 'General Information - Edit',
				'ORGVIEWCONFIG': 'Configuration Settings - View',
				'ORGADDCONFIG': 'Configuration Settings - Add',
				'ORGDELCONFIG': 'Configuration Settings - Delete',
				'ORGEDITCONFIG': 'Configuration Settings - Edit',
				'ORGVIEWCAL': 'Calendar - View',
				'ORGADDCAL': 'Calendar - Add',
				'ORGDELCAL': 'Calendar - Delete',
				'ORGEDITCAL': 'Calendar - Edit',
				'ORGVIEWALERT': 'Alerts - View',
				'ORGADDALERT': 'Alerts - Add',
				'ORGDELALERT': 'Alerts - Delete',
				'ORGEDITALERT': 'Alerts - Edit',
				'EDITFEEDBACKQS': 'Feedback Questions - Edit',
				'VIEWFEEDBACKQS': 'Feedback Questions - View'
			}
		},
		'INST': {
			title: 'School',
			items: {
				'INSTADD': 'School - Add',
				'INSTDEL': 'School - Delete',
				'INSTACTDEACT': 'School - Activate/Deactivate',
				'INSTVIEWGENERAL': 'General Information - View',
				'INSTEDITGENERAL': 'General Information - Edit',
				'INSTVIEWCONFIG': 'Configuration Settings - View',
				'INSTADDCONFIG': 'Configuration Settings - Add',
				'INSTDELCONFIG': 'Configuration Settings - Delete',
				'INSTEDITCONFIG': 'Configuration Settings - Edit',
				'INSTPERMSUB': 'Permanent Sub - View',
				'INSTPERMSUBADD': 'Permanent Sub - Add/Remove',
				'VIEWAPPROVERS': 'Timesheets - View Approver schedule',
				'EDITAPPROVERS': 'Timesheets - Edit Approver schedule',
				'LOGINHISTORY': 'View Login History',
				'ABSR': 'Absence/Vacancy Files'
			}
		},
		'REFDATA'   : {
			title: 'Reference Data',
			items: {
				'REFDATAVIEW': 'View',
				'REFDATAADD': 'Add',
				'REFDATADEL': 'Delete',
				'REFDATAEDIT': 'Edit',
				'REFDATAASSIGN': 'Assign'
			}
		},
		'SECURITY'  : {
			title: 'Security',
			items: {
				'SECORGUSERVIEW': 'Organization Users - View',
				'SECORGUSERADD': 'Organization Users - Add',
				'SECORGUSERDELETE': 'Organization Users - Delete',
				'SECORGUSEREDIT': 'Organization Users - Edit',
				'SECPROFILEVIEW': 'Principal Permission Profiles - View',
				'SECPROFILEADD': 'Principal Permission Profiles - Add',
				'SECPROFILEDELETE': 'Principal Permission Profiles - Delete',
				'SECPROFILEEDIT': 'Principal Permission Profiles - Edit',
				'SECPROFILEASSOCIATE': 'Principal Permission Profiles - Associate',
				'SECORGPROFILEVIEW': 'Org User Permission Profiles - View',
				'SECORGPROFILEADD': 'Org User Permission Profiles - Add',
				'SECORGPROFILEDELETE': 'Org User Permission Profiles - Delete',
				'SECORGPROFILEEDIT': 'Org User Permission Profiles - Edit',
				'SECINSTVISVIEW': 'School Visibility Profiles - View',
				'SECINSTVISADD': 'School Visibility Profiles - Add',
				'SECINSTVISDELETE': 'School Visibility Profiles - Delete',
				'SECINSTVISEDIT': 'School Visibility Profiles - Edit',
				'SECINSTVISASSOCIATE': 'School Visibility Profiles - Associate',
				'SECPINRESET': 'Pins - Reset/Change',
				'SECPINEXPIRE': 'Pins - Expire',
				'SECPINVIEW': 'Pins - View',
				'SECSSNVIEW': 'Identifier Fields - View',
				'SECCAMPUSUSERVIEW': 'Campus Users - View',
				'SECCAMPUSUSERADD': 'Campus Users - Add',
				'SECCAMPUSUSEREDIT': 'Campus Users - Edit',
				'SECCAMPUSUSERDELETE': 'Campus Users - Delete',
				'SECMULTIORGUSERVIEW': 'Users - View',
				'SECMULTIORGUSERADD': 'Users - Add',
				'SECMULTIORGUSERDEL': 'Users - Delete',
				'SECMULTIORGUSEREDIT': 'Users - Edit',
				'SECMOPROFILEVIEW': 'User Profile - View',
				'SECMOPROFILEADD': 'User Profile - Add',
				'SECMOPROFILEDELETE': 'User Profile - Delete',
				'SECMOPROFILEEDIT': 'User Profile - Edit',
				'SECAUTOLOGIN': 'Show Navigator Login Links',
				'SECAPRVPROFILEVIEW': 'Approver Profile - View',
				'SECAPRVPROFILEADD': 'Approver Profile - Add',
				'SECAPRVPROFILEDELETE': 'Approver Profile - Delete',
				'SECAPRVPROFILEEDIT': 'Approver Profile - Edit',
				'SECWORKERTYPEVISVIEW': 'Employee Visibility Profile - View',
				'SECWORKERTYPEVISADD': 'Employee Visibility Profile - Add',
				'SECWORKERTYPEVISDELE': 'Employee Visibility Profile - Delete',
				'SECWORKERTYPEVISEDIT': 'Employee Visibility Profile - Edit',
				'LASTLOGIN': 'View Last Login Info',
				'LOGINIP': 'View Login IP Address'
			}
		},
		'EXTRACT'   : {
			title: 'Data - Import/Extract',
			items: {
				'Payroll EXTRACT': 'Payroll Extract - Execute',
				'EXTIMPORTDATA': 'Import - Import Data',
				'EXTIMPORTSTATUSVIEW': 'Import - View Import Status (other imports)',
				'EXTTIMESHEET': 'Extract - TimeSheet Data'
			}
		},
		'RPTABS'    : {
			title: 'Absence Header Reports',
			items: {
				'ABSDAILY': 'Daily Report',
				'ADVNOTICE': 'Absence Advance Notice',
				'ABSSUMMARY': 'Absence Monthly Summary',
				'ABSCALLHIST': 'Absence Call History',
				'ABSDOWANAL': 'Day Of Week Absence Analysis',
				'ABSAPPROVAL': 'Absence Reconciliation',
				'ABSUNFILLED': 'Unfilled Absences',
				'ABSASSIGNMENT': 'Assignment Report',
				'ABSENTPERCENT': 'Absence Reason Percentages',
				'ABSENTBYINST': 'Absence Reasons By School',
				'SUBSIGNIN': 'Substitute Sign In',
				'ABSABSENTEE': 'Absentee Report',
				'APPROVALSTATUS': 'Absence Approval',
				'ABSINTERACTIVE': 'Absence Interactive',
				'CANCELEDABSRS': 'Cancelled Closed Absences',
				'FEEDBACK': 'Absence Feedback',
				'ABSEXTRACT': 'Absence Extraction',
				'ABSPERFATTND': 'Perfect Attendance Report'
			}
		},
		'RPTEMP'    : {
			title: 'Employee Reports',
			items: {
				'EMPENTBALSUM': 'Entitlement Balances Summary',
				'EMPENTBALDET': 'Entitlement Balances Details',
				'EMPREG': 'Worker Register Report',
				'EMPQUALSUBS': 'Qualified Subs Report',
				'EMPABSHISTORY': 'Worker Absence History',
				'EMPFESKILLS': 'Worker Fulfillment Skills',
				'EMPITINWORK': 'Multi-Room Worker Report',
				'LETTERHISTORY': 'Communications to Worker'
			}
		},
		'RPTSUB'    : {
			title: 'Substitute Reports',
			items: {
				'SUBAVAILABILITY': 'Substitute Availability Report',
				'SUBHISTBYDATE': 'History by Date Report',
				'SUBMOSTCALLED': 'Most Called Report',
				'SUBREG': 'Substitute Register Report',
				'SUBSKILLS': 'Skills Report',
				'SUBEXCLUDED': 'Excluded Substitutes Report',
				'SUBFULFILLHISTORY': 'Fulfillment History Report',
				'SUBAVAILJOBS': 'Available Jobs Report',
				'SUBPERFORMANCE': 'Performance Report',
				'SUBJOBVISHIERARCHY': 'Job Visibility Hierarchy Report',
				'SUBMULTIPLE': 'Substitutes in Multiple Districts',
				'SUBINSTPREF': 'Preferred School Report',
				'TIMESHEETS': 'Timesheet History',
				'SUBNONWORKING': 'Non-Working Substitutes',
				'LETTERHISTORY': 'Communications to Substitute',
				'SUBASSGNSUM': 'Assignment Summary',
				'RESTCALLTIME': 'Restricted Call Time',
				'SUBUTIL': 'Substitute Utilization',
				'SUBCANCEL': 'Substitute Cancellation'
			}
		},
		'RPTREC'    : {
			title: 'Recording Reports',
			items: {
				'RECSCHOOLNAMES': 'School Names and Entitlement Types',
				'RECEMPNAMES': 'Worker Names and Titles',
				'RECSUBNAMES': 'Substitute Names'
			}
		},
		'RPTMISC'   : {
			title: 'Miscellaneous Reports',
			items: {
				'MISCWELCOME': 'Welcome Letters'
			}
		},
		'PREFLIST'  : {
			title: 'Preference Lists',
			items: {
				'VIEW': 'Sub Preference Lists - View',
				'EDIT': 'Sub Preference Lists - Edit',
				'EXCLUDE': 'Sub Preference Lists - Exclude',
				'COMMENTVIEW': 'Sub Preference List Comments - View',
				'COMMENTEDIT': 'Sub Preference List Comments - Edit'
			}
		},
		'RPTCUST'   : {
			title: 'Custom Reports',
			items: {
				'VIEWCUSTREPORTS': 'Custom Reports - View'
			}
		},
		'ABSRMLOC'  : {
			title: 'Absence Multi-Room',
			items: {
				'APPROVE': 'Absence Req. - Reconcile (if ALL Rooms NOT visible)',
				'ASSIGNSUB': 'Absence Req. - Assign Sub (if ALL Rooms NOT visible)',
				'DELETE': 'Absence Req. - Delete (if ALL Rooms NOT visible)',
				'REMOVESUB': 'Absence Req. - Remove Sub (if ALL Rooms NOT visible)',
				'HOLDPROCESSING': 'Absence Req. - Hold Processing (if ALL Rooms NOT visible)',
				'MULTISCHOOLABSENCES': 'Create Absences for Multiple Schools'
			}
		},
		'ABSRPAST'  : {
			title: 'Absence Past',
			items: {
				'APPROVE': 'Absence - Reconcile/Unreconcile (if Date in the past)',
				'ASSIGNSUB': 'Absence Req. - Assign Sub (if ANY days in the past)',
				'DELETE': 'Absence Req. - Delete (if ANY days in the past)',
				'REMOVESUB': 'Absence Req. - Remove Sub (if ANY days in the past)',
				'EDITABSR': 'Absence Req. - Edit (if ANY days in the past)',
				'EDITABS': 'Absence - Edit (if Date in the past)'
			}
		},
		'ABSR_TS'   : {
			title: 'Absence With TimeSheet Data',
			items: {
				'DELETEABSR': 'Absence Req. - Delete (if ANY days have timesheet data)',
				'DELETEABS': 'Absence - Delete (if Date has timesheet data)',
				'REMOVESUB': 'Absence Req. - Remove Sub (if ANY days have timesheet data)',
				'EDITABS': 'Absence - Edit (if Date has timesheet data)',
				'EDITABSR': 'Absence Req. - Edit (if ANY days have timesheet data)',
				'DELABSR_APP': 'Absence Req. - Delete (if ANY days have Approved timesheet data)',
				'DELABS_APP': 'Absence - Delete (if Date has Approved timesheet data)',
				'REMSUB_APP': 'Absence Req. - Remove Sub (if ANY days have Approved timesheet data)',
				'EDITABS_APP': 'Absence - Edit (if Date has Approved timesheet data)',
				'EDITABSR_APP': 'Absence Req. - Edit (if ANY days have Approved timesheet data)'
			}
		},
		'RPTTS'     : {
			title: 'Timesheet Reports',
			items: {
				'SUMMARY': 'Timesheet Summary Report',
				'OUTSTANDING': 'Timesheet Outstanding Report',
				'MARKPAPER': 'Can Mark Paper Time Sheet'
			}
		},
		'ABSREXTD'  : {
			title: 'Absence - Extracted',
			items: {
				'ASSIGNSUB': 'Absence Req. - Assign Sub (if ANY Absences have been extracted)',
				'DELETE': 'Absence Req. - Delete  (if Absences have been extracted)',
				'EDITABSR': 'Absence Req. - Edit  (if Absences have been extracted)',
				'RECONCILE': 'Absence Req. - Reconcile/Unreconcile   (if Absences have been extracted)',
				'REMOVESUB': 'Absence Req. - Remove Sub  (if ANY Absences have been extracted)'
			}
		},
		'ABSRAPPRD' : {
			title: 'Absence - Approved',
			items: {
				'DELETE': 'Absence Req. - Delete',
				'EDITABSR': 'Absence Req. - Edit'
			}
		},
		'ABSRAPPRVL': {
			title: 'Approve Absence',
			items: {
				'APPROVEDENY': 'Approve/Deny Absence Request',
				'DENYITEMS': 'Deny Specific days',
				'DENYASSIGNED': 'Deny future days after Absence request has been filled',
				'DENYPASTCUTOFF': 'Deny regardless of denial cutoff settings'
			}
		},
		'VACPROF'   : {
			title: 'Vacancy Profile',
			items: {
				'ADD': 'Vacancy Profile - Add',
				'DELETE': 'Vacancy Profile - Delete',
				'VACEDITCONFIG': 'Configuration - Edit',
				'VACVIEWCONFIG': 'Configuration - View',
				'VACEDITGENERAL': 'General Information - Edit',
				'VACVIEWGENERAL': 'General Information - View',
				'VACPROFILEPRIVEDIT': 'Vacancies Profile Private - Manage'
			}
		},
		'UPLOAD'    : {
			title: 'Upload Files',
			items: {
				'ABSR': 'Absence/Vacancy Files'
			}
		},
		'RPTWTYPES' : {
			title: 'Report Writer - Report Types',
			items: {
				'ABSENCE': 'Absence Data',
				'ENTT': 'Entitlement Data',
				'SUB': 'Substitute Data',
				'WORK': 'Worker Data',
				'SUBLETTER': 'Substitute Letter',
				'WORKLETTER': 'Worker Letter',
				'INST': 'School Information',
				'ENTTREF': 'Entitlement Type Reference Data',
				'WKT': 'Worker Type Reference Data',
				'ORGUSER': 'Organization/Campus User Data',
				'TIMESHEET': 'Time Sheet Information'
			}
		},
		'RPTWACCESS': {
			title: 'Report Writer - Access Level',
			items: {
				'CREATEPUBLIC': 'Create Public',
				'CREATEPUBLISHED': 'Create Published',
				'CREATEPRIVATE': 'Create Private',
				'VIEWPUBLIC': 'View Public',
				'VIEWPUBLISHED': 'View Published',
				'EDITPUBLIC': 'Edit Public',
				'LETTERWRITER': 'Letter Writer',
				'SCHEDULE': 'Schedule Reports',
				'DISTRIBUTE': 'Send to Distribution List',
				'VIEWLOCKED': 'View Locked'
			}
		},
		'DASHBOARD' : {
			title: 'Dashboard Configuration',
			items: {
				'CONFIGORG': 'Edit Global Dashboard Options',
				'CONFIGSELF': 'Edit My Dashboard Options'
			}
		},
		'WIDGETS'   : {
			title: 'Dashboard Widgets',
			items: {
				'DAILYABSCT': 'Daily Absence Counts',
				'WEEKLYABSCT': 'Weekly Absence Counts',
				'DAILYFILLRATE': 'Daily Fill Rate',
				'WEEKLYFILLRATE': 'Weekly Fill Rate',
				'DAILYABSRATE': 'Daily Absentee Rate',
				'WEEKLYABSRATE': 'Weekly Absentee Rate',
				'DAILYPCTSUB': 'Daily Percent Of Substitutes Working',
				'WEEKLYPCTSUB': 'Weekly Percent Of Substitutes Working',
				'CURRENTPCTABS': 'Current Percent Absent Chart'
			}
		},
		'CHGLOG'    : {
			title: 'Change Logs',
			items: {
				'CHGLOGVIEW': 'View Change Logs'
			}
		},
		'DISTLIST'  : {
			title: 'Distribution Lists',
			items: {
				'CREATE': 'Create',
				'EDIT': 'Edit',
				'DELETE': 'Delete'
			}
		},
		'VTOPTIONS' : {
			title: 'VeriTime',
			items: {
				'VIEW': 'View Clock Report',
				'EDIT': 'Edit Clock Report',
				'PAYROLL_LOCK': 'View Payroll Lock',
				'TIMESHEET_VIEW': 'Edit Timesheets',
				'TIMESHEET_EDIT': 'Edit Timesheets',
				'TIMESHEET_REVIEW_VIE': 'View Timesheet Review',
				'TIMESHEET_REVIEW_APP': 'Approve/Reject/Reset Timesheets',
				'PEOPLE_VIEW': 'View People Locator',
				'CHANGE_LOG_VIEW': 'View Change Log on Timesheet',
				'VIEW_WEB_CLOCK': 'View Web Clock Link',
				'VIEW_ADMIN_TIME': 'View Admin Time Entry',
				'VIEW_IP_RANGES': 'Edit IP Address Safelist',
				'VIEW_KIOSK_ADMIN': 'Edit Clock Kiosks',
				'VIEW_BARCODE': 'View Barcodes',
				'VIEW_PAYCODES': 'View Pay Codes',
				'VIEW_CLOCK_LOG': 'View Clock Log',
				'VIEW_CLOCK_EXCEPT': 'View Clock Exceptions',
				'VIEW_WORK_SUM': 'View Work Summary Report',
				'VIEW_WORK_DET': 'View Work Detail Report',
				'VIEW_SCHEDULES': 'View User Schedules',
				'EDIT_SCHEDULES': 'Edit User Schedules',
				'VIEW_ACCOUNTCODE': 'Edit Accounting Codes',
				'VIEW_CHANGELOGLINK': 'View Change Log (Master)',
				'VIEW_TAG_ADMIN': 'Edit Custom User Group',
				'VIEW_VISIBLITY': 'Edit Visibility Profiles',
				'VIEW_VIS_HIERARCHY': 'Edit Approval Workflow',
				'VIEW_TS_REJECT_REASO': 'Edit Time Reject Reasons',
				'VIEW_HRSUNITS_ADMIN': 'Edit Hours to Units',
				'VIEW_GENERALSEARCH': 'View Advanced Search',
				'VIEW_ORGSETTINGS': 'Edit General Settings',
				'VIEW_PAYPROFILES': 'View Payroll Profiles',
				'VIEW_EVENTTYPES': 'Edit Time Event Types',
				'VIEW_JOBTYPES': 'Edit Job Types',
				'CAN_APPROVE_ALL': 'TS Review - Approve All',
				'CAN_REJECT_ALL': 'TS Review - Reject All',
				'CAN_RESET_ALL_PENDIN': 'TS Review - Reset All to Pending',
				'CAN_RESET_ALL_SUBMIT': 'TS Review - Reset All to Submitted',
				'VIEW_JOBFAMILIES': 'Edit Job Families',
				'VIEW_SYSTEM_ACTIVITY': 'View System Activity',
				'VIEW_WORK_SCHEDULES': 'Edit Work Schedules',
				'VIEW_POSITIONS': 'Edit Positions',
				'VIEW_STAFF_GROUPS': 'Edit Staff Groups',
				'VIEW_MASTER_CAL': 'Edit Master Calendars',
				'VIEW_PAYROLL_REVIEW': 'View Payroll Review',
				'VIEW_WAGE_CODE_ASSN': 'Edit Leave & Wage Codes',
				'VIEW_SCHEDULE_SUMMAR': 'View Schedule Summary',
				'VIEW_WAGE_OPTIONS': 'Edit Wage Options',
				'VIEW_USER_SETTINGS': 'Edit Users',
				'VIEW_BALANCE_HISTORY': 'View Leave Balance History',
				'VIEW_BALANCE_SUMMARY': 'View Leave Balance',
				'CAN_UPDATE_BALANCE': 'Update Leave Balance',
				'VIEW_POSITION_SUMMAR': 'View Position Summary',
				'VIEW_WORK_SCH_ASSOC': 'View Work Schedule Association',
				'VIEW_STAFFGROUPASSOC': 'View Staff Group Association',
				'VIEW_WAGE_OPT_ASSOC': 'View Wage Option Association',
				'VIEW_HBQ_REPORT': 'View ACA Healthcare Report',
				'VIEW_STAFFGRPSUMMARY': 'View Staff Group Summary',
				'VIEW_VACANCYASSN': 'Edit Vacancy Allocations',
				'VIEW_WAGEOPTSUMMARY': 'View Wage Option Summary',
				'VIEW_ADMINSETTINGS': 'Edit Administrators',
				'V_ACCOUNTCODE': 'View Accounting Codes',
				'V_ADMINSETTINGS': 'View Administrators',
				'V_EVENTTYPES': 'View Time Event Types',
				'V_HRSUNITS_ADMIN': 'View Hours To Units',
				'V_IP_RANGES': 'View IP Address Safelist',
				'V_JOBFAMILIES': 'View Job Families',
				'V_JOBTYPES': 'View Job Types',
				'V_KIOSK_ADMIN': 'View Clock Kiosks',
				'V_MASTER_CAL': 'View Master Calendars',
				'V_ORGSETTINGS': 'View General Settings',
				'V_POSITIONS': 'View Positions',
				'V_STAFF_GROUPS': 'View Staff Groups',
				'V_TAG_ADMIN': 'View Custom User Group',
				'V_TS_REJECT_REASO': 'View Time Reject Reasons',
				'V_USER_SETTINGS': 'View Users',
				'V_VACANCYASSN': 'View Vacancy Allocations',
				'V_VIS_HIERARCHY': 'View Approval Workflow',
				'V_VISIBLITY': 'View Visibility Profiles',
				'V_WAGE_CODE_ASSN': 'View Leave & Wage Codes',
				'V_WAGE_OPTIONS': 'View Wage Options',
				'V_WORK_SCHEDULES': 'View Work Schedules',
				'APPROVE_SELECT_TS': 'TS Review - Approve Selected',
				'REJECT_SELECT_TS': 'TS Review - Reject Selected',
				'RESET_SEL_TS_2_SUBM': 'TS Review - Reset Selected to Submitted',
				'RESET_SEL_TS_2_PEND': 'TS Review - Reset Selected to Pending',
				'APPR_NON_REJECT_TS': 'TS Review - Approval All Non-Rejected',
				'REJECT_NON_APPR_TS': 'TS Review - Reject All Non-Approved',
				'V_TIMESHEET': 'View Timesheets',
				'USERPROFILE_VIEW': 'View User Templates',
				'USERPROFILE_EDIT': 'Edit User Templates',
				'USERPROFILEASSO_VIEW': 'View User Template Association',
				'USERPROFILESUM_VIEW': 'View User Template Summary',
				'E_ROUNDING_RULES': 'Edit Rounding Rules',
				'V_ROUNDING_RULES': 'View Rounding Rules',
				'VIEW_ROUND_SUMMARY': 'View Rounding Rule Summary',
				'V_ACCOUNTALLOCATION': 'View Account Allocations',
				'E_ACCOUNTALLOCATION': 'Edit Account Allocations',
				'V_TAGASSOC': 'View Custom User Group Association',
				'E_TAGASSOC': 'Edit Custom User Group Association',
				'E_POSONUSERSETTINGS': 'Edit Positions on User Settings',
				'V_ADMIN_VISIBILITIES': 'View Visibilities for an Administrator',
				'VIEWAPPROVALCHAIN': 'View User Approval Chain',
				'VIEWVPROFILESUMMARY': 'View Visibility Profile Summary',
				'V_PAY_PERIOD_GROUPS': 'View Pay Period Admin',
				'C_PAY_PERIOD_GROUPS': 'Create Pay Period Groups',
				'E_PAY_PERIOD_GROUPS': 'Edit Pay Period Groups',
				'D_PAY_PERIOD_GROUPS': 'Delete Pay Period Groups',
				'V_MY_USERS_REPORT': 'View My Users Report',
				'V_USERS_GRID': 'View Users Admin',
				'V_MISSINGAPPROVERS': 'View Missing Approvers',
				'V_ORPHANED_TIMESHEET': 'View Orphaned Timesheets Report',
				'V_TCE_COMMENT': 'View Time Event Comments',
				'E_TCE_COMMENT': 'Edit Time Event Comments'
			}
		},
		'ABSRFeedBk': {
			title: 'Absence Feedback',
			items: {
				'ADDSUBEXPFEEDBACK': 'Add Substitute Experience Feedback',
				'VIEWSUBEXPFEEDBACK': 'View Substitute Experience Feedback',
				'EDITSUBEXPFEEDBACK': 'Edit Substitute Experience Feedback',
				'VIEWSUBPERFSCORE': 'View Substitute Feedback Score',
				'VIEWFEEDBACK': 'View Substitute Performance Feedback',
				'ADDFEEDBACK': 'Add Substitute Performance Feedback',
				'EDITFEEDBACK': 'Edit Substitute Performance Feedback'
			}
		}
	});
	// #--- END Value (allPermissionsVal) ---# //
	// #-------------------------------------# //

}());