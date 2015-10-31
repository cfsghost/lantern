import React from 'react';
import ReactDOM from 'react-dom';
import Fluky from 'fluky';
import { Router } from 'react-router';
import App from './App.jsx';
import Entry from './Entry.jsx';
import routeSettings from './routes.js';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Flux architecture
import Actions from './actions';
import Stores from './stores';
import Extensions from './extensions';

// Loading parts of frameworks
Fluky.load(Actions, Stores, Extensions);

require('../less/theme.less');

var initRoutes = function() {
	var routes = {
		path: '/',
		component: App,
		childRoutes: []
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
				component: route.handler
			});
		}
	}

	return routes;
}

// Rendering immediately
ReactDOM.render((
	<Entry flux={Fluky}>
		<Router routes={initRoutes()} history={createBrowserHistory()} />
	</Entry>
), document.getElementById('app'));
