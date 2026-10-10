export default (function (aesop) {
	return {
		options: {
			spawn: false
		},

		// compile CSS when Sass files are changed
		stylus: {
			options: {
				spawn: false
			},
			files: ['<%= aesop.app %>/**/*.styl', '!<%= aesop.app %>/assets/css/app.styl'],
			tasks: ['dev-stylus']
		},

		vendorcss: {
			files: '<%= aesop.app %>/vendor/css/*.css',
			tasks: ['concat:vendor']
		},

		html2js: {
			files: [
				'<%= aesop.app %>/components/**/*.html',
				'<%= aesop.app %>/routes/**/*.html',
				'<%= aesop.app %>/global/**/*.html'
			],
			tasks: ['html2js:preload']
		},

		babel: {
			files: ["app/**/*.js", "app/**/*.html", "app/**/*.css", "app/*.js"],
            tasks: ["webpack"],
		}
	};
});
