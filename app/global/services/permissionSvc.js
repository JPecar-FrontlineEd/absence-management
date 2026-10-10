(function () {
	'use strict'; var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Service (permissionSvc) -----# //
	app.factory('permissionSvc', function ($q, $rootScope, storageSvc, institutionSvc, permissionProfileApi, orgSvc, userSvc, userType) {

		var permissionObj = {},
			fetchDefer = null,
			_defer = $q.defer();

		// wait for all of our dependent services to be ready
		$q.all([
			userSvc.ready,
			orgSvc.ready,
			institutionSvc.ready
		]).then(function () {
			// make an initial request for all permissions
			fetchPermissions().then(function (data) {
				buildObj(data);
				_defer.resolve(permissionObj);
			});
		});

		function buildObj(data) {
			// generate object for fast reference
			data.forEach(function (cat) {
				var p = permissionObj[cat.category.toUpperCase()] = {};
				cat.items.forEach(function (item) {
					p[item.type.toUpperCase()] = true;
				});
			});
		}

		function fetchPermissions() {
			var fetchData;
			if (!fetchDefer) {
				fetchDefer = $q.defer();
				fetchData = storageSvc.load({ key: 'permissions' });
				if (fetchData) {
					// resolve from storage
					fetchDefer.resolve(fetchData);
				} else {
					permissionProfileApi.get().then(function (data) {
						//add extra permissions needed by the app
						data = addPseudoPermissions(data);

						// resolve the fetchPermissions deferred
						fetchDefer.resolve(data);

						// store the result
						storageSvc.save({
							key: 'permissions',
							data: data,
							expires: 5
						});
					});
				}
			}
			return fetchDefer.promise;
		}

		function addPseudoPermissions(data) {
			//create any permissions the app needs but is not present on
			//the current permission profiles
			var myInsts = institutionSvc.getMyInstitutions(),
				orgData = orgSvc.getOrgData(),
				userData = userSvc.getUserData();

			var pseudoList = {
				category: 'PSEUDO',
				items: []
			};

			// HAS SCHOOLS permission
			// true if the user has institution visibility
			if (myInsts.length > 0) {
				pseudoList.items.push({
					type: 'HASSCHOOLS'
				});
			}

			// HAS WEB TIME permission
			// true if the user has web time visibility
			if (orgData[0].settings.isWebTimeVisible) {
				pseudoList.items.push({
					type: 'HASWEBTIME'
				});
			}

			// AUTO GENERATE TIMESHEETS permission
			// true if the org auto-generates timesheets (Org_AutoGenerateTimeSheets=1);
			// used to hide Timesheet Approvers / Manage Approvers menu items
			if (orgData[0].settings.autoGenerateTimeSheets) {
				pseudoList.items.push({
					type: 'AutoGenerateTimeSheets'
				});
			}

			// IS ORG USER permission
			// true if the user is an organization user
			if (userData.UserType === userType.campus) {
				pseudoList.items.push({
					type: 'ISCAMPUSUSER'
				});
			}

			//navigator has dashboard
			if (orgData[0].settings.showDashboard) {
				pseudoList.items.push({
					type: 'HasNavDashboard'
				});
			}

			//navigator org file attachments
			if (orgData[0].settings.usesAbsenceAttachment) {
				pseudoList.items.push({
					type: 'OrgAbsrUploads'
				});
			}

			//navigator org track logins
			if (orgData[0].settings.trackLogin) {
				pseudoList.items.push({
					type: 'TrackLogins'
				});
			}

			//navigator worker show allocation groups
			if (orgData[0].settings.showAllocationGroups) {
				pseudoList.items.push({
					type: 'ShowAllocationGroups'
				});
			}

			//navigatororg use vacancies
			if (orgData[0].settings.usesVacancies) {
				pseudoList.items.push({
					type: 'UsesVacancies'
				});
			}

			//navigatororg use approvals
			if (orgData[0].settings.usesAbsenceApproval) {
				pseudoList.items.push({
					type: 'UsesAbsenceApproval'
				});
			}

			//navigatororg imports enabled
			if (orgData[0].settings.importsEnabled) {
				pseudoList.items.push({
					type: 'ImportsEnabled'
				});
			}

			//organization using veritime
			if (orgData[0].settings.usesVeritime) {
				pseudoList.items.push({
					type: 'IsVeritimeEnabled'
				});
			}

			//organization that is only using VeriTime and has not bought Aesop
			if (orgData[0].settings.isVeritimeOnly) {
				pseudoList.items.push({
					type: 'IsVeritimeOnly'
				});
			}

			//User voice is available to the organization


			if (orgData[0].settings.usesUserVoice && orgData[0].orgStatus.statusTypeId == 1 && !(orgData.applId == 5 || orgData.applId == 6 || orgData.applId == 10)) {
				pseudoList.items.push({
					type: 'USESUSERVOICE'
				});
			}

			// Absence Analytics permission
			// true if the org user has Absence Analytics Access
			if (userData.hasFiveLabAccess) {
				pseudoList.items.push({
					type: 'HasFiveLabAccess'
				});
			}

			data.push(pseudoList);
			return data;
		}

		function iHaveHandler(func) {
			return func.call(null, iHave);
		}

		function iHave(permission) {
			var permissionCheckResult, flipCheck, pArr, category, type;

			// if the permission check is a function, run it
			if (typeof permission === 'function') {
				return iHaveHandler(permission);
			} else {
				// check if we should check for the user NOT having this permission
				flipCheck = permission.charAt(0) === '!';

				// normalize the permission we are looking for by removing the NOT "!"
				if (flipCheck) { permission = permission.substr(1); }

				pArr = permission.toUpperCase().split('.');
				category = pArr[0];
				type = pArr.length > 1 && pArr[1] || '';
				permissionCheckResult = permissionObj[category] && permissionObj[category][type] || false;
				return (flipCheck) ? !permissionCheckResult : permissionCheckResult;
			}
		}

		$rootScope.havePermission = iHave;

		return {
			fetch: fetchPermissions,
			iHave: iHave,
			ready: _defer.promise
		};

	});
	// #--- END Service (permissionSvc) ---# //
	// #-----------------------------------# //

}());
