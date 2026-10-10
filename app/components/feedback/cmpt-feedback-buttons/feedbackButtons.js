(function() {'use strict';angular.module('aesop')
.directive('cmptFeedbackButtons', function () {return {

// directive options
restrict: 'E',
scope: {
	editMode: '=',
	feedbackAboutSubstitute: '=',
	isProcessing: '=',
	hasSubstitute: '=',
	afterAbsenceStart: '=',
	showErrors: '='
},
replace: true,
templateUrl: '/components/feedback/cmpt-feedback-buttons/feedbackButtons.html',

// #-------------------------------------------# //
// #---- Component (cmpt-feedback-buttons) ----# //
controller: function ($scope, $q, absrStateVal, stringSvc,feedbackSvc, permissionSvc, absenceRequestApi, toastHelp, ngDialog) {

	var absrState = $scope.absrState = absrStateVal;
	var feedbackAboutSubstitute = $scope.feedbackAboutSubstitute;
	var answers = feedbackSvc.getAnswers(feedbackAboutSubstitute);
	var rating = feedbackSvc.getRating(feedbackAboutSubstitute);

	var canAdd = (feedbackAboutSubstitute) ?
					(permissionSvc.iHave('Feedback.Add') || permissionSvc.iHave('ABSRFeedBk.AddFeedback'))
				:	(permissionSvc.iHave('Feedback.Add') || permissionSvc.iHave('ABSRFeedBk.AddSubExpFeedBack'));
	var canEdit = (feedbackAboutSubstitute) ?
					permissionSvc.iHave('ABSRFeedBk.EDITFeedback') : permissionSvc.iHave('ABSRFeedBk.EditSubExpFeedBack');


	// View Model properties
	var vm = $scope.vm = {
		buttons: [],
		feedbackExists: feedbackSvc.hasFeedback(feedbackAboutSubstitute),
		hasSubstitute: $scope.hasSubstitute,
		afterAbsenceStart: $scope.afterAbsenceStart,
		showErrors: $scope.showErrors
	};

    $scope.$watch('editMode', function (editMode) {
        vm.buttons = buttons(editMode);
    });

	function buttons (mode) {
		if(!mode){
			return [{
				title: 'Button.AddFeedback',
				icon: '',
				cls:'',
				loading: false,
				action: function(){
					$scope.editMode = true;
				},
				isVisible: function (){
					if(!canAdd){
						return false;
					}
					return !vm.feedbackExists;
				}
			},{
				title: 'Button.EditFeedback',
				icon: '',
				cls:'',
				loading: false,
				action: function(){
					$scope.editMode = true;
				},
				isVisible: function (){
					if(!canEdit){
						return false;
					}
					return vm.feedbackExists;
				}
			},{
				title: 'Delete',
				icon: 'fa-times',
				cls:'fl-negative right',
				loading: false,
				action: function(){
					feedbackSvc.deleteFeedbackDialog(feedbackAboutSubstitute);
				},
				isVisible: function (){
					if(!canEdit){
						return false;
					}
					return vm.feedbackExists;
				}
			}];
		}else{
			return [{
				title: 'Cancel',
				icon: '',
				cls:'',
				loading: false,
				action: function(){
					$scope.editMode = false;
					feedbackSvc.resetFeedback(feedbackAboutSubstitute);
				},
				isVisible: function (){
					if(canAdd || canEdit){
						return true;
					}
					return false;
				}
			},{
				title: vm.feedbackExists ? 'SaveChanges': 'Button.SaveFeedback',
				icon: 'fa-check',
				cls:'fl-positive right',
				loading: false,
				action: function(){
					$scope.isProcessing = true;
					var saveFeedback = feedbackSvc[(feedbackAboutSubstitute) ? 'saveFeedbackAboutSubstitute' :'saveFeedbackFromSubstitute']();
                    saveFeedback.then(function (){
                        $scope.isProcessing = false;
                        $scope.editMode = false;
                    },function () {
                        $scope.isProcessing = false;
                    });

				},
				isVisible: function (){
					return true;
				}
			}];
		}
	}


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Button.AddFeedback',
		'Button.EditFeedback',
		'Delete',
		'Cancel',
		'Button.SaveFeedback',
		'SaveChanges',
		'Feedback.Error.NoSub',
		'Feedback.Error.FutureAbsence'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};


	$scope.$watch('absrState.lastUpdated', function (updatedOn) {
		vm.feedbackExists = feedbackSvc.hasFeedback(feedbackAboutSubstitute);
    });

}

// #-- END Component (cmpt-feedback-buttons) --# //
// #-------------------------------------------# //
};});}());