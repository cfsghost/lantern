import React from 'react';
import Fluky from 'fluky';

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

class SettingsPage extends React.Component {

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
			<div className='main-page'>
				<Header />
				<div className={'ui basic segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui stackable grid'>
						<div className='computer only four wide column'>
							<SettingsMenu category={this.context.router.getCurrentParams().category} />
						</div>

						<div className='twelve wide computer sixteen wide tablet column'>
							<SettingsRouter category={this.context.router.getCurrentParams().category} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = SettingsPage;
