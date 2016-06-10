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
	},
	decodeBase64Image: function(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
		response = {};

		if (matches.length !== 3) {
			return new Error('Invalid input string');
		}

		response.type = matches[1];
		response.data = new Buffer(matches[2], 'base64');

		return response;
	}
};
