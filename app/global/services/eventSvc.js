(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------# //
	// #----- Service (eventSvc) -----# //
	app.factory('eventSvc', function () {

		var groups = {};

		function fire(g, ev, data) {
			if (groups[g] && groups[g][ev]) {
				groups[g][ev].forEach(function (v) {
					v(data);
				});
			}
		}

		function off(g, ev, handler) {
			if (groups[g] && groups[g][ev]) {
				groups[g][ev].forEach(function (v, i, a) {
					if (v === handler) { a.splice(i, 1); }
				});
			}
		}

		function on(g, ev, handler) {
			if (!groups[g]) { groups[g] = {}; }
			if (!groups[g][ev]) { groups[g][ev] = []; }

			groups[g][ev].push(handler);
		}

		function join(group) {
			return {
				fire: function (ev, data) {
					fire(group, ev, data);
				},
				on: function (ev, handler) {
					on(group, ev, handler);
				},
				off: function (ev, handler) {
					off(group, ev, handler);
				}
			};
		}

		return {
			join: join
		};

	});
	// #--- END Service (eventSvc) ---# //
	// #------------------------------# //

}());