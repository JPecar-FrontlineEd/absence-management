(function () {
	'use strict'; angular.module('aesop')
		.controller('SplitCtrl', function ($scope, $state, $filter, absrStateVal, stringSvc, shiftTypesSvc, ngDialog, absenceRequestApi, absrSvc, toastHelp, dateHelp, cancellationReasonApi, featureSvc) {
			// #-------------------------# //
			// #------- SplitCtrl -------# //

			// this is a route controller
			var route = this;
			var absrState = route.absrState = absrStateVal;
			var isVacancy = absrState.worker.isVacancy;
			route.angularSplitAbsences = featureSvc.get("AngularSplitAbsences").enabled;

			var strings = $scope.strings = stringSvc.getStrings([
				'Substitute',
				'From',
				'Remove',
				'Cancel',
				'Absense.Label.Text.CancellationReasons',
				'Absence.Button.Text.SplitAbsence',
				'SplitAbsence.ConfirmSplit.Button.Save',
				'SplitAbsence.IndividualDays',
				'SplitAbsence.AtDate',
				'Absence.StartAndEndTime',
				'SplitAbsence.IntoSingleAbsence',
				'SplitVacancy.IntoSingleVacancy',
				'SplitAbsence.IntoSeparateAbsences',
				'SplitVacancy.IntoSeparateVacancies',
			]);

			var mnemonic = $scope.mnemonic = {
				splitButton: isVacancy ? 'SplitVacancy.Header.Button.Create' : route.angularSplitAbsences ? 'Continue' : 'SplitAbsence.Header.Button.Create',
				splitButtonConfrim: isVacancy ? 'SplitVacancy.ConfirmSplit.Button.Save' : 'SplitAbsence.ConfirmSplit.Button.Save',
				splitConfirmHeader: isVacancy ? 'SplitVacancy.ConfirmSplit.Dialog.Title' : 'SplitAbsence.ConfirmSplit.Dialog.Title',
				splitConfirmBody: isVacancy ? 'SplitVacancy.ConfirmSplit.Dialog.Message' : 'SplitAbsence.ConfirmSplit.Dialog.Message',
				splitConfirmSeparateBody: isVacancy ? 'SplitVacancy.SeperateVacancy.Dialog.Body' : 'SplitAbsence.SeperateAbsence.Dialog.Body',
				splitSuccessMsg: isVacancy ? 'SplitVacancy.MessageBar.Success.Message' : 'SplitAbsence.MessageBar.Success.Message',
				splitSuccessTitle: isVacancy ? 'SplitVacancy.MessageBar.Success.Title' : 'SplitAbsence.MessageBar.Success.Title',
				splitRemoveSub: isVacancy ? 'SplitVacancy.RemoveSub.Label' : 'SplitAbsence.RemoveSub.Label',
				splitRemoveSubs: route.angularSplitAbsences ?
					isVacancy ? 'SplitVacancy.RemoveSubstitute.PluralLabel' : 'SplitAbsence.RemoveSubstitute.PluralLabel' :
					isVacancy ? 'SplitVacancy.RemoveSub.Label' : 'SplitAbsence.RemoveSub.Label',
				splitIntoSingle: isVacancy ? strings['SplitVacancy.IntoSingleVacancy'] : strings['SplitAbsence.IntoSingleAbsence'],
				splitIntoSeparate: isVacancy ? strings['SplitVacancy.IntoSeparateVacancies'] : strings['SplitAbsence.IntoSeparateAbsences']
			};
			var dialog = {};

			// View Model properties
			var vm = $scope.vm = {
				cancellationReasons: [],
				cancellationReason: 0
			};

			cancellationReasonApi.queryCached().then(function (reasons) {
				vm.cancellationReasons = reasons.map(function (v, i, a) {
					return { id: v.id, value: v.description };
				});
			});

			route.strings = stringSvc.getStrings(
				// use the cancel mnemonic and all the dynamic mnemonics
				['Cancel'].concat(Object.keys(mnemonic).map(function (k) { return mnemonic[k]; }))
			);
			var splitButton = {
				removeSub: vm.removeSub,
				isSingleAbsence: vm.isSingleAbsence,
				title: mnemonic.splitButton,
				cls: 'fl-disabled',
				icon: 'pull-left fa-check',
				action: function () {
					if (splitButton.cls === 'fl-primary') {
						let selectedDates;
						if (route.vm.splitIndividual) {
							selectedDates = route.vm.selectedIndividual.map(function (abs) {
								return { id: abs.id, date: $filter('date')(new Date(abs.date), 'fullDate') };
							});
						} else {
							selectedDates = route.vm.datasetSingleSelect.map(function (abs) {
								return { id: abs.id, date: $filter('date')(new Date(abs.date), 'fullDate') };
							});
							selectedDates = selectedDates.filter(function (abs) {
								return new Date(abs.date) >= route.vm.selectedSplitAt.date;
							});
						}
						dialog = ngDialog.open({
							template: '/global/modals/available-sub-split-remove-options.html',
							closeByDocument: false,
							className: 'ngdialog-theme-default large-dialog',
							data: {
								isSingleAbsence: route.vm.isSingleAbsence,
								splitIndividual: route.vm.splitIndividual,
								removeSubLabel: route.vm.isSingleAbsence ? route.vm.strings[mnemonic.splitRemoveSub] : route.vm.strings[mnemonic.splitRemoveSubs],
								removeSub: splitButton.removeSub,
								header: route.strings[mnemonic.splitConfirmHeader],
								body: route.strings[route.vm.isSingleAbsence || !route.vm.splitIndividual ? mnemonic.splitConfirmBody : mnemonic.splitConfirmSeparateBody],
								selectedDates: selectedDates,
								cancellationReasons: vm.cancellationReasons,
								buttons: [{
									title: route.strings['SplitAbsence.ConfirmSplit.Button.Save'],
									cls: 'fl-button fl-positive',
									loading: false,
									action: function () {
										if (!this.loading) {
											this.loading = true;
										}
									}
								}, {
									title: route.strings['Cancel'],
									cls: 'fl-button',
									action: function () {
										ngDialog.close(dialog.id);
									}
								}]
							}
						});
					}
				}
			};

			// View Model properties
			route.vm = {
				buttons: [{
					title: route.strings['Cancel'],
					cls: '',
					icon: '',
					action: function () {
						this.icon = 'fa-spinner fa-spin';
						exitSplitMode();
					}
				}, splitButton],
				datasetMultiselect: route.absrState.absr.absences.map(function (absence) {
					return {
						id: absence.id,
						date: new Date(absence.date),
						dateString: $filter('date')(new Date(absence.date), 'fullDate'),
						absenceStartAndEndTime: `${dateHelp.convertTo12HourFormat(absence.absenceStartTime)}  -  ${dateHelp.convertTo12HourFormat(absence.absenceEndTime)}`,
						institution: absence.institution.name
					};
				}),
				datasetSingleSelect: route.absrState.absr.absences.map(function (absence) {
					return {
						id: absence.id,
						date: new Date(absence.date),
						dateString: $filter('date')(new Date(absence.date), 'fullDate'),
						absenceStartAndEndTime: `${dateHelp.convertTo12HourFormat(absence.absenceStartTime)}  -  ${dateHelp.convertTo12HourFormat(absence.absenceEndTime)}`,
						institution: absence.institution.name
					};
				}),
				columnsMultiSelect: [{
					key: 'date', name: 'Date',
					labelFor: 'uicheckcol',
					width: '7/24',
					sortable: false,
					defaultSort: 'asc',
					template: '<strong once-text="row.dateString"></strong>'
				}, {
					key: 'absenceStartAndEndTime', name: 'Absence.StartAndEndTime',
					width: '4/24',
					sortable: false
				}, {
					key: 'institution', name: 'SplitAbsence.Table.Heading.Location',
					width: '13/24',
					sortable: false
				}],
				columnsSingleSelect: [{
					key: 'date', name: 'Date',
					labelFor: 'uicheckcol',
					width: '7/24',
					sortable: false,
					defaultSort: 'asc',
					template: '<strong once-text="row.dateString"></strong>'
				}, {
					key: 'absenceStartAndEndTime', name: 'Absence.StartAndEndTime',
					width: '4/24',
					sortable: false
				}, {
					key: 'institution', name: 'SplitAbsence.Table.Heading.Location',
					width: '13/24',
					sortable: false
				}],
				selectedIndividual: [],
				selectedSplitAt: null,
				removeSub: false,
				splitIndividual: true,
				isSingleAbsence: true,
				singleSelectIdPrefix: 'splitSingle',
				multiSelectIdPrefix: 'splitMulti',
				strings: angular.extend({}, strings, route.strings)
			};

			//////////////////////////////////////////////////////////////////////////////////
			// Actions that can be bound to from the view
			route.go = {
			};
			//////////////////////////////////////////////////////////////////////////////////
			function exitSplitMode() {
				if (absrState.editMode) {
					$state.go('base.detail.edit');
				} else {
					$state.go('base.detail.view');
				}
			}

			function atLeastOneSelected() {
				if (route.vm.splitIndividual) {
					if (route.vm.selectedIndividual.length > 0 && route.vm.selectedIndividual.length !== route.vm.datasetMultiselect.length)
						splitButton.cls = 'fl-primary';
					else
						splitButton.cls = 'fl-disabled';
				} else {
					if (route.vm.selectedSplitAt)
						splitButton.cls = 'fl-primary';
					else
						splitButton.cls = 'fl-disabled';
				}
			}

			$scope.$watchCollection('route.vm.selectedIndividual', atLeastOneSelected);
			$scope.$watch('route.vm.selectedSplitAt', atLeastOneSelected);
			$scope.$watch('route.vm.splitIndividual', atLeastOneSelected);
			$scope.$watchCollection('route.vm.removeSub', function (remove) {
				splitButton.removeSub = remove;
			});

			$scope.$on('$destroy', function () {
				if (absrState.editMode && absrState.id != null) {
					var unlockAbsr = absenceRequestApi.unlock({ absrid: absrState.id });
					unlockAbsr.then(function (data) {

					}, function (reasons) {

						toastHelp.error(reasons.$messages, 'Error');
					});
				}
			});

			// #----- END SplitCtrl -----# //
		});
}());
