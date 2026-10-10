export default (function (aesop, grunt) {
	return {
		'build': {
			options: {
				process: function (content, srcpath) {
					// index prep
					if (srcpath === 'app/index.html') {
						return content
							.replace(/\s+?<link rel="stylesheet" .*?>\n?/ig, '')
							.replace(/script src="\/assets\/js/ig, 'script src="/js')
							.replace(/<!-- critical:css -->/gi, '<link href="../.tmp/css/critical.css?__inline=true">')
							.replace(/<!-- build:css -->/gi,
								'<script>' +
								'loadCSS("/css/app.css");' +
								'loadCSS("//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700");' +
								'</script>')
							.replace(/<!-- critical:js -->/gi, '<script src="../.tmp/js/critical.js?__inline=true"></script>')
							.replace(/<!-- build:js -->/gi, '<script src="/js/app.js"></script>')
							.replace('<script>// jshint ignore:start</script>', '');
					}
					return content;
				},
				noProcess: [
					'**/font/*',
					'**/images/*'
				]
			},
			files: [
				{
					expand: true,
					cwd: '<%= aesop.app %>',
					src: ['index.html', 'web.config'],
					dest: '<%= aesop.build %>'
				}, {
					expand: true,
					cwd: '<%= aesop.app %>/assets',
					src: [
						'**/*',
						'!**/*.css',
						'!**/*.js'
					],
					dest: '<%= aesop.build %>'
				}
			]
		},
		'fix-critical-css': {
			options: {
				process: function (content, srcpath) {
					return content.replace(/\.\.\/\.tmp\//ig, '/').replace(/\/css\/data:image/ig, 'data:image');
				}
			},
			files: [{
				src: ['<%= aesop.build %>/index.html'],
				dest: '<%= aesop.build %>/index.html'
			}]
		},
		'js-app': {
			files: [{
				src: ['<%= aesop.temp %>/js/annotated-app.js'],
				dest: '<%= aesop.build %>/js/app.js'
			}]
		},
		'apply-rev': {
			options: {
				process: function (content, srcpath) {
					var path = require('path');
					var sep = '/';
					var removeFromPath = 'build';
					var versioned = grunt.filerev && grunt.filerev.summary;

					function reEscape(s) { // http://stackoverflow.com/a/18620139/899047
						return s.replace(/[$-\/?[-^{|}]/g, '\\$&');
					}

					if (versioned && path.sep !== sep) {
						var re = new RegExp(reEscape(path.sep), 'g');
						for (var assetpath in versioned) {
							versioned[assetpath.replace(re, sep).replace(removeFromPath, '')] = versioned[assetpath].replace(re, sep).replace(removeFromPath, '');
							delete versioned[assetpath];
						}
					}

					Object.keys(versioned).forEach(function (v) {
						var orig = v.replace('build/', ''),
							rev = versioned[v].replace('build/', '');

						content = content.replace(new RegExp(reEscape(orig), 'g'), rev);
					});

					return content;
				}
			},
			files: [{
				src: ['<%= aesop.build %>/index.html'],
				dest: '<%= aesop.build %>/index.html'
			}]
		},
		'flAuth': {
			files: [{
				src: ['<%= aesop.flAuthDir %>/fl-auth-ng.js'],
				dest: '<%= aesop.app %>/vendor/js/fl-auth-ng.js'
			}]
		}
	};
});
