
import request from 'superagent';

export default function *() {

	var store = {
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
				store.username = username;
				store.email = username;
				store.logined = true;

				this.dispatch('store.User', 'change');
			}.bind(this));
	});
};
