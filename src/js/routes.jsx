var React = require('react');
var { Locations, Location } = require('react-router-component');

var Fluky = require('fluky');
var Stores = require('./stores');

Fluky.load(Stores);

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
