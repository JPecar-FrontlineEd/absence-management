(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------------# //
	// #----- Endpoint (absenceRequestsApi) -----# //
	app.factory('absenceRequestApi', function ($resource, endpointInterceptor, apiHelp, config) {

		var resource = $resource(config.apiEndpoint + '/v1.0/absencerequests/:absrid', {}, {
				context: {
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Context',
					interceptor: endpointInterceptor
				},
				relatedAbsrs:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Related',
					interceptor: endpointInterceptor
				},
				uploaded:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Files',
					interceptor: endpointInterceptor
				},
				hold:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Hold',
					interceptor: endpointInterceptor
				},
				lock:{
					method: 'POST',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Lock',
					interceptor: endpointInterceptor
				},
				unlock:{
					method: 'DELETE',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Lock',
					interceptor: endpointInterceptor
				},
				deleteAbsr:{
					method: 'DELETE',
					params: {
						absrid: '@id',
						cancelReasonId: '@cancelReasonId',
						cancelNotes:'@cancelNotes'
					},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid',
					interceptor: endpointInterceptor
				},
				availableSubstitutes:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/AvailableSubstitutes',
					interceptor: endpointInterceptor
				},
				approvers:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Approvers',
					interceptor: endpointInterceptor
				},
				approverLog:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/ApproverLog',
					interceptor: endpointInterceptor
				},
				absenceLog:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/AbsenceLog',
					interceptor: endpointInterceptor
				},
				manualCalls:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/ManualCalls',
					interceptor: endpointInterceptor
				},
				callHistory:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/:absrid/CallHistory',

					interceptor: endpointInterceptor
				},
				substitutePushNotificationLogs:{
					method: 'GET',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/Substitutes/SubstitutePushNotificationLogs',
					interceptor: endpointInterceptor
				},
				cancelReasons:{
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/CancelReasons',
					interceptor: endpointInterceptor
				},
				reconciliationCount: {
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/ReconciliationCount',
					interceptor: endpointInterceptor
				},
				dailyReport: {
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/DailyReport',
					interceptor: endpointInterceptor
				},
				reconcile:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Reconcile',
					interceptor: endpointInterceptor
				},
				unreconcile:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Unreconcile',
					interceptor: endpointInterceptor
				},
				needApprovalCount: {
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/NeedApprovalCount',
					interceptor: endpointInterceptor
				},				
				approve:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Approve',
					interceptor: endpointInterceptor
				},
				deny:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Deny',
					interceptor: endpointInterceptor
				},
				denyPart:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/DenyPart',
					interceptor: endpointInterceptor
				},
				split:{
					method: 'POST',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/split',
					interceptor: endpointInterceptor
				},
				splitIndividually:{
					method: 'POST',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/splitindividually',
					interceptor: endpointInterceptor
				},
				update:{
					method: 'PUT',
					params: {absrid: '@id'},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid',
					interceptor: endpointInterceptor
				},
				create:{
					method: 'POST',
					params: { },
					url: config.apiEndpoint + '/v1.0/absencerequests',
					interceptor: endpointInterceptor
				},
				addWorkerFeedback:{
					method: 'POST',
					params: { absrid: '@id' },
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/WorkerFeedback',
					interceptor: endpointInterceptor
				},
				updateWorkerFeedback:{
					method: 'PUT',
					params: { absrid: '@id' },
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/WorkerFeedback',
					interceptor: endpointInterceptor
				},
				deleteWorkerFeedback:{
					method: 'DELETE',
					params: { absrid: '@id'	},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/WorkerFeedback',
					interceptor: endpointInterceptor
				},
				addSubstituteFeedback:{
					method: 'POST',
					params: { absrid: '@id' },
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/SubstituteFeedback',
					interceptor: endpointInterceptor
				},
				updateSubstituteFeedback:{
					method: 'PUT',
					params: { absrid: '@id' },
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/SubstituteFeedback',
					interceptor: endpointInterceptor
				},
				deleteSubstituteFeedback:{
					method: 'DELETE',
					params: { absrid: '@id'	},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/SubstituteFeedback',
					interceptor: endpointInterceptor
				},
				renotify:{
					method: 'POST',
					params: { absrid: '@id'	},
					url: config.apiEndpoint + '/v1.0/absencerequests/:absrid/Renotify',
					interceptor: endpointInterceptor
				},
				relatedCalendarData:{
					method: 'GET',
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/RelatedCalendarData',
					interceptor: endpointInterceptor
				},
				undeleteAbsence:{
					method: 'POST',
					params: { absrid: '@id' },
					url: config.apiEndpoint + '/v1.0/AbsenceRequests/:absrid/Undelete',
					interceptor: endpointInterceptor
				}
				
			}),
			resApproval = $resource(config.apiEndpoint + '/v1.0/absencerequests/approval'),
			resReconciliation = $resource(config.apiEndpoint + '/v1.0/AbsenceRequests/Reconciliation'),
			resContext = $resource(config.apiEndpoint + '/v1.0/AbsenceRequests/Context'),
			resFiles = $resource(config.apiEndpoint + '/v1.0/absencerequests/:absrid/Files'),
			resContexts = $resource(config.apiEndpoint + '/v1.0/AbsenceRequests/Contexts'),
			wrapper = {
				approval: {},
				reconciliation:{},
				context: {},
				files:{},
				contexts: {}
			},
			key;



		for (key in resource) {
			if (!resource.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper[key] = apiHelp.promiseHook(key, resource);
		}

		for (key in resApproval) {
			if (!resApproval.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.approval[key] = apiHelp.promiseHook(key, resApproval);
		}

		for (key in resReconciliation) {
			if (!resReconciliation.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.reconciliation[key] = apiHelp.promiseHook(key, resReconciliation);
		}

		for (key in resContext) {
			if (!resContext.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.context[key] = apiHelp.promiseHook(key, resContext);
		}

		for (key in resFiles) {
			if (!resFiles.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.files[key] = apiHelp.promiseHook(key, resFiles);
		}
		for (key in resContexts) {
			if (!resContexts.hasOwnProperty(key) || key === 'bind') { continue; }
			wrapper.contexts[key] = apiHelp.promiseHook(key, resContexts);
		}


		// custom API methods
		// wrapper.customMethod = function...

		return wrapper;

	});
	// #--- END Endpoint (absenceRequestsApi) ---# //
	// #-----------------------------------------# //

}());
