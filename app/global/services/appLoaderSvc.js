(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------# //
	// #----- Service (appLoaderSvc) -----# //
	app.factory('appLoaderSvc', function ($timeout, config, domHelp) {

		var DEFAULT_NAV_TIMEOUT_MS = 10000;

		var timeoutMs = angular.isNumber(config.sidekickNavTimeoutMs) ?
			config.sidekickNavTimeoutMs :
			DEFAULT_NAV_TIMEOUT_MS;

		// timeoutMs === 0 is the kill switch: never wait on nav (D11)
		var gateDisabled = (timeoutMs === 0);

		var appDone = false;
		var navDone = gateDisabled;
		var hidden = false;
		var timer = null;

		function clearTimer() {
			if (timer) { $timeout.cancel(timer); timer = null; }
		}

		function hidePreLoader() {
			if (hidden) { return; }
			hidden = true;
			clearTimer();
			domHelp.rAF(function () {
				var el = document.getElementById('pre-loader');
				if (el) { el.style.display = 'none'; }
			});
		}

		function maybeHide() {
			if (appDone && navDone) { hidePreLoader(); }
		}

		return {
			// Angular app-side preloading finished.
			// Removes hide-overflow immediately (D9) but only hides the
			// splash once nav has also landed (D8).
			appReady: function () {
				appDone = true;
				domHelp.rAF(function () {
					document.getElementsByTagName('body')[0].classList.remove('hide-overflow');
				});
				maybeHide();
			},

			// Sidekick nav is up, or is known to never be coming.
			navReady: function () {
				navDone = true;
				clearTimer();
				maybeHide();
			},

			// Starts the fail-open ceiling. Called from sidekickSvc.init()
			// so it bounds CDN load + both HTTP hops (D5).
			startNavTimeout: function () {
				if (gateDisabled || timer || hidden || navDone) { return; }
				timer = $timeout(function () {
					timer = null;
					if (navDone) { return; }
					// eslint-disable-next-line no-console
					console.error('appLoaderSvc: sidekick.loaded not received within ' +
						timeoutMs + 'ms - hiding loading screen without nav.');
					navDone = true;
					maybeHide();
				}, timeoutMs);
			}
		};

	});
	// #--- END Service (appLoaderSvc) ---# //
	// #---------------------------------# //

}());
