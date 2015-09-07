var path = require('path');
var koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var serve = require('koa-static');
var session = require('koa-session');
var passport = require('koa-passport');
var co = require('co');

// React
var ReactApp = require('./public/assets/server.js');

// Loading settings
var settings = require('./lib/config.js');
if (!settings) {
	console.error('Failed to load settings');
	process.exit(1);
}

// Libraries
var Utils = require('./lib/utils');
var Mailer = require('./lib/mailer');
var Database = require('./lib/database');
var Passport = require('./lib/passport');

var app = koa();

// Static file path
app.use(serve(path.join(__dirname, 'public')));

// Enabling BODY
app.use(bodyParser());

// Initializing authenication
Passport.init(passport);
Passport.local(passport);

// Setup 3rd-party authorization
if (settings.general.authorization.github.enabled)
	Passport.github(passport);

if (settings.general.authorization.facebook.enabled)
	Passport.facebook(passport);

if (settings.general.authorization.google.enabled)
	Passport.google(passport);

if (settings.general.authorization.linkedin.enabled)
	Passport.linkedin(passport);

app.use(passport.initialize());
app.use(passport.session());

// Create render
app.use(views(__dirname + '/views', {
	ext: 'jade',
	map: {
		html: 'jade'
	}
}));

// Initializing session mechanism
app.keys = settings.general.session.keys || [];
app.use(session(app));

// Initializing locals to make template be able to get
app.use(function *(next) {
	this.state.user = this.req.user || undefined;
	yield next;
});

// Routes
app.use(require('./routes/auth').middleware());
app.use(require('./routes/user').middleware());
app.use(require('./routes/admin/dashboard').middleware());
app.use(require('./routes/admin/users').middleware());
app.use(require('./routes/admin/user').middleware());

co(function *() {

	// Initializing APIs
	yield Mailer.init();
	yield Database.init();

	// Initializing routes for front-end rendering
	var router = new Router();
	for (var index in ReactApp.routes) {
		var route = ReactApp.routes[index];

		// NotFound Page
		if (!route.path) {
			app.use(function *pageNotFound(next) {

				// Be the last handler
				yield next;

				if (this.status != 404)
					return;

				if (this.json || this.body || !this.idempotent)
					return;

				// Rendering
				var page = yield ReactApp.render(this.request.path);
				yield this.render('index', {
					title: settings.general.service.name,
					content: page.content,
					state: page.state
				});

				// Do not trigger koa's 404 handling
				this.message = null;
			});
			continue;
		}

		// Redirect
		if (route.redirect) {
			(function(route) {
				router.get(route.path, function *() {
					this.redirect(route.redirect);
				});
			})(route);
			continue;
		}

		// Register path for pages
		router.get(route.path, function *() {

			// It must create a new instance for rending react page asynchronously
			delete require.cache[require.resolve('./public/assets/server.js')];
			var ReactApp = require('./public/assets/server.js');
			ReactApp.init({
				externalUrl: Utils.getExternalUrl(),
				cookie: this.req.headers.cookie
			});

			// Reset initial state with session for new page
			var curState = {
				User: this.state.user || {}
			};
			curState.User.logined = this.isAuthenticated();

			// Rendering page and pass state to client-side
			var page = yield ReactApp.render(this.request.path, curState);
			yield this.render('index', {
				title: settings.general.service.name,
				content: page.content,
				state: page.state
			});
		});
	}
	app.use(router.middleware());

	app.listen(settings.general.server.port, function() {
		console.log('server is ready');
	});
});
