var React = require('react');
var { Locations, Location } = require('react-router-component');

// Initializing fluky framework
var Fluky = require('fluky');
var Stores = require('./stores');

Fluky.load(Stores);

// Handlers for routing
var LandingPage = require('./components/LandingPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');

class Routr extends React.Component {

	render() {
		return (
			<Locations path={this.props.path}>
				<Location path='/' handler={LandingPage} />
				<Location path='/signin' handler={SignInPage} />
			</Locations>
		);
	}
};

module.exports = Routr;
