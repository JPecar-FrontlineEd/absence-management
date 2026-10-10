export default (function (aesop) {
	return {
		build: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},
			expand: true,
			cwd: 'build',
			src: ['**/*.html'],
			dest: 'build/'
		}
	};
});