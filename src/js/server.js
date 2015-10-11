import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import Entry from './Entry.jsx';

// Flux architecture
import Actions from './actions';
import Stores from './stores';
import Extensions from './extensions';

var options = {};

var initRoutes = function() {
	var routes = {
		path: '/',
		component: require('./app.jsx'),
		childRoutes: []
	};

	for (var index in server.routes) {
		var route = server.routes[index];
		if (route.path == '/') {
			routes.indexRoute = {
				component: route.handler
			};
			continue;
		}

		routes.childRoutes.push({
			path: route.path,
			component: route.handler
		});
	}

	return routes;
}

var initEntry = function(error, redirectLocation, renderProps, state) {

	// Initializing FLUX framework
	delete require.cache[require.resolve('fluky')];
	var Fluky = require('fluky');

	// Initializing state
	if (state)
		Fluky.setInitialState(state);

	// Loading parts of frameworks
	Fluky.load(Actions, Stores, Extensions);

	var component = (
		<Entry flux={Fluky}>
			<RoutingContext {...renderProps} />
		</Entry>
	);

	return {
		state: Fluky.state,
		component: component
	};
};

// Server rendering
var render = function(reqPath, state) {

	// Initializing state
//	if (state)
//		Fluky.setInitialState(state);

	// Loading app
//	var App = require('./app.jsx');

	return function(callback) {

		// Initlaizing react router
		//Router.run(App, reqPath, function(Handler) {

			// Workaround: rendering twice is ugly and tricky, it should
			// find a way to solve the problem that rendering asynchronously.
			//var comp = React.createElement(Handler);
			//var comp = React.createElement(App);
/*
			function *done() {
				// just fire once
				Fluky.off('idle', done);

				// Pure re-rendering
				Fluky.disabledEventHandler = true;
				//var html = ReactDOMServer.renderToStaticMarkup(comp);
				var html = ReactDOMServer.renderToStaticMarkup(App);

				callback(null, {
					content: html,
					state: Fluky.state
				});
			}
*/
			// Wait until everything's done
//			Fluky.on('idle', done);
			match({ routes: initRoutes(), 'location': reqPath }, (error, redirectLocation, renderProps) => {
				if (error)
					return;

				// Initializing layout
				var entry = initEntry(error, redirectLocation, renderProps, state);
				var html = ReactDOMServer.renderToStaticMarkup(entry.component);

				callback(null, {
					content: html,
					state: entry.state
				});
			});
/*
			return;
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
*/
//		});
	};
};

var server = module.exports = {
	routes: require('./routes.js'),
	render: render,
	init: function(opts) {

		if (!opts)
			return;

		options = opts;
	}
};
