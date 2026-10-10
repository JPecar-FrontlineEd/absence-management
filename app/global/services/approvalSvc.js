(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------# //
	// #----- Service (approvalSvc) -----# //
	app.factory('approvalSvc', function ($q, absenceRequestApi, absrSvc, stringSvc, institutionSvc, ngDialog, toastHelp, parseDateFilter) {

		var denyPartDialog = null;

		function approve (id,comment, fields) {
			var _defer = $q.defer();
			absenceRequestApi.approve({absrid: id, comment: comment,fields: fields},{}).then(function (data){
				return _defer.resolve(data);
			},function (reason){
				return _defer.reject(reason);
			});
			return _defer.promise;
		}
		function deny (id,comment, fields) {
			var _defer = $q.defer();
			absenceRequestApi.deny({absrid: id, comment: comment,fields: fields},{}).then(function (data){
				return _defer.resolve(data);
			},function (reason){
				return _defer.reject(reason);
			});
			return _defer.promise;
		}
		function denyPart(id, absIds, comment, fields) {
			var _defer = $q.defer();
			absenceRequestApi.denyPart({absrid: id, splitAbs: absIds, comment: comment, fields: fields},{}).then(function (data){
				return _defer.resolve(data);
			},function (reason){
				toastHelp.error(reason.$messages, 'Error');
				return _defer.reject(reason);
			});
			return _defer.promise;
		}

		/*******************************************************Deny Part Dialog*********************************************/
	    var strings = stringSvc.getStrings([
	        'Approval.DenyPart.Dialog.Header.Text',
	        'Approval.DenyPart.Message.Text.DenyAbsenceSuccessful',
	        'Approval.DenyPart.Message.Body.Text',
	        'Approval.Lablel.Text.Comments',
	        'Close',
	        'Approval.Button.Text.DenySelected',
	        'Reports.Results.DurationColumn.Break',
	        'Approval.Label.Text.ApprovalStatus',
	        'Dismiss',
			'Success',
			'EnterComment'
	    ]);
	    var denyPartCols = [{
            key: 'dateForSorting', width: '4/24',
            name: 'Date',
            sortable: false,
            defaultSort: 'asc',
            template: '<div ng-class="{\'disabled\': row.$disabled }">{{ row.date | parseAesopDate }}</div>'
        }, {
            key: 'duration', width: '3/24',
            name: 'Duration',
            sortable: false,
            template: '<cmpt-template-shift-types absences="[row]" use-absence-sub-shift-type="true" ng-class="{\'disabled\': row.$disabled }"></cmpt-template-shift-types>'
        }, {
            key: 'location', width: '17/24',
            name: 'Location',
            sortable: false,
            template:'<div ng-class="{\'disabled\': row.$disabled }">{{ row.institution.name }}</div>'
        }];

	    function showDenyPartDialog (absr) {
	        var _defer = $q.defer();
	        var comments = '';

	        //make sure no preexisting toasts are still displaying when this dialog is opening
	        toastHelp.clear();
	        absr.absences = absr.absences.map(function (absence, i, a){
	        	absence.$disabled = !institutionSvc.oneById(absence.institution.id).isAvailable;
	        	absence.dateForSorting = parseDateFilter(absence.date,'yyyy/MM/dd');
	        	return absence;
	        });

	        var denyBtn = {
				title: strings['Approval.Button.Text.DenySelected'],
				cls:'fl-button fl-negative',
				loading: false,
				action: function(){
					var button = this;
					if(!button.loading){
						button.loading = true;
						var absIds = dialogOptions.data.selectedAbsences.map(function (absence, i, a) {
				            return absence.id;
				        }).join(',');

				        denyPart(absr.id, absIds, dialogOptions.data.comments, '').then(
				        	// DENIED!
				        	function(data) {
				        		var successMessage = strings['Approval.DenyPart.Message.Text.DenyAbsenceSuccessful'];
								var newAbsrMessage = strings['Approval.DenyPart.Message.Body.Text'];
								var denySplitOccurred = data.newAbsr != null && Object.keys(data.newAbsr).length > 0;
								var updatedAbsr = data.currentAbsr;

								if (denySplitOccurred) {
					                //update the absr used in the dialog with what we received from the server
					                dialogOptions.data.absr = updatedAbsr;
						            dialogOptions.data.splitAbsrs.push(data.newAbsr);
						            //notify the user of the new Absr that was split off and denied
						            newAbsrMessage += ' #<a href="/abs-mgt/absences/detail/'+data.newAbsr.id+'/view">'+data.newAbsr.id+'</a>';
						            toastHelp.success([newAbsrMessage], successMessage, true);
					            } else {
					            	toastHelp.success([successMessage],	strings['Success'],	false);
					            }

								button.loading = false;
								//reset form
								dialogOptions.data.selectedAbsences = [];
								dialogOptions.data.comments = '';
								//we only close the dialog if there are less than 2 absences remaining to deny
								if (updatedAbsr.absences.length < 2 || !denySplitOccurred) {
									ngDialog.close(denyPartDialog.id);
									return _defer.resolve({ currentAbsr: updatedAbsr, splitAbsrs: dialogOptions.data.splitAbsrs });
								}
							},
							// failed to deny (denial inception)
							function (reason){
								button.loading = false;
								dialogOptions.data.selectedAbsences = [];
								return _defer.reject(reason);
							}
						);
			    	}
				}
			};

	        var dialogOptions = {
	            template:'/global/modals/deny-part.html',
	            showClose: false,
	            closeByDocument: false,
	            closeByNavigation: true,
	            className: 'ngdialog-theme-default deny-part-dialog',
	            data: {
	            	absr: absr,
	            	selectedAbsences: [],
	            	splitAbsrs: [],
	            	comments: comments,
	            	cols: denyPartCols,
			        strings: strings,
			        denySelectedBtn: denyBtn,
			        buttons: [{
						title: strings['Close'],
						cls:'fl-button',
						loading: false,
						enabled: true,
						action: function(){
		                    dialogOptions.data.selectedAbsences.length = 0;
		                    ngDialog.close(denyPartDialog.id);
		                    if (dialogOptions.data.splitAbsrs.length > 0) {
		                    	return _defer.resolve({ currentAbsr: dialogOptions.data.absr, splitAbsrs: dialogOptions.data.splitAbsrs });
		                    }
		                    return _defer.reject();
						}
					}]
	            }
	        };
	        denyPartDialog = ngDialog.open(dialogOptions);
	        return _defer.promise;
	    }

		return {
			approve: approve,
			deny: deny,
			showDenyPart: showDenyPartDialog,
			denyPart: denyPart
		};

	});
	// #--- END Service (approvalSvc) ---# //
	// #---------------------------------# //

}());