var Router = require('koa-router');
var Role = require('../../lib/role');
var Permission = require('../../lib/permission');

var router = module.exports = new Router();

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
