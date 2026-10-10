(function() {'use strict';angular.module('aesop')
.controller('TestPageCtrl', function ($scope, canvasHelp) {
// #----------------------------# //
// #------- TestPageCtrl -------# //

	// this is a route controller
	var route = this;



	$scope.labels = ['Filled', 'Unfilled', 'No Sub needed'];
	//$scope.series = ['Filled', 'Unfilled', 'No Sub needed'];
	$scope.colors = [ '#26A26A', '#D6AD6A', '#8A8A8A']
	$scope.data = [65,28,48];

	$scope.$on('chart-create', function (evt, chart) {
	  console.log(chart);
	});




	// View Model properties
	route.vm = {

	};

	// Actions that can be bound to from the view
	route.go = {
		extract: function () {
			var stringRep = document.getElementById("string-rep");
			var url = canvasHelp.get("#bar").dataUrl();
			stringRep.innerHTML = url;
			var img = document.getElementById("img");
			img.src = url;
		},
		download: function(){

		}
	};

// #----- END TestPageCtrl -----# //
});}());
