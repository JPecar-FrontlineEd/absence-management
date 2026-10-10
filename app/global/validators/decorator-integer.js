(function() {'use strict';angular.module('aesop').
directive('decoratorinteger', function(regexHelp) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.decoratorinteger = function(modelValue, viewValue) {
      var TIME_REGEXP = regexHelp.integer();

      if(angular.isUndefined(viewValue)){
        return true;
      }
      if (viewValue === null || viewValue.length === 0 || TIME_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }
        // it is invalid
        return false;
      };
    }
  };
});})();
