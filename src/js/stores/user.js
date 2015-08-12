
import request from 'superagent';

export default function *() {

	this.on('store.User.signIn', function *(username, password) {
		console.log('store.User.signIn');

		request
			.post('/signin')
			.send({
				username: username,
				password: password
			})
			.end(function(err, res) {
				console.log(err, res);
			});
	});
};
