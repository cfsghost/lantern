var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Role = new mongoose.Schema({
	name: String,
	desc: String,
	permissions: { type: Schema.Types.ObjectId, ref: 'Permission' }
});

module.exports = mongoose.model('Role', Role);
