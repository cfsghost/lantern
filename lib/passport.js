var co = require('co');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
var Utils = require('./utils');
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
				callbackURL: Utils.getExternalUrl() + '/auth/github/callback'
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
	facebook: function(passport) {

		passport.use(new FacebookStrategy({
				clientID: settings.general.authorization.facebook.clientID,
				clientSecret: settings.general.authorization.facebook.clientSecret,
				callbackURL: Utils.getExternalUrl() + '/auth/facebook/callback',
				profileFields: [ 'displayName', 'emails' ],
				enableProof: false
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
	google: function(passport) {

		passport.use(new GoogleStrategy({
				clientID: settings.general.authorization.google.clientID,
				clientSecret: settings.general.authorization.google.clientSecret,
				callbackURL: Utils.getExternalUrl() + '/auth/google/callback'
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
	linkedin: function(passport) {

		passport.use(new LinkedinStrategy({
				clientID: settings.general.authorization.linkedin.clientID,
				clientSecret: settings.general.authorization.linkedin.clientSecret,
				callbackURL: Utils.getExternalUrl() + '/auth/linkedin/callback',
				scope: [ 'r_emailaddress', 'r_basicprofile' ],
				state: true
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
					id: user._id,
					name: user.name,
					email: user.email,
					login_time: Date.now(),
					avatar_hash: crypto.createHash('md5').update(user.email).digest('hex'),
					permissions: user.permissions || {}
				}

				// User information will be stored in session
				yield ctx.login(member);

				done(null, member);
			});
		};
	}
};
