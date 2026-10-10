(function() {'use strict';angular.module('aesop')
.directive('cmptUiTextarea', function () {return {

// directive options
restrict: 'E',
scope: {
	textModel:'=',
	characters:'=',
	readOnly:'=',
	errorMessages:'=',
	label: '=?',
	labeltext:'=?',
	isOnAbsenceView: '=?'
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-textarea/uiTextarea.html',

// #--------------------------------------# //
// #---- Component (cmpt-ui-textarea) ----# //
controller: function ($scope, absrStateVal, $rootScope) {

	var textModel = $scope.textModel;
	if($scope.label == null && ($scope.textModel == null || $scope.textModel === '')) {
		$scope.label = 'None';
	}else{
		$scope.label = textModel;
	}
	setDisabled();

	$rootScope.$on("absenceUndeleted", function () {
		setDisabled();
	});
	
	function setDisabled(){
		if (absrStateVal.absr) {
            $scope.isDisabled = absrStateVal.absr.isDeleted && $scope.isOnAbsenceView;
        }
	}
}

// #-- END Component (cmpt-ui-textarea) --# //
// #--------------------------------------# //
};});}());