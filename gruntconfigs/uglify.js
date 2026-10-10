export default (function (aesop) {
	return {
		options: {
			compress: {}	// https://github.com/gruntjs/grunt-contrib-uglify/issues/298 - had to change from "true" to {} because of a 3rd party project dependency change
		},
		'build-inline': {
			files: {
				'<%= aesop.temp %>/js/critical.js': '<%= aesop.temp %>/js/annotated-critical.js',
			}
		},
		'build-assets': {
			files: [{
				expand: true,
				cwd: '<%= aesop.app %>/assets',
				src: 'js/*.js',
				dest: '<%= aesop.build %>'
			}]
		},
		'build-app': {
			files: { '<%= aesop.build %>/js/app.js': '<%= aesop.build %>/js/app.js' }
		},
		'min-test': {
			files: [{
				expand: true,
				cwd: '<%= aesop.app %>',
				src: ['**/*.js', '!assets/**/*.js'],
				dest: '<%= aesop.temp %>/min'
			}]
		}
	};
});