var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var configs = module.exports = [
	{
		name: 'Browser',
		entry: {
			app: './src/js/browser.jsx'
		},
		output: {
			path: __dirname + '/public/assets/',
			publicPath: '/assets/',
			filename: 'bundle.js'
		},
		devtool: 'source-map',
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json-loader' },
				{ test: /\.jsx?$/, loader: 'babel-loader?optional[]=runtime&stage=0', exclude: /(node_modules|bower_components)/ },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.jpg$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.gif$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.woff$/, loader: "url-loader?prefix=font/&limit=5000" }
			]
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
			path: __dirname + '/public/assets/',
			publicPath: '/assets/',
			filename: 'server.js'
		},
		node: {
			__filename: true
		},
		plugins: [
			new webpack.DefinePlugin({ 'global.GENTLY': false })
		],
		externals: {
			react: 'React'
		},
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json-loader' },
				{ test: /\.jsx?$/, loader: 'babel-loader?optional[]=runtime&stage=0', exclude: /(node_modules|bower_components)/ },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.jpg$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.gif$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.woff$/, loader: "url-loader?prefix=font/&limit=5000" }
			]
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
