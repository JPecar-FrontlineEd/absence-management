(function() {'use strict';angular.module('aesop')
.directive('cmptUiLinking', function () {return {

// directive options
restrict: 'E',
scope: {
	linked: '=',
	enabled: '=',
	fromEdit: '=?',
	expandLinkingChain: '=?'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-linking/uiLinking.html',

// #-------------------------------------# //
// #---- Component (cmpt-ui-linking) ----# //
controller: function ($scope, stringSvc) {

	$scope.label = '';
	
	var strings = stringSvc.getStrings([
		'LabelForSameAbsenceSubTime',
		'LabelForDifferentAbsenceSubTime'
	]);
	
	var toggleLabel = function(){

		if($scope.linked)
		{
			$scope.label  = strings['LabelForDifferentAbsenceSubTime'] ;
		}		
		else
		{
			$scope.label  = strings['LabelForSameAbsenceSubTime'];
		}
	}

	toggleLabel();

	// Actions that can be bound to from the view
	var go = $scope.go = {
		toggleLink: function () {
			if ($scope.enabled) {
				$scope.linked = !$scope.linked;	
				toggleLabel();
			}
			
		},
		handleKeyPress: function(event)
		{       
				if(event == 13 || event == 32){
					go.toggleLink();
                    toggleLabel();
				}	
		}
	};
	
}

// #-- END Component (cmpt-ui-linking) --# //
// #-------------------------------------# //
};});}());