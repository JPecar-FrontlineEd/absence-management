'use strict'
import stylus from "./gruntconfigs/stylus.js"
import cssmin from "./gruntconfigs/cssmin.js"
import browserSync from "./gruntconfigs/browser-sync.js"
import concat from "./gruntconfigs/concat.js"
import copy from "./gruntconfigs/copy.js"
import filerevUserev from "./gruntconfigs/filerev-userev.js"
import html2js from "./gruntconfigs/html2js.js"
import htmlmin from "./gruntconfigs/htmlmin.js"
import ngAnnotate from "./gruntconfigs/ng-annotate.js"
import uglify from "./gruntconfigs/uglify.js"
import watch from "./gruntconfigs/watch.js"
import webpackWatch from "./gruntconfigs/webpack-watch.js"
import jitGrunt from "jit-grunt";
import webpackConfig from "./webpack.config.js"
import grunt from "grunt";
import clear from "grunt-contrib-clean";

var aesop = grunt.file.readJSON('aesop.config.json');
aesop.production = false; // default

var revConfig = filerevUserev(aesop);

// Load grunt tasks automatically
jitGrunt(grunt);


export default grunt.initConfig({
	webpack: {
		options: webpackConfig, // load webpack config
		build: {}, // default target
	},

	// define project-specific settings (grunt templates)
	aesop: aesop,

	// empty folders to start fresh
	clean: {
		temp: '<%= aesop.temp %>',
		build: '<%= aesop.build %>',
		dist: '<%= aesop.app %>/dist',
		compiled: '<%= aesop.app %>/compiled'
	},

	clear: clear,
	'stylus': stylus(aesop),
	'cssmin': cssmin(aesop),
	'ngAnnotate': ngAnnotate(aesop),
	'copy': copy(aesop, grunt),
	'concat': concat(aesop),
	'uglify': uglify(aesop),
	'htmlmin': htmlmin(aesop),
	'watch': watch(aesop),
	'webpack-watch': webpackWatch(aesop),
	'browserSync': browserSync(aesop),
	'filerev': revConfig.filerev,
	'userev': revConfig.userev,
	'html2js': html2js(aesop),

	inline: {
		build: { src: ['<%= aesop.build %>/index.html'] }
	}
});

grunt.loadNpmTasks("grunt-webpack");
grunt.loadNpmTasks("grunt-contrib-watch");

grunt.registerTask("default", function (target) {
	aesop.devTarget = (target && target.toLowerCase()) ? target.toLowerCase() : 'dev';
	grunt.task.run([
		'clear',
		'clean:temp',
		'clean:build',
		'clean:compiled',
		'dev-stylus',
		'copy:flAuth',
		'concat:vendor',
		'html2js:preload',
		'clean:temp',
	])
});


grunt.registerTask('dev', function (target) {
	aesop.devTarget = (target && target.toLowerCase()) ? target.toLowerCase() : 'dev';

	grunt.task.run([
		'clear',
		'clean:temp',
		'clean:build',
		'clean:compiled',
		'dev-stylus',
		'copy:flAuth',
		'concat:vendor',
		'html2js:preload',
		'clean:temp',
		'start-karma',
		'babel:dev',
		'browserSync:dev',
		'watch'
	]);
});

// run morpheus lite development instance
grunt.registerTask('dev-ml', function (target) {
	aesop.devTarget = (target && target.toLowerCase()) ? target.toLowerCase() : 'dev-ml';

	grunt.task.run([
		'clear',
		'clean:temp',
		'clean:build',
		'clean:compiled',
		'dev-stylus',
		'copy:flAuth',
		'concat:vendor',
		'html2js:preload',
		'clean:temp',
		'start-karma',
		'babel:dev',
		'browserSync:dev',
		'watch'
	]);
});

grunt.registerTask('pack', function (target) {
	aesop.devTarget = (target && target.toLowerCase()) ? target.toLowerCase() : 'dev';

	grunt.task.run([
		'clear',
		'clean:temp',
		'clean:dist',
		'dev-stylus',
		'concat:vendor',
		'html2js:preload',
		'clean:temp',
		'webpack',
		'webpack-watch'
	]);
});

// build for deployment
grunt.registerTask('build', function (target) {

	if (target === 'production') { aesop.production = true; }

	grunt.task.run([
		'clear',
		// prep work
		'clean:temp',
		'clean:build',
		'clean:compiled',
		// styles
		'stylus:build',
		'cssmin:build',
		// copy flAuth into vendor
		'copy:flAuth',
		// files and HTML prep
		'copy:build',
		// javascript
		'html2js:preload',
		'ngAnnotate:build',
		'uglify:build-inline',
		'uglify:build-assets',
		// html
		'inline:build',
		'htmlmin:build',
		// rev the files
		//'copy:js-app',
		'concat:build-js',
		'uglify:build-app',
		'rev-build',
		'copy:fix-critical-css',
		// cleanup
		'clean:temp'
	]);
});

// start local server for build directory
grunt.registerTask('run-build', function (target) {
	grunt.task.run([
		'browserSync:build'
	]);
});
grunt.registerTask('dev-stylus', ['concat:stylus', 'stylus:dev']);
grunt.registerTask('rev-build', ['filerev:build', 'copy:apply-rev']);
