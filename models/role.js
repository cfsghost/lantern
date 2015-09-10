var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Role = new mongoose.Schema({
	name: String,
	desc: String,
	permissions: [ String ]
});

module.exports = mongoose.model('Role', Role);
