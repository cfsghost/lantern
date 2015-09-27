
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var store = this.getState('User', {
		status: 'normal',
		name: 'Nobody',
		username: null,
		email: null,
		logined: false,
		permissions: {}
	});

	this.on('store.User.syncProfile', function *() {

		try {
			var res = yield this.request
				.get('/user/profile')
				.query();

			if (res.status != 200) {
				return;
			}

			if (res.body.success) {
				// Update store
				var store = this.getState('User');
				store.name = res.body.member.name;
				store.email = res.body.member.email;
			}

			this.dispatch('store.User', 'change');
		} catch(e) {
			console.log(e);
		}
	});

	this.on('store.User.updateProfile', function *(name) {

		try {
			var res = yield this.request
				.post('/user/profile')
				.send({
					name: name
				});

			if (res.status != 200) {
				return;
			}

			if (res.body.success) {
				var store = this.getState('User');
				store.name = res.body.member.name;
				store.email = res.body.member.email;
			}

			this.dispatch('store.User', 'change');
		} catch(e) {
			console.log(e);
		}
	});

	this.on('store.User.updatePassword', function *(password, callback) {

		try {
			var res = yield this.request
				.post('/user/password')
				.send({
					password: password
				});

			if (res.status != 200) {
				if (callback)
					return callback('ERR_SERVER', false);

				return;
			}

			if (callback)
				return callback(null, res.body.success);

		} catch(e) {
			if (callback)
				callback('ERR_CONNECT', false);
		}
	});

	this.on('store.User.forgotPassword', function *(email, callback) {

		try {
			var res = yield this.request
				.post('/user/forgot')
				.send({
					email: email
				});

			switch(res.status) {
			case 200:
				if (callback)
					return callback(null, true);

				return;

			default:
				if (callback)
					return callback('ERR_SERVER', false);

				return;
			}

		} catch(e) {
			if (callback)
				callback('ERR_CONNECT', false);
		}
	});

	this.on('store.User.resetPassword', function *(id, token, password, callback) {

		try {
			var res = yield this.request
				.post('/user/reset_password')
				.send({
					id: id,
					token: token,
					password: password
				});

			switch(res.status) {
			case 200:
				if (callback)
					return callback(null, true);

				return;

			default:
				if (callback)
					return callback('ERR_SERVER', false);

				return;
			}

		} catch(e) {
			if (callback)
				callback('ERR_CONNECT', false);
		}
	});

	this.on('store.User.signIn', function *(username, password) {

		var store = this.getState('User');

		try {
			var res = yield this.request
				.post('/signin')
				.send({
					username: username,
					password: password
				});

			// Updating store
			store.status = 'normal';
			store.logined = true;
			store.username = username;
			store.email = username;
			store.name = res.body.data.name;
			store.login_time = res.body.data.login_time;
			store.avatar_hash = res.body.data.avatar_hash;
			store.permissions = res.body.data.permissions;

			this.dispatch('store.User', 'change');
		} catch(e) {

			if (res.status == 401) {
				store.status = 'login-failed';

				this.dispatch('store.User', 'change');
				return;
			}
		}
	});

	this.on('store.User.signUp', function *(email, password, name) {

		var store = this.getState('User');

		try {
			var res = yield this.request
				.post('/signup')
				.send({
					email: email,
					password: password,
					name: name
				});

			switch(res.status) {
			case 200:
				// Updating store
				store.status = 'normal';
				store.logined = true;
				store.name = name;
				store.username = email;
				store.email = email;
				store.login_time = res.body.data.login_time;
				store.avatar_hash = res.body.data.avatar_hash;
				store.permissions = res.body.data.permissions;
				break;
			}

			this.dispatch('store.User', 'change');
		} catch(e) {

			switch(e.status) {
			case 500:
				store.status = 'signup-error';
				break;

			case 409:
				store.status = 'signup-failed-existing-account';
				break;

			case 400:
				store.status = 'signup-failed';
				break;
			}

			this.dispatch('store.User', 'change');
		}
	});
};
