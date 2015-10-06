import React from 'react';
import {
	Route,
	RouteHandler,
	NotFoundRoute,
	Redirect
} from 'react-router';

// Initializing fluky framework
import Fluky from 'fluky';
import Actions from './actions';
import Stores from './stores';
import Extensions from './extensions';

Fluky.load(Actions, Stores, Extensions);

// Extension Component
import Window from 'Extension/Window.jsx';

class App extends React.Component {

	static childContextTypes = {
		path: React.PropTypes.string,
		router: React.PropTypes.object,
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div>
				<Window />
				<RouteHandler />
			</div>
		);
	}
};

// Routing table
import Routes from './routes.js';

export default (
	<Route handler={App}>
		{Routes.map(function(route, key) {
			if (!route.path)
				return <NotFoundRoute handler={route.handler} key={key} />

			if (route.redirect)
				return <Redirect from={route.path} to={route.redirect} key={key} />

			return <Route path={route.path} handler={route.handler} key={key} />
		})}
	</Route>
);
