var Router = require('koa-router');
var Permission = require('../../lib/permission');
var Middleware = require('../../lib/middleware');

var router = module.exports = new Router();

Middleware.allow('admin.access')

router.get('/admin/api/perms', function *() {

	// Fetching a list with specific condition
	var availPerms = yield Permission.getAvailablePermissions();

	this.body = {
		groups: availPerms.groups,
		list: availPerms.perms
	};
});
