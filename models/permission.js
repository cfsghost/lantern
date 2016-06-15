var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

var schema = {};

// Loading all roles in the directory
var permissionDirPath = path.join(__dirname, 'permissions');
var permissionFiles = fs.readdirSync(permissionDirPath);
permissionFiles.forEach(function(filename) {

	// Load file
	var permission = require(path.join(permissionDirPath, filename));

	schema[path.basename(filename, '.js')] = permission.schema;
});

var Permission = new mongoose.Schema(schema);

module.exports = function(lApp) {
	return mongoose.model('Permission', Permission);
};
