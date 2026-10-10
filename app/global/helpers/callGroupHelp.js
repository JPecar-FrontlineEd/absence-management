(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------------# //
	// #----- Helper (callGroupHelp) -----# //
	app.factory('callGroupHelp', function (dateHelp,stringSvc) {
		var strings = stringSvc.getStrings([
			'Error',
			'Days',
			'CallGroup.Text.EnterValidLeadTime',
			'CallGroup.Text.LeadTimeCannotBeLessThanZero',
			'CallGroup.Text.LeadTimeCannotBeGreaterThanHundred',
			'CallGroup.Text.MinVisibilityCannotExceedMaxVisibility',
			'CallGroup.Text.MinHoursShouldBeNumber',
			'CallGroup.Text.CallGroup.Text.MinHoursCannotBeLessThanZero',
			'CallGroup.Text.MinHoursCannotBeLessThanZero',
			'CallGroup.Text.MinVisibilityCannotBeGreaterThan240Hours',
			'CallGroup.Text.MinMinutesShouldBeNumber',
			'CallGroup.Text.MinMinutesCannotBeLessThanZero',
			'CallGroup.Text.MinMinutesCannotBeGreaterThan59',
			'CallGroup.Text.MaxDaysShouldBeNumber',
			'CallGroup.Text.MaxVisibilityCannotBeLessThanZero',
			'CallGroup.Text.MaxVisibilityCannotBeGreaterThan120',
			'CallGroup.Text.MaxHoursShouldBeNumber',
			'CallGroup.Text.MaxHoursCannotBeLessThanZero',
			'CallGroup.Text.MaxHoursCannotBeGreaterThan23',
			'CallGroup.Text.HoursShouldBeNumber',
			'CallGroup.Text.HoursCannotBeLessThanZero',
			'CallGroup.Text.HoursCannotBeGreaterThan60',
			'CallGroup.Text.DaysShouldBeNumber',
			'CallGroup.Text.DaysCannotBeLessThanZero',
			'CallGroup.Text.DaysBeGreaterThan120'
		]);
		return {
			prepareForAPICall: function (cg) {
				var apiPref = {
				id:cg.id,
				comments:cg.comments,
				commentsExcluded:cg.commentsExcluded,
				substitute:cg.substitute,
				excluded:cg.excluded,
				favoriteRank:cg.favoriteRank,
				maxVisibilityMinutes:dateHelp.getMinutesFromDaysAndHrs( parseInt(cg.maxDays,10),  parseInt(cg.maxHrs,10)),
				MinVisibilityMinutes:dateHelp.getMinsFromHrsAndMinutes( parseInt(cg.minHrs,10),  parseInt(cg.minMins,10)),
				visibilityPercent:parseInt(cg.visibilityPercent),
				visibilityHours:dateHelp.getHrsFromDaysAndHrs(parseInt(cg.visibilityDays), parseInt(cg.visibilityHours)),
				order:cg.order,
				institution:cg.institution,
				worker:cg.worker
				};
				return apiPref;
			},isLeadTimePercentageValid: function (row){
			var per = parseInt(row.visibilityPercent,10);
			if(!angular.isNumber(per) || !isFinite(per)){
				row.validationMessages.push(strings['CallGroup.Text.EnterValidLeadTime']);
				row.visPerErrors.push(strings['CallGroup.Text.EnterValidLeadTime']);
				return false;
			}

			if(per < 0){
				row.validationMessages.push(strings['CallGroup.Text.LeadTimeCannotBeLessThanZero']);
				row.visPerErrors.push(strings['CallGroup.Text.LeadTimeCannotBeLessThanZero']);
				return false;
			}

			if(per > 100){
				row.validationMessages.push(strings['CallGroup.Text.LeadTimeCannotBeGreaterThanHundred']);
				row.visPerErrors.push(strings['CallGroup.Text.LeadTimeCannotBeGreaterThanHundred']);
				return false;
			}
			return true;
		},isMinTimeLessMaxTime : function (row){
			var totalMinValue = (parseInt(row.minHrs) * 60) + parseInt(row.minMins);
	    	var totalMaxValue = (parseInt(row.maxDays) * 1440) + (parseInt(row.maxHrs) * 60);
	    	if (parseInt(totalMinValue) >= parseInt(totalMaxValue)) {
		        row.validationMessages.push(strings['CallGroup.Text.MinVisibilityCannotExceedMaxVisibility']);
		        row.minMinErrors.push(strings['CallGroup.Text.MinVisibilityCannotExceedMaxVisibility']);
		        row.minHrErrors.push(strings['CallGroup.Text.MinVisibilityCannotExceedMaxVisibility']);
		        row.maxDaysErrors.push(strings['CallGroup.Text.MinVisibilityCannotExceedMaxVisibility']);
		        row.maxHrsErrors.push(strings['CallGroup.Text.MinVisibilityCannotExceedMaxVisibility']);
		        return false;
		    }
			return true;
		},isMinHoursValid : function (row){
			var checkVal = parseInt(row.minHrs, 10);
			if(!angular.isNumber(checkVal) || !isFinite(checkVal)){
				row.validationMessages.push(strings['CallGroup.Text.MinHoursShouldBeNumber']);
				row.minHrErrors.push(strings['CallGroup.Text.MinHoursShouldBeNumber']);
				return false;
			}


			if(checkVal < 0){
				row.validationMessages.push(strings['CallGroup.Text.MinHoursCannotBeLessThanZero']);
				row.minHrErrors.push(strings['CallGroup.Text.MinHoursCannotBeLessThanZero']);
				return false;
			}

			if (checkVal > 240) {
				row.validationMessages.push(strings['CallGroup.Text.MinVisibilityCannotBeGreaterThan240Hours']);
				row.minHrErrors.push(strings['CallGroup.Text.MinVisibilityCannotBeGreaterThan240Hours']);
	            return false;
	        } else if (checkVal === 240) {
	            // special case.  This is ok as long as minutes are set to zero.
	            // The following is to test for total < 240 hrs
	            if (angular.isNumber(parseInt(row.minMins))) {
	            	var minMinutesVal = parseInt(row.minMins, 10);
	                if (minMinutesVal > 0) {
	                	row.validationMessages.push(strings['CallGroup.Text.MinVisibilityCannotBeGreaterThan240Hours']);
	                	row.minHrErrors.push(strings['CallGroup.Text.MinVisibilityCannotBeGreaterThan240Hours']);
	                    return false;
	                }
	            }
	        }


			return true;
		},isMinMinsValid: function(row){
			var checkVal = parseInt(row.minMins, 10);
			if(!angular.isNumber(checkVal) || !isFinite(checkVal)){
				row.validationMessages.push(strings['CallGroup.Text.MinMinutesShouldBeNumber']);
				row.minMinErrors.push(strings['CallGroup.Text.MinMinutesShouldBeNumber']);
				return false;
			}


			if(checkVal < 0){
				row.validationMessages.push(strings['CallGroup.Text.MinMinutesCannotBeLessThanZero']);
				row.minMinErrors.push(strings['CallGroup.Text.MinMinutesCannotBeLessThanZero']);
				return false;
			}
			if (checkVal > 59) {
				row.validationMessages.push(strings['CallGroup.Text.MinMinutesCannotBeGreaterThan59']);
				row.minMinErrors.push(strings['CallGroup.Text.MinMinutesCannotBeGreaterThan59']);
	            return false;
	        }
			return true;
		},isMaxDaysValid: function(row){
			var checkVal = parseInt(row.maxDays, 10);
			if(!angular.isNumber(checkVal) || !isFinite(checkVal)){
				row.validationMessages.push(strings['CallGroup.Text.MaxDaysShouldBeNumber']);
				row.maxDaysErrors.push(strings['CallGroup.Text.MaxDaysShouldBeNumber']);
				return false;
			}


			if(checkVal < 0){
				row.validationMessages.push(strings['CallGroup.Text.MaxVisibilityCannotBeLessThanZero']);
				row.maxDaysErrors.push(strings['CallGroup.Text.MaxVisibilityCannotBeLessThanZero']);
				return false;
			}
			if (checkVal > 120) {
				row.validationMessages.push(strings['CallGroup.Text.MaxVisibilityCannotBeGreaterThan120']+' '+strings['Days']);
				row.maxDaysErrors.push(strings['CallGroup.Text.MaxVisibilityCannotBeGreaterThan120']+' '+strings['Days']);
	            return false;
	        }else if (checkVal === 120) {
	            // special case.  This is ok as long as hours are set to zero.
	            // The following is to test for total <= 120 days
	            if (angular.isNumber(parseInt(row.maxHrs))) {
	                var maxHoursVal = parseInt(row.maxHrs, 10);
	                if (maxHoursVal > 0) {
	                	row.validationMessages.push(strings['CallGroup.Text.MaxVisibilityCannotBeGreaterThan120']+' '+strings['Days']);
	                	row.maxDaysErrors.push(strings['CallGroup.Text.MaxVisibilityCannotBeGreaterThan120']+' '+strings['Days']);
	                    return false;
	                }
	            }
	        }
			return true;
		},isMaxHoursValid: function (row){
			var checkVal = parseInt(row.maxHrs, 10);
			if(!angular.isNumber(checkVal) || !isFinite(checkVal)){
				row.validationMessages.push(strings['CallGroup.Text.MaxHoursShouldBeNumber']);
				row.maxHrsErrors.push(strings['CallGroup.Text.MaxHoursShouldBeNumber']);
				return false;
			}


			if(checkVal < 0){
				row.validationMessages.push(strings['CallGroup.Text.MaxHoursCannotBeLessThanZero']);
				row.maxHrsErrors.push(strings['CallGroup.Text.MaxHoursCannotBeLessThanZero']);
				return false;
			}
			if (checkVal > 23) {
				row.validationMessages.push(strings['CallGroup.Text.MaxHoursCannotBeGreaterThan23']);
				row.maxHrsErrors.push(strings['CallGroup.Text.MaxHoursCannotBeGreaterThan23']);
	            return false;
	        }
			return true;
		},isHoursValid: function (row){
			var checkVal = parseInt(row.visibilityHours, 10);
			if(!angular.isNumber(checkVal) || !isFinite(checkVal)){
				row.validationMessages.push(strings['CallGroup.Text.HoursShouldBeNumber']);
				row.visHrErrors.push(strings['CallGroup.Text.HoursShouldBeNumber']);
				return false;
			}


			if(checkVal < 0){
				row.validationMessages.push(strings['CallGroup.Text.HoursCannotBeLessThanZero']);
				row.visHrErrors.push(strings['CallGroup.Text.HoursCannotBeLessThanZero']);
				return false;
			}
			if (checkVal > 60) {
				row.validationMessages.push(strings['CallGroup.Text.HoursCannotBeGreaterThan60']);
				row.visHrErrors.push(strings['CallGroup.Text.HoursCannotBeGreaterThan60']);
	            return false;
	        }
			return true;
		},isDaysValid: function (row){
			var checkVal = parseInt(row.visibilityDays, 10);
			if(!angular.isNumber(checkVal) || !isFinite(checkVal)){
				row.validationMessages.push(strings['CallGroup.Text.DaysShouldBeNumber']);
				row.visDaysErrors.push(strings['CallGroup.Text.DaysShouldBeNumber']);
				return false;
			}


			if(checkVal < 0){
				row.validationMessages.push(strings['CallGroup.Text.DaysCannotBeLessThanZero']);
				row.visDaysErrors.push(strings['CallGroup.Text.DaysCannotBeLessThanZero']);
				return false;
			}
			if (checkVal > 120) {
				row.validationMessages.push(strings['CallGroup.Text.DaysBeGreaterThan120']);
				row.visDaysErrors.push(strings['CallGroup.Text.DaysBeGreaterThan120']);
	            return false;
	        }else if (checkVal === 120) {
	            // special case.  This is ok as long as hours are set to zero.
	            // The following is to test for total <= 120 days
	            if (angular.isNumber(parseInt(row.visibilityHours))) {
	                var hoursVal = parseInt(row.visibilityHours, 10);
	                if (hoursVal > 0) {
	                	row.validationMessages.push(strings['CallGroup.Text.MaxVisibilityCannotBeGreaterThan120']);
	                	row.maxDaysErrors.push(strings['CallGroup.Text.MaxVisibilityCannotBeGreaterThan120']);
	                    return false;
	                }
	            }
	        }
			return true;
		}};

	});
	// #--- END Helper (callGroupHelp) ---# //
	// #----------------------------------# //

}());