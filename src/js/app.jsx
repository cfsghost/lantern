var React = require('react');
var Fluky = require('fluky');
var Routr = require('./routes.jsx');

class App extends React.Component {

	static childContextTypes = {
		router: React.PropTypes.object,
	};

	getChildContext() {
		return {
			router: this.refs.router
		}
	}

	render() {
		return (
			<Routr ref='router' path={this.props.path} />
		);
	}
};

module.exports = App;
