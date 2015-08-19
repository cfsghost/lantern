var Router = require('koa-router');
var passport = require('koa-passport');
var Member = require('../lib/member');

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
		yield ctx.login(user);

		ctx.body = {
			success: true
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
	var m = {
		name: member.name,
		username: member.email,
		email: member.email,
		login_time: Date.now()
	};
	this.login(m);

	this.body = m;
});
