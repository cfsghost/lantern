
import request from 'superagent';

export default function *() {

	// Initializing user store
	if (!this.state.User) {
		this.state.User = {
			status: 'normal',
			name: 'Nobody',
			username: null,
			email: null,
			logined: false
		};
	}

	this.on('store.User.getState', function *(callback) {
		callback(this.state.User);
	});

	this.on('store.User.signIn', function *(username, password) {

		request
			.post('/signin')
			.send({
				username: username,
				password: password
			})
			.end(function(err, res) {
				var store = this.state.User;
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
				var store = this.state.User;

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
