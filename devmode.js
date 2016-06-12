var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

module.exports = function(app, callback) {

	// Enabled hotload mechanism
	webpackConfig.forEach(function(config) {

		if (config.name != 'Browser')
			return;

		if (!(config.entry.app instanceof Array)) {
			config.entry.app = [
				config.entry.app
			];
		}

		config.entry.app.splice(0, 0, 'webpack-hot-middleware/client');
		config.plugins.push(new webpack.HotModuleReplacementPlugin());

		for (var index in config.module.loaders) {
			var loader = config.module.loaders[index];

			if (loader.loader != 'babel')
				continue;

			if (!loader.query)
				continue;

			loader.query.plugins.push([
				'react-transform', {
					'transforms': [{
						'transform': 'react-transform-hmr',
						'imports': ['react'],
						'locals': ['module']
					}, {
						'transform': 'react-transform-catch-errors',
						'imports': ['react', 'redbox-react']
					}]
				}
			]);
		}

		// Compiling now
		var compiler = webpack(config);
		compiler.run(function(err, stats) {

			app.use(require('koa-webpack-dev-middleware')(compiler, {
				noInfo: true,
				publicPath: config.output.publicPath
			}));
			app.use(require('koa-webpack-hot-middleware')(compiler));

			callback();
		});
	});
};
