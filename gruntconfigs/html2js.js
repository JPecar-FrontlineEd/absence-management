export default (function (aesop) {
	return {
		options: {
			base: 'app/',
			htmlmin: {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true
			},
			rename: function (moduleName) {
				if (moduleName.indexOf('routes') === 0) {
					return '/' + moduleName.toLowerCase();
				} else {
					return '/' + moduleName;
				}
			}
		},
		preload: {
			src: [
				'app/components/**/*.html',
				'app/routes/**/*.html',
				'app/routes/index.html',
				'app/global/**/*.html',
				(aesop.production ? '!<%= aesop.app %>/components/dev/**/*' : '!no.op')
			],
			dest: 'app/config/preloaded-templates.js'
		}
	};
});