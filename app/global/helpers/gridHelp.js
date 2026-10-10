(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Helper (gridHelp) -----# //
	app.factory('gridHelp', function () {

		return {
			getTotalColumnWidth: function (cols) {
				var dynWidthMode = true;
				return cols.reduce(function (amt, col) {
					if (!dynWidthMode) { return 0; }
					if (col.width == null) { return amt; }
					if (col.width.indexOf('/') >= 0 || col.width.indexOf('%') >= 0) {
						dynWidthMode = false;
						return 0;
					}

					return amt + parseInt(col.width, 10);
				}, 0);
			},
			fractionClass: function (frac) { return '-u-' + frac.replace('/', '-'); },
			getFirstSortableColumn: function (cols) {
				var len = cols.length,
					i = 0;

				for (; i < len; i += 1) {
					if (cols[i].sortable) { return cols[i].key; }
				}

				return '';
			},
			prepSortData: function (data) {
				if (typeof data === 'string') {
					return data.toLowerCase();
				} else {
					return data;
				}
			}
		};

	});
	// #--- END Helper (gridHelp) ---# //
	// #-----------------------------# //

}());