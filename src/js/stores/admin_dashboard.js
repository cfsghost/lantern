import request from 'superagent';

export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminDashboard = this.getState('Admin.Dashboard', {
		service: {
			name: '',
			externalURL: ''
		},
		user: {
			count: 0
		},
		admin: {
			count: 0
		}
	});

	this.on('store.Admin.Dashboard.query', function *() {

		// Getting user list by calling API
		var res = yield request.get('http://localhost:3001/admin/api/dashboard');

		if (res.status != 200) {
			return;
		}

		// Update state
		var state = this.getState('Admin.Dashboard');
		state.service = res.body.service;
		state.user = res.body.user;
		state.admin = res.body.admin;

		this.dispatch('store.Admin.Dashboard', 'change');
	});
};
