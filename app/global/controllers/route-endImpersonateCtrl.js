(function() {'use strict';angular.module('aesop')
.controller('EndImpersonateCtrl', function (userSessionsSvc, $window) {
// #----------------------------------# //
// #------- EndImpersonateCtrl -------# //

	// this is a route controller
	var route = this;



	userSessionsSvc.endImpersonationUrl()
	.then(function(data){
		$window.location.href = data.url;
	})
	.catch(function(error){
		toastHelp.error(error.$messages,'Error')
	})


	// View Model properties
	route.vm = {
		property: 'initial value'
	};

	// Actions that can be bound to from the view
	route.go = {
		someAction: function () {
			route.vm.property = 'something';
		}
	};

// #----- END EndImpersonateCtrl -----# //
});}());