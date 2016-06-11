var co = require('co');

try {
	var settings = require('./lib/config.js');
} catch(e) {}

// Library
var Utils = require('./lib/utils');

// Initializing react app
var ReactApp = require('./build/server.js');
ReactApp.init({
	externalUrl: Utils.getExternalUrl()
});

process.on('message', function(task) {

	co(function *() {

		// Rendering page with current state and cookie to client-side
		var page = yield ReactApp.render(task.data.path, task.data.curState, {
			cookie: task.data.cookie
		});

		process.send({
			id: task.id,
			page: page
		});

	});
});
