var Router = require('koa-router');

module.exports = function(lApp) {

	var router = new Router();

	var Utils = lApp.getLibrary('Utils');
	var Member = lApp.getLibrary('Member');
	var Middleware = lApp.getLibrary('Middleware');
	var Permission = lApp.getLibrary('Permission');

	router.use(Middleware.allow('admin.access'));

	router.get('/admin/api/dashboard', function *() {
		this.body = {
			user: {
				count: yield Member.count()
			},
			admin: {
			   count: yield Permission.count({ 'admin.access': true })
			},
			service: {
				name: Utils.getServiceName(),
				externalURL: Utils.getExternalUrl()
			}
		}
	});

	return router;
};
