var mongoose = require('mongoose');

module.exports = {
	name: 'Admin',
	define: {
		users: {
			name: 'User Management',
			desc: 'Managing users'
		}
	},
	schema: {
		users: { type: Boolean, default: false }
	}
};
