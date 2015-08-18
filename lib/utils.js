var crypto = require('crypto');

module.exports = {
	generateSalt: function() {
		return crypto.randomBytes(12).toString('base64');
	},
	encryptPassword: function(salt, password) {
		return crypto.createHmac('sha256', password + salt || '').digest('hex');
	}
};
