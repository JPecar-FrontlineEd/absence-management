(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------# //
	// #----- Helper (locationHelp) -----# //
	app.factory('locationHelp', function ($location, parseDateFilter) {

		function flattenObject(obj) {
			var flattenedObj = {};
			flattenChildren(obj, flattenedObj, '');
			return flattenedObj;
		}

		// please note, flattening children is not in line with core values
		function flattenChildren(obj, flattenedObj, parentKey) {
			Object.keys(obj).forEach(function (key){
				var keyName = parentKey === '' ? key : parentKey + '.' + key;
				if (angular.isArray(obj[key])) {
					flattenedObj[keyName] = obj[key].join(',');
				} else if (angular.isObject(obj[key]) && Object.keys(obj[key]).length > 0) {
					flattenChildren(obj[key], flattenedObj, keyName);
				} else {
					flattenedObj[keyName] = cleanDate(obj[key]);
				}
			});
		}

		function mapSearchObj(updateObj) {
			var searchParams = $location.search();
			Object.keys(searchParams).forEach(function (searchKey) {
				var value = cleanDate(searchParams[searchKey]);
				var splitKeys = searchKey.split('.');
				var currentObj = updateObj;

				splitKeys.forEach(function (key){
					if (currentObj.hasOwnProperty(key)) {
						if (angular.isArray(currentObj[key])) {
							currentObj[key] = value === '' ?
											[] :
											(angular.isArray(value) ? value.split(',').map(function (val) { return checkForNumber(val); }) : [checkForNumber(value)]);
						} else if (!angular.isObject(currentObj[key])) {
							currentObj[key] = value;
						} else {
							currentObj = currentObj[key];
						}
					}
				});
			});
		}

		function hasSearch() {
			var searchObj = $location.search();
			return (searchObj != null && angular.isObject(searchObj) && Object.keys(searchObj).length > 0);
		}
		function hasDestination() {
			if (hasSearch()) {
				var searchObj = $location.search();
				var destinationKey = 'destination';
				if (searchObj.hasOwnProperty(destinationKey)) {
					return true;
				}
			}
			return false;
		}
		function cleanDate(obj) {
			return angular.isDate(obj) ? parseDateFilter(obj, 'MM/dd/yyyy') : obj;
		}
		function checkForNumber(obj) {
			return isFinite(obj) ? Number(obj) : obj;
		}

		return {
			redirect: function (path, params, includeReferrer) {
				var flattenedObj = {};
				if (params != null) {
					flattenedObj = flattenObject(params);
				}
				if (includeReferrer) {
					flattenedObj['destination'] = $location.path();
				}
				$location.path(path).search(flattenedObj);
			},
			goToDestination: function(){
				if (hasDestination) {
					var searchObj = $location.search();
					var destination = searchObj['destination'];
					delete searchObj['destination'];
					$location.path(destination).search(searchObj);
				}
				return;
			},
			parseSearch: function(updateObj) {
				mapSearchObj(updateObj);
				//console.log(' => updatedObj', updateObj); // REMOVE ME
			},
			currentSearch: function() {
				return $location.search();
			},
			updateSearch: function(search){
				$location.search(search);
			},
			hasSearch: hasSearch,
			hasDestination: hasDestination,
			flattenObject: flattenObject
		};

	});
	// #--- END Helper (locationHelp) ---# //
	// #---------------------------------# //

}());