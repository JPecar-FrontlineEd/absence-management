(function() {'use strict';angular.module('aesop').
directive('decoratornegativeintegeroptional', function(regexHelp) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.decoratornegativeintegeroptional = function(modelValue, viewValue) {
      var TIME_REGEXP = regexHelp.negativeInteger();

      if(angular.isUndefined(viewValue)){
        return true;
      }
      if(viewValue === null || viewValue.length === 0){
        return true;
      }
      if (!TIME_REGEXP.test(viewValue)) {
          return true;
        }
        return false;
      };
    }
  };
});})();
