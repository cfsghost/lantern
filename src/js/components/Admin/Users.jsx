import crypto from 'crypto';
import React from 'react';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

// Components
import AdminLayout from './AdminLayout.jsx';
import Avatar from '../Avatar.jsx';

// Decorators
import { router, flux, i18n, preAction, wait, clientOnly } from 'Decorator';

@flux
@i18n
@router
class UserItem extends React.Component {

	componentDidMount = () => {
		$(this.refs.dropdown).dropdown();
	};

	deleteUser = () => {
		this.flux.dispatch('action.Admin.Users.deleteOne', this.props.id);
	};

	render() {
		var avatar_hash = crypto.createHash('md5').update(this.props.email).digest('hex');
		return (
			<tr>
				<td>
					<Avatar hash={avatar_hash} size={16} />
					<span>{this.props.name}</span>
				</td>
				<td>{this.props.email}</td>
				<td>{this.props.created.split('T')[0]}</td>
				<td>
					<div className='ui yellow buttons'>
						<Link to={'/admin/users/user/' + this.props.id} className='ui icon button'>
								<i className='edit icon' /> Edit
						</Link>
						<div ref='dropdown' className='ui floating top right pointing dropdown icon button'>
							<i className='dropdown icon'></i>
							<a className='menu' onClick={this.deleteUser}>
								<div className='item'>
									<i className='delete icon' />
									Delete
								</div>
							</a>
						</div>
					</div>
				</td>
			</tr>
		);
	}
}

class SearchBar extends React.Component {

	componentDidMount = () => {
		$(this.refs.field).dropdown();
	};

	onSubmit = () => {

		var field = this.refs.field.value;
		var keywords = this.refs.keywords.value;
		var conditions = {};
		if (keywords)
			conditions[field] = keywords;

		this.flux.dispatch('action.Admin.Users.query', conditions);
	};

	render() {

		return (
			<div className='ui left action icon input'>
				<select ref='field' className='ui selection dropdown'>
					<option value='name'>Name</option>
					<option value='email'>E-mail</option>
				</select>
				<input type='text' ref='keywords' placeholder='Search...' />
				<i className='search link icon' onClick={this.onSubmit}></i>
			</div>
		);
	}
}

class PageNavigator extends React.Component {

	render() {
		var posClass;

		if (this.props.top)
			posClass = 'top';

		if (this.props.bottom)
			posClass = 'bottom';

		var pageItems = [];
		for (var index = 1; index <= this.props.pageCount; index++) {
			if (index == this.props.page)
				pageItems.push(<div className='item active' key={index}>{index}</div>);
			else
				pageItems.push(<div className='item' key={index}>{index}</div>);
		}

		return (
			<div className={'ui ' + posClass + ' attached teal inverted borderless pagination menu'}>
				<a className='icon item'>
					<i className='left chevron icon' />
				</a>
				{pageItems}
				<a className='icon item'>
					<i className='right chevron icon' />
				</a>
			</div>
		);
	}
}

@flux
@i18n
@preAction('Admin.Users.query')
@wait('Admin.Users')
class Users extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.Users');

		this.state = {
			users: state.users,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false,
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.Users', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.Admin.Users', this.onChange);
	};

	onChange = () => {
		var state = this.flux.getState('Admin.Users');

		this.setState({
			users: state.users,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false
		});
	};

	updateProfile = () => {
		if (this.state.busy)
			return;

		this.setState({
			busy: true
		});

		this.flux.dispatch('action.User.updateProfile', this.state.name);
	};

	render() {
		var users = [];
		for (var index in this.state.users) {
			var user = this.state.users[index];
			users.push(
				<UserItem
					id={user._id}
					name={user.name}
					email={user.email}
					created={user.created}
					key={index} />
			);
		}

		return (
			<AdminLayout category='users'>
				<div className='ui basic segment'>

					<div className='ui stackable grid'>
						<div className='four wide computer sixteen wide tablet column'>
							<h1 className='ui header'>
								<i className='users icon' />
								<div className='content'>
									<I18n sign='admin_users.header'>Users</I18n>
									<div className='sub header'>
										<I18n sign='admin_users.subheader'>User Management</I18n>
									</div>
								</div>
							</h1>
						</div>

						<div className='eight wide computer sixteen wide tablet right floated right aligned column'>
							<SearchBar />
						</div>
					</div>

					<PageNavigator page={this.state.page} pageCount={this.state.pageCount} top={true} />

					<table className='ui attached striped table'>
						<thead>
							<tr>
								<th className='three wide'>Name</th>
								<th>E-mail</th>
								<th className='two wide'>Registered</th>
								<th className='two wide'></th>
							</tr>
						</thead>
						<tbody>
							{users}
						</tbody>
					</table>

					<div className={'ui attached negative message ' + (users.length ? 'hidden' : '')}>
					No Records
					</div>

					<PageNavigator page={this.state.page} pageCount={this.state.pageCount} bottom={true} />
				</div>
			</AdminLayout>
		);
	}
/*
					<div className='ui icon menu'>
						<div className='item'>
							<i className='add user icon'></i>
						</div>
					</div>
*/
}

export default Users;
