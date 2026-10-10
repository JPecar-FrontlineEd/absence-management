module.exports=function(overrideSettingsObject, overrideFeatureList){
    var defaultSettings = {
                    "usesVeritime": true,
                    "usesAbsenceApproval": true,
                    "usesVacancies": true,
                    "usesReportWriterScheduling": true,
                    "usesAbsenceAttachment": true,
                    "usesBlockSubstitute": true,
                    "showPayCodeOnAssignSubstitutePage": true,
                    "maxManualCallsPerAbsence": 15,
                    "usesDailyLimits": true,
                    "usesWeeklyLimits": true,
                    "usesMonthlyLimits": false,
                    "usesCancelClosedMode": false,
                    "showIdentifierToCampusUser": true,
                    "DeductBreakFromAbsenceDuration": false,
                    "workLeaveFeedback": true,
                    "workViewSubstituteAverageFeedbackScore": true,
                    "subViewFeedback": true,
                    "subLeaveFeedback": true,
                    "showAbsReasonOnSubSignIn": true,
                    "ShowAbsenteeReportBudgetCode": true,
                    "ShowAbsenteeReportPayCode": true,
                    "showDailyReportBudgetCode": true,
                    "showDailyReportPayCode": true,
                    "showDailyReportEmployeeExtId": false,
                    "showDailyReportSubstituteExtId": false,
                    "showIdentifiersToCampusUser": true,
                    "showPinToCampusUser": true,
                    "ShowAccountingCode": true,
                    "ShowSchoolCustomerNumber": true,
                    "subReportTimesEnabled": true,
                    "UserHrsVisMode": true,
                    "PastAbsenceDateTime": "11/27/2017",
                    "showSubResume": true,
                    "showSubPhoto": true,
                    "isWebTimeVisible": false,
                    "showDashboard": true,
                    "trackLogin": true,
                    "showAllocationGroups": true,
                    "importsEnabled": true,
                    "AllowedDOW": [
                        false,
                        true,
                        true,
                        true,
                        true,
                        true,
                        true
                    ],
                    "usesParentWeeklyLimits": false,
                    "usesParentMonthlyLimits": false,
                    "allowedShiftTypes": 2,
                    "isVeritimeOnly": false,
                    "usesUserVoice": true
                };

        if (overrideSettingsObject != null) {
            defaultSettings = overrideSettingsObject;
        }

        return{
            "data": [
                {
                "id": 10810,
                "name": "QA TEST DISTRICT",
                "settings": defaultSettings,
                "absenceRequestArchiveDate": "6/30/2013",
                "applId": 1,
                "orgXrefId": 63302,
                "orgNcesId": null,
                "appDisplayName": "Aesop",
                "orgContactInfo": {
                    "title": "The Big Guy",
                    "firstName": "Jonny",
                    "middleName": "",
                    "lastName": "Five",
                    "phone": "6107240207",
                    "fax": "6107270208",
                    "email": "DaBigGuy@bohs.com",
                    "comments": "Who is da man?!?!"
                },
                "subContactInfo": {
                    "title": null,
                    "firstName": null,
                    "middleName": null,
                    "lastName": null,
                    "phone": null,
                    "fax": null,
                    "email": null,
                    "comments": null
                },
                "featureList": [
                    {
                        "id": 2,
                        "name": "AngularApprovalsForOU",
                        "enabled": false
                    },
                    {
                        "id": 3,
                        "name": "AngularReconcileForOU",
                        "enabled": false
                    },
                    {
                        "id": 4,
                        "name": "AngularAbsenceRequestForOU",
                        "enabled": true
                    },
                    {
                        "id": 8,
                        "name": "Sidekick",
                        "enabled": false
                    },
                    {
                        "id": 9,
                        "name": "AngularAbsenteeReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 10,
                        "name": "AngularSubSignInReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 11,
                        "name": "AngularDailyReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 12,
                        "name": "AngularApprovalStatusReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 13,
                        "name": "AngularMonthlySummaryReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 14,
                        "name": "AngularCallHistoryReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 15,
                        "name": "AngularFeedbackReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 16,
                        "name": "AngularDOWAbsenceAnalysisReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 17,
                        "name": "AngularInteractiveReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 18,
                        "name": "AngularSubHistoryByDateReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 19,
                        "name": "AngularSubExcludedReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 20,
                        "name": "AngularStaffListReportForOU",
                        "enabled": false
                    },
                    {
                        "id": 21,
                        "name": "IDM",
                        "enabled": true
                    },
                    {
                        "id": 23,
                        "name": "IDMisIdentityProvider",
                        "enabled": false
                    },
                    {
                        "id": 24,
                        "name": "SidekickNavigator",
                        "enabled": false
                    },
                    {
                        "id": 25,
                        "name": "SidekickCampus",
                        "enabled": false
                    },
                    {
                        "id": 26,
                        "name": "ChangeLogImpersonation",
                        "enabled": false
                    },
                    {
                        "id": 27,
                        "name": "FrontlineInstitute",
                        "enabled": false
                    },
                    {
                        "id": 28,
                        "name": "SidekickRemote",
                        "enabled": false
                    },
                    {
                        "id": 29,
                        "name": "EventSynching",
                        "enabled": false
                    },
                    {
                        "id": 30,
                        "name": "InAppDashboard",
                        "enabled": false
                    },
                    {
                        "id": 31,
                        "name": "AbsenceAwareOfTASchedule",
                        "enabled": false
                    },
                    {
                        "id": 32,
                        "name": "EventPublishing",
                        "enabled": false
                    },
                    {
                        "id": 33,
                        "name": "Zendesk",
                        "enabled": true
                    },
                    {
                        "id": 34,
                        "name": "MosAlwaysMigratable",
                        "enabled": true
                    },
                    {
                        "id": 35,
                        "name": "IDM_ShadowMigration",
                        "enabled": true
                    },
                    {
                        "id": 38,
                        "name": "ExcludedCommentsRequired",
                        "enabled": true
                    },
                    {
                        "id": 39,
                        "name": "IDM_ShadowMigration",
                        "enabled": true
                    },
                    {
                        "id": 40,
                        "name": "PermissionSyncing",
                        "enabled": false
                    },
                    {
                        "id": 41,
                        "name": "SharedAppAccess",
                        "enabled": false
                    }
                ],
                "orgStatus": {
                    "statusTypeId": 1
                },
                "userVoiceSSOToken": "bmexnXXjcs27LbFKa4GMGz9QxD0%2fv3%2bQ0fMgbwN2PD7DW3EOcDWIqzd0TtacRPlrtWQ7oumDiyVBLyoct%2fpTGMLMCyUaE0k2bKD3AAUln5hiVv2BMRwDvXjOrXP9iY%2b0xBKSC3B6uPv8Nd2asZ8cL8towu6JYMiH235tzsiQ5RU%3d"
            }
        ],
        "messages": [
            
        ],
        "success": true,
        "modelState": {
            
        }
    }
}
