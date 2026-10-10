(function() {'use strict';var app = angular.module('aesop');

    // #--------------------------------------# //
    // #----- Endpoint (userSessionsApi) -----# //
    app.factory('userSessionsApi', function ($resource, apiHelp, config, endpointInterceptor) {

        var resource = $resource(config.apiEndpoint + '/v1.0/usersessions',{},{
            redirectUrl:{
                method: 'GET',
                params: { userType: '@userType', userKey: '@userKey', usingMobile: '@usingMobile', orgXrefId: '@orgXrefId', redirectUrl: '@redirectUrl', isPartOfMos: '@isPartOfMos' },
                url: config.apiEndpoint + '/v1.0/usersessions/RedirectUrl',
                interceptor: endpointInterceptor
            },
            roles: {
                method: 'GET',
                params: { orgXrefId: '@orgXrefId' },
                url: config.apiEndpoint + '/v1.0/usersessions/Roles',
                interceptor: endpointInterceptor
            },
            impersonateRedirectUrl:{
                method: 'GET',
                params: { userType: '@userType', userKey: '@userKey', redirectUrl: '@productId', product: '@productId',usingMobile: '@usingMobile'},
                url: config.apiEndpoint + '/v1.0/usersessions/ImpersonationRedirectUrl',
                interceptor: endpointInterceptor
            },
            endImpersonationUrl:{
                method: 'GET',                
                url: config.apiEndpoint + '/v1.0/usersessions/ImpersonationRedirectUrl/End',
                interceptor: endpointInterceptor
            }
        }),
            wrapper = {},
            customHooks, key;


        customHooks = {
            // get: function () {}
            // save: function () {}
            // query: function () {}
            // remove: function () {}
            // delete: function () {}
        };

        for (key in resource) {
            if (!resource.hasOwnProperty(key)) { continue; }
            // setup the promise hook
            wrapper[key] = customHooks[key] || apiHelp.promiseHook(key, resource);
        }

        // custom API methods
        // wrapper.customMethod = function...

        return wrapper;

    });
    // #--- END Endpoint (userSessionsApi) ---# //
    // #--------------------------------------# //

}());
