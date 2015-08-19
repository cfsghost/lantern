
import request from 'superagent';

export default function *() {

	var store = this.state.User = {
		status: 'normal',
		name: 'Nobody',
		username: null,
		email: null,
		logined: false
	};

	this.on('store.User.getState', function *(callback) {
		callback(store);
	});

	this.on('store.User.signIn', function *(username, password) {

		request
			.post('/signin')
			.send({
				username: username,
				password: password
			})
			.end(function(err, res) {
				if (res.status == 401) {
					store.status = 'login-failed';

					this.dispatch('store.User', 'change');
					return;
				}

				// Updating store
				store.logined = true;
				store.username = username;
				store.email = username;

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
				switch(res.status) {
				case 500:
					store.status = 'signup-error';
					break;

				case 400:
					store.status = 'signup-failed';
					break;

				case 200:
					// Updating store
					store.logined = true;
					store.name = name;
					store.username = email;
					store.email = email;
					store.login_time = res.body.login_time;
					break;
				}

				this.dispatch('store.User', 'change');
			}.bind(this));
	});
};
