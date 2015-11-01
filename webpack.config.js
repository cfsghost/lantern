var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var configs = module.exports = [
	{
		name: 'Browser',
		entry: {
			app: [
				'webpack-hot-middleware/client',
				'./src/js/browser.jsx'
			],
			vendors: [
				'react',
				'react-dom',
				'react-router',
				'moment'
			]
		},
		output: {
			path: __dirname + '/public/assets/',
			publicPath: '/assets/',
			filename: 'bundle.js'
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
			new webpack.optimize.OccurenceOrderPlugin(),
		    new webpack.HotModuleReplacementPlugin(),
			new webpack.NoErrorsPlugin()
		],
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json-loader' },
				{
					test: /\.jsx?$/,
					loader: 'babel',
					exclude: /(node_modules|bower_components)/,
					query: {
						stage: 0,
						optional: [ 'runtime' ],
						plugins: [
							'react-transform'
						],
						extra: {
							'react-transform': {
								'transforms': [{
									'transform': 'react-transform-hmr',
									'imports': ['react'],
									'locals': ['module']
								}, {
									'transform': 'react-transform-catch-errors',
									'imports': ['react', 'redbox-react']
								}]
							}
						}
					}
				},
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.jpg$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.gif$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.woff$/, loader: "url-loader?prefix=font/&limit=5000" }
			]
		},
		externals: {
			jquery: true
		},
		resolve: {
			alias: {
				Source: __dirname + '/src',
				Extension: __dirname + '/src/extensions',
				Decorator: __dirname + '/src/decorators',
				External: __dirname + '/src/externals'
			}
		}
	},
	{
		name: 'Server-side rendering',
		entry: {
			app: './src/js/server.jsx'
		},
		target: 'node',
		output: {
			libraryTarget: 'commonjs2',
			path: __dirname + '/build',
			publicPath: '/assets/',
			filename: 'server.js'
		},
		node: {
			__filename: true
		},
		externals: fs.readdirSync('./node_modules').map(function(module) {
			return module
		}),
		plugins: [
			new webpack.DefinePlugin({ 'global.GENTLY': false })
		],
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json-loader' },
				{ test: /\.jsx?$/, loader: 'babel-loader?optional[]=runtime&stage=0', exclude: /(node_modules|bower_components)/ },
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "file-loader" },
				{ test: /\.jpg$/,  loader: "file-loader" },
				{ test: /\.gif$/,  loader: "file-loader" },
				{ test: /\.woff$/, loader: "file-loader" }
			],
			plugins: [
				new webpack.IgnorePlugin(new RegExp('^('
					+ fs.readdirSync('./src/externals').map(function(module) {
						return module
					}).join('|') + ')$'))
			]
		},
		resolve: {
			alias: {
				Source: __dirname + '/src',
				Extension: __dirname + '/src/extensions',
				Decorator: __dirname + '/src/decorators',
				External: __dirname + '/src/externals'
			}
		}
	}
];

// Internationalization and Localization
var translationPath = path.join(__dirname, 'src', 'translations');
fs.readdirSync(translationPath).map(function(locale) {
	configs.push({
		name: locale,
		entry: path.join(translationPath, locale, 'translation.js'),
		output: {
			libraryTarget: 'commonjs2',
			path: path.join(__dirname, 'locales'),
			filename: locale + '.js'
		}
	});
});
