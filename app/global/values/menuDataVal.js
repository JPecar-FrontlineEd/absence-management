(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Value (menuDataVal) -----# //
	app.value('menuDataVal', [{
			title: 'nav.label.dashboard',
			icon: 'fa-nav-tachometer',
			route: '/',
			routeMatchers: '^/?$'
		},
		{
			title:'nav.Web_Navigator',
			icon: 'fa-nav-tachometer',
			route: '/navigator/home.asp'
		},{
			title:'nav.reports.abs.daily',
			route:'/abs-mgt/reports/absence/daily-report',
			icon: 'fa-nav-clipboard-list'
        },
        {
            title: 'nav.abs.label.createAbs',
            route: '/abs-mgt/absences/create-absence#sidekick',
            icon: 'fa-nav-user-circle'
        },
		{
			title:'Nav.Label.FindWorker',
			route:'/search/search?searchFor=&searchType=2',
			icon: 'fa-nav-search'
		},
		{
			title:'Nav.Label.FindSubstitute',
			route:'/search/search?searchFor=&searchType=3',
			icon: 'fa-nav-search'
		},{
			title:'nav.Master_Data',
			icon: 'fa-nav-sitemap',
			route: '/master-data',
			children:[
				{
					title:'nav.Organization_Information',
					shortCutKey:'Alt + O',
					route:'/navigator',
					children:[
						{
							title:'nav.Organization_Information',
							route:'/navigator/org_general.asp'
						},{
							title:'nav.Contact_Information',
							route:'/navigator/org_contact.asp'
						},{
							title:'nav.School_Dates',
							route:'/navigator/org_schooldates.asp'
						},{
							title:'nav.Call_Times',
							route:'/navigator/org_calltimes.asp'
						},{
							title:'nav.Substitute_AbsVac_Settings',
							route:'/navigator/org_dayinadvance.asp',
							useTitle:true
						},{
							title:'nav.Shift_Types',
							route:'/navigator/org_absence.asp'
						},{
							title:'nav.District_Work_Schedule',
							route:'/navigator/org_workschedule.asp'
						},{
							title:'nav.Permanent_Substitutes',
							route:'/navigator/org_PermSubSettings.asp'
						},{
							title:'nav.AbsVac_Feedback',
							route:'/navigator/org_feedback.asp'
						},{
							title:'nav.AbsVac_Feedback_Questions',
							route:'/navigator/org_feedbackquestions.asp',
							useTitle:true
						},{
							title:'nav.Miscellaneous',
							route:'/navigator/org_OtherSettings.asp'
						},{
							title:'nav.Time_Sheets',
							route:'/navigator/org_TimeSheetSettings.asp'
						},{
							title:'nav.School_Closings',
							route:'/navigator/org_calendar.asp'
						},{
							title:'nav.No_Calling_Days',
							route:'/navigator/org_noCall.asp'
						},{
							title:'InformationAlerts',
							route:'/navigator/org_webAlerts.asp'
						},{
							title:'nav.Absence_Approval_Settings',
							route:'/navigator/org_ApprovalSettings.asp'
						},{
							title:'nav.Daily_Limits',
							route:'/navigator/org_DailyLimit.asp'
						},{
							title:'nav.Substitute_Call_Time_Disclaimer',
							route:'/navigator/org_subCallTimeDisclaimer.asp'
						},{
							title:'nav.AbsVac_Files',
							route:'/navigator/org_absrattachments.asp'
						},{
							title:'nav.Set_Visibility_Settings',
							route:'/navigator/org_visibilitySettings.asp'
						}
					]
				},{
					title:'School',
					shortCutKey:'Alt + I',
					route:'/navigator',
					children:[
						{
							title:'nav.Add',
							route:'/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&add=true'
						},{
							title:'nav.General_Information',
							route:'/navigator/s_general.asp'
						},{
							title:'Address',
							route:'/navigator/s_address.asp'
						},{
							title:'nav.Permanent_Substitute',
							route:'/navigator/s_permsub.asp'
						},{
							title:'Report.Label.AbsenceReasons',
							route:'/navigator/s_entitlements.asp'
						},{
							title:'nav.Preferred_Substitutes',
							route:'/navigator/s_sub.asp'
						},{
							title:'Reports.Title.SubAvailability',
							route:'/navigator/s_sub_availability.asp'
						},{
							title:'nav.reports.emp.staff',
							route:'/navigator/s_displayWorker.asp'
						},{
							title:'nav.Timesheet_Approvers',
							route:'/navigator/s_timeapprovers.asp'
						},{
							title:'nav.Timesheet_Settings',
							route:'/navigator/s_timesheetsettings.asp'
						},{
							title:'nav.AbsVac_Files',
							route:'/navigator/s_absrattachments.asp'
						},{
							title:'nav.Change_Log',
							route:'/navigator/s_changelog.asp'
						},{
							title:'nav.Login_History',
							route:'/navigator/s_LoginHistory.asp'
						}
					]
				},{
					title:'nav.Worker',
					shortCutKey:'Alt + W',
					route:'/navigator',
					children:[
						{
							title:'nav.Add',
							route:'/navigator/te_general.asp?TB2=TAB1&TB1=TAB1&add=true'
						},{
								title:'nav.Add_In_Staff_Directory',
								route: window.siteConfig.GlobalDirectoryLink
						},{
							title:'nav.General_Information',
							route:'/navigator/te_general.asp'
						},{
							title:'Address',
							route:'/navigator/te_address.asp'
						},{
							title:'nav.Permission',
							route:'/navigator/te_perms.asp'
						},{
							title:'nav.Skills',
							route:'/navigator/te_skills.asp'
						},{
							title:'nav.Absence_History',
							route:'/navigator/te_displayAbsence.asp'
						},{
							title:'nav.Preferred_Substitutes',
							route:'/navigator/te_sub.asp'
						},{
							title:'nav.Qualified_Substitutes',
							route:'/navigator/te_qualifiedSubs.asp'
						},{
							title:'nav.Communications_to_Employee',
							route:'/navigator/te_letterhistory.asp'
						},{
							title:'Report.Label.AbsenceReasons',
							route:'/navigator/te_entitlements.asp'
						},{
							title:'nav.AbsVac_Files',
							route:'/navigator/te_absrattachments.asp'
						},{
							title:'ContextMenu.Text.AbsenceFiles',
							route:'/navigator/te_absrattachments.asp#AbsenceFiles'
						},{
							title:'nav.Allocation_Groups',
							route:'/navigator/te_AllocationGroups.asp'
						},{
							title:'nav.Change_Log',
							route:'/navigator/te_ChangeLog.asp'
						},{
							title:'nav.Login_History',
							route:'/navigator/te_LoginHistory.asp'
						}
					]
				},{
					title:'VacancyProfile',
					route:'/navigator',
					children:[
						{
							title:'nav.Add',
							route:'/navigator/vp_general.asp?TB1=TAB1&TB2=&add=true'
						},{
							title:'nav.General_Information',
							route:'/navigator/vp_general.asp'
						},{
							title:'nav.Skills',
							route:'/navigator/vp_skills.asp'
						},{
							title:'nav.Preferred_Substitutes',
							route:'/navigator/vp_sub.asp'
						},{
							title:'nav.Qualified_Substitutes',
							route:'/navigator/vp_qualifiedSubs.asp'
						},{
                            title:'nav.AbsVac_Files',
							route:'/navigator/vp_absrattachments.asp'
                        }, {
                            title: 'ContextMenu.Text.AbsenceFiles',
                            route: '/navigator/vp_absrattachments.asp#AbsenceFiles'
						},{
							title:'nav.Allocation_Groups',
							route:'/navigator/vp_AllocationGroups.asp'
						},{
							title:'nav.Change_Log',
							route:'/navigator/vp_ChangeLog.asp'
						},
						{
							title: 'nav.Vacancy_History',
							route: '/navigator/vp_displayAbsence.asp'
						}
					]
				},{
					title:'Substitute',
					shortCutKey:'Alt + S',
					route:'/navigator',
					children:[
						{
							title:'nav.Add',
							route:'/navigator/sub_general.asp?TB2=TAB1&TB1=TAB1&add=true'
						},{
								title:'nav.Add_In_Staff_Directory',
								route: window.siteConfig.GlobalDirectoryLink
						},{
							title:'nav.General_Information',
							route:'/navigator/sub_general.asp'
						},{
							title:'Address',
							route:'/navigator/sub_address.asp'
						},{
							title:'nav.Permissions',
							route:'/navigator/sub_perms.asp'
						},{
							title:'nav.Skills',
							route:'/navigator/sub_skills.asp'
						},{
							title:'nav.Preferred_Schools',
							route:'/navigator/sub_instpref.asp'
						},{
							title:'nav.Non-Work_Day',
							route:'/navigator/sub_displayDataSchedule.asp'
						},{
							title:'nav.Call_Times',
							route:'/navigator/sub_displayDataCall.asp'
						},{
							title:'nav.Fulfillment_History',
							route:'/navigator/sub_displayDataAbsence.asp?TB5=TAB9&TB1=TAB5'
						},{
							title:'nav.Available_Jobs',
							route:'/navigator/sub_displayJobs.asp'
						},{
							title:'nav.Performance',
							route:'/navigator/sub_performance.asp'
						},{
							title:'nav.Job_Visibility_Hierarchy',
							route:'/navigator/sub_visibilityHierarchy.asp'
						},{
							title:'nav.School_Preferred_Substitutes',
							route:'/navigator/sub_pref.asp'
						},{
							title:'nav.Employee_Preferred_Substitutes',
							route:'/navigator/sub_workerPref.asp'
						},{
							title:'nav.Communications_to_Substitute',
							route:'/navigator/sub_letterHistory.asp'
						},{
							title:'nav.Timesheet_History',
							route:'/navigator/sub_tsHistory.asp'
						},{
							title:'nav.Change_Log',
							route:'/navigator/sub_changeLog.asp'
						},{
							title:'nav.Login_History',
							route:'/navigator/sub_LoginHistory.asp'
						},{
							title:'nav.Call_History',
							route:'/navigator/sub_CallHistory.asp'
						}
					]
				}
			]
		},{
			title: 'nav.lable.Abnseces',
			icon: 'fa-nav-calendar-alt',
			route: '/absences',
			routeMatchers: '^\/substitute-absences|absences\/',
			children: [{
				title: 'nav.abs.label.createAbs',
				shortCutKey:'Alt + B',
				route: '/abs-mgt/absences/create-absence'
			},{
				title: 'nav.abs.label.createVac',
				route: '/abs-mgt/absences/create-vacancy'
			},{
				title: 'nav.subabs.label.createSubstituteAbsence',
				route: '/abs-mgt/substitute-absences/create-substitute-absence'
			},{
				title: 'nav.Modify',
				shortCutKey:'Alt + M',
				route: '/navigator/abs_list.asp'
			},{
				title: 'nav.abs.label.approve',
				route:'/abs-mgt/absences/approve'
			},{
				title:'nav.abs.label.reconcile',
				route:'/abs-mgt/absences/reconcile'
			}]
		},{
			title:'nav.Reference_Data',
			icon: 'fa-nav-list',
			route: '/reference-data',
			children:[
						{
							title:'nav.WorkerTypeGenerics',
							route:'/navigator/tableEdit.asp?table=worker_type'
						},{
							title:'Reports.Group.Title.AbsenceReasons',
							route:'/reference-data/absence-reasons'
						},{
							title:'Report.Label.VacancyReasons',
							route:'/navigator/ref_vacReasonList.asp'
						},{
							title:'nav.Skills',
							route:'/navigator/tableEdit.asp?table=skills'
						},{
							title:'nav.Budget_Codes',
							route:'/navigator/tableEdit.asp?table=budget_code'
						},{
							title:'nav.Pay_Codes',
							route:'/navigator/tableEdit.asp?table=pay_code'
						},{
							title:'nav.label.accountingcodes',
							route:'/navigator/tableEdit.asp?table=accounting_code'
						},{
							title:'nav.Allocation_Groups',
							route:'/navigator/allocationGroups.asp'
						},{
							title:'nav.Distribution_Lists',
							route:'/navigator/distributionlists.asp'
						},{
							title:'nav.Ethnicity',
							route:'/navigator/tableEdit.asp?table=ethnicity'
						},{
							title:'nav.Timesheet_Rejection_Reasons',
							route:'/navigator/tableEdit.asp?table=timesheet_rejectreason'
						},{
						 	title:'nav.Substitute_Cancellation_Reasons',
						 	route:'/reference-data/substitute-cancellation-reasons'
						}
					]
		},{
			title:'nav.Security',
			icon: 'fa-nav-lock',
			route: '/security',
			children:[{
				title:'WebNavigator',
				route:'/navigator',
				children:[{
					title:'nav.Organization_Users',
					route:'/navigator/ou_select.asp?p_usertype=0'
				},{
					title:'nav.Organization_User_Profiles',
					route:'/navigator/p_profilesList.asp?ppt=0'
				}]
			},{
				title:'PrincipalWeb',
				route:'/navigator',
				children:[{
					title:'nav.PrincipalProfiles',
					route:'/navigator/p_profilesList.asp?ppt=1'
				},{
					title:'nav.CampusUsers',
					route:'/navigator/cu_select.asp?ppt=1'
				}]
			},{
				title:'nav.VisibilityProfiles',
				route:'/navigator',
				children:[{
					title:'nav.School_Visibility',
					route:'/navigator/p_profilesList.asp?ppt=2'
				},{
					title:'nav.Employee_Type_Visibility',
					route:'/navigator/p_profilesList.asp?ppt=3'
				}]
			},{
				title: 'Others',
				route: '/security',
				children: [{
					title:'nav.Approver_Profiles',
					route:'/navigator/p_profilesList.asp?ppt=99'
				},{
					title:'UserAccess.Heading',
					route:'/security/user-access'
				},{
					title:'UserAccess.ManageUserAccess',
					route: window.siteConfig.SuperSuitDomain + 'absmgmt-useraccess/?oaap=' + window.siteConfig.navigatorBaseUrl + '/admin_UserAccess.asp'
				}]
			}]
		},{
			title: 'nav.label.reports',
			icon: 'fa-nav-chart-bar',
			routeMatchers: [/(?=.*\/reports)(?!.*daily-report)(.+)/],
			route: '/reports',
			children: [{
				title: 'nav.label.absence',
				route: '/abs-mgt/reports/absence',
				routeMatchers: [/(?=.*\/reports\/absence\/)(?!.*daily-report)(.+)/],
				children:[{
					title:'nav.reports.abs.subSignIn',
					route:'/abs-mgt/reports/absence/sub-sign-in'
				},{
					title:'nav.reports.abs.absentee',
					route:'/abs-mgt/reports/absence/absentee'
				},{
					title:'nav.reports.abs.daily',
					shortCutKey:'Alt + R',
					route:'/abs-mgt/reports/absence/daily-report',
					routeMatchers: ['nomatch']
				},{
					title:'nav.reports.abs.absencereasonpercentage',
					route:'/navigator/reports.asp?report=entitlementPercentages'
				},{
					title:'nav.reports.abs.cancelledclosedabsences',
					route:'/navigator/reports.asp?report=cancelled',
				},{
					title:'nav.reports.abs.unfilledabsences',
					route:'/navigator/reports.asp?report=unfulfilledStaff'
				},{
					title:'nav.reports.abs.feedback',
					route:'/abs-mgt/reports/absence/feedback'
				},{
					title:'nav.reports.abs.approval',
					route:'/abs-mgt/reports/absence/approval-status'
				},{
					title:'nav.reports.abs.monthSum',
					route:'/abs-mgt/reports/absence/monthly-summary'
				},{
					title:'nav.reports.abs.dow',
					route:'/abs-mgt/reports/absence/dow-absence-analysis'
				},{
					title:'nav.reports.abs.absCallHistory',
					route:'/abs-mgt/reports/absence/call-history'
				},{
					title:'nav.reports.abs.perfectattreport',
					route:'/navigator/reports.asp?report=perfectattendance'
				},{
					title:'nav.reports.abs.absenceadvancenotice',
					route:'/navigator/reports.asp?report=advancedNotice'
				},{
					title:'nav.reports.abs.absencereconciliation',
					route:'/navigator/reports.asp?report=absenceApproval'
				},{
					title:'nav.reports.abs.absInteractive',
					route:'/abs-mgt/reports/absence/interactive'
				},{
					title:'nav.reports.abs.absencereasonbyschool',
					route:'/navigator/reports.asp?report=InstEntitlements'
				}]
			},{
				title: 'nav.label.employee',
				route: '/abs-mgt/reports/employee',
				children:[{
					title:'nav.reports.emp.staff',
					route:'/abs-mgt/reports/employee/staff-list'
				},{
					title:'nav.Absence_Reason_Balances',
					route:'/navigator/reports.asp?report=enttBalance'
				},{
					title:'nav.reports.emp.absencereasonbalancesdetails',
					route:'/navigator/reports.asp?report=enttBalanceDetails',
					useTitle:true
				},{
					title:'nav.reports.emp.FulfillmentSkills',
					route:'/navigator/reports.asp?report=workFESkills'
				},{
					title:'nav.reports.emp.MultiSchoolEmployee',
					route:'/navigator/reports.asp?report=ItinerantWorkers'
				},{
					title:'nav.reports.emp.MultiSchoolVacancyProfiles',
					route:'/navigator/reports.asp?report=ItinerantVPs'
				}]
			},{
				title: 'nav.label.substitute',
				route: '/abs-mgt/reports/substitute',
				children:[
				{
					title:'nav.reports.sub.Assignment',
					route:'/navigator/reports.asp?report=substituteAssignment'
				},{
					title:'nav.reports.sub.AssignmentSummary',
					route:'/navigator/reports.asp?report=subAssignSummary'
				},{
					title:'nav.reports.sub.callHistory',
					route:'/abs-mgt/reports/substitute/sub-call-history'
				},{
					title:'nav.reports.subAvail',
					route:'/abs-mgt/reports/substitute/sub-availability'
				},{
					title:'nav.reports.sub.history',
					route:'/abs-mgt/reports/substitute/sub-history-by-date'
				},{
					title:'nav.reports.sub.excluded',
					route:'/abs-mgt/reports/substitute/excluded-subs'
				},{
					title:'nav.reports.sub.MostCalledSubstitutes',
					route:'/navigator/reports.asp?report=performance'
				},{
					title:'nav.reports.sub.NonWorkingSubstitutes',
					route:'/navigator/reports.asp?report=subNonWorking'
				},{
					title:'nav.reports.sub.SubstitutesInMultipleDistricts',
					route:'/navigator/reports.asp?report=multiplesubs'
				},{
					title:'nav.reports.sub.Register',
					route:'/navigator/reports.asp?report=substituteRegister'
				},{
					title:'nav.reports.sub.PreferredSchools',
					route:'/navigator/reports.asp?report=subinstprefs'
				},{
					title:'nav.reports.sub.restrictedCallTime',
					route:'/navigator/reports.asp?report=subRestrictedTime'
				},{
					title:'nav.reports.sub.skills',
					route:'/navigator/reports.asp?report=subPreferences'
				},{
					title:'nav.reports.sub.SustituteUtilization',
					route:'/navigator/reports.asp?report=subUtilization'
				},{
					title:'nav.report.sub.SubstituteCancellation',
					route:'/navigator/reports.asp?report=subCancelSummary'
				},{
					title: 'nav.report.sub.SubstituteAbsence',
					route:'/abs-mgt/reports/substitute/substitute-absences'
				}]
			},{
				title: 'nav.label.school',
				route: '/abs-mgt/reports/school',
				children:[{
					title:'nav.reports.school.callHistory',
					route:'/abs-mgt/reports/school/school-call-history'
				}]
			},{
				title: 'nav.Time_Sheets',
				route: '/navigator',
				children:[{
					title:'nav.webtime.label.tsSummary',
					route:'/navigator/reports.asp?report=ts_summary'
				},{
					title:'nav.webtime.label.tsOutstanding',
					route:'/navigator/reports.asp?report=ts_outstanding'
				}]
			 }
			,{
				title: 'nav.Recording_Instructions',
				route: '/navigator',
				children:[{
					title:'nav.School_Names_Reason_Types_Vacancy_Profile_Descriptions',
					route:'/navigator/reports.asp?report=recordingInstructions',
					useTitle:true
				},{
					title:'nav.Employee_Names_and_Titles',
					route:'/navigator/reports.asp?report=recordWorker'
				},{
					title:'nav.Substitute_Names',
					route:'/navigator/reports.asp?report=recordSub'
				}]
			},{
				title: 'nav.reports.label.reportWriter',
				route: '/abs-mgt/reports/report-writer/'
			},{
				title: 'nav.label.scheduledreports',
				route: '/navigator/reportSchedules.aspx'
			},{
				title: 'nav.Letter_Writer',
				route: '/navigator/reportselection.asp?letter=1'
			}]
		},{
			title: 'nav.Extract_Import',
			icon: 'fa-nav-cloud',
			route: '/extract-import',
				children:[{
					title:'nav.Extract_Data',
					route:'/navigator/extract_data.asp'
				},{
					title:'nav.Extract_File_Layout',
					route: window.siteConfig.ExtractHelpDocumentLink,
					target: '_blank'
				},{
					title: 'nav.Import_Data',
					route: window.siteConfig.legacyDomainUrl + '/mvc.aspx/dataimport'
				}, {
					title: 'nav.Import_Status',
					route: window.siteConfig.legacyDomainUrl + '/mvc.aspx/dataimport/status'
				},{
					title:'nav.Import_Templates',
					route:'/navigator/dl_templates.asp'
				},{
					title:'nav.Extract_TimeSheets',
					route:'/navigator/extract_timesheet.asp'
				},{
					title:'nav.Web_Service_API_Key',
					route:'/navigator/WebServiceKey.aspx'
				}]
		},{
			title: 'nav.label.settings',
			icon: 'fa-nav-cog',
			route: '/settings',
			routeMatchers: [/\/(user\/|settings)/],
			children: [{
				title: 'nav.label.employee',
				route:''
			},{
				title: 'nav.label.substitute',
				route:''
			},{
				title: 'nav.label.school',
				route:'/settings/school',
				children: [{
					title: 'nav.settings.school.label.general',
					route: '/settings/school/general-info',
					routeMatchers: [(/\/settings\/school\/\d+\/general-info/)]
				},{
					title: 'nav.settings.school.label.timeSettings',
					route: '/settings/school/time-settings',
					routeMatchers: [(/\/settings\/school\/\d+\/time-settings/)]
				},{
					title: 'nav.settings.school.label.prefSubs',
					route: '/settings/school/preferred-substitutes',
					routeMatchers: [(/\/settings\/school\/\d+\/preferred-substitutes/)]
				},{
					title: 'nav.settings.school.label.exclSubs',
					route: '/settings/school/excluded-substitutes',
					routeMatchers: [(/\/settings\/school\/\d+\/excluded-substitutes/)]
				},{
					title: 'nav.settings.school.label.sharedFiles',
					route: '/settings/school/shared-files',
					routeMatchers: [(/\/settings\/school\/\d+\/shared-files/)]
				}]
			},{
				title: 'nav.settings.label.vacProf',
				route:''
			},{
				title:'nav.settings.accountSettings',
				routeMatchers: [(/\/user\//)],
				route:'/user',
				children: [{
							title: 'nav.settings.accountSettings.myProfile',
							route:'/user/profile'
						},{
							title: 'nav.settings.accountSettings.pin',
							route:'/user/pin'
						}]
			},{
				title:'nav.Global_Dashboard_Options',
				route:'/navigator/DashboardCatalog.aspx?defaults=true'
			},{
				title:'nav.My_Dashboard_Options',
				route:'/navigator/DashboardCatalog.aspx'
			}
		]
		},
		{
			title: 'nav.label.fiveLabAccess',
			icon: 'fa-nav-chart-line',
			route: window.siteConfig.fiveLabAccessLink,
			target: '_blank'
		}
		,{
			title: 'nav.label.frontlineinstitute',
			icon: 'fa-bar-chart-o',
			route: window.siteConfig.frontlineInstituteLink
		},{
			title: 'nav.label.communication',
			icon: 'comment',
			children:[{
				title:'nav.label.managenotifications',
				route:''
			},{
				title:'nav.label.letterwriter',
				route:''
			}]
		},{
			title: 'nav.label.configuration',
			icon: 'gear',
			children:[{
				title:'nav.label.organizationSettings',
				route:''
			},{
				title:'nav.label.schoolSettings',
				route:''
			},{
				title:'nav.label.adminSettings',
				route:''
			},{
				title:'nav.label.employeeSettings',
				route:''
			},{
				title:'nav.label.substitutesettings',
				route:''
			},{
				title:'nav.label.absVacSettings',
				route:''
			},{
				title:'nav.label.mastercalender',
				route:''
			},{
				title:'nav.label.usersandpermission',
				route:''
			},{
				title:'nav.label.datamaintainance',
				route:''
			},{
				title:'nav.label.importdata',
				route:''
			},{
				title:'nav.label.webServicesAPIKey',
				route:''
			}]
		},{
			title: 'nav.label.webtime',
			icon: 'fa-nav-cloud',
			route: '/WebTime',
			children:[{
				title:'nav.webtime.label.mngApprovers',
				route:'/WebTime/School/Approvers',
				routeMatchers: ['/WebTime\/.*\/Approvers']
			},{
				title:'nav.webtime.label.tsSummary',
				route:'/WebTime/TimeSheet-Summary'
			}]
		}
	]);
	// #--- END Value (menuDataVal) ---# //
	// #-------------------------------# //

}());
