import React from 'react';

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
				desc: props.data.desc,
				perms: props.data.perms
			}
		};
	}

	componentWillReceiveProps = (nextProps) => {

		this.setState({
			data: {
				name: nextProps.data.name,
				desc: nextProps.data.desc,
				perms: nextProps.data.perms
			}
		});
	}

	onChange = () => {
		var name = this.refs.name.value;
		var desc  = this.refs.desc.value;

		this.setState({
			data: {
				name: name,
				desc: desc
			}
		});
	}

	save = () => {
		console.log(this.refs.permission);
		this.props.onSave({
			name: this.state.data.name,
			desc: this.state.data.desc,
			perms: this.refs.permission.getCurrentPermissions()
		});
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
						<label>Description</label>
						<div className={'ui left input'}>
							<input
								type='text'
								ref='desc'
								name='desc'
								placeholder='Administrator'
								value={this.state.data.desc}
								onChange={this.onChange} />
						</div>
					</div>

					<div className='field'>
							<PermissionPanel ref='permission' data-tab='permission' perms={this.state.data.perms} />
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
	handle.doAction('Admin.Role.get', handle.props.params.roleid);
})
class Role extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.Role');

		this.state = {
			id: state.id,
			profile: {
				name: state.name,
				desc: state.desc,
				perms: state.perms
			}
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.Role', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.Admin.Role', this.onChange);
	}

	componentDidMount() {

		$(this.refs.tab).find('.item').tab();
	}

	onChange = () => {
		var state = this.flux.getState('Admin.Role');

		this.setState({
			id: state.id,
			profile: {
				name: state.name,
				desc: state.desc,
				perms: state.perms
			},
			saving: false
		});
	}

	onSaveProfile = (data) => {

		this.setState({
			saving: true
		});

		this.flux.dispatch('action.Admin.Role.saveProfile', this.state.id, data);
	}

	render() {
		return (
			<AdminLayout category='roles'>
				<div className='ui padded basic segment'>
					<h1 className='ui header'>
						<i className='male icon' />
						<div className='content'>
							{this.state.profile.name}
						</div>
					</h1>

					<div className='ui segment'>

						<div ref='tab' className='ui secondary pointing yellow menu'>
							<a className='item active' data-tab='profile'>Profile</a>
						</div>

						<Profile data-tab='profile' data={this.state.profile} saving={this.state.saving || false} onSave={this.onSaveProfile} />
					</div>
				</div>
			</AdminLayout>
		);
	}
}

export default Role;
