const { aesopModule, createFlAuthModule } = require("./module.loader");


/**
 * Register all values/validators/helpers/services/endpoints/directives/filters/controllers
 * for bootstrapping. Order relative to each other doesn't matter - Angular resolves
 * DI at runtime - but all of them must come after module.loader above.
 */
console.log("## Injecting global, configs, components and css into the angular module");
require("./global/utility")
require("./global/values");
require("./global/validators");
require("./global/helpers");
require("./global/services");
require("./global/endpoints");
require("./global/directives");
require("./global/filters");
require("./global/controllers");
require("./config");
require("./components");
require("./assets/css/app.css")
require("./assets/css/vendor.css");
console.log("## Finished injecting global, configs, components and css");

module.exports = (function () {
    function createComponent() {
        aesopModule.run(function ($rootScope, $log, serializeError) {
            $rootScope.$on('$stateChangeError', function (
                event, toState, toParams, fromState, fromParams, error
            ) {
                $log.error('State change error:', serializeError(error));

                // Optional: prevent default error handling
                event.preventDefault();
            });
        }).run(function ($state, $log) {
            // Patch $state.go
            var originalGo = $state.go;
            $state.go = function (to, params, options) {
                $log.warn('$state.go called:', to, params, options);

                return originalGo.apply(this, arguments);
            };

            // Patch $state.transitionTo
            var originalTransitionTo = $state.transitionTo;
            $state.transitionTo = function (to, params, options) {
                $log.warn('$state.transitionTo called:', to, params, options);

                return originalTransitionTo.apply(this, arguments);
            };
        }).component('aesopBootstrap', {
            templateUrl: '/components/aesop-bootstrap/cmpt-aesop-bootstrap/aesopBootstrap.html',
            controller: 'ApplicationCtrl'
        });

        return "<aesop-bootstrap></aesop-bootstrap>"
    }

    async function initializeApplication(authStore, userStore) {
        if (aesopModule) {
            createComponent();
            await createFlAuthModule(authStore, userStore);
            return;
        }

        return;
    }

    return {
        initializeApplication
    }
}())