process.env.NODE_ENV = 'production';

var webpack = require('webpack');
var configs = require('./webpack.config.js');

configs.forEach(function(config) {
	if (!config.plugins)
		config.plugins = [];

	config.plugins.unshift(new webpack.optimize.UglifyJsPlugin());
	config.plugins.unshift(new webpack.optimize.OccurrenceOrderPlugin());
});

module.exports = configs;
