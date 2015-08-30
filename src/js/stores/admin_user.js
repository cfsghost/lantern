import request from 'superagent';

export default function *() {

	// Initializing user store if state doesn't exist
	if (!this.state.Admin.Users) {
		this.state.Admin.Users = {
			page: 1,
			pageCount: 1,
			perPage: 100,
			users: []
		};
	}

	this.on('store.Admin.Users.getState', function *(callback) {
		callback(this.state.Admin.Users);
	});

	this.on('store.Admin.Users.query', function *() {
		request
			.get('/admin/api/users')
			.end(function(err, res) {
				if (err)
					return;

				if (res.status != 200) {
					return;
				}
console.log(res.body);
				var store = this.state.Admin.Users;
				store.users = res.body.members;
				store.page = res.body.page;
				store.pageCount = res.body.pageCount;
				store.perPage = res.body.parPage;

				this.dispatch('store.Admin.Users', 'change');
			}.bind(this));
	});
};
