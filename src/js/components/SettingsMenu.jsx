import React from 'react';
import Router from 'react-router';
import Fluky from 'fluky';

var Link = Router.Link;

class SettingsMenu extends React.Component {

	static contextTypes = {
		router: React.PropTypes.func.isRequired
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
			<div className='ui right floated teal secondary vertical pointing menu'>
				<Link to='/settings/profile' className='item'>Profile</Link>
				<Link to='/settings/account' className='item'>Account Settings</Link>
			</div>
		);
	}
}

export default SettingsMenu;
