var React = require('react');
var Router = require('react-router');
var Fluky = require('fluky');
var App = require('./app.jsx');

Fluky.setInitialState({
	User: {}
});

// Server rendering
var render = function(reqPath, callback) {

	// Initlaizing router
	Router.run(App, reqPath, function(Handler) {
		var html = React.renderToStaticMarkup(React.createElement(Handler));

		callback(null, html);
	});
};

module.exports = {
//	main: App,
	routes: require('./routes.js'),
	render: render,
	context: Fluky,
	React: React
};
