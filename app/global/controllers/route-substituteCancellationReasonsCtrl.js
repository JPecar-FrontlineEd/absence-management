(function() {'use strict';angular.module('aesop')
.controller('SubstituteCancellationReasonsCtrl', function ($q, $scope, ssAsync, toastHelp, ngDialog, stringSvc, permissionSvc, orgSvc, cancellationReasonApi, entitlementTypeApi) {
// #-------------------------------------------------# //
// #------- SubstituteCancellationReasonsCtrl -------# //

	// this is a route controller
	var route = this;
	var orgSettings = orgSvc.getOrgData()[0].settings;
	const canAdd = permissionSvc.iHave('REFDATA.REFDATAADD');
	const canEdit = permissionSvc.iHave('REFDATA.REFDATAEDIT');
	const canDelete = permissionSvc.iHave('REFDATA.REFDATADEL');
	const nameMaxLength = 255;
	let entitlementTypes = [];
	var rollbackRecord = {};
	let descWidth = 24;
	let entitlementWidth = 12;
	let actionsWidth = 3;
	if(orgSettings.usesVeritime){
		descWidth = descWidth - entitlementWidth;
	}
	if(canEdit || canDelete || canAdd){
		descWidth = descWidth - actionsWidth;
	}



	// View Model properties
	route.vm = {
		columns: [],
		dataset:[],
		isLoading: false
	};

	route.vm.isLoading = true;


	route.strings = stringSvc.getStrings([
		'Substitute.Cancellation.Message.Text.NoLinkedReason',
		'Substitute.Cancellation.Header.Text.CancellationReasons',
		'Substitute.Cancellation.Header.Text.CancellationReason',
		'Substitute.Cancellation.Header.Text.Name',
		'Substitute.Cancellation.Header.Text.LinkedAbsenceReason',
		'Substitute.Cancellation.DeleteDialog.YesDelete',
		'Substitute.Cancellation.DeleteDialog.NoCancel',
		'Substitute.Cancellation.DeleteDialog.Header',
		'Substitute.Cancellation.DeleteDialog.Content.Message',
		'Substitute.Cancellation.Button.TextAddNewCancellationReason',
		'NoneSelected',
		'Success',
		'Error',
		'Substitute.Cancellation.Message.SaveSuccess',
		'Substitute.Cancellation.TextBox.Name.Required',
		'Substitute.Cancellation.TextBox.Name.Limit',
		'Substitute.Cancellation.TextBox.Name.Required',
		'Substitute.Cancellation.Message.DeleteSuccess',
		'NoRecordsFound'
	]);

	$scope.$root.setTitle(route.strings['Substitute.Cancellation.Header.Text.CancellationReasons']);



	ssAsync(function* () {
		try{
			let cancellationReasons = yield cancellationReasonApi.get();
			entitlementTypes = yield entitlementTypeApi.queryCached();
			route.vm.dataset = cancellationReasons.map(function (v){
				//es6 way of assign multiple properties to multiple properties
				// concept is called "Destructuring"
				[ v.canEdit,v.canDelete, v.canAdd ] = [ canEdit,canDelete,canAdd ];
				v.isEditing = false;
				v.entitlementTypes = entitlementTypes.map(v => { return { id: v.id, value: v.name }; });
				v.isProcessing = false;
				v.canPerformAction = true;
				return v;
			});
			route.vm.isLoading = false;
		}catch(e){
			toastHelp.error(e.$messages, route.strings['Error']);
		}
	})();

	// entitlementTypeApi.queryCached().then(function(types){
	// 	entitlementTypes = types.map(v => { return { id: v.id, value: v.name }; });
	// }).then(function (){
	// 	cancellationReasonApi.get().then(function(reasons){
	// 		route.vm.isLoading = false;
	// 		route.vm.dataset = reasons.map(function (v){
	// 			//es6 way of assign multiple properties to multiple properties
	// 			// concept is called "Destructuring"
	// 			[ v.canEdit,v.canDelete, v.canAdd ] = [ canEdit,canDelete,canAdd ];
	// 			v.isEditing = false;
	// 			v.entitlementTypes = entitlementTypes;
	// 			v.isProcessing = false;
	// 			v.canPerformAction = true;
	// 			return v;
	// 		});
	// 	});
	// });



	let description = {
		tmpl:'<div class="readonly" ng-show="!row.isEditing" title="{{ row.description }}">{{ row.description }}</div>' +
		'<div class="editing" ng-show="row.isEditing"> ' +
		'<ng-form name="innerForm"> ' +
		'<input auto-focus maxlength="'+ nameMaxLength +'" name="description" required ng-maxlength="'+ nameMaxLength +'" type="text" ng-model="row.description" />' +
		'<div ng-messages="innerForm.description.$touched  && innerForm.description.$error" class="validation-messages">' +
    	'<div ng-message="required">'+ route.strings['Substitute.Cancellation.TextBox.Name.Required'] +'</div>' +
    	'<div ng-message="max">'+ route.strings['Substitute.Cancellation.TextBox.Name.Limit'].replace('{0}', nameMaxLength) +'</div>' +
		'</div></ng-form></div>',
		width: descWidth
	};

	// without the inner form we cannot validate the fields inside the rows.
	//http://stackoverflow.com/questions/14378401/dynamic-validation-and-name-in-a-form-with-angularjs
	let entitlementType = {
		tmpl: '<cmpt-ui-dropdown ' +
				' options-array="row.entitlementTypes" ' +
				' value-selected="row.entitlementType" ' +
				' allow-blank="true" ' +
				' default-text="\'' + route.strings['NoneSelected'] + '\'"' +
				' label-text="\'' + route.strings['Substitute.Cancellation.Message.Text.NoLinkedReason'] +'\'"' +
				' read-only="!row.isEditing" ' +
				' enabled="true" ' +
				' unique-marker-class="\'auto-cancellation-reason-select\'" ' +
				' error-messages="[]"></cmpt-ui-dropdown>',
		width: entitlementWidth
	};

	let actions = {
		tmpl: '<cmpt-reference-data-action-cell data="row" actions="route.go" ng-show="row.canPerformAction"></cmpt-reference-data-action-cell>',
		width: actionsWidth
	};

	route.vm.columns.push({
				key: 'description', width:  description.width + '/24',
                sortable: false,
				name: 'Substitute.Cancellation.Header.Text.Name',
				template: description.tmpl
			});

	if(orgSettings.usesVeritime){
		route.vm.columns.push({
			key: 'entitlementType', width: entitlementType.width + '/24',
            sortable: false,
			name: 'Substitute.Cancellation.Header.Text.LinkedAbsenceReason',
			template: entitlementType.tmpl
		});
	}

	if(canEdit || canDelete || canAdd){
		route.vm.columns.push({
			key: 'actions', width: actions.width + '/24',
            sortable: false,
			name: '',
			template: actions.tmpl
		});
	}

	$scope.$on('delete-ref-data', function(event, args){
		if(canPerformAction()){
			deleteRecord(args.id);
		}
	});

	$scope.$on('edit-ref-data', function (event, args){
		//backup for cancel
		if(canPerformAction()){
			rollbackRecord = angular.copy(args.row);
			editMode(args.row.id, true);
		}
	});

	$scope.$on('cancel-edit-ref-data', function(event, args){
		if(args.row.id === 0){
			route.vm.dataset = route.vm.dataset.filter((x) => { return x.id !== 0; });
		}else{
			let item = route.vm.dataset.find(x => x.id === args.row.id);
			var index = route.vm.dataset.indexOf(item);
			route.vm.dataset[index] = rollbackRecord;
			// reseting back to empty object.
			rollbackRecord = {};
		}
		editMode(args.row.id, false);
	});

	$scope.$on('save-ref-data', function(event, args){
		if ($scope.cancellationReasonForm.$valid) {
			let row = route.vm.dataset.find(x => x.id === args.row.id);
			saveRecord(row);
		}
	});


	// Actions that can be bound to from the view
	route.go = {
		add: function(){
			if(canPerformAction() && canAdd){
				var shellObj = {
					id:0,
					description: '',
					commentsAllowed: true,
					commentsRequired: true,
					canDelete: canDelete,
					canEdit: canEdit,
					canAdd: canAdd,
					entitlementType: null,
					entitlementTypes: entitlementTypes.map(v => { return { id: v.id, value: v.name }; }),
					isEditing: true,
					isProcessing: false,
					canPerformAction: true
				};
				if (route.vm.dataset.length === 0) {
					//Unshift is not causing the watch on the dataset to fire, but in the case of the
					//first Add we no longer want to show the "No Records Found" messaging
					route.vm.dataset = [shellObj];
				} else {
					//add to the top of the list
					route.vm.dataset.unshift(shellObj);
				}
				editMode(shellObj.id, true);
			}
		}
	};

	function canPerformAction () {
		var row = route.vm.dataset.find(x=> x.id === 0 || x.isEditing);
		return !row;
	}

	function editMode (id, mode) {
		route.vm.dataset.forEach((row) => {
			if (row.id === id){
				row.isEditing = mode;
				row.canPerformAction = true;
			}else{
				row.canPerformAction = !mode;
			}
		});
	}

	function saveRecord(row){
		row.isProcessing = true;
		var method = row.id > 0 ? 'put' : 'post';
		cancellationReasonApi[method]({id : row.id }, row).then(function (data){
			if(row.id === 0){ row.id = data.id;	}
			row.isProcessing = false;
			row.isEditing = false;
			rollbackRecord = {};
			editMode(row.id, false);
			toastHelp.success(route.strings['Substitute.Cancellation.Message.SaveSuccess'], route.strings['Success']);
		},function(err){
			row.isProcessing = false;
			row.isEditing = true;
			toastHelp.error(err.$messages, route.strings['Error']);
		});
	}


	function deleteRecord (id) {
		let row = route.vm.dataset.find(x => x.id === id);
		let dialog = ngDialog.open({
			template:'/components/reference-data/cancellation-reasons/templates/delete-confirmation.html',
			closeByDocument: false,
			closeByNavigation:true,
			data:{
				header:route.strings['Substitute.Cancellation.DeleteDialog.Header'] + route.strings['Substitute.Cancellation.Header.Text.CancellationReason'],
				content:{
					message: route.strings['Substitute.Cancellation.DeleteDialog.Content.Message'].replace('{0}', route.strings['Substitute.Cancellation.Header.Text.CancellationReason']) + '?'
				},
				row: row,
				buttons: [{
					title: route.strings['Substitute.Cancellation.DeleteDialog.YesDelete'],
					cls:'fl-button fl-negative',
					action: function(){
							if(!row.isProcessing){
								row.isProcessing = true;
								cancellationReasonApi.remove({id: id}).then(function (){
									row.isProcessing = false;
									ngDialog.close(dialog.id);
									route.vm.dataset = route.vm.dataset.filter((x) => { return x.id !== id; });
									toastHelp.success(route.strings['Substitute.Cancellation.Message.DeleteSuccess'], route.strings['Success']);
								},function(err){
									toastHelp.error(err.$messages, route.strings['Error']);
								});
							}
						}
					},{
					title: route.strings['Substitute.Cancellation.DeleteDialog.NoCancel'],
					cls:'fl-button',
					action: function(){
						ngDialog.close(dialog.id);
					}
				}]
			}
		});
	}


// #----- END SubstituteCancellationReasonsCtrl -----# //
});}());
