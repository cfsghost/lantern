var Router = require('koa-router');
var passport = require('koa-passport');

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
