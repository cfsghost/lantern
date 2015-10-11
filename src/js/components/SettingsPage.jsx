import React from 'react';

// Decorators
import { router, flux, i18n } from 'Decorator';

import Header from './Header.jsx';
import SettingsMenu from './SettingsMenu.jsx';
import UserProfile from './UserProfile.jsx';
import AccountSettings from './AccountSettings.jsx';

class SettingsRouter extends React.Component {

	render() {
		if (this.props.category == 'profile')
			return <UserProfile />

		if (this.props.category == 'account')
			return <AccountSettings />

		return <div />;
	}
}

@router
@flux
@i18n
class SettingsPage extends React.Component {

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
			<div className='main-page'>
				<Header />
				<div className={'ui basic segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui stackable grid'>
						<div className='computer only four wide column'>
							<SettingsMenu category={this.props.params.category} />
						</div>

						<div className='twelve wide computer sixteen wide tablet column'>
							<SettingsRouter category={this.props.params.category} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SettingsPage;
