(function () {'use strict'; var app = angular.module('aesop');

app.run(function ($rootScope, domHelp) {
	var readyToPrint = false;

	window.addEventListener('keydown', function (evt) {
		if (evt.which === 80 && (evt.ctrlKey || evt.metaKey) && !evt.shiftKey && !evt.altKey) {

			evt.preventDefault();
			$rootScope.$emit('beforePrint');

			domHelp.rAF().then(function () {
				domHelp.rAF().then(function () {
					domHelp.rAF().then(function () {
						window.print();
						$rootScope.$emit('afterPrint');
					});
				});
			});
		}
	});

	if ('onbeforeprint' in window) {
		window.addEventListener('beforeprint', function () {
			if (!readyToPrint) { $rootScope.$emit('uncontroledPrint'); }
		});
	}

	$rootScope.$on('beforePrint', function () { readyToPrint = true; });
	$rootScope.$on('afterPrint', function () { readyToPrint = false; });
});

}());


