import React from 'react';
import Router from 'react-router';
var { Route, RouteHandler, NotFoundRoute, Link } = Router;
import Fluky from 'fluky';
import Avatar from './Avatar.jsx';

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
							Admin Panel
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
								Settings
							</Link>
							{adminItem}
							<div className='ui fitted divider'></div>
							<a href='/signout' className='item'>
								<i className='sign out icon'></i>
								Sign Out
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
							Sign In
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
