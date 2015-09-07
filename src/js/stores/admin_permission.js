
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminPermission = this.getState('Admin.Permission', {
		permissionList: {}
	});

	this.on('store.Admin.Permission.getPermissionList', function *() {

		var state = this.getState('Admin.Permission');

		// Getting user information by calling API
		var res = yield this.request
			.get('/admin/api/perms')
			.query();

		if (res.status != 200) {
			return;
		}

		// Update state
		state.permissionList = res.body.list;

		this.dispatch('store.Admin.Permission', 'change');
	});
};
