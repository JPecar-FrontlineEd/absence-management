(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------# //
	// #----- Helper (gridCellHelp) -----# //
	app.factory('gridCellHelp', function ($filter, $q, stringSvc,shiftTypesSvc, institutionSvc, permissionSvc) {

		function hasDaysInPast (row) {
			if(new Date(row.startDate) < new Date(row.firstAbsence.date)){
				return true;
			}
			return false;
		}

		function hasDaysInFuture (row) {
			if(new Date(row.endDate) > new Date(row.firstAbsence.date)){
				return true;
			}
			return false;
		}

		function instIsAvailable (instId) {
			return institutionSvc.oneById(instId).isAvailable;
		}

		var strings = stringSvc.getStrings([
			'Vacancy', 'Absence', 'Approved', 'ApprovalPending',
			'Dashboard.Icon.HaveDaysInPast.Title',
			'Dashboard.Icon.HaveDaysInFuture.Title'
		]);

		return {
			confimationLink: function (val,row) {
				return '<a href="/abs-mgt/absences/detail/' + val + '/view">'+ val +'</a>';
			},
			absrType: function (val,row) {
				var typeStr = (row.isVacancy) ? strings.Vacancy : strings.Absence;
				return '<div class="sub-title">'+ typeStr + '</div>';
			},
			daysSpanIndicator: function (val,row) {
				var html = '';
				var daysInPast = hasDaysInPast(row);
				var daysInFuture = hasDaysInFuture(row);
					if(daysInPast || daysInFuture){
						html = html + '<div class="day-indicator">';
						if(daysInPast){
							html = html + '<i class="fa fa-long-arrow-left" title="'+ strings['Dashboard.Icon.HaveDaysInPast.Title'] +'"></i>';
						}
						html = html + '<i class="fa fa-calendar-o"></i>';
						if(daysInFuture){
							html = html + '<i class="fa fa-long-arrow-right" title="'+ strings['Dashboard.Icon.HaveDaysInFuture.Title'] +'"></i>';
					}
				}
				return html;
			},
			notes:function (val,row){
				var html = '';
				if(row.notes && row.notes.length > 0){
					html+= '<div><label>Notes to Substitute</label><span>' + row.notes + '</span></div>';
				}
				if(row.notesToAdmin && row.notesToAdmin.length > 0){
					html+= '<div><label>Notes to Administrator</label><span>' + row.notesToAdmin + '</span></div>';
				}
				if(row.notesToAdminOnly && row.notesToAdminOnly.length > 0){
					html+= '<div><label>Admin-Only Notes</label><span>' + row.notesToAdminOnly + '</span></div>';
				}

				if(html.length > 0){
					return '<div class="notes"><span qtip my="left center" at="right center" qtip-class="notes-content" content="'+ html + '"><i class="fa fa-file-text"></i></span></div>'
				}else{
					return '';
				}
			},
			substituteLink: function (val,row) {
				var substitute = row.substitute;
				var name = substitute.firstName + ' '+ substitute.lastName;
				if(permissionSvc.iHave('SUB.SubViewGeneral')){
					return '<a href="/some-route/" title="'+ name +'">'+ name +'</a>';
				}
				return name;
			},
			substituteCeck:function (val,row) {
				var substitute = row.substitute;
				var titleText, cssClass;

				if(substitute){
					titleText = '{{ strings["filledBy"] }} ' +substitute.firstName + ' '+ substitute.lastName;
					cssClass = 'filled';
				}else{
					titleText = 'Not Filled';
					cssClass = 'not-filled';
				}
				return '<div><i class="fa fa-check '+ cssClass +'" title="'+ titleText +'"></i></div>'

			},
			allAbsenceReasons:function (val,row) {
				var html ='', cssClass;
					for (var i = 0; i < row.absences.length; i++) {
						cssClass = '';
						if(!instIsAvailable(row.absences[i].institution.id)){ cssClass = 'not-available'; }
						html = html + '<div class="multi-value ' + cssClass + '">'+ row.absences[i].entitlement.name + '</div>';
					}
				return html;
			},
			absenceReasonsNeedApproval:function (val,row) {
				var html ='';
				var reasons = row.absences.map(function(v){
					if(v.entitlement.needsApproval){
						return v.entitlement.name;
					}
				}).filter(function(el,i,a){
					return i === a.indexOf(el);
				});
				for (var i = 0; i < reasons.length ; i++) {
					 html = html + '<div class="multi-value">'+ reasons[i] + '</div>';
				}
				return html;
			},
			schoolCell: function (val, row) {
				var html ='', cssClass, inst;

				for (var i = 0; i < row.absences.length; i++) {
					cssClass = '';
					inst = institutionSvc.oneById(row.absences[i].institution.id);
					if(!inst.isAvailable){ cssClass = 'not-available'; }
					html = html + '<div class="multi-value '+ cssClass +'">' + inst.name + '</div>';
				}
				return html;
			},
			dateCell: function(val,row){
				var format = 'shortDate';
				var startDate = new Date(row.startDate);
				var endDate = new Date(row.endDate);
				if(+startDate === +endDate){
					return '<div>' + $filter('date')(startDate,format) + '</div>';
				}else{
					return '<div>' + $filter('date')(startDate,format) + ' - ' + $filter('date')(endDate,format) + '</div>';
				}

			},
			workerNameCell: function (val, row) {
				var html = '';
				html = '<a href="" title="'+ val +'">'+ val +'</a>';
				if(row.worker.title){
					if(row.worker.title.length > 0){
						html = html + '<div class="sub-title">'+ row.worker.title +'</div>';
					}
				}
				return html;
			},
			approveSubstituteCell: function(val,row){
				return substituteCeck(row);
			},
			durationCell:function(val,row){
				var count = 0;
				var text;
				var absences = row.absences;
				for (var i = 0; i < absences.length; i++) {
					count += absences[i].adjustedDurationAmount;
				}
				if(count <= 1){
					text = (row.balanceTrackingType === 1) ? 'Day': 'Hour';
					return count.toFixed(2) + ' ' + text;
				}else{
					text = (row.balanceTrackingType === 1) ? 'Days': 'Hours';
					return count.toFixed(2) + ' ' + text;
				}

			},
			shiftTypeCell:function(val,row){
				var html='', cssClass, shiftType, i;
				for (i = 0; i < row.absences.length; i++) {
				 	if(row.absences[i].substituteShiftType && row.absences[i].substituteShiftType > 0){
						shiftType = shiftTypesSvc.oneById(row.absences[i].substituteShiftType);
				 	}else{
						shiftType = shiftTypesSvc.oneById(row.absences[i].shiftType);
				 	}

					cssClass = '';
					if(!instIsAvailable(row.absences[i].institution.id)){ cssClass = 'not-available'; }

					html = html + '<div class="' + cssClass + '""><i class="duration-Icon fa '+ shiftType.mnemonic +'" title="'+ shiftType.title +'"></i></div>';
				}
				return html;
			},
			shiftTypeCellByAbs:function(shiftType, institutionId){
				var html='', cssClass;
				shiftType = shiftTypesSvc.oneById(shiftType);
				cssClass = '';
				if(!instIsAvailable(institutionId)){ cssClass = 'not-available'; }

				html = '<div class="' + cssClass + '"><i class="duration-Icon fa '+ shiftType.cssClass +'" title="'+ shiftType.title +'"></i></div>';

				return html;
			},
			partialStatusApprovalCell: function (val, row) {
				if(row.requiresApproval){
					if(row.isApproved){
						return '<div class="approved" title="'+ strings.Approved +'"><i class="fa fa-check"></i></div>';
					}else{
						return '<div class="pending-approved" title="'+ strings.ApprovalPending +'"><i class="fa fa-check"></i></div>';
					}
				}else{
					return '<div class="no-approval-required">NA</div>';
				}
			},
			fullStatusApprovalCell: function(val,row){
				var html='';
				var tooltipText='';
				if(row.isApproved){
					html = '<i class="fa fa-check approved"></i>';
					tooltipText = 'This absence request has been approved';
				}else if(row.isDenied){
					html = '<i class="fa fa-times denied"></i>';
					tooltipText ='This absence request has been denied';
				}else if(row.isPartiallyApproved){
					html = '<span>'+ row.numApproved +'</span>';
					tooltipText ='This absence request is partially approved';
				}else{
					html = '<i class="fa fa-check requiresApproval"></i>';
					tooltipText ='This absence request is currently unapproved';
				}
				return '<a href="some-route" title="'+ tooltipText +'">'+ html +'</a>';
			},
			approveAction:function(val, row){
				var html='';
				if(row.approverKey != null){
					if(row.requiresApproval &&
						(row.isApproved ||
						row.isDenied ||
						row.isPartiallyApproved)){
						html += (row.isDenied) ? 'Denied on ':'Last Approved on ';
						html += $filter('date')(row.lastApprovedAction,'short');
					}
				}else{
					if(row.canApprove){
						html += '<a class="fl-button-sm fl-positive"><span class="fl-label"><i class="fa fa-check pull-left"></i>Approve</span></a>';
					}
					if(row.canDeny){
						html += '<a class="fl-button-sm fl-negative">Deny</a>';
					}
					if(row.canDenyPart){
						html += '<a class="fl-button-sm deny-part">Deny Part</a>';
					}
				}
				return html;
			},
			createdCell: function (val, row) {
				var html='';
				var date = new Date(val);
				html= html + '<div class="date">'+ $filter('date')(date,'mediumDate') +'</div>';
				html= html + '<div class="time">'+ $filter('date')(date,'shortTime') +'</div>';
				return html;
			},
			heldCell: function(val,row){
				var html ='';
				if(row.heldPastFulfillmentCutoff){
					html = '<span>Held Past Cut Off</span>';
				}else if(row.isHeld && !row.heldPastFulfillmentCutoff){
					html = 'Held Until ' + row.heldUntil;
				}
				return html;
			},
			codesCell: function(val,row){
				var html ='';
				var canViewBudgetCode = permissionSvc.iHave('ABSR.DTLSBDCD');
				var canViewPayCode = permissionSvc.iHave('ABSR.DTLSPYCD');
				for (var i = 0; i < row.absences.length; i++) {
					if(canViewPayCode){
						html = html + '<label>Pay Code:</label>';
						if(row.absences[i].payCode){
							html = html + '<div>'+ row.absences[i].payCode.description + '</div>';
						}else{
							html = html + '<div>None</div>';
						}
					}
					if(canViewBudgetCode){
						html = html + '<label>Bud Code:</label>';
						if(row.absences[i].budgetCode){
							html = html + '<div>'+ row.absences[i].budgetCode.description + '</div>';
						}else{
							html = html + '<div>None</div>';
						}
					}
				}
				return html;
			},

			ready: $q.when([
				shiftTypesSvc,
				institutionSvc,
				permissionSvc,
				strings.$promise
			])
		};

	});
	// #--- END Helper (gridCellHelp) ---# //
	// #---------------------------------# //

}());