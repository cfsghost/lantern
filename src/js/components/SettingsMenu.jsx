import React from 'react';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

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
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	};

	componentDidUpdate = () => {
//		$(this.refs.sidebar.getDOMNode()).sidebar();
	};

	onChange = () => {
	};

	render() {

		return (
			<div className='ui right floated teal secondary vertical pointing menu'>
				<Link to='/settings/profile' activeClassName='active' className='item'>
					<I18n sign='user_profile.header'>Profile</I18n>
				</Link>
				<Link to='/settings/account' activeClassName='active' className='item'>
					<I18n sign='account_settings.header'>Account Settings</I18n>
				</Link>
			</div>
		);
	}
}

export default SettingsMenu;
