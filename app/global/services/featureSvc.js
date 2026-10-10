
(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------# //
	// #----- Service (featureSvc) -----# //
	app.factory('featureSvc', function ($q, $rootScope, orgSvc) {
		var _defer = $q.defer();

		var features = [];
		orgSvc.ready.then(function(){
			features = orgSvc.getOrgData()[0].featureList.map(function(x) { return { name: x.name.toLowerCase(), enabled: x.enabled };  });
			_defer.resolve();
		},function() {
			console.warn('UNABLE TO GET THE FEATURE LIST DEFINED ON THE ORG LEVEL');
			_defer.reject();
		});

		function get(feature, defaultIfNotFound) {
			var dflt = defaultIfNotFound !== false;	//Old behavior was ON by default so this statement preserves that behavior
			let enabled = false;
			if(features.length <= 0) {
				enabled = dflt;
				console.warn('FEATURES ARE NOT DEFINED ON ORG LEVEL BUT FUNC CALL FOR THE FEATURE ==> ' + feature);
			}else{
				let featureSetting = features.filter(x => x.name.toLowerCase() === feature.toLowerCase());
				if(featureSetting.length <= 0){
					enabled = dflt;
					console.warn(feature + ' - UNABLE TO FIND FEATURE IN THE ORG DEFINED FEATURES, SO FEATURE IS TURNED ' + (enabled ? 'ON' : 'OFF'));
				}else {
					enabled =  featureSetting[0].enabled;
				}

			}

			return {
				enabled
			};
		}

		return {
			ready: _defer.promise,
			get: get

		};

	});
	// #--- END Service (featureSvc) ---# //
	// #--------------------------------# //

}());
