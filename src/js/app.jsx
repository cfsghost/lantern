var Fluky = require('fluky');
var React = require('react');
//var Routr = require('./routes.jsx');
import Router from 'react-router';
var { Route, RouteHandler, NotFoundRoute, Link } = Router;

// Initializing fluky framework
var Fluky = require('fluky');
var Stores = require('./stores');

Fluky.load(Stores);

class App extends React.Component {

	static childContextTypes = {
		path: React.PropTypes.string,
		router: React.PropTypes.object,
	};

	constructor(props, context) {
		super(props, context);
	}
/*
	getChildContext() {
		return {
			//path: this.props.path,
			//router: this.refs.router
		}
	}
*/
	render() {
		//console.log(this.refs.router);
		//console.log('App', this.context, this.props.path);
		return (
			<RouteHandler />
		);
		/*
		return (
			<Routr ref='router' path={this.props.path} />
		);
		*/
	}
};

// Routing table
import Routes from './routes.js';

export default (
	<Route handler={App}>
		{Routes.map(function(route, key) {
			if (!route.path)
				return <NotFoundRoute handler={route.handler} key={key} />

			return <Route path={route.path} handler={route.handler} key={key} />
		})}
	</Route>
);
