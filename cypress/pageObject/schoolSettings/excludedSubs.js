const baseSelector = `.route-settings-school-details-school-excluded-substitutes`;

const SELECTORS = {
	heading: `${baseSelector} .section-heading`,
	topAddSubsBtn: `${baseSelector} .actions-header .substitute-actions .fl-button.fl-positive`,
	bottomAddSubsBtn: `${baseSelector} .actions-footer .substitute-actions .fl-button.fl-positive`,
	nameColumn: `${baseSelector} .name-th`,
	commentsColumn: `${baseSelector} .comments-th`,
	selectColumn: `${baseSelector} .select-th`,
	actionColumn: `${baseSelector} .action-th`,
	requiredComment: `${baseSelector} .required-field`,
	saveComment: `${baseSelector} button[title="Save"]`,
	cancelComment: `${baseSelector} button[title=Cancel]`,
	excludedComment: `${baseSelector} textarea[name="commentsExcluded"]`,
	comment: `${baseSelector} textarea`,
	errorMessage: `${baseSelector} .validation-messages`,
	errorChar: `${baseSelector} .icon.fa-exclamation`,
	topRemoveSubBtn: `${baseSelector} .actions-header .substitute-actions .fl-button.fl-negative`,
	bottomRemoveSubBtn: `${baseSelector} .actions-footer .substitute-actions .fl-button.fl-negative`,
	trashIcon: `${baseSelector} .fa.fa-trash-o`,
	topNextBtn: `.header .actions .fl-button.fl-positive`,
	topNextBtn: `.footer .actions .fl-button.fl-positive`,
	selectedSubsHeader: ".selected-subs .header",
	noSelectedSubs: `.selected-subs .no-subs-selected`,

};

module.exports = SELECTORS;