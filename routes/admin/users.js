var Router = require('koa-router');
var Member = require('../../lib/member');

var router = module.exports = new Router();

router.get('/admin/api/users', function *() {

	var page = parseInt(this.request.query.page) || 1;
	var perPage = parseInt(this.request.query.perpage) || 100;
	var q = {};
	try {
		q = JSON.parse(this.request.query.q);
	} catch(e) {}

	var conditions = {};
	if (q.name) {
		conditions.name = new RegExp(q.name, 'i');
	}
	if (q.email) {
		conditions.email = new RegExp(q.email, 'i');
	}
	if (q.phone) {
		conditions.phone = new RegExp(q.phone, 'i');
	}
	if (q.cardno) {
		conditions.cardno = q.cardno;
	}
	if (q.idno) {
		conditions.idno = q.idno;
	}
	if (q.token) {
		conditions.tokens = new RegExp(q.token, 'i');
	}

	// Fetching a list with specific condition
	var data = yield Member.list(conditions, [
		'name',
		'email',
		'created'
	], {
		skip: (page - 1) * perPage,
		limit: perPage
	});

	this.body = {
		page: page,
		perPage: perPage,
		pageCount: Math.ceil(data.count / perPage),
		members: data.members
	};
});

router.del('/admin/api/users/:userid', function *() {
	var userid = this.params.userid;

	try {
		yield Member.deleteMembers([ userid ]);
	} catch(e) {
		this.status = 500;
		return;
	}

	this.body = {
		success: true
	};
});
