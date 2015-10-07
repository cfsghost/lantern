var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var configs = module.exports = [
	{
		name: 'Browser',
		entry: {
			app: './src/js/browser.jsx',
			vendors: [
				'react',
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
			new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
		],
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json-loader' },
				{ test: /\.jsx?$/, loader: 'babel-loader?optional[]=runtime&stage=0', exclude: /(node_modules|bower_components)/ },
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.jpg$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.gif$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.woff$/, loader: "url-loader?prefix=font/&limit=5000" }
			]
		},
		resolve: {
			alias: {
				Source: __dirname + '/src',
				Extension: __dirname + '/src/extensions'
			}
		}
	},
	{
		name: 'Server-side rendering',
		entry: {
			app: './src/js/server.js'
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
			]
		},
		resolve: {
			alias: {
				Source: __dirname + '/src',
				Extension: __dirname + '/src/extensions'
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
