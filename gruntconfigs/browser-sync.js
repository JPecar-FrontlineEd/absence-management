import browserSyncMiddleware from './browser-sync-middleware.js';
export default (function (aesop) {

	const mw = browserSyncMiddleware(aesop);
	return {
		dev: {
			https: true,
			files: {
				src: [
					'<%= aesop.app %>/**/*.html',
					'<%= aesop.app %>/assets/css/*.css',
					'<%= aesop.app %>/**/*.js',
					'!<%= aesop.app %>/**/*.spec.js'
				]
			},
			options: {
				open: false,
				watchTask: true,
				server: {
					baseDir: '<%= aesop.app %>',
					middleware: [
						mw.serveSpaApp,
						mw.injector
					]
				},
				ghostMode: false
			}
		},
		build: {
			options: {
				open: true,
				server: {
					baseDir: '<%= aesop.build %>',
					middleware: [
						mw.serveSpaBuild,
						mw.injector
					]
				},
				ghostMode: false
			}
		}
	};
});
