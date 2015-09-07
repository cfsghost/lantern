import crypto from 'crypto';
import React from 'react';
import Fluky from 'fluky';

import Avatar from '../Avatar.jsx';
import AdminLayout from './AdminLayout.jsx';

class Profile extends React.Component {

	static propTypes = {
		onSave: React.PropTypes.func.isRequired
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			data: {
				name: this.props.data.name,
				email: this.props.data.email,
			}
		};
	}

	onChange = () => {
		var name = this.refs.name.getDOMNode().value;
		var email = this.refs.email.getDOMNode().value;

		this.setState({
			data: {
				name: name,
				email: email
			}
		});
	}

	save = () => {
		this.props.onSave(this.state.data);
	}

	render() {

		return (
			<div className='ui active tab basic segment' {...this.props}>
				{((ctx) => {
					if (ctx.state.busy)
						return (
							<div className='ui active dimmer'>
								<div className='ui text loader'>Saving</div>
							</div>
						);
				})(this)}

				<div className='ui form'>
					<div className='field'>
						<label>Display Name</label>
						<div className={'ui left input'}>
							<input
								type='text'
								ref='name'
								name='name'
								placeholder='Fred Chien'
								value={this.state.data.name}
								onChange={this.onChange} />
						</div>
					</div>

					<div className='field'>
						<label>E-mail Address</label>
						<div className={'ui left input'}>
							<input
								type='text'
								ref='email'
								name='email'
								placeholder='fred@example.com'
								value={this.state.data.email}
								onChange={this.onChange} />
						</div>
					</div>

					<div className='field'>
						<button className={'ui teal' + (this.props.saving ? ' loading' : '') + ' button' } onClick={this.save}>Save</button>
					</div>
				</div>

			</div>
		);
	}
}

class Permission extends React.Component {

	render() {
		return (
			<div className='ui tab basic segment' {...this.props}>
			</div>
		);
	}
}

class User extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = Fluky.getState('Admin.User');

		this.state = {
			id: state.id,
			profile: {
				name: state.name,
				email: state.email,
			},
			roles: state.roles
		};
	}

	componentWillMount = () => {
		Fluky.on('store.Admin.User', Fluky.bindListener(this.onChange));
		Fluky.dispatch('action.Admin.User.get', this.props.params.userid);
	}

	componentWillUnmount = () => {
		Fluky.off('store.Admin.User', this.onChange);
	}

	componentDidMount() {

		$(this.refs.tab.getDOMNode()).find('.item').tab();
	}

	onChange = () => {
		var state = Fluky.getState('Admin.User');

		this.setState({
			id: state.id,
			name: state.name,
			email: state.email,
			roles: state.roles,
			saving: false
		});
	}

	onSaveProfile = (data) => {

		this.setState({
			saving: true
		});

		Fluky.dispatch('action.Admin.User.saveProfile', this.state.id, data);
	}

	render() {
		return (
			<AdminLayout category='users'>
				<div className='ui padded basic segment'>
					<h1 className='ui header'>
						<Avatar hash={this.state.email ? crypto.createHash('md5').update(this.state.email).digest('hex') : ''} size={32} />
						<div className='content'>
							{this.state.name}
						</div>
					</h1>

					<div className='ui segment'>

						<div ref='tab' className='ui secondary pointing yellow menu'>
							<a className='item active' data-tab='profile'>Profile</a>
							<a className='item' data-tab='permission'>Permission</a>
						</div>

						<Permission data-tab='permission' />
						<Profile data-tab='profile' data={this.state.profile} saving={this.state.saving} onSave={this.onSaveProfile} />
					</div>
				</div>
			</AdminLayout>
		);
	}
}

export default User;
