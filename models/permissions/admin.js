var mongoose = require('mongoose');

module.exports = {
	name: 'Admin',
	define: {
		access: {
			name: 'Accessing Admin Panel',
			desc: 'Admin access right'
		},
		users: {
			name: 'User Management',
			desc: 'Managing users'
		},
		roles: {
			name: 'Role Management',
			desc: 'Managing roles'
		}
	},
	schema: {
		access: { type: Boolean, default: false },
		users: { type: Boolean, default: false },
		roles: { type: Boolean, default: false }
	}
};
