window.jQuery = window.$ = require("jquery")
const angular = require("angular");
const { aesopModule } = require("./module.loader"); // your AngularJS 1.5 module
const { initializeApplication } = require("./index"); // your AngularJS 1.5 module

// Don't bootstrap automatically — let React host call it
module.exports = (() => {
  async function mountAngularJS(containerId, authStore, userStore) {
    if (aesopModule) {
      await initializeApplication(authStore, userStore);
      angular.element(document).ready(() => {
        console.log("Bootstrapping the angular application", containerId);
        angular.bootstrap(document.getElementById(containerId), ["aesop"]);
      });

      return;
    }

    throw new Error("Aesop Module has not been setup");
  }

  return {
    mountAngularJS
  }
})()
