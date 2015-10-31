
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminUser = this.getState('Admin.User', {
		id: null,
		name: '',
		email: '',
		roles: [],
		perms: {}
	});

	this.on('store.Admin.User.get', function *(userId) {

		var state = this.getState('Admin.User');

		// Getting user information by calling API
		var res = yield this.request
			.get('/admin/api/user/' + userId)
			.query();

		if (res.status != 200) {
			return;
		}

		// Update state
		state.id = res.body.id;
		state.name = res.body.name;
		state.email = res.body.email;
		state.roles = res.body.roles || [];
		state.perms = res.body.perms || {};

		this.dispatch('state.Admin.User');
	});

	this.on('store.Admin.User.saveProfile', function *(userId, profile) {

		var state = this.getState('Admin.User');

		// Saving
		var res = yield this.request
			.put('/admin/api/user/' + userId + '/profile')
			.send(profile);

		if (res.status != 200) {
			return;
		}

		state.name = profile.name;
		state.email = profile.email;

		this.dispatch('state.Admin.User');
	});

	this.on('store.Admin.User.savePermission', function *(userId, roles, perms) {

		var state = this.getState('Admin.User');

		// Saving
		var res = yield this.request
			.put('/admin/api/user/' + userId + '/perms')
			.send({
				roles: roles,
				perms: perms
			});

		if (res.status != 200) {
			return;
		}

		state.roles = res.body.roles || [];
		state.perms = res.body.perms || {};

		this.dispatch('state.Admin.User');
	});
};
