var React = require('react');
var Router = require('react-router');
var Fluky = require('fluky');
var App = require('./app.jsx');

// Server rendering
var render = function(reqPath, state) {

	// Initializing state
	if (state)
		Fluky.setInitialState(state);
	
	return function(callback) {

		// Initlaizing react router
		Router.run(App, reqPath, function(Handler) {

			// Workaround: rendering twice is ugly and tricky, it should
			// find a way to solve the problem that rendering asynchronously.
			var comp = React.createElement(Handler);

			function *done() {
				// just fire once
				Fluky.off('idle', done);

				// Pure re-rendering
				Fluky.disabledEventHandler = true;
				var html = React.renderToStaticMarkup(comp);

				callback(null, html);
			}

			// Wait until everything's done
			Fluky.on('idle', done);

			// Initializing layout
			React.renderToStaticMarkup(comp);
		});
	};
};

module.exports = {
	routes: require('./routes.js'),
	render: render,
	context: Fluky,
	React: React
};
