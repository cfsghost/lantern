var Router = require('koa-router');
var Utils = require('../../lib/utils.js');
var Member = require('../../lib/member');

var router = module.exports = new Router();

router.get('/admin/api/dashboard', function *() {
	this.body = {
		user: {
			count: yield Member.count()
		},
		admin: {
			count: 0
		},
		service: {
			name: Utils.getServiceName(),
			externalURL: Utils.getExternalUrl()
		}
	}
});
