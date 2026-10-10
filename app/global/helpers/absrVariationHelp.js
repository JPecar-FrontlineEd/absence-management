(function () {
	'use strict'; var app = angular.module('aesop');

	// #--------------------------------------# //
	// #----- Helper (absrVariationHelp) -----# //
	app.factory('absrVariationHelp', function (dateHelp, regexHelp, featureSvc, storageSvc) {

		function setDefaultDropdownOption(o) {
			if (o.options == null) { return null; }
			if (o.item == null) { return null; }
			if (o.allowDeleted == null) { o.allowDeleted = false; }

			var itemId = (typeof o.item === 'number') ? o.item : o.item.id,
				selected = o.options.filter(function (v) { return v.id === itemId; })[0];

			if (selected == null && o.allowDeleted) {
				o.item.$deleted = true;
				o.options.push(o.item);
				selected = o.item;
			}

			return selected;
		}

		const isRangeConsecutive = (dates, dragSelectdow) => {
			var startDate = dates[0],
				endDate = dates[dates.length - 1],
				consecutive = true,
				dateToVerify,
				date;
			for (date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
				dateToVerify = date.toString('MM/dd/yyyy');
				if (dates.indexOf(dateToVerify) < 0 && dragSelectdow[date.getDay()]) {
					consecutive = false;
					break;
				}
			}
			return consecutive;
		};


		// #''''''''''''''''''''''''''''''''''''''''''''''''''''# //
		// # -------------- Validation Functions -------------- # //
		// #....................................................# //

		function getVariationValidationFunctions(absrState, regexExpressionsVal, strings, mnemonic) {
			return {
				startDate: function (variationData) {
					var errors = [];
					if (variationData.dates.length > 1 && isRangeConsecutive(variationData.dates, absrState.context.dragSelectDOW)) {
						if (variationData.startDate === null || variationData.startDate.length === 0) {
							errors.push(strings['CreateAbsence.text.StartDateIsRequired']);
						} else if (!regexHelp.dateString().test(variationData.startDate)) {
							errors.push(strings['CreateAbsence.text.StartDateIsInvalid']);
						} else if (regexHelp.dateString().test(variationData.endDate) &&
							(new Date(variationData.startDate) > new Date(variationData.endDate))) {
							errors.push(strings['CreateAbsence.text.StartDateCannotBeAfterEndDate']);
						}
					}
					return errors;
				},
				endDate: function (variationData) {
					var errors = [];
					if (variationData.dates.length > 1 && isRangeConsecutive(variationData.dates, absrState.context.dragSelectDOW)) {
						if (variationData.endDate === null || variationData.endDate.length === 0) {
							errors.push(strings['CreateAbsence.text.EndDateIsRequired']);
						} else if (!regexHelp.dateString().test(variationData.endDate)) {
							errors.push(strings['CreateAbsence.text.EndDateIsInvalid']);
						} else if (regexHelp.dateString().test(variationData.startDate) &&
							(new Date(variationData.endDate) < new Date(variationData.startDate))) {
							errors.push(strings['CreateAbsence.text.EndDateCannotBeBeforeStartDate']);
						}
					}
					return errors;
				},
				dates: function (variationData) {
					var errors = [];
					var dates = variationData.dates;
					if (dates.length === 0) {
						errors.push(strings.SelectAtLeastOneDate);
					}
					return errors;
				},
				institution: function (variationData) {
					var errors = [];
					var institution = variationData.institution;
					if (absrState.context.showInstitution) {
						if (institution === null) {
							errors.push(strings.MissingInstitution);
						}
					}
					return errors;
				},
				entitlementType: function (variationData) {
					var errors = [];
					var institution = variationData.institution;
					var entitlementType = variationData.entitlementType;
					if (absrState.context.showEntitlementType) {
						if (institution !== null && entitlementType === null) {
							errors.push(strings[mnemonic.missingReason]);
						}
					}
					return errors;
				},
				absenceStartTime: function (variationData) {
					var errors = [];
					var absenceStartTime = variationData.absenceStartTime;
					if (variationData.institution !== null) {
						if (absenceStartTime == null || absenceStartTime === '') {
							errors.push(strings[mnemonic.startTimeRequired]);
						} else if (!regexExpressionsVal.longTime.test(absenceStartTime)) {
							errors.push(strings[mnemonic.startTimeInvalid]);
						}
					}
					return errors;
				},
				absenceEndTime: function (variationData) {
					var errors = [];
					var absenceEndTime = variationData.absenceEndTime;
					if (variationData.institution !== null) {
						if (absenceEndTime == null || absenceEndTime === '') {
							errors.push(strings[mnemonic.endTimeRequired]);
						} else if (!regexExpressionsVal.longTime.test(absenceEndTime)) {
							errors.push(strings[mnemonic.endTimeInvalid]);
						} else if (Date.parse(absenceEndTime) < Date.parse(variationData.absenceStartTime)) {
							errors.push(strings['AbsenceTimesInvalid']);
						} else if (+Date.parse(absenceEndTime) === +Date.parse(variationData.absenceStartTime)) {
							errors.push(strings['AbsenceTimesInvalid']);
						}
					}
					return errors;
				},
				vacancyStartTime: function (variationData) {
					var errors = [];
					var vacancyStartTime = variationData.vacancyStartTime;
					if (variationData.institution !== null && absrState.context.showVacancyTimes) {
						if (vacancyStartTime == null || vacancyStartTime === '') {
							errors.push(strings['CreateAbence.text.VacancyStartRequired']);
						} else if (!regexExpressionsVal.longTime.test(vacancyStartTime)) {
							errors.push(strings['CreateAbsence.text.VacancyStartInvalid']);
						}
					}
					return errors;
				},
				vacancyEndTime: function (variationData) {
					var errors = [];
					var vacancyEndTime = variationData.vacancyEndTime;
					if (variationData.institution !== null && absrState.context.showVacancyTimes && !variationData.timeIsLinked) {
						if (vacancyEndTime == null || vacancyEndTime === '') {
							errors.push(strings['CreateAbence.text.VacancyEndRequired']);
						} else if (!regexExpressionsVal.longTime.test(vacancyEndTime)) {
							errors.push(strings['CreateAbsence.text.VacancyEndInvalid']);
						} else if (Date.parse(variationData.vacancyEndTime) < Date.parse(variationData.vacancyStartTime)) {
							errors.push(strings['VacancyTimesInvalid']);
						} else if (+Date.parse(variationData.vacancyEndTime) === +Date.parse(variationData.vacancyStartTime)) {
							errors.push(strings['VacancyTimesInvalid']);
						}
					}
					return errors;
				},
				timeAbsent: function (variationData) {
					var errors = [];
					var timeAbsent = variationData.timeAbsent;
					if (absrState.context.showAbsenceTime) {
						if (timeAbsent == null || timeAbsent === '') {
							errors.push(strings['CreateAbsence.text.AbsenceTimeRequired']);
						} else if (!regexExpressionsVal.smallTime.test(timeAbsent)) {
							errors.push(strings['CreateAbsence.text.AbsenceTimeInvalid']);
						}
					}
					return errors;
				},
				nonPayTime: function (variationData) {
					var errors = [];
					var nonPayTime = variationData.nonPayTime;
					if (absrState.context.showNonPayTime) {
						if (nonPayTime == null || nonPayTime === '' || !regexExpressionsVal.smallTime.test(nonPayTime)) {
							errors.push(strings['CreateAbsence.text.NonPayTimeInvalid']);
						}
					}
					return errors;
				},
				subHourWorked: function (variationData) {
					var errors = [];
					var subHourWorked = variationData.subHourWorked;
					if (absrState.context.showHoursSubWorked) {
						if (subHourWorked !== null && subHourWorked !== '' && (!isFinite(Number(subHourWorked)) || Number(subHourWorked) > 24 || Number(subHourWorked) < 0)) {
							errors.push(strings['CreateAbsence.text.HoursSubWorkedInvalid']);
						} else if (isNaN(subHourWorked)) {
							errors.push(strings['CreateAbsence.text.HoursSubWorkedInvalid']);
						}
					}
					return errors;
				},
				administratorNotes: function () {
					var errors = [];
					var notesToAdministrator = absrState.administratorNotes;
					var entitlementTypesRequiredNotes = absrState.absrVariations.filter(function (el) { return el.entitlementType && el.entitlementType.notesRequired; });

					if ((notesToAdministrator == null || notesToAdministrator === '') && entitlementTypesRequiredNotes.length > 0) {
						errors.push(mnemonic.notesToAdmin.replace('{0}', entitlementTypesRequiredNotes[0].entitlementType.value));
					}
					return errors;
				}
			};
		}

		function getAbsenceValidationFunctions(absrState, regexExpressionsVal, strings, mnemonic) {
			return {
				startDate: function (variationData) {
					var errors = [];

					return errors;
				},
				endDate: function (variationData) {
					var errors = [];

					return errors;
				},
				dates: function (variationData) {
					var errors = [];
					var date = variationData.date;
					if (date == '' || date == null) {
						errors.push(strings.SelectAtLeastOneDate);
					}
					var currentAbsenceIndex;
					if (absrState.absr == null || absrState.absr.absences == null){
						currentAbsenceIndex = absrState.absrVariations[0].absences.indexOf(variationData);
					} else {
						currentAbsenceIndex = absrState.absr.absences.indexOf(variationData);
					}

					if (detectConflict(currentAbsenceIndex, absrState))
					errors.push(absrState.worker.isVacancy? strings.AlreadyOnThisVacancy: strings.AlreadyOnThisAbsence);
					
					return errors;
				},
				institution: function (variationData) {
					var errors = [];
					var institution = variationData.institution;
					if (absrState.context.showInstitution) {
						if (institution === null) {
							errors.push(strings.MissingInstitution);
						}
					}
					return errors;
				},
				entitlementType: function (variationData) {
					var errors = [];
					var institution = variationData.institution;
					var entitlementType = variationData.entitlement;
					if (absrState.context.showEntitlementType) {
						if (institution !== null && entitlementType === null) {
							errors.push(strings[mnemonic.missingReason]);
						}
					}
					return errors;
				},
				absenceStartTime: function (variationData) {
					var errors = [];
					var absenceStartTime = variationData.absenceStartTime;
					if (variationData.institution !== null) {
						if (absenceStartTime == null || absenceStartTime === '') {
							errors.push(strings[mnemonic.startTimeRequired]);
						} else if (!regexExpressionsVal.longTime.test(absenceStartTime)) {
							errors.push(strings[mnemonic.startTimeInvalid]);
						}
					}
					return errors;
				},
				absenceEndTime: function (variationData) {
					var errors = [];
					var absenceEndTime = variationData.absenceEndTime;
					if (variationData.institution !== null) {
						if (absenceEndTime == null || absenceEndTime === '') {
							errors.push(strings[mnemonic.endTimeRequired]);
						} else if (!regexExpressionsVal.longTime.test(absenceEndTime)) {
							errors.push(strings[mnemonic.endTimeInvalid]);
						} else if (Date.parse(absenceEndTime) < Date.parse(variationData.absenceStartTime)) {
							errors.push(strings['AbsenceTimesInvalid']);
						} else if (+Date.parse(absenceEndTime) === +Date.parse(variationData.absenceStartTime)) {
							errors.push(strings['AbsenceTimesInvalid']);
						}
					}
					return errors;
				},
				vacancyStartTime: function (variationData) {
					var errors = [];
					var vacancyStartTime = variationData.substituteStartTime;
					if (variationData.institution !== null && absrState.context.showVacancyTimes) {
						if (vacancyStartTime == null || vacancyStartTime === '') {
							errors.push(strings['CreateAbence.text.VacancyStartRequired']);
						} else if (!regexExpressionsVal.longTime.test(vacancyStartTime)) {
							errors.push(strings['CreateAbsence.text.VacancyStartInvalid']);
						}
					}
					return errors;
				},
				vacancyEndTime: function (variationData) {
					var errors = [];
					var vacancyEndTime = variationData.substituteEndTime;
					if (variationData.institution !== null && absrState.context.showVacancyTimes && !variationData.timesAreLinked) {
						if (vacancyEndTime == null || vacancyEndTime === '') {
							errors.push(strings['CreateAbence.text.VacancyEndRequired']);
						} else if (!regexExpressionsVal.longTime.test(vacancyEndTime)) {
							errors.push(strings['CreateAbsence.text.VacancyEndInvalid']);
						} else if (Date.parse(variationData.substituteEndTime) < Date.parse(variationData.substituteStartTime)) {
							errors.push(strings['VacancyTimesInvalid']);
						} else if (+Date.parse(variationData.substituteEndTime) === +Date.parse(variationData.substituteStartTime)) {
							errors.push(strings['VacancyTimesInvalid']);
						}
					}
					return errors;
				},
				timeAbsent: function (variationData) {
					var errors = [];
					var timeAbsent = variationData.userSpecifiedAbsenceDuration;
					if (absrState.context.showAbsenceTime) {
						if (timeAbsent == null || timeAbsent === '') {
							errors.push(strings['CreateAbsence.text.AbsenceTimeRequired']);
						} else if (!regexExpressionsVal.smallTime.test(timeAbsent)) {
							errors.push(strings['CreateAbsence.text.AbsenceTimeInvalid']);
						}
					}
					return errors;
				},
				nonPayTime: function (variationData) {
					var errors = [];
					var nonPayTime = variationData.nonPayTime;
					if (absrState.context.showNonPayTime) {
						if (nonPayTime == null || nonPayTime === '' || !regexExpressionsVal.smallTime.test(nonPayTime)) {
							errors.push(strings['CreateAbsence.text.NonPayTimeInvalid']);
						}
					}
					return errors;
				},
				subHourWorked: function (variationData) {
					var errors = [];
					var subHourWorked = variationData.hoursSubWorked;
					if (absrState.context.showHoursSubWorked) {
						if (subHourWorked !== null && subHourWorked !== '' && (!isFinite(Number(subHourWorked)) || Number(subHourWorked) > 24 || Number(subHourWorked) < 0)) {
							errors.push(strings['CreateAbsence.text.HoursSubWorkedInvalid']);
						} else if (isNaN(subHourWorked)) {
							errors.push(strings['CreateAbsence.text.HoursSubWorkedInvalid']);
						}
					}
					return errors;
				},
				administratorNotes: function () {
					var errors = [];
					var notesToAdministrator = absrState.administratorNotes;
					var entitlementTypesRequiredNotes = absrState.absr.absences.filter(function (el) { return el.entitlement && el.entitlement.notesRequired; });

					if ((notesToAdministrator == null || notesToAdministrator === '') && entitlementTypesRequiredNotes.length > 0) {
						errors.push(mnemonic.notesToAdmin.replace('{0}', entitlementTypesRequiredNotes[0].entitlement.value));
					}
					return errors;
				}
			};
		}

		function getValidationFunctions(absrState, regexExpressionsVal, strings) {

			var isVacancy = absrState.worker.isVacancy,
				mnemonic = {
					missingReason: isVacancy ? 'MissingVacancyType' : 'MissingEntitlementType',
					startTimeRequired: isVacancy ? 'CreateAbence.text.VacancyStartRequired' : 'CreateAbence.text.StartTimeRequired',
					startTimeInvalid: isVacancy ? 'CreateAbsence.text.VacancyStartInvalid' : 'CreateAbsence.text.StartTimeInvalid',
					endTimeRequired: isVacancy ? 'CreateAbence.text.VacancyEndRequired' : 'CreateAbence.text.EndTimeRequired',
					endTimeInvalid: isVacancy ? 'CreateAbsence.text.VacancyEndInvalid' : 'CreateAbsence.text.EndTimeInvalid',
					notesToAdmin: isVacancy ? strings.VacancyNoteToAdminRequired : strings.NoteToAdminRequired
				};
			if (absrState.absr != null) {
				if (storageSvc.load("selectedView") == 'btnDay') {
					return getAbsenceValidationFunctions(absrState, regexExpressionsVal, strings, mnemonic);
				} else {
					return getVariationValidationFunctions(absrState, regexExpressionsVal, strings, mnemonic);
				}
			} else {
				if (storageSvc.load("selectedView") == 'btnDay') {
					return getAbsenceValidationFunctions(absrState, regexExpressionsVal, strings, mnemonic);
				}
				return getVariationValidationFunctions(absrState, regexExpressionsVal, strings, mnemonic);
			}
		}

		function detectConflict(index,absrState){
			var thisAbsence = (absrState.absr == null || absrState.absr.absences == null)? absrState.absrVariations[0].absences[index] : absrState.absr.absences[index];           
			var absenceLength = (absrState.absr == null || absrState.absr.absences == null)? absrState.absrVariations[0].absences.length - 1 : absrState.absr.absences.length - 1 ;
			if(thisAbsence != null){
				if(thisAbsence.institution == null) { return; }
				for (var i = absenceLength; i >= 0; i--) {
					if(i === index){ continue; }
					var otherAbsence = absrState.absr == null? absrState.absrVariations[0].absences[i]: absrState.absr.absences[i];
					if(otherAbsence.institution == null) { continue; }
					if((new Date(thisAbsence.date)).getTime() === (new Date(otherAbsence.date)).getTime())
					if(checkShiftAndTimeOverlap(thisAbsence,otherAbsence)){
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


		return {
			isRangeConsecutive,
			dateString: function dateString(val, dragselectDOW, format) {
				if (format == null) { format = 'MMMM dd'; }
				if (val.length > 0) {
					return dateHelp.dateRangeString(val, dragselectDOW, format).join('; ');
				}
			},
			validationFunctions: getValidationFunctions,
			setDefaultDropdownOption: setDefaultDropdownOption
		};

	});
	// #--- END Helper (absrVariationHelp) ---# //
	// #--------------------------------------# //

}());
