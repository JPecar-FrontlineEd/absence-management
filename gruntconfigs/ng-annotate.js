export default (function (aesop) {
	return {
		options: {
			singleQuotes: true,
		},
		build: {
			files: {
				'<%= aesop.temp %>/js/annotated-app.js': [
					// concat the vendor files as well
					'<%= aesop.app %>/vendor/js/*.js',
					// config code
					'<%= aesop.app %>/config/*.js',
					// global directives, services, etc
					'<%= aesop.app %>/global/**/*.js',
					// component logic
					'<%= aesop.app %>/components/**/*.js',
					// exclude tests
					'!<%= aesop.app %>/**/*.spec.js',
					// exclude critical files
					'!<%= aesop.app %>/**/*.critical.js',
					(aesop.production ? '!<%= aesop.app %>/**/*.dev.js' : '!no.op'),
					(aesop.production ? '!<%= aesop.app %>/components/dev/**/*' : '!no.op')
				],
				'<%= aesop.temp %>/js/annotated-critical.js': [
					// all critical js files
					'<%= aesop.app %>/**/*.critical.js'
				]
			}
		}
	};
});