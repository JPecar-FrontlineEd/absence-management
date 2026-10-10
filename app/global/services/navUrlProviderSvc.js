(function () {
	'use strict'; var app = angular.module('aesop');

	// #---------------------------------------# //
	// #----- Service (navUrlProviderSvc) -----# //
	app.factory('navUrlProviderSvc', function ($q, userSvc, orgSvc, featureSvc, userType) {

		var _defer = $q.defer();

		var urlMappings = [];
		const approvalFeature = 'AngularApprovalsForOU',
			reconcileFeature = 'AngularReconcileForOU',
			absenceRequestFeature = 'AngularAbsenceRequestForOU',
			absrModeChoiceFeature = "AbsrModeChoice",
			dailyReportRequestFeature = 'AngularDailyReportForOU',
			dailyReportModeChoiceFeature = "DailyReportModeChoice",
			reportFeature = {
				absentee: 'AngularAbsenteeReportForOU',
				approvalStatus: 'AngularApprovalStatusReportForOU',
				monthlySummary: 'AngularMonthlySummaryReportForOU',
				callHistory: 'AngularCallHistoryReportForOU',
				dowAnalysis: 'AngularDOWAbsenceAnalysisReportForOU',
				feedback: 'AngularFeedbackReportForOU',
				absenceInteractive: 'AngularInteractiveReportForOU',
				subSignin: 'AngularSubSignInReportForOU',
				subHistory: 'AngularSubHistoryByDateReportForOU',
				subExcluded: 'AngularSubExcludedReportForOU',
				staffList: 'AngularStaffListReportForOU'
			};

		const _absenceModeIsAngular = () => {
			const prefAbsrModeIsAng = "2";
			const angularAbsenceCreate = featureSvc.get(absenceRequestFeature).enabled;
			const absrModeChoice = featureSvc.get(absrModeChoiceFeature).enabled;
			const pref = userSvc.getUserPreference("AbsrMode");
			const userChoseAng = (pref ? pref.value == prefAbsrModeIsAng : angularAbsenceCreate);

			const result = (angularAbsenceCreate && !absrModeChoice) || (absrModeChoice && userChoseAng);

			//console.log("_absenceModeIsAngular.aac: " + angularAbsenceCreate);
			//console.log("_absenceModeIsAngular.choice: " + absrModeChoice);
			//console.log("_absenceModeIsAngular.userchoseAngular: " + userChoseAng);
			//console.log("_absenceModeIsAngular.result: " + result);

			return result;
		}

		const _dailyReportModeIsAngular = () => {
			const prefDailyReportModeIsAng = "2";
			const angularDailyReport = featureSvc.get(dailyReportRequestFeature).enabled;
			const dailyReportModeChoice = featureSvc.get(dailyReportModeChoiceFeature).enabled;
			const pref = userSvc.getUserPreference("DailyReportMode");
			const userChoseAng = ((pref != null && pref.value != null) ? pref.value == prefDailyReportModeIsAng : angularDailyReport);

			const result = (angularDailyReport && !dailyReportModeChoice) || (dailyReportModeChoice && userChoseAng);

			return result;
		}

		const _basicMappingFunction = (urlMap, navUsesAdmin) => {
			if (angular.isUndefined(navUsesAdmin)) { navUsesAdmin = urlMap.navUsesAdmin; }
			var navQuery = urlMap.navUrl.split('?')[1] || '',
				navPath = urlMap.navUrl.split('?')[0].replace(/\./, '\.');

			navQuery = navQuery.split('&').reduce(function (qObj, qs, i) {
				qObj['p' + i] = new RegExp(qs, 'i');
				return qObj;
			}, {});
			console.log(navPath)
			return {
				navToAdmin: {
					match: { path: new RegExp('^' + navPath, 'i') },
					query: navQuery,
					route: urlMap.adminUrl,
					autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
				},
				adminToNav: {
					match: { path: new RegExp('^' + urlMap.adminUrl + '$', 'i') },
					route: urlMap.navUrl,
					autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
				}
			};
		};

		var _basicReportMappingList = () => {
			return [
				{ navReportName: 'absence', adminReportPath: 'absence/absentee', navUsesAdmin: featureSvc.get(reportFeature.absentee).enabled },
				{ navReportName: 'dailyReport', adminReportPath: 'absence/daily-report', navUsesAdmin: _dailyReportModeIsAngular() },
				{ navReportName: 'absApprovalStatus', adminReportPath: 'absence/approval-status', navUsesAdmin: featureSvc.get(reportFeature.approvalStatus).enabled },
				{ navReportName: 'abshistory', adminReportPath: 'absence/monthly-summary', navUsesAdmin: featureSvc.get(reportFeature.monthlySummary).enabled },
				{ navReportName: 'callhistory', adminReportPath: 'absence/call-history', navUsesAdmin: featureSvc.get(reportFeature.callHistory).enabled },
				{ navReportName: 'dowAbsenceAnalysis', adminReportPath: 'absence/dow-absence-analysis', navUsesAdmin: featureSvc.get(reportFeature.dowAnalysis).enabled },
				{ navReportName: 'absrfeedback', adminReportPath: 'absence/feedback', navUsesAdmin: featureSvc.get(reportFeature.feedback).enabled },
				{ navReportName: 'AbsenceDynamic', adminReportPath: 'absence/interactive', navUsesAdmin: featureSvc.get(reportFeature.absenceInteractive).enabled },
				{ navReportName: 'subSignIn', adminReportPath: 'absence/sub-sign-in', navUsesAdmin: featureSvc.get(reportFeature.subSignin).enabled },
				{ navReportName: 'subHistoryByDate', adminReportPath: 'substitute/sub-history-by-date', navUsesAdmin: featureSvc.get(reportFeature.subHistory).enabled },
				{ navReportName: 'subExcludedReport', adminReportPath: 'substitute/excluded-subs', navUsesAdmin: featureSvc.get(reportFeature.subExcluded).enabled },
				{ navReportName: 'staffRegister', adminReportPath: 'employee/staff-list', navUsesAdmin: featureSvc.get(reportFeature.staffList).enabled },
				{ navReportName: 'subAbsences', adminReportPath: 'substitute/substitute-absences', navUsesAdmin: true }
			];
		};

		// basic URL mappings that don't require data to be extracted from the url
		var _basicUrlMappingList = () => {
			return [
				{ navUrl: '/reportselection.asp', adminUrl: '/abs-mgt/reports/report-writer/', navUsesAdmin: false },
				{ navUrl: '/substitutecancellationreasons.asp', adminUrl: '/reference-data/substitute-cancellation-reasons', navUsesAdmin: true },
				{ navUrl: '/notifications.asp', adminUrl: '/notifications', navUsesAdmin: true },
				{ navUrl: '/admin_createSubstituteAbsence.asp', adminUrl: '/abs-mgt/substitute-absences/create-substitute-absence', navUsesAdmin: true }
			];
		};

		var _basicAbsenceFlowMappingList = () => {
			return [
				{ navUrl: '/admin_selectworker.asp', adminUrl: '/abs-mgt/absences/create-absence', navUsesAdmin: false },
				{ navUrl: '/admin_selectVacProf.asp', adminUrl: '/abs-mgt/absences/create-vacancy', navUsesAdmin: false }
			];
		};

		var _basicApprovalMappingList = () => {
			return [
				{ navUrl: '/abs_ApproveList.asp', adminUrl: '/abs-mgt/absences/approve', navUsesAdmin: false }
			];
		};

		var _basicReconcileMappingList = () => {
			return [
				{ navUrl: '/admin_absence_approve.asp', adminUrl: '/abs-mgt/absences/reconcile', navUsesAdmin: false }
			];
		};

		var _basicAbsenceReasonMappingList = () => {
			return [
				{ navUrl: '/ref_enttlist.asp', adminUrl: '/reference-data/absence-reasons', navUsesAdmin: true }
			];
		};

		var absenceMappings = () => {
			const navUsesAdmin = _absenceModeIsAngular();
			//console.log("absenceMappings.navUsesAdmin: " + navUsesAdmin);

			return [

				// modify absence
				{
					navToAdmin: {
						match: {
							path: /^\/absencemodify\.asp/i,
							query: {
								editing: /action=edit/i,
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/edit',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/edit/i
						},
						route: '/absencemodify.asp?x=x&TB=Tab6&action=edit&absr={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				// view absence
				{
					navToAdmin: {
						match: {
							path: /^\/absencemodify\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/view',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/view/i
						},
						route: '/absencemodify.asp?x=x&TB=Tab6&absr={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},


				// create absence
				{
					navToAdmin: {
						match: {
							path: /^\/absencecreate\.asp/i,
							query: {
								workerId: /work(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/create-absence-details?workerId={workerId}',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/create-absence-details/i
						},
						route: '/admin_selectworker.asp',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//create vacancy
				{
					navToAdmin: {
						match: {
							path: /^\/absencecreate\.asp/i,
							query: {
								workerId: /work(?:_?id)?=(\d+)/i,
								isVacancy: /isVacancy=true/i
							}
						},
						route: '/abs-mgt/absences/create-vacancy-details?workerId={workerId}',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/create-vacancy-details/i
						},
						route: '/admin_selectVacProf.asp',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//absence log
				{
					navToAdmin: {
						match: {
							path: /^\/abs_absence_log\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/log/absence',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/log\/absence/i
						},
						route: '/abs_absence_log.asp?TB1=TAB2&TB2=&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//approval log
				{
					navToAdmin: {
						match: {
							path: /^\/abs_absence_log_approval\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/log/approver',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/log\/approver/i
						},
						route: '/abs_absence_log_approval.asp?TB1=TAB4&TB2=&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//call history
				{
					navToAdmin: {
						match: {
							path: /^\/abs_call_history\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/log/callhistory',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/log\/callhistory/i
						},
						route: '/abs_call_history.asp?TB1=TAB3&TB2=&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//available substitutes
				{
					navToAdmin: {
						match: {
							path: /^\/abs_sub_availability\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/availableSubstitutes',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/availableSubstitutes/i
						},
						route: '/abs_sub_availability.asp?TB1=TAB5&TB2=&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//approvers
				{
					navToAdmin: {
						match: {
							path: /^\/abs_Approvers\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/approvers',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/approvers/i
						},
						route: '/abs_Approvers.asp?TB1=TAB7&TB2=&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//attachments
				{
					navToAdmin: {
						match: {
							path: /^\/abs_absrAttachments\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/view',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/view/i
						},
						route: '/abs_absrAttachments.asp?TB1=TAB2&TB2=&CONFNUM={1}&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//allocation groups
				{
					navToAdmin: {
						match: {
							path: /^\/abs_allocationGroups\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/view',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/view/i
						},
						route: '/absencemodify.asp?x=x&TB=Tab6&absr={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//substitute rating
				{
					navToAdmin: {
						match: {
							path: /^\/te_feedback\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/feedback/worker',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/feedback\/worker/i
						},
						route: '/te_feedback.asp?TB2=TAB1&TB1=TAB11&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				//substitute experience
				{
					navToAdmin: {
						match: {
							path: /^\/sub_feedback\.asp/i,
							query: {
								absrId: /absr(?:_?id)?=(\d+)/i
							}
						},
						route: '/abs-mgt/absences/detail/{absrId}/feedback/substitute',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/absences\/detail\/(\d+)\/feedback\/substitute/i
						},
						route: '/sub_feedback.asp?TB2=TAB2&TB1=TAB11&ABSR={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				},

				// create substitute absence details (deep link with substitute ID)
				{
					navToAdmin: {
						match: {
							path: /^\/admin_createsubstituteabsencedetails\.asp/i,
							query: {
								subId: /sub_id=(\d+)/i
							}
						},
						route: '/abs-mgt/substitute-absences/create-substitute-absence-details?subId={subId}',
						autoRedirectFor: [userType.csRep, userType.org, userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/substitute-absences\/create-substitute-absence-details/i,
							query: {
								subId: /subId=(\d+)/i
							}
						},
						route: '/admin_createsubstituteabsencedetails.asp?sub_id={subId}',
						autoRedirectFor: []
					}
				}
			];
		};

		var reportMappings = () => {
			return _basicReportMappingList().map(function (basicReport) {
				return {
					navToAdmin: {
						match: {
							path: /^\/reports\.asp/i,
							query: { report: new RegExp('report=' + basicReport.navReportName + '$', 'i') }
						},
						route: '/abs-mgt/reports/' + basicReport.adminReportPath,
						autoRedirectFor: (basicReport.navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: new RegExp('^/abs-mgt/reports/' + basicReport.adminReportPath, 'i')
						},
						route: '/reports.asp?report=' + basicReport.navReportName,
						autoRedirectFor: (basicReport.navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				};
			});
		};

		var approvalMappings = () => {
			const navUsesAdmin = featureSvc.get(approvalFeature).enabled;
			return _basicApprovalMappingList().map((urlMap) => _basicMappingFunction(urlMap, navUsesAdmin));
		};

		var reconcileMappings = () => {
			const navUsesAdmin = featureSvc.get(reconcileFeature).enabled;
			return _basicReconcileMappingList().map((urlMap) => _basicMappingFunction(urlMap, navUsesAdmin));
		};

		var absenceFlowMappings = () => {
			const navUsesAdmin = _absenceModeIsAngular();
			return _basicAbsenceFlowMappingList().map((urlMap) => _basicMappingFunction(urlMap, navUsesAdmin));
		};

		var basicMappings = () => {
			return _basicUrlMappingList().map((urlMap) => _basicMappingFunction(urlMap));
		};

		var absenceReasonMappings = () => {
			const absenceReasonFeature = 'ReactReferenceDataAbsenceReasonForOU';
			const navUsesAdmin = !featureSvc.get(absenceReasonFeature).enabled;
			return _basicAbsenceReasonMappingList()
				.map((urlMap) => _basicMappingFunction(urlMap, navUsesAdmin))
				.concat([{
					navToAdmin: {
						match: {
							path: /^\/Ref_EnttEdit\.asp/i,
							query: {
								view: /action=(view|edit)/i,
								id: /id=(\d+)/i
							}
						},
						route: '/reference-data/absence-reasons/{id}',
						autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
					},
					adminToNav: {
						match: {
							path: /^\/reference-data\/absence-reasons\/(\d+)/i
						},
						route: '/Ref_EnttEdit.asp?action=view&id={1}',
						autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
					}
				}]);
		};

		var dashboardMapping = (d) => {
			return [{
				navToAdmin: {
					match: {
						path: /^\/(nav_default\.asp|Dashboard\.aspx)/i
					},
					route: '/',
					autoRedirectFor: [userType.campus]
				},
				adminToNav: {
					match: {
						path: /^\/$/i
					},
					route: '/' + d.defaultPage,
					autoRedirectFor: [userType.csRep, userType.org]
				}
			}];
		};

		var reportConfigMapping = () => {
			const navUsesAdmin = false;
			return [{
				navToAdmin: {
					match: {
						path: /^\/reportConfigSummary\.asp|reportExecutionDetails\.asp/i,
						query: {
							rc_id: /rc_id=(\d+)/i
						}
					},
					route: '/abs-mgt/reports/report-writer/{rc_id}/view',
					autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
				},
				adminToNav: {
					match: {
						path: /^\/reports\/report-writer\/(\d+)\/view/i
					},
					route: '/reportConfigSummary.asp?rc_id={0}',
					autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
				}
			}];
		};

		var feedbackMapping = () => {
			const navUsesAdmin = _absenceModeIsAngular();
			//console.log("feedbackMapping.navUsesAdmin: " + navUsesAdmin);

			return [{
				//Feedback from a Teacher about a Substitute
				navToAdmin: {
					match: {
						path: /^\/te_feedback\.asp/i,
						query: {
							id: /absr=(\d+)/i
						}
					},
					route: '/abs-mgt/absences/detail/{id}/feedback/substitute',
					autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
				},
				adminToNav: {
					match: {
						path: /^\/absences\/detail\/(\d+)\/feedback\/substitute/i
					},
					route: '/te_feedback.asp?TB2=TAB1&TB1=TAB11&ABSR={1}',
					autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
				}
			}, {
				//Feedback from a Substitute about a Teacher
				navToAdmin: {
					match: {
						path: /^\/sub_feedback\.asp/i,
						query: {
							id: /absr=(\d+)/i
						}
					},
					route: '/abs-mgt/absences/detail/{id}/feedback/worker',
					autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
				},
				adminToNav: {
					match: {
						path: /^\/absences\/detail\/(\d+)\/feedback\/worker/i
					},
					route: '/sub_feedback.asp?TB2=TAB2&TB1=TAB11&ABSR={1}',
					autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
				}
			}];
		};

		var searchMapping = () => {
			const navUsesAdmin = true;
			return [{
				navToAdmin: {
					match: {
						path: /^\/search\.asp/i,
						query: {
							searchFor: /searchFor=(.+)/i
						}
					},
					route: '/search/search?searchFor={searchFor}',
					autoRedirectFor: (navUsesAdmin) ? [userType.csRep, userType.org, userType.campus] : [userType.campus]
				},
				adminToNav: {
					match: {
						path: /^\/search\/search\/(\w+)/i
					},
					route: '/search.asp?searchFor={0}',
					autoRedirectFor: (navUsesAdmin) ? [] : [userType.csRep, userType.org]
				}
			}];
		};

		var combineMappings = () => {
			var user = userSvc.getUserData();
			var absenceMappingsList = absenceMappings();
			var reportMappingsList = reportMappings();
			var basicMappingsList = basicMappings();
			var absenceFlowMappingList = absenceFlowMappings();
			var approvalMappingsList = approvalMappings();
			var reconcileMappingList = reconcileMappings();
			var absenceReasonMappingList = absenceReasonMappings();
			var dashboardMappingsList = dashboardMapping(user);
			var reportConfigMappingsList = reportConfigMapping();
			var feedbackMappingsList = feedbackMapping();
			var searchMappingList = searchMapping();
			console.log(absenceFlowMappingList)
			urlMappings = absenceMappingsList
				.concat(reportMappingsList)
				.concat(approvalMappingsList)
				.concat(reconcileMappingList)
				.concat(absenceFlowMappingList)
				.concat(basicMappingsList)
				.concat(absenceReasonMappingList)
				.concat(dashboardMappingsList)
				.concat(reportConfigMappingsList)
				.concat(feedbackMappingsList)
				.concat(searchMappingList)
				;
		}


		$q.all([userSvc.ready, featureSvc.ready, orgSvc.ready]).then(function (data) {
			//debugger;
			combineMappings();

			_defer.resolve();
		}, function () {
			_defer.reject();
		});

		const getMappings = () => {
			return urlMappings;
		};

		return {
			ready: _defer.promise,
			rebuildMappings: combineMappings,
			getMappings
		};

	});
	// #--- END Service (navUrlProviderSvc) ---# //
	// #---------------------------------------# //
}());
