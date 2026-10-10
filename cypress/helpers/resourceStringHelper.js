const ResourceStrings = require('../fixtures/BaseAesopAppMocking/resourceStrings')


const resourceStringFixture = (cy) => {
	cy.server();

	cy.window().then(function(win) {
		//hack, push this right into the localStorage to avoid issue with large XHR request payloads and cypress bug. see ResourceStrings.js for more information
		//TODO refactor into ResourceStrings file
		cy.window().then(win => win.localStorage.setItem('i18nStrings-1', JSON.stringify(ResourceStrings().getLocalStoragePayload()) ));
	});

    cy.route({
	      method: 'PUT',
	      url: '/api/v1.0/resources?locId=1',
	      response:{
			"data": [
				{
					"mnemonic": "VisibilityCalculator.Dialog.Text",
					"resolved": "Visibility Calculator"
				},
				{
					"mnemonic": "Close",
					"resolved": "Close"
				},
				{
					"mnemonic": "CustomDay",
					"resolved": "Custom Day"
				},
				{
					"mnemonic": "HalfDayPM",
					"resolved": "Half Day PM"
				},
				{
					"mnemonic": "HalfDayAM",
					"resolved": "Half Day AM"
				},
				{
					"mnemonic": "FullDay",
					"resolved": "Full Day"
				},
				{
					"mnemonic": "VacancyTimesInvalid",
					"resolved": "The end time cannot be earlier or equal to the start time"
				},
				{
					"mnemonic": "AbsenceTimesInvalid",
					"resolved": "The end time cannot be earlier or equal to the start time"
				},
				{
					"mnemonic": "NoteToAdminRequired",
					"resolved": "The Absence Reason \"{0}\" requires the Notes to Administrator field to be filled in."
				},
				{
					"mnemonic": "VacancyNoteToAdminRequired",
					"resolved": "The Vacancy Reason \"{0}\" requires the Notes to Administrator field to be filled in."
				},
				{
					"mnemonic": "CreateAbsence.text.HoursSubWorkedInvalid",
					"resolved": "Hours Sub Worked must be a valid number between 0 and 24"
				},
				{
					"mnemonic": "CreateAbsence.text.NonPayTimeInvalid",
					"resolved": "Non Pay Time is Invalid"
				},
				{
					"mnemonic": "MissingInstitution",
					"resolved": "Please select a school"
				},
				{
					"mnemonic": "CreateAbsence.text.StartDateCannotBeAfterEndDate",
					"resolved": "Start date cannot be after End date"
				},
				{
					"mnemonic": "CreateAbsence.text.EndDateCannotBeBeforeStartDate",
					"resolved": "End date cannot be before Start date"
				},
				{
					"mnemonic": "CreateAbsence.text.EndTimeInvalid",
					"resolved": "Absence End Time is invalid"
				},
				{
					"mnemonic": "CreateAbsence.text.VacancyEndInvalid",
					"resolved": "Substitute Report End Time is invalid"
				},
				{
					"mnemonic": "CreateAbence.text.EndTimeRequired",
					"resolved": "Absence End Time is required"
				},
				{
					"mnemonic": "CreateAbence.text.VacancyEndRequired",
					"resolved": "Substitute Report End time is required"
				},
				{
					"mnemonic": "CreateAbsence.text.StartTimeInvalid",
					"resolved": "Absence Start Time is invalid"
				},
				{
					"mnemonic": "CreateAbsence.text.VacancyStartInvalid",
					"resolved": "Substitute Report Start Time is invalid"
				},
				{
					"mnemonic": "CreateAbence.text.StartTimeRequired",
					"resolved": "Absence Start Time is required"
				},
				{
					"mnemonic": "CreateAbence.text.VacancyStartRequired",
					"resolved": "Substitute Report Start time is required"
				},
				{
					"mnemonic": "CreateAbsence.text.StartDateIsRequired",
					"resolved": "Start Date is required"
				},
				{
					"mnemonic": "CreateAbsence.text.StartDateIsInvalid",
					"resolved": "Start Date is invalid"
				},
				{
					"mnemonic": "CreateAbsence.text.EndDateIsRequired",
					"resolved": "End Date is required"
				},
				{
					"mnemonic": "CreateAbsence.text.EndDateIsInvalid",
					"resolved": "End Date is invalid"
				},
				{
					"mnemonic": "MissingEntitlementType",
					"resolved": "Please select an absence reason"
				},
				{
					"mnemonic": "MissingVacancyType",
					"resolved": "Please select a Vacancy Reason"
				},
				{
					"mnemonic": "Popup.Text.Button.SaveAndContinue",
					"resolved": "Save and Continue"
				},
				{
					"mnemonic": "Popup.Text.Button.EditAbsence",
					"resolved": "Edit Absence"
				},
				{
					"mnemonic": "FortheVacancy",
					"resolved": "For the Vacancy"
				},
				{
					"mnemonic": "FortheAbsence",
					"resolved": "For the Absence"
				},
				{
					"mnemonic": "EnterCancelNotes",
					"resolved": "Enter Cancel Notes"
				},
				{
					"mnemonic": "SelectCancelReason",
					"resolved": "Select Cancel Reason"
				},
				{
					"mnemonic": "No",
					"resolved": "No"
				},
				{
					"mnemonic": "Yes",
					"resolved": "Yes"
				},
				{
					"mnemonic": "Success",
					"resolved": "Success"
				},
				{
					"mnemonic": "Deleted",
					"resolved": "Deleted"
				},
				{
					"mnemonic": "Delete",
					"resolved": "Delete"
				},
				{
					"mnemonic": "Absence",
					"resolved": "Absence"
				},
				{
					"mnemonic": "Vacancy",
					"resolved": "Vacancy"
				},
				{
					"mnemonic": "Vacancy.Modify.Text.ConfirmDelete",
					"resolved": "Are you sure you want to delete Vacancy #"
				},
				{
					"mnemonic": "Absence.Modify.Text.ConfirmDelete",
					"resolved": "Are you sure you want to delete Absence #"
				},
				{
					"mnemonic": "Vacancy.Modify.Text.ConfirmTimesheetData",
					"resolved": "This vacancy has associated time sheet data.  Are you sure you want to modify this vacancy?"
				},
				{
					"mnemonic": "Absence.Modify.Text.ConfirmTimesheetData",
					"resolved": "This absence has associated time sheet data.  Are you sure you want to modify this absence?"
				},
				{
					"mnemonic": "Warning",
					"resolved": "Warning"
				},
				{
					"mnemonic": "Confirm",
					"resolved": "Confirm"
				},
				{
					"mnemonic": "Cancel",
					"resolved": "Cancel"
				},
				{
					"mnemonic": "ReassignToNewSub",
					"resolved": "Reassign to New Sub"
				},
				{
					"mnemonic": "assignSub.Dialog.header.text",
					"resolved": "Assign Substitute for"
				},
				{
					"mnemonic": "permSubDialog.Message.text",
					"resolved": "has already been assigned as a permanent substitute for this absence.  Would you like to re-assign this absence to another substitute"
				},
				{
					"mnemonic": "SelectAtLeastOneDate",
					"resolved": "Please select at least one date."
				},
				{
					"mnemonic": "CreateAbsence.text.AbsenceTimeInvalid",
					"resolved": "Absence Time is Invalid"
				},
				{
					"mnemonic": "CreateAbsence.text.AbsenceTimeRequired",
					"resolved": "Absence Time required"
				},
				{
					"mnemonic": "Custom",
					"resolved": "Custom"
				}
			],
			"messages": [],
			"success": true,
			"modelState": {}
		}
	});

};

module.exports = resourceStringFixture;