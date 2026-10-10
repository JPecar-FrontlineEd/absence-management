export default (function (aesop) {
	return {
		stylus: {
			src: [
				'<%= aesop.app %>/**/*.styl',
				'!<%= aesop.app %>/**/*.print.styl',
				'<%= aesop.app %>/**/*.print.styl',
				'!<%= aesop.app %>/global/styl/variables.styl',
				'!<%= aesop.app %>/global/styl/mixins.styl'
			],
			dest: '<%= aesop.temp %>/app.styl'
		},
		vendor: {
			src: ['<%= aesop.app %>/vendor/css/*.css'],
			dest: '<%= aesop.app %>/assets/css/vendor.css',
		},
		build: {
			files: {
				'<%= aesop.build %>/css/app.css': [
					'<%= aesop.app %>/vendor/css/*.css',
					'<%= aesop.temp %>/css/app.css',
					'!<%= aesop.app %>/vendor/css/*.critical.css'
				],
				'<%= aesop.temp %>/css/critical.css': [
					'<%= aesop.app %>/vendor/css/*.critical.css',
					'<%= aesop.temp %>/css/critical.css'
				]
			}
		},
		'build-js': {
			src: ['<%= aesop.temp %>/js/annotated-app.js', '<%= aesop.app %>/config/preloaded-templates.js'],
			dest: '<%= aesop.build %>/js/app.js'
		}
	};
});