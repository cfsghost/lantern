
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminRoles = this.getState('Admin.Roles', {
		page: 1,
		pageCount: 1,
		perPage: 100,
		roles: []
	});

	this.on('store.Admin.Roles.query', function *(conditions, options) {

		var state = this.getState('Admin.Roles');

		var permissions = false;
		if (options) {
			permissions = options.permissions || false;
		}

		try {
			// Getting role list by calling API
			var res = yield this.request
				.get('/admin/api/roles')
				.query({
					page: state.page,
					pageCount: state.pageCount,
					perPage: state.perPage,
					q: JSON.stringify(conditions),
					permissions: permissions
				});

			if (res.status != 200) {
				return;
			}

			// Update state
			state.roles = res.body.roles;
			state.page = res.body.page;
			state.pageCount = res.body.pageCount;
			state.perPage = res.body.perPage;

			this.dispatch('state.Admin.Roles', 'change');
		} catch(e) {
			console.log(e);
		}
	});

	this.on('store.Admin.Roles.create', function *(name, desc, perms) {

		var res = yield this.request
			.post('/admin/api/roles')
			.send({
				name: name,
				desc: desc,
				perms: perms
			});

		if (res.status != 200) {
			return;
		}

		var store = this.getState('Admin.Roles');
	});
};
