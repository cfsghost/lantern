var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

var schema = {};

// Loading all roles in the directory
var roleDirPath = path.join(__dirname, 'roles');
var roleFiles = fs.readdirSync(roleFiles);
roleFiles.each(function(filename) {

	// Load file
	var role = require(path.join(roleDirPath, filename));

	schema[role.name] = role.schema;
});

var Role = new mongoose.Schema(schema);

module.exports = mongoose.model('Role', Role);
