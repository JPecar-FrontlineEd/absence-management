(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Value (userType) -----# //
	app.value('userTypeDef',  {
		0: 'Customer Representative',
		4: 'Organization User',
		5: 'Campus User',
		2: 'Worker',
		3: 'Substitute',
		7: 'Organization Parent User',
		9: 'Multi-org Substitute'
	});
	app.value('userType',  {
		csRep: 0,
		org: 4,
		campus: 5,
		worker: 2,
		substitute: 3,
		organizationParentUser: 7,
		multiOrgSubstitute: 9
	});
	// #--- END Value (userType) ---# //
	// #------------------------------------# //

}());
