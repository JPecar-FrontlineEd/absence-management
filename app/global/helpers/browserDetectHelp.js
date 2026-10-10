(function() {'use strict';var app = angular.module('aesop');

    // #--------------------------------------# //
    // #----- Helper (browserDetectHelp) -----# //
    app.factory('browserDetectHelp', function () {

        var isMobile = {
            android: function() {
                return !!navigator.userAgent.match(/Android/i);
            },
            blackBerry: function() {
                return !!navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return !!navigator.userAgent.match(/iPhone|iPod/i);
            },
            opera: function() {
                return !!navigator.userAgent.match(/Opera Mini/i);
            },
            windows: function() {
                return !!navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.android() ||
                                        isMobile.blackBerry() ||
                                        isMobile.iOS() ||
                                        isMobile.opera() ||
                                        isMobile.windows());
            }
        };


        var browser = {
          ie: function(){
            return !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident/i);
          },
          edge: function(){
            return !!navigator.userAgent.match(/Edge/i);
          }
        }

        return {
            browser,
            isMobile
        };

    });
    // #--- END Helper (browserDetectHelp) ---# //
    // #--------------------------------------# //

}());
