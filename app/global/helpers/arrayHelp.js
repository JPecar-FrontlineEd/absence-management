(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------# //
	// #----- Helper (arrayHelp) -----# //
	app.factory('arrayHelp', function () {

		// function getTypedValue(val) {
		// 	var typedVal;
		// 	if (angular.isDate(val)) {
		// 		typedVal = val;
		// 	} else {
		// 		typedVal = (val + '').toLowerCase();
		// 	}
		// 	return typedVal;
		// }

		return {
			toArray: function (obj) {
				return Array.prototype.slice.call(obj);
			},
			sortDateString: function(a,b) {
			  a = a.split('/').reverse().join('');
			  b = b.split('/').reverse().join('');
			  return a > b ? 1 : a < b ? -1 : 0;
			},
			sort: function (name, desc) {
		        var rev = desc ? -1 : 1;
		        return function (a, b) {
		            var out = 0;
		            //var val1 = getTypedValue(a[name]);
		            //var val2 = getTypedValue(b[name]);
		            if (a[name].localeCompare != null) {
		            	//LocaleCompare will handle situations where we have chracters with accents present
		            	if (a[name].localeCompare(b[name]) > 0) { out = 1; }
		            	if (a[name].localeCompare(b[name]) < 0) { out = -1; }
		            } else {
			            if (a[name] > b[name]) { out = 1; }
			            if (a[name] < b[name]) { out = -1; }
		            }
		            return out * rev;
		        };
    		},
    		multiLevelSort: function(colsToSort, desc) {
    			var rev = desc ? -1 : 1;
    			return function (a, b) {
    				var out = 0;

    				for (var i = 0; i < colsToSort.length; i++) {
    					var col = colsToSort[i];
    					if (a.hasOwnProperty(col)) {
    						var aVal = a[col],
    							bVal = b[col];

    						//convert to lowercase for string compare
    						if (a[col].toLowerCase) {
    							aVal = a[col].toLowerCase();
    							bVal = b[col].toLowerCase();
    						}

    						if (a[col].localeCompare != null) {
				            	//LocaleCompare will handle situations where we have chracters with accents present
				            	if (aVal.localeCompare(bVal) > 0) { out = 1; i = colsToSort.length; }
				            	if (aVal.localeCompare(bVal) < 0) { out = -1; i = colsToSort.length; }
				            } else {
					            if (aVal > bVal) { out = 1; i = colsToSort.length; }
			            		if (aVal < bVal) { out = -1; i = colsToSort.length; }
				            }
    					}
    				}

    				return out * rev;
    			};
    		},
    		distinctObjectList: function (list, uniqueField) {
    			var uniqueFieldList = list.map(function (i){ return i[uniqueField]; });
	        	return list.filter(function (i,a){ return uniqueFieldList.indexOf(i[uniqueField]) === a; });
    		},
    		// items
    		// groupBy - name of property
    		// sortBy - name of property to sort items within group
    		// process - function used to add properties to group object
    		group: function(items, groupBy, sortBy, process) {
    			var groups = [];
    			var sortedItems = angular.copy(items);
				sortedItems.sort(this.sort(groupBy, false));
				var curGroup = null;
				var itemCount = sortedItems.length;
				for (var i = 0; i < itemCount; i++) {
					var item = sortedItems[i],
					    groupVal = item[groupBy];
					if (curGroup === null || groupVal !== curGroup.name) {
						//Add grouped header row
						if (curGroup !== null) {
							curGroup.items.sort(this.sort(sortBy, false));
							groups.push(process(curGroup));
						}
						curGroup = { name: groupVal, items: [] };
					}
					curGroup.items.push(item);
					if (i === itemCount - 1) {
						curGroup.items.sort(this.sort(sortBy, false));
						groups.push(process(curGroup));
					}
				}

    			return groups;
    		},
			intersectionByField: function (array1, array2, field) {
				var intersection = [];
			   angular.forEach(array1, function(value,index){
			    angular.forEach(array2, function(object,index1){
			     if(value[field] === object[field]){
			       intersection.push(object);
			     }
					});
				});
				return intersection;
			},
    		indexOf: function(arr, prop, value) {
        		for (var i = 0; i < arr.length; i++) {
	            	if (arr[i][prop] === value) {
	                	return i;
	            	}
        		}
        		return -1;
        	}
		};

	});
	// #--- END Helper (arrayHelp) ---# //
	// #------------------------------# //

}());
