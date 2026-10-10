(function() {'use strict';angular.module('aesop').
directive('decoratortime', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.decoratortime = function(modelValue, viewValue) {
      var TIME_REGEXP2 = /^([0]?[1-9]|1[0-2]):([0-5]\d)\s?$/i;
      var TIME_REGEXP = /^([0]?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;
      var NUMBER_REGEXP = /^[0-9]{1,4}$/i;
      if (TIME_REGEXP.test(viewValue) || NUMBER_REGEXP.test(viewValue) || TIME_REGEXP2.test(viewValue)) {
          // it is valid
          return true;
        }
        // it is invalid
        return false;
      };
    }
  };
});})();
