
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminRoles = this.getState('Admin.Roles', {
		page: 1,
		pageCount: 1,
		perPage: 100,
		roles: []
	});

	this.on('store.Admin.Roles.query', function *(conditions) {

		var state = this.getState('Admin.Roles');

		// Getting user list by calling API
		var res = yield this.request
			.get('/admin/api/roles')
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
		state.roles = res.body.roles;
		state.page = res.body.page;
		state.pageCount = res.body.pageCount;
		state.perPage = res.body.perPage;

		this.dispatch('store.Admin.Roles', 'change');
	});
};
