(function() {'use strict';angular.module('aesop').
directive('decoratordate', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.decoratordate = function(modelValue, viewValue) {
		  var DATE_REGEXP = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

        if (DATE_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});})();
