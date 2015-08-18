var React = require('react');
var { Locations, Location } = require('react-router-component');

// Initializing fluky framework
var Fluky = require('fluky');
var Stores = require('./stores');

Fluky.load(Stores);

// Handlers for routing
import Routes from './routes.js';

class Routr extends React.Component {

	render() {
		return (
			<Locations path={this.props.path}>
				{Routes.map(function(route, key) {
					return <Location path={route.path} handler={route.handler} key={key} />
				})}
			</Locations>
		);
	}
};

module.exports = Routr;
