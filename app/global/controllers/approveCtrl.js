(function() {'use strict';angular.module('aesop')
.controller('ApproveCtrl', function ($q, stringSvc, absenceRequestApi) {
// #---------------------------# //
// #------- ApproveCtrl -------# //

	var route = this;
	// View Model properties

	route.vm = {
		filter:{
			startDate: null,
			endDate: null,
			unapproved: true,
			partiallyApproved:true,
			approved: false,
			denied: false,
			accountingCode:null,
			budgetCode:null
		}
	};

	route.strings = stringSvc.getStrings([
		'AbsenceLog.text.NoRecordFound',
		'NoApprovalRequired',
		'Absence',
		'ApprovalList.Header.Text.Approvals'
	]);

	route.go = {

	};


// #----- END ApproveCtrl -----# //
});}());