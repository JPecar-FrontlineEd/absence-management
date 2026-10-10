// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// ***********************************************************

const ResourceFixture = require('../helpers/resourceStringHelper')


//from the cypress gitter chat, this is how you do a "global" beforeEach
//we need to make sure the resource strings are always available and aren't cleared in between tests
beforeEach(function() {
    ResourceFixture(cy);
});