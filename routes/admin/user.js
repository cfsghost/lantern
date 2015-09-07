var Router = require('koa-router');
var Member = require('../../lib/member');
var Permission = require('../../lib/permission');

var router = module.exports = new Router();

router.get('/admin/api/user/:userid', function *() {

	// Fetching a list with specific condition
	var data = yield Member.getMember(this.params.userid);

	this.body = {
		id: this.params.userid,
		name: data.name,
		email: data.email,
		roles: data.roles || [],
		perms: data.permissions
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

router.put('/admin/api/user/:userid/perms', function *() {

	if (!this.request.body.perms) {
		this.status = 401;
		return;
	}

	// Validate permissions client given
	var isValid = yield Permission.validate(this.request.body.perms);
	if (!isValid) {
		this.status = 401;
		return;
	}

	// Save permissions
	var m = yield Member.updatePermission(this.params.userid, this.request.body.perms);

	this.body = {
		success: true,
		perms: this.request.body.perms
	};
});
