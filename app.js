var path = require('path');
var koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var serve = require('koa-static');
var session = require('koa-session');

// React
var React = require('react');
var ReactApp = require('./public/assets/server.js');

var app = koa();

// Static file path
app.use(serve(path.join(__dirname, 'public')));

// Enabling BODY
app.use(bodyParser());

// Create render
app.use(views(__dirname + '/views', {
	ext: 'jade',
	map: {
		html: 'jade'
	}
}));

// Initializing session mechanism
app.keys = [ '!@*()#(@*$^@!(#ASDHO' ];
app.use(session(app));

// Initializing locals to make template be able to get
app.use(function *(next) {
	this.state.user = this.req.user || undefined;
	yield next;
});

// Get content which is rendered by react
function getContent(routePath, query) {

	return function(done) {
		var content = React.renderToString(React.createElement(ReactApp, { path: routePath }));

		done(null, content);
	};
}

// Routes
var router = new Router();
router.get('/', function *() {
	var content = yield getContent(this.request.path, this.query);
	yield this.render('index', { content: content });
});
router.get('/signin', function *() {
	var content = yield getContent(this.request.path, this.query);
	yield this.render('index', { content: content });
});
router.post('/signin', function *() {
	console.log(this.request.body);
	this.body = 'TEST';
});
app.use(router.middleware());

app.listen(3001, function() {
	console.log('server is ready');
});
