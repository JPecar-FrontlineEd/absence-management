(function () {
	'use strict'; var app = angular.module('aesop');
	// #-------------------------------------# //
	// #----- Service (routerConfigSvc) -----# //
	app.provider('routerConfigSvc', function () {
		// #-------------------------------------# //
		// #----- Private Functions -----# //
		// #-------------------------------------# //
		try {

			var config = this;

			this.getById = ['$q', '$state', '$rootScope', '$stateParams', 'referenceDataAbsenceReasonSvc', 'toastHelp',
				function ($q, $state, $rootScope, $stateParams, referenceDataAbsenceReasonSvc, toastHelp) {
					var _defer = $q.defer();
					var refid = parseInt($stateParams.refid);
					if (isNaN(refid)) { _defer.reject('Invalid Reference data Id'); }
					referenceDataAbsenceReasonSvc.ready.then(function () {
						referenceDataAbsenceReasonSvc.clearSelection();
						if (refid > 0) {
							$rootScope.$root.loader.loading = true;
							referenceDataAbsenceReasonSvc.getById(refid).then(function (data) {
								var processedData = referenceDataAbsenceReasonSvc.processItem(data);
								processedData.isSelected = true;
								referenceDataAbsenceReasonSvc.replaceExistingItemWithUpdatedCopy(processedData);
								referenceDataAbsenceReasonSvc.setItem(processedData);
								$rootScope.$root.loader.loading = false;
								_defer.resolve();

							}, function (error) {
								toastHelp.error(error.$messages, 'Error');
								_defer.reject('Unable to load absence reason');
							});
						} else {
							_defer.resolve();
						}
					}, function (error) {
						toastHelp.error(error.$messages, 'Error');
						_defer.reject('Error loading absence reason reference data.');
					});
					return _defer.promise;
				}
			];

			this.allowLoaderToShow = ['$q', '$rootScope', 'domHelp',
				function ($q, $rootScope, domHelp) {
					return $q.all([domHelp.rAF(), $rootScope.loader.firstLoadComplete]);
				}
			];
			this.absrFetchContext = ['$q', '$location', 'absrSvc', 'absrStateVal', 'absenceRequestApi', 'workerSvc',
				function ($q, $location, absrSvc, absrStateVal, absenceRequestApi, workerSvc) {
					var _defer = $q.defer();

					workerSvc.absrWorkflowWhatWorkerIsSelected()
						.then(function (selectedWorker) {

							//If there is context and the worker info matches the selected worker
							//then the context is already legit
							if (absrStateVal.context &&
								absrStateVal.worker.id === selectedWorker.id &&
								!absrStateVal.createAnotherAbsenceForThisWorker
							) {
								_defer.resolve(absrStateVal.context);
							}
							else {
								absenceRequestApi.context.get({ workerid: selectedWorker.id })
									.then(function (ctx) {

										if (absrStateVal.createAnotherAbsenceForThisWorker) {
											absrSvc.resetState();
											absrStateVal.worker = selectedWorker;
											$location.url($location.$$path);
										}

										absrStateVal.context = ctx;

										//This absrFetchContext method is only used for Creating a NEW absence
										//The default for needSub=true.
										//Override this based on the context returned here.
										if (ctx.needSub === 0) absrStateVal.needSub = false;	//Context=0=SubNotNeeded

										_defer.resolve(ctx);

									}, function () {
										_defer.reject('unable to get context');
									});
							}

						}, function (result) {
							_defer.reject(result);
						});
					return _defer.promise;
				}
			];
			this.absrValidation = ['$q', 'absrSvc', 'scrollHelp', 'absrStateVal',
				function ($q, absrSvc, scrollHelp, absrStateVal) {
					var _defer = $q.defer();

					var validationResult = absrSvc.validate(absrStateVal);

					if (!validationResult.success) {
						scrollHelp.scrollTo(validationResult.firstFailedVariation);
						_defer.reject('errors found in absr');
					} else {
						_defer.resolve();
					}

					return _defer.promise;
				}
			];
			this.hasWorker = ['$q', 'absrStateVal', function ($q, absrStateVal) {
				if (absrStateVal.worker == null) {
					return $q.reject('no worker found');
				} else {
					return true;
				}
			}];
			this.absrCreate = ['$q', 'absrSvc', 'absrStateVal',
				function ($q, absrSvc, absrStateVal) {
					// when the main create absence is complete
					return absrSvc.saveAbsence(absrStateVal).then(
						// if it resolves, grab a fresh copy of the absr
						function () {
							return absrSvc.setupAbsrState(absrStateVal.id, false)
								.then(function () {
									return $q.all([absrSvc.setupAbsrStateUploadedFiles(), absrSvc.setupAbsrStateRelatedFiles()]);
								});
						},
						// show error messages if absrSvc is unable to set the absr State Val.
						function (rejection) {
							// Seperate out the save failure from save absence.
							absrSvc.saveFailure(absrStateVal, rejection.rejectData);
							return $q.reject();
						}
					);
				}
			];
			this.absrCreateAndKeepLock = ['$q', 'absrSvc', 'absrStateVal',
				function ($q, absrSvc, absrStateVal) {
					// when the main create absence is complete keeping the lock
					return absrSvc.saveAbsence(absrStateVal, true).then(
						// if it resolves, grab a fresh copy of the absr
						function () {
							return absrSvc.setupAbsrState(absrStateVal.id, false)
								.then(function () {
									return $q.all([absrSvc.setupAbsrStateUploadedFiles(), absrSvc.setupAbsrStateRelatedFiles()]);
								});
						},
						// show error messages if absrSvc is unable to set the absr State Val.
						function (rejection) {
							// Seperate out the save failure from save absence.
							absrSvc.saveFailure(absrStateVal, rejection.rejectData);
							return $q.reject();
						}
					);
				}
			];
			this.loadSubstituteIfProvidedAndValidate = ['$q', '$stateParams', 'substituteApi', 'substituteAbsenceVal', 'subAbsenceSvc', 'toastHelp',
				function ($q, $stateParams, substituteApi, substituteAbsenceVal, subAbsenceSvc, toastHelp) {
					var _defer = $q.defer();
					var subId = $stateParams.subId;

					// If subId is provided in URL, fetch and populate substitute data
					if (subId) {
						// Initialize the state first (like in the normal workflow)
						subAbsenceSvc.resetState();

						substituteApi.getById({ id: subId })
							.then(function (sub) {
								substituteAbsenceVal.substitute = {
									id: sub.id,
									firstName: sub.firstName,
									lastName: sub.lastName,
									name: sub.lastName + ', ' + sub.firstName,
									identifier: sub.identifier,
									phone: sub.phone
								};
								// After loading, validate that substitute exists
								if (substituteAbsenceVal.substitute == null) {
									return _defer.reject('no substitute found');
								}
								return _defer.resolve(substituteAbsenceVal.substitute);
							}, function (reason) {
								toastHelp.error(reason.$messages || 'Unable to load substitute', 'Error');
								return _defer.reject(reason);
							});
					} else {
						// No subId in URL, validate existing substituteAbsenceVal
						if (substituteAbsenceVal.substitute == null) {
							return _defer.reject('no substitute found');
						}
						_defer.resolve(true);
					}

					return _defer.promise;
				}
			];
			this.hasSubstitute = ['$q', 'substituteAbsenceVal', function ($q, substituteAbsenceVal) {
				if (substituteAbsenceVal.substitute == null) {
					return $q.reject('no substitute found');
				} else {
					return true;
				}
			}];
			this.createSubstituteAbsence = ['$q', 'subAbsenceSvc', 'substituteAbsenceVal', 'toastHelp', '$state',
				function ($q, subAbsenceSvc, substituteAbsenceVal, toastHelp, $state) {
					var _defer = $q.defer();

					function saveSubstituteAbsenceCallback(data) {
						subAbsenceSvc.setupState(data.id, false).then(function (response) {
							_defer.resolve(response);
						}, function (response) {
							toastHelp.error(response.errors, 'Error');
							_defer.reject(response);
						});
					}

					subAbsenceSvc.save(substituteAbsenceVal).then(saveSubstituteAbsenceCallback, function (reject) {
						if (reject) {
							if (reject.$status === 409) {
								subAbsenceSvc.showWarningDialog(reject).then(saveSubstituteAbsenceCallback, function (err) {
									if (err) {
										toastHelp.error(err.$messages, 'Error');
									}
									_defer.reject(err);
								});
							} else {
								toastHelp.error(reject.$messages, 'Error');
								_defer.reject(reject);
							}
						} else {
							_defer.reject();
						}
					});

					return _defer.promise;
				}
			];
			this.lockAbsr = ['$q', '$stateParams', 'absenceRequestApi', 'toastHelp', 'absrStateVal',
				function ($q, $stateParams, absenceRequestApi, toastHelp, absrStateVal) {
					return absenceRequestApi.lock({ absrid: $stateParams.absrid }, {})
						.then(
							function () {
								if (!!absrStateVal.absr) absrStateVal.absr.isLocked = true;
							}
						)
						.catch(
							function (err) { toastHelp.error(err.$messages, 'Error'); return $q.reject(); }
						);
				}
			];

			this.loadAbsr = function (editMode) {
				return ['$q', '$stateParams', 'absrStateVal', 'absrSvc', 'absenceRequestApi', 'toastHelp',
					function ($q, $stateParams, absrStateVal, absrSvc, absenceRequestApi, toastHelp) {
						var _defer = $q.defer(),
							stateTimedOut = !absrStateVal.editMode && absrStateVal.lastFetch == null || (new Date()).getTime() - absrStateVal.lastFetch > 60000,
							misMatchAbsrId = absrStateVal.id !== parseInt($stateParams.absrid, 10);

						// if we are leaving edit mode, release the lock
						if (absrStateVal.editMode && editMode === false) {
							absenceRequestApi.unlock({ absrid: $stateParams.absrid }).then(function () {
								if (!!absrStateVal.absr) absrStateVal.absr.isLocked = false;
							});
						}

						// try to fetch the fresh absr if the last fetch was minute old.
						// otherwise use the existing copy of the absr.
						if (stateTimedOut || (editMode != null && editMode !== absrStateVal.editMode) || misMatchAbsrId) {
							absrSvc.setupAbsrState($stateParams.absrid, editMode).then(_defer.resolve, function (reasons) {
								toastHelp.error(reasons.errors, 'Error');
								_defer.reject(reasons);
							});
						} else {
							_defer.resolve();
						}
						return _defer.promise;
					}
				];
			};

			this.loadSubstituteAbsence = function (editMode) {
				return ['$q', '$stateParams', 'substituteAbsenceVal', 'subAbsenceSvc', 'permissionSvc', 'toastHelp',
					function ($q, $stateParams, substituteAbsenceVal, subAbsenceSvc, permissionSvc, toastHelp) {

						var _defer = $q.defer();
						var stateTimedOut = !substituteAbsenceVal.editMode && substituteAbsenceVal.lastFetch == null || (new Date()).getTime() - substituteAbsenceVal.lastFetch > 60000;
						var misMatchSubAbsenceId = substituteAbsenceVal.id !== parseInt($stateParams.id, 10);

						// if we are leaving edit mode, release the lock
						if (substituteAbsenceVal.editMode && editMode === false) {
							subAbsenceSvc.unlock($stateParams.id);
						}

						if (stateTimedOut || (editMode != null && editMode !== substituteAbsenceVal.editMode) || misMatchSubAbsenceId) {
							subAbsenceSvc.setupState($stateParams.id, editMode).then(_defer.resolve, function (reasons) {
								toastHelp.error(reasons.errors, 'Error');
								_defer.reject(reasons);
							});
						} else {
							_defer.resolve();
						}

						return _defer.promise;
					}
				];
			};

			try {
				this.preloader = ['$q', '$rootScope', '$timeout', 'featureSvc', 'stringSvc', 'workerTypeSvc', 'permissionSvc', 'notificationsSvc', 'appLoaderSvc',
					function ($q, $rootScope, $timeout, featureSvc, stringSvc, workerTypeSvc, permissionSvc, notificationsSvc, appLoaderSvc) {
						var allSvc = [
							stringSvc.ready,
							workerTypeSvc.ready,
							notificationsSvc.ready,
							featureSvc.ready,
							permissionSvc.ready
						];

						var _defer = $q.defer();

						$q.all(allSvc).then(function () {
							if (!permissionSvc.iHave('PSEUDO.ISCAMPUSUSER')) {
								appLoaderSvc.appReady();
								_defer.resolve();
							}
							else {
								// reset root loader values
								$rootScope.preloader.loaded = 0;
								$rootScope.preloader.total = allSvc.length;

								// register checkin for preloading values
								allSvc.forEach(function (promise) {
									promise.then(function () {
										var loaderTranslateX;

										$rootScope.preloader.loaded++;
										loaderTranslateX = (100 - Math.round(($rootScope.preloader.loaded / $rootScope.preloader.total) * 100)) * -1;

										$rootScope.preloader.style.transform = 'translateX(' + loaderTranslateX + '%)';
									}, function () { });
								});
								_defer.resolve();
								$timeout(function () {
									appLoaderSvc.appReady();
									$rootScope.preloader.loading = false;
								}, 500);
							}

						});


						return _defer.promise;

					}
				];
			} catch (err) { console.warn(err); }
			this.loadSchoolDetails = ['$q', '$stateParams', 'institutionApi', 'schoolDetailsVal', 'toastHelp',
				function ($q, $stateParams, institutionApi, schoolDetailsVal, toastHelp) {
					var _defer = $q.defer();
					var instId = $stateParams.instId;
					//clear out schoolDetailsVal object
					Object.keys(schoolDetailsVal).forEach(function (v, i, a) {
						delete schoolDetailsVal[v];
					});

					institutionApi.getById({ instId: instId })
						.then(function (inst) {
							angular.extend(schoolDetailsVal, inst);
							return _defer.resolve(schoolDetailsVal);
						}, function (reason) {
							toastHelp.error(reason.$messages, 'Error');
							return _defer.reject(reason);
						});

					return _defer.promise;
				}
			];

			this.verifyHasMultipleSchools = ['$q', 'institutionSvc',
				function ($q, institutionSvc) {
					if (institutionSvc.getMyInstitutions().length > 1) {
						return true;
					} else {
						return $q.reject();
					}
				}
			];

			this.loadCallGroupDefaults = ['$q', '$stateParams', 'callGroupApi', 'schoolDetailsVal', 'toastHelp',
				function ($q, $stateParams, callGroupApi, schoolDetailsVal, toastHelp) {
					var _defer = $q.defer();
					var instId = $stateParams.instId;

					if (schoolDetailsVal.callgroup == null) {
						callGroupApi.defaults({ id: instId })
							.then(function (defaults) {
								if (schoolDetailsVal.callgroup == null) {
									schoolDetailsVal.callgroup = {};
								}
								schoolDetailsVal.callgroup.defaults = defaults;
								return _defer.resolve(schoolDetailsVal);
							}, function (reason) {
								toastHelp.error(reason.$messages, 'Error');
								return _defer.reject(reason);
							});
					} else {
						return true;
					}

					return _defer.promise;
				}
			];

			this.loadSubstitute = ['$q', '$stateParams', 'substituteApi', 'subDetailsVal', 'toastHelp',
				function ($q, $stateParams, substituteApi, subDetailsVal, toastHelp) {
					var _defer = $q.defer();
					var subId = $stateParams.subid;
					//clear out subDetailsVal object
					Object.keys(subDetailsVal).forEach(function (v, i, a) {
						delete subDetailsVal[v];
					});

					substituteApi.getById({ id: subId })
						.then(function (sub) {
							angular.extend(subDetailsVal, sub);
							return _defer.resolve(subDetailsVal);
						}, function (reason) {
							toastHelp.error(reason.$messages, 'Error');
							return _defer.reject(reason);
						});

					return _defer.promise;
				}
			];

			this.clearFeedback = function (aboutSubstitute) {
				return ['feedbackSvc',
					function (feedbackSvc) {
						feedbackSvc.resetFeedback(aboutSubstitute);
						return true;
					}
				];
			};

			this.navigatorRouting = ['$q', '$location', '$window', 'config', 'featureSvc', 'userSvc', 'navUrlMappingSvc', 'navUrlProviderSvc', 'tokenSvc',
				function ($q, $location, $window, config, featureSvc, userSvc, navUrlMappingSvc, navUrlProviderSvc, tokenSvc) {
					function syncUserPreference(querystringObj) {
						var doLoad = ("UPREFSYNC" in querystringObj);
						if (!doLoad) return;

						var paramValue = querystringObj["UPREFSYNC"];
						var parts = paramValue.split('-');

						if (parts.length != 3) return;

						userSvc.syncUserPreference(parts[0], parts[1], parts[2]);
						navUrlProviderSvc.rebuildMappings();
						navUrlMappingSvc.resetNavUrlMappingVal();
					}

					$q.all([userSvc.ready, featureSvc.ready, navUrlProviderSvc.ready]).then(function ([userData]) {
						var url = $location.url();
						var search = $location.search();
						syncUserPreference(search);
						//navUrlProviderSvc needs to be ready to make sure we have our mappings
						var map = navUrlMappingSvc.getMapping(url);

						//Tie to feature toggle, but allow ASP pages converted to Angular through
						if (featureSvc.get("SidekickNavigator").enabled && (map == null || map.mapping.autoRedirectFor.indexOf(userData.UserType) === -1)) {
							var baseDomain = '//' + config.platformSubDomain + config.topLevelDomain;
							//handle pages that are not at /navigator
							if (url.indexOf('mvc.aspx') > 0 || url.indexOf('reportwriter') > 0) {
								url = url.replace(config.navigatorPath, '');
							}
							var redirectUrl = baseDomain + url;
							//send the token back to Navigator
							if (redirectUrl.indexOf('?') > 0) {
								redirectUrl = redirectUrl + '&token=' + tokenSvc.get();
							} else {
								redirectUrl = redirectUrl + '?token=' + tokenSvc.get();
							}
							//redirect to the Navigator site
							$window.location.href = redirectUrl;
						} else {
							return true;
						}
					});
				}
			];

			this.$get = function () { return {}; };
		}
		catch (err) {
			console.log("routerConfigSvc threw an error", err);
		}
	});
	// #--- END Service (routerConfigSvc) ---# //
	// #-------------------------------------# //

}());
