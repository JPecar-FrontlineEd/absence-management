(function() {'use strict';angular.module('aesop')
.directive('cmptUiRadGauge', function (domHelp) {return {

// directive options
restrict: 'E',
scope: {
	percent: '=',
	startPercent: '=?'
},
transclude: true,
replace: true,
templateUrl: '/components/ui/cmpt-ui-rad-gauge/uiRadGauge.html',

// #---------------------------------------# //
// #---- Component (cmpt-ui-rad-gauge) ----# //
controller: function ($scope, $timeout) {

	var degOffset = 45;

	$scope.speed = 400;
	$scope.startPercent = $scope.startPercent || 0;

	var vm = $scope.vm = {
		showSecondHalf: false,
		halfStyles1: {},
		halfStyles2: {},
		showHideStyles: {}
	};

	window.rad = $scope;

	var go = $scope.go = {
		setPercent: function(p) {
			var firstHalfDeg, secondHalfDeg,
				firstHalfDur, secondHalfDur;

			if (p > 50) {
				firstHalfDeg = 180;
				firstHalfDur = $scope.speed;
				secondHalfDeg = (p - 50) * 3.6;
				secondHalfDur = ((secondHalfDeg/180) * $scope.speed);
			} else {
				firstHalfDeg = p * 3.6;
				firstHalfDur = ((firstHalfDeg/180) * $scope.speed);
				secondHalfDeg = 0;
			}

			resetDial().then(function () {
				vm.halfStyles1 = {
					'transform': 'rotate(' + (firstHalfDeg + degOffset) + 'deg)',
					'msTransform': 'rotate(' + (firstHalfDeg + degOffset) + 'deg)',
					'transition': firstHalfDur + 'ms linear'
				};
				vm.halfStyles2 = {
					'transform': 'rotate(' + (secondHalfDeg + degOffset) + 'deg)',
					'msTransform': 'rotate(' + (secondHalfDeg + degOffset) + 'deg)',
					'transition': secondHalfDur + 'ms ' + (firstHalfDur) + 'ms linear'
				};
				vm.showHideStyles = {
					'transition': '0ms ' + (firstHalfDur-5) + 'ms linear'
				};
				vm.showSecondHalf = !!secondHalfDeg;
			});
		}
	};

	$scope.$watch('percent', function (p) {
		go.setPercent(p);
	});

	function resetDial() {
		return domHelp.rAF(function () {
			var dialStartDeg = $scope.startPercent * 3.6;

			vm.halfStyles1 = {
				'transform': 'rotate(' + degOffset + 'deg)',
				'msTransform': 'rotate(' + degOffset + 'deg)',
				'transition': '0ms 0ms linear'
			};
			vm.halfStyles2 = {
				'transform': 'rotate(' + degOffset + 'deg)',
				'msTransform': 'rotate(' + degOffset + 'deg)',
				'transition': '0ms 0ms linear'
			};
			vm.showHideStyles = {
				'transition': '0ms 0ms linear'
			};
			vm.containerStyles = {
				'transform': 'rotate(' + dialStartDeg + 'deg)'
			};
			vm.showSecondHalf = false;
		}).then(function () {
			return domHelp.rAF();
		});
	}

},

link: function (scope, element, attrs) {
	scope.speed = (attrs.speed == null) ? scope.speed : parseInt(attrs.speed, 10);
}

// #-- END Component (cmpt-ui-rad-gauge) --# //
// #---------------------------------------# //
};});}());