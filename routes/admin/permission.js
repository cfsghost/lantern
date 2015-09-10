var Router = require('koa-router');
var Permission = require('../../lib/permission');

var router = module.exports = new Router();

router.get('/admin/api/perms', function *() {

	// Fetching a list with specific condition
	var availPerms = yield Permission.getAvailablePermissions();

	this.body = {
		groups: availPerms.groups,
		list: availPerms.perms
	};
});
