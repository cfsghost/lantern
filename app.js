var path = require('path');
var koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var serve = require('koa-static');
var session = require('koa-session');
var passport = require('koa-passport');
var locale = require('koa-locale');
var co = require('co');

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
var Member = require('./lib/member');
var Middleware = require('./lib/middleware');
var Localization = require('./lib/localization');

var app = koa();

// Hot Load
if (process.argv.length == 3) {
	if (process.argv[2] == 'dev') {
		console.log('Starting on development mode ...');

		var webpack = require('webpack');
		var webpackConfig = require('./webpack.config');

		// Enabled hotload mechanism
		webpackConfig.forEach(function(config) {

			if (config.name != 'Browser')
				return;

			if (!(config.entry.app instanceof Array)) {
				config.entry.app = [
					config.entry.app
				];
			}

			config.entry.app.splice(0, 0, 'webpack-hot-middleware/client');
			config.plugins.push(new webpack.HotModuleReplacementPlugin());

			for (var index in config.module.loaders) {
				var loader = config.module.loaders[index];

				if (loader.loader != 'babel')
					continue;

				if (!loader.query)
					continue;

				loader.query.plugins.push([
					'react-transform', {
						'transforms': [{
							'transform': 'react-transform-hmr',
							'imports': ['react'],
							'locals': ['module']
						}, {
							'transform': 'react-transform-catch-errors',
							'imports': ['react', 'redbox-react']
						}]
					}
				]);
			}

			var compiler = webpack(config);
			compiler.run(function() {

				app.use(require('koa-webpack-dev-middleware')(compiler, {
					noInfo: true,
					publicPath: config.output.publicPath
				}));
				app.use(require('koa-webpack-hot-middleware')(compiler));
			});
		});
	}
}

// Static file path
app.use(serve(path.join(__dirname, 'public'), { hidden: true }));

// Enabling BODY
app.use(bodyParser());

// Setup default locale
locale(app, 'en');

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
	cache: true,
	map: {
		html: 'jade'
	}
}));

// Initializing session and setting it expires in one month
app.keys = settings.general.session.keys || [];
app.use(session(app, {
	maxAge: 30 * 24 * 60 * 60 * 1000
}));

// Initializing locals to make template be able to get
app.use(function *(next) {
	this.state.user = this.req.user || {};
	yield next;
});

app.use(function *(next) {
	// Getting permission if user signed in already
	if (this.isAuthenticated()) {
		// Getting permission informations for such user
		var perms = yield Member.getPermissions(this.state.user.id);

		if (perms) {
			this.state.user.permissions = perms;
		}
	}

	if (!this.state.user.permissions) {
		this.state.user.permissions = {};
	}

	yield next;
});

// Routes
app.use(require('./routes/auth').middleware());
app.use(require('./routes/user').middleware());
app.use(require('./routes/admin/dashboard').middleware());
app.use(require('./routes/admin/users').middleware());
app.use(require('./routes/admin/user').middleware());
app.use(require('./routes/admin/permission').middleware());
app.use(require('./routes/admin/roles').middleware());
app.use(require('./routes/admin/role').middleware());

co(function *() {

	// Initializing react app
	var ReactApp = require('./build/server.js');
	ReactApp.init({
		externalUrl: Utils.getExternalUrl()
	});

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
				var page = yield ReactApp.render('/404');
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
		router.get(route.path, Middleware.allow(route.allow || null), function *() {

			var id = '[' + Date.now() + '] ' + this.req.url;
			console.time(id);

			// Locale
			var localization = {
				currentLocale: this.getLocaleFromHeader()
			};
			localization.messages = yield Localization.getTranslations([ localization.currentLocale ]);
			localization.currentMessage = localization.messages[localization.currentLocale] || {};
			
			// Reset initial state with session for new page
			var curState = {
				User: this.state.user || {},
				Localization: localization,
				Service: {
					name: Utils.getServiceName(),
					externalUrl: Utils.getExternalUrl()
				}
			};
			curState.User.logined = this.isAuthenticated();

			// Rendering page with current state and cookie to client-side
			var page = yield ReactApp.render(this.request.path, curState, {
				cookie: this.req.headers.cookie
			});

			// Using service name by default
			if (!page.state.Window.title) {
				page.state.Window.title = settings.general.service.name;
			}

			yield this.render('index', {
				title: page.state.Window.title,
				content: page.content,
				window: page.state.Window,
				state: JSON.stringify(page.state)
			});
			console.timeEnd(id);
		});
	}
	app.use(router.middleware());

	// Localization
	var localization = new Router();
	localization.get('/lang/:locale', function *() {
		this.body = yield Localization.getRawTranslation(this.params.locale);
		this.type = 'application/json';
	});
	app.use(localization.middleware());

	// Start the server
	app.listen(settings.general.server.port, function() {
		console.log('server is running at port', settings.general.server.port);
	});
});
