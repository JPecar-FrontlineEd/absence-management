(function() {'use strict';angular.module('aesop')
.directive('cmptApproveBottomResult', function () {return {

// directive options
restrict: 'E',
scope: {
	filter: '='
},
replace: true,
templateUrl: '/components/approve/cmpt-approve-bottom-result/approveBottomResult.html',

// #------------------------------------------------# //
// #---- Component (cmpt-approve-bottom-result) ----# //
controller: function ($q, $scope, $filter, stringSvc, institutionSvc, permissionSvc, orgSvc, approvalSvc,absenceRequestApi, ngDialog, toastHelp, domHelp) {


	var filter = $scope.filter;
	var dataContainer=[];
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'DR.Dialog.Notes.Text.NotesToSubstitute',
		'DR.Dialog.Notes.Text.NotesToAdministrator',
		'DR.Dialog.Notes.Text.AdminOnlyNotes',
		'Close',
		'Notes',
		'Absence',
		'ApprovalList.Header.Text.Approvals',
		'ApprovalList.Message.NoAbsencesRequiringApproval',
		'ts.approver.label.approveSelected',
		'Approval.Button.Text.DenySelected',
		'ApprovalList.Label.Text.AbsenceApprovals',
		'Absence.Button.Text.Approve',
		'Absence.Button.Text.Deny',
		'Absence.Button.Text.DenyPart',
		'Approval.Tooltip.Text.FilledBy',
		'Approval.Tooltip.Text.NoSubstituteRequired',
		'Approval.Tooltip.Text.NotFilled',
		'Hour',
		'Day',
		'Approval.Text.DeniedOn',
		'Approval.Text.LastApprovedOn',
		'Table.Header.Conf#',
		'DR.Dialog.Notes.Text.NotesToSubstitute',
		'DR.Dialog.Notes.Text.NotesToAdministrator',
		'DR.Dialog.Notes.Text.AdminOnlyNotes',
		'Comment',
		'approval',
		'Denial',
		'Approval.Text.CommentsFor',
		'Approval.Text.CommentFor',
		'Absences',
		'Approval.Dialog.Title.Text',
		'Dashboard.Header.Filled.Label',
		'Dashboard.Header.Unfilled.Label'
	]);

	// View Model properties
	var vm = $scope.vm = {
		dataLoaded: false,
		loading: false,
		columns: getCols(),
		data:[],
		count:0,
		selected:[],
		approveAllCount:0,
		denyAllCount:0,
		comment:'',
		preloader:{
			loaded: 0,
			total: 0,
			loading: false,
			loadingText:'absences approved',
			style: {
				transform: 'translateX(-100%)'
			}
		},
		approveAllComment:''
	};

	var approveAllFields = 'id,requiresApproval,numApproved,lastApprovedAction,approverKey,isApproved,isPartiallyApproved,isDenied,' +
						   'canApprove,canDeny,canDenyPart,startDate,endDate,approverComments';

	var numApprovedDenied = 0; //Using this variable to store how many absences were succesfully approved or denied for the selected functionality

	$scope.$watchGroup(['filter.startDate','filter.endDate'], fetchResults);
	$scope.$watchGroup(['filter.unapproved',
						'filter.partiallyApproved',
						'filter.approved',
						'filter.denied',
						'filter.accountingCode',
						'filter.budgetCode'], filterResults);



	function filterResults () {
		vm.data = angular.copy(dataContainer).filter(function (row) {
			if(row.requiresApproval &&
				!row.isApproved &&
				!row.isDenied &&
				!row.isPartiallyApproved &&
				!filter.unapproved){
				return false;
			}else if(row.isApproved && !filter.approved){
				return false;
			}else if(row.isDenied && !filter.denied){
				return false;
			}else if(row.requiresApproval && row.isPartiallyApproved && !filter.partiallyApproved){
				return false;
			}else if(filter.budgetCode != null && row.budgetCodeIds !=null &&  row.budgetCodeIds.indexOf(filter.budgetCode.id) === -1){
				return false;
			}else if(filter.accountingCode != null && row.accountingCodeIds !=null &&  row.accountingCodeIds.indexOf(filter.accountingCode.id) === -1){
				return false;
			}else{
				return true;
			}
		});

		vm.count = vm.data.length;
		removeHiddenSelections();
	}

	function removeHiddenSelections(){
		var selectedList = [],
			datasetIds = vm.data.map(function (v, i, a) { return v.id; }),
			selectedIds = [];
		//only rows that are currently visible to the user should retain selection
		vm.selected.forEach(function (row) {
			if (datasetIds.indexOf(row.id) >= 0) {
				selectedIds.push(row.id);
			}
		});
		vm.selected = vm.data.filter(function (v, i, a) {
			return selectedIds.indexOf(v.id) >= 0;
		}).map(function (v, i, a) {
			v.$selected = true;
			v.$height = null;
			v.cls = 'selected';
			return v;
		});
	}

	function  getCols () {
		var colArr = [{
			key: 'id', width: '2/24',
			isIndex: true,
			name: 'Table.Header.Conf#',
			template: '<cmpt-template-confirmation-link absrid="{{ row.id }}" ></cmpt-template-confirmation-link>' +
					'<span class="notes" once-if="row.hasNotes" qtip my="left center" at="right center" qtip-class="notes-content" content="{{ row.notesHtml }}"><i class="fa fa-file-text"></i></span>'
		}, {
			key: 'workerName', width: '5/24',
			name: 'Name',
			template: '<cmpt-template-worker-link worker-id="{{ row.workerId }}" show-name-as-link="true" worker-name="{{ row.workerName }}"></cmpt-template-worker-link>' +
					'<div class="sub-title" once-text="row.workerTitle"></div>'
		}, {
			key: 'startDate', width: '2/24',
			name: 'Date',
			defaultSort: 'asc',
			template:'<div>{{ row.date }}</div>'
		}, {
			key: 'substitute', width: '2/24',
			name: 'Dashboard.Header.Filled.Label',
			sortable: false,
			template: '<span once-if="!row.needSub" title="'+ strings['Approval.Tooltip.Text.NoSubstituteRequired'] +'">N/A</span>' +
					'<i aria-label="'+ strings['Dashboard.Header.Filled.Label'] +'" ng-if="row.substituteId !== null"  once-if="row.needSub" class="fa fa-check" title="{{ row.substituteNameTitle }}" ng-class="{\'filled\':  row.substituteId !== null}"></i>' +
					'<i aria-label="'+ strings['Dashboard.Header.Unfilled.Label'] +'" ng-if="row.substituteId == null"  once-if="row.needSub" class="fa fa-times" title="{{ row.substituteNameTitle }}" ng-class="{\'unfilled\':  row.substituteId == null}"></i>'
		}, {
			key: 'firstReason', width: '3/24',
			name: 'Reason',
			sortable: false,
			template: '<div class="multi-value" ng-repeat="reason in row.absenceReasons" title="{{reason}}">{{ reason }}</div>'
		}, {
			key: 'duration', width: '2/24',
			name: 'Duration',
			sortable: false,
			template: '<span>{{ row.totalDuration }} {{ row.durationText }}</span>'
		}, {
			key: 'Status', width: '2/24',
			name: 'Table.Header.Approvals',
			sortable: false,
			template: '<cmpt-template-approval requires-approval="row.requiresApproval" is-approved="row.isApproved" ' +
						'is-denied="row.isDenied" num-approved="row.numApproved" is-partially-approved="row.isPartiallyApproved" use-long-tooltip="true" absr-id="row.id" approver-level="row.maxApproverLevel"></cmpt-template-approval>'
		},{
			key: 'actions', width: '6/24',
			name: 'Actions',
			sortable: false,
			template: '<div ng-if="row.approvalStatus != null">{{ row.approvalStatus }}</div>' +
					'<a ng-if="row.canApprove" class="fl-button-sm fl-positive" ng-click="actions.approveDialog(row, true)"><span class="fl-label"><i class="fa fa-check pull-left"></i>'+ strings['Absence.Button.Text.Approve'] +'</span></a>' +
					'<a ng-if="row.canDeny" class="fl-button-sm fl-negative"  ng-click="actions.approveDialog(row, false)">'+ strings['Absence.Button.Text.Deny'] +'</a>' +
					'<a ng-if="row.canDenyPart" class="fl-button-sm deny-part" ng-click="actions.denyPartDialog(row)">'+ strings['Absence.Button.Text.DenyPart'] +'</a>'
		}];

		return colArr;
	}

	function mapResults(row) {
		var absences = row.absences;
		var totalDuration = totalDurationCount(absences);
		var obj = {};
		obj.id = row.id;
		obj.startDate = new Date(row.startDate);
		obj.date = dateString(row);
		obj.requiresApproval = row.requiresApproval;
		obj.workerId = row.worker.id;
		obj.workerName= row.worker.lastName + ', ' + row.worker.firstName;
		obj.workerTitle = row.worker.title;
		obj.isVacancy = row.worker.isVacancy;
		obj.needSub = row.needSub;
		obj.substituteId = (row.substitute == null) ? null : row.substitute.id;
		obj.substituteNameTitle = (row.substitute == null) ? strings['Approval.Tooltip.Text.NotFilled'] : strings['Approval.Tooltip.Text.FilledBy'] + ' ' + row.substitute.firstName.trim() + ' ' + row.substitute.lastName.trim();
		obj.absences = absences;
		obj.absenceReasons = absences.map(function(v){
			if(v.entitlement.needsApproval){
				return v.entitlement.name;
			}
		}).filter(function(el,i,a){
			return i === a.indexOf(el);
		});
		obj.totalDuration = totalDuration;
		obj.durationText = (row.balanceTrackingType === 1 ? strings['Day'] : strings['Hour']) + (totalDuration > 1 ? 's' : '');
		obj.hasNotes = (row.notes != null && row.notes.length > 0) || (row.notesToAdmin != null && row.notesToAdmin.length > 0) || (row.notesToAdminOnly != null && row.notesToAdminOnly.length > 0);
		obj.notesHtml = notesHtmlString(row);
		obj.budgetCodeIds = row.absences.filter(function(el,i,a){ return (el.budgetCode); }).map(function(v){
			return v.budgetCode.id;
		});
		obj.accountingCodeIds = row.absences.filter(function(el,i,a){ return (el.accountingCode); }).map(function(v){
			if(v.accountingCode.isFreeForm){
				return 0;
			}
			return v.accountingCode.id;
		});
		obj.approverComments = row.approverComments;
		obj.maxApproverLevel=row.maxApproverLevel;
		return obj;
	}

	function processResults (data) {
		vm.dataLoaded = true;
		dataContainer.length = 0;
		vm.loading = false;
		dataContainer = data.map(function (row, i, a) {
			return approvalProcess(mapResults(row),row);
		});
		filterResults();
	}

	function approvalProcess (obj, row) {
		var approvalStatus = approvalStatusString(row);
		obj.date = dateString(row);
		obj.numApproved = row.numApproved;
		obj.lastApprovedAction = row.lastApprovedAction;
		obj.approvalStatus = approvalStatus;
		obj.approverComments = row.approverComments;
		obj.isApproved = row.isApproved;
		obj.isPartiallyApproved = row.isPartiallyApproved;
		obj.isDenied = row.isDenied;
		obj.approverKey = row.approverKey;
		obj.canApprove = row.canApprove;
		obj.canDeny = row.canDeny;
		obj.canDenyPart = row.canDenyPart;
		obj.$disabled = !obj.canApprove && !obj.canDeny;
		obj.$selected = false;
		obj.cls = '';
		return obj;
	}

	function getDataContainerRow(rowId){
		return dataContainer.filter(function(v,i,a){
			return v.id === rowId;
		})[0];
	}

	function denyPartUpdate (obj, row) {
		var absences = row.absences;
		var totalDuration = totalDurationCount(absences);

		obj.absences = absences;
		obj.absenceReasons = absences.map(function(v){
			if(v.entitlement.needsApproval){
				return v.entitlement.name;
			}
		}).filter(function(el,i,a){
			return i === a.indexOf(el);
		});
		obj.totalDuration = totalDuration;
		obj.durationText = (row.balanceTrackingType === 1 ? strings['Day'] : strings['Hour']) + (totalDuration > 1 ? 's' : '');
		obj.budgetCodeIds = row.absences.filter(function(el,i,a){ return (el.budgetCode); }).map(function(v){
			return v.budgetCode.id;
		});
		obj.accountingCodeIds = row.absences.filter(function(el,i,a){ return (el.accountingCode); }).map(function(v){
			if(v.accountingCode.isFreeForm){
				return 0;
			}
			return v.accountingCode.id;
		});
		obj.startDate = new Date(row.startDate);

		return obj;
	}
	function addRowToResults(newRow) {
		var newAbsrObj = mapResults(newRow);
		dataContainer.push(approvalProcess(newAbsrObj,newRow));
	}

	function dateString (row) {
		var startDate =  $filter('parseAesopDate')(row.startDate);
		var endDate =  $filter('parseAesopDate')(row.endDate);
		if(startDate === endDate){
			return startDate;
		}
		return startDate + ' - ' + endDate;
	}

	function approvalStatusString (row) {
		var text = null;
		if(row.approverKey != null){
			if(row.requiresApproval &&
				(row.isApproved ||
				row.isDenied ||
				row.isPartiallyApproved)){
				text = (row.isDenied) ? strings['Approval.Text.DeniedOn'] : strings['Approval.Text.LastApprovedOn'];
				text += ' ' + $filter('date')(row.lastApprovedAction,'short');
			}
		}
		return text;
	}
	function totalDurationCount (absences) {
		var count = 0;
		for (var i = 0; i < absences.length; i++) {
			count += absences[i].adjustedDurationAmount;
		}
		return +count.toFixed(2);
	}

	function notesHtmlString (row) {
		var html = '<div class="notes-content">';
		if(row.notes && row.notes.length > 0){
			html+= '<div><label>'+ strings['DR.Dialog.Notes.Text.NotesToSubstitute'] +'</label><span>' + row.notes + '</span></div>';
		}
		if(row.notesToAdmin && row.notesToAdmin.length > 0){
			html+= '<div><label>'+ strings['DR.Dialog.Notes.Text.NotesToAdministrator'] +'</label><span>' + row.notesToAdmin + '</span></div>';
		}
		if(row.notesToAdminOnly && row.notesToAdminOnly.length > 0){
			html+= '<div><label>'+ strings['DR.Dialog.Notes.Text.AdminOnlyNotes'] +'</label><span>' + row.notesToAdminOnly + '</span></div>';
		}
		return html + '</div>';
	}

	function fetchResults () {
		vm.loading = true;
		absenceRequestApi.approval.get({
			startDate: filter.startDate.toString('MM/dd/yyyy'),
			endDate: filter.endDate.toString('MM/dd/yyyy'),
			includeUnapproved:true,
			includePartialApproved:true,
			includeApproved:true,
			includedenied:true,
			fields: '(' +
						'id,startDate,endDate,requiresApproval,isApproved, isPartiallyApproved,isDenied,needSub,' +
						'notes,notesToAdmin,notesToAdminOnly,balanceTrackingType,numApproved,lastApprovedAction,' +
						'approverKey,canApprove,canDeny,canDenyPart,approverComments,maxApproverLevel,' +
						'substitute(id,firstName,lastName),' +
						'worker(id,isVacancy,firstName,middleName,lastName,title),' +
						'absences(id,date,adjustedDurationAmount,absenceDuration,absenceBreakDuration,DeductBreakFromAbsenceDuration,shiftType,institution(id,name),entitlement(name,needsApproval),budgetCode(id),accountingCode(id, isFreeForm))' +
					')'
		}).then(processResults, function(reasons){
			 vm.loading = false;
			 toastHelp.error(reasons.$messages, 'Error');
		});
	}


	var go = $scope.go = {
		approveDialog: function (row, forApprove){

			vm.comment = '';
			var fields = 'requiresApproval,numApproved,lastApprovedAction,approverKey,isApproved,' +
						 'isPartiallyApproved,isDenied,canApprove,canDeny,canDenyPart,' +
						 'startDate,endDate,approverComments';
			var buttons = [{
				title: (forApprove) ? 'Approve' : 'Deny',
				cls: (forApprove) ? 'fl-positive': 'fl-negative',
				icon: (forApprove) ? 'fa-check' : '',
				loading: false,
				action:  function(){
					var button = this;
					if(!button.loading){
						button.loading = true;
						approveAction(forApprove,row.id,vm.comment,fields).then(function (data){
							approvalProcess(row,data);
							dataContainer = vm.data;
							filterResults();
							button.loading = false;
							toastHelp.info(['#' + row.id + ' has been ' + (forApprove ? 'Approved' : 'Denied') + ' successfully.']);
							unSelectAll();
							vm.selected=[];
							ngDialog.close(dialog.id);
						}, function (){
							button.loading = false;
							unSelectAll();
							vm.selected=[];
							ngDialog.close(dialog.id);
						});
					}
				}
			},{
				title: strings['Close'],
				cls:'',
				icon:'',
				loading: false,
				action: function(){ ngDialog.close(dialog.id); }
			}];


			var dialog = ngDialog.open({
				template:'/components/approve/cmpt-approve-bottom-result/approve-action.html',
				closeByDocument: false,
				closeByNavigation:true,
				showClose :false,
				className: 'ngdialog-theme-default approve-dialog',
				data:{
					header: strings['Approval.Dialog.Title.Text'] + ' #' + row.id,
					absr: row,
					comment: vm,
					forApprove: forApprove,
					buttons: buttons
				}
			});
		},
		approveDenyAll:function(forApproval){

			if(forApproval && vm.approveAllCount<1){
				return;
			}

			if(!forApproval && vm.denyAllCount<1){
				return;
			}

			var buttons = [];

			buttons.push({
				title: forApproval ? 'Approve' : 'Deny',
				cls:'fl-positive',
				icon: 'fa-check',
				action:  function(){
					var button = this;
					if(!button.loading){
						button.loading = true;
						vm.preloader.loading=true;
						vm.preloader.loaded=0;
						vm.preloader.loadingText = forApproval ? 'absences approved' : 'absences denied';
						vm.preloader.style = {
							transform: 'translateX(-100%)'
						};
						vm.preloader.total=forApproval ? vm.approveAllCount : vm.denyAllCount;
						var approvableAbsrs = vm.selected.filter(function(item){return forApproval ? item.canApprove : item.canDeny; });
						var i = approvableAbsrs.length;

						for (; i-- ;) {
							approveAction(
								forApproval,
								approvableAbsrs[i].id,
								vm.approveAllComment,
								approveAllFields
							).then(approveSuccess, approveFail);
						}
					}

					function approveSuccess(data) {
						approvalProcess(vm.data.filter(function(item){ return item.id === data.id; })[0], data);
						dataContainer = vm.data;
						filterResults();
						updateProgressBar();
						numApprovedDenied ++;
						if(vm.preloader.loaded === vm.preloader.total){

							ngDialog.close(approveDenyAlldialog.id);
							if(numApprovedDenied>0){
								var toastMessage = numApprovedDenied.toString();
								toastMessage += numApprovedDenied>1 ?' Absences' : ' Absence';
								toastMessage += numApprovedDenied>1 ?' have' : ' has';
								toastMessage += forApproval ? ' been approved' : ' been denied';
								var toastTitle = numApprovedDenied>1 ? 'Absences ' : 'Absence ';
								toastTitle += forApproval ? 'Approved' : 'Denied';
								toastHelp.info([toastMessage], toastTitle);
							}
							unSelectAll();
							vm.selected=[];
						}
					}

					function approveFail(reasons) {
						unSelectAll();
						vm.selected=[];
						ngDialog.close(approveDenyAlldialog.id);
						toastHelp.error(reasons.$messages, 'Error');
					}
				}
			});

			buttons.push({
				title: strings['Close'],
				cls:'normal-btn',
				icon:'',
				action: function(){ ngDialog.close(approveDenyAlldialog.id); }
			});

			var title = forApproval ? strings['approval']+' ' : strings['Denial']+' ';
			title += vm.approveAllCount>1 ? strings['Approval.Text.CommentsFor'] : strings['Approval.Text.CommentFor'];
			title += ' '+vm.approveAllCount+' ';
			title += vm.approveAllCount>1 ? strings['Absences'].toLowerCase() : strings['Absence'].toLowerCase();
			vm.preloader.loading =  false;
			numApprovedDenied = 0;
			vm.approveAllComment = '';
			var approveDenyAlldialog = ngDialog.open({
				template:'/components/approve/cmpt-approve-bottom-result/approve-all-action.html',
				closeByDocument: false,
				closeByNavigation:true,
				showClose :false,
				scope:$scope,
				data:{
					header:title,
					buttons: buttons,
					commentText:strings['Comment']
				}
			});
		},
		denyPartDialog: denyPart
	};

	function unSelectAll(){
		var i = vm.data.length;
		for (; i-- ;) {
			vm.data[i].$selected=false;
			vm.data[i].cls='';
		}
	}


	function approveAction (forApprove, id, comment, fields) {
		var _defer = $q.defer();
		approvalSvc[forApprove ? 'approve': 'deny'](id,comment, fields).then(function (data){
			return _defer.resolve(data);
		}, function (reason){
			toastHelp.error(reason.$messages, 'Error');
			return _defer.reject();
		});
		return _defer.promise;
	}

	function denyPart(row) {
		var _defer = $q.defer();
		approvalSvc.showDenyPart(row).then(
			function (data) {
				var dataRow = getDataContainerRow(row.id);

				approvalProcess(dataRow, data.currentAbsr);
				denyPartUpdate(dataRow, data.currentAbsr);
				if (data.splitAbsrs.length > 0) {
					//add the new split absrs to the results
					data.splitAbsrs.map(function (row, i, a) {
						addRowToResults(row);
					});
				}
				filterResults();
				unSelectAll();
				vm.selected=[];

				// force a resort
				vm.data = vm.data.slice();
			},
			function () {}
		);
		return _defer.promise;
	}

	function updateProgressBar(){
		var loaderTranslateX;

		vm.preloader.loaded ++;
		loaderTranslateX = (100 - Math.round((vm.preloader.loaded / vm.preloader.total) * 100)) * -1;
		vm.preloader.style.transform = 'translateX(' + loaderTranslateX + '%)';

	}


	$scope.$watchCollection('vm.selected',function(){
		vm.approveAllCount = 0;
		vm.denyAllCount=0;
		var i = vm.selected.length;
		for (; i-- ;) {
			if(vm.selected[i].canApprove){
				vm.approveAllCount++;

			}
		}
		i = vm.selected.length;
		for (; i-- ;) {
			if(vm.selected[i].canDeny){
				vm.denyAllCount++;

			}
		}
	});


}

// #-- END Component (cmpt-approve-bottom-result) --# //
// #------------------------------------------------# //
};});}());
