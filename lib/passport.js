var co = require('co');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var Member = require('./member');

// Loading settings
var settings = require('./config.js');
if (!settings) {
	console.error('Failed to load settings');
	return;
}

var protocol = settings.general.server.secure ? 'https://' : 'http://';
var port = (settings.general.server.port == 80) ? '' : ':' + settings.general.server.port;

module.exports = {
	init: function(passport) {

		passport.serializeUser(function(user, done) {
			done(null, user);
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
	},
	github: function(passport) {

		passport.use(new GithubStrategy({
				clientID: settings.general.authorization.github.clientID,
				clientSecret: settings.general.authorization.github.clientSecret,
				callbackURL: protocol + settings.general.server.external_host + port + '/auth/github/callback'
			},
			function(accessToken, refreshToken, profile, done) {
				var user = {
					name: profile.displayName,
					email: profile.emails[0].value
				};
				done(null, user);
			}
		));
	},
	login: function(ctx, user) {

		return function(done) {

			co(function *() {
				var member = {
					id: user.id,
					name: user.name,
					email: user.email,
					login_time: Date.now(),
					avatar_hash: crypto.createHash('md5').update(user.email).digest('hex')
				}

				// User information will be stored in session
				yield ctx.login(member);

				done(null, member);
			});
		};
	}
};
