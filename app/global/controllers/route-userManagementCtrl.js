(function() {'use strict';angular.module('aesop')
.controller('UserAccessCtrl', function (userAccessApi, $q, $scope,$timeout, arrayHelp, $window,
																				$location, stringSvc, stringHelp,dateHelp,
																				permissionSvc, userAccessSvc, ngDialog, featureSvc, config) {
// #----------------------------------# //
// #------- UserAccessCtrl -------# //

	// this is a route controller
	var route = this;

	route.pageMode = userAccessSvc.pageMode;

	var perms = {
		canSendInvitation: permissionSvc.iHave('SECURITY.AccessStatusOrg'),
		canRevokeAccess: permissionSvc.iHave('SECURITY.AccessStatusOrg'),
    	canEditWorker: permissionSvc.iHave('EMP.EmpEditGeneral'),
    	canEditSub: permissionSvc.iHave('SUB.SubEditGeneral'),
    	canEditOrgUser: permissionSvc.iHave('SECURITY.SecOrguserEdit'),
    	canEditCampusUser: permissionSvc.iHave('SECURITY.SecCampusUserEdit'),
	};

	var queryString = $location.search();

	route.strings = stringSvc.getStrings([
		'NoRecordsFound',
		'Title',
		'Email',
		'Edit',
		'Cancel',
		'UserAccess.Username',
		'UserAccess.Credentials',
		'UserAccess.AccountStatus',
		'UserAccess.FindUser',
		'UserAccess.Users',
		'UserAccess.Heading',
		'UserAccess.User',
		'UserAccess.Users',
		'UserAccess.SendingInvitations',
		'UserAccess.InvitationSentSuccessfully',
		'UserAccess.ErrorSendingInvitations',
		'UserAccess.SendingInvitationToXNumberOfPeople',
		'UserAccess.SendingInvitationToXOutOfY',
		'UserAccess.SendInvitationToXNumberOfPeople',
		'UserAccess.Text.Invitation',
		'UserAccess.Text.Continue'
	]);

	// View Model properties
	route.vm = {
		perms: perms,
		columns: [
			{	key: 'selection', width: '1/24',
        sortable: false,
				name: '',
				headerTemplate: '<input type="checkbox" ng-model="parent.route.vm.allselected" ng-click="parent.route.go.checkAll()">',
        template: '<input type="checkbox" ng-disabled="row.$disabled" ng-model="row.$selected" ng-click="parent.route.go.checkOne(row)">'
			},
			{	key: 'user', width: '6/24',
        sortable: false,
				name: 'UserAccess.User',
        template: '<cmpt-user-access-user user="row"></cmpt-user-access-user>'
			}, {
				key: 'title', width: '5/24',
        sortable: false,
				name: 'Title',
				template: '<div once-text="row.title"></div>'
			}, {
				key: 'accountStatus', width: '8/24',
        sortable: false,
				name: 'UserAccess.AccountStatus',
				template: '<cmpt-user-access-access-status row="row"></cmpt-user-access-access-status>'
			}, {
				key: 'credentials', width: '4/24',
        sortable: false,
				name: 'UserAccess.Credentials',
				template: '<cmpt-user-access-user-access-credentials user="row"></cmpt-user-access-user-access-credentials>'
			}
		],
		selected: [],
    pageTabs: userAccessSvc.pageTabs,
		isLoading: false,
		isPaging: false,
		paginatedData: {
			dataset: [],
			totalRecordCount: 0,
			pageNumber: 0,
			pageSize: 200,
			pageCount: 0,
			toString: function() {
				var pd = route.vm.paginatedData;
				var result =
					'PageCount: ' + pd.pageCount +
					' PageSize: ' + pd.pageSize +
					' PageNumber: ' + pd.pageNumber +
					' TotalRecs: ' + pd.totalRecordCount;
				return result;
			}
		},
		currentMode: route.pageMode.allUsers,
		currentSearchString: '',
		fieldValue: 'route.vm.currentSearchString',
		showSelected: false,
		allselected: false,
		forceToShowActionBar: false,
		showSaapBanner: featureSvc.get('SharedAppAccess').enabled
	};

	function usersWhoCanBeInvited(){
		return route.vm.selected.filter(x => x.perms.canSendInvitation &&
																							!x.status.accessGranted &&
																							!x.status.invitationDate &&
																							 x.email);
	}

	function usersWhoAreActive(){
		return route.vm.selected.filter(x => x.status.accessGranted && x.isActive);
	}

	function userWhoAreInactive(){
		return route.vm.selected.filter(x => x.status.accessGranted && !x.isActive);
	}

	function clearAllSelections(){
		route.vm.selected = [];
		route.vm.paginatedData.dataset.forEach(x => x.$selected= false);
		route.vm.allselected = false;
		route.vm.showSelected = false;
		route.vm.forceToShowActionBar = false;
		route.vm.currentSearchString = '';
	}

	function bulkInvitationCall(data){
		data.message = route.strings['UserAccess.SendingInvitations'] + '...';
		data.isProcessing = true;
		//$timeout(function(){
		userAccessSvc.bulkInviteUsers(data.records).then(function(){
			data.message = 'We’ve successfully scheduled your request to send '+ data.records.length +' invitation(s).';
			data.records.forEach(function(x){ x.status.isProcessing = true; });
			clearAllSelections();
		}, function(){
			data.hasError = true;
			data.message = route.strings['UserAccess.ErrorSendingInvitations'];
		}).finally(function(){
			data.isProcessing = false;
			data.processed = true;
		});
		//},3000);
	}

	function bulkActivateCall(data){
		data.message = 'Activating...';
		data.isProcessing = true;
		//$timeout(function(){
		userAccessSvc.bulkActivateUsers(data.records).then(function(){
			data.message = 'We’ve successfully scheduled your request to activate '+ data.records.length + ' ' + (data.records.length === 1 ? 'person.' : 'people.');
			data.records.forEach(function(x){ x.status.isProcessing = true; });
			clearAllSelections();
		}, function(){
			data.hasError = true;
			data.message = route.strings['UserAccess.ErrorSendingInvitations'];
		}).finally(function(){
			data.isProcessing = false;
			data.processed = true;
		});
		//},3000);
	}

	function bulkInactivateCall(data){
		data.message = 'Inactivating...';
		data.isProcessing = true;
		//$timeout(function(){
		userAccessSvc.bulkInactivateUsers(data.records).then(function(){
			data.message = 'We’ve successfully scheduled your request to inactivate '+ data.records.length + ' ' + (data.records.length === 1 ? 'person.' : 'people.');
			data.records.forEach(function(x){ x.status.isProcessing = true; });
			clearAllSelections();
		}, function(){
			data.hasError = true;
			data.message = route.strings['UserAccess.ErrorSendingInvitations'];
		}).finally(function(){
			data.isProcessing = false;
			data.processed = true;
		});
		//},3000);
	}

	function triggerBulkActionModal(data){
		var count = data.records.length;
		var dialog = ngDialog.open({
				template: '/components/user-access/bulk-actions/bulk-action-modal.html',
				closeByDocument: false,
				showClose: false,
				closeByEscape: false,
				closeByNavigation: true,
				data: {
						header: data.modalHeader,
						data:data,
						buttons: [{
								title: data.bulkCallButton.title,
								cls: 'fl-button fl-primary pre-process ' + ((count > 0) ? '' : 'ng-hide'),
								action: function action(obj) {
										data.bulkCallButton.action(data);
								}
						},{
							title: route.strings['Cancel'],
							cls: 'fl-button pre-process',
							action: function action(obj) {
									ngDialog.close(dialog.id);
							}
						},{
							title: route.strings['UserAccess.Text.Continue'],
							cls: 'fl-button post-process',
							action: function action(obj) {
									ngDialog.close(dialog.id);
							}
						}]
				}
		});
	}

	function evaluateSelectAllCheckbox(){
		route.vm.allselected = route.vm.paginatedData.dataset.every(function (v) { return v.$selected === true || v.$disabled === true; });
	}

	function checkAll(){
		var dataHolder = [];
		route.vm.paginatedData.dataset.forEach(function (row) {
			if (row.$disabled) { return; }
			row.$selected = route.vm.allselected;
		});

		if(route.vm.allselected){
			//Concatenating the existing selection with the new selection and making sure there is no DUPS
			dataHolder =  arrayHelp.distinctObjectList(route.vm.selected.concat(route.vm.paginatedData.dataset.filter(function (row) {
				return row.$disabled !== true;
			})), 'userKey');
		}else{
			//Only unselecting the row that are presented on the paginated data and keeping the rest of the selections
			dataHolder = route.vm.selected.filter(function(selRow){
				return route.vm.paginatedData.dataset.filter(function(x){	return x.userKey === selRow.userKey;}).length === 0;
			});
		}
		dataHolder.sort(arrayHelp.multiLevelSort(['lastName','firstName']));
		route.vm.selected = dataHolder;
		route.vm.forceToShowActionBar = route.vm.showSelected && route.vm.selected.length <= 1;
	}

    // Actions that can be bound to from the view
    route.go = {
			inactivateAccess: function(){
				var records = usersWhoAreActive();
				var count = records.length;
				var data = {
						records: records,
						message: '',
						isProcessing: false,
						processed: false,
						hasError: false,
						modalHeader: 'Inactivate',
						bulkCallButton:{
							title: 'Inactivate '+ count + ' ' + (count === 1 ? 'person' : 'people'),
							action: bulkInactivateCall
						}
					};
				if(count === 0){
					data.message = 'You cannot inactivate any of the people selected.';
				}else if(count === route.vm.selected.length) {
					data.message = 'You are inactivating '+ count +' people.';
				}else{
					data.message = 'You can only inactivate '+ count +' of the '+ route.vm.selected.length +' people selected.';
				}
				triggerBulkActionModal(data);
			},
			activateAccess: function(){
				var records = userWhoAreInactive();
				var count = records.length;
				var data = {
						records: records,
						message: '',
						isProcessing: false,
						processed: false,
						hasError: false,
						modalHeader: 'Activate',
						bulkCallButton:{
							title: 'Activate '+ count + ' ' + (count === 1 ? 'person' : 'people'),
							action: bulkActivateCall
						}
					};
					if(count === 0){
						data.message = 'You cannot activate any of the people selected.';
					}else if(count === route.vm.selected.length) {
						data.message = 'You are activating '+ count +' people.';
					}else{
						data.message = 'You can only activate '+ count +' of the '+ route.vm.selected.length +' people selected.';
					}
				triggerBulkActionModal(data);
			},
			sendInvitation: function(){
				var records =usersWhoCanBeInvited();
				var count = records.length;
				var data = {
						records: records,
						message: '',
						isProcessing: false,
						processed: false,
						hasError: false,
						modalHeader: route.strings['UserAccess.Text.Invitation'],
						bulkCallButton:{
							title: 'Send Invitation(s) to '+ count + ' ' + (count === 1 ? 'person.' : 'people.'),
							action: bulkInvitationCall
						}
					};
				if(count === 0){
					data.message = 'You cannot send an invitation to any of the people selected.';
				}else if(count === route.vm.selected.length) {
					data.message = route.strings['UserAccess.SendingInvitationToXNumberOfPeople'].replace('{0}',count) + '.';
				}else{
					data.message = route.strings['UserAccess.SendingInvitationToXOutOfY'].replace('{0}',count).replace('{1}',route.vm.selected.length);
				}

				triggerBulkActionModal(data);
			},
			showSelections: function(){
				if(route.vm.showSelected){
					/*If user is clicking to see selected we are clearing the search
					box becasue that search string if there will not  going to apply on the selected list.*/
					route.vm.currentSearchString = '';
					route.vm.paginatedData.dataset = route.vm.selected.sort(arrayHelp.multiLevelSort(['lastName','firstName']));
					evaluateSelectAllCheckbox();
				}else{
					this.search(route.vm.currentSearchString);
				}
			},
			clearAllSelections: function(){
				clearAllSelections();
				this.search('');
			},
			checkOne: function(row){
				if(row.$selected){
					route.vm.selected.push(row);
					route.vm.selected.sort(arrayHelp.multiLevelSort(['lastName','firstName']));
					evaluateSelectAllCheckbox();
				}else{
					route.vm.selected = route.vm.selected.filter(function (v) { return v !== row; });
					route.vm.allselected = false;
				}
				route.vm.forceToShowActionBar = route.vm.showSelected && route.vm.selected.length <= 1;
			},
			checkAll: checkAll,
      getMoreData: function () {
      	//build the params, keeping the prior search settings
      	var params = {
      		resetSearch: false,
      		missingEmailUsersOnly: (route.vm.currentMode === route.pageMode.noEmail),
      		searchString: route.vm.currentSearchString
      	};
      	apiRetrieveAndUpdatePaginatedData(params);
				route.vm.allselected = false;
      },
      search: function (searchString) {
      	var params = {
      		resetSearch: true,
      		missingEmailUsersOnly: (route.vm.currentMode === route.pageMode.noEmail),
      		searchString: searchString,
      	};
      	apiRetrieveAndUpdatePaginatedData(params).then(function(){
						evaluateSelectAllCheckbox();
						/*If user is searching we have to uncheck the showSelected checkbox becasue new result will
						not going to be the selected*/
						route.vm.showSelected = false;
				});

      },
      switchMode: function (mode) {
      	if (route.vm.currentMode === mode) { return; }
      	route.vm.currentSearchString = '';

          //build the params, ignore the prior search settings
          var params = {
              resetSearch: true,
              missingEmailUsersOnly: (mode === route.pageMode.noEmail),
          };
          route.vm.currentMode = mode;
          apiRetrieveAndUpdatePaginatedData(params).then(function(){
						clearAllSelections();
					});
      },
      getLastRowShown: function()
      {
      	var pd = route.vm.paginatedData;

      	if (!pd || pd.pageCount <= 0) { return 0; }
      	var result = (pd.pageNumber * pd.pageSize);
      	return (pd.totalRecordCount < result ? pd.totalRecordCount : result);
      },
      setLoading: function(isReset, onOrOff)
      {
      	if (isReset) { route.vm.isLoading = onOrOff; }
      	else { route.vm.isPaging = onOrOff; }
      },
      goToSaap: function(){
      	$window.location = config.SuperSuitDomain + 'absmgmt-useraccess/?oaap=' + config.navigatorBaseUrl + '/admin_UserAccess.asp'
      }
    };

    function init(scope) {
				var _defered = $q.defer();
    		var allUsersPromise;
        //load single user if we have one via the querystring.
        if (!!queryString.userKey) {
            route.vm.currentMode = route.pageMode.singleUser;
            getUser(queryString.userKey);

            //get the all users count, don't worry about setting the paginatedData since we're in single user mode.
            allUsersPromise = getUsers({pageSize:1});

        } else { //all users mode.
            //initial retrieve of paginatedData
            allUsersPromise = apiRetrieveAndUpdatePaginatedData();
        }

        allUsersPromise.then(function(data){
						//and set the total count
    				userAccessSvc.setUserCountForTab(route.pageMode.allUsers, data.totalRecordCount);
            userAccessSvc.setUserCountForTab(route.pageMode.activeUsers, data.activeUserCount);
            userAccessSvc.setUserCountForTab(route.pageMode.inactiveUsers, data.inactiveUserCount);
						_defered.resolve();
    		});

    		//get the no email count...
    		getUsers({pageSize:1, missingEmailUsersOnly:true}).then(function(data){
            userAccessSvc.setUserCountForTab(route.pageMode.noEmail, data.totalRecordCount);
    		});
				return _defered.promise;
    }

		init($scope); //immediately call

    function getCurrentActiveFlagFilterSetting() {
        var mode = route.vm.currentMode;
        var activeFlag;
        if (mode === route.pageMode.activeUsers) {
            activeFlag = 1;
        } else if (mode === route.pageMode.inactiveUsers) {
            activeFlag = 0;
        }
        return activeFlag;
    }

    function apiRetrieveAndUpdatePaginatedData(args) {
    	var deferred = $q.defer();

        if (!args) { args = { resetSearch: true }; }

        var loadingBool = (args.resetSearch ? route.vm.isLoading : route.vm.isPaging);
        if (loadingBool  === true) {
        	deferred.reject();
        }


        //clear what matters to prepare for a fresh retrieve.
        if (args.resetSearch === true) {
        	//route.vm.currentSearchString = '';
            route.vm.paginatedData.pageNumber = 0;
            route.vm.paginatedData.pageCount = 0;
        	route.vm.paginatedData.dataset = [];
        }

         //prevent too many api calls to retrieve more if we have exhausted the count
        var pageNumberToRetrieve = route.vm.paginatedData.pageNumber + 1;
        if (route.vm.paginatedData.pageCount > 0 && pageNumberToRetrieve > route.vm.paginatedData.pageCount) {
        	deferred.reject();
        }

        var retrieveParams = {
            pageNumber: pageNumberToRetrieve,
            pageSize: route.vm.paginatedData.pageSize,
            searchString: (args.searchString ? args.searchString : ''),
            missingEmailUsersOnly: (args.missingEmailUsersOnly ? true : false),
            activeFlag: getCurrentActiveFlagFilterSetting(),

            toString: function() {
            	var result =
            		'pageNumber: ' + this.pageNumber +
            		' pageSize: ' + this.pageSize +
            		' searchString: ' + this.searchString +
            		' missingEmailUsersOnly: ' + this.missingEmailUsersOnly +
                ' activeFlag: ' + this.activeFlag;
            	return result;
            }
        };
        //if (args.searchString) { retrieveParams.searchString = args.searchString; }
        //if (args.missingEmailUsersOnly === true) { retrieveParams.missingEmailUsersOnly = true; }

        route.go.setLoading(args.resetSearch, true);
        getUsers(retrieveParams).then(function success(data) {
        	mapApiResponse(data);
        	route.go.setLoading(args.resetSearch, false);
        	deferred.resolve(data);
        }, handleFailedApiResponse);
        return deferred.promise;
    }

    function getUser(userKey) {
    	route.vm.isLoading = true;
    	return userAccessApi.getUser({id : userKey}).then(function success(data) {
			route.vm.currentMode = route.pageMode.singleUser;

			//pretend like we only got one record and pass to our pre-existing api response mapper.
			var result = {
				totalRecordCount: 1,
				pageNumber: 1,
				paginatedData: [data]
			};
			mapApiResponse(result);
			route.vm.isLoading = false;
		}, handleFailedApiResponse);
    }

    function getUsers(params) {
    	return userAccessApi.getUsers(params);
    }

    function handleFailedApiResponse(response) {
    	route.vm.paginatedData.dataset = [];  //clear dataset so the grid shows no results
		route.vm.isLoading = false;
		route.vm.ispaging = false;
    }

    function mapApiResponse(data) {
    	var pd = route.vm.paginatedData;
        pd.totalRecordCount = data.totalRecordCount;
        pd.pageNumber = data.pageNumber;
        pd.pageSize = data.pageSize;
        pd.pageCount = data.pageCount;
        if (pd.pageNumber === 1) {
        	pd.dataset = mapRows(data.paginatedData);
        } else {
        	//paged retrieve, append.
        	Array.prototype.push.apply(pd.dataset, mapRows(data.paginatedData));
        }
    }

	function mapRows(data) {
		return data.map(function (row, i, a) {
			var name = [];
			if (row.lastName) { name.push(stringHelp.highlightText(route.vm.currentSearchString, row.lastName)); }
			if (row.firstName) { name.push(stringHelp.highlightText(route.vm.currentSearchString, row.firstName)); }

            if (!row.title) { row.title = row.userTypeDisplay; }
            row.isProcessing = false;

			var extendedRowInfo  = {
				combinedName: name.join(', '),
				perms: perms,
        hasPermissionToEdit: canEditUser(row.userTypeId, perms)
			};
			row.$selected = route.vm.selected.length && route.vm.selected.filter(x => x.userId === row.userId).length > 0;
			row.$disabled = !extendedRowInfo.hasPermissionToEdit;
			angular.extend(row, extendedRowInfo);
			return row;
		});
	}

    function canEditUser(userTypeId, perms) {
        switch (userTypeId) {
            case 2:
                return perms.canEditWorker;
            case 3:
                return perms.canEditSub;
            case 4:
                return perms.canEditOrgUser;
            case 5:
                return perms.canEditCampusUser;
            default:
                return false;
        }
    }

// #----- END UserAccessCtrl -----# //
});}());
