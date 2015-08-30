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

class Users extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			page: 1,
			pageCount: 1,
			perPage: 100,
			users: [],
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

	componentDidUpdate = () => {
//		$(this.refs.sidebar.getDOMNode()).sidebar();
	}

	onChange = () => {

		Fluky.dispatch('action.Admin.Users.getState', function(state) {
			this.setState({
				users: state.users,
				page: state.page,
				pageCount: state.pageCount,
				perPage: state.perPage,
				busy: false
			});
		}.bind(this));
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
				<div className='ui form'>
					<h1 className='ui header'>
						<div className='content'>
							Users
							<div className='sub header'>User management</div>
						</div>
					</h1>

						<div className='ui top attached secondary segment'>
							<h5 className='ui header'>Users</h5>
						</div>


						<table className='ui bottom attached striped table'>
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

				</div>
			</div>
		);
	}
}

export default Users;
