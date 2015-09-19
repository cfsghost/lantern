
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminRole = this.getState('Admin.Role', {
		id: null,
		name: '',
		desc: '',
		perms: {}
	});

	this.on('store.Admin.Role.get', function *(id) {

		var state = this.getState('Admin.Role');

		// Getting role information by calling API
		var res = yield this.request
			.get('/admin/api/role/' + id)
			.query();

		if (res.status != 200) {
			return;
		}

		// Update state
		state.id = res.body.id;
		state.name = res.body.name;
		state.desc = res.body.desc;
		state.perms = res.body.perms || {};

		this.dispatch('store.Admin.Role', 'change');
	});

	this.on('store.Admin.Role.saveProfile', function *(id, profile) {

		var state = this.getState('Admin.Role');

		// Saving
		var res = yield this.request
			.put('/admin/api/user/' + id)
			.send({
				name: profile.name,
				desc: profile.desc,
				perms: profile.perms
			});

		if (res.status != 200) {
			return;
		}

		state.name = profile.name;
		state.desc = profile.desc;
		state.perms = res.body.role.perms;

		this.dispatch('store.Admin.Role', 'change');
	});
};
