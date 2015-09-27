import React from 'react';
import {
	Route,
	RouteHandler,
	NotFoundRoute,
	Link
} from 'react-router';
import Fluky from 'fluky';

// Components
import Avatar from './Avatar.jsx';
import I18n from './I18n.jsx';

class Header extends React.Component {

	constructor() {
		super();

		this.state = {
			user: Fluky.getState('User')
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	componentDidMount() {

		// Enabling dropdown menu
		$(this.refs.component.getDOMNode()).find('.ui.dropdown').dropdown({
			on: 'hover'
		});
	}

	onChange = () => {

		this.setState({
			user: Fluky.getState('User')
		});
	}

	render() {

		var loginState;
		if (this.state.user.logined) {
			var adminItem;
			if (this.state.user.permissions.admin) {
				if (this.state.user.permissions.admin.access) {
					adminItem = (
						<Link to='/admin' className='item'>
							<i className='spy icon'></i>
							<I18n sign='header.menu.admin_panel'>Admin Panel</I18n>
						</Link>
					);
				}
			}

			loginState = (
				<div className={'right menu'}>
					<div className='ui dropdown item'>
						<span><Avatar hash={this.state.user.avatar_hash} size={20} /> <span>{this.state.user.name}</span></span>
						<i className='dropdown icon'></i>
						<div className='menu'>
							<Link to='/settings' className='item'>
								<i className='settings icon'></i>
								<I18n sign='header.menu.settings'>Settings</I18n>
							</Link>
							{adminItem}
							<div className='ui fitted divider'></div>
							<a href='/signout' className='item'>
								<i className='sign out icon'></i>
								<I18n sign='header.menu.sign_out'>Sign Out</I18n>
							</a>
						</div>
					</div>
				</div>
			);
		} else {
			loginState = (
				<div className={'right menu'}>
					<Link to='/signin'>
						<div className={'item'}>
							<i className={'sign in icon'} />
							<I18n sign='header.menu.sign_in'>Sign In</I18n>
						</div>
					</Link>
				</div>
			);
		}

		return (
			<div ref='component' className={'ui top fixed inverted menu'}>
				<Link to='/' className={'item'} activeClassName=''>
					<div>Lantern</div>
				</Link>
				{loginState}
			</div>
		);
	}
};

export default Header;
