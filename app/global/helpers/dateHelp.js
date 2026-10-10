(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Helper (dateHelp) -----# //
	app.factory('dateHelp', function (patternHelp, stringHelp, $filter) {

		var dateFilter = $filter('date');

		function rangeToString(start, end, format) {
			if (!end || (+start === +end)) {
				// dealing with a single date (not a range)
				return dateFilter(start, format);
			}
			// return range format
			return dateFilter(start, format) + ' - ' + dateFilter(end, format);
		}

		function addRangeToArray(array, start, end, format) {
			var string = rangeToString(start, end, format);
			if (string !== '') {
				array.push(string);
			}
		}


		function nth(val) {
			if(val>3 && val<21) return 'th'; // thanks kennebec
			switch (val % 10) {
			    case 1:  return "st";
			    case 2:  return "nd";
			    case 3:  return "rd";
			    default: return "th";
			}
		}

		return {
			addDays: function(date, days) {
				var dt = date;
				dt.setDate(date.getDate() + days);
				return dt;
			},
			offSetTime: function (timeString, offSetMinutes, outputFormat) {
				var date = this.parseTime(timeString);
				if (date instanceof Date) {
					date.addMinutes(offSetMinutes);
					return this.formatDate(date, outputFormat);
				} else {
					return '';
				}
			},

			roundMinutes: function(time, toNearest) {
				var mins = time.getMinutes();
				var quarterHours = Math.round(mins / toNearest);
				if (quarterHours === (60 / toNearest)) {
					time.setHours(time.getHours() + 1);
				}
				var rounded = (quarterHours * toNearest) % 60;
				time.setMinutes(rounded);
				return time;
			},
			// Magic time parsing, based on Simon Willison's Magic date parser
			// @see http://simon.incutio.com/archive/2003/10/06/betterDateInput
			// @author Stoyan Stefanov &lt;stoyan@phpied.com&gt;
			// Modified by Mike Sheldon 4/29/2009 Modified my Matt Harris 12/8/2010 to handle input of null
			parseTime: function(s) {
				if (s == null) { return false; }
				for (var i = 0; i < patternHelp.timeParsers.length; i++) {
					var re = patternHelp.timeParsers[i].re;
					var handler = patternHelp.timeParsers[i].handler;
					var bits = re.exec(s.toLowerCase().replace(new RegExp(' ', 'gi'), ''));
					if (bits) {
						return handler(bits);
					}
				}
				return false;
			},

			dateRangeString: function (dates, validDays, format) {
				// default to all dates being valid
				if (validDays == null) { validDays = [true, true, true, true, true, true, true]; }
				if (dates.length === 0){
					return '';
				}
				var ranges = [];
				var startDate = null;
				var previousDate = null;

				dates.sort(function (date1, date2) {
				  return new Date(date1) - new Date(date2);
				});
				for (var i = 0; i < dates.length; i++) {
					var date = new Date(dates[i]);
					var yesterday = new Date(dates[i]).addDays(-1);
					if (previousDate == null || (+yesterday === +previousDate)) {
						previousDate = date;
						//start date must be a valid day
						if (startDate == null) {
							startDate = date;
						}
					}else{
						  // There was a gap between dates in the array
						// Check to see if these are dates we can skip or if we ended a range
						var curDate = previousDate.clone();

						curDate.addDays(1);
						var split = false;
						while (curDate < date) {
							// we only care about the valid days.
							// if we have a valid work day between the previous date and the current
							// then we need to split off a range.
							if (validDays[curDate.getDay()]) {
								split = true;
								break;
							}
							// ok it's a day we don't care about. continue checking.
							curDate.addDays(1);
							yesterday = curDate.clone();
							yesterday.addDays(-1);
						}
						if (split) {
							addRangeToArray(ranges, startDate, previousDate, format);
							startDate = date;
						}
						previousDate = date;
					}
				}
				addRangeToArray(ranges, startDate, previousDate, format);
				return ranges;
			},

			formatDate: function(date, format) {
				var month, year, hours,  minutes, seconds, milliseconds;

				month = date.getMonth() + 1;
				year = date.getFullYear();

				if (format.indexOf('MM') > -1) {
					format = format.replace('MM', stringHelp.padL(month.toString(), 2, '0'));
				}
				if (format.indexOf('M') > -1) {
					format = format.replace('M', month.toString());
				}

				if (format.indexOf('yyyy') > -1) {
					format = format.replace('yyyy', year.toString());
				} else if (format.indexOf('yy') > -1) {
					format = format.replace('yy', year.toString().substr(2, 2));
				}

				if (format.indexOf('dd') > -1) {
					format = format.replace('dd', stringHelp.padL(date.getDate().toString(), 2, '0'));
				}
				if (format.indexOf('d') > -1) {
					format = format.replace('d', date.getDate().toString());
				}

				hours = date.getHours();

				if (format.indexOf('tt') > -1) {
					if (hours > 11) {
						format = format.replace('tt', 'pm');
					} else {
						format = format.replace('tt', 'am');
					}
				}
				if (format.indexOf('t') > -1) {
					if (hours > 11) {
						format = format.replace('t', 'pm');
					} else {
						format = format.replace('t', 'am');
					}
				}
				if (format.indexOf('TT') > -1) {
					if (hours > 11) {
						format = format.replace('TT', 'PM');
					} else {
						format = format.replace('TT', 'AM');
					}
				}
				if (format.indexOf('T') > -1) {
					if (hours > 11) {
						format = format.replace('T', 'PM');
					} else {
						format = format.replace('T', 'AM');
					}
				}
				if (format.indexOf('HH') > -1) {
					format = format.replace('HH', stringHelp.padL(hours.toString(), 2, '0'));
				}
				if (format.indexOf('hh') > -1) {
					if (hours > 12) { hours -= 12; }
					if (hours === 0) { hours = 12; }
					format = format.replace('hh', stringHelp.padL(hours.toString(), 2, '0'));
				}
				if (format.indexOf('H') > -1) {
					format = format.replace('H', hours.toString());
				}
				if (format.indexOf('h') > -1) {
					if (hours > 12) { hours -= 12; }
					if (hours === 0) { hours = 12; }
					format = format.replace('h', hours.toString());
				}
				if (format.indexOf('mm') > -1) {
					format = format.replace('mm', stringHelp.padL(date.getMinutes().toString(), 2, '0'));
				}
				if (format.indexOf('ss') > -1) {
					format = format.replace('ss', stringHelp.padL(date.getSeconds().toString(), 2, '0'));
				}

				//handle times formatted as a double        -DTN 4/16/14
				if (format === 'n') {
					minutes = date.getMinutes();
					seconds = date.getSeconds();
					milliseconds = date.getMilliseconds();

					format = hours + ((minutes + ((seconds + (milliseconds / 1000)) / 60)) / 60);
					if (Math.round(format) !== format) {
						format = format.toFixed(2);
					}
				}

				return format;
			},

			getHrsFromMins: function(minutes){
				return Math.floor(minutes/60);
			},

			getHrsRemainingMinsFromMins: function(minutes){
				return minutes%60;
			},

			getDaysFromMins: function(minutes){
				return Math.floor(minutes/1440);
			},

			getDaysRemainingHrsFromMins: function(minutes){
				return (minutes%1440)/60;
			},
			getMinsFromHrsAndMinutes: function(minHrs, minMins){
				return (minHrs*60)+ minMins;

			},

			getMinutesFromDaysAndHrs: function(maxDays, maxHrs){
				return (maxDays*1440)+(maxHrs*60);
			},
			getHrsFromDaysAndHrs: function(maxDays, maxHrs){
				return this.getMinutesFromDaysAndHrs(maxDays,maxHrs) / 60;
			},
			monthDateOrdinal: function(date){
				var obj = angular.isDate(date) ? date : new Date(date);
				var month = obj.toString('MMMM');
				var day = obj.getDate() + nth(obj.getDate());
				return `${month} ${day}`;
			},
			getMonths: function() {
				var months = [];
				for (var i = 1; i <= 12; i++) {
					var date = new Date();
					var obj = {
						id: i,
						value:new Date(date.getFullYear(),i,0).toString('MMMM')
					};
					months.push(obj);
				}
				return months;
			},
			getDaysByMonth: function(month){
				var days = [];
				var date = new Date();
				for (var i = 1; i <= new Date(date.getFullYear(), month, 0).getDate(); i++) {
					days.push(i)
				}
				return days;
			},
			getMinSystemDate: function() {
				return new Date(1900,0,1);
			},
			getHoursAndMinsfromMilliseconds: function(milliseconds){
				//Get hours from milliseconds
				var hours = milliseconds / (1000*60*60);
				var absoluteHours = Math.floor(hours);
				var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

				//Get remainder from hours and convert to minutes
				var minutes = (hours - absoluteHours) * 60;
				var absoluteMinutes = Math.round(minutes); 
				var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

				return h == "00" ? "00" + ':' + m : h + ':' + m;
			},
			convertTimeToMilitaryTime: function(time12h){
				if(time12h == undefined )
				{
					return 0;
				}
				const [time, modifier] = time12h.split(' ');
				let [hours, minutes] = time.split(':');
				if (hours === '12') {
				  hours = '00';
				}
				if (modifier === 'PM') {
				  hours = parseInt(hours, 10) + 12;
				}
				return `${hours}:${minutes}`;
			},
			timeDifferenceInMilliseconds: function(startTime, endTime){
				if(!startTime || !endTime){
					return 0;
				}
				var startTime = startTime.split(":");
				var startTimeMS = new Date().setHours(startTime[0], startTime[1] == undefined ? "00" : startTime[1], 0);
				var endTime = endTime.split(":");
				var endTimeMS = new Date().setHours(endTime[0], endTime[1] == undefined ? "00" : endTime[1], 0);
				var result = endTimeMS - startTimeMS;
				return result;
			},
			getMinutesFromMiliseconds: function(miliseconds){
				return miliseconds/60000;
			},
			getHoursFromMinutes: function(minutes){
				return minutes/60;
			},
			timeToDecimal: function(time) {
				if(time == undefined )
				{
					return 0;
				}
				var timeArr = time.split(':');
				var minutes = parseInt((timeArr[1]/6)*10, 10);
				return parseFloat(parseInt(timeArr[0], 10) + '.' + (minutes<10?'0':'') + minutes);
			},
			convertTo12HourFormat: function(time){
				if (time == undefined) {
					return 0;
				}
				time = time.split(' ')[0];
				var splittedTime = time.split(":");
				var hour = splittedTime[0], minutes = splittedTime[1];
				return hour >= 12 ? (((parseInt(hour) + 11) % 12 + 1) + ':' + minutes + ' ' + "PM") : (hour + ':' + minutes + ' ' + "AM");
			}
		};

	});
	// #--- END Helper (dateHelp) ---# //
	// #-----------------------------# //

}());