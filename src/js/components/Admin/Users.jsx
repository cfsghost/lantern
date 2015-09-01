import crypto from 'crypto';
import React from 'react';
import Fluky from 'fluky';
import Avatar from '../Avatar.jsx';

class UserItem extends React.Component {

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
			</tr>
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

class Users extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = Fluky.getState('Admin.Users');

		this.state = {
			users: state.users,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false,
			error: false,
			name: '',
			email: ''
		};
	}

	componentWillMount = () => {
		Fluky.on('store.Admin.Users', Fluky.bindListener(this.onChange));
		Fluky.dispatch('action.Admin.Users.query');
	}

	componentWillUnmount = () => {
		Fluky.off('store.Admin.Users', this.onChange);
	}

	componentDidMount = () => {
		$('.ui.dropdown').dropdown();
	}

	onChange = () => {
		var state = Fluky.getState('Admin.Users');

		this.setState({
			users: state.users,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false
		});
	}

	updateProfile = () => {
		if (this.state.busy)
			return;

		this.setState({
			busy: true
		});

		Fluky.dispatch('action.User.updateProfile', this.state.name);
	}

	render() {
		var emailClasses = 'field';
		var nameClasses = 'required field';
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

		var users = [];
		for (var index in this.state.users) {
			var user = this.state.users[index];
			users.push(
				<UserItem
					name={user.name}
					email={user.email}
					created={user.created}
					key={index} />
			);
		}

		return (
			<div className='ui basic segment'>

				<div className='ui stackable grid'>
					<div className='four wide computer sixteen wide tablet column'>
						<h1 className='ui header'>
							<div className='content'>
								Users
								<div className='sub header'>User management</div>
							</div>
						</h1>
					</div>

					<div className='eight wide computer sixteen wide tablet right floated right aligned column'>
						<div className='ui left action icon input'>
							<select className='ui selection dropdown'>
								<option value='name'>Name</option>
								<option value='email'>E-mail</option>
							</select>
							<input type='text' placeholder='Search...' />
							<i className='search link icon'></i>
						</div>
					</div>
				</div>

					<div className='ui icon menu'>
						<div className='item'>
							<i className='add user icon'></i>
						</div>
					</div>

					<PageNavigator page={this.state.page} pageCount={this.state.pageCount} top={true} />

					<table className='ui attached striped table'>
						<thead>
							<tr>
								<th className='three wide'>Name</th>
								<th>E-mail</th>
								<th className='two wide'>Registered</th>
							</tr>
						</thead>
						<tbody>
							{users}
						</tbody>
					</table>

					<PageNavigator page={this.state.page} pageCount={this.state.pageCount} bottom={true} />
			</div>
		);
	}
}

export default Users;
