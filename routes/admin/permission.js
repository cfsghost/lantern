var Router = require('koa-router');
var Permission = require('../../lib/permission');

var router = module.exports = new Router();

router.get('/admin/api/perms', function *() {

	// Fetching a list with specific condition
	var perms = yield Permission.getAvailablePermissions();

	this.body = {
		list: perms
	};
});
