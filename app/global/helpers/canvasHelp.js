(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Helper (canvasHelp) -----# //
	app.factory('canvasHelp', function () {

		return {
			get: function (selector) {
				var canvas = document.querySelectorAll(selector)[0];
				return {
					dataUrl: function(){
						if(!canvas) { return null; }
						return canvas.toDataURL();
					}
				}
			}
		};

	});
	// #--- END Helper (canvasHelp) ---# //
	// #-------------------------------# //

}());
