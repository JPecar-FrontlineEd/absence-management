// Karma configuration
// Generated on Thu Oct 16 2014 08:54:53 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {'use strict';
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],


		// list of files / patterns to load in the browser
		files: [
			//'build/index.html',
			'build/js/angular.*.js',
			'build/js/jquery.*.js',
			'build/js/jquery-*.js',
			'build/**/*.js',
			'testing/**/*.js',
			'app/components/**/*.spec.js',
			'app/global/**/*.spec.js',
			'build/components/**/*.html',
			'./node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js'
		],

		// list of files to exclude
		exclude: [],

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor',
			'karma-notify-reporter',
			'karma-teamcity-reporter'
    ],

		captureTimeout: 2000,

		browserDisconnectTimeout: 2000,

		browserDisconnectTolerance: 5,

		browserNoActivityTimeout: 10000,


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'build/components/**/*.html': ['ng-html2js']
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'notify', 'teamcity'],


		// web server port
		port: 9878,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		notifyReporter: {
			reportEachFailure: false, // Default: false, Will notify on every failed sepc
			reportSuccess: true, // Default: true, Will notify when a suite was successful
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		phantomjsLauncher: {
	    // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
	  	exitOnResourceError: true
	  },

		ngHtml2JsPreprocessor: {
			stripPrefix: 'build/',
			prependPrefix: '/',
			cacheIdFromPath: function(filepath) {
				return filepath.replace(/build\/(.*)/, '/$1');
			},
			moduleName: 'templates'
		}
	});
};
