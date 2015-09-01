import request from 'superagent';

export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminUsers = this.getState('Admin.Users', {
		page: 1,
		pageCount: 1,
		perPage: 100,
		users: []
	});

	this.on('store.Admin.Users.query', function *(conditions) {

		var state = this.getState('Admin.Users');

		// Getting user list by calling API
		var res = yield this.request
			.get('/admin/api/users')
			.query({
				page: state.page,
				pageCount: state.pageCount,
				perPage: state.perPage,
				q: JSON.stringify(conditions)
			});

		if (res.status != 200) {
			return;
		}

		// Update state
		state.users = res.body.members;
		state.page = res.body.page;
		state.pageCount = res.body.pageCount;
		state.perPage = res.body.perPage;

		this.dispatch('store.Admin.Users', 'change');
	});
};
