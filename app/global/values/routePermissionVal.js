(function () {
	'use strict'; var app = angular.module('aesop');


	// #--------------------------------------# //
	// #----- Value (routePermissionVal) -----# //
	app.factory('routePermissionVal', function (regexHelp, idmAvailableSvc, featureSvc, userSvc, orgSvc) {

		return [



			// ==================================== //
			// ==         Navigator Dashboard    == //
			// ==================================== //
			{
				matcher: /^\/navigator/i,
				permission: '!PSEUDO.ISCAMPUSUSER'
			}, { // => /navigator classic homepage
				matcher: /^\/navigator\/nav_default.asp/i,
				permission: 'PSEUDO.HasNavDashboard'
			}, { // => /navigator dashboard
				matcher: /^\/navigator\/Dashboard.aspx/i,
				permission: 'PSEUDO.HasNavDashboard'
			}, { // => /navigator training and ref materials
				matcher: new RegExp(regexHelp.escapeString(window.siteConfig.learningCenter)),
				permission: function (have) { return have('MISC.Help') && have('!PSEUDO.ISCAMPUSUSER') && !featureSvc.get("Zendesk").enabled }
			}, { // => /navigator global dashboard options
				matcher: /^\/navigator\/DashboardCatalog.aspx/i,
				permission: 'PSEUDO.HasNavDashboard'
			}, { // => /navigator my dashboard options
				matcher: /^\/navigator\/DashboardCatalog.aspx/i,
				permission: 'PSEUDO.HasNavDashboard'
			},

			// ==================================== //
			// ==         ABSENCE ROUTES         == //
			// ==================================== //

			{ // => /abs-mgt/absences/create-absence
				matcher: /^\/abs-mgt\/absences\/create-absence/i,
				permission: 'ABSR.Create'
			}, { // => /abs-mgt/absences/create-vacancy
				matcher: /^\/abs-mgt\/absences\/create-vacancy/i,
				permission: function (have) { return have('ABSR.VACANCY') && have('ABSR.VACANCYEDIT') && have('PSEUDO.UsesVacancies') && have('ABSR.Create'); }
			}, { // => /abs-mgt/absences/approve
				matcher: /^\/abs-mgt\/absences\/approve/i,
				permission: 'ABSRAPPRVL.ApproveDeny'
			}, { // => /abs-mgt/absences/reconcile
				matcher: /^\/abs-mgt\/absences\/reconcile/i,
				permission: 'ABSR.Approve'
			}, { // => /abs-mgt/absences/modify
				matcher: /^\/navigator\/abs_list.asp/i,
				permission: 'ABSR.Display'
			}, { // => /abs-mgt/absences/create-absence#sidekick
				matcher: /^\/abs-mgt\/absences\/create-absence#sidekick/i,
				permission: function (have) { return featureSvc.get("SideKickMenuCreateAbsenceFindEmpFindSub").enabled && have('ABSR.Create'); }
			},

			// ============================================== //
			// ==        SUBSTITUTE ABSENCE ROUTES         == //
			// ============================================== //
			{ 	// => /abs-mgt/absences/create-absence
				matcher: /^\/abs-mgt\/substitute-absences\/create-substitute-absence/i,
				permission: 'SUBABS.CREATE'
			}, { // => /abs-mgt/substitute-absences/detail/{123123}/view
				matcher: /^\/abs-mgt\/substitute-absences\/detail\/(\d+)\/view/i,
				permission: 'SUBABS.DISPLAY'
			}, { // => /abs-mgt/substitute-absences/detail/{123123}/edit
				matcher: /^\/abs-mgt\/substitute-absences\/detail\/(\d+)\/edit/i,
				permission: 'SUBABS.EDIT'
			},

			// ==================================== //
			// ==         Find Employee          == //
			// ==================================== //
			{ // /search/search?searchFor=&searchType=2
				matcher: /^\/search\/search\?searchFor\=\&searchType\=2/i,
				permission: function (have) {
					return featureSvc.get("AngularGlobalSearchFilter").enabled && have('EMP.EmpViewGeneral') && featureSvc.get("SideKickMenuCreateAbsenceFindEmpFindSub").enabled;
				}
			},

			// ==================================== //
			// ==         Find Substitute        == //
			// ==================================== //
			{ // /search/search?searchFor=&searchType=3
				matcher: /^\/search\/search\?searchFor\=\&searchType\=3/i,
				permission: function (have) {
					return featureSvc.get("AngularGlobalSearchFilter").enabled && have('SUB.SubViewGeneral') && featureSvc.get("SideKickMenuCreateAbsenceFindEmpFindSub").enabled;
				}
			},

			// ==================================== //
			// ==         Master Data ROUTES        == //
			// ==================================== //

			//org info

			{ // => /navigator master data org  org info
				matcher: /^\/navigator\/org_general.asp/i,
				permission: 'ORG.OrgViewGeneral'
			}, { // => /navigator master data org contact settings
				matcher: /^\/navigator\/org_contact.asp/i,
				permission: 'ORG.OrgViewGeneral'
			}, { // => /navigator master data org school dates
				matcher: /^\/navigator\/org_schooldates.asp/i,
				permission: 'ORG.OrgViewGeneral'
			}, { // => /navigator master data org call times
				matcher: /^\/navigator\/org_calltimes.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org absvac settings
				matcher: /^\/navigator\/org_dayinadvance.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org Shift_Types
				matcher: /^\/navigator\/org_absence.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org District_Work_Schedule
				matcher: /^\/navigator\/org_workschedule.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org Permanent_Substitutes
				matcher: /^\/navigator\/org_PermSubSettings.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org AbsVac_Feedback
				matcher: /^\/navigator\/org_feedback.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data orgAbsVac_Feedback_Questions
				matcher: /^\/navigator\/org_feedbackquestions.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.ViewFeedbackQs'); }
			}, { // => /navigator master data org Miscellaneous
				matcher: /^\/navigator\/org_OtherSettings.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org Time_Sheets
				matcher: /^\/navigator\/org_TimeSheetSettings.asp/i,
				permission: function (have) { return have('PSEUDO.HASWEBTIME') && have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org School_Closings
				matcher: /^\/navigator\/org_calendar.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewCal'); }
			}, { // => /navigator master data org Web_Alerts
				matcher: /^\/navigator\/org_webAlerts.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewAlert'); }
			}, { // => /navigator master data org Absence_Approval_Settings
				matcher: /^\/navigator\/org_ApprovalSettings.asp/i,
				permission: 'ORG.orgViewConfig'
			}, { // => /navigator master data org Daily_Limits
				matcher: /^\/navigator\/org_DailyLimit.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org Substitute_Call_Time_Disclaimer
				matcher: /^\/navigator\/org_subCallTimeDisclaimer.asp/i,
				permission: function (have) { return have('ORG.OrgViewGeneral') && have('ORG.OrgViewConfig'); }
			}, { // => /navigator master data org AbsVac_Files
				matcher: /^\/navigator\/org_absrattachments.asp/i,
				permission: 'PSEUDO.OrgAbsrUploads'
			}, { // => /navigator master data org Set_Visibility_Settings
				matcher: /^\/navigator\/org_visibilitySettings.asp/i,
				permission: function (have) { return have('INST.INSTEDITCONFIG') && have('ORG.OrgViewConfig') && have('EMP.EMPEDITCONFIG'); }
			},

			//school

			{ // => /navigator master data school add
				matcher: /^\/navigator\/s_general.asp.*add=true/i,
				permission: function (have) { return have('INST.INSTAdd') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school General_Information
				matcher: /^\/navigator\/s_general.asp/i,
				permission: 'INST.INSTViewGeneral'
			}, { // => /navigator master data school Address
				matcher: /^\/navigator\/s_address.asp/i,
				permission: 'INST.INSTViewGeneral'
			}, { // => /navigator master data school Permanent_Substitutes
				matcher: /^\/navigator\/s_permsub.asp/i,
				permission: function (have) { return have('INST.InstPermSub') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school AbsenceReasons
				matcher: /^\/navigator\/s_entitlements.asp/i,
				permission: function (have) { return have('EMP.EmpViewEntitlements') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school Preferred_Substitutes
				matcher: /^\/navigator\/s_sub.asp/i,
				permission: function (have) { return have('PREFLIST.View') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school SubAvailability
				matcher: /^\/navigator\/s_sub_availability.asp/i,
				permission: function (have) { return have('RPTSUB.SubAvailability') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school Staff List
				matcher: /^\/navigator\/s_displayWorker.asp/i,
				permission: function (have) { return have('RPTEMP.EmpReg') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school Timesheet_Approvers
				matcher: /^\/navigator\/s_timeapprovers.asp/i,
				permission: function (have) { return have('INST.ViewApprovers') && have('INST.INSTViewGeneral') && have('PSEUDO.HASWEBTIME') && have('!PSEUDO.AutoGenerateTimeSheets'); }
			}, { // => /navigator master data school Timesheet_Settings
				matcher: /^\/navigator\/s_timesheetsettings.asp/i,
				permission: function (have) { return have('INST.INSTViewCONFIG') && have('INST.INSTViewGeneral') && have('PSEUDO.HASWEBTIME'); }
			}, { // => /navigator master data school abs vac files
				matcher: /^\/navigator\/s_absrattachments.asp/i,
				permission: function (have) { return have('INST.ABSR') && have('PSEUDO.OrgAbsrUploads'); }
			}, { // => /navigator master data school Change_Log
				matcher: /^\/navigator\/s_changelog.asp/i,
				permission: function (have) { return have('CHGLOG.ChgLogView') && have('INST.INSTViewGeneral'); }
			}, { // => /navigator master data school Login_History
				matcher: /^\/navigator\/s_LoginHistory.asp/i,
				permission: function (have) { return have('INST.LoginHistory') && have('INST.INSTViewGeneral') && have('PSEUDO.TrackLogins'); }
			},

			//worker

			{ // => /navigator master data worker add
				matcher: /^\/navigator\/te_general.asp.*add=true/i,
				permission: function (have) {
					var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
					var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
					var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM; //Parent bypass setting
					var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
					return have('EMP.EMPAdd') && have('EMP.EmpViewGeneral') && ((isSSDEnabled && allowPartnerOUtoBypassCHCM && canAdminBypassCHCM) || !(isSSDEnabled || isERPEnabled));
				}
			}, { // => /navigator master data worker Add In Global Directory
				matcher: /.*-employee/i,
				permission: function (have) {
					var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
					var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
					var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM; //Parent bypass setting
					var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
					return have('EMP.EMPAdd') && have('EMP.EmpViewGeneral') && ((isSSDEnabled && allowPartnerOUtoBypassCHCM && !canAdminBypassCHCM) || (isSSDEnabled && !allowPartnerOUtoBypassCHCM) || (!isSSDEnabled && isERPEnabled));
				}
			}, { // => /navigator master data worker General_Information
				matcher: /^\/navigator\/te_general.asp/i,
				permission: 'EMP.EmpViewGeneral'
			}, { // => /navigator master data worker Address
				matcher: /^\/navigator\/te_address.asp/i,
				permission: function (have) { return have('EMP.EmpViewGeneral') && !(featureSvc.get("at_adopt_orgperson_erp").enabled || featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled); }
			}, { // => /navigator master data worker Permission
				matcher: /^\/navigator\/te_perms.asp/i,
				permission: function (have) { return have('EMP.EmpViewPermissions') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker Skills
				matcher: /^\/navigator\/te_skills.asp/i,
				permission: function (have) { return have('EMP.EmpViewConfig') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker Absence_History
				matcher: /^\/navigator\/te_displayAbsence.asp/i,
				permission: function (have) { return have('RPTEMP.EmpAbsHistory') && have('RPTEMP.EmpQualSubs') && have('CHGLOG.ChgLogView'); }
			}, { // => /navigator master data worker Preferred_Substitutes
				matcher: /^\/navigator\/te_sub.asp/i,
				permission: function (have) { return have('PREFLIST.View') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker Qualified_Substitutes
				matcher: /^\/navigator\/te_qualifiedSubs.asp/i,
				permission: function (have) { return have('RPTEMP.EmpQualSubs') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker Communications_to_Employee
				matcher: /^\/navigator\/te_letterhistory.asp/i,
				permission: function (have) { return have('RPTEMP.LetterHistory') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker AbsenceReasons
				matcher: /^\/navigator\/te_entitlements.asp/i,
				permission: function (have) { return have('EMP.EmpViewEntitlements') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker AbsVac_Files
				matcher: /^\/navigator\/te_absrattachments.asp#AbsenceFiles/i,
				permission: function (have) { return have('EMP.EmpViewConfig') && have('EMP.EmpViewGeneral') && have('PSEUDO.OrgAbsrUploads') && !(have('ABSR.VACANCYEDIT') || have('ABSR.VACANCY')); }
			}, { // => /navigator master data worker AbsVac_Files
				matcher: /^\/navigator\/te_absrattachments.asp$/i,
				permission: function (have) { return have('EMP.EmpViewConfig') && have('EMP.EmpViewGeneral') && have('PSEUDO.OrgAbsrUploads') && (have('ABSR.VACANCYEDIT') || have('ABSR.VACANCY')); }
			}, { // => /navigator master data worker Allocation_Groups
				matcher: /^\/navigator\/te_AllocationGroups.asp/i,
				permission: function (have) { return have('EMP.EmpViewGeneral') && have('INST.INSTViewGeneral') && have('PSEUDO.ShowAllocationGroups'); }
			}, { // => /navigator master data worker Change_Log
				matcher: /^\/navigator\/te_ChangeLog.asp/i,
				permission: function (have) { return have('CHGLOG.ChgLogView') && have('EMP.EmpViewGeneral'); }
			}, { // => /navigator master data worker Login_History
				matcher: /^\/navigator\/te_LoginHistory.asp/i,
				permission: function (have) { return have('EMP.LoginHistory') && have('EMP.EmpViewGeneral') && have('PSEUDO.TrackLogins'); }
			},

			//vacancy profile

			{ // => /navigator master data vacancy profile add
				matcher: /^\/navigator\/vp_general.asp.*add=true/i,
				permission: function (have) { return have('VACPROF.Add') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies'); }
			}, { // => /navigator master data vacancy profile General_Information
				matcher: /^\/navigator\/vp_general.asp/i,
				permission: function (have) { return have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies'); }
			}, { // => /navigator master data vacancy profile Skills
				matcher: /^\/navigator\/vp_skills.asp/i,
				permission: function (have) { return have('VACPROF.VacViewConfig') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies'); }
			}, { // => /navigator master data vacancy profile Preferred_Substitutes
				matcher: /^\/navigator\/sub_pref.asp/i,
				permission: function (have) { return have('VACPROF.VacViewConfig') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies'); }
			}, { // => /navigator master data vacancy profile Qualified_Substitutes
				matcher: /^\/navigator\/vp_qualifiedSubs.asp/i,
				permission: function (have) { return have('RPTEMP.EmpQualSubs') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies'); }
			}, { // => /navigator master data vacancy profile AbsVac_Files
				matcher: /^\/navigator\/vp_absrattachments.asp#AbsenceFiles/i,
				permission: function (have) { return have('VACPROF.VacViewConfig') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies') && have('PSEUDO.OrgAbsrUploads') && !(have('ABSR.VACANCYEDIT') || have('ABSR.VACANCY')); }
			}, { // => /navigator master data vacancy profile AbsVac_Files
				matcher: /^\/navigator\/vp_absrattachments.asp$/i,
				permission: function (have) { return have('VACPROF.VacViewConfig') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies') && have('PSEUDO.OrgAbsrUploads') && (have('ABSR.VACANCYEDIT') || have('ABSR.VACANCY')); }
			}, { // => /navigator master data vacancy profile Allocation_Groups
				matcher: /^\/navigator\/vp_AllocationGroups.asp/i,
				permission: function (have) { return have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies') && orgSvc.getOrgData()[0].settings.showAllocationGroups; }
			}, { // => /navigator master data vacancy profile Change_Log
				matcher: /^\/navigator\/vp_ChangeLog.asp/i,
				permission: function (have) { return have('CHGLOG.ChgLogView') && have('VACPROF.VacViewGeneral') && have('PSEUDO.UsesVacancies'); }
			}, { // => /navigator master data vacancy profile Absence_History 
				matcher: /^\/navigator\/vp_displayAbsence.asp/i,
				permission: (have) => { return have("RPTEMP.EmpAbsHistory") && have("VACPROF.VacViewGeneral") && featureSvc.get("ReactMasterDataVacancyProfileForOU").enabled }
			}, { // => /navigator master data vacancy profile Preferred substitutes
				matcher: /^\/navigator\/vp_sub.asp/i,
				permission: (have) => { return have("VACPROF.VacViewGeneral") && have('PSEUDO.UsesVacancies'); }
			},

			//substitute

			{ // => /navigator master data substitute add
				matcher: /^\/navigator\/sub_general.asp.*add=true/i,
				permission: function (have) {
					var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
					var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
					var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM;
					var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : false; //Extended bypass setting is merged with parent bypass setting
					return have('SUB.SubViewGeneral') && have('SUB.SubAdd') && !have('PSEUDO.IsVeritimeOnly') && (!(isSSDEnabled || isERPEnabled) || (isSSDEnabled && allowPartnerOUtoBypassCHCM && canAdminBypassCHCM));
				}
			}, { // => /navigator master data substitute Add In Global Directory
				matcher: /fc-directory/i,
				permission: function (have) {
					var isSSDEnabled = featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled;
					var isERPEnabled = featureSvc.get("at_adopt_orgperson_erp").enabled;
					var allowPartnerOUtoBypassCHCM = orgSvc.getOrgData()[0].settings.AllowPartnerOUtoBypassCHCM; //Parent bypass setting
					var canAdminBypassCHCM = allowPartnerOUtoBypassCHCM ? userSvc.getUserData().canByPassCHCM : userSvc.isMOPUser(); //Extended bypass setting is merged with parent bypass setting
					return have('SUB.SubViewGeneral') && have('SUB.SubAdd') && !have('PSEUDO.IsVeritimeOnly') && ((isSSDEnabled && allowPartnerOUtoBypassCHCM && !canAdminBypassCHCM) || (isSSDEnabled && !allowPartnerOUtoBypassCHCM) || (!isSSDEnabled && isERPEnabled));
				}
			}, { // => /navigator master data substitute General_Information
				matcher: /^\/navigator\/sub_general.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Address
				matcher: /^\/navigator\/sub_address.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && !have('PSEUDO.IsVeritimeOnly') && !(featureSvc.get("at_adopt_orgperson_erp").enabled || featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled); }
			}, { // => /navigator master data substitute Permissions
				matcher: /^\/navigator\/sub_perms.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('SUB.SubViewPermissions') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Skills
				matcher: /^\/navigator\/sub_skills.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('SUB.SubViewConfig') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Prreferred Schools
				matcher: /^\/navigator\/sub_instpref.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('SUB.ViewLocLists') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Non work day
				matcher: /^\/navigator\/sub_displayDataSchedule.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('SUB.SubSched') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Call times
				matcher: /^\/navigator\/sub_displayDataCall.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('SUB.SubSched') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Fulfillment history
				matcher: /^\/navigator\/sub_displayDataAbsence.asp\?TB5\=TAB9\&TB1\=TAB5/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('RPTSUB.SubFulfillHistory') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Available Jobs
				matcher: /^\/navigator\/sub_displayJobs.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('RPTSUB.SubAvailJobs') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Performance
				matcher: /^\/navigator\/sub_performance.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('RPTSUB.SubPerformance') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Visibility Hierarchy
				matcher: /^\/navigator\/sub_visibilityHierarchy.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('RPTSUB.SubJobVisHierarchy') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute School Preferred_Substitutes
				matcher: /^\/navigator\/sub_pref.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('PREFLIST.View') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Employee Preferred_Substitutes
				matcher: /^\/navigator\/sub_workerPref.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('PREFLIST.View') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Communication to subs
				matcher: /^\/navigator\/sub_letterHistory.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('RPTSUB.LetterHistory') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute timesheet history
				matcher: /^\/navigator\/sub_tsHistory.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('RPTSUB.Timesheets') && have('PSEUDO.HASWEBTIME') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Change_Log
				matcher: /^\/navigator\/sub_changeLog.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('CHGLOG.ChgLogView') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute Login history
				matcher: /^\/navigator\/sub_LoginHistory.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && have('SUB.LoginHistory') && have('PSEUDO.TrackLogins') && !have('PSEUDO.IsVeritimeOnly'); }
			}, { // => /navigator master data substitute call history
				matcher: /^\/navigator\/sub_CallHistory.asp/i,
				permission: function (have) { return have('SUB.SubViewGeneral') && !have('PSEUDO.IsVeritimeOnly'); }
			},

			// ===================================== //
			// ==      Reference Data ROUTES      == //
			// ===================================== //

			{ // => /navigator reference data WorkerTypeGeneric_plural
				matcher: /^\/navigator\/tableEdit.asp\?table\=worker_type/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /navigator reference data Entitlement
				matcher: /^\/navigator\/ref_enttlist.asp/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /navigator reference data Vacancy Reasons
				matcher: /^\/navigator\/ref_vacReasonList.asp/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /navigator reference data Skills
				matcher: /^\/navigator\/tableEdit.asp\?table\=skills/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /navigator reference data Budget_Codes
				matcher: /^\/navigator\/tableEdit.asp\?table\=budget_code/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /navigator reference data Pay_Codes
				matcher: /^\/navigator\/tableEdit.asp\?table\=pay_code/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /navigator reference data Accounting__Codes
				matcher: /^\/navigator\/tableEdit.asp\?table\=accounting_code/i,
				permission: function (have) { return have('REFDATA.RefDataView') && orgSvc.getOrgData()[0].settings.ShowAccountingCode; }
			}, { // => /navigator reference data Allocation_Groups
				matcher: /^\/navigator\/allocationGroups.asp/i,
				permission: function (have) { return have('REFDATA.RefDataView') && orgSvc.getOrgData()[0].settings.showAllocationGroups; }
			}, { // => /navigator reference data Distribution_Lists
				matcher: /^\/navigator\/distributionlists.asp/i,
				permission: function (have) { return have('REFDATA.RefDataView'); }
			}, { // => /navigator reference data Ethnicity
				matcher: /^\/navigator\/tableEdit.asp\?table\=ethnicity/i,
				permission: function (have) { return have('REFDATA.RefDataView') && !(featureSvc.get("at_adopt_orgperson_erp").enabled || featureSvc.get("at_adopt_org_person").enabled || featureSvc.get("global_fc_shared_employee").enabled); }
			}, { // => /navigator reference data Timesheet_Rejection_Reasons
				matcher: /^\/navigator\/tableEdit.asp\?table\=timesheet_rejectreason/i,
				permission: function (have) { return have('REFDATA.RefDataView') && have('PSEUDO.HASWEBTIME'); }
			}, { // => /navigator reference data Substitute Cancellation Reasons page
				matcher: /^\/navigator\/substitutecancellationreasons.asp/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /Angular reference data Substitute Cancellation Reasons page
				matcher: /^\/reference-data\/substitute-cancellation-reasons/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /Angular reference data Absence Reasons page
				matcher: /^\/reference-data\/absence-reasons/i,
				permission: 'REFDATA.RefDataView'
			}, { // => /Angular reference data Absence Reasons page
				matcher: /^\/reference-data\/absence-reasons\/new/i,
				permission: 'REFDATA.RefDataAdd'
			},

			// ===================================== //
			// ==      Security ROUTES            == //
			// ===================================== //

			{ // => /navigator security Organization_Users
				matcher: /^\/navigator\/ou_select.asp\?p_usertype\=0/i,
				permission: 'SECURITY.SecOrguserView'
			}, { // => /navigator security Organization_User_Profiles
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=0/i,
				permission: 'SECURITY.SecOrgProfileView'
			}, { // => /navigator security School_Visibility
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=2/i,
				permission: 'SECURITY.SecInstVisView'
			}, { // => /navigator security Employee_Type_Visibility
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=3/i,
				permission: 'SECURITY.SecWorkerTypeVisView'
			}, { // => /navigator security principalProfile_plural
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=1/i,
				permission: function (have) { return have('SECURITY.SecProfileView') && have('SECURITY.SecCampususerView') && have('SECURITY.SecWorkerTypeVisView'); }
			}, { // => /navigator security CampusUser_plural
				matcher: /^\/navigator\/cu_select.asp\?ppt\=1/i,
				permission: 'SECURITY.SecCampususerView'
			}, { // => /navigator security School_Visibility
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=2/i,
				permission: 'SECURITY.SecInstVisView'
			}, { // => /navigator security Employee_Type_Visibility
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=3/i,
				permission: 'SECURITY.SecWorkerTypeVisView'
			}, { // => /navigator security Approver_Profiles
				matcher: /^\/navigator\/p_profilesList.asp\?ppt\=99/i,
				permission: function (have) { return have('SECURITY.SecAprvProfileView') && have('PSEUDO.UsesAbsenceApproval'); }
			}, {
				matcher: /^\/security\/user-access/i,
				permission: function (have) {
					var iHave = idmAvailableSvc.IDMAvailable() && idmAvailableSvc.IDMIsIdentityProvider() && have('SECURITY.ACCESSSTATUSVIEW') && !have('PSEUDO.ISCAMPUSUSER');
					return iHave;
				},
				hidden: function (have) {
					return featureSvc.get("SharedAppAccess").enabled;
				}
			}, {
				matcher: /absmgmt-useraccess/i,
				permission: function (have) {
					var iHave = idmAvailableSvc.IDMAvailable() && idmAvailableSvc.IDMIsIdentityProvider() && have('SECURITY.ACCESSSTATUSVIEW') && !have('PSEUDO.ISCAMPUSUSER') && featureSvc.get("SharedAppAccess").enabled;
					return iHave;
				}
			},


			// ===================================== //
			// ==      Extract  ROUTES            == //
			// ===================================== //

			{ // => /navigator extract Extract_Data
				matcher: /^\/navigator\/extract_data.asp/i,
				permission: function (have) { return have('EXTRACT.Payroll Extract') && have('PSEUDO.ImportsEnabled'); }
			}, { // => /navigator extract .Extract_File_Layout
				matcher: /FileLayoutforAbsenceManagementExtractReport.pdf$/i,
				permission: function (have) { return have('EXTRACT.Payroll Extract') && have('PSEUDO.ImportsEnabled'); }
			}, { // => /navigator extract Import_Data
				matcher: /\/mvc.aspx\/dataimport$/i,
				permission: function (have) { return have('EXTRACT.ExtImportData') && have('PSEUDO.ImportsEnabled'); }
			}, { // => /navigator extract Import_Status
				matcher: /\/mvc.aspx\/dataimport\/status/i,
				permission: function (have) { return have('EXTRACT.ExtImportData') && have('PSEUDO.ImportsEnabled'); }
			}, { // => /navigator extract Import_Templates
				matcher: /^\/navigator\/dl_templates.asp/i,
				permission: function (have) { return have('EXTRACT.ExtImportData') && have('PSEUDO.ImportsEnabled'); }
			}, { // => /navigator extract Extract_TimeSheets
				matcher: /^\/navigator\/extract_timesheet.asp/i,
				permission: function (have) { return have('EXTRACT.ExtTimeSheet') && have('PSEUDO.HASWEBTIME'); }
			}, { // => /navigator Web Service API Key
				matcher: /^\/navigator\/WebServiceKey.aspx/i,
				permission: function (have) { return have('SECURITY.WEBSERVICEAPIKEY') && have('PSEUDO.ImportsEnabled'); }
			},


			// ===================================== //
			// ==      ABSENCE REPORT ROUTES      == //
			// ===================================== //

			{ // => /abs-mgt/reports/absence/sub-sign-in
				matcher: /^\/abs-mgt\/reports\/absence\/sub-sign-in/i,
				permission: function (have) { return have('RPTABS.SubSignIn') && have('ABSR.Display'); }
			}, { // => /abs-mgt/reports/absence/absentee
				matcher: /^\/abs-mgt\/reports\/absence\/absentee/i,
				permission: 'RPTABS.AbsAbsentee'
			}, { // => /abs-mgt/reports/absence/daily-report
				matcher: /^\/abs-mgt\/reports\/absence\/daily-report/i,
				permission: 'RPTABS.AbsDaily'
			}, {
				// => REPORTS: absence reason percentage
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=entitlementPercentages/i,
				permission: 'RPTABS.AbsEntPercent'
			}, {
				// => REPORTS: cancelled closed absences
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=cancelled/i,
				permission: 'RPTABS.CanceledAbsrs'
			}, {
				// => REPORTS: unfilledabsences
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=unfulfilledStaff/i,
				permission: 'RPTABS.AbsUnfilled'
			}, { // => /abs-mgt/reports/absence/feedback
				matcher: /^\/abs-mgt\/reports\/absence\/feedback/i,
				permission: 'RPTABS.Feedback'
			}, { // => /abs-mgt/reports/absence/approval-status
				matcher: /^\/abs-mgt\/reports\/absence\/approval-status/i,
				permission: function (have) { return have('RPTABS.ApprovalStatus') && have('ABSR.Display'); }
			}, { // => /abs-mgt/reports/absence/monthly-summary
				matcher: /^\/abs-mgt\/reports\/absence\/monthly-summary/i,
				permission: 'RPTABS.AbsSummary'
			}, { // => /abs-mgt/reports/absence/dow-absence-analysis
				matcher: /^\/abs-mgt\/reports\/absence\/dow-absence-analysis/i,
				permission: 'RPTABS.AbsDOWAnal'
			}, { // => /abs-mgt/reports/absence/call-history
				matcher: /^\/abs-mgt\/reports\/absence\/call-history/i,
				permission: 'RPTABS.AbsCallHist'
			}, {
				// => REPORTS: perfect att report
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=perfectattendance/i,
				permission: 'RPTABS.AbsPerfAttnd'
			}, {
				// => REPORTS: absence advance notice
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=advancedNotice/i,
				permission: 'RPTABS.AdvNotice'
			}, {
				// => REPORTS: absence reconciliation
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=absenceApproval/i,
				permission: 'RPTABS.AbsApproval'
			}, { // => /abs-mgt/reports/absence/interactive
				matcher: /^\/abs-mgt\/reports\/absence\/interactive/i,
				permission: function (have) { return have('RPTABS.AbsInteractive') && have('ABSR.Display'); }
			}, {
				// => REPORTS: absence reason by school
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=InstEntitlements/i,
				permission: 'RPTABS.AbsEntByInst'
			},

			// ====================================== //
			// ==      EMPLOYEE REPORT ROUTES      == //
			// ====================================== //

			{ // => /abs-mgt/reports/employee/staff-list
				matcher: /^\/abs-mgt\/reports\/employee\/staff-list/i,
				permission: function (have) {
					var userData = userSvc.getUserData();
					if (userData.UserType === 5) { // UserType 5 is campus user.
						return have('EMP.EmpRegister');
					}
					return have('RPTEMP.EmpReg');
				}
			}, {
				// => absence reason balances details
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=enttBalance/i,
				permission: 'RPTEMP.EmpEntBalDet'
			}, {
				// => Fulfillment Skills
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=workFESkills/i,
				permission: 'RPTEMP.EmpFESkills'
			}, {
				// => MultiSchoolEmployee
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=ItinerantWorkers/i,
				permission: 'RPTEMP.EmpItinWork'
			}, {
				// => Multi School Vacancy Profiles
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=ItinerantVPs/i,
				permission: 'RPTEMP.EmpItinWork'
			},

			// ====================================== //
			// ==     SUBSTITUTE REPORT ROUTES     == //
			// ====================================== //

			{ // => /abs-mgt/reports/substitute/sub-call-history
				matcher: /^\/abs-mgt\/reports\/substitute\/sub-call-history/i,
				permission: function (have) { return have('RPTABS.AbsCallHist') && have('PSEUDO.ISCAMPUSUSER'); }
			}, {
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subHistoryByDate/i,
				permission: function (have) { return have('RPTSUB.SubHistByDate'); }
			}, { // => /abs-mgt/reports/substitute/sub-availability
				matcher: /^\/abs-mgt\/reports\/substitute\/sub-availability/i,
				permission: function (have) { return have('RPTSUB.SubAvailability') && have('SUB.SubSched') && have('PSEUDO.ISCAMPUSUSER'); }
			}, { // => /abs-mgt/reports/substitute/sub-history-by-date
				matcher: /^\/abs-mgt\/reports\/substitute\/sub-history-by-date/i,
				permission: 'RPTSUB.SubHistByDate'
			}, { // => /abs-mgt/reports/substitute/excluded-subs
				matcher: /^\/abs-mgt\/reports\/substitute\/excluded-subs/i,
				permission: 'RPTSUB.SubExcluded'
			}, {
				// => Most Called Substitutes
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=performance/i,
				permission: 'RPTSUB.SubMostCalled'
			}, { // => /abs-mgt/reports/absence/sub-sign-in
				matcher: /^\/abs-mgt\/reports\/absence\/sub-sign-in/i,
				permission: function (have) {
					return have('RPTABS.SubSignIn') && have('ABSR.Display');
				}
			}, {
				// => Assignment
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=substituteAssignment/i,
				permission: 'RPTABS.AbsAssignment'
			}, {
				// => Non Working Substitutes
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subNonWorking/i,
				permission: 'RPTSUB.SubNonWorking'
			}, {
				// => Assignment Summary
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subAssignSummary/i,
				permission: 'RPTSUB.SubAssgnSum'
			}, {
				// => Substitutes In Multiple Districts
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=multiplesubs/i,
				permission: 'RPTSUB.SubMultiple'
			}, {
				// => Register
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=substituteRegister/i,
				permission: 'RPTSUB.SubReg'
			}, {
				// => Preferred Schools
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subinstprefs/i,
				permission: 'RPTSUB.SubInstPref'
			}, {
				// => restricted Call Time
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subRestrictedTime/i,
				permission: 'RPTSUB.RestCallTime'
			}, {
				// => skills
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subPreferences/i,
				permission: 'RPTSUB.SubSkills'
			}, {
				// => Sustitute Utilization
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subUtilization/i,
				permission: 'RPTSUB.SubUtil'
			}, {
				// => Substitute Cancellation
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=subCancelSummary/i,
				permission: 'RPTSUB.SubCancel'
			}, {
				// => Substitute Absences
				matcher: /^\/abs-mgt\/reports\/substitute\/substitute-absences/i,
				permission: function (have) {
					return have('PSEUDO.IsVeritimeEnabled') && have('SUBABS.DISPLAY');
				}
			},

			// ====================================== //
			// ==       SCHOOL REPORT ROUTES       == //
			// ====================================== //

			{ // => /abs-mgt/reports/school/school-call-history
				matcher: /^\/abs-mgt\/reports\/school\/school-call-history/i,
				permission: function (have) { return have('RPTABS.AbsCallHist') && have('PSEUDO.ISCAMPUSUSER'); }
			},

			// ===================================== //
			// ==       OTHER REPORT ROUTES       == //
			// ===================================== //

			{ // => /abs-mgt/reports/report-writer/
				matcher: /^\/abs-mgt\/reports\/report-writer\//i,
				permission: function (have) {
					//if(user is Organization Admin)
					return have('RPTWACCESS.CREATEPUBLIC') ||
						have('RPTWACCESS.CREATEPUBLISHED') ||
						have('RPTWACCESS.CREATEPRIVATE') ||
						have('RPTWACCESS.ViewLocked') ||
						have('RPTWACCESS.VIEWPUBLIC') ||
						have('RPTWACCESS.VIEWPUBLISHED') ||
						have('RPTWACCESS.EDITPUBLIC');
					//if(user is Campus Admin)
					//return have('WEBFUNC.ViewRWReports') &&
					//	(have('RPTWACCESS.ViewLocked') ||
					//	have('RPTWACCESS.VIEWPUBLIC') ||
					//	have('RPTWACCESS.VIEWPUBLISHED'));
				}
			}, { // => scheduled reports
				matcher: /^\/navigator\/reportSchedules.aspx/i,
				permission: 'RPTWACCESS.Schedule'
			}, { // => letter writer
				matcher: /^\/navigator\/abs-mgt\/reportselection.asp\?letter\=1/i,
				permission: 'RPTWACCESS.LETTERWRITER'
			}, { // => Recording_Instructions School_Names_Reason_Types_Vacancy_Profile_Descriptions
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=recordingInstructions/i,
				permission: 'RPTREC.RecSchoolNames'
			}, { // => Recording_Instructions Employee_Names_and_Titles
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=recordWorker/i,
				permission: 'RPTREC.RecEmpNames'
			}, { // => Recording_Instructions Substitute_Names
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=recordSub/i,
				permission: 'RPTREC.RecSubNames'
			},

			// ===================================== //
			// ==         SETTINGS ROUTES         == //
			// ===================================== //

			{
				// PLACEHOLDER! => employee
				permission: function (have) { return have('EMP.EmpViewGeneral') && have('PSEUDO.ISCAMPUSUSER'); }
			}, {
				// PLACEHOLDER! => substitute
				permission: function (have) { return have('SUB.SubViewGeneral') && have('PSEUDO.ISCAMPUSUSER'); }
			}, { // => /settings/school
				matcher: /^\/settings\/school/i,
				permission: function (have) { return have('PSEUDO.HASSCHOOLS') && have('PSEUDO.ISCAMPUSUSER'); }
			}, { // => /settings/school/preferred-substitutes
				// => /settings/school/excluded-substitutes
				matcher: /^\/settings\/school\/(\d+\/)?(preferred|excluded)-substitutes/i,
				permission: function (have) { return have('PREFLIST.View') && have('PSEUDO.ISCAMPUSUSER'); }
			}, { // => /settings/school/shared-files
				matcher: /^\/settings\/school(\/\d+)?\/shared-files/i,
				permission: 'WEBFUNC.UPABSR'
			}, {
				// PLACEHOLDER! => vacancy Profiles
				permission: function (have) {
					return have('VACPROF.VACVIEWGENERAL'); //&& is Org Admin
				}
			}, { // => /user/pin
				matcher: /^\/user\/pin/i,
				permission: function (have) {
					return !idmAvailableSvc.IDMIsIdentityProvider();
				}
			},

			// ==================================== //
			// ==      COMMUNICATION ROUTES      == //
			// ==================================== //

			{
				// PLACEHOLDER! => manage notifications
				permission: function (have) { return have('ORG.OrgViewAlert') && have('ORG.OrgViewGeneral'); }
			}, {
				// PLACEHOLDER! => letter writer
				permission: 'RPTWACCESS.LETTERWRITER'
			},

			// ==================================== //
			// ==      CONFIGURATION ROUTES      == //
			// ==================================== //
			{
				// PLACEHOLDER! => organization Settings
				permission: 'ORG.OrgSettings'
			}, {
				// PLACEHOLDER! => school Settings
				permission: 'ORG.SchoolSettings'
			}, {
				// PLACEHOLDER! => admin Settings
				permission: 'ORG.AdminSettings'
			}, {
				// PLACEHOLDER! => employee Settings
				permission: 'ORG.EmployeeSettings'
			}, {
				// PLACEHOLDER! => substitute settings
				permission: 'ORG.SubstituteSettings'
			}, {
				// PLACEHOLDER! => abs Vac Settings
				permission: 'ORG.AbsVacSettings'
			}, {
				// PLACEHOLDER! => master calender
				permission: function (have) { return have('ORG.OrgViewCal') && have('ORG.OrgViewGeneral'); }
			}, {
				// PLACEHOLDER! => users and permission
				permission: function (have) {
					return have('SECURITY.SecProfileView') ||
						have('SECURITY.SecOrgProfileView') ||
						have('SECURITY.SecOrguserView') ||
						have('SECURITY.SecWorkerTypeVisView') ||
						have('SECURITY.SecProfileView') ||
						have('SECURITY.SecCampusUserView') ||
						(
							have('SECURITY.SecAprvProfileView') &&
							have('ABSRAPPRVL.ApproveDeny')
						);
				}
			}, {
				// PLACEHOLDER! => data maintainance
				permission: 'REFDATA.RefDataView'
			}, {
				// PLACEHOLDER! => import data
				permission: 'EXTRACT.ExtImportData'
			}, {
				// PLACEHOLDER! => web Services API Key
				permission: 'ORG.WebServiceKey'
			},

			// ==================================== //
			// ==        Absence Analytics       == //
			// ==================================== //
			{
				// => navigator Absence Analytics
				matcher: new RegExp(regexHelp.escapeString(window.siteConfig.fiveLabAccessLink)),
				permission: function (have) {
					return featureSvc.get("FiveLabAccessForOU").enabled && have('SECURITY.SecOrgUserFiveLab') && have('PSEUDO.HasFiveLabAccess');
				}
			},
			// ==================================== //
			// ==         WEBTIME ROUTES         == //
			// ==================================== //

			{ // => /WebTime
				matcher: /^\/WebTime/i,
				permission: function (have) {
					return have('PSEUDO.HASWEBTIME') && have('PSEUDO.ISCAMPUSUSER');
				}
			}, { // => /WebTime/School/Approvers
				matcher: /^\/WebTime\/School\/Approvers/i,
				permission: function (have) {
					return have('PSEUDO.HASSCHOOLS') && ((have('!PSEUDO.ISCAMPUSUSER') && have('INST.VIEWAPPROVERS')) || (have('PSEUDO.ISCAMPUSUSER') && have('WEBFUNC.VIEWAPPROVERS'))) && have('!PSEUDO.AutoGenerateTimeSheets');
				}
			}, { // => /WebTime/TimeSheet-Summary
				matcher: /^(\/navigator\/abs-mgt\/reports.asp\?report\=ts_summary|\/WebTime\/TimeSheet-Summary)/i,
				permission: function (have) { return have('PSEUDO.HASWEBTIME') && have('RPTTS.Summary'); }
			}, { // => /WebTime/TimeSheet-outstanding
				matcher: /^\/navigator\/abs-mgt\/reports.asp\?report\=ts_outstanding/i,
				permission: function (have) { return have('PSEUDO.HASWEBTIME') && have('RPTTS.Outstanding'); }
			},


			// ==================================== //
			// ==         Frontline Institute    == //
			// ==================================== //
			{
				matcher: new RegExp(regexHelp.escapeString(window.siteConfig.frontlineInstituteLink)),
				permission: function (have) {
					return have('FLINST.FLINSTITUTEACCESS') && featureSvc.get("FrontlineInstitute").enabled
				}
			}

		];
	});
	// #--- END Value (routePermissionVal) ---# //
	// #--------------------------------------# //

}());
