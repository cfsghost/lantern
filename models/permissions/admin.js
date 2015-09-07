var mongoose = require('mongoose');

module.exports = {
	name: 'admin',
	schema: {
		access: { type: Boolean, default: false },
		users: { type: Boolean, default: false }
	}
};
