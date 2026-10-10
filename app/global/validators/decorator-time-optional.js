(function() {'use strict';angular.module('aesop').
directive('decoratortimeoptional', function(regexHelp) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.decoratortimeoptional = function(modelValue, viewValue) {
      var TIME_REGEXP = regexHelp.timeFormatOptional();

      if(angular.isUndefined(viewValue)){
        return true;
      }
      if (viewValue === null|| viewValue.length === 0  || TIME_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }
        // it is invalid
        return false;
      };
    }
  };
});})();
