(function() {'use strict';angular.module('aesop')
.directive('cmptCallGroupAddSubstitutes', function () {return {

// directive options
restrict: 'E',
scope: {
	preferredSubs: '=',
	show: '=',
	callGroupId: '@',
	addingSubs: '='
},
replace: true,
templateUrl: '/components/call-group/cmpt-call-group-add-substitutes/callGroupAddSubstitutes.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-call-group-add-substitutes) ----# //
controller: function ($scope, $q, stringSvc, permissionSvc, schoolDetailsVal, callGroupApi, toastHelp, arrayHelp, $timeout,orgSvc) {

	var fetchAmt = 50;
	var resultsTimer = null, lastRequest;
	var addingSubsToPreferredList = $scope.preferredSubs;
	var callGroupId = $scope.callGroupId;
	var orgData = orgSvc.getOrgData();
	var canViewSubPerfScore = (orgData[0].settings.workLeaveFeedback ||
                            orgData[0].settings.workViewSubstituteAverageFeedbackScore ||
                            orgData[0].settings.subViewFeedback) &&
                            permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore');

	function getCancelTextMnemonic() {
		if (!!vm && vm.currentMode == vm.pageMode.commentEntry)
			return 'Cancel';
		return addingSubsToPreferredList ? 'PrefSubs.Button.Text.BackToPreferredSubstitute' : 'ExcludedSubs.Button.Text.BackToExcludedSubstitutes';
	}

	var cancelTextMnemonic = getCancelTextMnemonic();
	var addTextMnemonic = addingSubsToPreferredList ? 'PrefSubs.Button.Text.AddTpPreferredSubstitute' : 'ExcludedSubs.Button.Text.AddToExcludedSubstitutes';

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		cancelTextMnemonic, addTextMnemonic,
		'EligibleSub.Text.SelectedSubstitutes',
		'EligibleSub.Text.CurrentlyNoSubstituteSelected',
		'Search',
		'LastName',
		'Absence.Create.Select.SearchByLetter',
		'All',
		'Report.Label.NoRating',
		'AvailableSub.Text.LoadMore',
		'EligibleSub.Text.NoSubstitutesFound',
		'Cancel'
	]);

	// View Model properties
	var vm = $scope.vm = {
		loading: false,
		loadingMoreSubs: false,
		savingSubs: false,
		cancelTextMnemonic: cancelTextMnemonic,
		addTextMnemonic: addTextMnemonic,
		searchLetter: '',
		searchText: '',
		filter: null,
		selectedSubs: [],
		availableSubs: [],
		moreSubsAvailable: false,
		offset: 0,
		callGroupId: callGroupId,
		preferredSubs: addingSubsToPreferredList,
		requireCommentsWhenExcludingSubs: !addingSubsToPreferredList
					&& schoolDetailsVal.requireCommentsWhenExcludingSubs,
		pageMode: {
			subSelection: 0,
			commentEntry: 1,
		},
		shouldShowAddSubsButton: function() {
			var result = addingSubsToPreferredList
				|| (vm.currentMode==vm.pageMode.commentEntry && vm.requireCommentsWhenExcludingSubs)
				|| (vm.currentMode==vm.pageMode.subSelection && !vm.requireCommentsWhenExcludingSubs);
			return result;
		},
		characters: (function () {
			var arr = [];
			for (var i = 65; i <= 90; i++) {
				arr.push(String.fromCharCode(i));
			}
			return arr;
		}()),
		columns: [
			{
				key: 'name',
				name: 'AvailableSub.Templ.text.SubstituteName',
				width: '24/24',
				template: '<cmpt-template-substitute-link substitute-id="{{row.id}}" substitute-name="{{row.fullName}}"></cmpt-template-substitute-link>' +
					'<cmpt-template-feedback-rating ng-if="row.canViewSubPerfScore" average-score="row.feedBackScore" total-number-of-rating="row.feedBackTotal"></cmpt-template-feedback-rating>' +
					'<div class="no-rating" ng-if="row.feedBackScore <= 0 && row.canViewSubPerfScore">('+ strings['Report.Label.NoRating'] +')</div>'
			}
		]
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		setLetter: function (letter) {
			vm.searchText = '';
			vm.searchLetter = letter;
		},
		loadMoreSubs: function() {
			if (vm.loadingMoreSubs === false) {
				vm.loadingMoreSubs = true;
				fetchEligibleSubs(vm.offset, vm.filter).then(function(subList){
					processResults(subList);
				});
			}
		},
		removeSub: function(sub) {
			sub.selected = false;
			//remove this sub from the selected list
			var selectedIds = vm.selectedSubs.map(function (s) { return s.id; });
			var index = selectedIds.indexOf(sub.id);
			if (index > -1 && selectedIds.length > 0) {
				vm.selectedSubs.splice(index, 1);
			}
			//set this sub to not selected in the dataset
			var currentSub = vm.availableSubs.filter(function (s){ return s.id === sub.id; });
			if (currentSub.length > 0) {
				var subIndex = vm.availableSubs.indexOf(currentSub[0]);
				vm.availableSubs[subIndex].selected = false;
			}
		},
		executeNextStep: function(form) {
			if (form.$invalid) {
				return;
			}
			if (vm.currentMode == vm.pageMode.commentEntry) {
				tryAddSubstitutesToCallGroup();
			}
			if (vm.currentMode == vm.pageMode.subSelection) {
				if (vm.requireCommentsWhenExcludingSubs) {
					enterRequiredCommentsMode();
				} else {
					tryAddSubstitutesToCallGroup();
				}
			}
		},
		executeCancelStep: function() {
			if (vm.currentMode == vm.pageMode.subSelection) {
				cancelSubSelectionMode();
			}
			if (vm.currentMode == vm.pageMode.commentEntry) {
				cancelRequiredCommentsMode();
			}
		},
	};


	function enterRequiredCommentsMode() {
		if (vm.selectedSubs.length !== 0 && vm.savingSubs === false) {
			vm.currentMode = vm.pageMode.commentEntry;
			vm.cancelTextMnemonic = getCancelTextMnemonic();

			
		}
	}

	function cancelRequiredCommentsMode() {
		vm.currentMode = vm.pageMode.subSelection;
		vm.cancelTextMnemonic = getCancelTextMnemonic();
	}

	function cancelSubSelectionMode() {
		$scope.show = false;
	}

	function processResults(data) {
		vm.availableSubs = vm.availableSubs.concat(
			data.map(function(d){
				d.fullName = d.lastName + ', ' + d.firstName;
	            if (d.middleName !== ''){
	                d.fullName += ' ' + d.middleName;
	            }

				d.group = d.lastName[0] != null ? d.lastName[0].toUpperCase() : '';

				d.hasFeedback = d.absenceFeedback != null;
				d.canViewSubPerfScore = canViewSubPerfScore;
				d.feedBackScore = d.absenceFeedback != null ? d.absenceFeedback.avgScore : 0;
				d.feedBackTotal = d.absenceFeedback != null ? d.absenceFeedback.numberOfRatings: 0;
				return d;
			})
		).sort(arrayHelp.multiLevelSort(['group','lastName','firstName']));
	}

	function fetchEligibleSubs(offset, mask){
		var _defer = $q.defer();
		if (vm.availableSubs.length === 0) { vm.loading = true; }

		if (mask == null) {mask = '';}

		var req = lastRequest = callGroupApi.getEligibleSubs({
			id: callGroupId,
			maxRecords: fetchAmt,
			offSet: offset,
			forPreferredList:
			addingSubsToPreferredList,
			mask: mask
		},function (u, getResponseHeaders){
			if(getResponseHeaders().nextoffset){
				vm.offset = parseInt(getResponseHeaders().nextoffset);
			}
		});

		req.then(
			// success
			function(subs) {
				vm.moreSubsAvailable = subs.$status === 206;
				vm.loading = vm.loadingMoreSubs = false;
				_defer.resolve(subs);
			},
			// failure
			function (reason) {
				if (!req.$aborted) {
					vm.loading = vm.loadingMoreSubs = false;
					toastHelp.error(reason.$messages, 'Error');
				}
				_defer.reject(reason);
			}
		);

		return _defer.promise;
	}

	function setDefaultState() {
		vm.offset = 0;
		vm.searchLetter = '';
		vm.searchText = '';
		vm.filter = null;
		vm.moreSubsAvailable = false;
		vm.currentMode = vm.pageMode.subSelection;
	}

	function tryAddSubstitutesToCallGroup() {
		if (vm.selectedSubs.length !== 0 && vm.savingSubs === false) {
			$scope.addingSubs = true;
			addSubstitutesToCallGroup().then(function(){
				vm.selectedSubs = [];
				$scope.addingSubs = false;
				$scope.show = false;
			});
		}
	}

	function addSubstitutesToCallGroup(){
		var _defer = $q.defer();

		//massage the selected subs list into a call group preference object
		var callGroupPreferencesToSave = vm.selectedSubs.map(function(ss){
			var newPref = {
			 	id: 0,
				substitute: { id: ss.id },
				commentsExcluded: ss.commentsExcluded,
				comments: ss.comments,
				excluded: !addingSubsToPreferredList
			};
			return newPref;
		});

		vm.loading = vm.savingSubs = true;

		callGroupApi.upsertPreferences({'id': callGroupId},callGroupPreferencesToSave)
			.then(function() {
				vm.loading = vm.savingSubs = false;
				return _defer.resolve();
			}, function (reason) {
				vm.loading = vm.savingSubs = false;
				toastHelp.error(reason.$messages, 'Error');
				return _defer.reject(reason);
			});

		return _defer.promise;
	}

	$scope.$watch('show', function(show){
		if (show) {
			fetchEligibleSubs(vm.offset).then(function(subList){
				processResults(subList);
			});
		} else {
			setDefaultState();
			vm.availableSubs = [];
			vm.selectedSubs = [];
		}
	});


	$scope.$watchGroup(['vm.searchLetter', 'vm.searchText'], function(nValues, oValues){
		var searchLetter = nValues[0],
			searchText = nValues[1],
			search;

		if (searchText.length > 0) {
			vm.searchLetter = '';
			search = searchText;
		} else {
			search = searchLetter;
		}

		// cancel the previous request if it can be
		if (lastRequest && lastRequest.$abort) { lastRequest.$abort(); }

		if ($scope.show) {
			vm.availableSubs = [];
			vm.filter = search;
			fetchEligibleSubs(0, vm.filter).then(function (subList) {
				processResults(subList);
			});
		}
	});

}

// #-- END Component (cmpt-call-group-add-substitutes) --# //
// #-----------------------------------------------------# //
};});}());