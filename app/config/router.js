(function () {
	'use strict';
	var app = angular.module('aesop');

	app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, routerConfigSvcProvider) {
		var routeResolver = routerConfigSvcProvider;
		$locationProvider.html5Mode(true);
		console.log("### Setting up the router ###")
		//DE13938 - Error found in TC7832: NAV - User Access - Invites - Override the default role with an invalid entry
		window.onerror = function (e) {
			if (/.*URIError: malformed.*URI|URI.*malformed|URI.*error|URI.*decoded.*not.*valid/.test(e) && /\/access/.test(window.location.pathname)) {
				window.location.href = '/access';
			}
		};

		// For any unmatched url, send to /
		$urlRouterProvider
			.when('/token/{token}{redirect:(?:/?.*)}', function (tokenSvc, $match, $location, navigatorUrlHelp) {
				$location.path(navigatorUrlHelp.getTokenRedirectUrl($match.redirect) || '/').replace();
			})
			.when('/auth_callback?', function (flAuthService, $window, $q) {
				return flAuthService.authenticateCallback()
					.then(function (callbackResponse) {
						if (callbackResponse !== undefined && callbackResponse.indexOf('/undefined') === -1) {
							$window.location.replace(callbackResponse);
						} else {
							$window.location.replace('/access');
						}
					}).catch(function (error) {
						//if IDM tells us there was an error, see if they sent us a URL they'd like us to redirect to.
						//more info: https://github.com/FrontlineEducation/Util-IDM-AuthJS/releases/tag/v3.0.25
						if (error.errorUrl) {
							// An errorUrl property may be provided during an auth callback failure. Redirect to this url.
							$window.location.replace(error.errorUrl);
						} else {
							//TODO in the future we should redirect to a friendly error page instead of leaving them
							//on the loading screen which may not adequately communicate an error state
							return $q.reject(error);
						}
					});
			})
			.when('/signout?{state}', function (flAuthService, $match, $window) {
				if ($match.state !== undefined) {
					return flAuthService.signoutCallback().then(function (callbackResponse) {
						$window.location.replace(callbackResponse);
					});
				} else {
					$window.location.replace('/access');
				}
			})
			.otherwise('/');

		$stateProvider
			.state('base', {
				template: '<ui-view></ui-view>',
				abstract: true,
				url: '/abs-mgt',
				resolve: {
					tokenCheck: function (tokenSvc) {
						return tokenSvc.ready;
					},
					preloader: routeResolver.preloader
				}
			})
			.state('base.home', {
				url: '/',
				templateUrl: '/routes/index.html',
				resolve: {
					allowed: function ($q, $state, permissionSvc) {
						//This route is really only valid for campus users, so if it is not a campus user, we want to transition them to the base navigator route
						//the reason we are doing this is the base route makes a number of api calls that do not need to be made, so in doing this, we cut that out for navigator users.
						var _defer = $q.defer();
						permissionSvc.ready.then(function () {
							if (!permissionSvc.iHave('PSEUDO.ISCAMPUSUSER')) {
								$state.go('base.navigator');
							}
							else {
								_defer.resolve();
							}
						});
						return _defer.promise;
					}
				}
			})
			.state('base.absrCreateDetails', {
				url: '/absences/create-absence-details',
				params: {
					assignedClicked: null,
					workerId: null,
					isVacancy: null
				},
				resolve: {
					absrContext: routeResolver.absrFetchContext
				},
				templateUrl: '/routes/absences/create-absence-details.html'
			})
			.state('base.absrCreateReview', {
				url: '/absences/create-absence-review',
				resolve: {
					absrValidation: routeResolver.absrValidation
				},
				templateUrl: '/routes/absences/create-absence-review.html'
			})
			.state('base.absrCreateAndAssign', {
				url: '/absences/create-absence-assign',
				params: { assignedClicked: null },
				resolve: {
					absrCreateAndKeepLock: routeResolver.absrCreateAndKeepLock
				},
				controller: ['$location', 'absrSvc', 'absrStateVal',
					function ($location, absrSvc, absrStateVal) {
						if (absrStateVal.substitute === null) {
							$location.url('/absences/detail/' + absrStateVal.id + '/availableSubstitutes');
						} else {
							$location.url('/absences/create-absence-done');
							absrSvc.permSubstituteDialog().then(
								function () {
									$location.url('/absences/detail/' + absrStateVal.id + '/availableSubstitutes');
								}
							);
						}
					}]
			})
			.state('base.absrCreateSave', {
				url: '/absences/create-absence-save',
				params: { assignedClicked: null },
				resolve: {
					absrCreate: routeResolver.absrCreate
				},
				controller: ['$location',
					function ($location) {
						$location.url('/absences/create-absence-done');
					}
				]
			})
			.state('base.absrCreateDone', {
				url: '/absences/create-absence-done',
				resolve: {
					hasWorker: routeResolver.hasWorker
				},
				templateUrl: '/routes/absences/create-absence-done.html'
			})
			.state('base.vacancyCreateDetails', {
				url: '/absences/create-vacancy-details',
				params: {
					workerId: null
				},
				resolve: {
					absrContext: routeResolver.absrFetchContext
				},
				templateUrl: '/routes/absences/create-vacancy-details.html'
			})
			.state('base.vacancyCreateReview', {
				url: '/absences/create-vacancy-review',
				resolve: {
					absrValidation: routeResolver.absrValidation
				},
				templateUrl: '/routes/absences/create-vacancy-review.html'
			})
			.state('base.vacancyCreateAndAssign', {
				url: '/absences/create-vacancy-assign',
				resolve: {
					absrCreateAndKeepLock: routeResolver.absrCreateAndKeepLock
				},
				controller: ['$location', 'absrSvc', 'absrStateVal',
					function ($location, absrSvc, absrStateVal) {
						if (absrStateVal.substitute === null) {
							$location.url('/absences/detail/' + absrStateVal.id + '/availableSubstitutes');
						} else {
							$location.url('/absences/create-vacancy-done');
							absrSvc.permSubstituteDialog().then(
								function () {
									$location.url('/absences/detail/' + absrStateVal.id + '/availableSubstitutes');
								}
							);
						}
					}]
			})
			.state('base.vacancyCreateSave', {
				url: '/absences/create-vacancy-save',
				resolve: {
					absrCreate: routeResolver.absrCreate
				},
				controller: ['$location',
					function ($location) {
						$location.url('/absences/create-vacancy-done');
					}
				]
			})
			.state('base.vacancyCreateDone', {
				url: '/absences/create-vacancy-done',
				resolve: {
					hasWorker: routeResolver.hasWorker
				},
				templateUrl: '/routes/absences/create-vacancy-done.html'
			})
			// ========================================================== //
			.state('base.reports', {
				url: '/reports/report-writer/:reportId/view',
				templateUrl: '/routes/reports/report-writer/view.html'
			})

			.state('base.notifications', {
				url: '/notifications',
				templateUrl: '/routes/notifications.html'
			})

			.state('base.user', {
				url: '/user',
				templateUrl: '/routes/user/user.html',
				abstract: true
			})
			.state('base.user.pin', {
				url: '/pin',
				templateUrl: '/routes/user/change-pin.html'
			})
			.state('base.user.profile', {
				url: '/profile',
				templateUrl: '/routes/user/user-profile.html',
				resolve: {
					awaitAuthService: function (authSvc) {
						return authSvc.ready;
					}
				}
			})

			.state('base.substitute', {
				url: '/substitute/:subid',
				resolve: {
					loadSubstitute: routeResolver.loadSubstitute
				},
				templateUrl: '/routes/substitute/substitute-general-info.html'
			})

			.state('base.detail', {
				url: '/absences/detail/:absrid',
				templateUrl: '/routes/absences/detail.html',
				abstract: true
			})
			.state('base.detail.view', {
				url: '/view',
				resolve: { loadAbsr: routeResolver.loadAbsr(false) },
				templateUrl: '/routes/absences/detail/viewedit.html'
			})
			.state('base.detail.edit', {
				url: '/edit',
				resolve: { loadAbsr: routeResolver.loadAbsr(true) },
				templateUrl: '/routes/absences/detail/viewedit.html'
			})
			.state('base.detail.reconciliation', {
				url: '/reconciliation',
				resolve: {
					loadAbsr: routeResolver.loadAbsr()
				},
				templateUrl: '/routes/absences/detail/reconciliation.html'
			})
			.state('base.detail.split', {
				url: '/split',
				resolve: {
					loadAbsr: routeResolver.loadAbsr(),
					lockAbsr: routeResolver.lockAbsr
				},
				templateUrl: '/routes/absences/detail/split.html'
			})
			.state('base.detail.availableSubstitutes', {
				url: '/availableSubstitutes',
				resolve: { loadAbsr: routeResolver.loadAbsr() },
				templateUrl: '/routes/absences/detail/available-substitutes.html'
			})
			.state('base.detail.approvers', {
				url: '/approvers',
				resolve: { loadAbsr: routeResolver.loadAbsr() },
				templateUrl: '/routes/absences/detail/absence-approvers.html'
			})
			.state('base.detail.approverLog', {
				url: '/log/approver',
				resolve: { loadAbsr: routeResolver.loadAbsr() },
				templateUrl: '/routes/absences/detail/absence-approver-log.html'
			})
			.state('base.detail.absenceLog', {
				url: '/log/absence',
				resolve: { loadAbsr: routeResolver.loadAbsr() },
				templateUrl: '/routes/absences/detail/absence-log.html'
			})
			.state('base.detail.CallHistoryLog', {
				url: '/log/callhistory',
				resolve: { loadAbsr: routeResolver.loadAbsr() },
				templateUrl: '/routes/absences/detail/callhistory-log.html'
			})
			.state('base.detail.SubstitutePushNotificationLog', {
				url: '/log/substitutePushNotification',
				resolve: { loadAbsr: routeResolver.loadAbsr() },
				templateUrl: '/routes/absences/detail/substitute-push-notification-log.html'
			})
			.state('base.detail.substituteFeedback', {
				url: '/feedback/substitute',
				params: {
					back: null,
					editMode: null
				},
				resolve: {
					loadAbsr: routeResolver.loadAbsr(),
					clearFeedback: routeResolver.clearFeedback(true)
				},
				templateUrl: '/routes/absences/detail/feedback-substitute.html'
			})
			.state('base.detail.workerFeedback', {
				url: '/feedback/worker',
				params: {
					back: null,
					editMode: null
				},
				resolve: {
					loadAbsr: routeResolver.loadAbsr(),
					clearFeedback: routeResolver.clearFeedback(false)
				},
				templateUrl: '/routes/absences/detail/feedback-worker.html'
			})
			.state('login', {
				url: '/dev/login',
				templateUrl: '/routes/login.html',
				resolve: {
					killLoader:
						function ($rootScope, $q) {
							$rootScope.preloader.loading = false;
							return $q.resolve();
						}
				}
			})
			.state('access', {
				url: '/access',
				templateUrl: '/routes/access.html',
				resolve: {
					clearUserSession:
						function ($rootScope, userSvc, config) {
							$rootScope.preloader.loading = false;
							if (config.idm.enabled === 'off') {
								return $q.reject();
							} else {
								//make sure any prior session information has been removed
								return userSvc.clearUserSession();
							}
						},
				}
			})
			.state('impersonate', {
				url: '/impersonate',
				templateUrl: '/routes/impersonate.html',
				resolve: {
					awaitAuthService: function (authSvc) {
						return authSvc.ready;
					}
				}
			})
			.state('fromTimeAndAttendance', {
				url: '/fromTimeAndAttendance',
				templateUrl: '/routes/fromtaa/from-time-and-attendence.html',
				resolve: {
					awaitAuthService: function (authSvc) {
						return authSvc.ready;
					}
				}
			})
			.state('endImpersonate', {
				url: '/endImpersonate',
				templateUrl: '/routes/endimpersonate/end-impersonate.html',
				resolve: {
					awaitAuthService: function (authSvc) {
						return authSvc.ready;
					}
				}
			})
			.state('base.useraccess', {
				url: '/security/user-access',
				templateUrl: '/routes/security/user-access.html',
				resolve: {
					awaitAuthService: function (authSvc) {
						return authSvc.ready;
					}
				}
			})

			// Begin Section -- Substitute Absence Nested View Routing
			.state('base.substituteAbsenceDetail', {
				url: '/substitute-absences/detail/:id',
				templateUrl: '/routes/substitute-absences/substitute-absences-detail.html',
				abstract: true
			})
			.state('base.substituteAbsenceDetail.view', {
				url: '/view',
				resolve: { loadSubAbs: routeResolver.loadSubstituteAbsence(false) },
				templateUrl: '/routes/substitute-absences/detail/viewedit.html'
			})
			.state('base.substituteAbsenceDetail.edit', {
				url: '/edit',
				resolve: { loadSubAbs: routeResolver.loadSubstituteAbsence(true) },
				templateUrl: '/routes/substitute-absences/detail/viewedit.html'
			})
			.state('base.substituteAbsenceDetail.absenceLog', {
				url: '/log',
				resolve: { loadSubAbs: routeResolver.loadSubstituteAbsence() },
				templateUrl: '/routes/substitute-absences/detail/substitute-absence-log.html'
			})
			.state('base.substituteAbsenceCreateDetail', {
				url: '/substitute-absences/create-substitute-absence-details?subId',
				resolve: {
					hasSubstitute: routeResolver.loadSubstituteIfProvidedAndValidate
				},
				templateUrl: '/routes/substitute-absences/create-substitute-absence-details.html'
			})
			.state('base.substituteAbsenceCreateReview', {
				url: '/substitute-absences/create-substitute-absence-review',
				resolve: {
					hasSubstitute: routeResolver.hasSubstitute
				},
				templateUrl: '/routes/substitute-absences/create-substitute-absence-review.html'
			})
			.state('base.substituteAbsenceCreateDone', {
				url: '/substitute-absences/create-substitute-absence-done',
				resolve: {
					createSubstituteAbsence: routeResolver.createSubstituteAbsence
				},
				templateUrl: '/routes/substitute-absences/create-substitute-absence-done.html'
			})
			// End Section -- Substitute Absence Nested View Routing

			.state('base.schoolDetails', {
				url: '/settings/school/:instId',
				resolve: { loadSchool: routeResolver.loadSchoolDetails },
				templateUrl: '/routes/settings/school-details.html',
				abstract: true
			})
			.state('base.schoolDetails.generalInfo', {
				url: '/general-info',
				templateUrl: '/routes/settings/school-details/school-general-info.html'
			})
			.state('base.schoolDetails.timeSettings', {
				url: '/time-settings',
				templateUrl: '/routes/settings/school-details/school-time-settings.html'
			})
			.state('base.schoolDetails.preferredSubs', {
				url: '/preferred-substitutes',
				resolve: { loadDefaults: routeResolver.loadCallGroupDefaults },
				templateUrl: '/routes/settings/school-details/school-preferred-substitutes.html'
			})
			.state('base.schoolDetails.excludedSubs', {
				url: '/excluded-substitutes',
				resolve: { loadDefaults: routeResolver.loadCallGroupDefaults },
				templateUrl: '/routes/settings/school-details/school-excluded-substitutes.html'
			})
			.state('base.schoolDetails.sharedFiles', {
				url: '/shared-files',
				templateUrl: '/routes/settings/school-details/school-shared-files.html'
			})
			//catch to prompt user with a school selector
			.state('base.school', {
				url: '/settings/school/:destination',
				resolve: { verifyHasMultipleSchools: routeResolver.verifyHasMultipleSchools },
				templateUrl: '/routes/settings/school-selector.html'
			})
			.state('base.navigator', {
				url: '/navigator',
				templateUrl: '/routes/navigator.html'
			})
			.state('base.navigator.path', {
				url: '/{navigatorPath:.*}',
				resolve: { navigatorRouting: routeResolver.navigatorRouting },
				template: ''
			})

			//WEBTIME ----------------------------------------------------------------------------------------
			.state('base.webtimeTimesheetSummary', {
				url: '/WebTime/TimeSheet-Summary',
				templateUrl: '/routes/webtime/webtime-timesheet-summary.html'
			})
			.state('base.webtimeTimesheetLog', {
				url: '/WebTime/TimeSheet/:tsId/Log',
				templateUrl: '/routes/webtime/webtime-timesheet-log.html'
			})
			//catch to prompt user with a school selector
			.state('base.webtimeScholSelector', {
				url: '/WebTime/School/:destination',
				resolve: { verifyHasMultipleSchools: routeResolver.verifyHasMultipleSchools },
				templateUrl: '/routes/webtime/webtime-school-selector.html'
			})
			.state('base.webtimeApprovers', {
				url: '/WebTime/:instId/Approvers',
				templateUrl: '/routes/webtime/webtime-approvers.html'
			})


			//------------REFERENCE DATA----------------------------------------------------------------
			.state('base.refDataabsenceReason', {
				url: '/reference-data/absence-reasons',
				templateUrl: '/routes/reference-data/absence-reasons.html'
			})
			.state('base.refDataabsenceReason.new', {
				url: '/new',
				params: { refid: -1, isBucket: false, addChild: null, doDirtyCheck: true },
				resolve: { fetchRefData: routeResolver.getById },
				templateUrl: '/routes/reference-data/absence-reasons/absence-reason-view.html'
			})
			.state('base.refDataabsenceReason.newBucket', {
				url: '/new-bucket',
				params: { refid: -1, isBucket: true, addChild: null, doDirtyCheck: true },
				resolve: { fetchRefData: routeResolver.getById },
				templateUrl: '/routes/reference-data/absence-reasons/absence-reason-view.html'
			})
			.state('base.refDataabsenceReason.view', {
				url: '/abs-mgt/:refid',
				params: { isBucket: null, doDirtyCheck: true },
				resolve: { fetchRefData: routeResolver.getById },
				controller: ['$stateParams', 'referenceDataVal',
					function ($stateParams, referenceDataVal) {
						$stateParams.isBucket = referenceDataVal.item.isBucket;
					}
				],
				templateUrl: '/routes/reference-data/absence-reasons/absence-reason-view.html'
			})
			//--------END REFERENCE DATA----------------------------------------------------------------



			//END WEBTIME ----------------------------------------------------------------------------------------

			.state('base.default', {
				url: '/{path:.*}',
				templateUrl: function (params) {
					var path = params.path.charAt(params.path.length - 1) === '/' ? params.path + 'index' : params.path;
					return '/routes/' + path.toLowerCase() + '.html';
				}
			});

		// ========================================================== //

	})

		.run(function ($templateCache, $rootScope, $state, $log, $location, $window, domHelp, institutionSvc, config, ssoSvc, authSvc) {
			$rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {

				if (toState.name === 'base.detail.edit' && error.lockFailed) {
					domHelp.rAF(function () {
						$log.error('Lock Failed', toState.url);
						$location.url('/absences/detail/' + toParams.absrid + '/view');
					});
				}

				if (toState.name === 'base.substituteAbsenceDetail.view') {
					domHelp.rAF(function () {
						$log.error('Permission Failed');
						$location.url('403');
					});
				}

				if (toState.name === 'base.substituteAbsenceDetail.edit' && error.lockFailed) {
					domHelp.rAF(function () {
						$log.error('Lock Failed', toState.url);
						$location.url('/substitute-absences/detail/' + toParams.id + '/view');
					});
				}
				if (toState.name === 'base.absrCreateDetails') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$location.url('/absences/create-absence');
					});
				}
				if (toState.name === 'base.absrCreateReview') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.absrCreateDetails', { assignedClicked: false });
					});
				}
				if (toState.name === 'base.absrCreateAndAssign') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.absrCreateDetails', { assignedClicked: true });
					});
				}
				if (toState.name === 'base.absrCreateSave') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.absrCreateDetails');
					});
				}
				if (toState.name === 'base.absrCreateDone') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.absrCreateDetails');
					});
				}
				if (toState.name === 'base.vacancyCreateDetails') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$location.url('/absences/create-vacancy');
					});
				}
				if (toState.name === 'base.vacancyCreateReview') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.vacancyCreateDetails');
					});
				}
				if (toState.name === 'base.vacancyCreateAndAssign') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.vacancyCreateDetails');
					});
				}
				if (toState.name === 'base.vacancyCreateSave') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.vacancyCreateDetails');
					});
				}
				if (toState.name === 'base.vacancyCreateDone') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.vacancyCreateDetails');
					});
				}
				if (toState.name === 'base.substituteAbsenceCreateDone') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$state.go('base.substituteAbsenceCreateDetail');
					});
				}
				if (toState.name === 'base.substituteAbsenceCreateDetail') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$location.url('/substitute-absences/create-substitute-absence');
					});
				}
				if (toState.name === 'base.substituteAbsenceCreateReview') {
					domHelp.rAF(function () {
						$log.error(error, toState.url);
						$location.url('/substitute-absences/create-substitute-absence');
					});
				}
				if (toState.name === 'base.school') {
					domHelp.rAF(function () {
						var myInsts = institutionSvc.getMyInstitutions();
						if (myInsts.length === 1) {
							$location.url('/settings/school/' + myInsts[0].id + '/' + toParams.destination);
						}
					});
				}
				if (toState.name === 'base.webtimeScholSelector') {
					domHelp.rAF(function () {
						var myInsts = institutionSvc.getMyInstitutions();
						if (myInsts.length === 1) {
							$location.url('/WebTime/' + myInsts[0].id + '/' + toParams.destination);
						}
					});
				}

				///NOTE: to address an issue with moving on to step 2 of absence create when your token is expired, we moved this check up to be the first check done. // TEMP:
				///This created some production issues where some campus user's were not able log in. We have not figured out the issue as of yet. This comment is left here as a warning to not move this block of
				//code back to the top of the $StateChangeError handler.
				if ((error !== undefined && error.key === 'tokenError') || toState.name === 'access') {
					domHelp.rAF(function () {
						if (ssoSvc.IsSSO) {
							$window.location.href = "//" + ssoSvc.SSODomain + config.topLevelDomain;
						}
						else {
							if (toState.url.indexOf("navigator") > -1) {
								var url = config.logoutNavigator;
								var navUrl = $location.url();
								url += "&url=" + encodeURIComponent(navUrl);
								$window.location.href = url;
							} else {
								$window.location.href = config.logout;
							}
						}
					});
				}


			});

			$rootScope.$on('$stateChangeStart', function () {
				authSvc.ready.then(function (svc) {
					if (svc && !svc.isAuthenticated) {
						window.location.replace('/access');
					}
				})
			});

		});

}());
