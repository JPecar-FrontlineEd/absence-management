import fs from 'fs';
import url from 'url';
import glob from 'glob';
import injector from 'connect-injector';

export default (function (aesop) {

	var injectorMiddleware = injector(
		// WHEN
		function (req, res) {
			return req.url === '/index.html' || req.url === '/';
		},
		// CONVERT
		function (content, req, res, next) {
			var scriptFolders = [
				'vendor',
				'config',
				'components',
				'global'
			],
				scriptFiles = scriptFolders.reduce(function (prev, val) {
					return prev.concat(
						glob.sync('app/' + val + '/**/*.js').filter(filterScriptPaths)
					);
				}, []),
				scriptTemplate = '<script src="{src}"></script>',
				scriptContent = scriptFiles
					.map(function (v) {
						v = v.replace('app', '');
						if (v.indexOf('/vendor') === -1) {
							if (v.indexOf('/config/preloaded-templates') === -1) {
								v = '/compiled' + v;
							}
						}
						return scriptTemplate.replace('{src}', v);
					})
					.join('\r\n\t');
			next(null, configReplacer(content.toString())
				.replace(/<script src="\/\/.*?"><\/script>/gi, '')
				.replace('<!-- build:js -->', scriptContent)
			);
		}
	);

	function filterScriptPaths(v) {
		return v.indexOf('app/assets') === -1 &&
			v.indexOf('.spec.js') === -1;
	}

	function serveSpa(req, res, next, rootDir) {
		var reqPath = rootDir + url.parse(req.url).pathname;
		if (!fs.existsSync(reqPath) && req.url.indexOf('/browser-sync/') === -1) {
			req.url = '/index.html';
			next();
		} else {
			next();
		}
	}

	function serveSpaApp(req, res, next) { return serveSpa.call(this, req, res, next, 'app'); }
	function serveSpaBuild(req, res, next) { return serveSpa.call(this, req, res, next, 'build'); }

	function configReplacer(content) {
		var configFile = JSON.parse(fs.readFileSync('aesop.dev.json', { encoding: 'utf8' })),
			devQaFile = JSON.parse(fs.readFileSync('aesop.dev-qa.json', { encoding: 'utf8' })),
			devMlFile = JSON.parse(fs.readFileSync('aesop.dev-ml.json', { encoding: 'utf8' }));

		Object.keys(configFile).forEach(function (cfg) {
			var cfgValue = (aesop.devTarget === 'qa' && devQaFile.hasOwnProperty(cfg)) ? devQaFile[cfg] : configFile[cfg];
			if (aesop.devTarget === 'dev-ml' && devMlFile.hasOwnProperty(cfg)) {
				cfgValue = devMlFile[cfg];
			}
			content = content.replace(cfg, cfgValue);
		});
		return content;
	}

	return {
		serveSpaBuild: serveSpaBuild,
		serveSpaApp: serveSpaApp,
		injector: injectorMiddleware
	};
});
