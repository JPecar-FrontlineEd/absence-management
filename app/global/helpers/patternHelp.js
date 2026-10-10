(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Helper (patternHelp) -----# //
	app.factory('patternHelp', function () {

		// Array of objects, each has:
		// <ul><li>'re' - a regular expression</li>
		// <li>'handler' - a function for creating a date from something
		//     that matches the regular expression</li>
		// <li>'example' - an array of examples that show matching examples</li>
		// Handlers may throw errors if string is unparseable.
		// Examples are used for automated testing, so they should be updated
		//   once a regexp is added/modified.
		return {
			timeParsers: [{
				// Now
				re: /^now/i,
				example: new Array('now'),
				handler: function () { return new Date(); }
			}, {
				// hh:mm:ss
				re: /(\d{1,2}):(\d{1,2}):(\d{1,2}(p?)(a?))/,
				example: new Array('9:55:00', '19:55:00', '19:5:10', '9:5:1', '9:55:00 a.m.', '11:55:00a'),
				handler: function (bits) {
					var d = new Date();
					var h = parseInt(bits[1], 10);

					if (bits[3].indexOf('a') > 0 && h === 12) { h -= 12; }
					if (bits[3].indexOf('p') > 0 && h < 12) { h += 12; }

					d.setHours(h);
					d.setMinutes(parseInt(bits[2], 10));
					d.setSeconds(parseInt(bits[3], 10));
					d.setMilliseconds(0);

					return d;
				}
			}, {
				// hh:mm
				re: /(\d{1,2}):(\d{1,2}(p?)(a?))/,
				example: new Array('9:55', '19:55', '19:5', '9:55 a.m.', '11:55a'),
				handler: function (bits) {
					var d = new Date();
					var h = parseInt(bits[1], 10);

					if (bits[2].indexOf('a') > 0 && h === 12) { h -= 12; }
					if (bits[2].indexOf('p') > 0 && h < 12) { h += 12; }

					d.setHours(h);
					d.setMinutes(parseInt(bits[2], 10));
					d.setSeconds(0);
					d.setMilliseconds(0);

					return d;
				}
			}, {
				// hh.xx
				//{re: /(\d{1,2})[.](\d{1,2})/,
				//Add handling for when the number starts with a decimal - DTN 4/10/14
				re: /(\d{1,2}[.]|[.])(\d{1,2})/,
				example: new Array('9.25', '11.5', '11.50', '9', '11.75', '.25'),
				handler: function (bits) {
					var d = new Date();
					var h = 0;

					if (bits[1] !== '.') { h = parseInt(bits[1], 10); }
					if (bits[2].indexOf('a') > 0 && h === 12) { h -= 12; }
					if (bits[2].indexOf('p') > 0 && h < 12) { h += 12; }
					if (h > 24) { h = 24; }

					var pctStr = bits[2];
					var pct = parseInt(pctStr, 10);

					if (pct > 99) { pct = 100; }
					if (pct < 0) { pct = 0; }
					if (pctStr.length === 1) { pct = pct * 10; }

					var m = 60 * pct / 100;

					d.setHours(h);
					d.setMinutes(parseInt(m, 10));

					var s = (m - d.getMinutes()) * 60;
					d.setSeconds(parseInt(s,10));

					var ms = Math.round((s - d.getSeconds()) * 1000);
					d.setMilliseconds(ms);

					return d;
				}
			}, {
				// hhmmss
				re: /(\d{1,6}(p?)(a?))/,
				example: new Array('9', '9a', '9am', '19', '1950', '195510', '0955'),
				handler: function (bits) {
					var d = new Date();
					var h;

					if (bits[1].substring(0, 1) > 2 || bits[1].substring(0, 2) > 24 || bits[1].replace('a', '').replace('p', '').length === 3) {
						bits[1] = '0' + bits[1];
						h = parseInt(bits[1].substring(1, 2), 10);
					} else {
						h = parseInt(bits[1].substring(0, 2), 10);
					}

					var m = parseInt(bits[1].substring(2, 4), 10);
					var s = parseInt(bits[1].substring(4, 6), 10);

					if (bits[1].indexOf('a') > 0 && h === 12) { h -= 12; }
					if (bits[1].indexOf('p') > 0 && h < 12) { h += 12; }
					if (isNaN(m)) { m = 0; }
					if (isNaN(s)) { s = 0; }

					d.setHours(parseInt(h, 10));
					d.setMinutes(parseInt(m, 10));
					d.setSeconds(parseInt(s, 10));
					d.setMilliseconds(0);

					return d;
				}
			}]
		};

	});
	// #--- END Helper (patternHelp) ---# //
	// #--------------------------------# //

}());