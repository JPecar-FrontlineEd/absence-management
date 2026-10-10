(function() {'use strict';angular.module('aesop')
.directive('cmptUiSlider', function () {return {

// directive options
restrict: 'E',
scope: {
	minValue:'=',
	maxValue:'=?',
	range:'=',
	min:'=?',
	max:'=?',
	steps:'=?',
	firstValue:'@'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-slider/uiSlider.html',

// #------------------------------------# //
// #---- Component (cmpt-ui-slider) ----# //
controller: function ($scope, stringSvc) {

	var range = $scope.range == null ? false : $scope.range;
	var min = $scope.min == null ? 0 : $scope.min;
	var max = $scope.max == null ? 5 : $scope.max;
	var steps = $scope.steps == null ? 1 : $scope.steps;
	var minValueObj = $scope.minValue;
	var maxValueObj = $scope.maxValue == null ? max : $scope.maxValue;

	var jqInputPlugins = {
		slider:{
	        range: range,
            min: min,
            max: max,
            values: range ? [minValueObj, maxValueObj] : [minValueObj],
            step: steps,
            slide: function (event, ui) {
                updateSlide(event, ui);
            }
		}
	};

	// View Model properties
	var vm = $scope.vm = {
		jqInputPlugins: jqInputPlugins
	};

	function updateSlide(event, ui){
		if (range) {
			$scope.minValue = ui.values[0];
	        $scope.maxValue = ui.values[1];
        } else {
        	$scope.minValue = ui.value;
        }
    	$scope.$root.safeApply();
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([

	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};
},

link: function (scope, element, attrs) {
	scope.$el = element.find('div');
	setMarkers();

	 function setMarkers () {
		var firstVal = scope.firstValue == null ? 0 : scope.firstValue;
	        var vals = 5 - 0;
	        for (var i = 0; i <= vals; i++) {
	            var el;
	            if (i === 0) {
	                el = $('<label>' + firstVal + '</label>').css('left', (i / vals * 100) + '%');
	            } else {
	                el = $('<label>' + (i + 0) + '</label>').css('left', (i / vals * 100) + '%');
	            }
            element.find('.markers').append(el);
        }
	 }

}

// #-- END Component (cmpt-ui-slider) --# //
// #------------------------------------# //
};});}());