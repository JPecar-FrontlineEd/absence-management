(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Value (contextMenuDataVal) -----# //
	app.value('contextMenuDataVal', [{
			Group: 'School',
			Text : 'ContextMenu.Text.General',
			URL  : '/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id='
		},
		{
			Group: 'School',
			Text : 'ContextMenu.Text.Address',
			URL  : '/navigator/s_address.asp?TB2=TAB2&TB1=TAB1&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.PreferredSubstitutes',
			URL  : '/navigator/s_sub.asp?TB1=TAB2&TB2=&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.PermanentSubstitute',
			URL  : '/navigator/s_permsub.asp?TB3=TAB6&TB1=TAB6&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.AbsenceReasons',
			URL  : '/navigator/s_entitlements.asp?TB1=TAB4&TB2=&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.SubstituteAvailability',
			URL  : '/navigator/s_sub_availability.asp?TB4=TAB4&TB1=TAB5&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.StaffList',
			URL  : '/navigator/s_displayWorker.asp?TB4=TAB3&TB1=TAB5&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.AbsenceOrVacancyFiles',
			URL  : '/navigator/s_absrattachments.asp?TB3=TAB9&TB1=TAB6&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.ChangeLog',
			URL  : '/navigator/s_changelog.asp?TB4=TAB6&TB1=TAB5&inst_id='
        },
        {
			Group: 'School',
			Text : 'ContextMenu.Text.LoginHistory',
			URL  : '/navigator/s_LoginHistory.asp?TB4=TAB13&TB1=TAB5&inst_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.CreateVacancy',
			URL  : '/navigator/absenceCreate.asp?TB1=TAB2&isVacancy=true&work_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.Skills',
			URL  : '/navigator/vp_skills.asp?x=x&TB1=TAB4&TB2=&work_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.PreferredSubstitutes',
			URL  : '/navigator/vp_sub.asp?TB1=TAB11&TB2=&work_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.QualifiedSubstitutes',
			URL  : '/navigator/vp_qualifiedSubs.asp?TB1=TAB7&TB2=&work_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.AbsenceOrVacancyFiles',
			URL  : '/navigator/vp_absrattachments.asp?TB1=TAB8&TB2=&work_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.AllocationGroups',
			URL  : '/navigator/vp_AllocationGroups.asp?TB1=TAB10&TB2=&work_id='
        },
        {
			Group: 'VacancyProfile',
			Text : 'ContextMenu.Text.ChangeLog',
			URL  : '/navigator/vp_ChangeLog.asp?TB1=TAB9&TB2=&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.CreateAbsence',
			URL  : '/navigator/absencecreate.asp?TB4=TAB8&TB1=&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.General',
			URL  : '/navigator/te_general.asp?TB2=TAB1&TB1=TAB1&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.Address',
			URL  : '/navigator/te_address.asp?TB2=TAB8&TB1=TAB1&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.Permission',
			URL  : '/navigator/te_perms.asp?TB2=TAB1&TB1=TAB2&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.PreferredSubstitutes',
			URL  : '/navigator/te_sub.asp?TB1=TAB8&TB2=&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.Skills',
			URL  : '/navigator/te_skills.asp?TB3=TAB4&TB1=TAB3&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.AbsenceReasons',
			URL  : '/navigator/te_entitlements.asp?TB1=TAB6&TB2=&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.AbsenceHistory',
			URL  : '/navigator/te_displayAbsence.asp?TB4=TAB5&TB1=TAB5&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.QualifiedSubstitutes',
			URL  : '/navigator/te_qualifiedSubs.asp?TB4=TAB7&TB1=TAB5&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.CommunicationsToEmployees',
			URL  : '/navigator/te_letterhistory.asp?TB4=TAB8&TB1=TAB5&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.AbsenceApprovers',
			URL  : '/navigator/te_Approvers.asp?TB1=TAB7&TB2=&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.AbsenceOrVacancyFiles',
			URL  : '/navigator/te_absrattachments.asp?TB3=TAB5&TB1=TAB3&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.AllocationGroups',
			URL  : '/navigator/te_AllocationGroups.asp?TB1=TAB9&TB2=&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.VeriTimeWorkDetail',
			URL  : '/RedirectToVeriTime.asp?x=x&redirectUrl=/WorkDetail'
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.ChangeLog',
			URL  : '/navigator/te_ChangeLog.asp?TB4=TAB9&TB1=TAB5&work_id='
        },
        {
			Group: 'Worker',
			Text : 'ContextMenu.Text.LoginHistory',
			URL  : '/navigator/te_LoginHistory.asp?TB4=TAB10&TB1=TAB5&work_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.CommunicationsToSubstitute',
			URL  : '/navigator/sub_letterHistory.asp?TB5=TAB13&TB1=TAB5&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.General',
			URL  : '/navigator/sub_general.asp?TB2=TAB1&TB1=TAB1&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.Address',
			URL  : '/navigator/sub_address.asp?TB2=TAB12&TB1=TAB1&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.Permission',
			URL  : '/navigator/sub_perms.asp?TB1=TAB2&TB2=&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.Skills',
			URL  : '/navigator/sub_skills.asp?TB3=TAB2&TB1=TAB3&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.PreferredSchools',
			URL  : '/navigator/sub_instpref.asp?TB3=TAB3&TB1=TAB3&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.SchoolPreferredSubstitutes',
			URL  : '/navigator/sub_pref.asp?TB2=TAB4&TB1=TAB9&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.EmployeePreferredSubstitutes',
			URL  : '/navigator/sub_workerPref.asp?TB2=TAB5&TB1=TAB9&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.NonWorkDays',
			URL  : '/navigator/sub_displayDataSchedule.asp?TB4=TAB7&TB1=TAB4&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.CallTimes',
			URL  : '/navigator/sub_displayDataCall.asp?TB4=TAB8&TB1=TAB4&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.FulfillmentHistory',
			URL  : '/navigator/sub_displayDataAbsence.asp?x=x&sub_Id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.AvailableJobs',
			URL  : '/navigator/sub_displayJobs.asp?TB5=TAB10&TB1=TAB5&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.Performance',
			URL  : '/navigator/sub_performance.asp?TB5=TAB11&TB1=TAB5&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.JobVisibilityHierarchy',
			URL  : '/navigator/sub_visibilityHierarchy.asp?TB5=TAB44&TB1=TAB5&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.VeriTimeWorkDetail',
			URL  : '/RedirectToVeriTime.asp?&x=x&redirectUrl=/WorkDetail'
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.ChangeLog',
			URL  : '/navigator/sub_changeLog.asp?TB5=TAB14&TB1=TAB5&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.LoginHistory',
			URL  : '/navigator/sub_LoginHistory.asp?TB5=TAB15&TB1=TAB5&sub_id='
        },
        {
			Group: 'Substitute',
			Text : 'ContextMenu.Text.CallHistory',
			URL  : '/navigator/sub_CallHistory.asp?TB5=TAB16&TB1=TAB5&sub_id='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.Modify',
			URL  : '/navigator/absencemodify.asp?x=x&TB=Tab6&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.AbsenceOrVacancyLog',
			URL  : '/navigator/abs_absence_log.asp?TB1=TAB2&TB2=&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.CallHistory',
			URL  : '/navigator/abs_call_history.asp?TB1=TAB3&TB2=&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.AvailableSubstitutes',
			URL  : '/navigator/abs_sub_availability.asp?TB1=TAB5&TB2=&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.Approvers',
			URL  : '/navigator/abs_Approvers.asp?TB1=TAB7&TB2=&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.Attachments',
			URL  : '/navigator/abs_absrAttachments.asp?TB1=TAB9&TB2=&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.SubstituteRating',
			URL  : '/navigator/te_feedback.asp?TB2=TAB1&TB1=TAB11&absr='
        },
        {
			Group: 'ConfirmationNumber',
			Text : 'ContextMenu.Text.SubstituteExperience',
			URL  : '/navigator/sub_feedback.asp?TB2=TAB2&TB1=TAB11&absr='
        }]
    );

    // #--- END Value (contextMenuDataVal) ---# //
	// #-------------------------------# //
}());