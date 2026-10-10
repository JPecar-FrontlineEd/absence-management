(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------# //
	// #----- Service (reconciliationSvc) -----# //
	app.factory('reconciliationSvc', function ($q, $timeout, ngDialog, absenceRequestApi, absrSvc, stringSvc, toastHelp) {

		var strings = stringSvc.getStrings([
	    	'ReconciliationDetails.Header.Text.ReconciliationDetailFor',
	        'Reconciliation.Page.Header.Title',
	        'NoResultsFound',
	        'Reconcile.Button.Text.ReconcileAll',
	        'Custom',
	        'Reconciliation.Dialog.Header.Text.WarningChangesNotSaved',
	        'Reconciliation.Label.Text.YouAreAttemtingTo',
	        'Reconciliation.Label.Text.MultipleRecordsNotSaved',
	        'Absence.Button.Text.Unreconcile',
	        'Dashboard.Header.Button.Reconcile',
	        'Reconciliation.Button.Text.ContinueAndSave',
	        'Cancel',
	        'Reconcile.Button.Text.UnreconcileAll',
	        'Reconciling',
	        'Unreconciling'
	    ]);

		function reconcileAllDialog (absrs, state) {
			var _defer = $q.defer();

	    	clearAllWarnningsAndErrors(absrs);

			var preloader = {
				loaded: 0,
				total: 0,
				loading: true,
				loadingText:'records have been processed',
				style: {
					transform: 'translateX(-100%)'
				}
			};

			var hasWarning = {
				warning: absrs.filter(function (absr){
					var absence = absr.absrVariations[0];
					return absence.isDirty;
				}).length > 0
			};

			var dialog = ngDialog.open({
				template:'/global/modals/absr-reconcile-all.html',
				showClose: false,
				closeByDocument: false,
				closeByNavigation: true,
				className: 'ngdialog-theme-default absr-reconcile-all-dialog',
				data: {
					hasWarning: hasWarning,
					strings: strings,
					header: state ? strings['Reconciling'] : strings['Unreconciling'],
					action: state ? strings['Dashboard.Header.Button.Reconcile'] : strings['Absence.Button.Text.Unreconcile'],
					warningObj: {
						header: strings['Reconciliation.Dialog.Header.Text.WarningChangesNotSaved'],
						buttons: [{
							title: strings['Reconciliation.Button.Text.ContinueAndSave'],
							cls:'fl-button fl-positive',
							action: function(){
								hasWarning.warning = false;
								processAbsrsForReconciliation();
							}
						},{
							title: strings['Cancel'],
							cls:'fl-button',
							action: function(){
								ngDialog.close(dialog.id);
							}
						}]
					},
					processObj: {
						preloader:preloader
					}
				}
			});


			if(!hasWarning.warning){
				processAbsrsForReconciliation();
			}


			function processAbsrsForReconciliation () {
				var groupByAbsr = {};
				for (var i = absrs.length - 1; i >= 0; i--) {
					var absr = absrs[i];
					if(groupByAbsr.hasOwnProperty(absr.id)){
						groupByAbsr[absr.id].push(absr);
					}else{
						groupByAbsr[absr.id] = [absr];
					}
				}
				totalRecordsForReconciliation(groupByAbsr);
				Object.keys(groupByAbsr).forEach(function (absrId){
					saveAndReconcile(groupByAbsr,absrId);
				});
			}

			function saveAndReconcile (group,absrId) {
				if(group[absrId].length > 0) {
					var absrVal = group[absrId].pop();
					var absence = absrVal.absrVariations[0];
					var fullAbsenceObj = absence.absences[0];

					if(!absence.isLocked && !absence.isProcessed && !absrVal.hidden){
						absrVal.reconcileMode = true;
                		fullAbsenceObj.UpdateReconcileState = !absence.isReconciled;
						absrSvc.saveAbsence(absrVal,null).then(
						function (absrData){
							updateProgressBar();
							absence.isProcessed = true;
							absence.isReconciled = !absence.isReconciled;
							absence.isDirty = false;
							absrVal.lastUpdated = absrData.lastUpdated;
							absrVal.dbLastUpdatedTimeStamp = absrData.dbLastUpdatedTimeStamp;
							group[absrId].forEach(function(absr){
								absr.lastUpdated = absrData.lastUpdated;
								absr.dbLastUpdatedTimeStamp = absrData.dbLastUpdatedTimeStamp;
							});
			                var newAbsenceLastUpdate = absrData.absences.filter(function(a) { return a.id === fullAbsenceObj.id; })[0].lastUpdated;
			                fullAbsenceObj.lastUpdated = newAbsenceLastUpdate;

							saveAndReconcile(group, absrId);
						},
						function (rejectData){
	                        if (rejectData != null) {
	                        	// Seperate out the save failure from save absence.
	                        	rejectData.rejectData.$messages.forEach(function (m) { m.key = 0; });
								absrSvc.saveFailure(absrVal,rejectData.rejectData);
		                        if(rejectData.warnings.length > 0){
									refreshAbsr(absrId).then(function(absr){
										var absrVal = createAbsrVal(absr, absence.absences[0].id);
	            						replaceWithUpdatedAbsr(absrs, absrVal);
	            						checkAbsenceReconcileState(absrs, state, absr.id, absence.absences[0].id);
									});
								}
							}
							updateProgressBar();
							saveAndReconcile(group, absrId);
						});
					}
				}
			}

			function updateProgressBar () {
				preloader.loaded++;
				var loaderTranslateX = (100 - Math.round((preloader.loaded / preloader.total) * 100)) * -1;
				preloader.style.transform = 'translateX(' + loaderTranslateX + '%)';
				if(preloader.loaded === preloader.total){
					$timeout(function(){
						ngDialog.close(dialog.id);
						return _defer.resolve();
					},1500);
				}
			}

			function clearAllWarnningsAndErrors (absrs) {
				absrs.forEach(function (absr){
					absr.errors.length = 0;
					absr.warnings.length = 0;
				});
			}

			function totalRecordsForReconciliation (groups) {
				var count = 0;
				Object.keys(groups).forEach(function (absrId){
					var absrVals = groups[absrId];
					absrVals.forEach(function (absrVal){
						var absence = absrVal.absrVariations[0];
						if(!absence.isLocked && !absence.isProcessed && !absrVal.hidden){
							count++;
						}
					});
				});
				preloader.total = count;
			}


			return _defer.promise;
		}

		function createAbsrVal(absr, absenceId){
			var absences = absr.absences.filter(function (a){ return a.id === absenceId; });
			absr.absences = absences;
            return absrSvc.absrModelToStateVal(absr, absr.context);
		}

		function replaceWithUpdatedAbsr (absrs, absrVal) {
			//var oldAbsrVal = absrs.filter(function (absr){ return absr.id === absrVal.id && absr.absences[0].id === absrVal.absenceVariation[0].id; })[0];
			//find the specific instance of the absr and the absence being acted upon
			var oldAbsrVal = absrs.filter(function (absr){ return absr.id === absrVal.id && absr.absrVariations[0].id === absrVal.absr.absences[0].id; })[0];
			var index = absrs.indexOf(oldAbsrVal);
			absrVal.warnings = oldAbsrVal.warnings;
            absrVal.errors = oldAbsrVal.errors;
			absrs.splice(index,1);
			absrs.splice(index,0,absrVal);
		}

		function refreshAbsr (absrId) {
			var _defer = $q.defer();
			var getAbsr = absenceRequestApi.get({absrid: absrId, accountingCodeData: true, timesheetData: true, feedbackTotalData: true, approvalCommentData: true});
 			getAbsr.then(function (absr) {
            	return _defer.resolve(absr);
			}, function (err) {
				toastHelp.error(err.$messages, 'Error');
				return _defer.reject(err);
			});
			return _defer.promise;
		}

		function checkAbsenceReconcileState(absrList, notReconcileState, absrId, absId){
	        var absrs = absrList.filter(function(a) { return a.id === absrId; });
	        var absrVal = absrs.filter(function(a) { return a.absrVariations[0].absences[0].id === absId; })[0];
	        var fullAbsenceObj = absrVal.absrVariations[0].absences[0];
	        if (fullAbsenceObj.isReconciled === notReconcileState) {
	            absrVal.absrVariations[0].isProcessed = true;
	        }
	    }


		return {
			reconcileAllDialog: reconcileAllDialog,
			createAbsrVal: createAbsrVal,
			replaceWithUpdatedAbsr: replaceWithUpdatedAbsr,
			refreshAbsr: refreshAbsr,
			checkAbsenceReconcileState: checkAbsenceReconcileState
		};

	});
	// #--- END Service (reconciliationSvc) ---# //
	// #---------------------------------------# //

}());
