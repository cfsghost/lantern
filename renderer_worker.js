var path = require('path');
var co = require('co');
var consolidate = require('consolidate');

var lampion = require('lampion');

var outputPath = (process.env.NODE_ENV == 'production') ? path.join(__dirname, 'dists') : __dirname;

co(function *() {

	var lApp = lampion({
		worker: true,
		appPath: __dirname,
		localePath: path.join(outputPath, 'locales'),
	});

	yield lApp.configure();

	var settings = lApp.settings;

	// Library
	var Utils = lApp.getLibrary('Utils');

	// Initializing react app
	var ReactApp = require(path.join(outputPath, 'build', 'server.js'));
	ReactApp.init({
		externalUrl: Utils.getExternalUrl()
	});

	var pageHandler = co.wrap(function *(task) {
		try {
			// Rendering page with current state and cookie to client-side
			var page = yield ReactApp.render(task.data.path, task.data.curState, {
				cookie: task.data.cookie
			});
		} catch(e) {
			return console.log(e.stack);
		}

		var result = [ task.id ];

		// Redirect
		if (page.redirect) {
			result.push('D');
			result.push(page.redirect);
			process.send(result.join(''));
			return;
		}

		// Using service name by default
		if (!page.state.Window.title) {
			page.state.Window.title = settings.general.service.name;
		}

		// Rendering page
		consolidate.jade('views/index.jade', {
			cache: true,
			title: page.state.Window.title,
			content: page.content,
			window: page.state.Window,
			state: JSON.stringify(page.state)
		}, function(err, html) {

			result.push('C');
			result.push(html);
			process.send(result.join(''));
		});
	});

	process.on('message', function(task) {
		pageHandler(task);
	});
});
