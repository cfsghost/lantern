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

router.post('/user/password', Middleware.requireAuthorized, function *() {

	if (!this.request.body.password) {
		this.status = 401;
		return;
	}

	// Update password
	try {
		var success = yield Member.changePassword(this.state.user.id, this.request.body.password);
	} catch(e) {
		this.status = 500;
		return;
	}

	this.body = {
		success: success
	};
});


router.post('/user/forgot', function *() {

	if (!this.request.body.email) {
		this.status = 401;
		return;
	}

	// Setup a rule "reset_password"
	try {
		var result = yield Member.setupRuleTokenByEmail(this.request.body.email, 'reset_password', Date.now());
		if (!result) {
			this.status = 401;
			return;
		}
	} catch(e) {
		this.status = 500;
		return;
	}

	try {
		// Prepare content
		var subject = 'You requested a new ' + Utils.getServiceName() + ' password';
		var content = [
			'<p>You\'re receiving this e-mail because you requested a password reset for your user account at ',
			Utils.getServiceName() + '.</p>',
			'<p>Please go to the following link and choose a new password:</p>',
			'<p><a href=\'' + Utils.getExternalUrl() + '/reset_password/' + result.id + '/' + result.token + '\'>',
			Utils.getExternalUrl() + '/reset_password/' + result.id + '/' + result.token + '</a></p>'
		];

		// Send confirmation mail to user
		yield Mailer.sendMailFromService(this.request.body.email, subject, content.join(''));
	} catch(e) {
		this.status = 500;
		return;
	}

	this.status = 200;
});

router.post('/user/reset_password', function *() {

	if (!this.request.body.id || !this.request.body.token || !this.request.body.password) {
		this.status = 401;
		return;
	}

	// Update password
	try {
		var success = yield Member.changePasswordWithToken(this.request.body.id, this.request.body.token, this.request.body.password);
	} catch(e) {
		this.status = 500;
		return;
	}

	this.body = {
		success: success
	};
});
