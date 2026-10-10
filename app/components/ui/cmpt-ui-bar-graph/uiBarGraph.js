(function() {'use strict';angular.module('aesop')
.directive('cmptUiBarGraph', function () {return {

// directive options
restrict: 'E',
scope: {
	graphData: '=',
	colors: '=?',
	titleHovered: '=?',
	groupBy: '@'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-bar-graph/uiBarGraph.html',

// #---------------------------------------# //
// #---- Component (cmpt-ui-bar-graph) ----# //
controller: function ($scope, stringSvc, domHelp, roundNumberFilter) {

	if ($scope.titleHovered == null) { $scope.titleHovered = ''; }

	var groupBy = $scope.groupBy = $scope.groupBy || 'title';
	var colors = $scope.colors = $scope.colors || {};
	var colorIdx = 0;
	var colorAjustStep = 20;
	var colorPallet = [
		{h: 200, s: '58%', l: '43%'},
		{h: 153, s: '52%', l: '39%'},
		{h: 37, s: '47%', l: '63%'},
		{h: 4, s: '63%', l: '62%'},
		{h: 296, s: '43%', l: '47%'}
	];

	var props = $scope.props = $scope;

	// View Model properties
	var vm = $scope.vm = {
		stacks: groupBy !== 'title',
		containerStyle: {
			height: '0%'
		},
		bars: []
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};

	$scope.$watch('graphData', function (data) {
		vm.containerStyle.transitionDuration = '0ms';
		vm.containerStyle.height = '0%';

		domHelp.rAF().then(function () {

			var bars = [];
			var total = 0;
			var largest, barWidth, spacerWidth;

			data.forEach(function (v, idx, a) {
				var i, bar, item;

				i = bars.length;
				for (; i-- ;) {
					if (bars[i][groupBy] === v[groupBy]) {
						bar = bars[i];
						break;
					}
				}

				if (colors[v.title] == null) {
					colors[v.title] = pickColor();
				}

				if (bar == null) {
					bar = {
						value: 0,
						items: [v]
					};
					bar[groupBy] = v[groupBy];
					bars.push(bar);
				} else {
					i = bar.items.length;
					for (; i-- ;) {
						if (bar.items[i].title === v.title) {
							item = bar.items[i];
							break;
						}
					}
					if (item == null) {
						bar.items.push(v);
					} else {
						item.value += v.value;
					}
				}

				bar.value += v.value;
				total += v.value;
			});

			largest = Math.max.apply(null, bars.map(function (v) { return v.value; }));
			barWidth = 94 / bars.length;
			spacerWidth = 6 / (bars.length -1);

			vm.bars = bars.map(function (bar, idx, arr) {
				bar.style = {
					'height': ((bar.value / largest) * 100) + '%',
					'width': barWidth + '%',
					'left': ((barWidth * idx) + (spacerWidth * idx)) + '%'
				};

				bar.items = bar.items.map(function (item) {
					item.style = {
						'height': ((item.value / bar.value) * 100) + '%',
						'background-color': colors[item.title]
					};
					return item;
				});

				return bar;
			});

			vm.containerStyle.height = '100%';
			vm.containerStyle.transitionDuration = '500ms';
		});
	});

	function pickColor() {
		var topIdx = colorIdx++,
			palletIdx = topIdx % colorPallet.length,
			adjustAmt = Math.floor(topIdx / colorPallet.length),
			clr = colorPallet[palletIdx];

		return 'hsl(' + (clr.h + (adjustAmt * colorAjustStep)) + ',' + clr.s + ',' + clr.l + ')';
	}
}

// #-- END Component (cmpt-ui-bar-graph) --# //
// #---------------------------------------# //
};});}());