var Router = require('koa-router');
var Member = require('../../lib/member');

var router = module.exports = new Router();

router.get('/admin/api/user/:userid', function *() {

	// Fetching a list with specific condition
	var data = yield Member.getMember(this.params.userid);

	this.body = {
		id: this.params.userid,
		name: data.name,
		email: data.email
	};
});
