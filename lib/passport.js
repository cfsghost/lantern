var co = require('co');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var Member = require('./member');

module.exports = {
	init: function(passport) {
		passport.serializeUser(function(user, done) {
			done(null, {
				id: user.id,
				name: user.name,
				email: user.email,
				login_time: Date.now(),
				avatar_hash: crypto.createHash('md5').update(user.email).digest('hex')
			});
		})

		passport.deserializeUser(function(user, done) {
			done(null, user);
		})
	},
	local: function(passport) {

		passport.use(new LocalStrategy(function(username, password, done) {

			co(function *() {
				// Using own library to authorize
				return yield Member.authorizeMember(username, password);
			}).then(function(member) {
				done(null, member);
			}, function(err) {
				done(err);
			});
		}));
	}
};
