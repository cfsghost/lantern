process.env.NODE_ENV = 'production';

var path = require('path');
var fse = require('fs-extra');
var webpack = require('webpack');
var configs = require('./webpack.config.js');

fse.removeSync(path.join(__dirname, 'dist'));

configs.forEach(function(config) {
	if (!config.plugins)
		config.plugins = [];

	config.plugins.unshift(new webpack.optimize.UglifyJsPlugin());
	config.plugins.unshift(new webpack.optimize.OccurrenceOrderPlugin());
});

module.exports = configs;
