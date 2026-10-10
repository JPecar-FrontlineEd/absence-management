(function () {'use strict';
	describe('appLoader (service)', function () {

		beforeEach(module(function ($provide) {
			$provide.value('domHelp', { rAF: function (fn) { return fn && fn(); } });
		}));

		function getPreLoaderEl() {
			return document.getElementById('pre-loader');
		}

		function bodyHasHideOverflow() {
			return document.getElementsByTagName('body')[0].classList.contains('hide-overflow');
		}

		beforeEach(function () {
			var preLoader = document.createElement('div');
			preLoader.id = 'pre-loader';
			document.body.appendChild(preLoader);
			document.getElementsByTagName('body')[0].classList.add('hide-overflow');
		});

		afterEach(function () {
			var el = getPreLoaderEl();
			if (el) { el.parentNode.removeChild(el); }
			document.getElementsByTagName('body')[0].classList.remove('hide-overflow');
		});

		describe('default timeout behavior', function () {
			var appLoaderSvc, $timeout;

			beforeEach(function () {
				inject(function (_appLoaderSvc_, _$timeout_) {
					appLoaderSvc = _appLoaderSvc_;
					$timeout = _$timeout_;
				});
			});

			it('appReady() alone leaves #pre-loader visible but removes hide-overflow', function () {
				appLoaderSvc.appReady();
				expect(getPreLoaderEl().style.display).not.toBe('none');
				expect(bodyHasHideOverflow()).toBe(false);
			});

			it('navReady() alone leaves #pre-loader visible and does not remove hide-overflow', function () {
				appLoaderSvc.navReady();
				expect(getPreLoaderEl().style.display).not.toBe('none');
				expect(bodyHasHideOverflow()).toBe(true);
			});

			it('appReady() then navReady() hides exactly once', function () {
				var el = getPreLoaderEl();
				appLoaderSvc.appReady();
				appLoaderSvc.navReady();
				expect(el.style.display).toBe('none');
			});

			it('navReady() then appReady() hides exactly once (order independence)', function () {
				var el = getPreLoaderEl();
				appLoaderSvc.navReady();
				appLoaderSvc.appReady();
				expect(el.style.display).toBe('none');
			});

			it('startNavTimeout() + appReady() only, then timeout flush: hides and logs console.error once', function () {
				var el = getPreLoaderEl();
				spyOn(console, 'error');
				appLoaderSvc.startNavTimeout();
				appLoaderSvc.appReady();
				$timeout.flush();
				expect(el.style.display).toBe('none');
				expect(console.error).toHaveBeenCalledTimes(1);
			});

			it('both inputs landed then timeout flush: no second hide, no re-added hide-overflow, no console.error', function () {
				var el = getPreLoaderEl();
				spyOn(console, 'error');
				appLoaderSvc.startNavTimeout();
				appLoaderSvc.appReady();
				appLoaderSvc.navReady();
				expect(el.style.display).toBe('none');
				$timeout.verifyNoPendingTasks();
				expect(bodyHasHideOverflow()).toBe(false);
				expect(console.error).not.toHaveBeenCalled();
			});

			it('repeat calls to appReady() / navReady() / startNavTimeout() are idempotent', function () {
				var el = getPreLoaderEl();
				appLoaderSvc.startNavTimeout();
				appLoaderSvc.appReady();
				appLoaderSvc.appReady();
				appLoaderSvc.navReady();
				appLoaderSvc.navReady();
				appLoaderSvc.startNavTimeout();
				expect(el.style.display).toBe('none');
				$timeout.verifyNoPendingTasks();
			});
		});

		describe('sidekickNavTimeoutMs === 0 (kill switch)', function () {
			var appLoaderSvc, $timeout;

			beforeEach(module(function ($provide) {
				$provide.value('config', { sidekickNavTimeoutMs: 0 });
			}));

			beforeEach(function () {
				inject(function (_appLoaderSvc_, _$timeout_) {
					appLoaderSvc = _appLoaderSvc_;
					$timeout = _$timeout_;
				});
			});

			it('appReady() alone hides immediately and no timer is created', function () {
				var el = getPreLoaderEl();
				appLoaderSvc.startNavTimeout();
				appLoaderSvc.appReady();
				expect(el.style.display).toBe('none');
				$timeout.verifyNoPendingTasks();
			});
		});
	});
}());
