var React = require('react');
var Link = require('react-router-component').Link;
var Fluky = require('fluky');

class ProfileMenu extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	};

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: false
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	componentDidUpdate = () => {
//		$(this.refs.sidebar.getDOMNode()).sidebar();
	}

	onChange = () => {
	}

	render() {

		return (
			<div className='ui right floated secondary vertical pointing menu'>
				<a className='active item'>Profile</a>
				<a className='item'>Account Settings</a>
			</div>
		);
	}
}

module.exports = ProfileMenu;
