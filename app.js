var path = require('path');
var koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var serve = require('koa-static');
var session = require('koa-session');
var passport = require('koa-passport');
var mount = require('koa-mount');
var locale = require('koa-locale');
var co = require('co');
var logger = require('koa-logger');
var lampion = require('lampion');

var outputPath = (process.env.NODE_ENV == 'production') ? path.join(__dirname, 'dists') : __dirname;

// Initialization
co(function *() {

	// Initialializing App
	var lApp = lampion({
		appPath: __dirname,
		apiPath: path.join(__dirname, 'routes'),
		libPath: path.join(__dirname, 'lib'),
		modelPath: path.join(__dirname, 'models'),
		configPath: path.join(__dirname, 'configs'),
		localePath: path.join(outputPath, 'locales'),
		publicPath: [
			path.join(outputPath, 'public')
		]
	});

	// Listen to log which is coming from app
	lApp.on('log', console.log);

	// Configuring
	yield lApp.configure();

	// Settings
	var settings = lApp.settings;

	// Libraries
	var Utils = lApp.getLibrary('Utils');
	var Member = lApp.getLibrary('Member');
	var Storage = lApp.getLibrary('Storage');
	var Passport = lApp.getLibrary('Passport');
	var Middleware = lApp.getLibrary('Middleware');
	var Localization = lApp.getLibrary('Localization');

	// Starting renderer
	console.log('Starting renderer ...');
	var Renderer = require('./renderer');
	var renderer = new Renderer(lApp, 2);
	yield renderer.init();

	var app = lApp.getKoaApp();
	app.use(logger());

	// Enable development mode and Hot Load machanism
	var devMode = false;
	if (process.argv.length == 3) {
		if (process.argv[2] == 'dev') {
			console.log('Starting on development mode ...');
			devMode = true;

			var devmode = require('./devmode');
			devmode(app, run);
		}
	}

	// Static file path
	app.use(serve(path.join(outputPath, 'public'), { hidden: true }));

	// Avatar
	var avatarDir = yield Storage.getPath('avatar');
	app.use(mount('/avatar', serve(avatarDir)));

	// Enabling BODY
	app.use(bodyParser({
		formLimit: '1mb'
	}));

	// Setup default locale
	locale(app, 'en');

	// Initializing authenication
	Passport.prepare(passport);

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
	lApp.useAPIs();

	function run() {

		co(function *() {

			// Initializing react app
			var ReactApp = require(path.join(outputPath, 'build', 'server.js'));
			ReactApp.init({
				externalUrl: Utils.getExternalUrl()
			});

			// Handling for page not found
			var notFoundRoute = ReactApp.routes.find(function(route) {
				if (route.path == '/404')
					return true;
			});

			if (notFoundRoute) {
				app.use(function *(next) {

					// Be the last handler
					yield next;

					if (this.status != 404)
						return;

					if (this.json || this.body || !this.idempotent)
						return;

					// Do not trigger koa's 404 handling
					this.message = null;

					// redirect to 404 page
					this.redirect('/404');
				});
			}

			var defState = {
				Features: settings.general.features || {},
				Service: {
					name: Utils.getServiceName(),
					externalUrl: Utils.getExternalUrl()
				}
			};
			function *pageHandler() {

				// Locale
				var localization = {
					currentLocale: this.getLocaleFromHeader()
				};
				localization.messages = yield Localization.getTranslations([ localization.currentLocale ]);
				localization.currentMessage = localization.messages[localization.currentLocale] || {};
				
				// Reset initial state with session for new page
				var curState = Object.assign({
					User: this.state.user || {},
					Localization: localization
				}, defState);
				curState.User.logined = this.isAuthenticated();

				// Using renderer
				var result = yield renderer.render({
					path: this.request.path,
					curState: curState,
					cookie: this.req.headers.cookie
				});

				// Redirect
				if (result.redirect) {
					this.redirect(result.redirect);
					return;
				}

				// Output
				this.type = 'text/html';
				this.body = result.html;
			}

			// Initializing routes for front-end rendering
			var router = new Router();
			for (var index in ReactApp.routes) {
				var route = ReactApp.routes[index];

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
				router.get(route.path, Middleware.allow(route.allow || null), pageHandler);
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
		}).catch(function(e) {
			console.error(e);
		});
	}

	if (!devMode)
		run();

}).catch(function(e) {
	console.error(e);
});
