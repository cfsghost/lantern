var co = require('co');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

module.exports = function(lApp) {

	var settings;
	var Member;
	var Utils;

	// Variables
	var protocol;
	var port;

	return {
		onload: function(lApp) {

			return function(done) {

				settings = lApp.settings;
				Member = lApp.getLibrary('Member');
				Utils = lApp.getLibrary('Utils');

				protocol = settings.general.server.secure ? 'https://' : 'http://';
				port = (settings.general.server.port == 80) ? '' : ':' + settings.general.server.port;

				done();
			};
		},
		prepare: function(passport) {

			// Initializing
			passport.serializeUser(function(user, done) {
				done(null, user);
			})

			passport.deserializeUser(function(user, done) {
				done(null, user);
			})

			// Local authorization
			this.local(passport);

			// Setup 3rd-party authorization
			if (settings.general.authorization.github.enabled)
				this.github(passport);

			if (settings.general.authorization.facebook.enabled)
				this.facebook(passport);

			if (settings.general.authorization.google.enabled)
				this.google(passport);

			if (settings.general.authorization.linkedin.enabled)
				this.linkedin(passport);

			// Add middleware to koa
			var app = lApp.getKoaApp();
			app.use(passport.initialize());
			app.use(passport.session());
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
						id: profile.id,
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
						id: profile.id,
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
						id: profile.id,
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
						id: profile.id,
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
						username: user.username || user.email,
						name: user.name,
						email: user.email,
						login_time: Date.now(),
						avatar: user.avatar || false,
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
};
