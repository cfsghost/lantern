var Router = require('koa-router');
var Utils = require('../../lib/utils.js');
var Member = require('../../lib/member');
var Permission = require('../../lib/permission');
var Middleware = require('../../lib/middleware');

var router = module.exports = new Router();

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
