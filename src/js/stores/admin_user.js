
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var AdminUsers = this.getState('Admin.Users', {
		id: null,
		name: '',
		email: ''
	});

	this.on('store.Admin.User.get', function *(userId) {

		var state = this.getState('Admin.User');

		// Getting user list by calling API
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

		this.dispatch('store.Admin.User', 'change');
	});
};
