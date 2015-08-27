import React from 'react';
import Fluky from 'fluky';

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
			<div className='ui right floated secondary vertical pointing menu'>
				<a className='active item'>Profile</a>
				<a className='item'>Account Settings</a>
			</div>
		);
	}
}

export default SettingsMenu;
