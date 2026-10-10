
/*
 * MultiDatesPicker v1.6.1
 * http://multidatespickr.sourceforge.net/
 * 
 * Copyright 2011, Luca Lauretta
 * Dual licensed under the MIT or GPL version 2 licenses.
 */
(function( $ ){
	$.extend($.ui, { multiDatesPicker: { version: "1.6.1" } });
	
	$.fn.multiDatesPicker = function(method) {
		var mdp_arguments = arguments;
		var ret = this;
		var today_date = new Date();
		var day_zero = new Date(0);
		var mdp_events = {};
		
		function dateIsLockedOn(date) {
		    var lockedDates = this.multiDatesPicker.datesLockedOn;
            var callback = this.multiDatesPicker.datesLockedOnRemoveAttempedCallback;
		    return dateIsLocked.call(this, date, lockedDates, callback);
		}
		function dateIsLockedOff(date) {
		    var lockedDates = this.multiDatesPicker.datesLockedOff;
		    var callback = this.multiDatesPicker.datesLockedOffAddAttempedCallback;
		    return dateIsLocked.call(this, date, lockedDates, callback);
	    }
        function dateIsLocked(date, lockedDateList, callback) {
            var lockedDate = false;
            for (var i = 0; i < lockedDateList.length; i++) {
                if (date.equals(Date.parse(lockedDateList[i]))) {
                    lockedDate = true;
                    break;
                }
            }
            if (lockedDate) {
                if (callback) {
                    callback.call(this, date);
                }
                return true;
            } else {
                return false;
            }
        }
		function removeDate(date, type) {
			if(!type) type = 'picked';
			date = dateConvert.call(this, date);
			if (this.multiDatesPicker.dates[type] === undefined) return;
		    for (var i = 0; i < this.multiDatesPicker.dates[type].length; i++) {
		        if (!methods.compareDates(this.multiDatesPicker.dates[type][i], date)) {
		            
		            // Don't allow locked dates to be removed
		            if (type == 'picked' && dateIsLockedOn.call(this, date)) {
		                return;
		            }

		            return this.multiDatesPicker.dates[type].splice(i, 1).pop();
		        }
		    }
		}
		function removeIndex(index, type) {
		    if (!type) type = 'picked';
		    if (this.multiDatesPicker.dates[type] === undefined) return;
		    
			return this.multiDatesPicker.dates[type].splice(index, 1).pop();
		}
		function addDate(date, type, no_sort, ignoreLockedDates) {
			if(!type) type = 'picked';
			date = dateConvert.call(this, date);
			
			// @todo: use jQuery UI datepicker method instead
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			
			if (methods.gotDate.call(this, date, type) === false) {
			    if (this.multiDatesPicker.dates[type] === undefined) {
			        this.multiDatesPicker.dates[type] = [];
			    }
			    
			    // Don't allow locked dates to be added
			    if (type == 'picked' && dateIsLockedOff.call(this, date) && !ignoreLockedDates) {
			        return;
			    }

				this.multiDatesPicker.dates[type].push(date);
				if(!no_sort) this.multiDatesPicker.dates[type].sort(methods.compareDates);
			} 
		}
		function sortDates(type) {
		    if (!type) type = 'picked';
		    if (this.multiDatesPicker.dates[type] === undefined) return;
			this.multiDatesPicker.dates[type].sort(methods.compareDates);
		}
		function dateConvert(date, desired_type, date_format) {
			if(!desired_type) desired_type = 'object';/*
			if(!date_format && (typeof date == 'string')) {
				date_format = $(this).datepicker('option', 'dateFormat');
				if(!date_format) date_format = $.datepicker._defaults.dateFormat;
			}
			*/
			return methods.dateConvert.call(this, date, desired_type, date_format);
		}
		
		var methods = {
			init : function( options ) {
			    var $this = $(this);
			    $this.addClass("ui-has-multidatepicker");
				this.multiDatesPicker.changed = false;
				
				var mdp_events = {
					beforeShow: function(input, inst) {
					    this.multiDatesPicker.changed = false;

						if(this.multiDatesPicker.originalBeforeShow) 
							this.multiDatesPicker.originalBeforeShow.call(this, input, inst);
					},
					onSelect : function(dateText, inst) {
					    var $this = $(this);
					    if (!this.multiDatesPicker.editable) return;
						this.multiDatesPicker.changed = true;

						if (dateText) {
							$this.multiDatesPicker('toggleDate', dateText);
						}
						
						if (this.multiDatesPicker.mode == 'normal' && this.multiDatesPicker.dates.picked.length > 0 && this.multiDatesPicker.pickableRange) {
							var min_date = this.multiDatesPicker.dates.picked[0],
								max_date = new Date(min_date.getTime());
							
							methods.sumDays(max_date, this.multiDatesPicker.pickableRange-1);
								
							// counts the number of disabled dates in the range
							if(this.multiDatesPicker.adjustRangeToDisabled) {
								var c_disabled, 
									disabled = this.multiDatesPicker.dates.disabled.slice(0);
								do {
									c_disabled = 0;
									for(var i = 0; i < disabled.length; i++) {
										if(disabled[i].getTime() <= max_date.getTime()) {
											if((min_date.getTime() <= disabled[i].getTime()) && (disabled[i].getTime() <= max_date.getTime()) ) {
												c_disabled++;
											}
											disabled.splice(i, 1);
											i--;
										}
									}
									max_date.setDate(max_date.getDate() + c_disabled);
								} while(c_disabled != 0);
							}
							
							if(this.multiDatesPicker.maxDate && (max_date > this.multiDatesPicker.maxDate))
								max_date = this.multiDatesPicker.maxDate;
							
							$this
								.datepicker("option", "minDate", min_date)
								.datepicker("option", "maxDate", max_date);
						} else {
							$this
								.datepicker("option", "minDate", this.multiDatesPicker.minDate)
								.datepicker("option", "maxDate", this.multiDatesPicker.maxDate);
						}
						
						if(this.tagName == 'INPUT') { // for inputs
							$this.val(
								$this.multiDatesPicker('getDates', 'string')
							);
						}

						$this.trigger("change");
					    
						if(this.multiDatesPicker.originalOnSelect && dateText)
							this.multiDatesPicker.originalOnSelect.call(this, dateText, inst);
						
						// thanks to bibendus83 -> http://sourceforge.net/tracker/?func=detail&atid=1495384&aid=3403159&group_id=358205
						if ($this.datepicker('option', 'altField') != undefined && $this.datepicker('option', 'altField') != "") {
							$($this.datepicker('option', 'altField')).val(
								$this.multiDatesPicker('getDates', 'string')
							);
						}
					},
					beforeShowDay : function(date) {
						var $this = $(this),
							gotThisDate = $this.multiDatesPicker('gotDate', date) !== false,
							isDisabledCalendar = $this.datepicker('option', 'disabled'),
							isDisabledDate = $this.multiDatesPicker('gotDate', date, 'disabled') !== false,
							areAllSelected = this.multiDatesPicker.maxPicks == this.multiDatesPicker.dates.picked.length,
						    otherDateTypes = $this.multiDatesPicker('gotDateTypes', date);
						
						var custom = [true, ''];
						if(this.multiDatesPicker.originalBeforeShowDay)
						    custom = this.multiDatesPicker.originalBeforeShowDay.call(this, date);
					    
						var lockedDate = false;
						var lockedDateList = this.multiDatesPicker.datesLockedOn;
						for (var i = 0; i < lockedDateList.length; i++) {
						    if (date.equals(Date.parse(lockedDateList[i]))) {
						        lockedDate = true;
						        break;
						    }
						}
						
						var highlight_class = gotThisDate ? 'ui-state-active ' + custom[1] : custom[1];
					    var otherCss = otherDateTypes.join(" ");
						var dateString = date.toString("yyyy-MM-dd");
						var selectableDOW = this.multiDatesPicker.selectableDOW[date.getDay()];
					    var selectable_date = !(isDisabledCalendar || isDisabledDate || (areAllSelected && !highlight_class)) && selectableDOW;
					    var datePickerEditableCss = this.multiDatesPicker.editable ? "" : "ui-datepicker-no-select"
					    var lockedDateCss = lockedDate ? "locked" : "";
					    return [selectable_date && custom[0], highlight_class + " " + otherCss + " " + datePickerEditableCss + " " + lockedDateCss + " " + dateString];
					},
					onClose: function(dateText, inst) {
						if(this.tagName == 'INPUT' && this.multiDatesPicker.changed) {
							$(inst.dpDiv[0]).stop(false,true);
							setTimeout('$("#'+inst.id+'").datepicker("show")',50);
						}
						if(this.multiDatesPicker.originalOnClose) this.multiDatesPicker.originalOnClose.call(this, dateText, inst);
					},
					onChangeMonthYear: function (year, month, inst) {
					    if (this.multiDatesPicker.originalOnChangeMonthYear) this.multiDatesPicker.originalOnChangeMonthYear.call(this, year, month, inst);
					    $this.trigger("changeMonthYear", [year, month, inst]);
					}
				};
				
				if(options) {
					this.multiDatesPicker.originalBeforeShow = options.beforeShow;
					this.multiDatesPicker.originalOnSelect = options.onSelect;
					this.multiDatesPicker.originalBeforeShowDay = options.beforeShowDay;
					this.multiDatesPicker.originalOnClose = options.onClose;
					this.multiDatesPicker.originalOnChangeMonthYear = options.onChangeMonthYear;
					
					$this.datepicker(options);
					
					this.multiDatesPicker.minDate = $.datepicker._determineDate(this, options.minDate, null);
					this.multiDatesPicker.maxDate = $.datepicker._determineDate(this, options.maxDate, null);
				    this.multiDatesPicker.editable = options.editable === undefined ? true : options.editable;

					// Days of Week that can be selected
					var defaultSelectableDOW = [true, true, true, true, true, true, true];
					if (this.multiDatesPicker.selectableDOW != null) {
					    defaultSelectableDOW = this.multiDatesPicker.selectableDOW
					}
					this.multiDatesPicker.selectableDOW = options.selectableDOW ? options.selectableDOW : defaultSelectableDOW;
					this.multiDatesPicker.datesLockedOn = options.datesLockedOn ? options.datesLockedOn : [];
					this.multiDatesPicker.datesLockedOff = options.datesLockedOff ? options.datesLockedOff : [];
					this.multiDatesPicker.datesLockedOnRemoveAttempedCallback = options.datesLockedOnRemoveAttempedCallback;
					this.multiDatesPicker.datesLockedOffAddAttempedCallback = options.datesLockedOffAddAttempedCallback;
				    
				    // Days of Week that can be selected by drag
					var defaultDragSelectDOW = [false, true, true, true, true, true, false];
					if (this.multiDatesPicker.selectableDOW != null) {
					    defaultDragSelectDOW = this.multiDatesPicker.dragSelectDOW
					}
					this.multiDatesPicker.dragSelectDOW = options.dragSelectDOW ? options.dragSelectDOW : defaultDragSelectDOW;
				    
                    // Dates to add
					if(options.addDates) methods.addDates.call(this, options.addDates);
					if(options.addDisabledDates && options.addDisabledDates.length > 0)
					    methods.addDates.call(this, options.addDisabledDates, 'disabled');
				    
                    // Setup drag select
					if(options.dragSelect) {
					    var dragOptions = (typeof options.dragSelect == "object") ? options.dragSelect : {};

					    var startSelectingFunction = function() {
					        var el = $(this);
					        el.prop("data-selection-mode", null)
					        el.prop("data-selection-start", null)
					        el.prop("data-selection-end", null)
					    };
					    var selectingFunction = function(event, ui) {
					        if (!this.multiDatesPicker.editable) return;
					        
					        var container = $(this);
					        var inSelection = container.find(".ui-selecting");
					        if (inSelection.length == 0) return;

					        var startDate = null;
					        var endDate = null;
					        for (var i = 0; i < inSelection.length; i++) {
					            var el = $(inSelection[i]);
					            if (el.hasClass("ui-datepicker-unselectable")) continue;
					            var regex = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/;
					            var dateMatch = el.prop("class").match(regex);
					            if(dateMatch != null) {
					                var dateString = dateMatch[0];
					                var dt = Date.parse(dateString);
					                if (startDate == null || dt.isBefore(startDate))
					                    startDate = dt;
					                if (endDate == null || dt.isAfter(endDate))
					                    endDate = dt;
					            }
					        }

					        if (container.prop("data-selection-mode") == null) {
					            
					            var mode = el.hasClass("ui-state-active");
					            container.prop("data-selection-mode", mode ? "deselect" : "select");
					        }
					        var selectingCssClass = container.prop("data-selection-mode") == "select" ? "ui-selecting-date" : "ui-deselecting-date";
					        container.find("." + selectingCssClass).removeClass(selectingCssClass);

					        if (startDate != null && endDate != null) {
					            var curDate = new Date(startDate);
					            var i = 0;
					            while (methods.compareDates(curDate, endDate) <= 0 && i < 31) {
					                if (this.multiDatesPicker.dragSelectDOW[curDate.getDay()]) {
					                    container.find("td." + curDate.toString("yyyy-MM-dd")).addClass(selectingCssClass);
					                }
					                curDate = curDate.addDays(1);
					                i++
					            }
					        }
					        //

					        container.prop("data-selection-start", startDate);
					        container.prop("data-selection-end", endDate);
					    };
					    var finishSelectingFunction = function () {
					        if (!this.multiDatesPicker.editable) return;
					        
					        var container = $(this);
					        var startDate = container.prop("data-selection-start");
					        var endDate = container.prop("data-selection-end");
					        
					        if (!startDate || !endDate) return;

					        $(this).datepicker("setDate", startDate); // keep the datepicker from switching months
					        var dateAr = [];
					        var curDate = new Date(startDate);
					        var i = 0;
					        while (methods.compareDates(curDate, endDate) <= 0 && i < 31) {
					            if (this.multiDatesPicker.dragSelectDOW[curDate.getDay()]) {
					                dateAr.push(new Date(curDate));
					            }
					            curDate = curDate.addDays(1);
					            i++
					        }
					        if (dateAr.length > 0) {
					            switch (container.prop("data-selection-mode")) {
					            case "select":
					                methods.addDates.call(this, dateAr);
					                break;
					            case "deselect":
					                methods.removeDates.call(this, dateAr);
					                break;
					            }
					        }
					        container.trigger("change");
					    };
					    var defaultSettings = {
					        distance: 20,
					        filter: "td",
					        start: startSelectingFunction,
					        selecting: selectingFunction,
					        unselecting: selectingFunction,
					        stop: finishSelectingFunction
					    };
					    
					    jQuery.extend(defaultSettings, dragOptions);
					    $this.selectable(defaultSettings);
                    }
					
					methods.setMode.call(this, options);
				} else {
					$this.datepicker();
				}
			    
				
				$this.datepicker('option', mdp_events);
				
				if(this.tagName == 'INPUT') $this.val($this.multiDatesPicker('getDates', 'string'));
				
				// Fixes the altField filled with defaultDate by default
				var altFieldOption = $this.datepicker('option', 'altField');
				if (altFieldOption) $(altFieldOption).val($this.multiDatesPicker('getDates', 'string'));
			},
			compareDates : function(date1, date2) {
				date1 = dateConvert.call(this, date1);
				date2 = dateConvert.call(this, date2);
				// return > 0 means date1 is later than date2 
				// return == 0 means date1 is the same day as date2 
				// return < 0 means date1 is earlier than date2 
				var diff = date1.getFullYear() - date2.getFullYear();
				if(!diff) {
					diff = date1.getMonth() - date2.getMonth();
					if(!diff) 
						diff = date1.getDate() - date2.getDate();
				}
				return diff;
			},
			sumDays : function( date, n_days ) {
				var origDateType = typeof date;
				obj_date = dateConvert.call(this, date);
				obj_date.setDate(obj_date.getDate() + n_days);
				return dateConvert.call(this, obj_date, origDateType);
			},
			dateConvert : function( date, desired_format, dateFormat ) {
				var from_format = typeof date;
				
				if(from_format == desired_format) {
					if(from_format == 'object') {
						try {
							date.getTime();
						} catch (e) {
							$.error('Received date is in a non supported format!');
							return false;
						}
					}
					return date;
				}
				
				var $this = $(this);
				if(typeof date == 'undefined') date = new Date(0);
				
				if(desired_format != 'string' && desired_format != 'object' && desired_format != 'number')
					$.error('Date format "'+ desired_format +'" not supported!');
				
				if(!dateFormat) {
					dateFormat = $.datepicker._defaults.dateFormat;
					
					// thanks to bibendus83 -> http://sourceforge.net/tracker/index.php?func=detail&aid=3213174&group_id=358205&atid=1495382
					var dp_dateFormat = $this.datepicker('option', 'dateFormat');
					if (dp_dateFormat) {
						dateFormat = dp_dateFormat;
					}
				}
				
				// converts to object as a neutral format
				switch(from_format) {
					case 'object': break;
					case 'string': date = $.datepicker.parseDate(dateFormat, date); break;
					case 'number': date = new Date(date); break;
					default: $.error('Conversion from "'+ desired_format +'" format not allowed on jQuery.multiDatesPicker');
				}
				// then converts to the desired format
				switch(desired_format) {
					case 'object': return date;
					case 'string': return $.datepicker.formatDate(dateFormat, date);
					case 'number': return date.getTime();
					default: $.error('Conversion to "'+ desired_format +'" format not allowed on jQuery.multiDatesPicker');
				}
				return false;
			},
			gotDate : function( date, type ) {
			    if (!type) type = 'picked';
			    if (this.multiDatesPicker.dates[type] === undefined) return false;
			    for (var i = 0; i < this.multiDatesPicker.dates[type].length; i++) {
			        if (methods.compareDates.call(this, this.multiDatesPicker.dates[type][i], date) === 0) {
			            return true;
			        }
			    }
			    
			    return false;
			},
			gotDateTypes: function (date) {
			    var ar = [];
			    for(var type in this.multiDatesPicker.dates) {
			        if (type === 'picked' || type === 'disabled') continue;
			        if(methods.gotDate.call(this, date, type)) {
			            ar.push(type);
			        }
			    }
			    return ar;
			},
			getDates : function( format, type ) {
				if(!format) format = 'string';
				if(!type) type = 'picked';
				switch (format) {
					case 'object':
						return this.multiDatesPicker.dates[type];
					case 'string':
					case 'number':
					    var o_dates = new Array();
					    if (this.multiDatesPicker.dates[type] === undefined) return;
					    for (var i = 0; i < this.multiDatesPicker.dates[type].length; i++)
							o_dates.push(
								dateConvert.call(
									this, 
									this.multiDatesPicker.dates[type][i], 
									format
								)
							);
						return o_dates;
					
					default: $.error('Format "'+format+'" not supported!');
				}
			},
			addDates : function( dates, type, ignoreLockedDates ) {
				if(dates.type || dates.length > 0) {
					if(!type) type = 'picked';
					switch(typeof dates) {
					    case 'object':
					    case 'array':
					        var overrideType = dates.type;
					        if (overrideType) {
					            var dateAr = dates.dates;
					            return methods.addDates(dateAr, overrideType, ignoreLockedDates);
					        }

					        if(dates.length) {
					            for (var i = 0; i < dates.length; i++)
					                addDate.call(this, dates[i], type, true, ignoreLockedDates);
								sortDates.call(this, type);
								break;
							} // else does the same as 'string'
						case 'string':
						case 'number':
						    addDate.call(this, dates, type, false, ignoreLockedDates);
							break;
						default: 
							$.error('Date format "'+ typeof dates +'" not allowed on jQuery.multiDatesPicker');
					}
					$(this).datepicker('refresh');
				} else {
					$.error('Empty array of dates received.');
				}
			},
			removeDates : function( dates, type ) {
				if(!type) type = 'picked';
				var removed = [];
				if (Object.prototype.toString.call(dates) === '[object Array]') {
					var tempDates = dates.sort(function(a,b){return b-a});
					for (var i =0; i < tempDates.length; i++){
						removed.push(removeDate.call(this, tempDates[i], type));
					}
					// JJP - DE14359
					// IE11 and Edge were having issues with this for loop doing iterations over non-array keys.
					// eg: If there is only one date in the tempDates array, we would hit a key of 'includes' this would then
					//     cause an exception to be thrown and the rest of the code to not run.
					// for(var i in tempDates) {
					// 	removed.push(removeDate.call(this, tempDates[i], type));
					// }
				} else {
					removed.push(removeDate.call(this, dates, type));
				}
				$(this).datepicker('refresh');
				return removed;
			},
			removeIndexes : function( indexes, type ) {
				if(!type) type = 'picked';
				var removed = [];
				if (Object.prototype.toString.call(indexes) === '[object Array]') {
					for(var i in indexes.sort(function(a,b){return b-a})) {
						removed.push(removeIndex.call(this, indexes[i], type));
					}
				} else {
					removed.push(removeIndex.call(this, indexes, type));
				}
				$(this).datepicker('refresh');
				return removed;
			},
			resetDates : function ( type ) {
				if(!type) type = 'picked';
				this.multiDatesPicker.dates[type] = [];
				$(this).datepicker('refresh');
			},
			toggleDate : function( date, type ) {
			    if (!type) type = 'picked';
				
				switch(this.multiDatesPicker.mode) {
					case 'daysRange':
						this.multiDatesPicker.dates[type] = []; // deletes all picked/disabled dates
						var end = this.multiDatesPicker.autoselectRange[1];
						var begin = this.multiDatesPicker.autoselectRange[0];
						if(end < begin) { // switch
							end = this.multiDatesPicker.autoselectRange[0];
							begin = this.multiDatesPicker.autoselectRange[1];
						}
						for(var i = begin; i < end; i++) 
							methods.addDates.call(this, methods.sumDays(date, i), type);
						break;
					default:
						if(methods.gotDate.call(this, date) === false) // adds dates
							methods.addDates.call(this, date, type);
						else // removes dates
							methods.removeDates.call(this, date, type);
						break;
				}
			}, 
			setMode : function( options ) {
				var $this = $(this);
				if(options.mode) this.multiDatesPicker.mode = options.mode;
				
				switch(this.multiDatesPicker.mode) {
					case 'normal':
						for(var option in options)
							switch(option) {
								case 'maxPicks':
								case 'minPicks':
								case 'pickableRange':
								case 'adjustRangeToDisabled':
									this.multiDatesPicker[option] = options[option];
									break;
								//default: $.error('Option ' + option + ' ignored for mode "'.options.mode.'".');
							}
					break;
					case 'daysRange':
					case 'weeksRange':
						var mandatory = 1;
						for(var option in options)
							switch(option) {
								case 'autoselectRange':
									mandatory--;
								case 'pickableRange':
								case 'adjustRangeToDisabled':
									this.multiDatesPicker[option] = options[option];
									break;
								//default: $.error('Option ' + option + ' does not exist for setMode on jQuery.multiDatesPicker');
							}
						if(mandatory > 0) $.error('Some mandatory options not specified!');
					break;
				}
				
				/*
				if(options.pickableRange) {
					$this.datepicker("option", "maxDate", options.pickableRange);
					$this.datepicker("option", "minDate", this.multiDatesPicker.minDate);
				}
				*/
				
				if(mdp_events.onSelect)
					mdp_events.onSelect();
				$this.datepicker('refresh');
			},
		    setVisibleDate : function ( date ) {
		        var $this = $(this);
		        $this.datepicker("setDate", date);
		    },
			setEditable : function (editMode) {
			    this.multiDatesPicker.editable = editMode;
			    $(this).datepicker("refresh");
			}
		};
		
		this.each(function() {
			if (!this.multiDatesPicker) {
				this.multiDatesPicker = {
					dates: {
						picked: [],
						disabled: []
					},
					mode: 'normal',
					adjustRangeToDisabled: true
				};
			}
			
			if(methods[method]) {
				var exec_result = methods[method].apply(this, Array.prototype.slice.call(mdp_arguments, 1));
				switch(method) {
					case 'getDates':
					case 'removeDates':
				    case 'gotDate':
				    case 'gotDateTypes':
					case 'sumDays':
					case 'compareDates':
				    case 'dateConvert':
				    case 'addDates':
				    case 'setVisibleDate':
				    case 'setEditable':
						ret = exec_result;
				}
				return exec_result;
			} else if( typeof method === 'object' || ! method ) {
				return methods.init.apply(this, mdp_arguments);
			} else {
				$.error('Method ' +  method + ' does not exist on jQuery.multiDatesPicker');
			}
			return false;
		});
		
		if(method != 'gotDate' && method != 'getDates') {
			var aaaa = 1;
		}
		
		return ret;
	};

	var PROP_NAME = 'multiDatesPicker';
	var dpuuid = new Date().getTime();
	var instActive;

	$.multiDatesPicker = {version: false};
	//$.multiDatesPicker = new MultiDatesPicker(); // singleton instance
	$.multiDatesPicker.initialized = false;
	$.multiDatesPicker.uuid = new Date().getTime();
	$.multiDatesPicker.version = $.ui.multiDatesPicker.version;

	// Workaround for #4055
	// Add another global to avoid noConflict issues with inline event handlers
	window['DP_jQuery_' + dpuuid] = $;
})( jQuery );