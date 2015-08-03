module.exports = [
	{
		name: 'Browser',
		entry: {
			app: './src/js/browser.js'
		},
		output: {
			path: __dirname + '/public/assets/',
			publicPath: '/assets/',
			filename: 'bundle.js'
		},
		module: {
			loaders: [
				{ test: /\.jsx?$/, loaders: ['jsx?harmony'] },
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
			//filename: __dirname + '/server/app.js'
		},
		module: {
			loaders: [
				{ test: /\.jsx?$/, loaders: ['jsx?harmony'] },
				{ test: /\.less$/, loader: 'style!css!less' },
				{ test: /\.png$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.jpg$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.gif$/,  loader: "url-loader?prefix=img/&limit=5000" },
				{ test: /\.woff$/, loader: "url-loader?prefix=font/&limit=5000" }
			]
		}
	}
];
