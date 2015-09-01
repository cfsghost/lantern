var Fluky = require('fluky');
var React = require('react');
//var Routr = require('./routes.jsx');
import Router from 'react-router';
var { Route, RouteHandler, NotFoundRoute, Redirect } = Router;

// Initializing fluky framework
var Fluky = require('fluky');
var Stores = require('./stores');
var Extensions = require('./extensions');

Fluky.load(Stores, Extensions);

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
			<RouteHandler />
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
