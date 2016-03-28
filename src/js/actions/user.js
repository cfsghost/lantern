
export default function *() {

	this.on('action.User.signUp', function *(user) {

		try {
			var res = yield this.request
				.post('/signup')
				.send({
					username: user.username || undefined,
					email: user.email,
					password: user.password,
					name: user.name
				});

			// Getting data from server
			var restpack = this.restful.parse(res.status, res.body);
			var data = restpack.getData();
			console.log(data);

			this.dispatch('action.User.updateStatus', {
				logined: true,
				name: user.name,
				username: user.email,
				email: user.email,
				login_time: data.login_time,
				avatar_hash: data.avatar_hash,
				permissions: data.permissions
			});

			this.dispatch('action.SignUp.update', {
				status: 'success'
			});
		} catch(e) {
			console.log('EERR', e.response.body);
			var restpack = this.restful.parse(e.status, e.response.body);
			var data = restpack.getNormalizedData();
			console.log(data);

			this.dispatch('action.SignUp.update', {
				status: data.message,
				errors: data.errors
			});
		}
	});
};
