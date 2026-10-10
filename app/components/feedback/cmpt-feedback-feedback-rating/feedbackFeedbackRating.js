(function() {'use strict';angular.module('aesop')
.directive('cmptFeedbackFeedbackRating', function () {return {

// directive options
restrict: 'E',
scope: {
	rating: '=',
	editMode: '=',
	feedbackAboutSubstitute: '='
},
replace: true,
templateUrl: '/components/feedback/cmpt-feedback-feedback-rating/feedbackFeedbackRating.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-feedback-feedback-rating) ----# //
controller: function ($scope, stringSvc) {

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'FeedbackRating',
		'FeedbackRating1',
		'FeedbackRating2',
		'FeedbackRating3',
		'FeedbackRating4',
		'FeedbackRating5'
	]);

	var ratingLabels = {
		0: '',
		1: strings['FeedbackRating1'],
		2: strings['FeedbackRating2'],
		3: strings['FeedbackRating3'],
		4: strings['FeedbackRating4'],
		5: strings['FeedbackRating5']
	};

	// View Model properties
	var vm = $scope.vm = {
		starRating: $scope.rating,
		starColor: $scope.feedbackAboutSubstitute ? 'blue' : 'yellow',
		ratingText: ratingLabels[$scope.rating || 0]
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		updateStars: function (event, value) {
			if ($scope.editMode && value != null) {
				vm.starRating = value;
			}
		},
		rated: function(){
			if ($scope.editMode) {
				$scope.rating = vm.starRating;
			}
		}
	};

	$scope.$watch('vm.starRating', function (val) {
		vm.ratingText = ratingLabels[val];
	});
	$scope.$watch('rating', function (val) {
		//if ($scope.editMode) {
		vm.starRating = val;
		//}
	});
}

// #-- END Component (cmpt-feedback-feedback-rating) --# //
// #---------------------------------------------------# //
};});}());