import React from 'react';
import Fluky from 'fluky';

import Header from './Header.jsx';
import SettingsMenu from './SettingsMenu.jsx';
import UserProfile from './UserProfile.jsx';

class SettingsRouter extends React.Component {

	render() {
		if (this.props.category)
			return <UserProfile />
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
		var emailClasses = 'required field';
		var nameClasses = 'required field';
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var message;
		var fieldClass = 'field';
		if (this.state.error) {
			fieldClass += ' error';
			message = (
				<div className='ui negative icon message'>
					<i className={'warning sign icon'} />
					<div className='content'>
						<div className='header'>Failed to Sign In</div>
						<p>Please check your email and password then try again</p>
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />
				<div className={'ui basic segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui grid'>
						<div className='computer only three wide column'>
							<SettingsMenu category={this.context.router.getCurrentParams().category} />
						</div>

						<div className='thirteen wide computer column'>
							<SettingsRouter category={this.context.router.getCurrentParams().category} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = SettingsPage;
