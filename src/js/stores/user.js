
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
				console.log(err, res);
				if (err.status == 401) {
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
};
