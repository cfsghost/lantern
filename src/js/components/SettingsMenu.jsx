import React from 'react';
import { Link } from 'react-router';

// Decorators
import { router, flux, i18n } from 'Decorator';

@router
@flux
@i18n
class SettingsMenu extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('store.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('store.User', this.onChange);
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
