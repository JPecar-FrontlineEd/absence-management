(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------# //
	// #----- Service (userPreferenceSvc) -----# //
	app.factory('userPreferenceSvc', function ($q, storageSvc) {

		var userPreference = storageSvc.load({key: 'userPreference'});
		if(userPreference == null){
			userPreference = {};
		}
		function get (nameSpace, key) {
			var nameSpaceObj = userPreference[nameSpace];
			if(nameSpaceObj){
				return nameSpaceObj[key];
			}else{
				return null;
			}
		}

		function set (nameSpace ,key , value) {
			updateObject(nameSpace,key,value);
		}

		function updateObject (nameSpace ,key , value) {
			var data = userPreference;
			if(typeof userPreference[nameSpace] === 'undefined' || Object.keys(userPreference[nameSpace]).length === 0){
				userPreference[nameSpace] = {};
			}
			userPreference[nameSpace][key] = value;
			storageSvc.save({
				key: 'userPreference',
				expires: 525600,	// Expire strings in 1 year
				persistent: true,	// keep this data across multiple sessions
				data: data
			});
		}
		return {
			get: get,
			set: set
		};

	});
	// #--- END Service (userPreferenceSvc) ---# //
	// #---------------------------------------# //

}());