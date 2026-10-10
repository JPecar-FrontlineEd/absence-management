(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------------# //
	// #----- Service (userAccessSvc) -----# //
	app.factory('userAccessSvc', function ($q, stringSvc, userInviteApi) {
		var strings = stringSvc.getStrings([
			'UserAccess.AllUsers',
			'Active',
			'Inactive',
			'UserAccess.NoEmail'
		]);

		var pageMode = {
			singleUser: 0,
			allUsers : 1,
			noEmail : 2,
	        activeUsers : 3,
	        inactiveUsers : 4
		};

		var pageTabs = [
            {
                pageMode: pageMode.allUsers,
                userCount: 0,
                title: strings['UserAccess.AllUsers'],
            },
            {
                pageMode: pageMode.activeUsers,
                userCount: 0,
                title: strings['Active'],
            },
            {
                pageMode: pageMode.inactiveUsers,
                userCount: 0,
                title: strings['Inactive'],
            },
            {
                pageMode: pageMode.noEmail,
                userCount: 0,
                title: strings['UserAccess.NoEmail'],
            },
        ];

        function findTabByPageMode(pageMode) {
        	return pageTabs.find(function(x){
	            return x.pageMode === pageMode;
	        });
        }

        function setUserCountForTab(pageMode, newCount) {
	        var foundTabObj = findTabByPageMode(pageMode);
	        foundTabObj.userCount = newCount;
	    }

	    function addToUserCountForTab(pageMode, adjustment) {
	    	var foundTabObj = findTabByPageMode(pageMode);
	        foundTabObj.userCount += adjustment;
	    }

			function bulkInviteUsers(users){
				var defer = $q.defer();
				var userKeys = users.map(x=> x.userKey);
				userInviteApi.bulkInviteUsers(null, userKeys).then(function(){
					defer.resolve();
				}, function(){
					defer.reject();
				});
				return defer.promise;
			}
			function bulkActivateUsers(users){
				var defer = $q.defer();
				var userKeys = users.map(x=> x.userKey);
				userInviteApi.bulkActivateUsers(null, userKeys).then(function(){
					defer.resolve();
				}, function(){
					defer.reject();
				});
				return defer.promise;
			}
			function bulkInactivateUsers(users){
				var defer = $q.defer();
				var userKeys = users.map(x=> x.userKey);
				userInviteApi.bulkInactivateUsers(null, userKeys).then(function(){
					defer.resolve();
				}, function(){
					defer.reject();
				});
				return defer.promise;
			}


			return {
				bulkInviteUsers: bulkInviteUsers,
				bulkActivateUsers: bulkActivateUsers,
				bulkInactivateUsers: bulkInactivateUsers,
				pageMode: pageMode,
				pageTabs: pageTabs,
				setUserCountForTab: setUserCountForTab,
				addToUserCountForTab: addToUserCountForTab,
			};

	});
	// #--- END Service (userAccessSvc) ---# //
	// #-----------------------------------# //

}());
