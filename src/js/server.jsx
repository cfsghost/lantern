import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Fluky from 'fluky';
import Entry from './Entry.jsx';
import App from './App.jsx';

// Flux architecture
import Actions from './actions';
import Stores from './stores';
import Extensions from './extensions';

// Server doesn't need setState method
React.Component.prototype.setState = function() {};

var options = {};
var routes = null;

var initRoutes = function() {
	if (routes)
		return routes;

	routes = {
		path: '/',
		component: App,
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

		if (route.getHandler) {

			// Load component directly
			route.getHandler({}, function(err, component) {

				routes.childRoutes.push({
					path: route.path,
					component: component
				});
			});
		} else {

			routes.childRoutes.push({
				path: route.path,
				component: route.handler
			});
		}
	}

	return routes;
}

function createElement(Component, props) {
	return <Component {...props}/>
}

function generateNewContent(fluky, component, callback) {

	// Pure re-rendering and do not trigger any FLUX mechanism
	fluky.disabledEventHandler = true;
	var html = ReactDOMServer.renderToStaticMarkup(component);

	// Retern final pagee
	callback(null, {
		content: html,
		state: fluky.state
	});
}

var initEntry = function(error, redirectLocation, renderProps, state, userdata, callback) {

	// Initializing FLUX framework
	var fluky = Fluky.createInstance();

	fluky.options = {
		userdata: userdata,
		statics: options
	};

	// Initializing state
	if (state)
		fluky.setInitialState(state);

	// Loading parts of frameworks
	fluky.load(Actions, Stores, Extensions);
	fluky.dispatch('action.Lantern.setInheritServerState', true);

	var component = (
		<Entry flux={fluky}>
			<RouterContext {...renderProps} createElement={createElement} />
		</Entry>
	);

	function *rendered() {

		fluky.off('action.Lantern.rendered', rendered);
		fluky.serverRendering = true;

		// Redirect
		var lanternStore = fluky.getState('Lantern');
		if (lanternStore.redirect) {
			callback(null, {
				redirect: lanternStore.redirect
			});

			return;
		}

		generateNewContent(fluky, component, callback);
	}

	// Wait until everything's done
	fluky.on('action.Lantern.rendered', rendered);

	// Start to initialize page
	var html = ReactDOMServer.renderToStaticMarkup(component);

	setImmediate(function() {
		var componentRef = fluky.getState('Lantern').componentRef;
		if (!componentRef) {

			// Generate immediately
			callback(null, {
				content: html,
				state: fluky.state
			});
		}
	});

};

// Server rendering
var render = function(reqPath, state, userdata) {

	return function(callback) {

		// Initlaizing react router
		match({ routes: initRoutes(), 'location': reqPath }, (error, redirectLocation, renderProps) => {
			if (error)
				return;

			// Initializing page
			initEntry(error, redirectLocation, renderProps, state, userdata, callback);
		});
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
