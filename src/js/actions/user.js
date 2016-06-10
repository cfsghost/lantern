
export default function *() {

	this.on('action.User.signUp', function *(user) {

		try {
			var res = yield this.request
				.post('/signup')
				.send({
					username: user.username || undefined,
					email: user.email || undefined,
					password: user.password || undefined,
					name: user.name || undefined
				});

			// Getting data from server
			var restpack = this.restful.parse(res.status, res.body);
			var data = restpack.getData();

			this.dispatch('action.User.updateStatus', {
				logined: true,
				name: data.name,
				username: data.username || data.email,
				email: data.email,
				login_time: data.login_time,
				avatar: data.avatar || false,
				avatar_hash: data.avatar_hash,
				permissions: data.permissions
			});

			this.dispatch('action.SignUp.update', {
				status: 'success'
			});
		} catch(e) {
			// Getting error messages
			var restpack = this.restful.parse(e.status, e.response.body);
			var data = restpack.getNormalizedData();

			this.dispatch('action.SignUp.update', {
				status: data.message,
				errors: data.errors
			});
		}
	});
};
