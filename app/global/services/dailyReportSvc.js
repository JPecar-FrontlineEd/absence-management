(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Service (dailyReportSvc) -----# //
	app.factory('dailyReportSvc', function ($filter, stringSvc, institutionSvc, permissionSvc, parseAesopDateFilter, userSvc, shiftTypesSvc, dateHelp) {


		var strings = stringSvc.getStrings([
			'Vacancy',
			'Absence',
			'Report.Label.BreakDuration'
		]);
		var colConfig = {
			confirmation: {
				key: 'id', width: '3',
				isIndex: true,
				name: 'Dashboard.UnfilledTable.ConfirmationNum.Title',
				template:'<cmpt-template-confirmation-link absrid="{{ row.id }}" ></cmpt-template-confirmation-link>'+
						  '<div class="sub-title">{{ row.absrTypeStr }}</div>' +
						  '<cmpt-template-day-span-indicator class="hide-print" ng-if="row.hasDaysInPast || row.hasDaysInFuture" has-days-in-past="row.hasDaysInPast" has-days-in-future="row.hasDaysInFuture" ></cmpt-template-day-span-indicator>'
			},
			worker: {
				key: 'workerName', width: '3',
				name: 'Dashboard.UnfilledTable.Name.Title',
				template:'<cmpt-template-worker-link is-daily-report = true worker-id="{{ row.workerId }}" worker-name="{{ row.workerName }}" show-name-as-link="true" is-vacancy= "row.isVacancy" wrap-text-in-line="true"></cmpt-template-worker-link>' +
						 '<div class="sub-title">{{ row.workerTitle }}</div>'
			},
			institution: {
				key: 'firstInstitution', width: '4',
				name: 'Dashboard.UnfilledTable.School.Title',
				template: '<div class="multi-value" ng-repeat="item in row.institutions" ng-class="{\'not-available\': !item.inst.isAvailable}" title="{{item.inst.name}}">{{ item.inst.name }}</div>',
			},
			reason: {
				key: 'firstReason', width: '4',
				name: 'Dashboard.UnfilledTable.Reason.Title',
				template: '<div  class="multi-value {{row.cls}} wrap-words" ng-repeat="reason in row.absenceReasons" ng-class="{\'not-available\': !reason.isAvailable}" title="{{reason.name}}">{{ reason.name }}</div>'

			},
			cancelClosedReason: {
				key: 'firstCancelClosed', width: '2',
				name: 'Dashboard.UnfilledTable.ClosedReason.Title',
				template: '<div  class="wrap-words"  title="{{row.cancelReason}}">{{ row.cancelReason }}</div>'
			},
			notes: {
				key: 'firstNotes', width: '2',
				name: 'Notes',
				sortable: false,
				template:   '<div class="inline-records adminSubNotes">' + 
								'<span title="Notes to Sub" ng-if="row.notes.length > 0" style="color:rgb(222, 141, 55);cursor: pointer;font-size: 16px;" class="notesToSub-Icon hide-print" ng-click="parent.route.go.showNotes(row,\'notes\')"><i class="fa fa-file-text"></i></span>' +
								'<span title="Notes to Administrator" ng-if="row.notesToAdmin.length > 0" style="color:rgb(46, 122, 184);cursor: pointer;font-size: 16px;" class="notesToAdministrator-Icon hide-print" ng-click="parent.route.go.showNotes(row,\'notesToAdmin\')"><i class="fa fa-file-text"></i></span>' +
							'</div>' + 
							'<div class="inline-records-attachments">' + 
								'<span title="Administrator Notes" ng-if="row.notesToAdminOnly.length > 0 && row.canViewAdminOnlyNotes" style="color:rgb(191, 46, 58);cursor: pointer;font-size: 16px;white-space:normal;" class="administratorNotes-Icon hide-print" ng-click="parent.route.go.showNotes(row,\'notesToAdminOnly\')"><i class="fa fa-file-text"></i></span>' +
								'<span title="Attachments" ng-if="row.fileCount > 0" style="cursor: pointer;font-size: 16px;" class="attachments-Icon hide-print" ng-click="parent.route.go.showAttachments(row)"><i class="fa" ng-class="{\'fa-spinner fa-spin\': row.fetchingFiles, \'fa-paperclip\': !row.fetchingFiles}"></i></span>' +
							'</div>',
				headerTemplate:'<span>Notes</span>'

			},
			shift: {
				key: 'firstShift', width: '4',
				name: 'Dashboard.UnfilledTable.Shift.Title',
				sortable: false,
				template:'<cmpt-template-shift-types absences="row.absences" wrap-text-in-line="true"></cmpt-template-shift-types>',
				headerTemplate:'<span>Shift</span>'
			},
			duration: {
				key: 'duration', width: '2',
				name: 'Duration',
				sortable: false,
				template:   '<div  ng-repeat="item in row.institutions" ng-class="{\'not-available\': !item.inst.isAvailable}" class="multi-value">' +
								'<div class="time-wrapper">' +
									'<div class="wrap-words absence-time" title="{{row.employeeBreakDurationTipText}}" ng-class="{\'breakDeducted\': row.deductBreakFromEmployeeTimes}">{{item.absShiftType}}</div>' +
								'</div>' +
								'<div ng-if="row.canViewSubTimes" class="time-wrapper">' +
									'<div class="wrap-words pt-3 sub-time" title="{{row.substituteBreakDurationTipText}}" wrap-text-in-line="true" use-absence-sub-shift-type="true" ng-class="{\'breakDeducted\': row.deductBreakFromsubstituteTimes}">{{item.subShiftType}}</div>' +
								'</div>' +
							'</div>'
			},
			created: {
				key: 'created', width: '3',
				name: 'Dashboard.UnfilledTable.Created.Title',
				template: '<div class="date">{{ row.date }}</div>' +
							'<div class="time">{{ row.time }}</div>'
			},
			held: {
				key: 'held', width: '3',
				name: 'HeldUntil',
				sortable:false,
				template:'<span class="wrap-words" ng-if="row.heldPastFulfillmentCutoff">Held Past Cut Off</span>'+
							'<span class="wrap-words" ng-if="row.isHeld && !row.heldPastFulfillmentCutoff">Held Until {{ row.heldUntil }}</span>'
			},
			substitute: {
				key: 'substitute', width: '3',
				name: 'Substitute',
				sortable: false,
				template:'<cmpt-template-substitute-link is-daily-report = true  substitute-id="{{ row.substituteId }}" wrap-text-in-line="true" substitute-name="{{ row.substituteName }}" from-daily-reports="true"></cmpt-template-substitute-link>'
			},
			code: {
				key: 'codes', width: '3',
				name: 'DR.Tab.Table.Header.Text.Codes',
				sortable: false,
				template: '<cmpt-template-codes wrap-text-in-line="true" absences="row.absences"></cmpt-template-codes>'
			},
			approval: {
				key: 'approval', width: '2',
				name: '',
				cls: 'fa fa-check',
				template: '<cmpt-template-approval wrap-text-in-line="true" requires-approval="row.requiresApproval" is-approved="row.isApproved" pending-approved="row.pendingApproved" ' +
								'is-denied="row.isDenied" is-partially-approved="row.isPartiallyApproved" absr-id="row.id"></cmpt-template-approval>',
				sortable:false
			},
			workerType: {
				key: 'workerType', width:3,
				name:'WorkerTypeGeneric',
				sortable: true,
				template:'<div class="wrap-words">{{row.workerType}}</div>'
			}
		};


		function getConfig (key, override) {
			if (override == null) { override = {}; }
			return angular.copy(angular.extend({}, colConfig[key], override));
		}


		function absrType (obj) {
			if(obj.isClosed){
				return 'closed';
			}
			if(obj.isCancelled){
				return 'cancelled';
			}
			if (obj.needSub) {
				return obj.substitute === null ? 'unfilled' : 'filled';
			} else {
				return 'nosub';
			}
		}

		function processColumnData (absrRow) {
			
			var absences = absrRow.absences;
			var firstAbsence = absences[0];
			
			var obj = {};
			obj = mapColumnData(absrRow, firstAbsence);
			   obj.absences = absences;
			
		    obj.institutions = absences.map(function (v) {return { inst: institutionSvc.oneById(v.institution.id), absenceTime: absenceTime(v), vacancyTime: vacancyTime(absrRow.worker.isVacancy, v), absShiftType: absShiftType(v), subShiftType: subShiftType(v,absrRow.worker) };});
			obj.absenceReasons = absences.map(function (v) {
		     	var inst = institutionSvc.oneById(v.institution.id);
				return { name: v.entitlement.name, isAvailable: inst.isAvailable, instId: v.institution.id};
			});
			obj.institutionIds = absences.map(function (v) {return v.institution.id || 0;});
			// check if all institutions are unavailable to me, set class if so.
			obj.cls = obj.institutionIds.reduce(function (prev, instId) {
				// if prev was available, return that, we only care if they are all unavailable
				return prev || institutionSvc.oneById(instId).isAvailable;
			}, false) ? '' : 'not-available';
			return obj;
		}

		function processColumnDataForEachAbsence (absrRow) {
			var objarray =[];
			var absences = absrRow.absences;
			for(var i =0;i<absences.length;i++)
			{
			 	var firstAbsence = absences[i];
				var obj = {};
				obj = mapColumnData(absrRow, firstAbsence);
			
				var institution = institutionSvc.oneById(absences[i].institution.id);
				obj.institutions =[];
				obj.institutions.push({ inst: institution, absenceTime: absenceTime(absences[i]), vacancyTime: vacancyTime(absrRow.worker.isVacancy, absences[i]), absShiftType: absShiftType(absences[i]), subShiftType: subShiftType(absences[i],absrRow.worker) });
				obj.absenceReasons =[];
				obj.absenceReasons.push({ name: absences[i].entitlement.name, isAvailable: institution.isAvailable, instId: absences[i].institution.id});
				obj.absences =[];
				obj.absences.push(firstAbsence);
				obj.institutionIds = [];
				obj.institutionIds.push(absences[i].institution.id);
				obj.cls = institution.isAvailable ? '' : 'not-available';
				objarray.push(obj);
		    }
			return objarray;
		}
		
		function mapColumnData(absrRow, firstAbsence)
		{
			var absences = absrRow.absences;
			var obj={};
			var firstInst = institutionSvc.oneById(firstAbsence.institution.id);
			var breakDurationMS = "";
			obj.deductBreakFromAbsenceDuration = firstAbsence.DeductBreakFromAbsenceDuration && firstAbsence.absenceBreakDuration != undefined;
			obj.deductBreakFromEmployeeTimes = obj.deductBreakFromAbsenceDuration && firstAbsence.shiftType == 4;
			obj.deductBreakFromsubstituteTimes = obj.deductBreakFromAbsenceDuration && firstAbsence.substituteShiftType == 4;

			if(obj.deductBreakFromEmployeeTimes || obj.deductBreakFromsubstituteTimes)
			{
				var breakDuration = firstAbsence.absenceBreakDuration.split(":");
				breakDurationMS = new Date().setHours(breakDuration[0], breakDuration[1], breakDuration[2], 0);
				var tipText = strings['Report.Label.BreakDuration'] + ": " + breakDuration[0] + ":" + breakDuration[1];
				if(obj.deductBreakFromEmployeeTimes)
					obj.employeeBreakDurationTipText = tipText;
				if(obj.deductBreakFromsubstituteTimes)
					obj.substituteBreakDurationTipText = tipText;
			}
			
			obj.id = absrRow.id;
			obj.useAbsenceSubShiftType = true;
			obj.fileCount = absrRow.fileCount;
			obj.startDate = absrRow.startDate;
			obj.endDate = absrRow.endDate;
			obj.created = Date.parse(absrRow.created);
			obj.absrTypeStr = (absrRow.worker.isVacancy) ? strings.Vacancy : strings.Absence;
			obj.hasDaysInPast= (new Date(absrRow.startDate) < new Date(firstAbsence.date));
			obj.hasDaysInFuture=(new Date(absrRow.endDate) > new Date(firstAbsence.date));
			obj.workerId = absrRow.worker.id;
			obj.workerType = absrRow.worker.workerType.title;
			obj.workerName= absrRow.worker.isVacancy ? absrRow.worker.lastName : absrRow.worker.lastName + ', ' + absrRow.worker.firstName;
			obj.workerTitle = absrRow.worker.title;
			obj.workerExternalId = absrRow.worker.externalId;
			obj.isVacancy = absrRow.worker.isVacancy;
			//to get all the institutions at which this employee works.
			obj.allWorkerInstitutions = absrRow.worker.institution != null ? absrRow.worker.institution.map(function(v){ return v.id}) : '' ;
			obj.cancelReason = absrRow.cancelReason;
			obj.allItinerantAbsences = absences.filter(function(abs) {
                							return !institutionSvc.oneById(abs.institution.id).isAvailable;
										}).length === absences.length;
			obj.canViewSubTimes = permissionSvc.iHave('ABSR.ViewSubTimes');
			obj.date = parseAesopDateFilter(new Date(absrRow.created));
			obj.time = $filter('date')(new Date(absrRow.created),'shortTime');
			obj.substituteId = (absrRow.substitute === null) ? null : absrRow.substitute.id;
			obj.substituteName = (absrRow.substitute === null) ? null : absrRow.substitute.firstName + ' ' + absrRow.substitute.lastName;
			obj.subPhone = (absrRow.substitute === null) ? null : (permissionSvc.iHave('SUB.ViewPhone') || userSvc.isOrgUser()) ? absrRow.substitute.phone : null;
			obj.subExternalId = (absrRow.substitute === null) ? null : absrRow.substitute.externalId;

			obj.heldPastFulfillmentCutoff = absrRow.heldPastFulfillmentCutoff;
			obj.requiresApproval = absrRow.requiresApproval;
			obj.isApproved = absrRow.approvalStatus == 1 || absrRow.isApproved;
			obj.pendingApproved = absrRow.requiresApproval && !obj.isApproved;
			obj.isDenied = absrRow.approvalStatus == 2 || absrRow.isDenied;
			obj.isPartiallyApproved = absrRow.approvalStatus == 3 || absrRow.isPartiallyApproved;
			obj.isHeld = absrRow.isHeld;
			obj.heldUntil = (absrRow.heldUntil !== null) ? parseAesopDateFilter(absrRow.heldUntil, 'short') : '';
			
			obj.hasNotes = (absrRow.notes != null && absrRow.notes.length > 0) || (absrRow.notesToAdmin != null && absrRow.notesToAdmin.length > 0) || (absrRow.notesToAdminOnly != null && absrRow.notesToAdminOnly.length > 0);
			obj.notes= absrRow.notes;
			obj.notesToAdmin =absrRow.notesToAdmin;
			obj.notesToAdminOnly = absrRow.notesToAdminOnly;
			obj.fetchingFiles = false;
			obj.canViewAdminOnlyNotes = permissionSvc.iHave('ABSR.VIEWDTLSADMINNOTES');
			//Properties below are for soritng purpose.
			//=============================================
			obj.firstAbsence = firstAbsence;
			obj.firstInstitution = firstInst.name;
			obj.firstReason = firstAbsence.entitlement.name;
			//=============================================

			obj.hidden = false;
			return obj;
			
		}	

		function absenceTime (firstAbsence) {
			return $filter('date')(Date.parse(firstAbsence.absenceStartTime),'shortTime') + ' - ' + $filter('date')(Date.parse(firstAbsence.absenceEndTime),'shortTime');
		}

		function vacancyTime (isVacancy,firstAbsence) {
			var startTime = firstAbsence.substituteStartTime;
			var endTime = firstAbsence.substituteEndTime;

			return $filter('date')(Date.parse(startTime),'shortTime') + ' - ' + $filter('date')(Date.parse(endTime),'shortTime');
			// body...
		}

		function absShiftType(absence){
			var obj = getBreakTimeDuration(absence,null);
            var absShiftType = shiftTypesSvc.oneById(absence.shiftType).title;
			if(absence.shiftType == 4){
				absShiftType = dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(absence.absenceStartTime, absence.absenceEndTime));
                if(obj.deductBreakFromEmployeeTimes){
					absShiftType = dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(obj.breakDuration, absShiftType));
				}
			}
			return absShiftType;
		}
		function subShiftType(absence, worker){
			var obj = getBreakTimeDuration(absence,worker);
			var subShiftType = shiftTypesSvc.oneById(absence.substituteShiftType).title;
			if(absence.substituteShiftType == 4)
			{
                subShiftType = dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(absence.substituteStartTime, absence.substituteEndTime));
				if(obj.deductBreakFromsubstituteTimes){
					subShiftType = dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(obj.breakDuration, subShiftType));
				}
			}
			return subShiftType;
		}

		function getBreakTimeDuration(firstAbsence,worker){
			var obj = {}
			obj.deductBreakFromAbsenceDuration = firstAbsence.DeductBreakFromAbsenceDuration && firstAbsence.absenceBreakDuration != undefined && firstAbsence.absenceBreakDuration !=  "00:00:00";
			obj.deductBreakFromEmployeeTimes = obj.deductBreakFromAbsenceDuration && firstAbsence.shiftType == 4;
			if(worker != null){
				obj.deductBreakFromsubstituteTimes =obj.deductBreakFromAbsenceDuration && firstAbsence.substituteShiftType == 4;
			}
			if(obj.deductBreakFromEmployeeTimes)
			{
				obj.breakDuration = firstAbsence.absenceBreakDuration;
			}
			if(obj.deductBreakFromsubstituteTimes)
			{
				obj.breakDuration = subBreakDuration(firstAbsence, worker);
			}
			return obj;
		}

		function subBreakDuration(absence, worker){
			if(worker.HalfDayAMEndTime && worker.HalfDayPMStartTime){
				return getSubBreakTime(absence,worker.HalfDayAMEndTime,worker.HalfDayPMStartTime);
			}
			if(absence.HalfDayAMEndTime && absence.HalfDayPMStartTime){
				return getSubBreakTime(absence,absence.HalfDayAMEndTime,absence.HalfDayPMStartTime);
			}
		}

		function getSubBreakTime(absence, halfDayAMEndTime, halfDayPMStartTime) {
			var absSubStartTime = dateHelp.parseTime(absence.substituteStartTime);
			var absSubEndTime = dateHelp.parseTime(absence.substituteEndTime);
			var defaultSubStartTime = dateHelp.parseTime(halfDayAMEndTime);
			var defaultSubEndTime = dateHelp.parseTime(halfDayPMStartTime);

			//absSubStartTime is smaller than or equal to defaultSubStartTime and absSubEndTime is greater than or equal to defaultSubEndTime
			if(defaultSubStartTime >= absSubStartTime && defaultSubEndTime <= absSubEndTime){
				return dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(halfDayAMEndTime,halfDayPMStartTime));
			}

			//This code is commented as part of HCMAT-65382, this is the additional case which caused 0NaN:0NaN issue.
			//defaultSubStartTime is smaller than absSubStartTime and absSubEndTime is greater than or equal to defaultSubEndTime
			// if(defaultSubStartTime < absSubStartTime && defaultSubEndTime <= absSubEndTime){
			// 	return dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(absence.substituteStartTime,halfDayPMStartTime));
			// }
			//absSubStartTime and absSubEndTime falls between defaultSubStartTime and defaultSubEndTime
			if(defaultSubStartTime <= absSubStartTime && defaultSubEndTime >= absSubEndTime){
				return dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(absence.substituteStartTime,absence.substituteEndTime));
			}
			//absSubStartTime is smaller than defaultSubStartTime and absSubEndTime falls between defaultSubStartTime and defaultSubEndTime
			if(defaultSubStartTime > absSubStartTime && defaultSubEndTime >= absSubEndTime && defaultSubStartTime < absSubEndTime){
				return dateHelp.getHoursAndMinsfromMilliseconds(substractTwoTimesInMilliseconds(halfDayAMEndTime,absence.substituteEndTime));
			}
			return "00:00";	
		}

		function substractTwoTimesInMilliseconds(startTime, endTime){
			if(!startTime || !endTime){
				return 0;
			}
			var startTime = startTime.split(":");
			var startTimeMS = new Date().setHours(startTime[0], startTime[1], startTime[2] == undefined ? "00" : startTime[2], 0);
			var endTime = endTime.split(":");
			var endTimeMS = new Date().setHours(endTime[0], endTime[1], endTime[2] == undefined ? "00" : endTime[2], 0);
			var val = endTimeMS - startTimeMS;
			return val;
		}

		return {
			getConfig: getConfig,
			processColumnData: processColumnData,
			processColumnDataForEachAbsence: processColumnDataForEachAbsence,
			absrType: absrType
		};
	});
	// #--- END Service (dailyReportSvc) ---# //
	// #------------------------------------# //

}());