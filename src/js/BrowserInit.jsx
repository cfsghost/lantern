import React from 'react';
import ReactDOM from 'react-dom';
import Fluky from 'fluky';
import { Router } from 'react-router';
import App from './App.jsx';
import Entry from './Entry.jsx';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Flux architecture
import Actions from './actions';
import Stores from './stores';
import Extensions from './extensions';

// Loading parts of frameworks
Fluky.load(Actions, Stores, Extensions);

require('../less/theme.less');

var initRoutes = function(routeSettings) {
	var routes = {
		path: '/',
		component: App,
		childRoutes: [],
		onLeave: function() {
			// Reset window title
			Fluky.dispatch('action.Window.setTitle', Fluky.getState('Service').name);
		}
	};

	// Loading routes
	for (var index in routeSettings) {
		var route = routeSettings[index];

		if (route.path == '/') {
			routes.indexRoute = {
				component: route.handler
			};
			continue;
		}

		if (route.redirect) {

			// Redirect
			(function(targetPath) { 
				routes.childRoutes.push({
					path: route.path,
					onEnter: function(nextState, replaceState) {
						replaceState(null, targetPath);
					}
				});
			})(route.redirect);
		} else {

			routes.childRoutes.push({
				path: route.path,
				component: route.handler,
				onLeave: function() {
					// Reset window title
					Fluky.dispatch('action.Window.setTitle', Fluky.getState('Service').name);
				}
			});
		}
	}

	return routes;
}

var routeSettings = require('./routes');
var routes = initRoutes(routeSettings);
var history = createBrowserHistory();

export default class BrowserInit extends React.Component {
	render() {

		return (
			<Entry flux={Fluky}>
				<Router routes={routes} history={history} onUpdate={this.onUpdate} />
			</Entry>
		);
	}
}
