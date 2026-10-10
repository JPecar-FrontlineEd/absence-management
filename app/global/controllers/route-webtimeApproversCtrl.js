(function() {'use strict';angular.module('aesop')
.controller('WebtimeApproversCtrl', function ($stateParams, $q, $scope, $state, $location, stringSvc, permissionSvc, institutionSvc, timesheetApproversApi, toastHelp, reportHelp, stringHelp, objectHelp, parseAesopDateFilter, parseDateFilter, ngDialog) {
// #------------------------------------# //
// #------- WebtimeApproversCtrl -------# //

	// this is a route controller
	var route = this;
	var instId = $stateParams.instId;
	var institution = institutionSvc.oneById(instId);
	var tomorrow = parseAesopDateFilter(new Date.today().addDays(1));
	var canEditApprovers = permissionSvc.iHave('WEBFUNC.EditApprovers');
	var maxApproverDays = 30;
	var onRouteChangeOff = null;

    route.strings = stringSvc.getStrings([
        'Report.Label.SelectSchool',
        'ts.approver.subHeading',
        'ts.approver.label.primaryApprover',
        'ts.approver.label.altApproverSch',
        'ts.approver.error.validation',
        'ts.altApprover.noAltSched',
        'ts.label.commit',
        'ts.label.cancel',
        'ts.label.edit',
        'ts.label.delete',
        'ts.label.addApprover',
        'ts.label.addPrimaryApprover',
        'ts.dialog.title.unsavedChanges',
        'ts.dialog.unsavedChanges',
        'ts.approver.dialog.title.saveSuccess',
        'ts.approver.dialog.saveSuccess',
        'ts.approver.dialog.deleteSuccess',
        'ts.altapprover.dialog.title.saveSuccess',
        'ts.altapprover.dialog.deleteSuccess',
        'ts.altapprover.dialog.title.deleteSuccess',
		'ts.altapprover.dialog.saveSuccess',
		'ts.altapprover.error.text',
		'ts.altapprover.error.text.earliertodate',
		'ts.altapprover.error.text.fromdatepast',
		'ts.altapprover.error.text.maxdays',
		'ts.altapprover.error.text.noemail',
		'ts.altapprover.error.text.nofromdate',
		'ts.altapprover.error.text.noname',
		'ts.altapprover.error.text.notodate',
		'ts.altapprover.error.text.validemail',
        'ts.altapprover.dialog.title.deleteApprover',
        'ts.altapprover.dialog.deleteApprover',
        'Yes', 'No', 'Cancel', 'Delete'
    ]);

	// View Model properties
	route.vm = {
		instId: instId,
		institution: institution,
		institutionName: institution.name,
		institutions: [],
        showInstitutions: true,
        isLoading: false,
        editMode: false,
        primaryApprover: [],
        alternateApprovers: [],
        primaryCols: getColumns(true),
        alternateCols: getColumns(false),
        hasPrimary: false,
        canEditApprovers: canEditApprovers,
        altApproverSort: {}
	};

	var myInsts = institutionSvc.getMyInstitutions();
    route.vm.institutions = myInsts.map(function (i){
        i.value = i.name;
        return i;
    });
    if (route.vm.institutions.length > 1) {
        route.vm.showInstitutions = true;
    } else {
        route.vm.showInstitutions = false;
    }

    loadApproverList().then(function(){
    	route.vm.hasPrimary = route.vm.primaryApprover.length;
    });

    //load the timesheet approvers
    function loadApproverList(){
    	var _defer = $q.defer();
    	route.vm.isLoading = true;

    	timesheetApproversApi.approverList(
    		{instId: instId},
    		function (u, getResponseHeaders){
				if(getResponseHeaders().maxapproverdays){
					maxApproverDays = parseInt(getResponseHeaders().maxapproverdays);
				}
			}
		).then(function(data) {
			processResults(data);
			route.vm.isLoading = false;
			return _defer.resolve();
		}, function (reason) {
			toastHelp.error(reason.$messages, 'Error');
			route.vm.isLoading = false;
			return _defer.reject(reason);
		});

    	return _defer.promise;
    }

    function processResults(data){
    	data = data.map(function (a){
    		a.editMode = false;
    		a.minDate = tomorrow;
    		a.sortDate = a.isPrimary ? '' : parseDateFilter(a.tsaaFromdate, 'yyyy/MM/dd') + '-' + parseDateFilter(a.tsaaTodate, 'yyyy/MM/dd');
    		return a;
    	});

    	route.vm.primaryApprover = data.filter(function(p) { return p.isPrimary; });
    	route.vm.alternateApprovers = data.filter(function(alt) { return !alt.isPrimary; });
    }

    function getColumns(forPrimary) {
    	var defaultCols = [
            {
                key: 'name', width: '7/24',
                name: 'ts.altApprover.tableHeader.name',
                noTitle: true,
                sortable: false,
                template: '<cmpt-ui-textbox value-text="row.tsaaName" max-length="100" read-only="!row.editMode"></cmpt-ui-textbox>'
            }, {
                key: 'email', width: '14/24',
                name: 'ts.altApprover.tableHeader.email',
                noTitle: true,
                sortable: false,
                template: '<cmpt-ui-textbox value-text="row.tsaEmail" max-length="50" read-only="!row.editMode"></cmpt-ui-textbox>'
            }
        ];

        if (canEditApprovers) {
        	defaultCols.splice(2, 0, {
            	key: 'actions', width: '3/24',
                name: 'ts.altApprover.tableHeader.actions',
                noTitle: true,
                sortable: false,
                template:'<div ng-if="!row.editMode">' +
                			'<button title="'+route.strings['ts.label.edit']+'" class="fl-button edit-button action-button" ng-class="{\'fl-disabled\': row.disabled}" ng-click="!row.disabled && !row.isProcessing && actions.edit(row)"><i class="fa fa-pencil"></i></button>' +
                			'<button title="'+route.strings['ts.label.delete']+'" ng-if="!row.isPrimary" class="fl-button trash-button action-button" ng-class="{\'fl-disabled\': row.disabled}" ng-click="!row.disabled && !row.isProcessing && actions.deleteAltApprover(row)">' +
                				'<i class="fa" ng-class="{\'fa-trash-o\': !row.isProcessing, \'fa-spinner fa-spin\': row.isProcessing }"></i>' +
                			'</button>' +
                		'</div>' +
                		'<div ng-if="row.editMode">' +
                			'<button title="'+route.strings['ts.label.cancel']+'" class="fl-button cancel-button action-button" ng-click="!row.isProcessing && actions.cancel(row)"><i class="fa fa-times"></i></button>' +
                			'<button title="'+route.strings['ts.label.commit']+'" class="fl-button fl-positive save-button action-button" ng-click="!row.isProcessing && actions.save(row)">' +
                				'<i class="fa" ng-class="{\'fa-check\': !row.isProcessing, \'fa-spinner fa-spin\': row.isProcessing }"></i>' +
                			'</button>' +
                		'</div>'
            });
        } else {
        	defaultCols[1].width = '17/24';
        }

        if (!forPrimary) {
        	defaultCols[1].width = canEditApprovers ? '6/24' : '9/24';
	        defaultCols.splice(2, 0, {
            	key: 'tsaaFromdate', width: '4/24',
                name: 'ts.altApprover.tableHeader.from',
                noTitle: true,
                sortable: false,
                template: '<div ng-if="!row.editMode">{{row.tsaaFromdate | parseAesopDate}}</div>' +
                	'<div ng-if="row.editMode"><cmpt-ui-date-selector date-model="row.tsaaFromdate" min-date="row.minDate"></cmpt-ui-date-selector></div>'
            }, {
            	key: 'tsaaTodate', width: '4/24',
                name: 'ts.altApprover.tableHeader.to',
                noTitle: true,
                sortable: false,
                template: '<div ng-if="!row.editMode">{{row.tsaaTodate | parseAesopDate}}</div>' +
                	'<div ng-if="row.editMode"><cmpt-ui-date-selector date-model="row.tsaaTodate" min-date="row.minDate"></cmpt-ui-date-selector></div>'
            });
        }

        return defaultCols;
    }

	// Actions that can be bound to from the view
	route.go = {
		edit: function (row) {
			editMode(row);
		},
		cancel: function (row) {
			if (row.tsaaId === 0) {
				//cancelled adding a new one
				if (route.vm.hasPrimary) {
					route.vm.alternateApprovers.pop();
				} else {
					route.vm.primaryApprover.pop();
				}
			} else {
				resetData(row);
			}

			leaveEditMode(row);
		},
		save: function (row) {
			row.isProcessing = true;

			if (validateData(row)) {
				var saveAction = row.tsaaId > 0 ? 'update' : 'create';
				var params = {
					instId: instId,
					tsaaId: row.tsaaId || null
				};
				row.tsaaFromdate = parseAesopDateFilter(row.tsaaFromdate);
				row.tsaaTodate = parseAesopDateFilter(row.tsaaTodate);
				row.sortDate = row.isPrimary ? '' : parseDateFilter(row.tsaaFromdate, 'yyyy/MM/dd') + '-' + parseDateFilter(row.tsaaTodate, 'yyyy/MM/dd');

				timesheetApproversApi[saveAction](params, row).then(function(data){
					row.tsaaId = data.tsaaId;
					leaveEditMode(row);

					if (row.isPrimary) {
						route.vm.hasPrimary = true;
						toastHelp.success([route.strings['ts.approver.dialog.saveSuccess']], route.strings['ts.approver.dialog.title.saveSuccess'], false);
					} else {
						route.vm.altApproverSort = {
				        	byColumn: 'sortDate',
				        	direction: 'asc'
				        };
						route.vm.alternateApprovers = route.vm.alternateApprovers.slice();
						toastHelp.success([route.strings['ts.altapprover.dialog.saveSuccess']], route.strings['ts.altapprover.dialog.title.saveSuccess'], false);
					}
				}, function(reason){
					row.isProcessing = false;
					toastHelp.clear();
					toastHelp.error(reason.$messages, 'Error');
				});
			} else {
				row.isProcessing = false;
			}
		},
		deleteAltApprover: function (row) {
			if (!row.isPrimary) {
				confirmApproverDeletion().then(function(){
					row.isProcessing = true;
					route.vm.editMode = true;

					var params = {
						instId: instId,
						tsaaId: row.tsaaId || null
					};

					timesheetApproversApi.deleteAlternateApprover(params, row).then(function(data){
						route.vm.editMode = false;
						row.isProcessing = false;
						row.editMode = false;

						var approverRow = route.vm.alternateApprovers.filter(function (approver){ return row.tsaaId === approver.tsaaId; })[0];
						var index = route.vm.alternateApprovers.indexOf(approverRow);
						route.vm.alternateApprovers.splice(index,1);

						toastHelp.success([route.strings['ts.altapprover.dialog.deleteSuccess']], route.strings['ts.altapprover.dialog.title.deleteSuccess'], false);
					}, function(reason){
						row.isProcessing = false;
						route.vm.editMode = false;
						toastHelp.error(reason.$messages, 'Error');
					});
				});
			}
		},
		addApprover: function() {
			var newApprover = {
				tsaId: 0,
				tsaaId: 0,
				tsaEmail: '',
				tsaaName: '',
				tsaaFromdate: '',
				tsaaTodate: '',
				isPrimary: !route.vm.hasPrimary,
				minDate: tomorrow,
			};

			editMode(newApprover);

			if (route.vm.hasPrimary) {
				route.vm.alternateApprovers.push(newApprover);
			} else {
				route.vm.primaryApprover.push(newApprover);
			}
		}
	};

	function resetData(row){
		row.tsaaName = row.originalObj.tsaaName;
		row.tsaEmail = row.originalObj.tsaEmail;
		row.tsaaFromdate = row.originalObj.tsaaFromdate;
		row.tsaaTodate = row.originalObj.tsaaTodate;
		delete row.originalObj;
	}

	function validateData(row){
		var validationErrors = [];
		var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		//name required
		if (row.tsaaName == null || row.tsaaName.length === 0) {
			validationErrors.push(route.strings['ts.altapprover.error.text.noname']);
		}
		//email required
		if (row.tsaEmail == null || row.tsaEmail.length === 0) {
			validationErrors.push(route.strings['ts.altapprover.error.text.noemail']);
		}
		//valid email address
		if (row.tsaEmail != null && row.tsaEmail.length > 0 && !emailRegEx.test(row.tsaEmail)) {
			validationErrors.push(route.strings['ts.altapprover.error.text.validemail']);
		}

		if (!row.isPrimary) {
			var hasFromDate = row.tsaaFromdate != null && row.tsaaFromdate.length !== 0;
			var hasToDate = row.tsaaTodate != null && row.tsaaTodate.length !== 0;

			//from and to date specified
			if (!hasToDate) {
				validationErrors.push(route.strings['ts.altapprover.error.text.notodate']);
			}
			if (!hasFromDate) {
				validationErrors.push(route.strings['ts.altapprover.error.text.nofromdate']);
			}
			//from not after to
			if (hasFromDate && hasToDate && reportHelp.DayDiff(row.tsaaFromdate, row.tsaaTodate) < 0) {
				validationErrors.push(route.strings['ts.altapprover.error.text.earliertodate']);
			}
			//compare against the MaxApproverDays setting on the org's timesheet info
			if (hasFromDate && hasToDate && reportHelp.DayDiff(Date.parse(row.tsaaFromdate), Date.parse(row.tsaaTodate)) > maxApproverDays) {
				validationErrors.push(stringHelp.replace(route.strings['ts.altapprover.error.text.maxdays'], '{0}', maxApproverDays));
			}
		}

		if (validationErrors.length > 0) {
			toastHelp.clear();
			toastHelp.error(validationErrors, route.strings['ts.altapprover.error.text']);
			return false;
		}

		return true;
	}

	function editMode(row) {
		route.vm.editMode = true;
		row.editMode = true;
		row.cls = !row.isPrimary ? 'edit-mode' : '';
		row.originalObj = angular.copy(row);

		if (!row.isPrimary) {
			route.vm.primaryApprover.forEach(function (approver){
				approver.disabled = true;
			});
		}
		route.vm.alternateApprovers.forEach(function (approver){
			approver.disabled = approver.tsaaId === row.tsaaId ? false : true;
		});
	}
	function leaveEditMode(row) {
		route.vm.editMode = false;
		row.editMode = false;
		row.cls = '';
		row.isProcessing = false;

		route.vm.primaryApprover.forEach(function (approver){
			approver.disabled = false;
		});
		route.vm.alternateApprovers.forEach(function (approver){
			approver.disabled = false;
		});

		toastHelp.clear();
	}

	//confirm deletion dialog
	function confirmApproverDeletion(){
		var _defer = $q.defer();
		var dialog = ngDialog.open({
			template:'/global/modals/webtime-approvers-confirm-action.html',
			closeByDocument: false,
			closeByNavigation: true,
			showClose: false,
			data: {
				header: route.strings['ts.altapprover.dialog.title.deleteApprover'],
				confirmMessage: route.strings['ts.altapprover.dialog.deleteApprover'],
				buttons: [{
					title: route.strings['Delete'],
					cls:'fl-button fl-negative',
					icon: '',
					action:  function(){
						ngDialog.close(dialog.id);
						return _defer.resolve();
					}
				},{
					title: route.strings['Cancel'],
					cls:'fl-button',
					icon:'',
					action: function(){
						ngDialog.close(dialog.id);
						return _defer.reject();
					}
				}]
			}
		});
		return _defer.promise;
	}

	$scope.$watch('route.vm.institution', function (newInst) {
    	if (newInst != null && parseInt(instId) !== newInst.id) {
      		//$state.go($state.current, {instId: newInst.id}, {reload: true});
			$location.path('/WebTime/'+newInst.id+'/Approvers');
        }
    });
    function resetToCurrentInstitution(){
		var currentInst = institutionSvc.oneById(instId);
		route.vm.institution = currentInst;
	}


	angular.element(document).ready(function () {
        onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
    });
	function isDirty() {
		var approverList = route.vm.primaryApprover.filter(function(p) { return p.editMode; });
    	approverList = approverList.concat(route.vm.alternateApprovers.filter(function(alt) { return alt.editMode; }));

    	//compare with original obj if present
    	if (approverList.length === 1 && approverList[0].hasOwnProperty('originalObj')) {
    		var row = objectHelp.splice(approverList[0], ['tsaaName','tsaEmail','tsaaFromdate','tsaaTodate']),
    			origRow = objectHelp.splice(approverList[0].originalObj, ['tsaaName','tsaEmail','tsaaFromdate','tsaaTodate']);

    		if (angular.equals(row,origRow)) {
    			return false;
    		} else {
    			return true;
    		}
    	}

    	return approverList.length > 0;
	}

	//check if any row is currently in edit mode before leaving the page
	function confirmNavigateAway(newUrl) {
		var dialog = ngDialog.open({
			template:'/global/modals/webtime-approvers-confirm-action.html',
			closeByDocument: false,
			closeByNavigation: true,
			showClose: false,
			data: {
				header: route.strings['ts.dialog.title.unsavedChanges'],
				confirmMessage: route.strings['ts.dialog.unsavedChanges'],
				buttons: [{
					title: route.strings['Yes'],
					cls:'fl-button fl-positive',
					icon: '',
					action:  function(){
						ngDialog.close(dialog.id);
						redirect(newUrl);
					}
				},{
					title: route.strings['No'],
					cls:'fl-button',
					icon:'',
					action: function(){
						ngDialog.close(dialog.id);
						resetToCurrentInstitution();
					}
				}]
			}
		});
	}

	function routeChange(event, newUrl) {
	 	if (!isDirty()) { return; }

	 	confirmNavigateAway(newUrl);
	 	event.preventDefault();
	}
	function redirect(newUrl) {
		onRouteChangeOff();
    	//Existing issue with the fact that the locationChange event returns the new full url including the
    	//host, protocol, and port, but the $location.path function only expects the url without the base
    	//https://github.com/angular/angular.js/issues/8617
    	$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
	}

// #----- END WebtimeApproversCtrl -----# //
});}());