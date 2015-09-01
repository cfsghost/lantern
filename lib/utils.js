var settings = require('./config');
var crypto = require('crypto');

module.exports = {
	getServiceName: function() {
		return settings.general.service.name;
	},
	getExternalUrl: function() {
		return settings.general.service.external_url;
	},
	generateToken: function() {
		return crypto.randomBytes(16).toString('base64');
	},
	generateSalt: function() {
		return crypto.randomBytes(12).toString('base64');
	},
	encryptPassword: function(salt, password) {
		return crypto.createHmac('sha256', password + salt || '').digest('hex');
	}
};
