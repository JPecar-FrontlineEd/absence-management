(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------------------# //
	// #----- Service (referenceDataAbsenceReasonSvc) -----# //
	app.factory('referenceDataAbsenceReasonSvc', function ($q, $state, $location, referenceDataVal,dataAnalysisCategorySvc,
															stringSvc, institutionSvc, toastHelp, ngDialog,
															entitlementTypeApi, arrayHelp, permissionSvc, workerTypeApi) {

		var _defer = $q.defer();

		//Need this permission to show or hide Add Absence Reason to Bucket link
		const canAdd = permissionSvc.iHave('REFDATA.REFDATAADD');


		//May be an overkill
		//but a class responsible for creating a copy of existing absence reason for edit
		//Copy of the object will live within the scope of this class
		//Copy can only be effected with the methods exposed.
		class copyHandler {
			constructor(){
				this.copyOfObj = {};
			}

			setCopy(item) {
				this.copyOfObj = angular.copy(item);
			}
			getCopy(){
				//if the user cancels and goes into the languages modal a second time, we would have reset their object to the
				//reference of the original object, and then they will be directly editing the original copy.
				//so always get a copy of the original object when calling getCopy().
				return angular.copy(this.copyOfObj);
			}
		}
		var copyHandlerInstance = new copyHandler();
		var languageDefinitionsCopyHandlerInstance = new copyHandler();


		var strings = stringSvc.getStrings([
			'Referencedata.AbsenceReason.Text.AddAbsenceReasonBucket',
			'Cancel',
			'Close',
			'Done',
			'Referencedata.AbsenceReason.Text.NewAbsenceReason',
			'Dialog.Title.UnsavedChangesConfirmation',
			'AbsenceReason',
			'Success',
			'Delete.BucketWarning',
			'Delete.Warning',
			'Delete.Question',
			'Delete.Yes',
			'Error',
			'Delete.No',
			'referenceData.absenceReason.NewBucket',
			'referenceData.absenceReason.NewAbsenceReason',
			'referenceData.absenceReason.AddAbsenceReasonToBucket',
			'referenceData.absenceReason.AbsenceReasonCreated',
			'referenceData.absenceReason.AbsenceReasonSaved',
			'referenceData.absenceReason.AbsenceReasonDeleted',
			'referenceData.absenceReason.YouHaveUnsaveChanges',
			'referenceData.absenceReason.ContinueWithoutSaving',
			'referenceData.absenceReason.CreateNewAbsenceReason',
			'referenceData.absenceReason.CreateNewAbsenceReasonDescription',
			'referenceData.absenceReason.DeleteHeader',
			'Referencedata.AbsenceReason.Text.ViewLanguageDefinitions',
			'Referencedata.AbsenceReason.Text.EditLanguageDefinitions',
			'Referencedata.AbsenceReason.Text.EnterLanguageDefinitionsPrompt',
			'English',
			'Spanish',
			'French',
			'NoneDefined',
			'Validation.Message.MustNotBeLongerChars',
		]);



		function blankObj(isBucket) {
			var blankObj = {
				id: -1,
				name: '',
				placeHolderName: isBucket ? strings['referenceData.absenceReason.NewBucket'] : strings['referenceData.absenceReason.NewAbsenceReason'],
				group: 0,
				isSelected: true,
				parentId: null,
				isExpanded: false,
				isBucket: isBucket,
				externalIdOne: null,
				externalIdTwo: null,
				phoneMenu: null,
				dataAnalysisCategory: null,
				institution:  [],
				institutionObj: null,
				workerTypes: [],
				settings: {
					isPublic: false,
					needApproval: false,
					holdUntilApproved: false,
					enforceBalances: false,
					requireNotes: false
				},
				timeUsage: {
					minimumUsage: {
						allowed: false,
						value: null
					},
					minimumBalance:{
						allowed: false,
						value: null
					},
					maxYearlyUsage:{
						allowed: false,
						value: null
					}
				},
				languageTexts: {}
			};
			if(isBucket){
				blankObj.children = [];
			}
			var copy = angular.copy(blankObj);
			return copy;
		}




		let detailCols = {
			isPublic: 'isPublic',
			needApproval:'needApproval',
			holdUntilApproved:'holdUntilApproved',
			enforceBalances:'enforceBalances',
			requireNotes:'requireNotes'
		};

		let nameCol = {
			key: 'name', width: '7/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.Name',
			template: '<div ng-class="{ \'selected\' : row.isSelected }">' +
					'<span ng-if="row.isBucket" class="toggle" ng-click="parent.route.go.toggle(row)">' +
					'<i class="fa" ng-class="{\'fa-folder-open\': row.isExpanded, \'fa-folder\': !row.isExpanded}"></i>'+
					'</span>' +
					'<div class="view-only" ng-if="row.id <= 0">' +
					'<span ng-show="row.name.length === 0">{{ row.placeHolderName }}</span>'+
					'<span ng-show="row.name.length > 0">{{ row.name }}</span>'+
					'</div>' +
					'<a ng-if="row.id > 0" href="/reference-data/absence-reasons/{{ row.id }}"><span class="ref-name">{{ row.name }}</span></a>' +
					'<span class="cancel" ng-click="parent.route.go.back(row)">'+ strings['Cancel'] +'</span>' +
					'</div>'
		};


		let footerTemplate = '<div class="footer-template" ng-if="row.children.length > 0" ap-show-slide="row.isExpanded">' +
				'<div class="-g" ng-repeat="item in row.children">' +
				'<div class="left-border-cell ref-name -u-7-24"> '+
					'<div class="grid-cell" ng-class="{ \'selected\' : item.isSelected }"> ' +
						'<div class="view-only" ng-if="item.id <= 0">' +
						'<span ng-show="item.name.length === 0">{{ item.placeHolderName }}</span>'+
						'<span title="{{ item.name }}" ng-show="item.name.length > 0">{{ item.name }}</span>'+
						'</div>' +
						'<a title="{{ item.name }}" ng-if="item.id > 0" href="/reference-data/absence-reasons/{{ item.id }}">{{ item.name }}</a>' +
						'<span class="cancel" ng-click="parent.route.go.back(item)">'+ strings['Cancel'] +'</span>' +
					'</div>'+
				'</div>' +
				'<div class="middle-cell -u-2-24"><div class="grid-cell">'+ generateDetailCol(detailCols.isPublic,"item") +'</div></div>' +
				'<div class="middle-cell -u-2-24"><div class="grid-cell">'+ generateDetailCol(detailCols.needApproval,"item") +'</div></div>' +
				'<div class="middle-cell -u-2-24"><div class="grid-cell">'+ generateDetailCol(detailCols.holdUntilApproved,"item") +'</div></div>' +
				'<div class="middle-cell -u-2-24"><div class="grid-cell">'+ generateDetailCol(detailCols.enforceBalances,"item") +'</div></div>' +
				'<div class="middle-cell -u-2-24"><div class="grid-cell">'+ generateDetailCol(detailCols.requireNotes,"item") +'</div></div>' +
				'<div title="{{ item.institutionObj.value }}" class="right-border-cell -u-7-24"><div class="grid-cell">{{ item.institutionObj.value }}</div></div>' +
				'</div>' +
				'<div ng-if="row.id > 0 && row.canAdd" ng-click="parent.route.go.addAbsenceReasonToBucket(row)"><span class="add-link">' +
				'<i class="fa fa-plus"></i>' +
				'<span>'+ strings['referenceData.absenceReason.AddAbsenceReasonToBucket'] +'</span> ' +
				'</span>' +
				'</div>'+
				'</div>';

		let publicCol = {
			key: detailCols.isPublic , width: '2/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.PublicToEmployee',
			template: generateDetailCol(detailCols.isPublic)
		};

		let needApprovalCol = {
			key: detailCols.needApproval , width: '2/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.NeedsApproval',
			template: generateDetailCol(detailCols.needApproval)
		};

		let holdUntilApprovedCol = {
			key: detailCols.holdUntilApproved , width: '2/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.HoldUntilApproved',
			template: generateDetailCol(detailCols.holdUntilApproved)
		};

		let enforceBalancesCol = {
			key: detailCols.enforceBalances , width: '2/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.EnforceBalances',
			template: generateDetailCol(detailCols.enforceBalances)
		};

		let requireNotesCol = {
			key: detailCols.requireNotes , width: '2/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.RequireNotesToAdmin',
			template: generateDetailCol(detailCols.requireNotes)
		};

		let institutionCol = {
			key: 'school', width: '7/24',
	    sortable: false,
			name: 'AbsenceReason.Column.Text.School',
			template: '<div title="{{ row.institutionObj.value }}" ng-if="!row.isBucket">{{ row.institutionObj.value }}</div>'
		};


		function generateDetailCol(type,dataStr = 'row') {
			var row = dataStr + '.settings.' + type;
			var template = '<div class="detail-cell" ng-if="'+ row +'!== null"><i class="fa" ng-class="{\'fa-check\': '+ row +', \'fa-times\': !'+ row +'}"></i></div>';
			return template;
		}


		var tmplConfig ={
			nameCol: function(){ return angular.copy(nameCol); },
			publicCol: function(){ return angular.copy(publicCol); },
			needApprovalCol: function(){ return angular.copy(needApprovalCol); },
			holdUntilApprovedCol: function(){ return angular.copy(holdUntilApprovedCol); },
			enforceBalancesCol: function(){ return angular.copy(enforceBalancesCol); },
			requireNotesCol: function(){ return angular.copy(requireNotesCol); },
			institutionCol: function(){ return angular.copy(institutionCol); },
			footerTemplate:  function(){ return angular.copy(footerTemplate); }
		};


		function alreadyInProcessOfAddingNew() {
			return $state.is('base.refDataabsenceReason.new') || $state.is('base.refDataabsenceReason.newBucket');
		}

		function processItem (reason, isChild = false) {
			var institution = institutionSvc.oneById(reason.institutionId);
			var obj = {};
			obj.id = reason.id;
			obj.isSelected = false;
			if(!isChild){
				obj.canAdd = canAdd;
				obj.isExpanded = false;
				obj.isBucket = reason.isBucket;
				if(obj.isBucket){
					obj.children = [];
					reason.children.forEach(x => obj.children.push(processItem(x, true)));
				}
			}
			obj.name = reason.description;
			obj.externalIdOne = reason.externalId;
			obj.externalIdTwo = reason.externalId2;
			obj.phoneMenu = reason.menuNumber;
			obj.showInstitution = (reason.parentId === null);
			obj.dataAnalysisCategory = reason.dataAnalysisCategory;
			obj.institution = [ reason.institutionId ];
			obj.institutionObj = { value: institution.name  };
			obj.workerTypes = reason.workerTypes.map(x => x.id);
			obj.lastUpdate = reason.lastUpdate;
			obj.parentId = (reason.parent) ? reason.parent.id : null;
			obj.settings = {
				isPublic: obj.isBucket ? null : reason.isPublic,
				needApproval: obj.isBucket ? null : reason.needsApproval,
				holdUntilApproved: obj.isBucket ? null : reason.holdUntilApproved,
				enforceBalances: reason.enforceEntitlementBalances,
				requireNotes: obj.isBucket ? null : reason.notesToAdminRequired
			};
			obj.languageTexts = reason.languageTexts;
			obj.timeUsage = {
				minimumUsage: {
					allowed: reason.useMinUsageMinutes,
					value: convertMinutesToDecimal(reason.minUsageMinutes)
				},
				minimumBalance:{
					allowed: reason.useMinBalanceMinutes,
					value: convertMinutesToDecimal(reason.minBalanceMinutes)
				},
				maxYearlyUsage:{
					allowed: reason.useMaxUsagePerYearMinutes,
					value: convertMinutesToDecimal(reason.maxUsagePerYearMinutes)
				}
			};
			return obj;
		}

		function convertMinutesToDecimal (value) {
			if(valueIsNullOrEmpty(value)) { return ''; }
			return +(value / 60).toFixed(2);
		}
		// function convertMinutesToHours (value) {
		// 	if(valueIsNullOrEmpty(value)) { return ''; }
		// 	var hours = Math.trunc(value/60);
		// 	var minutes = pad2(value % 60);
		// 	return `${hours}:${minutes}`;
		// }

		// function convertHoursToMinutes (value) {
		// 	if(valueIsNullOrEmpty(value)) { return ''; }
		// 	var time = Date.parse(value);
		// 	if(angular.isDate(time)){
		// 		return (time.getHours() * 60) + time.getMinutes();
		// 	}
		// }

		function convertDecimalToMinutes (value) {
			if(valueIsNullOrEmpty(value)) { return ''; }
			return value * 60;
		}

		function valueIsNullOrEmpty (value) {
			return (value === null || value.length === 0);
		}


		// function pad2(number) {
  //    		return (number < 10 ? '0' : '') + number
		// }
		function absenceReasons () {
			return referenceDataVal.list;
		}
		function setItem (item) {
			referenceDataVal.item = item;
		}
		function getDataAnalysisCategory () {
			return dataAnalysisCategorySvc.getDataAnalysisCategory('entitlementType');
		}
		function getWorkerTypes() {
			return workerTypeApi.getForReferenceData();
		}
		function setupNewAbsenceReason (isBucket, addChild) {
			var newObj = blankObj(isBucket);
			//If there is no item set to the VAL, it can be Simple absence reason or Bucket
			// Or Check  comes into play when user is viewing the existing bucket
			// and click add new simple absence  reason or bucket
			//	--in that case VAL item is not null and item id indicates its existing
			// 	-- we will push newObj in list and set VAL item to new value
			if(referenceDataVal.item == null || referenceDataVal.item.id > 0) {
				referenceDataVal.list.unshift(newObj);
				setItem(newObj);
			}else{
				referenceDataVal.item.isExpanded = addChild;
				if(addChild){
					newObj.id = newObj.id + (-0.1);
					newObj.parentId = referenceDataVal.item.id;
					referenceDataVal.item.children.push(newObj);
				}else{
					referenceDataVal.item.isSelected = true;
				}
			}
		}

		function goBack (item) {
			if(isNewBucket(item)){
				$state.go('base.refDataabsenceReason');
			}else if(isChildOfNewBucket(item)){
				$state.go('base.refDataabsenceReason.newBucket', { addChild: false });
			}else{
			 	$state.go('base.refDataabsenceReason');
			}
		}

		function isNewBucket(item) {
			return item.id <=0 && item.isBucket;
		}

		function isChildOfNewBucket(item) {
			//POST Save new simple absence reason
			if(!item.isBucket && referenceDataVal.item == null){
				return false;
			}
			else if(item.isBucket || referenceDataVal.item.children == null){
				return false;
			}else{
				return referenceDataVal.item.children.indexOf(item) >=0;
			}
		}

		function clearSelection () {
			referenceDataVal.list.forEach(function (itm){
				itm.isSelected = false;
				if(itm.isBucket){
					itm.children.forEach(x=> x.isSelected = false);
				}
			});
		}

		function removeReasonFromList (item, deleting = false) {
			if(item == null) { return; }
			if(item.id > 0 && !deleting) { return; }
			var index = referenceDataVal.list.indexOf(item);
			if(index >= 0){ // Item trying to remove on the parent list
				referenceDataVal.list.splice(index,1);
				resetValItem();
			}else{ // Item trying to remove in the child
				var parentItem = referenceDataVal.list.filter(x => x.id === referenceDataVal.item.id);
				// If child already exists, it is set as the current item, so we need to look for the parent.
				if(parentItem.length === 0) {
					parentItem = referenceDataVal.list.filter(x => x.id === referenceDataVal.item.parentId);
				}
				var childIndex = parentItem[0].children.indexOf(item);
				parentItem[0].children.splice(childIndex,1);
				if(item.id <= 0 && item.parentId > 0){ // When Item is new but bucket is existing
					resetValItem();
				}else{
					referenceDataVal.item = parentItem[0];

				}
			}
		}


		function replaceExistingItemWithUpdatedCopy(item) {
			var existingItem = referenceDataVal.list.filter(x => x.id === item.id);
			if(existingItem.length > 0){
				var index = referenceDataVal.list.indexOf(existingItem[0]);
				referenceDataVal.list.splice(index, 1, item);
			}else{
				var bucketItem = referenceDataVal.list.filter(x => x.id === item.parentId)[0];
				var childItem = bucketItem.children.filter(x => x.id === item.id);
				// Item trying to add as child is new and got back form server with id  but there is a  child with id less than zero
				if(childItem.length === 0) {
					childItem = bucketItem.children.filter(x => x.id <= 0);
				}
				var childIndex = bucketItem.children.indexOf(childItem[0]);
				bucketItem.children.splice(childIndex, 1, item);
			}
		}


		function save (itm) {
			var _deferSave = $q.defer();
			var item = flattenObj(itm);
			var method = (item.id > 0) ? 'put': 'post';
			entitlementTypeApi[method]({id : item.id }, item).then(function (data){

				//sometimes there are messages when saved successfully. Show those.
				data.$messages.map(x => toastHelp.info(x, '', toastHelp.configOverrides.mediumTimeOut));

				if(itm.id <= 0 && itm.parentId === null){
					referenceDataVal.list.unshift(processItem(data));
					removeReasonFromList(itm);
					goBack(itm);
					toastHelp.success(strings['referenceData.absenceReason.AbsenceReasonCreated'],strings['Success']);
				}else{
					var processedData = processItem(data);
					processedData.isSelected = true;
					replaceExistingItemWithUpdatedCopy(processedData);
					//If user is editing an existing absence
					//After successful save we reset the Val Item with new processed data
					// and Create a new copy of Item
					if(itm.id > 0){
						setItem(processedData);
						copyHandlerInstance.setCopy(referenceDataVal.item);
					}else{
						//Else if creating new reason in bucket
						//reset the Val because on the detail view we want to skip any computation on state change
						//and redirect user to a route of newly created absence reason.
						resetValItem();
						goBack(itm);
					}
					toastHelp.success(strings['referenceData.absenceReason.AbsenceReasonSaved'],strings['Success']);
				}
				_deferSave.resolve();
			}, function (error){
				if(error.$status === 409){
					toastHelp.warn(error.$messages.map(x => x.replace('{0}', strings['AbsenceReason'])), 'Warning');
					var processedData = processItem(error);
					processedData.isSelected = true;
					replaceExistingItemWithUpdatedCopy(processedData);
					setItem(processedData);
					copyHandlerInstance.setCopy(referenceDataVal.item);
				}else{
					toastHelp.error(error.$messages, strings['Error']);
				}
				_deferSave.reject(error);
			});
			return _deferSave.promise;
		}

		function deleteItem (itm) {
			var _deferDelete = $q.defer();
			var item = flattenObj(itm);
			entitlementTypeApi['delete']({id: item.id}).then(function (data){
				toastHelp.success(strings['referenceData.absenceReason.AbsenceReasonDeleted'], strings['Success'], false);
				_deferDelete.resolve();
			}, function(error){
				toastHelp.error(error.$messages, strings['Error']);
				_deferDelete.reject(error);
			});

			return _deferDelete.promise;
		}

		function flattenObj (itm) {

			return {
				id: (itm.id > 0) ? itm.id : 0,
				name: itm.name,
				description: itm.name,
				parent: (itm.parentId) ? { id: itm.parentId }: null,
				isBucket: itm.isBucket,
				externalId: itm.externalIdOne,
				externalId2: itm.externalIdTwo,
				institutionId: (itm.institution) ? itm.institution[0] :  null,
				children: (itm.id <= 0 && itm.children) ? [flattenObj(itm.children[0])] : [],
				menuNumber: itm.phoneMenu,
				isPublic: itm.settings.isPublic,
				notesToAdminRequired: itm.settings.requireNotes,
				holdUntilApproved: itm.settings.holdUntilApproved,
				enforceEntitlementBalances: itm.settings.enforceBalances,
				needsApproval: itm.settings.needApproval,
				workerTypes: (itm.workerTypes.length > 0) ? itm.workerTypes.map(function(x) { return { id: x }; }) : [],
				useMinUsageMinutes: itm.timeUsage.minimumUsage.allowed,
				minUsageMinutes: Math.round(convertDecimalToMinutes(itm.timeUsage.minimumUsage.value)),
				useMaxUsagePerYearMinutes: itm.timeUsage.maxYearlyUsage.allowed,
				maxUsagePerYearMinutes: convertDecimalToMinutes(itm.timeUsage.maxYearlyUsage.value),
				useMinBalanceMinutes: itm.timeUsage.minimumBalance.allowed,
				minBalanceMinutes: convertDecimalToMinutes(itm.timeUsage.minimumBalance.value),
				lastUpdate: itm.lastUpdate,
				dataAnalysisCategory: (itm.dataAnalysisCategory) ? { id: itm.dataAnalysisCategory.id } : null,
				languageTexts: itm.languageTexts
			};
		}



		function getById (id) {
			return entitlementTypeApi.get({id:id});
		}

		function resetValItem() {
			delete referenceDataVal.item;
		}

		function showWarningForUnsaveChanges () {
			var header = strings['Dialog.Title.UnsavedChangesConfirmation'];
			var message = strings['referenceData.absenceReason.YouHaveUnsaveChanges'];
			var buttons = [{
				title: strings['referenceData.absenceReason.ContinueWithoutSaving'],
	            cls: 'fl-button fl-negative',
	            returnObj: { redirect: true }
			},{
				title: strings['Cancel'],
	            cls: 'fl-button',
	            returnObj: { redirect: false }
			}];
			return showDialog(header, message, buttons);
		}

		function showWarningForChild() {
			var header = strings['referenceData.absenceReason.CreateNewAbsenceReason'];
			var message = strings['referenceData.absenceReason.CreateNewAbsenceReasonDescription'];
			var buttons = [{
				title: strings['referenceData.absenceReason.CreateNewAbsenceReason'],
	            cls: 'fl-button fl-primary'
			},{
				title: strings['Cancel'],
	            cls: 'fl-button'
			}];
			return showDialog(header, message, buttons);
		}

		function showWarningPriorToDelete(isBucket = false) {
			var bucketWarning = strings['Delete.BucketWarning'];
			var standardWarning = strings['Delete.Warning'];
			var header = strings['Delete.Question'];
			var message = isBucket ? bucketWarning + standardWarning : standardWarning;
			var buttons = [{
				title: strings['Delete.Yes'],
	            cls: 'fl-button fl-negative'
			},{
				title: strings['Delete.No'],
	            cls: 'fl-button'
			}];
			return showDialog(header, message, buttons);
		}


		function showDialog(header,message, buttons) {
			var dialogPromise = $q.defer();
			let dialog = ngDialog;
			dialog.open({
	            template: '/global/modals/alert-html.html',
	            closeByDocument: false,
	            closeByNavigation: true,
	            showClose: false,
	            data: {
	                header: header,
	                body: message,
	                buttons: getButtons(dialogPromise, dialog, buttons)
	            }
	        });
			return dialogPromise.promise;
		}

		function getButtons(promise, dialog, buttons) {
			return buttons.map(function(x) {
				return {
					title: x.title,
					cls: 'fl-button ' + x.cls,
					icon: '', loading: false,
					action: function() {
						ngDialog.close(dialog.id);
						promise[(x.cls.indexOf('fl-primary') >=0 || x.cls.indexOf('fl-negative') >=0) ? 'resolve' : 'reject'](x.returnObj);
					}
				};
			});
		}

		function openLanguageDefinitionsModal(languageTexts, canEdit) {
			var languageTextMaxLength = 500;

			var deferred = $q.defer();
			var dialog = ngDialog.open({
				template: '/components/reference-data/absence-reasons/templates/language-definitions-modal.html',
				closeByDocument: false,
	            closeByNavigation: false,
				showClose: false,
				data: {
					header: canEdit ? strings['Referencedata.AbsenceReason.Text.EditLanguageDefinitions']
									: strings['Referencedata.AbsenceReason.Text.ViewLanguageDefinitions'],
					canEdit: canEdit,
					languageTexts: languageTexts,
					languageTextMaxLength: languageTextMaxLength,
					strings: strings,
					buttons: [{
						visible: canEdit,
						disableWhenFormInvalid: true,
						title:  strings['Done'],
						cls:'fl-button fl-primary',
						action: function(languageForm) {
							if (languageForm.$invalid) {
								return;
							}
							deferred.resolve();
							ngDialog.close(dialog.id);
						}
					},
					{
						visible: true,
						disableWhenFormInvalid: false,
						title: (canEdit ? strings['Cancel'] : strings['Close']),
						cls:'fl-button',
						action: function() {
							deferred.reject();
							ngDialog.close(dialog.id);
						}
					}]
				}
			});
			return deferred.promise;
		}


		function newObjectIsInProcess(item) {
			if(item.id > 0){
				return false;
			}
			if(isChildOfNewBucket(item)){
				return true;
			}
			return item.name.length > 0;
		}

		$q.all(institutionSvc.ready, getWorkerTypes()).then(function () { //need worker types populated before entitlement type is retrieved
			if(angular.isUndefined(referenceDataVal.list)){
				entitlementTypeApi.queryReference({groupByBucket: true}).then(function(data){
					referenceDataVal.list = data.map(x => processItem(x)).sort(arrayHelp.sort('name'));
					_defer.resolve(referenceDataVal.list);
				},function(error){
					_defer.reject(error);
				});
			}else{
				_defer.resolve(referenceDataVal.list);
			}
		});

		return {
			ready: _defer.promise,
			setItem,
			absenceReasons,
			tmplConfig,
			getDataAnalysisCategory,
			getWorkerTypes,
			setupNewAbsenceReason,
			goBack,
			clearSelection,
			removeReasonFromList,
			save,
			deleteItem,
			getById,
			processItem,
			blankObj,
			resetValItem,
			isChildOfNewBucket,
			showWarningForUnsaveChanges,
			showWarningForChild,
			showWarningPriorToDelete,
			openLanguageDefinitionsModal,
			newObjectIsInProcess,
			copyHandler: copyHandlerInstance,
			languageDefinitionsCopy: languageDefinitionsCopyHandlerInstance,
			replaceExistingItemWithUpdatedCopy,
			alreadyInProcessOfAddingNew
		};

	});
	// #--- END Service (referenceDataAbsenceReasonSvc) ---# //
	// #---------------------------------------------------# //

}());
