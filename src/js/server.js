var React = require('react');
var Router = require('react-router');
var Fluky = require('fluky');
var Extensions = require('./extensions');

var options = {};

// Server rendering
var render = function(reqPath, state) {

	// Initializing state
	if (state)
		Fluky.setInitialState(state);

	// Loading app
	var App = require('./app.jsx');

	// Loading extenstions
	Fluky.load(Extensions);

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

				callback(null, {
					content: html,
					state: Fluky.state
				});
			}

			// Wait until everything's done
			Fluky.on('idle', done);

			// Initializing layout
			var html = React.renderToStaticMarkup(comp);
			setImmediate(function() {

				// There is no task
				if (!Fluky._refs) {
					Fluky.off('idle', done);
					callback(null, {
						content: html,
						state: Fluky.state
					});
				}
			});
		});
	};
};

module.exports = {
	routes: require('./routes.js'),
	render: render,
	init: function(opts) {

		if (!opts)
			return;

		Fluky.options = opts;
	}
};
