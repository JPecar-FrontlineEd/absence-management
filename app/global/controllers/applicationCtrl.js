(function() {'use strict';angular.module('aesop')
.controller('ApplicationCtrl', function ($scope, config) {
// #-------------------------------# //
// #------- ApplicationCtrl -------# //


	// View Model properties
	var vm = $scope.vm = {
		sidekickEnabled: false
	};

	// Actions that can be bound to from the view
	var go = $scope.go = {
		captureKeyEvent: function (e) {
			var code = e.which || e.keyCode;
			if (code === 116 && e.shiftKey) {
				var sessionStorageKeysToIgnore = [config.idm.productId+'.sessionId', 'token'];
				Object.keys(sessionStorage).forEach(function (v) {
					if(sessionStorageKeysToIgnore.indexOf(v) != -1){ return;}
					window.sessionStorage.removeItem(v);
				});

				var localStorageItemsToRemove = ['i18nStrings', 'userPreference', 'dataAnalysisCategoryData'];
				Object.keys(localStorage).forEach(function(v){
					var matches = localStorageItemsToRemove.filter(function(value){
							return v.indexOf(value) != -1;
					});
					if(matches.length > 0)
					{
						window.localStorage.removeItem(v);
					}
				});
				window.alert('local data cache cleared!');
			} else if (code === 119 && $scope.$root.env.notProd) {
				$scope.$root.env.showPermissionTool = !$scope.$root.env.showPermissionTool;
			} else {
				var iframe = document.getElementById('iframe');
				if(iframe !== null){
					var evt = new Event('keydown');
	  				Object.keys(e).forEach(function (k) {
	  					if (evt[k] == null) {
	  						try{
	  							evt[k] = e[k];
	  						} catch (err) {}
	  					}
	  				});
					iframe.contentDocument.body.dispatchEvent(evt);
				}

			}
		}
	};

// #----- END ApplicationCtrl -----# //
});}());
