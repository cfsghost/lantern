var Router = require('koa-router');
var passport = require('koa-passport');
var settings = require('../lib/config');
var Member = require('../lib/member');
var Passport = require('../lib/passport');
var Middleware = require('../lib/middleware');
var Mailer = require('../lib/mailer');
var Utils = require('../lib/utils');

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
