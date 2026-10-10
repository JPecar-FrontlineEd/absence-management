require('core-js/stable');
require('regenerator-runtime/runtime');
window.jQuery = window.$ = require("jquery")
const angular = require('angular');

/**
 * Load the additional packages, assets and vendor services into the module.loader.js
 */
console.log("## Injecting assets, vendors and external packages into the angular module");
require('./assets/js/Chart.min.js');
require("@uirouter/angularjs");
require("./assets/js/angular-resource");
require("./assets/js/angular-sanitize");
require("./vendor/js/pragmatic-angular");
require('./config/preloaded-templates');
require("./vendor/js/angular-file-upload");
require("ng-dialog");
require("./vendor/js/ng-rateit");
require("./vendor/js/toastr");
require("./vendor/js/once");
require("./vendor/js/angular-sortable-view");
require("./vendor/js/angular-inview");
require("./assets/js/angular-messages");
require("./vendor/js/_chart.min.js")
require("angular-chart.js");
require("./assets/js/angular-cookies");
require("./vendor/js/jquery.qtip.js");
require("./assets/js/jquery-ui.js");
require("./vendor/js/date-en-US.js");
require("./vendor/js/jquery-ui.multidatespicker.js");
console.log("## Finished injecting assets, vendors and external packages");

module.exports = function () {
    function moduleExists(name) {
        try {
            angular.module(name);
            return true;
        } catch (e) {
            return false;
        }
    }

    function getModule() {
        if (moduleExists('aesop')) {
            return angular.module('aesop');
        }

        return angular.module('aesop', [
            'ui.router',
            'ngResource',
            'ngSanitize',
            'pragmatic-angular',
            'templates-preload',
            'angularFileUpload',
            'ngDialog',
            'ngRateIt',
            'toastr',
            'once',
            'angular-sortable-view',
            'angular-inview',
            'ngMessages',
            'chart.js',
            'ngCookies'
        ])
    }

    async function createFlAuthModule(authStore, userStore) {

        angular.module('flAuth', [])
            .service('flAuthService', [function () {
                function authenticate(options) {
                    authStore.signinRedirect(options);
                }

                function authenticateCallback() {
                    return authStore.authCallback(window.location.href)
                        .then(user => user?.raw?.state || '/access');
                }

                function signoutCallback() {
                    authStore.signoutRedirect();
                }

                function accountSettingsUrl(returnUrl, supportImpersonation) {
                    return Promise.resolve(authStore.getAccountSettingsUrl(returnUrl, supportImpersonation));
                }

                function endImpersonate() {
                    // no-op
                }

                return {
                    ready: () => authStore.getUser().then(() => true),
                    get isAuthenticated() {
                        return userStore.isAuthenticated;
                    },
                    get accessToken() {
                        return authStore.getToken();
                    },
                    get isImpersonating() {
                        return authStore.isFlidImpersonating();
                    },
                    profile: authStore.getUser().then(user => ({ Roles: user?.roles ?? [] })),
                    user: {
                        get profile() {
                            return userStore.userContext?.user;
                        }
                    },
                    authenticateCallback,
                    signoutCallback,
                    authenticate,
                    accountSettingsUrl,
                    signout: () => authStore.signoutRedirect(),
                    endImpersonate: () => authStore.signoutRedirect()
                }
            }])
            /**
            * This is to have angular listen to the url changes so it will update the state when React updates the url but doesn't push a history state
            */
            .config(function ($locationProvider) {
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            });;



        angular
            .module('aesop').requires.push('flAuth')


    }

    const aesopModule = getModule();

    return {
        aesopModule,
        createFlAuthModule
    }
}()
