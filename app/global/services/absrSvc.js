(function () {
	'use strict'; var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Service (absrSvc) -----# //
	app.factory('absrSvc', function ($q, absrStateVal, stringSvc, orgSvc, dateHelp, absenceRequestApi, workerApi, 
				toastHelp, ngDialog, iconHelp, absrVariationHelp, arrayHelp, regexExpressionsVal, substituteApi, institutionSvc, 
				storageSvc,locationHelp,$location,$state,scrollHelp, navUrlMappingSvc, tokenSvc, config, $log, $window) {

		//Create an entry in session storage with name "absrSvcDebug" and value {"data":{"debug":true}}
		let debug = storageSvc.load("absrSvcDebug") != null;

		var validation;
		var stateValErrorMessageObj = {
			administratorNotes: []
		};
		var variationErrorMessageObj = {
			startDate: [],
			endDate: [],
			dates: [],
			institution: [],
			entitlementType: [],
			absenceStartTime: [],
			absenceEndTime: [],
			vacancyStartTime: [],
			vacancyEndTime: [],
			timeAbsent: [],
			nonPayTime: [],
			subHourWorked: [],
			payCode: []
		};

		var strings = stringSvc.getStrings([
			'Custom',
			'CreateAbsence.text.AbsenceTimeRequired',
			'CreateAbsence.text.AbsenceTimeInvalid',
			'SelectAtLeastOneDate',
			'permSubDialog.Message.text',
			'assignSub.Dialog.header.text',
			'ReassignToNewSub',
			'Cancel',
			'Confirm',
			'Warning',
			'Absence.Modify.Text.ConfirmTimesheetData',
			'Vacancy.Modify.Text.ConfirmTimesheetData',
			'Absence.Modify.Text.ConfirmDelete',
			'Vacancy.Modify.Text.ConfirmDelete',
			'Vacancy',
			'Absence',
			'Delete',
			'Deleted',
			'Success',
			'Yes',
			'No',
			'SelectCancelReason',
			'EnterCancelNotes',
			'FortheAbsence',
			'FortheVacancy',
			'Popup.Text.Button.EditAbsence',
			'Popup.Text.Button.SaveAndContinue',
			'MissingVacancyType',
			'MissingEntitlementType',
			'CreateAbsence.text.EndDateIsInvalid',
			'CreateAbsence.text.EndDateIsRequired',
			'CreateAbsence.text.StartDateIsInvalid',
			'CreateAbsence.text.StartDateIsRequired',
			'CreateAbence.text.VacancyStartRequired',
			'CreateAbence.text.StartTimeRequired',
			'CreateAbsence.text.VacancyStartInvalid',
			'CreateAbsence.text.StartTimeInvalid',
			'CreateAbence.text.VacancyEndRequired',
			'CreateAbence.text.EndTimeRequired',
			'CreateAbsence.text.VacancyEndInvalid',
			'CreateAbsence.text.EndTimeInvalid',
			'CreateAbsence.text.EndDateCannotBeBeforeStartDate',
			'CreateAbsence.text.StartDateCannotBeAfterEndDate',
			'MissingInstitution',
			'CreateAbsence.text.NonPayTimeInvalid',
			'CreateAbsence.text.HoursSubWorkedInvalid',
			'VacancyNoteToAdminRequired',
			'NoteToAdminRequired',
			'AbsenceTimesInvalid',
			'VacancyTimesInvalid',
			'AlreadyOnThisAbsence',
			'AlreadyOnThisVacancy',
			'Dialog.Title.UnsavedChangesConfirmation',
			'Dialog.Text.AbsenceChangeConfirm',
			'SaveChanges',
			'Cancel',
			'AvailableSubstitute.Text.ConfirmUnlock',
			'Unlock',
			'ExitAndUnlock',
			'ExitAndMaintainLock',
			'UnpaidBreak',
    		'CustomBreak',
    		'DefaultBreak',
			'AbsenceForm.Button.RemoveSub',
			'AbsenceForm.Button.MoreOptionsOnNextStep',
			'UserAccess.Text.Continue',
			'DR.Tab.Table.Data.Text.Sub',
			'And'
		]);

		var blankAbsrStateVal = {
			absrVariations: [{
				startDate: null, endDate: null, dates: [], institution: null, entitlementType: null,
				nonPayTime: 0, timeAbsent: null, subHourWorked: null,
				budgetCode: null, accountingCode: null, customAccountingCode: '', payCode: null,
				absenceShiftType: null, vacancyShiftType: null,
				absenceStartTime: null, vacancyStartTime: null, absenceEndTime: null, vacancyEndTime: null, timeIsLinked: true,
				isEditable: true, expanded: true,
				errors: angular.copy(variationErrorMessageObj),
				isDeletable: true
			}],
			id: 0, worker: null, holdOption: null, heldUntil: null, needSub: true, substitute: null, absrInstIds: [],
			administratorNotes: '', substituteNotes: '', adminOnlyNotes: '', grossPayout: null,
			uploadedFiles: [], relatedFiles: [], expanded: true,
			errors: [], warnings: [], errorElement: null, override: {}, lastUpdated: new Date(), dbLastUpdatedTimeStamp: new Date(),
			absr: null, related: null, closedDays: null, editMode: true, lastFetch: new Date(), numVacancies: 1,
			stateValErrors: angular.copy(stateValErrorMessageObj),
			variationsByAbsenceNumber: [], isLongTerm: false
		};

		function resetState(val) {
			Object.keys(absrStateVal).forEach(function (key) {
				delete absrStateVal[key];
			});
			var value = (val) ? val : blankAbsrStateVal;
			Object.keys(value).forEach(function (key) {
				absrStateVal[key] = angular.copy(value[key]);
			});
			setAbsrInstIds();
		}

		function stateValToAbsrModel(stateVal, createMode = false) {

			var absrModel = {
				id: stateVal.id || 0,
				needSub: stateVal.needSub,
				isLongTerm: stateVal.isLongTerm,
				worker: stateVal.worker && { id: stateVal.worker.id } || null,
				substitute: stateVal.substitute && { id: stateVal.substitute.id } || null,
				notes: stateVal.substituteNotes,
				notesToAdmin: stateVal.administratorNotes,
				notesToAdminOnly: stateVal.adminOnlyNotes,
				holdOption: stateVal.holdOption == null ? null : stateVal.holdOption.id,
				lastUpdated: stateVal.lastUpdated,
				dbLastUpdatedTimeStamp: stateVal.dbLastUpdatedTimeStamp,
				absences: []
			};

			stateVal.variationsByAbsenceNumber = [];
			if (!createMode) {				
				if (storageSvc.load("selectedView") == 'btnDay' && stateVal.absr != null && stateVal.absr.absences != null) {
					var absences = stateVal.absr.absences;
					var oldAbsences = [];
					stateVal.absrVariations.forEach(function (variation) {
						variation.absences.forEach(function(absence){
							oldAbsences.push(absence);
						});
					});
					absences.forEach(function (absence) {
						var absExists = getVariationAbsByDate(oldAbsences, absence.date).length > 0;
						setDefaultBreakTime(absence.institution.id);
						absence.id = absExists ? absence.id : 0;
						absence.shiftType = absence.shiftType.id || absence.shiftType;
						absence.substituteShiftType = (absence.substituteShiftType == null 	
							? null 	//If NULL, keep it NULL
							: absence.substituteShiftType.id || absence.substituteShiftType);
						absence.date = dateHelp.formatDate(new Date(absence.date), 'MM/dd/yyyy');
						absence.lastUpdated = absExists ? absence.lastUpdated : '';
						absence.UpdateReconcileState = absExists ? absence.UpdateReconcileState : null;
						absence.deductBreakFromAbsenceDuration = (absence.deductCustomBreakTime && absence.doesBreakTimeOverlapAbsenceTimes) || (absrStateVal.context && absrStateVal.context.CanViewBreakTime && !absrStateVal.context.CanEditBreakTime),
						absence.doesBreakTimeOverlapAbsenceTimes = absence.doesBreakTimeOverlapAbsenceTimes;
						absence.deductCustomBreakTime = absence.deductCustomBreakTime;
						absence.halfDayAMEndTime = absence.breakStartTime;
						absence.halfDayPMStartTime = absence.breakEndTime;
						absence.IsBreakTimeEdited = !(absence.deductCustomBreakTime == null ? true : absence.deductCustomBreakTime)
								|| ((absence.deductCustomBreakTime && absence.doesBreakTimeOverlapAbsenceTimes) ? 
									(((dateHelp.convertTimeToMilitaryTime(absence.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) 
									&& dateHelp.convertTimeToMilitaryTime(absence.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(absence.breakStartTime)) 
									|| (dateHelp.convertTimeToMilitaryTime(absence.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) 
										&& dateHelp.convertTimeToMilitaryTime(absence.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absence.absenceEndTime)))? true :false):false);
						if (absence.accountingCode && absence.accountingCode.id === 0) {
							absence.accountingCode.name = absence.customAccountingCode;
							absence.accountingCode.isFreeForm = true;
						}
						absrModel.absences.push(absence);
						stateVal.variationsByAbsenceNumber.push(absence);
					});
				} else {					
					createVariationAbsrModel(stateVal,absrModel);
				}
			} else {
					createAbsenceAbsrModel(stateVal,absrModel);
			}

			return absrModel;
		}

		function createAbsenceAbsrModel(stateVal,absrModel){
			stateVal.absrVariations.forEach(function (variation) {
				
				variation.dates.forEach(function (date, index) {
					var absExists = variation.absences && getVariationAbsByDate(variation.absences, date).length > 0;
					setDefaultBreakTime(variation.institution.id);
					var absence = {
						id: absExists ? getVariationAbsByDate(variation.absences, date)[0].id : 0,
						date: date,
						institution: variation.institution,
						entitlement: variation.entitlementType,
						shiftType: variation.absenceShiftType,
						accountingCode: variation.accountingCode,
						payCode: variation.payCode,
						budgetCode: variation.budgetCode ,
						absenceStartTime: variation.absenceStartTime,
						absenceEndTime: variation.absenceEndTime,
						substituteStartTime: variation.vacancyStartTime,
						substituteEndTime: variation.vacancyEndTime,
						substituteShiftType: variation.vacancyShiftType,
						nonPayTime: variation.nonPayTime,
						userSpecifiedAbsenceDuration: variation.timeAbsent,
						hoursSubWorked: variation.subHourWorked,
						timesAreLinked: variation.timeIsLinked,
						isDeletable: variation.isDeletable,
						//these two properties are used on the reconcile details page
						lastUpdated: absExists ? getVariationAbsByDate(variation.absences, date)[0].lastUpdated : '',
						//isReconciled: variation.absences[index] && variation.absences[index].isReconciled,
						UpdateReconcileState: absExists ? getVariationAbsByDate(variation.absences, date)[0].UpdateReconcileState : null,
						deductBreakFromAbsenceDuration: (variation.deductCustomBreakTime && variation.doesBreakTimeOverlapAbsenceTimes) || (absrStateVal.context && absrStateVal.context.CanViewBreakTime && !absrStateVal.context.CanEditBreakTime),
						doesBreakTimeOverlapAbsenceTimes: variation.doesBreakTimeOverlapAbsenceTimes,
						deductCustomBreakTime: variation.deductCustomBreakTime,
						halfDayAMEndTime: variation.breakStartTime,
						halfDayPMStartTime: variation.breakEndTime,
						breakStartTime: variation.breakStartTime,
						breakEndTime: variation.breakEndTime,
						isBreakTimeEdited : !(variation.deductCustomBreakTime == null ? true : variation.deductCustomBreakTime)
								|| ((variation.deductCustomBreakTime && variation.doesBreakTimeOverlapAbsenceTimes) ? 
									(((dateHelp.convertTimeToMilitaryTime(variation.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) 
									&& dateHelp.convertTimeToMilitaryTime(variation.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variation.breakStartTime)) 
									|| (dateHelp.convertTimeToMilitaryTime(variation.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) 
										&& dateHelp.convertTimeToMilitaryTime(variation.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variation.absenceEndTime)))? true :false):false)
						//------------------------------------------------------------
					};

					if (absence.accountingCode && absence.accountingCode.id === 0) {
						absence.accountingCode.name = variation.customAccountingCode;
						absence.accountingCode.isFreeForm = true;
					}

					absrModel.absences.push(absence);
					stateVal.variationsByAbsenceNumber.push(variation);

				});
			});
		}

		function createVariationAbsrModel(stateVal,absrModel){
			stateVal.absrVariations.forEach(function (variation) {
				var inst = institutionSvc.oneById(variation.institution.id);
				setDefaultBreakTime(variation.institution.id);
				variation.dates.forEach(function (date, index) {
					var absExists = variation.absences && getVariationAbsByDate(variation.absences, date).length > 0;
					var absence = {
						id: absExists ? getVariationAbsByDate(variation.absences, date)[0].id : 0,
						date: date,
						institution: {
							id: variation.institution.id,
							data: {
								startTime: inst.startTime,
								endTime: inst.endTime,
								HoursPerDay: inst.HoursPerDay,
								MaxAbsenceDuration: inst.MaxAbsenceDuration,
								MinAbsenceDuration: inst.MinAbsenceDuration
							}

						},
						entitlement: { id: variation.entitlementType.id },
						shiftType: variation.absenceShiftType.id,
						accountingCode: variation.accountingCode && { id: variation.accountingCode.id } || null,
						payCode: variation.payCode && { id: variation.payCode.id } || null,
						budgetCode: variation.budgetCode && { id: variation.budgetCode.id } || null,
						absenceStartTime: variation.absenceStartTime,
						absenceEndTime: variation.absenceEndTime,
						substituteStartTime: variation.vacancyStartTime,
						substituteEndTime: variation.vacancyEndTime,
						substituteShiftType: variation.vacancyShiftType && variation.vacancyShiftType.id,
						nonPayTime: variation.nonPayTime,
						userSpecifiedAbsenceDuration: variation.timeAbsent,
						hoursSubWorked: variation.subHourWorked,
						timesAreLinked: variation.timeIsLinked,
						//these two properties are used on the reconcile details page
						lastUpdated: absExists ? getVariationAbsByDate(variation.absences, date)[0].lastUpdated : '',
						//isReconciled: variation.absences[index] && variation.absences[index].isReconciled,
						UpdateReconcileState: absExists ? getVariationAbsByDate(variation.absences, date)[0].UpdateReconcileState : null,
						deductBreakFromAbsenceDuration: (variation.deductCustomBreakTime && variation.doesBreakTimeOverlapAbsenceTimes) || (absrStateVal.context && absrStateVal.context.CanViewBreakTime && !absrStateVal.context.CanEditBreakTime),
						doesBreakTimeOverlapAbsenceTimes: variation.doesBreakTimeOverlapAbsenceTimes,
						deductCustomBreakTime: variation.deductCustomBreakTime,
						halfDayAMEndTime: variation.breakStartTime,
						halfDayPMStartTime: variation.breakEndTime,
						isBreakTimeEdited : !(variation.deductCustomBreakTime == null ? true : variation.deductCustomBreakTime)
								|| ((variation.deductCustomBreakTime && variation.doesBreakTimeOverlapAbsenceTimes) ? 
									(((dateHelp.convertTimeToMilitaryTime(variation.breakStartTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime) 
									&& dateHelp.convertTimeToMilitaryTime(variation.absenceStartTime) != dateHelp.convertTimeToMilitaryTime(variation.breakStartTime)) 
									|| (dateHelp.convertTimeToMilitaryTime(variation.breakEndTime) != dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime) 
										&& dateHelp.convertTimeToMilitaryTime(variation.breakEndTime) != dateHelp.convertTimeToMilitaryTime(variation.absenceEndTime)))? true :false):false)
						//------------------------------------------------------------
					};

					if (absence.accountingCode && absence.accountingCode.id === 0) {
						absence.accountingCode.name = variation.customAccountingCode;
						absence.accountingCode.isFreeForm = true;
					}

					absrModel.absences.push(absence);
					stateVal.variationsByAbsenceNumber.push(variation);

				});
			});
		}

		function getVariationAbsByDate(absences, date) {
			return absences.filter(function (abs) {
				return (new Date(abs.date)).getTime() === (new Date(date)).getTime();
			});
		}

		function findSelected(value, options, field) {
			if (value == null || options == null) { return null; }
			field = field || 'id';
			return options.filter(function (opt) { return opt[field] === value; })[0];
		}

		function absrModelToStateVal(absrModel, context, related) {
			related = related || [];
			var worker = absrModel.worker,
				// hashmap to translate variation properties into absence properties
				// variationPropName: absencePropName
				keyMap = {
					absenceShiftType: 'shiftType',
					vacancyShiftType: 'substituteShiftType',
					vacancyStartTime: 'substituteStartTime',
					vacancyEndTime: 'substituteEndTime'
				},
				// the state val we are constructing
				stateVal = {
					id: absrModel.id,
					needSub: absrModel.needSub,
					isLongTerm: absrModel.isLongTerm,
					substitute: absrModel.substitute,
					worker: {
						id: worker.id,
						identifier: worker.identity,
						isVacancy: worker.isVacancy,
						isVacancyPrivate: worker.isVacancyPrivate,
						name: worker.isVacancy ? worker.lastName : worker.lastName + ', ' + worker.firstName,
						phone: worker.phone,
						school: worker.institution.length === 0 ? null : worker.institution[0].name,
						schools: worker.institution.map(function (v) {
							return {
								id: v.id,
								value: v.name,
								data: {
									startTime: v.startTime,
									endTime: v.endTime,
									HoursPerDay: v.HoursPerDay,
									MaxAbsenceDuration: v.MaxAbsenceDuration,
									MinAbsenceDuration: v.MinAbsenceDuration
								}

							};
						}),
						workerType: worker.workerType,
						DeductBreakFromAbsenceDuration: worker.DeductBreakFromAbsenceDuration
					},
					substituteNotes: absrModel.notes,
					administratorNotes: absrModel.notesToAdmin,
					adminOnlyNotes: absrModel.notesToAdminOnly,
					holdOption: context.canHold && findSelected(absrModel.holdOption, context.holdOptions) || null,
					heldUntil: absrModel.heldUntil,
					context: context,
					expanded: true,
					errors: [],
					absrVariations: [],
					absr: absrModel,
					related: related,
					lastUpdated: absrModel.lastUpdated,
					dbLastUpdatedTimeStamp: absrModel.dbLastUpdatedTimeStamp,
					editMode: false,
					relatedFiles: [],
					uploadedFiles: [],
					warnings: [],
					grossPayout: context.showGrossPayAmount ? absrModel.grossPayAmount : null,
					lastFetch: (new Date()).getTime(),
					stateValErrors: angular.copy(stateValErrorMessageObj)
				};

			var absences = absrModel.absences;
			absences.forEach(function (absence) {
				var inst = institutionSvc.oneById(absence.institution.id);
				var date = dateHelp.formatDate(new Date(absence.date), 'MM/dd/yyyy'),
					absenceVariation = {
						startDate: null,
						endDate: null,
						absences: [absence],
						dates: [date],
						extensions: [],
						allowDeleted: true,
						absenceShiftType: findSelected(absence.shiftType, context.absenceShiftTypes,'id'),
						absenceStartTime: absence.absenceStartTime,
						absenceEndTime: absence.absenceEndTime,

						vacancyShiftType: findSelected(absence.substituteShiftType, context.vacancyShiftTypes,'id'),
						vacancyStartTime: absence.substituteStartTime,
						vacancyEndTime: absence.substituteEndTime,

						accountingCode: absence.accountingCode != null ? {
							id: absence.accountingCode.id,
							value: absence.accountingCode.name
						} : null,
						customAccountingCode: absence.accountingCode != null && absence.accountingCode.isFreeForm === true ? absence.accountingCode.name : null,
						budgetCode: absence.budgetCode != null ? {
							id: absence.budgetCode.id,
							value: absence.budgetCode.description
						} : null,
						entitlementType: absence.entitlement != null ? {
							id: absence.entitlement.id,
							value: absence.entitlement.name
						} : null,
						expanded: true,
						institution: {
							id: absence.institution.id,
							value: absence.institution.name,
							data: {
								startTime: inst.startTime,
								endTime: inst.endTime,
								HoursPerDay: inst.HoursPerDay,
								MaxAbsenceDuration: inst.MaxAbsenceDuration,
								MinAbsenceDuration: inst.MinAbsenceDuration
							}
						},
						isEditable: !(absence.readOnlyReason != null && absence.readOnlyReason.length > 0),
						readOnlyReason: absence.readOnlyReason ? absence.readOnlyReason.join('<br />') : '',
						isDeletable: absence.isDeletable,
						noDeleteReason: absence.noDeleteReason ? absence.noDeleteReason.join('<br />') : '',
						nonPayTime: absence.nonPayTime,
						payCode: absence.payCode != null ? {
							id: absence.payCode.id,
							value: absence.payCode.description
						} : null,
						subHourWorked: absence.hoursSubWorked,
						timeAbsent: absence.userSpecifiedAbsenceDuration,
						timeIsLinked: absence.timesAreLinked,
						breakStart: absence.BreakStart,
						breakEnd: absence.BreakEnd,
						deductCustomBreakTime: absence.DeductBreakFromAbsenceDuration,
						isReconciled: absence.isReconciled,
						isProcessed: absence.isProcessed,
						isLocked: absence.isLocked,
						isDirty: absence.isDirty
					},
					matchesVariation = stateVal.absrVariations.filter(function (variation) {
						var match = true,
							skipFields = ['absences', 'dates', 'errors', 'startDate', 'endDate'];

						Object.keys(variation).forEach(function (key) {
							// bail out early if this field is in our skip list
							if (skipFields.indexOf(key) !== -1) { return; }

							// check if the raw values match
							var valuesDontMatch = (
								variation[key] !== absenceVariation[key]
							);

							// the values don't match, but if we're dealing with an
							// object for selecting an item in a dropdown, compare the ids
							if (valuesDontMatch && angular.isObject(variation[key]) && angular.isObject(absenceVariation[key])) {
								valuesDontMatch = variation[key].id !== absenceVariation[key].id;
							}

							// if we are still under the delusion that this is a match
							// and the values don't actually match, correct our ignorance
							if (match && valuesDontMatch) { match = false; }
						});
						return match;
					})[0],
					matchesExtension = function (extensions, extensionIdToFind) {
						var match = false;
						var result = null;
						extensions.forEach(function (item, index, arr) {
							if (!match && item.extensionId == extensionIdToFind) {
								result = item;
								match = true;
							}
						});
						return result;
					},
					handleExtension = function (variation, extensionToUpsert, date) {
						var extension = matchesExtension(variation.extensions, extensionToUpsert);
						if (extension == null) {
							var newExtension = {
								extensionId: absence.extension, ct: 1, dates: [date],
								display: function () {
									if (this.extensionId == 0) return "XX";
									if (this.extensionId < 10) return "0" + this.extensionId;
									return this.extensionId;
								}
							};
							variation.extensions.push(newExtension);
						}
						else {
							extension.ct += 1;
							extension.dates.push(date);
						}
					}
					;

				if (absence.accountingCode && absence.accountingCode.isFreeForm) {
					strings.$promise.then(function () {
						absenceVariation.accountingCode = { id: 0, value: strings['Custom'] };
					});
				}

				if (matchesVariation) {
					matchesVariation.dates.push(date);
					matchesVariation.absences.push(absence);
					handleExtension(matchesVariation, absence.extension, date);
				} else {
					absenceVariation.errors = angular.copy(variationErrorMessageObj);

					handleExtension(absenceVariation, absence.extension, date);

					stateVal.absrVariations.push(absenceVariation);
				}
			});

			return stateVal;
		}

		function getStateValFromAbsence(absences, context, stateVal, syncViews){
			if (syncViews){
				stateVal.absrVariations = [];
			}			

			absences.forEach(function (absence) {
				if (absence.institution != null){
				var inst = institutionSvc.oneById(absence.institution.id);
				absence.institution.name = inst.name;
					var date = dateHelp.formatDate(new Date(absence.date), 'MM/dd/yyyy'),
						absenceVariation = {
							startDate: null,
							endDate: null,
							absences: [absence],
							dates: [date],
							extensions: [],
							allowDeleted: absence.allowDeleted != null ? absence.allowDeleted : null,
							absenceShiftType: findSelected(absence.shiftType.id, context.absenceShiftTypes),
							absenceStartTime: absence.absenceStartTime,
							absenceEndTime: absence.absenceEndTime,

							vacancyShiftType: findSelected(absence.substituteShiftType.id, context.vacancyShiftTypes),
							vacancyStartTime: absence.substituteStartTime,
							vacancyEndTime: absence.substituteEndTime,

							accountingCode: absence.accountingCode != null ? {
								id: absence.accountingCode.id,
								value: absence.accountingCode.name
							} : null,
							customAccountingCode: absence.accountingCode != null && absence.accountingCode.isFreeForm === true ? absence.accountingCode.name : null,
							budgetCode: absence.budgetCode != null ? {
								id: absence.budgetCode.id,
								value: absence.budgetCode.description
							} : null,
							entitlementType: absence.entitlement != null ? {
								id: absence.entitlement.id,
								value: absence.entitlement.name == null? absence.entitlement.value: absence.entitlement.name
							} : null,
							expanded: true,
							institution: {
								id: absence.institution.id,
								value: absence.institution.name,
								data: {
									startTime: inst.startTime,
									endTime: inst.endTime,
									HoursPerDay: inst.HoursPerDay,
									MaxAbsenceDuration: inst.MaxAbsenceDuration,
									MinAbsenceDuration: inst.MinAbsenceDuration
								}
							},
							isEditable: !(absence.readOnlyReason != null && absence.readOnlyReason.length > 0),
							readOnlyReason: absence.readOnlyReason ? absence.readOnlyReason.join('<br />') : '',
							isDeletable: absence.isDeletable,
							noDeleteReason: absence.noDeleteReason ? absence.noDeleteReason.join('<br />') : '',
							nonPayTime: absence.nonPayTime,
							payCode: absence.payCode != null ? {
								id: absence.payCode.id,
								value: absence.payCode.description
							} : null,
							subHourWorked: absence.hoursSubWorked,
							timeAbsent: absence.userSpecifiedAbsenceDuration,
							timeIsLinked: absence.timesAreLinked,
							breakEndTime: absence.breakEndTime,
							breakStartTime: absence.breakStartTime,
							deductCustomBreakTime: absence.deductCustomBreakTime,
							doesBreakTimeOverlapAbsenceTimes: absence.doesBreakTimeOverlapAbsenceTimes
						},
						matchesVariation = stateVal.absrVariations.filter(function (variation) {
							var match = true,
								skipFields = ['absences', 'dates', 'errors', 'startDate', 'endDate'];
							Object.keys(variation).forEach(function (key) {

								// bail out early if this field is in our skip list
								if (skipFields.indexOf(key) !== -1) { return; }

								// check if the raw values match
								var valuesDontMatch = (
									variation[key] !== absenceVariation[key]
								);

								// the values don't match, but if we're dealing with an
								// object for selecting an item in a dropdown, compare the ids
								if (valuesDontMatch && angular.isObject(variation[key]) && angular.isObject(absenceVariation[key])) {
									valuesDontMatch = variation[key].id !== absenceVariation[key].id;
								}

								// if we are still under the delusion that this is a match
								// and the values don't actually match, correct our ignorance
								if (match && valuesDontMatch) { match = false; }
							});
							return match;
						})[0],
						matchesExtension = function (extensions, extensionIdToFind) {
							var match = false;
							var result = null;
							extensions.forEach(function (item, index, arr) {
								if (!match && item.extensionId == extensionIdToFind) {
									result = item;
									match = true;
								}
							});
							return result;
						},
						handleExtension = function (variation, extensionToUpsert, date) {
							var extension = matchesExtension(variation.extensions, extensionToUpsert);
							if (extension == null) {
								var newExtension = {
									extensionId: absence.extension, ct: 1, dates: [date],
									display: function () {
										if (this.extensionId == 0) return "XX";
										if (this.extensionId < 10) return "0" + this.extensionId;
										return this.extensionId;
									}
								};
								variation.extensions.push(newExtension);
							}
							else {
								extension.ct += 1;
								extension.dates.push(date);
							}
						};

					if (absence.accountingCode && absence.accountingCode.isFreeForm) {
						strings.$promise.then(function () {
							absenceVariation.accountingCode = { id: 0, value: strings['Custom'] };
						});
					}

					if (matchesVariation) {
						matchesVariation.dates.push(date);
						matchesVariation.absences.push(absence);
						handleExtension(matchesVariation, absence.extension, date);
					} else {
						absenceVariation.errors = angular.copy(variationErrorMessageObj);
						handleExtension(absenceVariation, absence.extension, date);
						stateVal.absrVariations.push(absenceVariation);
					}
				}
			});
			if (stateVal.absrVariations.length > 0){
				stateVal.absrVariations = stateVal.absrVariations.filter(function(variation) { return variation.dates.length > 0});
			}
			
			return stateVal;
		}

		function checkLastAbsence(index){
			var currentAbsrStateVal = absrStateVal.absr == null? absrStateVal.absrVariations[0]: absrStateVal.absr;
			var thisAbsence = currentAbsrStateVal.absences[index];
			var otherAbsCount=0;
			var otherAbsIndex = 0;
			if(thisAbsence.isDeleted==true)
			{
			for (var i = currentAbsrStateVal.absences.length - 1; i >= 0; i--) {
				 if(currentAbsrStateVal.absences[i].isDeleted!=true)
					{
						otherAbsCount++;
						otherAbsIndex= i;
					}
			} 
			if(otherAbsCount==1)
			{
				currentAbsrStateVal.absences[otherAbsIndex].lastAbsence = true;
			}
		}
		else{
			for (var i = currentAbsrStateVal.absences.length - 1; i >= 0; i--) {
				if(currentAbsrStateVal.absences[i].lastAbsence == true){
					currentAbsrStateVal.absences[i].lastAbsence=false;  
				}

			}
			  
		}
		
		}

		function getVariationByAbsenceNumber(stateVal, absenceNumber) {
			return stateVal.variationsByAbsenceNumber[absenceNumber];
		}


		function setupAbsrState(id, editMode) {
			editMode = (editMode != null) ? editMode : absrStateVal.editMode || false;
			var _defer = $q.defer();
			var lockFailed = false;
			var errors = [];
			var getAbsr, getRelated;
			//var absrErrors=[],ctxErrors=[],relatedErrors=[];
			var loadAbsr;
			var absrStateTemp;

			getAbsr = absenceRequestApi.get({ absrid: id, accountingCodeData: true, timesheetData: true, feedbackTotalData: true, approvalCommentData: true });
			//getCtx = absenceRequestApi.context({absrid: id});
			getRelated = absenceRequestApi.relatedAbsrs({
				absrid: id,
				fields: 'id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked'
			});

			loadAbsr = $q.all({ absr: getAbsr, related: getRelated, i: institutionSvc.ready }).then(function (d) {
			   if(d.absr !=null && d.absr.isDeleted && !d.absr.isDenied)
			   {
					for(var i= d.absr.absences.length-1 ; i>=0; i--)
					{
					    if((d.absr.absences[i].closedDay == undefined) && (new Date(d.absr.absences[i].lastUpdated) < new Date(d.absr.dbLastUpdatedTimeStamp)))
						{
							d.absr.absences.splice(i,1);
						}
					} 
			   } 
				absrStateTemp = absrModelToStateVal(d.absr, d.absr.context, d.related);

				absrStateTemp.editMode = editMode;
				setFlags(absrStateTemp);
			}, function (err) {
				_defer.reject({ errors: err.$messages, lockFailed: lockFailed });
				return $q.reject(err.$messages);
			});


			loadAbsr.then(function () {
				var _d = $q.defer();

				if (editMode) {
					var lockAbsr = absenceRequestApi.lock({ absrid: id }, {});
					lockAbsr.then(function (data) {
						absrStateTemp.editMode = editMode;
					}, function (err) {
						errors = errors.concat(err.$messages);

						//update the current view to show the other person's lock
						if (absrStateVal && absrStateVal.absr) {
							absrStateVal.absr.isLocked = true;
						}
						lockFailed = true;
					}).then(_d.resolve);
				} else {
					_d.resolve();
				}

				return _d.promise;
			}).then(function () {
				if (errors.length > 0) {
					errors = errors.filter(function (el, i, a) {
						return i === a.indexOf(el);
					});
					_defer.reject({ errors: errors, lockFailed: lockFailed });
				} else {
					resetState(absrStateTemp);
					_defer.resolve();
				}
			});
			return _defer.promise;
		}

		function saveAbsence(stateVal, keepLock) {
			stateVal.override = stateVal.override || {};
			keepLock = (keepLock == null) ? false : keepLock;
			var currentView = storageSvc.load("selectedView");
			var currentLocation = $location.url().includes('absences/reconcile/details');
			if(currentLocation){
				storageSvc.save({
					key: 'selectedView',
					data: 'btnVariation',
					persistent: true
				});
			}

			var _defer = $q.defer(),
				saveAction = stateVal.id > 0 ? 'update' : 'create',
				params = {
					absrId: stateVal.id > 0 ? stateVal.id : null,
					numVacancies: stateVal.numVacancies || null,
					ignoreEntitlementBalanceOverage: !!stateVal.override.ignoreEntitlementBalanceOverage || null,
					ignoreSubOverworked: !!stateVal.override.ignoreSubOverworked || null,
					ignoreSubUnqualified: !!stateVal.override.ignoreSubUnqualified || null,
					keepLock: keepLock || null,
					reconcileMode: stateVal.reconcileMode == null ? false : true
				},
				validationResult = validate(stateVal),
				saveRequest;

			if (!validationResult.success) {
				stateVal.errorElement = validationResult.firstFailedVariation;
				return $q.reject();
			}

			//saveRequest = absenceRequestApi.save(params, stateValToAbsrModel(stateVal));
			
			saveRequest = absenceRequestApi[saveAction](params, stateValToAbsrModel(stateVal));
			saveRequest.then(
				function (absrData) {
					// if the returned ID differs from our stored ID (like when we create)
					// set the stateval id value
					if (stateVal.id !== absrData.absrId && stateVal.id !== absrData.id) {
						stateVal.id = absrData.absrId ? absrData.absrId : absrData.id;
					}
					// attach any uploaded files
					if (stateVal.uploadedFiles.length > 0) {
						var saveFiles = absenceRequestApi.files.save({ absrid: stateVal.id }, stateVal.uploadedFiles);
						saveFiles.then(function () {
							_defer.resolve(absrData);
						}, function () {
							_defer.resolve(absrData);
						});
					} else {
						_defer.resolve(absrData);
					}
					storageSvc.clear('alreadyAbsenceCheckRequired');
					storageSvc.save({
						key: 'selectedView',
						data: currentView,
						persistent: true
					});
				},
				function (rejectData) {
					//saveFailure(stateVal,rejectData);
					for (var i = rejectData.$messages.length - 1; i >= 0; i--) {
						if (rejectData.$messages[i].field != null){
							if (rejectData.$messages[i].field.toLowerCase() == 'notestoadmin'){
								stateVal.hasError = true;
								stateVal.stateValErrors.administratorNotes.push(rejectData.$messages[i].message);
							}
						}						
					}
					_defer.reject({
						errors: stateVal.errors,
						warnings: stateVal.warnings,
						rejectData: rejectData
					});
					storageSvc.save({
						key: 'selectedView',
						data: currentView,
						persistent: true
					});
				}
			);

			return _defer.promise;
		}

		function saveFailure(stateVal, rejectData, reconcile = false) {
			var variationNumber = [];
			for (var i = rejectData.$messages.length - 1; i >= 0; i--) {
				var error = rejectData.$messages[i];

				// is this an error message?
				if (error.type.toLowerCase() === 'error') {
					if (error.key !== null && error.field !== null && !reconcile) {
						stateVal.hasError=true;
						var variationData = getVariationByAbsenceNumber(stateVal, error.key);
						// create the object if it doesn't exist
						variationData.errors = variationData.errors || {};
						// create the error array if it doesn't exist
						variationData.errors[error.field] = variationData.errors[error.field] || [];

						// don't duplicate the error messages shown
						if (variationData.errors[error.field].indexOf(error.message) === -1) {
							variationData.errors[error.field].push(error.message);
						}

						variationNumber.push(stateVal.absrVariations.indexOf(variationData));
					} else {
						stateVal.errors.push(error);
					}
					// is this a warning?
				} else if (error.type.toLowerCase() === 'warning') {
					stateVal.warnings.push(error);
				}
			}

			// if there are variation errors, pick the first instance as the vartiation to scroll to
			if (variationNumber.length > 0 && stateVal.errors.length === 0) {
				stateVal.errorElement = 'variation-' + Math.min.apply(Math, variationNumber);
			}
		}

		function setFlags(absrState){
			absrState.originalPlusRelatedAbsences = [];
			absrState.relatedAbsences = [];
			if (absrState.related != null && absrState.related.length > 0) {
				absrState.related.forEach(function (related) {
					related.absences.forEach(function (absence, i) {
						if (absence.closedDay != null) {
							if (absence.closedDay.closedDayType == 2) {
								absence.flag = "related" + absrState.originalPlusRelatedAbsences.length + i;
								absrState.originalPlusRelatedAbsences.push(angular.copy(absence));
							}
						}
			   absrState.relatedAbsences.push(absence);
					});
				});
			}

			if (absrState.absr != null &&  absrState.absr.absences.length > 0) {
				absrState.absr.absences.forEach(function (absence, i) {
					absence.flag = "unrelated" + i;
					absrState.originalPlusRelatedAbsences.push(angular.copy(absence));
					if (absence.closedDay != null) {
						if (absence.closedDay.closedDayType == 2) {
							absrState.isInServiceAbsence = true;
						}
					}	
				});
			}

          absrState.originalPlusRelatedAbsences.sort(function (a, b) {	
			  if (new Date(a.date).getTime() == new Date(b.date).getTime()) {
				  return 0;
			  }
			  return (new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1);			 		   
			});
         }
		
		function validate(stateVal) {
			var absrVariations = stateVal.absrVariations,
				variationNumber = [],
				output = {
					success: true,
					firstFailedVariation: null
				};
			
				if (storageSvc.load("selectedView") == 'btnDay'){
					if (stateVal.absrVariations != null && stateVal.absrVariations[0].absences != null){
						stateVal.absrVariations.forEach(function(variation){
							variation.absences.forEach(function(absence){
								if (absence.isDeleted && variation.absences.length == 1){
									stateVal.absrVariations.splice(stateVal.absrVariations.indexOf(variation),1);
								}else if (absence.isDeleted && variation.absences.length > 1){
									variation.absences.splice(variation.absences.indexOf(absence),1);
									variation.dates.splice(variation.dates.indexOf(absence.date),1);
								}
							})
						})
					}
					
					if (stateVal.absr != null && stateVal.absr.absences != null && stateVal.absr.absences.length > 0){
						for(var i = stateVal.absr.absences.length - 1; i >= 0; i--){
							if(stateVal.absr.absences[i].isDeleted){
								stateVal.absr.absences.splice(i,1);
							}
						}
					}
				}
			validation = absrVariationHelp.validationFunctions(stateVal, regexExpressionsVal, strings);
			if (stateVal.worker != null) {
				if (validateStateVal(stateVal)) {
					if (stateVal.absr != null && stateVal.absr.absences != null && stateVal.absr.absences.length > 0) {
						if (storageSvc.load("selectedView") == 'btnDay') {
							for (var i = stateVal.absr.absences.length - 1; i >= 0; i--) {
								stateVal.absr.absences[i].errors = angular.copy(stateVal.absrVariations[0].errors);
								var absenceData = stateVal.absr.absences[i];
								if (!variationValidation(absenceData)) {
									variationNumber.push(i);
									output.success = false;
									stateVal.hasError = true;
								}
							}
						} else {
							validateVariationData(absrVariations,variationNumber,output);
						}
					} else {
						if (storageSvc.load("selectedView") == 'btnDay') {
							validateAbsenceModel(output);
						} else {
							validateVariationData(absrVariations, variationNumber, output);
						}
					}
				if (variationNumber.length > 0) {
						output.firstFailedVariation = 'variation-' + Math.min.apply(Math, variationNumber);
					}
				} else {
					stateVal.expanded = true;
					output.success = false;
					output.firstFailedVariation = 'admin-notes';
					if (storageSvc.load("selectedView") == 'btnDay') {
						stateVal.hasError = true;
					}
				}
			} else {
				output.success = false;
				output.firstFailedVariation = null;
			}

			return output;
		}

		function validateAbsenceModel(output) {
			if (absrStateVal.absrVariations[0].absences != null && absrStateVal.absrVariations[0].absences.length > 0) {
				validation = absrVariationHelp.validationFunctions(absrStateVal, regexExpressionsVal, strings);
				for (var i = absrStateVal.absrVariations[0].absences.length - 1; i >= 0; i--) {
					absrStateVal.absrVariations[0].absences[i].errors = angular.copy(absrStateVal.absrVariations[0].errors);
					var absenceData = absrStateVal.absrVariations[0].absences[i];
					if (!variationValidation(absenceData)) {
						output.success = false;
					}
				}
			} else {
				output.success = false;
			}
		}


		function validateVariationData(absrVariations,variationNumber,output){
			for (var i = absrVariations.length - 1; i >= 0; i--) {
				var variationData = absrVariations[i];
				if (!variationValidation(variationData)) {
					variationData.expanded = true;
					variationNumber.push(i);
					output.success = false;
				}
			}
		}

		function validateStateVal(stateVal) {
			var errorCount = 0;
			Object.keys(stateVal.stateValErrors).forEach(function (key) {
				stateVal.stateValErrors[key] = validation[key] && validation[key]() || [];
				errorCount += stateVal.stateValErrors[key].length;
			});
			return (errorCount === 0);
		}


		function variationValidation(variationData) {
			var errorCount = 0;
			Object.keys(variationData.errors).forEach(function (key) {
				variationData.errors[key] = validation[key] && validation[key](variationData) || [];
				errorCount += variationData.errors[key].length;
			});
			return (errorCount === 0);
		}

		function handleSaveErrors(rejection) {
			var errorToOverrideMap = {
				'exceedWorkEntitlements': 'ignoreEntitlementBalanceOverage',
				'subOverWorked': 'ignoreSubOverworked',
				'expiredSkills': 'ignoreSubUnqualified'/*,
				'' : 'ignoreXdSubOverworked'*/
			};

			var _defer = $q.defer(),
				dialog = null;

			// set default values
			absrStateVal.errors = absrStateVal.errors || [];
			absrStateVal.warnings = absrStateVal.warnings || [];

			// if the field is not present, the user has no ability to override
			// the warning should be added as an error
			absrStateVal.errors = absrStateVal.errors.concat(
				absrStateVal.warnings
					.filter(function (w) { return w.field == null; })
					.map(function (w) { return w.message; })
			);

			// filter the non-actionable warnings from our list
			absrStateVal.warnings = absrStateVal.warnings.filter(function (w) { return w.field != null; });

			// handle warnings
			if (absrStateVal.warnings.length) {
				//create a div for each unique wanrning message to display to the user
				var warningMessages = absrStateVal.warnings
					.map(function (w) { return w.message; })
					.filter(function (el, i, a) { return i === a.indexOf(el); })
					.reduce(function (prev, val) { return prev + '<div class="message">' + val + '</div>'; }, '');

				dialog = ngDialog.open({
					template: '/global/modals/absr-warning.html',
					closeByDocument: false,
					showClose: false,
					closeByEscape: false,
					closeByNavigation: false,
					data: {
						header: strings['Warning'],
						warning: { message: warningMessages },
						buttons: [{
							title: strings['Popup.Text.Button.EditAbsence'],
							cls: 'fl-button',
							icon: 'check-square-o',
							loading: false,
							action: function (obj) {
								_defer.resolve({ retry: false });
							}
						}, {
							title: strings['Popup.Text.Button.SaveAndContinue'],
							cls: 'fl-button fl-positive',
							icon: 'check-square-o',
							loading: false,
							action: function (obj) {
								absrStateVal.override = absrStateVal.override || {};
								absrStateVal.override[errorToOverrideMap[absrStateVal.warnings[0].field]] = true;
								_defer.resolve({ retry: true });
							}
						}]
					}
				});

				_defer.promise.then(function () {
					dialog.close();
					absrStateVal.warnings = [];
				});
			} else {
				_defer.resolve({ retry: false });
			}

			// handle errors
			if (absrStateVal.errors.length) {
				toastHelp.clear();
				toastHelp.error(absrStateVal.errors
					.map(function (v) { return v.message; })
					.filter(function (v, i, a) { return a.indexOf(v) === i; }), 'Error');

				absrStateVal.errors = [];
			}
			return _defer.promise;
		}

		function permSubstituteDialog() {
			var _defer = $q.defer();
			var subName = absrStateVal.substitute.firstName + ' ' + absrStateVal.substitute.lastName;
			var dialog = ngDialog.open({
				template: '/components/absr/cmpt-absr-details-section/cancel-delete.html',
				showClose: false,
				closeByEscape: false,
				closeByNavigation: false,
				closeByDocument: false,
				data: {
					header: strings['assignSub.Dialog.header.text'] + ' #' + absrStateVal.id,
					title: subName + ' ' + strings['permSubDialog.Message.text'] + '?',
					buttons: [{
						title: strings['ReassignToNewSub'],
						cls: 'fl-button fl-positive',
						action: function () {
							ngDialog.close(dialog.id);
							return _defer.resolve();
						}
					}, {
						title: strings['Cancel'],
						cls: 'fl-button',
						action: function () {
							var unlockAbsr = absenceRequestApi.unlock({ absrid: absrStateVal.id }, {});
							unlockAbsr.then(function (data) {
								ngDialog.close(dialog.id);
								return _defer.reject();
							});
						}
					}]
				}
			});
			return _defer.promise;
		}

		function showRemoveSubDialog(deleteAbsence, cancelSelections) {
			var absrIsVacancy = absrStateVal.worker != null ? absrStateVal.worker.isVacancy : false;
			if (absrStateVal.absr.isLocked)
				return;

			ngDialog.open({
				template:'/global/modals/available-sub-remove-options.html',
				closeByDocument: false,
				closeByNavigation:true,
				data: {
						header: 'Header',
						title:  strings['Delete']+ ' ' + (absrIsVacancy ? strings['Vacancy'] : strings['Absence']) + ' ' + strings['And'].toLowerCase() + ' ' + strings['AbsenceForm.Button.RemoveSub'] + ' ' + strings['DR.Tab.Table.Data.Text.Sub'],
						data: {
							abState: absrStateVal,
							cancelSelections: cancelSelections,
							deleteAbsence: deleteAbsence
						}
					}
			});
		}
		
		function showDeleteDialog(_unassignSubstitute, _cancelSelections) {
			var _defer = $q.defer();
			var unassignSubstitute = _unassignSubstitute ? _unassignSubstitute : false;
			var dialog = null,
				deleteDialogOptions = null;
			var absrIsVacancy = absrStateVal.worker != null ? absrStateVal.worker.isVacancy : false;
			deleteDialogOptions = {
				template: '/components/absr/cmpt-absr-buttons/confirm-delete.html',
				closeByDocument: false,
				closeByNavigation: true,
				showClose: false,
				data: {
					header: strings['Confirm'],
					absrState: absrStateVal,
					isVacancy: absrIsVacancy,
					confirmText: absrIsVacancy ? strings['Vacancy.Modify.Text.ConfirmDelete'] : strings['Absence.Modify.Text.ConfirmDelete'],
					cancelReasons: [],
					cancelSelections: {
						id: _cancelSelections ? _cancelSelections.id : 0,
						notes: _cancelSelections ? _cancelSelections.notes : ''
					},
					toggleUnassignSubstitute : function toggleUnassignSubstitute() {
						unassignSubstitute = !unassignSubstitute;
					},
					unassignSubstitute : unassignSubstitute,
					strings: strings,
					buttons: [{
						title: strings['Delete'],
						cls: 'fl-negative',
						icon: '',
						action: function () {
							ngDialog.close(dialog.id);
							deleteAbsr(deleteDialogOptions.data.cancelSelections).then(function () {
								return _defer.resolve();
							}, function () {
								return _defer.reject();
							});
						},
						isVisible: function (){
							return !unassignSubstitute;
						}
					}, {
						title: strings['UserAccess.Text.Continue'],
						cls: 'fl-primary',
						icon: '',
						action: function () {
							ngDialog.close(dialog.id);
							if (absrStateVal.substitute != null && unassignSubstitute) {
								showRemoveSubDialog(true, deleteDialogOptions.data.cancelSelections);
							}
						},
						isVisible: function (){
							return unassignSubstitute;
						}
					}, {
						title: strings['Cancel'],
						cls: 'normal-btn',
						icon: '',
						action: function () {
							ngDialog.close(dialog.id);
							return _defer.reject();
						},
						isVisible: function (){
							return true;
						}
					}]
				}
			};
			//only look for cancel reasons if org is using cancelClosedMode
			orgSvc.ready.then(function (orgData) {
				if (orgData[0].settings.usesCancelClosedMode) {
					absenceRequestApi.cancelReasons().then(function (data) {
						deleteDialogOptions.data.cancelReasons = data.map(function(v, i, a) {
							return { id: v.id, value: v.description };
						});
						deleteDialogOptions.data.cancelSelections.id = _cancelSelections == undefined ? null : _cancelSelections.id;
						dialog = ngDialog.open(deleteDialogOptions);
					}, function (reasons) {
						toastHelp.error(reasons.$messages, 'Error');
						return _defer.reject();
					});
				} else {
					dialog = ngDialog.open(deleteDialogOptions);
				}
			});
			return _defer.promise;
		}
		function showTimesheetDataDialog() {
			var _defer = $q.defer();
			var absrIsVacancy = absrStateVal.worker != null ? absrStateVal.worker.isVacancy : false;
			var dialog = ngDialog.open({
				template: '/components/absr/cmpt-absr-buttons/confirm-timesheet-data.html',
				closeByDocument: false,
				closeByNavigation: true,
				showClose: false,
				data: {
					header: strings['Warning'],
					confirmMessage: absrIsVacancy ? strings['Vacancy.Modify.Text.ConfirmTimesheetData'] : strings['Absence.Modify.Text.ConfirmTimesheetData'],
					buttons: [{
						title: strings['Yes'],
						cls: 'fl-positive',
						icon: '',
						action: function () {
							ngDialog.close(dialog.id);
							return _defer.resolve();
						}
					}, {
						title: strings['No'],
						cls: 'normal-btn',
						icon: '',
						action: function () {
							ngDialog.close(dialog.id);
							return _defer.reject();
						}
					}]
				}
			});
			return _defer.promise;
		}

		function deleteAbsr(cancelSelections) {
			var _defer = $q.defer();
			var absrIsVacancy = absrStateVal.worker != null ? absrStateVal.worker.isVacancy : false;
			var deleteAbsenceRequest = absenceRequestApi.deleteAbsr({ absrid: absrStateVal.id, cancelReasonId: cancelSelections.id, cancelNotes: cancelSelections.notes });
			deleteAbsenceRequest.then(function (data) {
				var successMessage = (absrIsVacancy ? strings['Vacancy'] : strings['Absence']) + ' #' + absrStateVal.id + ' ' + strings['Deleted'];
				toastHelp.info([successMessage], strings['Success']);
				return _defer.resolve();
			}, function (reasons) {
				toastHelp.error(reasons.$messages, 'Error');
				return _defer.reject();
			});
			return _defer.promise;
		}

		function setupAbsrStateUploadedFiles() {
			var _defer = $q.defer();
			absenceRequestApi.files.get({ absrid: absrStateVal.id }).then(function (data) {
				absrStateVal.uploadedFiles = data.map(function (v) {
					v.icon = iconHelp.classForFileExt(v.fileExtension);
					return v;
				});
				return _defer.resolve();
			}, function (reasons) {
				toastHelp.error(reasons.$messages, 'Error');
				return _defer.reject();
			});
			return _defer.promise;
		}
		function setupAbsrStateRelatedFiles(date) {
			date = date == null ? earliestAbsrDate() : date;
			var _defer = $q.defer();
			workerApi.relatedFiles.get({
				workerId: absrStateVal.worker.id,
				asOfDate: date
			}).then(function (data) {
				absrStateVal.relatedFiles = data.map(function (v) {
					v.icon = iconHelp.classForFileExt(v.fileExtension);
					return v;
				});
				return _defer.resolve();
			}, function (reasons) {
				toastHelp.error(reasons.$messages, 'Error');
				return _defer.reject();
			});
			return _defer.promise;
		}

		function earliestAbsrDate() {
			return absrStateVal.absrVariations.reduce(function (prev, cur) {
				var curEarliest;

				if (cur.dates.length) {
					curEarliest = cur.dates.map(function (v, i, a) {
						return (new Date(v)).getTime();
					}).sort()[0];

					return (prev && curEarliest >= prev) ? prev : curEarliest;
				} else {
					return prev;
				}
			}, null);
		}

		function earliestAbsenceDate() {
			if(absrStateVal.absr.absences.length > 0)
			{
				var sortedAbsences = angular.copy(absrStateVal.absr.absences).map(function (a) {
					return { dateStartTime: Date.parse(Date.parse(a.date).toString('MM/dd/yyyy') + ' ' + a.absenceStartTime) };
				}).sort(arrayHelp.sort('dateStartTime'));
				var earliestAbsenceDate = sortedAbsences.shift();
				return earliestAbsenceDate.dateStartTime;
			}
		}

		function reconcile(absrId, absIds) {
			return reconiliationAction(false, absrId, absIds);
		}


		function unreconcile(absrId, absIds) {
			return reconiliationAction(true, absrId, absIds);
		}

		function reconiliationAction(isReconciled, absrId, absIds) {
			var _defer = $q.defer();
			var reconciliation = absenceRequestApi[isReconciled ? 'unreconcile' : 'reconcile']({ absrid: absrId, absIds: absIds }, {});
			reconciliation.then(function () {
				return _defer.resolve();
			}, function (reasons) {
				return _defer.reject(reasons);
			});
			return _defer.promise;
		}

		function refreshSubstitute() {
			var _defer = $q.defer();
			if (absrStateVal.substitute != null) {
				substituteApi.getById({ id: absrStateVal.substitute.id, includeSkills: false })
					.then(function (sub) {
						absrStateVal.substitute = sub;
						return _defer.resolve();
					}, function (reason) {
						toastHelp.error(reason.$messages, 'Error');
						return _defer.reject();
					});
			} else {
				return true;
			}
			return _defer.promise;
		}

		function setAbsrInstIds() {
			absrStateVal.absrInstIds = absrStateVal.absrVariations
				.map(function (v) { return v.institution && v.institution.id || null; })
				.filter(function (v, i, a) { return v != null && a.indexOf(v) === i; });
		}

		function relatedCalendarData(startDate, endDate, workerId, instId, includeAbsences, includeClosedAndInserviceDays, includeVacancies) {
			if (debug) console.log(new Date().toISOString() + " " + "absrSvc.relatedCalendarData" + " sd=" + startDate + ", ed=" + endDate + ", workId=" + workerId + ", instid=" + instId);
			var resp = absenceRequestApi.relatedCalendarData({startDate: startDate, endDate: endDate, workerId: workerId, instId: instId, includeAbsences: includeAbsences, includeClosedAndInserviceDays: includeClosedAndInserviceDays, includeVacancies: includeVacancies});
			return resp;
		}

		
		//showing unsaved warning popup
		function confirmNavigateAway(newUrl) {
			var dialog = ngDialog.open({
				template: '/global/modals/absr-warning.html',
				closeByDocument: false,
				closeByNavigation: true,
				showClose: false,
				data: {
					header: strings['Dialog.Title.UnsavedChangesConfirmation'],
					warning: {
						message: strings['Dialog.Text.AbsenceChangeConfirm']
					},
					buttons: [{
						title: strings['SaveChanges'],
						cls: 'fl-button fl-positive',
						icon: '',
						loading: false,
						action: function () {
							var button = this;
							if (!button.loading) {
								button.loading = true;
								saveAbsence(absrStateVal).then(
									function () {
										ngDialog.close(dialog.id);
										if (locationHelp.hasDestination() || absrStateVal.editMode) {
											absrStateVal.editMode = false;
										}
										storageSvc.clear('formDirty');
										setupAbsrState(absrStateVal.id, absrStateVal.editMode).then(function () {
											if (locationHelp.hasDestination()) {
												locationHelp.goToDestination();
											} else {
												if (newUrl.name != null) {
													$state.go(newUrl.name, {absrid: absrStateVal.id, back:'details', editMode: true}, {reload: true});
												} else {
													if(newUrl.includes('/view')){
														$location.url(newUrl);
													}else{
														$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
													if ($location.url().length != $location.path().length)
													$location.url($location.path());
													}
												}

											}
											button.loading = false;
										}, function (reason) {
											toastHelp.error(reason.errors, 'Error');
											button.loading = false;
											ngDialog.close(dialog.id);
										});
									},
									function (rejection) {
										button.loading = false;
										ngDialog.close(dialog.id);
										// Seperate out the save failure from save absence.
										if (rejection != null) {
											saveFailure(absrStateVal, rejection.rejectData);
										}

										if (absrStateVal.errorElement) {
											scrollHelp.scrollTo(absrStateVal.errorElement);
											absrStateVal.errorElement = null;
										}
										handleSaveErrors(rejection).then(function (action) {
											if (action.retry) { 
												setupAbsrState(absrStateVal.id, absrStateVal.editMode).then(function () {
													if (locationHelp.hasDestination()) {
														locationHelp.goToDestination();
													} else {
														if (newUrl.name != null) {
															$state.go(newUrl.name, {absrid: absrStateVal.id, back:'details', editMode: true}, {reload: true});
														} else {
															if(newUrl.includes('/view')){
																$location.url(newUrl);
															}else{
																$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
															if ($location.url().length != $location.path().length)
															$location.url($location.path());
															}
														}
		
													}
													button.loading = false;
												}, function (reason) {
													toastHelp.error(reason.errors, 'Error');
													button.loading = false;
													ngDialog.close(dialog.id);
												});
											 }
										});
									}
								);
							}
						}
					}, {
						title: strings['Cancel'],
						cls: 'fl-button',
						icon: '',
						loading: false,
						action: function () {
							ngDialog.close(dialog.id);
						}
					}]
				}
			});
		}

		function detectConflict(index){
			var currentAbsrStateVal = absrStateVal.absr == null? absrStateVal.absrVariations[0]: absrStateVal.absr;
			var thisAbsence = currentAbsrStateVal.absences[index];
			if(thisAbsence != null){
				if(thisAbsence.institution == null) { return; }
				for (var i = currentAbsrStateVal.absences.length - 1; i >= 0; i--) {
					if(i === index){ continue; }
					var otherAbsence = currentAbsrStateVal.absences[i];
					if(otherAbsence.institution == null) { continue; }
					if((new Date(thisAbsence.date)).getTime() === (new Date(otherAbsence.date)).getTime())
					if(checkShiftAndTimeOverlap(thisAbsence,otherAbsence)){
						if(otherAbsence.errors.dates != undefined && otherAbsence.errors.dates.length > 0){
							otherAbsence.errors.dates=[];
						}
						return true;
					}  
				}
				return false;
			}
		}

		function checkShiftAndTimeOverlap(actualGroup, comparingGroup) {
			var actualGroupShiftType = parseInt(actualGroup.shiftType.id );
			var comparingGroupShiftType = parseInt(comparingGroup.shiftType.id);
			if (actualGroupShiftType === 1) {
				switch (comparingGroupShiftType) {
					case 1:
					case 2:
					case 3:
						return true;
					default:
						//Check for time Conflicts
						return haveOverlaps(actualGroup, comparingGroup);
				}                            
			}else if(actualGroupShiftType === 2){
				switch (comparingGroupShiftType) {
					case 1:
					case 2:
						return true;
					case 3:
						return false;
					default:
						//Check for time Conflicts
						return haveOverlaps(actualGroup, comparingGroup);
				}
			}else if(actualGroupShiftType === 3){
				switch (comparingGroupShiftType) {
					case 1:
						return true;
					case 2:
						return false;
					case 3:
						return true;
				   default:
						//Check For time Conflicts
						return haveOverlaps(actualGroup, comparingGroup);
				}
			}else{
					//Check for time Conflicts
					return haveOverlaps(actualGroup, comparingGroup);
			}
		}

		function haveOverlaps(actualGroup, comparingGroup) {
			var actualGroupStartTime = dateHelp.parseTime(actualGroup.absenceStartTime);
			var actualGroupEndTime = dateHelp.parseTime(actualGroup.absenceEndTime);
	
			var comparingGroupStartTime = dateHelp.parseTime(comparingGroup.absenceStartTime);
			var comparingGroupEndTime = dateHelp.parseTime(comparingGroup.absenceEndTime);
						   
			var haveOverlappingTime = checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime);
	
			return haveOverlappingTime;
		}

		function checkForOverlappingTime(actualGroupStartTime, actualGroupEndTime, comparingGroupStartTime, comparingGroupEndTime) {
			var haveStartTimeOverlaps = (comparingGroupStartTime >= actualGroupStartTime && comparingGroupStartTime < actualGroupEndTime);
			var haveEndTimeOverlaps = (actualGroupStartTime >= comparingGroupStartTime && actualGroupStartTime < comparingGroupEndTime);
			return haveStartTimeOverlaps || haveEndTimeOverlaps;
		}

		function confirmNavigateAwayFromAvailableSubstitute(newUrl) {
			var absrIsVacancy = absrStateVal.worker != null ? absrStateVal.worker.isVacancy : false;
			var confirmText = absrIsVacancy ? strings['AvailableSubstitute.Text.ConfirmUnlock'].replace(/#|_/g, strings['Vacancy']) : strings['AvailableSubstitute.Text.ConfirmUnlock'].replace(/#|_/g, strings['Absence']);  
			var headingText = strings['Unlock'] + " " + (absrIsVacancy ? strings['Vacancy'] : strings['Absence']);
			var dialog = ngDialog.open({
				template: '/global/modals/available-substitute-confirm-action.html',
				showClose: false,
				closeByEscape: false,
				closeByNavigation: false,
				closeByDocument: false,
				data: {
					header: headingText,
					title: confirmText,
					buttons: [{
						title: strings['ExitAndMaintainLock'],
						cls: 'fl-button fl-negative',
						icon: '',
						action: function () {
							var button = this;
							ngDialog.close(dialog.id);
							absrStateVal.absr.isLockedByCurrentUser  = false;
							button.loading = false;
							if (newUrl != undefined){
								$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
								$location.url($location.path());
							}else{
								switchToOldView();
							}
						}
					}, {
						title: strings['ExitAndUnlock'],
						cls: 'fl-button fl-positive',
						action: function () {
							var button = this;
							var unlockAbsr = absenceRequestApi.unlock({ absrid: absrStateVal.id }, {});
							unlockAbsr.then(function (data) {
									ngDialog.close(dialog.id);
									absrStateVal.absr.isLockedByCurrentUser  = false;
									button.loading = false;
									if (newUrl != undefined){
										$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
										$location.url($location.path());
									}else{
										switchToOldView();
									}
								}, function (reason) {
									toastHelp.error(reason.errors, 'Error');
									button.loading = false;
									ngDialog.close(dialog.id);
								});
						}
					}]
				}
			});
		}

		function switchToOldView(){
			let url = $location.url();
			let map = navUrlMappingSvc.getMapping(url);
			let redirectUrl = config.navigatorBaseUrl + map.path;
			redirectUrl += (redirectUrl.indexOf('?') > 0 ? "&" : "?") + 'token=' + tokenSvc.get();
			redirectUrl += "&UPREFSYNC=3-AbsrMode-1";
							
			$log.info("Switch to old version url: " + redirectUrl);
			$window.location.href = redirectUrl;
		}

		function showHideAbsenceBreakTime(absenceOrVariation){	
			var canViewOrEditBreakTime = false;
			var canDeductBreakFromAbsenceDuration = false;	
			absenceOrVariation.IsBreakTimeEdited = absenceOrVariation.IsBreakTimeEdited == null? false : absenceOrVariation.IsBreakTimeEdited;
			
			var organizationSettings = storageSvc.load('organizations')[0].settings;

			if (!organizationSettings.ShowBreakTimeForCustomAbsences && !absenceOrVariation.IsBreakTimeEdited){
				return canViewOrEditBreakTime;
			}

			canDeductBreakFromAbsenceDuration = absrStateVal.worker.DeductBreakFromAbsenceDuration;
			if (canDeductBreakFromAbsenceDuration == null){
				var workerType = storageSvc.load('workerTypes').filter( function(workerType) { 
					return workerType.title == absrStateVal.worker.workerType.title });
				canDeductBreakFromAbsenceDuration = workerType[0].DeductBreakFromAbsenceDuration;
			}

			if (canDeductBreakFromAbsenceDuration == null){
				canDeductBreakFromAbsenceDuration = organizationSettings.DeductBreakFromAbsenceDuration;
			}

			if ((canDeductBreakFromAbsenceDuration || absenceOrVariation.IsBreakTimeEdited)
				&& organizationSettings.ShowBreakTimeForCustomAbsences
				&& (absrStateVal.context.CanEditBreakTime || absrStateVal.context.CanViewBreakTime)){
				canViewOrEditBreakTime = true;
			}
			
			return canViewOrEditBreakTime;
		}

		function calculateAbsenceDuration(absenceStartTime, absenceEndTime, halfDayAMEndTime, halfDayPMStartTime, isCustomBreakTimeEnabled){
			let startTime = absenceStartTime != undefined ? dateHelp.convertTimeToMilitaryTime(absenceStartTime) : '0:00';
			let endTime = absenceEndTime != undefined ? dateHelp.convertTimeToMilitaryTime(absenceEndTime) : '0:00';
			let breakStart = halfDayAMEndTime != undefined ? dateHelp.convertTimeToMilitaryTime(halfDayAMEndTime) : '0:00';
			let breakEnd = halfDayPMStartTime != undefined ? dateHelp.convertTimeToMilitaryTime(halfDayPMStartTime): '0:00';

			return calculateDuration(startTime, endTime, breakStart, breakEnd, isCustomBreakTimeEnabled);
		}

		function calculateDuration(startTime, endTime, halfDayBreak, halfDayBreak2, deductBreakTIme){
			let absencStartTime = dateHelp.timeToDecimal(startTime);
			let absenceEndTime = dateHelp.timeToDecimal(endTime);
			let halfDayAMEndTime = dateHelp.timeToDecimal(halfDayBreak);
			let halfDayPMStartTime = dateHelp.timeToDecimal(halfDayBreak2);

			let absenceDuration = 0;
			//If Start and End are both between the break boundaries then 0
			if (absencStartTime >= halfDayAMEndTime && absenceEndTime <= halfDayPMStartTime && deductBreakTIme){
				return absenceDuration;
			 } 
			 //If the shift starts during break then get the end of the day
			 else if(absencStartTime > halfDayAMEndTime && absencStartTime < halfDayPMStartTime && deductBreakTIme) 
			 {
			 	absenceDuration =  dateHelp.timeDifferenceInMilliseconds(halfDayBreak2, endTime)
			 }
			 //If the shift ends during break then get the beginning of the day
			 else if(absenceEndTime > halfDayAMEndTime && absenceEndTime < halfDayPMStartTime && deductBreakTIme) 
			 {
			 	absenceDuration =  dateHelp.timeDifferenceInMilliseconds(startTime, halfDayBreak)
			 }
			//Otherwise get the beginning of the day and add it to the end of the day
			else if(absencStartTime >= halfDayPMStartTime || absenceEndTime <= halfDayAMEndTime || !deductBreakTIme)
			{
				absenceDuration =  dateHelp.timeDifferenceInMilliseconds(startTime, endTime)
			}
			else 
			{
				absenceDuration =  dateHelp.timeDifferenceInMilliseconds(startTime, halfDayBreak) + dateHelp.timeDifferenceInMilliseconds(halfDayBreak2, endTime);
			}
			return parseFloat(dateHelp.getHoursFromMinutes(dateHelp.getMinutesFromMiliseconds((absenceDuration)))).toFixed(2);
		}

		function doesBreakTimeOverlapAbsenceTimes(absenceStartTime, absenceEndTime, breakStartTime, breakEndTime){
			absenceStartTime = absenceStartTime == null ? null : dateHelp.convertTimeToMilitaryTime(absenceStartTime);
			absenceEndTime = absenceEndTime == null ? null : dateHelp.convertTimeToMilitaryTime(absenceEndTime);
			breakStartTime = breakStartTime == null ? null : dateHelp.convertTimeToMilitaryTime(breakStartTime);
			breakEndTime = breakEndTime == null ? null : dateHelp.convertTimeToMilitaryTime(breakEndTime);
			
			if (breakStartTime <= breakEndTime){
				return !(absenceEndTime <= breakStartTime  // if absence ends before break starts.
						|| absenceStartTime >= breakEndTime)	// if absence starts after the break ends.
			}
		}

		function getRectifiedBreakStartAndEndTime(absenceStartTime, absenceEndTime, breakStartTime, breakEndTime){

			var defaultCustomBreakStartTime = dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakStartTime);
			var defaultCustomBreakEndTime = dateHelp.convertTimeToMilitaryTime(absrStateVal.worker.defaultBreakEndTime);
			
			if (dateHelp.convertTimeToMilitaryTime(breakStartTime) > dateHelp.convertTimeToMilitaryTime(breakEndTime)
				|| (breakStartTime == null || breakEndTime == null)){
				return { breakStartTime: absrStateVal.worker.defaultBreakStartTime, breakEndTime: absrStateVal.worker.defaultBreakEndTime };
			}

			let absenceStartTimeToCompare = absenceStartTime == null ? null : dateHelp.convertTimeToMilitaryTime(absenceStartTime);
			let absenceEndTimeToCompare = absenceEndTime == null ? null : dateHelp.convertTimeToMilitaryTime(absenceEndTime);
			let breakStartTimeToCompare = breakStartTime == null ? null : dateHelp.convertTimeToMilitaryTime(breakStartTime);
			let breakEndTimeToCompare = breakEndTime == null ? null : dateHelp.convertTimeToMilitaryTime(breakEndTime);

			// Condition to check if the entered break start time is prior to default start time or absence start time.
			if (breakStartTimeToCompare < defaultCustomBreakStartTime || breakStartTimeToCompare < absenceStartTimeToCompare){
				breakStartTime = absenceStartTimeToCompare > defaultCustomBreakStartTime ? absenceStartTime : absrStateVal.worker.defaultBreakStartTime;
			}
			// Condition to check if the entered break end time is later then default end time or absence end time.
			if (breakEndTimeToCompare > defaultCustomBreakEndTime || breakEndTimeToCompare > absenceEndTimeToCompare){
				breakEndTime = absenceEndTimeToCompare > defaultCustomBreakEndTime ? absrStateVal.worker.defaultBreakEndTime: absenceEndTime;
			}

			return { breakStartTime: breakStartTime, breakEndTime: breakEndTime };
		}

		function getBreakType(isBreakTimesNotOverLapped, isCustomBreakDisabled, isBreakTimeCustomized){
			
			if (isBreakTimesNotOverLapped || isCustomBreakDisabled){
				return strings['DefaultBreak'];
			}
			if (!absrStateVal.context.CanEditBreakTime){
				return strings['UnpaidBreak'];
			}
			if (isBreakTimeCustomized) {
				return strings['CustomBreak'];
			}
			return strings['UnpaidBreak'];
		}

		function setDefaultBreakTime(institutionId){
			if(absrStateVal.worker)	{
				if (absrStateVal.worker.HalfDayAMEndTime == '' || absrStateVal.worker.HalfDayAMEndTime == null) {
					var workerInstitute = absrStateVal.context.InstitutionSettings.filter( function(institute) { 
						if (institutionId == null){
							return institute.id == absrStateVal.worker.schools[0].id 
						} else {
							return institute.id == institutionId
						}
					});
					if(workerInstitute.length > 0) {
						absrStateVal.worker.defaultBreakStartTime = dateHelp.convertTo12HourFormat(workerInstitute[0].defaultAbsenceHalfDayAMEndTime);
						absrStateVal.worker.defaultBreakEndTime = dateHelp.convertTo12HourFormat(workerInstitute[0].defaultAbsenceHalfDayPMStartTime);
					}
				} else {
					absrStateVal.worker.defaultBreakStartTime = dateHelp.convertTo12HourFormat(absrStateVal.worker.HalfDayAMEndTime);
					absrStateVal.worker.defaultBreakEndTime = dateHelp.convertTo12HourFormat(absrStateVal.worker.HalfDayPMStartTime);		
				}
			}
		}


		return {
			resetState: resetState,
			getState: function () { return absrStateVal; },
			stateValToAbsrModel: stateValToAbsrModel,
			absrModelToStateVal: absrModelToStateVal,
			getStateValFromAbsence: getStateValFromAbsence,
			setupAbsrState: setupAbsrState,
			saveAbsence: saveAbsence,
			handleSaveErrors: handleSaveErrors,
			permSubstituteDialog: permSubstituteDialog,
			showTimesheetDataDialog: showTimesheetDataDialog,
			showDeleteDialog: showDeleteDialog,
			setupAbsrStateUploadedFiles: setupAbsrStateUploadedFiles,
			setupAbsrStateRelatedFiles: setupAbsrStateRelatedFiles,
			earliestAbsrDate: earliestAbsrDate,
			earliestAbsenceDate: earliestAbsenceDate,
			validate: validate,
			validateAbsenceModel: validateAbsenceModel,
			reconcile: reconcile,
			unreconcile: unreconcile,
			refreshSubstitute: refreshSubstitute,
			saveFailure: saveFailure,
			setAbsrInstIds: setAbsrInstIds,
			relatedCalendarData: relatedCalendarData,
			blankAbsrStateVal:blankAbsrStateVal,
			confirmNavigateAway:confirmNavigateAway,
			detectConflict: detectConflict,
			checkLastAbsence: checkLastAbsence,
			setFlags: setFlags,
			confirmNavigateAwayFromAvailableSubstitute: confirmNavigateAwayFromAvailableSubstitute,
			showHideAbsenceBreakTime: showHideAbsenceBreakTime,
			calculateAbsenceDuration: calculateAbsenceDuration,
			doesBreakTimeOverlapAbsenceTimes: doesBreakTimeOverlapAbsenceTimes,
			getRectifiedBreakStartAndEndTime: getRectifiedBreakStartAndEndTime,
			getBreakType: getBreakType,
			setDefaultBreakTime: setDefaultBreakTime
		};

	});
	// #--- END Service (absrSvc) ---# //
	// #-----------------------------# //

}());