var Router = require('koa-router');

module.exports = function(lApp) {

	var router = new Router();

	var Middleware = lApp.getLibrary('Middleware');
	var Permission = lApp.getLibrary('Permission');

	Middleware.allow('admin.access')

	router.get('/admin/api/perms', function *() {

		// Fetching a list with specific condition
		var availPerms = yield Permission.getAvailablePermissions();

		this.body = {
			groups: availPerms.groups,
			list: availPerms.perms
		};
	});

	return router;
};
