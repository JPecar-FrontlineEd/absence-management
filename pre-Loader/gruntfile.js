'use strict';

module.exports = function (grunt) {

	var pkg = grunt.file.readJSON('package.json');

	// Load grunt tasks automatically
	require('jit-grunt')(grunt, {});

	// Define the configuration for all the tasks
	grunt.initConfig({

		// define project-specific settings (grunt templates)
		pkg: pkg,

		'stylus': {
			'dev': {
				options: {
					compress: false,
					linenos: false,
					import: ['nib']
				},
				files: { 'generated.css': ['**/*.styl'] }
			}
		},
		'watch': {
			options: {
				spawn: false
			},

			// compile CSS when Sass files are changed
			stylus: {
				files: ['**/*.styl'],
				tasks: ['stylus:dev']
			}
		},
		'browserSync': {
			dev: {
				files: {
					src : [
						'**/*.html',
						'**/*.css',
						'**/*.js'
					]
				},
				options: {
					open: true,
					port: 4000,
					watchTask: true,
					server: {
						baseDir: '.'
					},
					ghostMode: false
				}
			}
		}

	});

	// run development instance
	grunt.registerTask('default', function () {
		grunt.task.run([
			'stylus:dev',
			'browserSync:dev',
			'watch'
		]);
	});

};
