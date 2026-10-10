module.exports = function() {
	return {
        "data": {
            "pastAbsenceDate": "1/18/2018",
            "dragSelectDOW": [
                false,
                true,
                true,
                true,
                true,
                true,
                false
            ],
            "selectableDOW": [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            "editMode": true,
            "editDates": true,
            "editInstitution": false,
            "editEntitlementType": true,
            "editAbsenceTimes": true,
            "editVacancyTimes": true,
            "editUserSpecifiedAbsenceDuration": true,
            "editNonPayTime": true,
            "editBudgetCode": true,
            "editPayCode": false,
            "editHoursSubWorked": false,
            "editAccountingCode": true,
            "editNotes": true,
            "editNotesToAdmin": true,
            "editAdminNotesOnly": true,
            "editNeedSub": true,
            "canAssignSub": true,
            "canRemoveSub": false,
            "canSplit": true,
            "canReconcile": true,
            "canReconcileAll": true,
            "showAvailableSubs": true,
            "canPreventSubRemovedNotification": true,
            "canPunishSubWhenRemoving": false,
            "leadTimeHoursForPunishSub": 12,
            "showRenotifySub": false,
            "showGrossPayAmount": false,
            "needSub": 2,
            "allowCustomAbsenceTimes": true,
            "hasTimeSheetData": false,
            "showEntitlementType": true,
            "showInstitution": false,
            "showVacancyTimes": true,
            "showAbsenceTime": true,
            "showNonPayTime": true,
            "showPayCode": false,
            "showBudgetCode": true,
            "showAccountingCode": true,
            "canHold": true,
            "canEdit": true,
            "canDelete": false,
            "showNotesToAdmin": true,
            "showNotesToAdminOnly": true,
            "showUploadFiles": true,
            "showApprovalStatus": true,
            "showHoursSubWorked": false,
            "earliestAbsenceDate": "1/18/2017",
            "absenceShiftTypeMode": 2,
            "usingCancelClosedMode": false,
            "absenceShiftTypes": [
                {
                    "id": 1,
                    "value": "Full Day"
                },
                {
                    "id": 2,
                    "value": "Half Day AM"
                },
                {
                    "id": 3,
                    "value": "Half Day PM"
                },
                {
                    "id": 4,
                    "value": "Custom"
                }
            ],
            "vacancyShiftTypes": [
                {
                    "id": 1,
                    "value": "Full Day"
                },
                {
                    "id": 2,
                    "value": "Half Day AM"
                },
                {
                    "id": 3,
                    "value": "Half Day PM"
                },
                {
                    "id": 4,
                    "value": "Custom"
                }
            ],
            "holdOptions": [
                {
                    "id": "DoNotHoldAbsenceRequest",
                    "value": "No Hold"
                },
                {
                    "id": "HoldFor10Minutes",
                    "value": "Hold For 10 Minute(s)"
                },
                {
                    "id": "HoldFor30Minutes",
                    "value": "Hold For 30 Minute(s)"
                },
                {
                    "id": "HoldFor1Hour",
                    "value": "Hold For 1 Hour(s)"
                },
                {
                    "id": "HoldFor2Hours",
                    "value": "Hold For 2 Hour(s)"
                },
                {
                    "id": "HoldFor4Hours",
                    "value": "Hold For 4 Hour(s)"
                },
                {
                    "id": "HoldFor12Hours",
                    "value": "Hold For 12 Hour(s)"
                },
                {
                    "id": "HoldFor1Day",
                    "value": "Hold For 1 Day(s)"
                },
                {
                    "id": "HoldUntil1DayBeforeAbsenceRequestStart",
                    "value": "Hold Until 1 Day(s) before Absence Start"
                },
                {
                    "id": "HoldUntil12HoursBeforeAbsenceRequestStart",
                    "value": "Hold Until 12 Hour(s) before Absence Start"
                },
                {
                    "id": "HoldUntil4HoursBeforeAbsenceRequestStart",
                    "value": "Hold Until 4 Hour(s) before Absence Start"
                },
                {
                    "id": "HoldUntil2HoursBeforeAbsenceRequestStart",
                    "value": "Hold Until 2 Hour(s) before Absence Start"
                },
                {
                    "id": "HoldUntil1HourBeforeAbsenceRequestStart",
                    "value": "Hold Until 1 Hour(s) before Absence Start"
                },
                {
                    "id": "HoldUntilAbsenceRequestStart",
                    "value": "Hold Until Absence Start"
                },
                {
                    "id": "HoldIndefinitely",
                    "value": "Hold Indefinitely"
                }
            ],
            "defaultHoldOption": "HoldFor10Minutes",
            "isHeld": false,
            "InstitutionSettings": [
                {
                    "id": 147026,
                    "defaultAbsenceStartTime": "08:00:00",
                    "defaultAbsenceHalfDayAMEndTime": "11:30:00",
                    "defaultAbsenceHalfDayPMStartTime": "12:30:00",
                    "defaultAbsenceEndTime": "16:00:00",
                    "subDefaultAbsenceStartTime": "08:00:00",
                    "subDefaultAbsenceHalfDayAMEndTime": "11:30:00",
                    "subDefaultAbsenceHalfDayPMStartTime": "12:30:00",
                    "subDefaultAbsenceEndTime": "16:00:00",
                    "hasSubDefaultTimes": false,
                    "defaultVacancyStartOffsetMinutes": 0,
                    "defaultVacancyEndOffsetMinutes": 0,
                    "accountingCodeType": "PredefinedOrFreeform"
                }
            ]
        },
        "messages": [],
        "success": true,
        "modelState": {}
    }
}
        