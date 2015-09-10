import React from 'react';
import Router from 'react-router';
import Fluky from 'fluky';

var Link = Router.Link;

class AdminMenu extends React.Component {

	static contextTypes = {
		router: React.PropTypes.func.isRequired
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div className='ui right floated teal secondary vertical pointing menu'>
				<Link to='/admin/dashboard' className={this.props.category == 'dashboard' ? 'item active' : 'item'}>Dashboard</Link>
				<Link to='/admin/users' className={this.props.category == 'users' ? 'item active' : 'item'}>Users</Link>
				<Link to='/admin/roles' className={this.props.category == 'roles' ? 'item active' : 'item'}>Roles</Link>
			</div>
		);
	}
}

export default AdminMenu;
