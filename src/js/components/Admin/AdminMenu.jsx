import React from 'react';
import I18n from 'Extension/I18n.jsx';
import { Link } from 'react-router';

// Decorators
import { router, flux, i18n } from 'Decorator';

@flux
@i18n
@router
class AdminMenu extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div className='ui right floated teal secondary vertical pointing menu'>
				<Link to='/admin/dashboard' className={this.props.category == 'dashboard' ? 'item active' : 'item'}>
					<I18n sign='admin_dashboard.header'>Dashboard</I18n>
				</Link>
				<Link to='/admin/users' className={this.props.category == 'users' ? 'item active' : 'item'}>
					<I18n sign='admin_users.header'>Users</I18n>
				</Link>
				<Link to='/admin/roles' className={this.props.category == 'roles' ? 'item active' : 'item'}>
					<I18n sign='admin_roles.header'>Roles</I18n>
				</Link>
			</div>
		);
	}
}

export default AdminMenu;
