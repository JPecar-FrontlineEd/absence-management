(function() {'use strict';angular.module('aesop').
directive('decoratoremail', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.decoratoremail = function emailValidator(modelValue) {
        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
        var valid = ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        return valid;
      }
    }
  };
});})();
