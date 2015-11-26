var Router = require('koa-router');
var Role = require('../../lib/role');
var Permission = require('../../lib/permission');
var Middleware = require('../../lib/middleware');

var router = module.exports = new Router();

router.use(Middleware.allow('admin.roles'));

router.get('/admin/api/role/:id', function *() {

	// Fetching a list with specific condition
	var data = yield Role.getRole(this.params.id);

	this.body = {
		id: this.params.id,
		name: data.name,
		desc: data.desc,
		perms: data.permissions
	};
});

router.put('/admin/api/role/:id', function *() {

	if (!this.request.body.name || !this.request.body.desc) {
		this.status = 401;
		return;
	}

	if (!this.request.body.perms) {
		this.status = 401;
		return;
	}

	// Validate permissions client given
	var isValid = yield Permission.validate(Object.keys(this.request.body.perms));
	if (!isValid) {
		this.status = 401;
		return;
	}

	// Save
	try {
		var role = yield Role.save(this.params.id, {
			name: this.request.body.name,
			desc: this.request.body.desc
		});
	} catch(e) {
		this.status = 500;
		return;
	}

	// Save permissions
	var perms = yield Role.updatePermission(this.params.id, this.request.body.perms);

	// Prepare data for returning
	var r = {
		name: role.name,
		desc: role.desc,
		perms: perms
	};

	this.body = {
		success: true,
		role: r
	};
});
