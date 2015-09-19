import React from 'react';
import Fluky from 'fluky';

import AdminLayout from './AdminLayout.jsx';
import PermissionPanel from './PermissionPanel.jsx';

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
		var name = this.refs.name.getDOMNode().value;
		var desc  = this.refs.desc.getDOMNode().value;

		this.setState({
			data: {
				name: name,
				desc: desc
			}
		});
	}

	save = () => {
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

class Role extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = Fluky.getState('Admin.Role');

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
		Fluky.on('store.Admin.Role', Fluky.bindListener(this.onChange));
		Fluky.dispatch('action.Admin.Role.get', this.props.params.roleid);
	}

	componentWillUnmount = () => {
		Fluky.off('store.Admin.Role', this.onChange);
	}

	componentDidMount() {

		$(this.refs.tab.getDOMNode()).find('.item').tab();
	}

	onChange = () => {
		var state = Fluky.getState('Admin.Role');

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

		Fluky.dispatch('action.Admin.Role.saveProfile', this.state.id, data);
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
