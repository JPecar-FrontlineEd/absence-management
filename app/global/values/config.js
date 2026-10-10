(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Value (config) -----# //
	if (window.siteConfig == null) { window.siteConfig = {}; }

	// Convert string boolean values to actual booleans
	function processConfig(config) {
		// Ensure idm object exists
		if (!config.idm) {
			config.idm = {};
		}
		
		// Check if isMorpheusEnvironment is at root level and move/convert it
		if (config.isMorpheusEnvironment !== undefined) {
			if (typeof config.isMorpheusEnvironment === 'string') {
				config.idm.isMorpheusEnvironment = config.isMorpheusEnvironment.toLowerCase() === 'true';
			} else {
				config.idm.isMorpheusEnvironment = Boolean(config.isMorpheusEnvironment);
			}
		}
		
		// Also handle if it's already in the idm object
		if (config.idm.isMorpheusEnvironment !== undefined) {
			if (typeof config.idm.isMorpheusEnvironment === 'string') {
				config.idm.isMorpheusEnvironment = config.idm.isMorpheusEnvironment.toLowerCase() === 'true';
			}
		}
		
		return config;
	}

	app.value('config', processConfig(window.siteConfig));
	// #--- END Value (config) ---# //
	// #-----------------------------# //

}());