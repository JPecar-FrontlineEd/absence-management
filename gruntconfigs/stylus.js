export default (function (aesop) {
	return {
		'dev': {
			options: {
				compress: false,
				linenos: false,
				paths: ['<%= aesop.app %>/global/styl/'],
				import: ['nib', 'variables.styl', 'mixins.styl']
			},
			files: {
				'<%= aesop.app %>/assets/css/app.css': '<%= aesop.temp %>/app.styl'
			}
		},
		'build': {
			options: {
				compress: true,
				linenos: false,
				paths: ['<%= aesop.app %>/global/styl/'],
				import: ['nib', 'variables.styl', 'mixins.styl']
			},
			files: [{
				'<%= aesop.temp %>/css/critical.css': [
					'<%= aesop.app %>/**/*.critical.styl',
					'!<%= aesop.app %>/global/styl/variables.styl',
					'!<%= aesop.app %>/global/styl/mixins.styl'
				]
			}, {
				'<%= aesop.temp %>/css/app.css': [
					'<%= aesop.app %>/**/*.styl',
					'<%= aesop.app %>/**/*.print.styl',
					'!<%= aesop.app %>/**/*.critical.styl',
					'!<%= aesop.app %>/global/styl/variables.styl',
					'!<%= aesop.app %>/global/styl/mixins.styl',
					(aesop.production ? '!<%= aesop.app %>/**/*.dev.styl' : '!no.op'),
					(aesop.production ? '!<%= aesop.app %>/components/dev/**/*' : '!no.op')
				]
			}]
		}
	};
});