(function () {
	'use strict';
	var app = angular.module('aesop');

	app.config(['ngDialogProvider', function (ngDialogProvider) {
		ngDialogProvider.setDefaults({
			showClose: false,
			closeByDocument: true,
			closeByNavigation: true,
			closeByEscape: false
		});
	}]);
}());

