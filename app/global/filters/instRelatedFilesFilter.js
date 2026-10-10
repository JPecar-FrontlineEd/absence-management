(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------------# //
	// #----- Filter (instRelatedFiles) -----# //
	app.filter('instRelatedFiles', function (institutionSvc) {

		return function (filesArr, instIdArr) {
			if (filesArr == null || filesArr.length === 0 || instIdArr == null || instIdArr.length === 0) { return []; }
			var instIds = [];
			instIdArr.forEach(function (id) {
				instIds = instIds.concat(institutionSvc.getInstAndParentIds(id));
			});

			return filesArr.filter(function (file) {
				var objectType = file.objectType.toLowerCase();
				return objectType === 'organization' ||
					   objectType === 'worker' ||
					   instIds.indexOf(file.objectKey) >= 0;
			});
		};

	});
	// #--- END Filter (instRelatedFiles) ---# //
	// #-----------------------------------------# //

}());