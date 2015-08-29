var settings = require('./config');
var crypto = require('crypto');

module.exports = {
	getExternalUrl: function() {

		var protocol = settings.general.server.secure ? 'https://' : 'http://';
		var port = (settings.general.server.port == 80) ? '' : ':' + settings.general.server.port;

		return protocol + settings.general.server.external_host + port;
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
