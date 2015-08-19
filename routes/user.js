var Router = require('koa-router');
var passport = require('koa-passport');

var router = module.exports = new Router();

router.get('/signout', function *() {
	this.logout();
	this.redirect('/');
});

router.post('/signin', function *() {
	var targetUrl = this.query.target || '/';

	// Using own user database
	yield passport.authenticate('local', function *(err, user, info) {
		if (!user) {
			this.redirect('/signin?err=1&target=' + targetUrl);
			return;
		}

		// Store login information in session
		yield this.login(user);
		this.redirect(targetUrl);
	}.bind(this)).call(this, next);
});
