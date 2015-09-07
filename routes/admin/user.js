var Router = require('koa-router');
var Member = require('../../lib/member');

var router = module.exports = new Router();

router.get('/admin/api/user/:userid', function *() {

	// Fetching a list with specific condition
	var data = yield Member.getMember(this.params.userid);

	this.body = {
		id: this.params.userid,
		name: data.name,
		email: data.email,
		roles: data.roles || []
	};
});

router.put('/admin/api/user/:userid/profile', function *() {

	if (!this.request.body.name || !this.request.body.email) {
		this.status = 401;
		return;
	}

	// Save
	try {
		var member = yield Member.save(this.params.userid, {
			name: this.request.body.name,
			email: this.request.body.email
		});
	} catch(e) {
		this.status = 500;
		return;
	}

	var m = {
		name: member.name,
		email: member.email
	};

	this.body = {
		success: true,
		member: m
	};
});
