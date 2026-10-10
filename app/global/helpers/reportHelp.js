(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Helper (reportHelp) -----# //
	app.factory('reportHelp', function ($location, reportQueryFilterMapsVal, institutionSvc) {

		var RegexString = {
		    regexDates: /^\d{1,2}\/\d{1,2}\/\d{4}$/
		};

		//Converts report filter properties to api parameter names
		function createObj (serObj, filter, filterOverride) {
			var obj = {};
			Object.keys(serObj).forEach(function (key) {
				var value = serObj[key];
				if (value !== null){
					var isFilterOverride = (angular.isDefined(filterOverride) && angular.isDefined(filterOverride[value]));
					if (value.indexOf('.') === -1 && (angular.isDefined(filter[value]) || isFilterOverride)) {
						obj[key] = getMappedValue(filter[value]);
						if (isFilterOverride) {
							obj[key] = getMappedValue(filterOverride[value]);
						}
					} else {
						var keyArray = value.split('.');
						var parent = keyArray[0];
						var child = keyArray[1];
						var filterVal = getFilterObjectValue(filter, parent, child);
						if (filterOverride && angular.isDefined(filterOverride[parent])) {
							filterVal = getFilterObjectValue(filterOverride, parent, child);
						}
						obj[key] = filterVal;
					}
				}
			});
			return obj;
		}

		function reverseMap(searchObj, map, filterObj) {
            // if (searchObj['objectFilterType'] != null) {
            // 	var filterType = searchObj['objectFilterType'];
            // 	if (reportQueryFilterMapsVal[filterType] != null) {
            // 		map = reportQueryFilterMapsVal[filterType];
            // 	}
            // }

            var mapKeys = Object.keys(map),
            	len = mapKeys.length;

            for (var i = 0; i < len; i++) {
                var key = mapKeys[i];
                var filterMap = map[key];

                if (filterMap.indexOf('.') === -1) {
                    if (angular.isArray(filterObj[filterMap])) {
                        filterObj[filterMap] = searchObj[key].length === 0 ? [] : searchObj[key].split(',').map(intMap);
                    } else {
                        filterObj[filterMap] = searchObj[key];
                    }
                } else {
                    var keyArray = filterMap.split('.');
                    var parent = keyArray[0];
                    var child = keyArray[1];
                    filterObj[parent][child] = intMap(searchObj[key]);
                }
            }

            function intMap(oVal, i, a) {
            	var val = oVal;
            	if (isNaN(val)) {
            		return val;
            	} else {
            		val = parseInt(val, 10);
            		return isNaN(val) ? oVal : val;
            	}
            }

            return filterObj;
		}

		//For filter the
		function getFilterObjectValue(filter, parentKey, childKey) {
			var value = null;
			if (angular.isDefined(filter[parentKey])) {
				var val = filter[parentKey];
				if (angular.isObject(val)) {
					value = val[childKey];
				} else {
					value = val;
				}
			}
			return getMappedValue(value);
		}

		//Need to convert any filter arrays into csv
		function getMappedValue(filterVal) {
			if (angular.isArray(filterVal)) {
				if(filterVal.length > 0){
					return filterVal.join(',');
				}
				return '';
			} else {
				return filterVal;
			}
		}

		function isDateValid(date){
			var sDate = Date.parse(date);
    		if (sDate === null || !RegexString.regexDates.test(sDate.toString('MM/dd/yyyy'))) {
		        return false;
		    }else{
		    	return true;
		    }
		}

		function isBefore(date1, date2){
			var sDate = Date.parse(date1);
			var eDate = Date.parse(date2);
    		if (sDate > eDate) {
		        return false;
		    }else{
		    	return true;
		    }
		}
		function isAfter(date1, date2){
			var sDate = Date.parse(date1);
			var eDate = Date.parse(date2);
    		if (eDate > sDate) {
		        return false;
		    }else{
		    	return true;
		    }
		}

		function isLeapYear(year) {
			return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
		}

		function leapYearCheck(date) {
			var endDate= Date.parse(date);
			var endDateYear = endDate.getFullYear();
    		var endDateDate = endDate.getDate();
    		var endDateMonth = endDate.getMonth();
			var leapYearCheck = isLeapYear(endDateYear) && (endDateMonth <= 1 || (endDateMonth === 1 && endDateDate === 29));
    		return leapYearCheck ? 366 : 365;
		}

		function dateIsBetween(date, start, end) {
			var cDate = Date.parse(date).setHours(0,0,0,0);
			var sDate = Date.parse(start).setHours(0,0,0,0);
			var eDate = Date.parse(end).setHours(0,0,0,0);
			return cDate >= sDate && cDate <= eDate;
		}

		function dateRangeLessMax(startDate, endDate){
			var sDate = Date.parse(startDate);
    		var eDate = Date.parse(endDate);
    		var daysDiff = daydiff(sDate, eDate);
    		var endDateYear = eDate.getFullYear();
    		var endDateDate = eDate.getDate();
    		var endDateMonth = eDate.getMonth();
    		var leapYearCheck = isLeapYear(endDateYear) && (endDateMonth > 1 || (endDateMonth === 1 && endDateDate === 29));
    		var maxDays = leapYearCheck ? 366 : 365;

    		if (daysDiff >= maxDays) {
		         return false;
		    }else{
		         return true;
		    }
		}

		function daydiff(first, second) {
		    return (second - first) / (1000 * 60 * 60 * 24);
		}

		function lengthNot0(id){
			if (id === null || id.length === 0) {
		        return false;
		    }else{
		    	return true;
		    }
		}

		function onlyNumbers(id){
			if (/\D+/.test(id)) {
		        return false;
		    }else{
		    	return true;
		    }
		}

		function ExtraValidationDateRange(startDate, endDate, extraDays){
			var sDate = Date.parse(startDate);
    		var eDate = Date.parse(endDate);
    		var daysDiff = daydiff(sDate, eDate);
    		var extraValidationDays = extraDays ? extraDays : 92;
    		if (daysDiff > extraValidationDays) {
	           return false;
	        }else{
	        	return true;
	        }
		}

		function ExtraValidationDateRangeUnless(startDate, endDate, extraDays, extraType, ids){
			var sDate = Date.parse(startDate);
    		var eDate = Date.parse(endDate);
    		var daysDiff = daydiff(sDate, eDate);
    		var extraValidationDays = extraDays ? extraDays : 92;

    		if ((ids) && (ids.length > 1 || ids.length === 0) && (daysDiff > extraValidationDays && daysDiff < 365)) {
	            return false;
	        }else{
	        	return true;
	        }
		}

		function InjectValuesToResource(resource, value1, startDate, endDate, extraDays){

			var sDate,eDate,extraValidationDays;

			if(startDate!==null && endDate!==null){
				sDate = Date.parse(startDate);
				eDate = Date.parse(endDate);
				extraValidationDays = extraDays ? extraDays : 92;
				resource = resource.replace(/\{1\}/g,value1);
				resource = resource.replace(/\{0\}/g,extraValidationDays);
			}else{
				resource = resource.replace(/\{0\}/g,value1);
			}

			return resource;
		}

		function getListOfInstitutionIds(institutions){
			var allInstitutions = [];
			if (institutions == null || institutions.length === 0) {
				return institutions;
			} else {
				var instAndChildrenIds = [];
				institutions.forEach(function (v,i,a){
					instAndChildrenIds = instAndChildrenIds.concat(institutionSvc.getInstAndChildrenIds(v));
				});
				allInstitutions = instAndChildrenIds.filter(function(elem, pos) {
				    return instAndChildrenIds.indexOf(elem) === pos;
				});
			}
			return allInstitutions;
		}

		function addToHistory(filter, objectFilterType) {
			filter.objectFilterType = objectFilterType;
			filter.dateTimeStamp = new Date().getTime();
			$location.search(filter);
		}
		function hasSearch(){
			var searchObj = $location.search();
        	return (searchObj != null && angular.isObject(searchObj) && Object.keys(searchObj).length > 0);
		}

		//filterOverride - used to pass in additional/override filter
		//  values without being bounded to the actual filter panel fields.
		//  For cases where there is no UI for the filter because the value
		//  is always the same for the report.
		return {
			convertAbsenceRequestFilter: function (filter, filterOverride) {
				var filterObj = Object.create(filter);
				filterObj.institutions = getListOfInstitutionIds(filter.institutions);
				filterObj.useAlwaysOnDb = (window.siteConfig.useAlwaysOnDb === 'on');
				return createObj(reportQueryFilterMapsVal.absenceRequest, filterObj);
			},
			convertAbsenceFilter: function (filter, filterOverride) {
				var filterObj = Object.create(filter);
				filterObj.institutions = getListOfInstitutionIds(filter.institutions);
				filterObj.useAlwaysOnDb = (window.siteConfig.useAlwaysOnDb === 'on');
				return createObj(reportQueryFilterMapsVal.absence, filterObj, filterOverride);
			},
			convertWorkerFilter: function (filter, filterOverride) {
				var filterObj = Object.create(filter);
				filterObj.institutions = getListOfInstitutionIds(filter.institutions);
				return createObj(reportQueryFilterMapsVal.worker, filterObj);
			},
			convertCallHistoryFilter: function (filter, filterOverride) {
				var filterObj = Object.create(filter);
				filterObj.institutions = getListOfInstitutionIds(filter.institutions);
				return createObj(reportQueryFilterMapsVal.callHistory, filterObj);
			},
			convertSubAvailabilityFilter: function (filter, filterOverride) {
				return createObj(reportQueryFilterMapsVal.substituteAvailability, filter);
			},
			convertExcludedSubsFilter: function (filter, filterOverride) {
				var filterObj = Object.create(filter);
				filterObj.institutions = getListOfInstitutionIds(filter.institutions);
				return createObj(reportQueryFilterMapsVal.excludedSubstitutes, filterObj);
			},
			convertReportWriterFilter: function (filter, filterOverride) {
				var filterObj = Object.create(filter);
				return createObj(reportQueryFilterMapsVal.reportWriter, filterObj, filterOverride);
			},
			convertAbsenceInteractiveFilter: function (filter, addToLocation, filterOverride) {
				var filterObj = Object.create(filter);
				var mappedFilter = createObj(reportQueryFilterMapsVal.absenceInteractive, filterObj, filterOverride);
				mappedFilter.calculateByPercentOfDay = filterObj.groupByDisplay==='percentDay';
				if (addToLocation) {
					addToHistory(mappedFilter, 'absenceInteractive');
				}
				return mappedFilter;
			},
			convertTimesheetFilter: function (filter, filterOverride){
				var filterObj = Object.create(filter);
				filterObj.institutions = getListOfInstitutionIds(filter.institutions);
				return createObj(reportQueryFilterMapsVal.timeSheet, filterObj);
			},
			IsDateValid: isDateValid,
			IsBefore: isBefore,
			IsAfter: isAfter,
			IsBetween: dateIsBetween,
			DayDiff: daydiff,
			DateRangeLessMax: dateRangeLessMax,
			LengthNot0: lengthNot0,
			OnlyNumbers:onlyNumbers,
			ExtraValidationDateRange: ExtraValidationDateRange,
			ExtraValidationDateRangeUnless: ExtraValidationDateRangeUnless,
			InjectValuesToResource: InjectValuesToResource,
			reverseMap: reverseMap,
			hasSearch: hasSearch,
			addToHistory: addToHistory,
			LeapYearCheck: leapYearCheck
		};
	});
	// #--- END Helper (reportHelp) ---# //
	// #-------------------------------# //

}());
