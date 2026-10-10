(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateFeedbackRating', function () {return {

// directive options
restrict: 'E',
scope: {
	averageScore:'=',
	totalNumberOfRating:'=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-feedback-rating/templateFeedbackRating.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-template-feedback-rating) ----# //
controller: function ($scope, stringSvc) {

	var hideTitle = $scope.totalNumberOfRating == null
	// View Model properties
	var vm = $scope.vm = {
		title: hideTitle ? '' : $scope.averageScore + ' (' + $scope.totalNumberOfRating + ' responses)'
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};
}

// #-- END Component (cmpt-template-feedback-rating) --# //
// #---------------------------------------------------# //
};});}());