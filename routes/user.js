var Router = require('koa-router');
var passport = require('koa-passport');
var Member = require('../lib/member');
var Passport = require('../lib/passport');
var Middleware = require('../lib/middleware');

var router = module.exports = new Router();

router.get('/user/profile', Middleware.requireAuthorized, function *() {
	
	// Get member from database
	var member = yield Member.getMember(this.state.user.id);
	var m = {
		name: member.name,
		email: member.email,
		created: member.created
	};

	this.body = {
		success: true,
		member: m
	};
});

router.post('/user/profile', Middleware.requireAuthorized, function *() {

	if (!this.request.body.name) {
		this.status = 401;
		return;
	}

	// Save
	try {
		var member = yield Member.save(this.state.user.id, {
			name: this.request.body.name
		});
	} catch(e) {
		this.status = 500;
		return;
	}

	var m = {
		name: member.name,
		email: member.email
	};

	this.body = {
		success: true,
		member: m
	};
});
