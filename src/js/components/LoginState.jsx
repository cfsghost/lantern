import React from 'react';
import { Link } from 'react-router';
import I18n from 'Extension/I18n.jsx';

// Components
import Avatar from './Avatar.jsx';

class LoginState extends React.Component {

	static propTypes = {
		displayName: React.PropTypes.bool
	};

	static defaultProps = {
		displayName: true
	};

	componentDidMount() {

		// Enabling dropdown menu
		if (this.refs.dropdownMenu) {
			$(this.refs.dropdownMenu).dropdown({
				on: 'hover'
			});
		}
	}

	render() {

		var loginState;
		if (this.props.user.logined) {
			var adminItem;
			if (this.props.user.permissions.admin) {
				if (this.props.user.permissions.admin.access) {
					adminItem = (
						<Link to='/admin' className='item'>
							<i className='spy icon'></i>
							<I18n sign='header.menu.admin_panel'>Admin Panel</I18n>
						</Link>
					);
				}
			}

			loginState = (
				<div ref='dropdownMenu' className='ui dropdown item'>
					<span>
						<Avatar hash={this.props.user.avatar_hash} size={20} />
						{(() => {
							if (this.props.displayName)
								return <span>{this.props.user.name}</span>;
						})()}
					</span>
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
			);
		} else {
			loginState = (
				<Link className='item' to='/signin'>
					<i className={'sign in icon'} />
					<I18n sign='header.menu.sign_in'>Sign In</I18n>
				</Link>
			);
		}

		return loginState;
	}
}

export default LoginState;
