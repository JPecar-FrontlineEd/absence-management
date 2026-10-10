(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------------# //
	// #----- Value (reportQueryFilterMapsVal) -----# //
	// app.value('reportQueryFilterMapsVal', {});
	app.value('reportQueryFilterMapsVal', {
		absenceRequest: {
			startDate: 'dateRange.startDate',
			endDate: 'dateRange.endDate',
			instIds:'institutions',
			wktIds:'workerTypes',
			wkIds:'workers',
			subIds:'substitutes',
			absEntIds:'absenceReasons',
			includeAbsences:'absenceType.includeAbsences',
			includeVacancies:'absenceType.includeVacancies',
			includeFilled:'filledStatus.includeFilled',
			includeUnfilled:'filledStatus.includeUnfilled',
			includeNoSubRequired:'filledStatus.includeNoSubRequired',
			includeApproved:'approvalStatus.includeApproved',
			includeUnApproved:'approvalStatus.includeUnApproved',
			includePartialApproved:'approvalStatus.includePartialApproved',
			includeDenied:'approvalStatus.includeDenied',
			includeNoApprovalRequired:'includeNoApprovalRequired',
			includeAllDateAbsences:'includeAllDateAbsences',
            includeAllInstAbsences:'includeAllInstAbsences',
			minSubrating:'substitutePerformance.min',
			maxSubRating:'substitutePerformance.max',
			minSubExpRating:'substituteExperience.min',
			maxSubExpRating:'substituteExperience.max',
			feedbackTotalData:null,
			accountingCodeData:null,
			attachmentData:null,
			timesheetData:null,
			approvalCommentData:null,
			userNameData:'userNameData',
			useAlwaysOnDb: 'useAlwaysOnDb',
			fields: 'fields'
		},
		absence: {
			startDate: 'dateRange.startDate',
			endDate: 'dateRange.endDate',
			instIds:'institutions',
			wktIds:'workerTypes',
			wkIds:'workers',
			subIds:'substitutes',
			absEntIds:'absenceReasons',
			vacEntIds:'vacancyReasons',
			vacProfIds:'vacancyProfiles',
			includeAbsences:'absenceType.includeAbsences',
			includeVacancies:'absenceType.includeVacancies',
			includeFilled:'filledStatus.includeFilled',
			includeUnfilled:'filledStatus.includeUnfilled',
			includeNoSubRequired:'filledStatus.includeNoSubRequired',
			includeDeletedSubs:'includeDeletedSubs',
			useAlwaysOnDb: 'useAlwaysOnDb',
			fields: 'fields'
		},
		worker: {
			instIds: 'institutions',
			wktIds: 'workerTypes',
			includeWorkers: 'employeesVacancies.includeWorkers',
			includeVacancies: 'employeesVacancies.includeVacancies',
			includeActive: 'activeStatus.includeActive',
			includeInactive: 'activeStatus.includeInactive',
			fields: 'fields'
		},
		callHistory: {
			startDate: 'dateRange.startDate',
			endDate: 'dateRange.endDate',
			instIds: 'institutions',
			subIds: 'substitutes',
			absrid: 'absrId',
			fields: 'fields'
		},
		substituteAvailability: {
			date: 'date',
			instId: 'institution.id',
			subIds: 'substitutes',
			includeSkills: 'showSkills',
			skillIds: 'skills',
			subPreference: 'preferred.id',
            subExcluded: 'subExcluded.id',
			fields: 'fields'
		},
		excludedSubstitutes: {
			instIds: 'institutions',
			includeEmployeeExclusions: 'employeeExclusion',
			fields: 'fields'
		},
		reportWriter: {
			reportConfigId: 'reportConfigId',
			reportExecId: 'reportExecId',
			startDate: 'dateRange.startDate',
			endDate: 'dateRange.endDate',
			pastDateSpan: 'presetDaySpan.id',
			showAllUsers: 'showAllUsers',
			name: 'name',
			accessLevel: 'accessLevel',
			fields: 'fields'
		},
		absenceInteractive: {
			startDate: 'dateRange.startDate',
			endDate: 'dateRange.endDate',
			instIds:'institutions',
			wktIds:'workerTypes',
			wkIds:'workers',
			subIds:'substitutes',
			absEntIds:'absenceReasons',
			vacEntIds:'vacancyReasons',
			vacProfileIds:'vacancyProfiles',
			includeAbsences:'absenceType.includeAbsences',
			includeVacancies:'absenceType.includeVacancies',
			includeFilled:'filledStatus.includeFilled',
			includeUnfilled:'filledStatus.includeUnfilled',
			includeNoSubRequired:'filledStatus.includeNoSubRequired',
			groupBy:'groupBy',
			calculateByPercentOfDay:'',
			daysOfWeek:'daysOfWeek',
			fields: 'fields'
		},
		timeSheet:{
			startDate: 'dateRange.startDate',
			endDate: 'dateRange.endDate',
			includeAbsences:'absenceType.includeAbsences',
			includeVacancies:'absenceType.includeVacancies',
			instIds:'institutions',
			wkIds:'workers',
			subIds:'substitutes',
			vacProfileIds:'vacancyProfiles',
			fields: 'fields'
		}

	});
	// #--- END Value (reportQueryFilterMapsVal) ---# //
	// #--------------------------------------------# //

}());
