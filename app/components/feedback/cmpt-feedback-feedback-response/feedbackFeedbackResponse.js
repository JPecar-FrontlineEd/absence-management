(function() {'use strict';angular.module('aesop')
.directive('cmptFeedbackFeedbackResponse', function () {return {

// directive options
restrict: 'E',
scope: {
	editMode:'=',
	feedbackAboutSubstitute: '=',
	isProcessing: '='
},
replace: true,
templateUrl: '/components/feedback/cmpt-feedback-feedback-response/feedbackFeedbackResponse.html',

// #-----------------------------------------------------# //
// #---- Component (cmpt-feedback-feedback-response) ----# //
controller: function ($scope, $filter, $location, stringSvc, stringHelp, feedbackSvc, permissionSvc, absrStateVal, ngDialog, $templateCache) {

	var absrState = $scope.absrState = absrStateVal;
	var isVacancy = $scope.isVacancy = absrState.worker.isVacancy;
	var feedbackAboutSubstitute = $scope.feedbackAboutSubstitute;
	var answers = feedbackSvc.getAnswers(feedbackAboutSubstitute);
	var rating = feedbackSvc.getRating(feedbackAboutSubstitute);
	var canViewRating = (feedbackAboutSubstitute) ?
						(permissionSvc.iHave('Feedback.ViewSubRating') || permissionSvc.iHave('ABSRFeedBk.ViewSubPerfScore'))
						: (permissionSvc.iHave('Feedback.View') || permissionSvc.iHave('ABSRFeedBk.ViewSubExpFeedBack'));
	var feedbackSurveyPromise = feedbackSvc.setSurvey(feedbackAboutSubstitute);

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'FeedbackRatingInstructionsForEmp',
		'FeedbackRatingInstructionsForSub',
		'NoFeedbackLeft',
		'NoResponse',
		'Dialog.Text.FeedbackChangeConfirm',
        'Dialog.Title.UnsavedChangesConfirmation',
        'Save',
        'Cancel',
        'AnswerTheFollowingQuestions',
        'QuestionsMarkedWithAnAreRequired'
	]);

	// View Model properties
	var vm = $scope.vm = {
		loadingQuestions: false,
		expanded: false,
		showSummary: true,
		absences: feedbackSvc.getAbsences(),
		absenceVariation: feedbackSvc.getVariations(),
		servey: null,
		instructionText: feedbackAboutSubstitute ? strings['FeedbackRatingInstructionsForEmp'] : strings['FeedbackRatingInstructionsForSub'],
		feedbackExists: feedbackSvc.hasFeedback(feedbackAboutSubstitute),
		canViewRating: canViewRating || (!feedbackSvc.hasFeedback(feedbackAboutSubstitute) && $scope.editMode),
		requiredText: stringHelp.replace(strings['QuestionsMarkedWithAnAreRequired'],'{0}','<span class="required-icon">*</span>')
	};

	vm.expanded = vm.absences.length === 1;
	$scope.isProcessing = true;
	feedbackSurveyPromise.then(function(survey){
		vm.servey = survey;
		$scope.isProcessing = false;
	}, function(){
		$scope.isProcessing = false;
	});

	// Actions that can be bound to from the view
	var go = $scope.go = {
		toggle: function  () {
			if(vm.absences.length > 1){
				vm.expanded = !vm.expanded;
			}
		}
	};


	$scope.$watch('absrState.lastUpdated', function (updatedOn) {
		vm.feedbackExists = feedbackSvc.hasFeedback(feedbackAboutSubstitute);
    });


	$scope.$watch('editMode', function (editMode) {
		if (editMode) {
			feedbackSurveyPromise.then(function(){
            	feedbackSvc.backupFeedback(feedbackAboutSubstitute);
            });
       	}
    });

    function confirmNavigateAway(newUrl) {
        var dialog = ngDialog.open({
            template:'/global/modals/absr-warning.html',
            closeByDocument: false,
            closeByNavigation: true,
            showClose: false,
            data: {
                header: strings['Dialog.Title.UnsavedChangesConfirmation'],
                warning:{
                    message: strings['Dialog.Text.FeedbackChangeConfirm']
                },
                buttons: [{
                    title: strings['Save'],
                    cls:'fl-button fl-positive',
                    icon: '',
                    loading: false,
                    action:  function(){
                        var button = this;
                        if(!button.loading){
                            button.loading = true;
                            var saveFeedback = feedbackSvc[(feedbackAboutSubstitute) ? 'saveFeedbackAboutSubstitute' :'saveFeedbackFromSubstitute']();
                            saveFeedback.then(function (){
                                $scope.editMode = false;
                                button.loading = false;
                                ngDialog.close(dialog.id);
                                redirect(newUrl);
                            }, function(){
                                button.loading = false;
                                ngDialog.close(dialog.id);
                            });
                        }
                    }
                },{
                    title: strings['Cancel'],
                    cls:'fl-button',
                    icon:'',
                    loading: false,
                    action: function(){
                        ngDialog.close(dialog.id);
                    }
                }]
            }
        });
    }

    $scope.$on('$locationChangeStart', function (event, newUrl) {
        if (!$scope.editMode) { return; }
        if (feedbackSvc.hasBackup(feedbackAboutSubstitute) && feedbackSvc.isDirty(feedbackAboutSubstitute)){
            confirmNavigateAway(newUrl);
            event.preventDefault();
        }
        return;		    
    });

    function redirect(newUrl) {
        $location.path(newUrl.substring($location.absUrl().length - $location.url().length));
    }

}

// #-- END Component (cmpt-feedback-feedback-response) --# //
// #-----------------------------------------------------# //
};});}());
