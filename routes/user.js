var crypto = require('crypto');
var Router = require('koa-router');
var passport = require('koa-passport');
var Member = require('../lib/member');
var Passport = require('../lib/passport');

var router = module.exports = new Router();

router.get('/signout', function *() {
	this.logout();
	this.redirect('/');
});

router.get('/state', function *() {
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
	var name = this.request.body.name || null;
	var password = this.request.body.password || null;
	var email = this.request.body.email || null;

	// Check fields
	if (!name || !password || !email) {
		this.status = 400;
		return;
	}

	// Check whether user exists or not
	try {
		var ret = yield Member.getMemberByEmail(email);
		if (ret) {
			this.status = 400;
			return;
		}
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Create a new member
	try {
		var member = yield Member.create({
			name: name,
			password: password,
			email: email
		});
	} catch(e) {
		console.log(e);
		this.status = 500;
		return;
	}

	// Store login information in session
	var m = yield Passport.login(ctx, member);

	// Return result to client
	this.body = {
		success: true,
		data: m
	};
});

router.get('/auth/github', function *() {
	yield passport.authenticate('github', { scope: [ 'user:email' ] });
});

router.get('/auth/facebook', function *() {
	yield passport.authenticate('facebook', { scope: [ 'email' ] });
});

router.get('/auth/google', function *() {
	yield passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login', 'email' ] });
});

router.get('/auth/:serviceName/callback', function *() {
	var ctx = this;

	try {
		yield passport.authenticate(this.params.serviceName, { failureRedirect: '/signin' }, function *(err, user) {
			if (err)
				throw err;

			// Create a account in our user database
			// Check whether user exists or not
			try {
				var m = yield Member.getMemberByEmail(user.email);
				if (m) {

					// Store login information in session
					yield Passport.login(ctx, m);

					// Successful authentication
					ctx.redirect('/');
					return;
				}
			} catch(e) {
				throw e;
			}

			// Create a new member with no password
			try {
				var member = yield Member.create({
					name: user.name,
					email: user.email
				});
			} catch(e) {
				throw e;
			}

			// Store login information in session
			var m = yield Passport.login(ctx, member);

			// Successful authentication
			ctx.redirect('/');
		});

	} catch(e) {
		console.log(e);
		ctx.status = 500;
		return;
	}
});
