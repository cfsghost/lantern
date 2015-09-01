
import request from 'superagent';

export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var store = this.getState('User', {
		status: 'normal',
		name: 'Nobody',
		username: null,
		email: null,
		logined: false
	});

	this.on('store.User.getState', function *(callback) {
		callback(this.getState('User'));
	});

	this.on('store.User.syncProfile', function *() {

		request
			.get('/user/profile')
			.end(function(err, res) {
				if (err)
					return;

				if (res.status != 200) {
					return;
				}

				if (res.body.success) {
					var store = this.state.User;
					store.name = res.body.member.name;
					store.email = res.body.member.email;
				}

				this.dispatch('store.User', 'change');
			}.bind(this));
	});

	this.on('store.User.updateProfile', function *(name) {

		request
			.post('/user/profile')
			.send({
				name: name
			})
			.end(function(err, res) {
				if (err)
					return;

				if (res.status != 200) {
					return;
				}

				if (res.body.success) {
					var store = this.getState('User');
					store.name = res.body.member.name;
					store.email = res.body.member.email;
				}

				this.dispatch('store.User', 'change');
			}.bind(this));
	});

	this.on('store.User.updatePassword', function *(password, callback) {

		request
			.post('/user/password')
			.send({
				password: password
			})
			.end(function(err, res) {

				if (err) {
					if (callback)
						return callback('ERR_CONNECT', false);

					return;
				}

				if (res.status != 200) {
					if (callback)
						return callback('ERR_SERVER', false);

					return;
				}

				if (callback)
					return callback(null, res.body.success);

			}.bind(this));
	});

	this.on('store.User.forgotPassword', function *(email, callback) {

		request
			.post('/user/forgot')
			.send({
				email: email
			})
			.end(function(err, res) {

				if (err) {
					if (callback)
						return callback('ERR_CONNECT', false);

					return;
				}

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

			}.bind(this));
	});

	this.on('store.User.resetPassword', function *(id, token, password, callback) {

		request
			.post('/user/reset_password')
			.send({
				id: id,
				token: token,
				password: password
			})
			.end(function(err, res) {

				if (err) {
					if (callback)
						return callback('ERR_CONNECT', false);

					return;
				}

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

			}.bind(this));
	});

	this.on('store.User.signIn', function *(username, password) {

		request
			.post('/signin')
			.send({
				username: username,
				password: password
			})
			.end(function(err, res) {
				var store = this.getState('User');
				if (res.status == 401) {
					store.status = 'login-failed';

					this.dispatch('store.User', 'change');
					return;
				}

				// Updating store
				store.status = 'normal';
				store.logined = true;
				store.username = username;
				store.email = username;
				store.name = res.body.data.name;
				store.login_time = res.body.data.login_time;
				store.avatar_hash = res.body.data.avatar_hash;

				this.dispatch('store.User', 'change');
			}.bind(this));
	});

	this.on('store.User.signUp', function *(email, password, name) {

		request
			.post('/signup')
			.send({
				email: email,
				password: password,
				name: name
			})
			.end(function(err, res) {
				var store = this.getState('User');

				switch(res.status) {
				case 500:
					store.status = 'signup-error';
					break;

				case 400:
					store.status = 'signup-failed';
					break;

				case 200:
					// Updating store
					store.status = 'normal';
					store.logined = true;
					store.name = name;
					store.username = email;
					store.email = email;
					store.login_time = res.body.data.login_time;
					store.avatar_hash = res.body.data.avatar_hash;
					break;
				}

				this.dispatch('store.User', 'change');
			}.bind(this));
	});
};
