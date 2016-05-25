var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var configs = module.exports = [
	{
		name: 'Browser',
		entry: {
			app: [
				'./src/js/browser.jsx'
			],
			vendors: [
				'babel-polyfill',
				'react',
				'react-dom',
				'react-router',
				'moment'
			]
		},
		output: {
			path: __dirname + '/public/assets/',
			publicPath: '/assets/',
			filename: 'bundle.js',
			chunkFilename: '[chunkhash].chunk.js'
		},
		plugins: [
			new webpack.DefinePlugin({ '_BROWSER': true }),
			new webpack.ProvidePlugin({
				'window.moment': 'moment',
				'moment': 'moment'
			}),
			new CopyWebpackPlugin([
				{ from: './src/public', to: '../' }
			]),
			new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
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
						cacheDirectory: true,
						presets: [ 'react', 'es2015', 'stage-0' ],
						plugins: [
							'add-module-exports',
							'transform-decorators-legacy',
							'syntax-async-functions',
							'transform-react-constant-elements',
							'transform-react-inline-elements'
						],
					}
				},
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "url-loader?limit=1000" },
				{ test: /\.jpg$/,  loader: "url-loader?limit=1000" },
				{ test: /\.gif$/,  loader: "url-loader?limit=1000" },
				{ test: /\.woff$/, loader: "url-loader?limit=1000" }
			],
			noParse: [
				'react/dist/react.min.js',
				'react-dom/dist/react-dom.min.js',
				'react-router/umd/ReactRouter.min.js',
				/moment-with-locales/
			]
		},
		externals: {
			jQuery: true
		},
		resolve: {
			alias: {
				'react$': 'react/dist/react.min.js',
				'react-dom$': 'react-dom/dist/react-dom.min.js',
				'react-router$': 'react-router/umd/ReactRouter.min.js',
				'moment': 'moment/min/moment-with-locales.min.js',
				hotpot: __dirname + '/framework',
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
			app: [
				'babel-polyfill',
				'./src/js/server.jsx'
			]
		},
		target: 'node',
		output: {
			libraryTarget: 'commonjs2',
			path: __dirname + '/build',
			publicPath: '/assets/',
			filename: 'server.js',
			chunkFilename: '[chunkhash].chunk.js'
		},
		node: {
			__filename: true
		},
		externals: fs.readdirSync('./node_modules').map(function(module) {
			return module
		}),
		plugins: [
			new webpack.ProvidePlugin({
				'window.moment': 'moment',
				'moment': 'moment'
			}),
			new webpack.DefinePlugin({
				'global.GENTLY': false,
				'_BROWSER': false
			})
		],
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json-loader' },
				{
					test: /\.jsx?$/,
					loader: 'babel',
					exclude: /(node_modules|bower_components)/,
					query: {
						cacheDirectory: true,
						presets: [ 'react', 'es2015', 'stage-0' ],
						plugins: [
							'add-module-exports',
							'transform-decorators-legacy',
							'syntax-async-functions',
							'transform-react-constant-elements',
							'transform-react-inline-elements'
						]
					}
				},
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
			],
			noParse: [
				'react/dist/react.min.js',
				'react-dom/dist/react-dom.min.js',
				'react-router/umd/ReactRouter.min.js',
				/moment-with-locales/
			]
		},
		resolve: {
			alias: {
				'react$': 'react/dist/react.min.js',
				'react-dom$': 'react-dom/dist/react-dom.min.js',
				'react-router$': 'react-router/umd/ReactRouter.min.js',
				'moment': 'moment/min/moment-with-locales.min.js',
				hotpot: __dirname + '/framework',
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
