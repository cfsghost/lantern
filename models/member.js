var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Member = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	password: String,
	salt: String,
	gender: Number,
	birthday: Date,
	username: { type: String, unique: true },
	avatar: { type: Boolean, default: false },
	phone: String,
	idno: String,
	tokens: [ String ],
	signup_service: String,
	github: String,
	facebook: String,
	linkedin: String,
	google: String,
	rule_tokens: [{ name: String, token: String, expired: Date }],
	permissions: { type: Schema.Types.ObjectId, ref: 'Permission' },
	roles: [{type: Schema.Types.ObjectId, ref: 'Role'}],
	disabled: { type: Boolean, default: false },
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now }
});

Member.methods.validPassword = function(password) {
    return (this.password == password) ? true : false;
};

module.exports = mongoose.model('Member', Member);
