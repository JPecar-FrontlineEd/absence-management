(function() {'use strict';var app = angular.module('aesop');

	// #----------------------------# //
	// #----- Helper (urlHelp) -----# //
	app.factory('urlHelp', function (config, tokenSvc, $location, reportHelp) {

		var siteRootUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/';
		var apiRoot = (config.apiEndpoint.toLowerCase().indexOf('localhost') > -1) ?
					     'http://localhost.fldev.net:9000/api' :
					     config.apiEndpoint;
		var apiLegacyRedirectUrl = apiRoot + '/v1.0/System/RedirectToLegacySite?key=';
		var absenteeDownloadUrl = apiRoot + '/v1.0/{0}Report';
		var token = tokenSvc.get();

		//Report Writer specific urls
		var rwUrl = 'reportConfigRedirect.asp?';
		var apiRwExecutionsUrl = apiRoot + '/v1.0/ReportWriter/Executions/';
		var apiAbsInteractiveUrl = apiRoot + '/v1.0/AbsenceInteractive/Executions/';
		var rwActions = {
			'1': 'execute',  //Run with saved filters
			'2': 'filter',   //Run with new filters
			'3': 'config',   //Create/edit
			'4': 'config'	   //Create/edit
		};




		//Private functions
		function getApiLegacyRedirectUrl(tokenKey) {
			return apiLegacyRedirectUrl + tokenKey;
		}

		function getReturnUrl(path) {
			return siteRootUrl + 'token/' + token + path;
		}

		//Parameters:
		//  action: 1-Run with saved filters, 2-Run with new filters, 3-Edit, 4-Create
		function getReportWriterUrlParams(reportConfig, action) {
			var queryParams = '';
			action = action + '';
			var actionValue = rwActions[action];
			queryParams = 'action=' + actionValue;
			if (action === '4') {
				queryParams += '&rt_id=' + reportConfig.type.id;
			}
			else {
				queryParams += '&rc_id=' + reportConfig.id;
			}
			if (action !== '1') {
				queryParams += '&letter=' + (reportConfig.isLetter ? 1 : 0);
			}
			return queryParams;
		}

		function getReportWriterUrl(reportConfig, action) {
			return rwUrl + getReportWriterUrlParams(reportConfig, action);
		}


		//Returns object with values populated either from search params or the
		//  supplied default object properties
		//Parameters:
		//  defaults (object) - properties to find in search params
		//  nullables (string array) - force these search params to null if they exist and are empty
		function getSearchParamOrDefaultValues(defaults, nullables) {
		    var values = {},
		    	searchParams = $location.search();
		    for (var prop in defaults) {
		        var value = null;
		        var defaultValue = angular.isDefined(defaults[prop]) ? defaults[prop] : null;
		        var paramValue = angular.isDefined(searchParams[prop]) ? searchParams[prop] : '';
		        if (nullables.indexOf(prop) > -1 && paramValue.length === 0) {
		        	paramValue = null;
		        }
		        value = angular.isDefined(searchParams[prop]) ? paramValue : defaultValue;
		        values[prop] = value;
		    }
		    return values;
		}

		//Sets search params for specific list of properties to the supplied values
		//Parameters:
		//  paramsToSet (object) - properties to set in search params
		//  values (object) - values to be assigned
		//  objectKey (string) - if value is an object, name of property which contains the value (typically 'id')
		//  includeNullValues (bool) - include the param even if the value is null
		function setSearchParamValues(paramsToSet, values, objectKey, includeNullValues) {
            var params = {};
            includeNullValues = angular.isDefined(includeNullValues) ? includeNullValues : true;
            objectKey = angular.isDefined(objectKey) ? (objectKey + '') : '';

            for (var param in paramsToSet) {
            	//No value exists, ignore
            	if (!angular.isDefined(values[param])) {
            		continue;
            	}
                var value = values[param];
            	//Value is an object, grab the value from the specified property
                if (angular.isObject(value) && angular.isDefined(value[objectKey])) {
                    value = value[objectKey];
                }
                //Set to empty string to force include the param
                if (value === null && includeNullValues) {
                	value = '';
                }
                params[param] = value;
            }
            $location.search(params);
		}

		function isNavigatorUrl(url) {
			return url.indexOf('.asp') >= 0;
		}

		function downloadPdfUrl(report , converter, currentSearchFilters, imgStr) {
			var queryString = '';
			var filter = converter(currentSearchFilters);
			delete filter.fields;
			filter.printPageBreaks = currentSearchFilters.printPageBreaks;
			filter.orderBy = currentSearchFilters.orderBy;
			filter.token = tokenSvc.get();
			Object.keys(filter).forEach((x) => {
				if(!queryString.length) {
					queryString = '?' + x + '=' + filter[x];
				}else {
					if((angular.isString(filter[x]) && filter[x].length) || (typeof filter[x] == "boolean")) {
						queryString = queryString + '&' + x + '=' + filter[x];
					}
				}
			});
			if(imgStr) { queryString = queryString + '&img=' + imgStr }
			return absenteeDownloadUrl.replace('{0}', report) + queryString;
		}



		//Public functions
		return {
			siteRootUrl: siteRootUrl,
			apiRoot,
			getReturnUrl: function(path) {
				return getReturnUrl(path);
			},

			//Parameters:
			//  action: 1-Run with saved filters, 2-Run with new filters, 3-Edit, 4-Create
			//  returnUrl: Which route to come back to (use getReturnUrl() to create so token is included)
			getRwExecuteReportUrl: function(reportConfig, returnUrl, action) {
		        var destUrl = getReportWriterUrl(reportConfig, action) + '&sitepath=' + returnUrl;
		        var currentDate = new Date();
		        return getApiLegacyRedirectUrl(reportConfig.tokenKey) + '&destination=' + encodeURIComponent(destUrl) + '&ts=' + currentDate.getTime();
			},

			getRwDownloadUrl: function(reportExec, fileType) {
				return apiRwExecutionsUrl + reportExec.id + '/Download?key=' + encodeURIComponent(reportExec.downloadKey) + '&fileType=' + fileType;
			},

			getAbsInteractiveDownloadUrl: function(reportExec, fileType) {
				return apiAbsInteractiveUrl + reportExec.id + '/Download?key=' + encodeURIComponent(reportExec.downloadKey) + '&fileType=' + fileType;
			},

			getSearchParamOrDefaultValues: getSearchParamOrDefaultValues,
			setSearchParamValues: setSearchParamValues,
			isNavigatorUrl,
			downloadPdfUrl
		};

	});
	// #--- END Helper (urlHelp) ---# //
	// #----------------------------# //

}());
