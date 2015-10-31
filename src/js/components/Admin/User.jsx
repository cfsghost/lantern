import crypto from 'crypto';
import React from 'react';

// Components
import Avatar from '../Avatar.jsx';
import AdminLayout from './AdminLayout.jsx';
import PermissionPanel from './PermissionPanel.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

@flux
@i18n
class Profile extends React.Component {

	static propTypes = {
		onSave: React.PropTypes.func.isRequired
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			data: {
				name: props.data.name,
				email: props.data.email
			}
		};
	}

	componentWillReceiveProps = (nextProps) => {

		this.setState({
			data: {
				name: nextProps.data.name,
				email: nextProps.data.email
			}
		});
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

@flux
@i18n
@preAction((handle) => {
	handle.doAction('Admin.User.get', handle.props.params.userid);
	handle.doAction('Admin.Roles.query', {}, { permissions: true });
})
class User extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.User');
		var rolesStore = this.flux.getState('Admin.Roles');

		this.state = {
			id: state.id,
			profile: {
				name: state.name,
				email: state.email
			},
			permission: {
				perms: state.perms
			},
			roles: state.roles,
			availRoles: rolesStore.roles
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.User', this.flux.bindListener(this.onChange));
		this.flux.on('state.Admin.Roles', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.Admin.User', this.onChange);
		this.flux.off('state.Admin.Roles', this.onChange);
	}

	componentDidMount() {
		var self = this;

		$(this.refs.tab.getDOMNode()).find('.item').tab();
		$(this.refs.roles.getDOMNode()).dropdown({
			onChange: function(values) {
				console.log('Changed');

				self.state.roles = values;

				// Force update state
				self.forceUpdate();
			},
			onAdd: function(value) {
				console.log('Add', value);

				// Getting permissions of roles
				for (var index in self.state.availRoles) {
					var role = self.state.availRoles[index];

					if (role._id != value)
						continue;

					// Setting permissions
					var perms = role.permissions;
					for (var group in perms) {
						var permSets = perms[group];

						if (!self.state.permission.perms.hasOwnProperty(group))
							self.state.permission.perms[group] = {};

						for (var name in permSets) {
							var perm = permSets[name];
							self.state.permission.perms[group][name] = true;
						}
					}
					break;
				}
			},
			onRemove: function(value) {
				console.log('Remove', value);

				// Getting permissions of roles
				for (var index in self.state.availRoles) {
					var role = self.state.availRoles[index];

					if (role._id != value)
						continue;

					// Setting permissions
					var perms = role.permissions;
					for (var group in perms) {
						var permSets = perms[group];

						if (!self.state.permission.perms.hasOwnProperty(group))
							continue;

						for (var name in permSets) {
							var perm = permSets[name];
							self.state.permission.perms[group][name] = false;
						}
					}
					break;
				}
			}
		});
	}

	onChange = () => {
		var state = this.flux.getState('Admin.User');

		this.setState({
			id: state.id,
			profile: {
				name: state.name,
				email: state.email
			},
			permission: {
				perms: state.perms
			},
			roles: state.roles,
			saving: false
		});
	}

	onSaveProfile = (data) => {

		this.setState({
			saving: true
		});

		this.flux.dispatch('action.Admin.User.saveProfile', this.state.id, data);
	}

	onSavePermission = () => {
		this.setState({
			saving: true
		});

		this.flux.dispatch('action.Admin.User.savePermission',
			this.state.id,
			this.state.roles,
			this.refs.permission.getCurrentPermissions());
	}

	render() {
		var roles = [];

		for (var index in this.state.availRoles) {
			var role = this.state.availRoles[index];

			if (this.state.roles.indexOf(role._id) == -1)
				roles.push(<option value={role._id} key={index}>{role.name}</option>);
			else
				roles.push(<option value={role._id} key={index} selected={true}>{role.name}</option>);
		}

		return (
			<AdminLayout category='users'>
				<div className='ui padded basic segment'>
					<h1 className='ui header'>
						<Avatar hash={this.state.profile.email ? crypto.createHash('md5').update(this.state.profile.email).digest('hex') : ''} size={32} />
						<div className='content'>
							{this.state.profile.name}
						</div>
					</h1>

					<div className='ui segment'>

						<div ref='tab' className='ui secondary pointing yellow menu'>
							<a className='item active' data-tab='profile'>Profile</a>
							<a className='item' data-tab='permission'>Permission</a>
						</div>

						<Profile data-tab='profile' data={this.state.profile} saving={this.state.saving || false} onSave={this.onSaveProfile} />
						<div data-tab='permission' className='ui tab basic segment'>
							<div className='ui sub header'>Roles</div>
							<select ref='roles' multiple={true} className='ui fluid multiple dropdown'>
								<option value=''>Normal User</option>
								{roles}
							</select>

							<div className='ui sub header'>Permissions</div>
							<PermissionPanel ref='permission' data-tab='permission' perms={this.state.permission.perms} />
							<button className={'ui teal' + (this.state.saving ? ' loading' : '') + ' button' } onClick={this.onSavePermission}>Update Permission</button>
						</div>
					</div>
				</div>
			</AdminLayout>
		);
	}
}

export default User;
