(function () {
	'use strict'; 
    var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Service (relatedCalendarDataSvc) -----# //
	app.factory('relatedCalendarDataSvc', function (storageSvc, absrStateVal) {

        //Create an entry in session storage with name "relatedCalendarDataSvc" and value {"data":{"debug":true}}
		let debug = storageSvc.load("relatedCalendarDataSvcDebug") != null;

        let storageSvcKey = "relatedCalendarData";

        function getOtherControlInfo(cache, compId, instKey, fullKey)
        {
            let result = undefined;

            let propertyNames = Object.keys(cache);
            let found = propertyNames.filter(function(currentVal) {
                return currentVal.startsWith(instKey) &&
                    !cache[currentVal].placeholder;
            });
            if (found.length > 0) {
                let otherKey = found[0];
                if (debug) console.log(new Date().toISOString() + " " + compId + " " + "using other cached key " + otherKey);
                result = cache[otherKey];
                cache[fullKey] = result;
                storageSvc.save({
                    key: storageSvcKey,
                    data: cache,
                    persistent: false
                });
            }

            return result;
        }

        function stopOtherEventHandlers(cache, fullKey) {
            //Stop other event handlers from doing the same API call
            let result = {placeholder:true};		
            cache[fullKey] = result;	
            storageSvc.save({
                key: storageSvcKey,
                data: cache,
                persistent: false
            });
            return result;
        }

        function getKeys(month, year, instId, compId)
        {
            let monthInt = parseInt(month);
            let monthStr = (monthInt <= 9 ? "0" + monthInt : monthInt);
            let instKey = monthStr + "_" +  year + "_" + instId;
            let fullKey =  instKey + "_" + compId; 
            return {
                instKey: instKey,
                fullKey: fullKey
            }
        }

        function parseAbsrStateVal() {
            let absr = absrStateVal.absr;
            let absrId = (absr === null ? 0 : absr.id);

            let absences = (absr === null ? [] : absr.absences);
            if (absences === null) absences = [];
            
            let absList = "";
            absences.forEach((item)=>{ absList += item.id + ","});
            
            return {
                workId: absrStateVal.worker.id,
                absrId: absrId,
                numAbsences: absences.length,
                absList: absList
                };
        }
        function initialCacheObject()
        {
            return { absrInfo : parseAbsrStateVal() };
        }
        
        function getLocalCachedDataOnly(month, year, instId, compId, jsFileName)
        {
            let relatedCalendarDataCache = storageSvc.load(storageSvcKey);
            if (relatedCalendarDataCache === null) relatedCalendarDataCache = initialCacheObject();
            
            let keys = getKeys(month, year, instId, compId);

            //See if we already have the cache info for this component
            let value = relatedCalendarDataCache[keys.fullKey];
            
            //See if some other component has already cached the data. If so, use it.
            if (value === undefined) {
                if (debug) console.log(new Date().toISOString() + " " + compId + " " + jsFileName + " " + "no cached related calendar data found for key " + keys.fullKey);
                value = getOtherControlInfo(relatedCalendarDataCache, compId, keys.instKey, keys.fullKey);
            }

            return { keys: keys, value: value };
        }
        
        function getLocalCachedData(month, year, instituteId, compId, jsFileName)
        {
            let getApiRelatedData = false;
            let relatedCalendarDataCache = storageSvc.load(storageSvcKey);
            if (relatedCalendarDataCache === null) relatedCalendarDataCache = initialCacheObject();
            
            let localCachedData = getLocalCachedDataOnly(month, year, instituteId, compId);

            //Still nothing...
            if (localCachedData.value === undefined) {
                localCachedData.value = stopOtherEventHandlers(relatedCalendarDataCache, localCachedData.keys.fullKey);
                getApiRelatedData = true;
            }

            let result = 
                { 
                getApiRelatedData: getApiRelatedData, 
                compId: compId,
                jsFileName: jsFileName,
                key: localCachedData.keys.fullKey, 
                value: localCachedData.value, 
                isPlaceholder : localCachedData.value.placeholder, 
                saveResults : function(apiResult) {
                    if (debug) console.log(new Date().toISOString() + " " + this.compId + " " + this.jsFileName + " " + "inside saveResults - " + this.toString());
                    this.value = apiResult;
                    let currCache = storageSvc.load(storageSvcKey);
                    if (currCache === null) currCache = initialCacheObject();
                    currCache[this.key] = apiResult;
                    storageSvc.save({
                        key: storageSvcKey,
                        data: currCache,
                        persistent: false
                    })},
                toString : function() { 
                    let result = "key=" + this.key + ", " + 
                                "getApiData=" + this.getApiRelatedData + ", " + 
                                "isPlaceholder=" + this.isPlaceholder; 
                    
                    return result;
                }
            };

            if (debug) console.log(new Date().toISOString() + " " + compId + " " + jsFileName + " " + result.toString());
            return result;
        }

        function createDot(parentContainer, className){
            var dot = $('<span />');
            let icon = '';
            if(className == 'absencedot') {
                icon = 'A';
            } else if(className == 'closeddot') {
                icon = 'C'
            } else if(className == 'inservicedot') {
                icon = 'IS'
            }
            
            dot.eq(0).addClass(className).addClass("legendParent").html(icon);
            parentContainer.append(dot);
    
            if(parentContainer.children().length > 1){
                parentContainer.children().eq(0).addClass('marginLeft0P');
                parentContainer.children().eq(1).addClass('marginLeft50P');
            }
        }

        function addDot(el, isVacancy, calendarData, dateIndex, parentContainer){
            if(calendarData.IsClosedDay){
                createDot(parentContainer, 'closeddot');
            }
            if(calendarData.IsInserviceDay){
                createDot(parentContainer, 'inservicedot');
            }
            if(calendarData.NumberOfAbsences > 0 && !isVacancy){
                createDot(parentContainer, 'absencedot');
            }
    
            var msie = document.documentMode;
    
            var containerElement = el
                .find('td:not(".ui-datepicker-other-month")')
                .find('.ui-state-default').eq(dateIndex-1)
                .parent();
            if(containerElement.children().length < 2)
            {
                containerElement.append(parentContainer);
                if(msie != undefined){
                    parentContainer.eq(0).addClass('ie_dotcontainer');
                    if(parentContainer.eq(0).parent().hasClass("ui-state-disabled"))
                    {
                        parentContainer.eq(0).css("top", "-31px");
                    }
                }
                else
                    parentContainer.eq(0).addClass('dotcontainer');
            }
    
            if(msie != undefined)
            {
                el.find('.ui-state-default').parent().parent().addClass("ie_tablerow");
                el.find('td').addClass("ie_tablemargin");
                el.find('table').addClass("ie_tableheight");
            }
            else
            {
                el.find('.ui-state-default').parent().parent().addClass("tablerow");
                el.find('td').addClass("tablemargin");
            }
            el.find('th').addClass("weeknames");
            el.find('th').parent().addClass("tableheader");
        }

        function writeDots(el, values, isVacancy, compId, jsFileName, multiPicker) {
            if (debug) console.log(new Date().toISOString() + " " + compId + " " + jsFileName + " write dots");
            if (values === undefined) return;
            
            var result = values[0] === undefined ? values[1] : values[0];
            if (result.length == 0 || result.placeholder) return;

            if (multiPicker) {
                let firstOfMonth = result[0].Date.substring(0,7) + '-01';
                let cell = el.find("td:not('.ui-datepicker-other-month')." + firstOfMonth);
                if (cell.length == 0) return;
            }

            el.find("span").remove(".dotcontainer");
            el.find("span").remove(".ie_dotcontainer");
            for (var i = 0; i < result.length; i++)
            {
                var parentContainer = $('<span />');
                var calendarData = result[i];
                var dateIndex = new Date(calendarData.Date).getDate();
                addDot(el, isVacancy, calendarData, dateIndex, parentContainer);
            }
        }

        //Use this if the date range is something other than a full month
        //e.g.  Single day,  Multi-day that spans multiple months, etc.
        function getLocalCachedDataForDateRange(startDate, endDate, instId, workId, compId, isVacancy) {
            function addDays(date, days) {
                date.setDate(date.getDate() + days);
                return date;
              }
            let sd = (startDate instanceof Date ? startDate : new Date(startDate));
            let ed = (endDate instanceof Date ? endDate : new Date(endDate));
            let loopStartDate = sd;

            let merged = { allMonthsOK: true, allMonthData: [] };
            while (true) {
                let year = loopStartDate.getFullYear();
                let month = loopStartDate.getMonth();
                let monthData = getLocalCachedDataOnly(month+1, year, instId, compId);
                if (monthData.value != undefined) {
                    merged.allMonthData = merged.allMonthData.concat(monthData.value);
                }
                else {
                    merged = { allMonthsOK: false, allMonthData: [] };
                    break;
                }

                let monthEnd = new Date(year, month + 1, 0);
                loopStartDate = addDays(monthEnd, 1);

                if (loopStartDate > ed) break;
            }

            return merged;
        }

        function saveRangeInfoToCache(data, instId, compId)
        {
            let currCache = storageSvc.load(storageSvcKey);
            if (currCache === null) currCache = initialCacheObject();
            
            let grouped = Object.groupBy(data, (item)=>{
                return item.Date.substring(0, 7);
            });
            
            Object.keys(grouped).forEach((yearMonth) =>{
                let year = yearMonth.substring(0, 4);
                let month = yearMonth.substring(5);
                let cacheKeys = getKeys(month, year, instId, compId);
                if (currCache[cacheKeys.fullKey] === undefined)
                {
                    currCache[cacheKeys.fullKey] = grouped[yearMonth];
                    storageSvc.save({
                        key: storageSvcKey,
                        data: currCache,
                        persistent: false
                    });
                }
            });
        }

        function clearCache(jsFileName)
        {
            let currCache = storageSvc.load(storageSvcKey);
            if (currCache === null) return;

            let absrInfo = currCache.absrInfo;
            let absrStateInfo = parseAbsrStateVal();

            if (absrStateInfo.workId == absrInfo.workId && 
                absrStateInfo.absrId == absrInfo.absrId &&
                absrStateInfo.numAbsences == absrInfo.numAbsences && 
                absrStateInfo.absList == absrInfo.absList) return;

            if (debug) console.log(new Date().toISOString() + " " + jsFileName + " storageSvc.clear('relatedCalendarData')");
            storageSvc.clear(storageSvcKey);
        }

		return {
			getLocalCachedData: getLocalCachedData,
            writeDots: writeDots,
            getLocalCachedDataForDateRange: getLocalCachedDataForDateRange,
            saveRangeInfoToCache: saveRangeInfoToCache,
            clearCache: clearCache
		};

	});
	// #--- END Service (relatedCalendarDataSvc) ---# //
	// #-----------------------------# //
}()
);