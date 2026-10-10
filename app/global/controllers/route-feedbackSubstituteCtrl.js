(function() {'use strict';angular.module('aesop')
.controller('FeedbackSubstituteCtrl', function ($stateParams, $scope, absrSvc, permissionSvc, absrStateVal, reportHelp) {
// #--------------------------------------# //
// #------- FeedbackSubstituteCtrl -------# //

	// this is a route controller
	var route = this;

	var absrState = $scope.absrState = absrStateVal;
	//redirect to 403 if access to feedback should not be allowed yet
	var canViewFeedback = permissionSvc.iHave('Feedback.View') || permissionSvc.iHave('ABSRFeedBk.ViewFeedBack');
	var afterAbsenceStart = reportHelp.DayDiff(new Date(absrSvc.earliestAbsenceDate()), new Date()) > 0;
	if (!canViewFeedback) {
		$scope.$emit('show-403');
	}

	// View Model properties
	route.vm = {
		editMode: $stateParams.editMode || false,
		isProcessing: false,
		hasSubstitute: absrState.substitute !== null,
		afterAbsenceStart: afterAbsenceStart
	};

	// Actions that can be bound to from the view
	route.go = {
		someAction: function () {
			route.vm.property = 'something';
		}
	};

// #----- END FeedbackSubstituteCtrl -----# //
});}());