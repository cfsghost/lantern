var crypto = require('crypto');
var Router = require('koa-router');
var passport = require('koa-passport');
var RestPack = require('restpack');
var Member = require('../lib/member');
var Passport = require('../lib/passport');
var settings = require('../lib/config.js');

var router = module.exports = new Router();

router.get('/signout', function *() {
	this.logout();
	this.redirect('/');
});

router.post('/signin', function *(next) {
	var ctx = this;

	// Using own user database
	yield passport.authenticate('local', function *(err, user, info) {
		if (err) {
			ctx.status = 500;
			ctx.body = {
				success: false
			};
			return;
		}

		if (!user) {
			ctx.status = 401;
			ctx.body = {
				success: false
			};
			return;
		}

		// Store login information in session
		var m = yield Passport.login(ctx, user);

		// Return result to client
		ctx.body = {
			success: true,
			data: m
		};
	}).call(this, next);
});

router.post('/signup', function *() {
	var username = this.request.body.username || null;
	var name = this.request.body.name || null;
	var password = this.request.body.password || null;
	var email = this.request.body.email || null;

	// Create a dataset for restful API
	var restpack = new RestPack();

	var regEx;

	// Feature: unique username was enabled
	if (settings.general.features.uniqueUsername) {
		regEx = /^[a-z0-9-]+$/;
		if (!username) {

			// Empty
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('username', RestPack.Code.Required);
		} else if (!regEx.test(username)) {

			// Invalid
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('username', RestPack.Code.Invalid);
		}
	}

	// Check fields
	if (!name || !password || !email || restpack.status == RestPack.Status.ValidationFailed) {
		restpack.setStatus(RestPack.Status.ValidationFailed);

		if (!name)
			restpack.appendError('name', RestPack.Code.Required);

		if (!password)
			restpack.appendError('password', RestPack.Code.Required);

		if (!email)
			restpack.appendError('email', RestPack.Code.Required);

		// Response
		restpack.sendKoa(this);
		return;
	}

	// Check whether user exists or not
	var fields = {
		email: email
	};

	if (settings.general.features.uniqueUsername) {
		fields.username = username;
	}

	try {
		var ret = yield Member.exists(fields);

		if (ret.email) {
			restpack
				.setStatus(RestPack.Status.ValidationFailed)
				.appendError('email', RestPack.Code.AlreadyExist);
		}

		if (settings.general.features.uniqueUsername) {
			if (ret.username) {
				restpack
					.setStatus(RestPack.Status.ValidationFailed)
					.appendError('username', RestPack.Code.AlreadyExist);
			}
		}

		if (restpack.status == RestPack.Status.ValidationFailed) {
			restpack.sendKoa(this);
			return;
		}
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Create a new member
	var data = {
		name: name,
		password: password,
		email: email
	};

	if (settings.general.features.uniqueUsername) {
		data.username = username;
	}

	try {
		var member = yield Member.create(data);
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Store login information in session
	var m = yield Passport.login(this, member);

	// Return result to client
	restpack
		.setData(m)
		.sendKoa(this);
});

router.get('/auth/github', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('github', { scope: [ 'user:email' ] });
});

router.get('/auth/facebook', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('facebook', { scope: [ 'email' ] });
});

router.get('/auth/google', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login', 'email' ] });
});

router.get('/auth/linkedin', function *() {
	if (this.query.target)
		this.session.target = this.query.target;

	yield passport.authenticate('linkedin');
});

router.get('/auth/:serviceName/callback', function *() {
	var ctx = this;

	var target = '/';
	if (this.session.target)
		target = this.session.target;

	delete this.session.target;

	try {
		yield passport.authenticate(this.params.serviceName, { failureRedirect: '/signin' }, function *(err, user) {
			if (err)
				throw err;

			if (!user) {
				ctx.redirect(target);
				return;
			}

			// Create a account in our user database
			// Check whether user exists or not
			try {
				var m = yield Member.getMemberByEmail(user.email);
				if (m) {

					// Check if bad guy use user's email to register account on third party service
					if (m.signup_service != ctx.params.serviceName) {
						ctx.status = 409;
						return;
					}

					// Store login information in session
					yield Passport.login(ctx, m);

					// Successful authentication
					ctx.redirect(target);
					return;
				}
			} catch(e) {
				throw e;
			}

			// Feature: unique username was enabled
			if (settings.general.features.uniqueUsername) {

			}

			// Create a new member with no password
			try {
				var member = yield Member.create({
					name: user.name,
					email: user.email,
					signup_service: ctx.params.serviceName
				});
			} catch(e) {
				throw e;
			}

			// Store login information in session
			var m = yield Passport.login(ctx, member);

			// Successful authentication
			ctx.redirect(target);
		});

	} catch(e) {
		console.log(e);
		ctx.status = 500;
		return;
	}
});
