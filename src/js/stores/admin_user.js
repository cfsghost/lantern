import request from 'superagent';

export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminUsers = this.getState('Admin.Users', {
		page: 1,
		pageCount: 1,
		perPage: 100,
		users: []
	});

	this.on('store.Admin.Users.query', function *() {

		// Getting user list by calling API
		var res = yield request.get('http://localhost:3001/admin/api/users');

		if (res.status != 200) {
			return;
		}

		// Update state
		var state = this.getState('Admin.Users');
		state.users = res.body.members;
		state.page = res.body.page;
		state.pageCount = res.body.pageCount;
		state.perPage = res.body.perPage;

		this.dispatch('store.Admin.Users', 'change');
	});
};
