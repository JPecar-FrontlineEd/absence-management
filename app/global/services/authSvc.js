(function () {
  'use strict'; var app = angular.module('aesop');

  var authReadyDefer;
  var flAuthNullIsCauseForRejectionOfPromise = true;

  // #-----------------------------# //
  // #----- Service (authSvc) -----# //
  app.factory('authSvc', function ($q, $location, config, ssAsync) {

    if (authReadyDefer == null) { authReadyDefer = $q.defer(); }

    const token = {
      access: '',
      sub: '',
      impersonatee: '',
      profile: null,
      roles: [],
      isFlidImpersonating: false
    };

    function init() {
      var deferred = $q.defer();

      ssAsync(function* () {
        if (window.siteConfig != null && window.siteConfig.idm.enabled == 'off') {
          deferred.resolve();
          return;
        }
        var authSvc = yield authReadyDefer.promise;
        if (authSvc == null) {
          if (flAuthNullIsCauseForRejectionOfPromise) {
            deferred.reject();
          }
          else {
            deferred.resolve();
          }
          return;
        }
        token.access = authSvc.accessToken;
        token.sub = authSvc.profileId;
        token.impersonatee = authSvc.isImpersonating;
        token.profile = authSvc.user.profile;
        //isImpersonating would return an Id if impersonation is happening or null if not. Double negation to get a boolean.
        token.isFlidImpersonating = !!authSvc.isImpersonating;

        var profile = yield authSvc.profile;
        token.roles = profile.Roles;

        //disallow any changes to this object.
        Object.freeze(token);

        deferred.resolve(authSvc);
      })();

      return deferred.promise;
    }
    const ready = init();

    function signout() {
      ready.then(svc => svc.signout());
    }

    function endImpersonate() {
      ready.then(svc => svc.endImpersonate());
    }

    function getAccountSettingsUrl(returnUrl, supportImpersonation) {
      return ready.then(svc => svc.accountSettingsUrl(returnUrl, supportImpersonation));
    }

    function reauthenticate(redirectUrl = null) {
      if (!redirectUrl) {
        redirectUrl = $location.absUrl();
      }
      ready.then(svc => svc.authenticate({ returnUrl: redirectUrl, productId: config.idm.productId }));
    }

    return {
      ready,
      token,
      signout,
      getAccountSettingsUrl,
      IsInPassthruMode: isInPassthruMode,
      endImpersonate,
      reauthenticate,
      isFlidImpersonating: function () {
        return this.token.isFlidImpersonating;
      },
      isOrgImpersonating: isOrgImpersonating,
      isFrontlineAccountUser: isFrontlineAccountUser
    }
  });

  function authTrigger($q, $location, flAuthService, config, tokenSvc, idmAvailableSvc) {
    if (sessionStorage.getItem('automation-no-auth') !== null) {
      authReadyDefer.resolve({
        profileId: 'mock-id-123',
        isImpersonating: $q.resolve(null),
        accessToken: 'mock-token-123',
        user: {
          profile: {
          }
        },
        profile: $q.resolve({ Roles: [] }),
        isAuthenticated: true
      });
      return;
    }

    var idmAuthenticationPages = ['/access', '/fromtimeandattendance', '/endimpersonate', '/impersonate']; //take 'signout', 'auth_callback'

    if (idmAuthenticationPages.indexOf($location.path().toLowerCase()) > -1) {
      //We are on the access page that starts the IDM login workflow
      authenticate($q, $location, flAuthService, config);
    } else if ($location.path().toLowerCase() == "/auth_callback") {
      // RNC&B ~ Making Auth Great Again (one hack at a time) ~ Oct 2020
      return;
    } else if (tokenSvc.get()) {
      //Old way of logging in was used and we have an Aesop Token
      idmAvailableSvc.ready.then(function () {
        var isIdmEnabled = idmEnabled(idmAvailableSvc);
        flAuthNullIsCauseForRejectionOfPromise = isIdmEnabled;
        if (isIdmEnabled) {
          //Determined this user's Org is using IDM and IDM is on for the application
          authenticate($q, $location, flAuthService, config);
        } else {
          authReadyDefer.resolve();
        }
      });
    } else {
      authReadyDefer.resolve();
    }
  }

  function authenticate($q, $location, flAuthService, config) {
    flAuthService.ready().then(function () {
      if (flAuthService.isAuthenticated) {
        if (authReadyDefer == null) { authReadyDefer = $q.defer(); }
        authReadyDefer.resolve(flAuthService);
      } else {
        //If the Organization Id (oxrf) is in the Querystring, that needs to be passed to flAuth in the case of External Auth Districts
        flAuthService.authenticate({ returnUrl: $location.absUrl(), productId: config.idm.productId, organization: getOrganizationIdFromQs($location) });
      }
    });
  }

  function idmEnabled(idmAvailableSvc) {
    return idmAvailableSvc.IDMAvailable();
  }

  function isInPassthruMode() {
    return (this.token && this.token.profile && this.token.profile.idp && this.token.profile.idp.toLowerCase().indexOf('absenceandtime') > -1);
  }

  function isOrgImpersonating() {
    var result = false;
    if (this.token && this.token.roles && !this.token.isFlidImpersonating) {
      var isAdmin = this.token.roles.find(function (e) {
        return e.toLowerCase() === 'IdmAdministrator'.toLowerCase();
      });
      result = !!isAdmin;
    }
    return result;
  }

  function getOrganizationIdFromQs($location) {
    var queryStringObject = $location.search();
    if (queryStringObject.oxrf) {
      return queryStringObject.oxrf;
    } else {
      return null;
    }
  }

  function isFrontlineAccountUser() {
    return (this.token && this.token.profile && this.token.profile.idp && this.token.profile.idp.toLowerCase() === 'frontline');
  }

  if (window.siteConfig != null && window.siteConfig.idm.enabled == 'on') {
    //Setup IDM flAuth library
    app.run(authTrigger);
  }
  // #--- END Service (authSvc) ---# //
  // #-----------------------------# //

}());
