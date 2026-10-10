(function () {'use strict'; var app = angular.module('aesop');

  app.run(function () {
      ambient.init({
    		'dashboard-locked': {
    			lockHeader: {
    				elId: 'dashboard-lock-header',
    				offset: 50
    			}
    		},
    		'report-locked': {
    			lockHeader: {
    				elId: 'report-lock-header',
    				offset: 0
    			}
    		}
    	}, 0);
  });

}());
