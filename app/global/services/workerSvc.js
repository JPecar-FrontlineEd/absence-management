(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------# //
	// #----- Service (workerSvc) -----# //
	app.factory('workerSvc', function ($q, $location, arrayHelp, institutionSvc, absrStateVal, workerApi, stringSvc) {

		var strings = stringSvc.getStrings([
		    'Worker.Fulfillment.DoesNotNeedSub',
		    'Worker.Fulfillment.CanDecide'
		 ]);


		function absrWorkflowWhatWorkerIsSelected() {
			var errorMessage = 'no worker found';

			var _defer = $q.defer();

			var searchObject = $location.search();
			if (searchObject && searchObject.workerId) {
				var workerFromApi = workerApi.get({
					workerId: searchObject.workerId,
					fields: '(isVacancy,id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment,HalfDayAMEndTime,HalfDayPMStartTime,DeductBreakFromAbsenceDuration)'
				}).then(function(result) {
						var mapped = processWorkerApiData(result);
						if (mapped.length > 0) {
							absrStateVal.createAnotherAbsenceForThisWorker = true;
							_defer.resolve(mapped[0]);
						}
					}, function(result) {
						_defer.reject(errorMessage);
					});
			}
			else {
				//no querystring parameter, check absrStateVal.worker
				if (absrStateVal.worker && absrStateVal.worker.id) {
					_defer.resolve(absrStateVal.worker);
				} else {
					_defer.reject(errorMessage);
				}
			}

			return _defer.promise;
		}

		function processWorkerApiData(data, isVacancy, showIdentifier) {
			function getMoreSchoolsText(schools) {
				var schoolsHtml = '';
				if (schools.length > 1) {
					schoolsHtml += '<ul>' + schools.filter(function (v, i) { return !!i; }).reduce(function (prev, val) {
						return prev + '<li title="'+ val.value +'">' + val.value + '</li>';
					}, '') + '</ul>';
				}
				return schoolsHtml;
			}

			return data.map(function (row, i, a) {
				var schools = row.institution.map(function (v) {
						var inst = institutionSvc.oneById(v.id);
						return {
								id:v.id,
								value:inst.name,
								data: {
									startTime : inst.startTime,
									endTime : inst.endTime,
									HoursPerDay : inst.HoursPerDay,
									MaxAbsenceDuration : inst.MaxAbsenceDuration,
									MinAbsenceDuration : inst.MinAbsenceDuration
								}
						};


					}),
					name = [];
				schools.sort(arrayHelp.sort('value'));

				if (row.lastName) { name.push(row.lastName); }
				if (row.firstName) { name.push(row.firstName); }

				var workerInfo = {
					id: row.id,
					group: row.lastName.charAt(0).toUpperCase(),
					name: name.join(', '),
					identifier: row.identity,
					phone: row.phone,
					school: schools[0].value,
					schoolId: schools[0].id,
					schools: schools,
					isVacancy: row.hasOwnProperty("isVacancy") ? row.isVacancy : isVacancy,
					moreSchools: row.institution.length - 1,
					moreSchoolsText: getMoreSchoolsText(schools),
					accountingCode: row.accountingCode,
	                budgetCode: row.budgetCode,
	                needFulfilment: row.needFulfilment,
					HalfDayAMEndTime: row.HalfDayAMEndTime,
					HalfDayPMStartTime: row.HalfDayPMStartTime,
					DeductBreakFromAbsenceDuration: row.DeductBreakFromAbsenceDuration,
					workerType: row.workerType
				};

				//Information tooltip should not show for Vacancy Profiles
				if (!workerInfo.isVacancy) {
					workerInfo.toolTipData = {
						type: row.workerType.title,
						name: name.join(', '),
						identifier: showIdentifier ? row.identity : '',
						data: [{
							val: row.title,
							icon: 'fa-users'
						},{
							val: '<span>' + schools.reduce(function(prev,cur){ return prev + cur.value + '<br>' },'') + '</span>',
							icon: 'fa-institution'
						},{
							val: row.phone,
							icon: 'fa-phone'
						}]
	                };
	                if (workerInfo.needFulfilment == 0) {
	                    workerInfo.toolTipData.data.push({ val: strings['Worker.Fulfillment.DoesNotNeedSub'] });
	                };
	                if (workerInfo.needFulfilment == 2) {
	                    workerInfo.toolTipData.data.push({ val: strings['Worker.Fulfillment.CanDecide'] });
	                };
	            }
				return workerInfo;
			});
		}




		return {
			absrWorkflowWhatWorkerIsSelected,
			processWorkerApiData
		};

	});
	// #--- END Service (workerSvc) ---# //
	// #--------------------------# //

}());
