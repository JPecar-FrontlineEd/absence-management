export default (function (aesop) {
	return {
		build: {
			options: {
				keepSpecialComments: 0
			},
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
		}
	};
});