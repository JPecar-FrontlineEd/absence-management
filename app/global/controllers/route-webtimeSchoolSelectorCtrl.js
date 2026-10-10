(function() {'use strict';angular.module('aesop')
.controller('WebtimeSchoolSelectorCtrl', function ($stateParams, stringSvc) {
// #-----------------------------------------# //
// #------- WebtimeSchoolSelectorCtrl -------# //

	// this is a route controller
	var route = this;

	route.strings = stringSvc.getStrings([
        'schoolList.heading.selectSchool'
    ]);

	// View Model properties
	route.vm = {
		destination: $stateParams.destination,
        link: '/WebTime/{0}/' + $stateParams.destination
	};

	// Actions that can be bound to from the view
	route.go = { };

// #----- END WebtimeSchoolSelectorCtrl -----# //
});}());