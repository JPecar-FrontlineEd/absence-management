(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Service (subAbsenceSvc) -----# //
	app.factory('subAbsenceSvc', function ($q, ssAsync, arrayHelp, institutionSvc,stringSvc,
											cancellationReasonApi,substituteAbsenceVal,
											substituteAbsencesApi,institutionApi,
											permissionSvc, orgSvc, timeFilter, toastHelp, ngDialog) {

		let blankSubAbsVal = {
			id: 0, absrId: 0, date: (new Date()).toString('MM/dd/yyyy'), shiftType: 4, substituteCancellationReason: null,
			institution: null, entitlementType: null, substitute: null, accountingCode: null,
			startTime: null, endTime: null, customAccountingCode:'',
			lastUpdated: new Date(), created: new Date(),
			lastFetch: new Date(), editMode: true, isLocked: false
		};

		var strings = stringSvc.getStrings([
			'Confirm',
			'Delete',
			'Cancel',
			'Absence.Modify.Text.ConfirmDelete',
			'Absence',
			'Deleted',
			'Success',
			'Warning',
			'Popup.Text.Button.SaveAndContinue'
		]);


		function getLinkedEntitlementTypes (cancellationReasons) {
			return cancellationReasons.filter((x) => { return x.entitlementType !== null; }).map(x => x.entitlementType);
		}

		function getAllPossibleInstAndChildrenIds (instIds) {
			var institutionIds = [];
			instIds.forEach(function (instId){
				var ids = institutionSvc.getInstAndChildrenIds(instId);
				institutionIds = institutionIds.concat(ids);
			});
			return institutionIds;
		}

		function getCancellationReasons() {
			return cancellationReasonApi.queryCached({});
		}



		function institutionList (cancellationReasons) {
			let institutions = [];
			var possibleInstIds = [];
			//Getting list of Entitlement Types that are linked with the cancellation reason
			var entitlementTypes = getLinkedEntitlementTypes(cancellationReasons);

			//if There are no EntitlementTypes linked than user cannot modify or create sub absence
			if(entitlementTypes.length === 0){
				return institutions;
			}

			// Removing the possible duplications of instIds
			var institutionIdsOnEntitlementTypes = entitlementTypes.map(x => x.institutionId).filter(function (val,idx,self){
				return self.indexOf(val) === idx;
			});

			//Getting the lis of all inst ids and child institution ids
			possibleInstIds = getAllPossibleInstAndChildrenIds(institutionIdsOnEntitlementTypes);

			//if there is no ids than user cannot proceed to modify or create substitute absence
			if(possibleInstIds.length === 0){
				return institutions;
			}

			// Removing the possible duplications of Ids from the List
			possibleInstIds = possibleInstIds.filter(function (val,idx,self){
				return self.indexOf(val) === idx;
			});


			//Creating the list of Institutions that are in user visibility
			possibleInstIds.forEach(function (instId){
				var institute = institutionSvc.oneById(instId);
				if(institute.isAvailable){
					institutions.push(institute);
				}
			});

			//No institution associated with entitlement type is under user visibility
			if(institutions.length === 0){
				return institutions;
			}

			return institutions;
		}


		function resetState(val) {
			Object.keys(substituteAbsenceVal).forEach(function (key) {
				delete substituteAbsenceVal[key];
			});
			var value = (val) ? val: blankSubAbsVal;
			Object.keys(value).forEach(function (key) {
				substituteAbsenceVal[key] = angular.copy(value[key]);
			});
		}

		function setupState (id, editMode) {
			var _defer = $q.defer();
			editMode = (editMode != null) ? editMode : substituteAbsenceVal.editMode || false;
			var getAbs;
			getAbs = substituteAbsencesApi.get({id: id});
			getAbs.then(function(subAbs){
				if(editMode){
					lock(id).then(function(){
						resetState(subAbs);
						setupAdditionalProps(editMode,subAbs);
						_defer.resolve(subAbs);
					}, function(errors){
						_defer.reject({ errors: errors.$messages, lockFailed: true });
					});
				}else{
					findLock(id).then(function(locker){
						resetState(subAbs);
						setupAdditionalProps(editMode, subAbs, locker.isLocked);
						_defer.resolve(subAbs);
					},function(errors){
						_defer.reject({ errors: errors.$messages, lockFailed: false });
					});
				}
			}, function(error){
				_defer.reject({ errors: error.$messages, lockFailed: false });
				return $q.reject(error.$messages);
			});
			return _defer.promise;
		}


		function setupAdditionalProps (editMode,subAbs, isLocked = false) {
			substituteAbsenceVal.isLocked = isLocked;
			substituteAbsenceVal.lastFetch = (new Date()).getTime();
			substituteAbsenceVal.editMode = editMode && permissionSvc.iHave('SUBABS.EDIT');
			if(subAbs.accountingCode !== null && subAbs.accountingCode.isFreeForm){
				substituteAbsenceVal.accountingCode = { id: 0, value: 'Custom'};
				substituteAbsenceVal.customAccountingCode = subAbs.accountingCode.name;
			}
		}


		function getEntitlementTypes (instId, cancellationReasons) {
			return institutionApi.entitlementTypes({instId : instId}).then(function (entitlementTypes){
				var linkedEntitlementTypes = getLinkedEntitlementTypes(cancellationReasons);
				var intersectingEntitlementTypes = arrayHelp.intersectionByField(entitlementTypes, linkedEntitlementTypes, 'id');
				return arrayHelp.distinctObjectList(intersectingEntitlementTypes,'id');
			});
		}

		function save(stateVal, overrideParams) {
			if(stateVal.substitute == null) {
				return $q.reject();
			}
			var saveAction = stateVal.id > 0 ? 'update' : 'create',
				params = {
					id: stateVal.id > 0 ? stateVal.id : null
				};
			if(overrideParams) {
				overrideParams.forEach(x => params[x] = true);
			}
			var savePromise = substituteAbsencesApi[saveAction](params, stateValToApiModel(stateVal));
			return savePromise;
		}

		function stateValToApiModel (stateVal) {
			var apiModel = stateVal;
			if (stateVal.accountingCode && stateVal.accountingCode.id === 0) {
				apiModel.accountingCode.name = stateVal.customAccountingCode;
				apiModel.accountingCode.isFreeForm = true;
			}

			return apiModel;
		}



		function showDeleteDialog () {
			var _defer = $q.defer();
			var dialog = ngDialog.open({
				template:'/global/modals/alert-html.html',
				closeByDocument: false,
				closeByNavigation:true,
				showClose :false,
				data: {
					header: strings['Confirm'],
					body: strings['Absence.Modify.Text.ConfirmDelete'] + substituteAbsenceVal.id + '?',
					buttons: [{
						title: strings['Delete'],
						cls:'fl-button fl-negative',
						icon: '',
						loading: false,
						action:  function(){
							var button = this;
							button.loading = true;
							var subAbsenceId = substituteAbsenceVal.id;
							substituteAbsencesApi.delete({id: subAbsenceId }).then(function(){
								var successMessage = strings['Absence'] + ' #' + subAbsenceId + ' ' + strings['Deleted'];
								toastHelp.info([successMessage], strings['Success']);
								button.loading = false;
								ngDialog.close(dialog.id);
								_defer.resolve();
							}, function(error){
								button.loading = false;
								_defer.reject(error);
							});
						}
					},{
						title: strings['Cancel'],
						cls:'fl-button',
						icon:'',
						loading: false,
						action: function(){
							ngDialog.close(dialog.id);
						}
					}]
				}
			});
			return _defer.promise;
		}


		function showWarningDialog(payload) {
			var messages = payload.$messages.map(x => x.message)
							.reduce(function (prev, val) { return prev + '<div class="message">' + val + '</div>'; }, '');
			var params = payload.$messages.map(x => x.sendOverrideParameter);

			var _defer = $q.defer();
			var dialog = ngDialog.open({
				template:'/global/modals/absr-warning.html',
				closeByDocument: false,
				closeByNavigation: false,
				showClose: false,
				data: {
					header: strings['Warning'],
					warning:{ message: messages },
					buttons: [{
						title: strings['Popup.Text.Button.SaveAndContinue'],
						cls:'fl-button fl-positive',
						icon: '',
						loading: false,
						action:  function(){
							var button = this;
							button.loading = true;
							save(substituteAbsenceVal, params).then(function(data){
								button.loading = false;
								ngDialog.close(dialog.id);
								_defer.resolve(data);
							}, function(error){
								button.loading = false;
								_defer.reject(error);
							});
						}
					},{
						title: strings['Cancel'],
						cls:'fl-button',
						icon:'',
						loading: false,
						action: function(){
							ngDialog.close(dialog.id);
							_defer.reject();
						}
					}]
				}
			});
			return _defer.promise;
		}


		function unlockSubstituteAbsence(id) {
			return substituteAbsencesApi.unlock({id: id});
		}

		function lock (id) {
			return substituteAbsencesApi.lock({id: id});
		}

		function findLock (id) {
			return substituteAbsencesApi.findLock({id: id});
		}

		function forceUnlock (id) {
			return substituteAbsencesApi.unlock({id: id,forceUnlock: true });
		}

		function pastAbsenceDate () {
			const canEditPast = permissionSvc.iHave('SUBABS.EDITPAST');
			const isNew = substituteAbsenceVal.id === 0;

			if(canEditPast){
				if(isNew){
					return new Date().addYears(-1);
				}else{
					return Date.parse(substituteAbsenceVal.date).addYears(-1);
				}
			}else{
				return Date.parse(orgSvc.getOrgData()[0].settings.PastAbsenceDateTime);
			}
		}

		function cancellationReasons () {
			return cancellationReasonApi.queryCached({});
		}

		function anyInstituteAvailable () {
			var _defer = $q.defer();
			cancellationReasons().then(function(allCancellationreasons){
				var institutions = institutionList(allCancellationreasons);
				if(institutions.length > 0){ _defer.resolve(); }
				else{ _defer.reject(); }
			}, function(){
				_defer.reject();
			});
			return _defer.promise;
		}




		return {
			showWarningDialog,
			resetState: resetState,
			setupState: setupState,
			institutionList: institutionList,
			getEntitlementTypes: getEntitlementTypes,
			save: save,
			unlock: unlockSubstituteAbsence,
			showDeleteDialog:showDeleteDialog,
			forceUnlock:forceUnlock,
			pastAbsenceDate:pastAbsenceDate,
			cancellationReasons:cancellationReasons,
			anyInstituteAvailable:anyInstituteAvailable

		};

	});
	// #--- END Service (subAbsenceSvc) ---# //
	// #-----------------------------------# //

}());
