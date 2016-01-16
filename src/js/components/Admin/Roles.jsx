import crypto from 'crypto';
import React from 'react';
import { Link } from 'react-router';

import I18n from 'Extension/I18n.jsx';

// Components
import AdminLayout from './AdminLayout.jsx';
import PermissionPanel from './PermissionPanel.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

@router
@flux
@i18n
class RoleItem extends React.Component {

	componentDidMount = () => {
		$(this.refs.dropdown).dropdown();
	};

	render() {
		return (
			<tr>
				<td>
					<i className='male icon' />
					<span>{this.props.name}</span>
				</td>
				<td>{this.props.desc}</td>
				<td>
					<div className='ui yellow buttons'>
						<Link to={'/admin/roles/role/' + this.props.id} className='ui icon button'>
								<i className='edit icon' /> Edit
						</Link>
						<div ref='dropdown' className='ui floating top right pointing dropdown icon button'>
							<i className='dropdown icon'></i>
							<div className='menu'>
								<div className='item'>
									<i className='delete icon' />
									Delete
								</div>
							</div>
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

		this.flux.dispatch('action.Admin.Roles.query', conditions);
	};

	render() {

		return (
			<div className='ui left action icon input'>
				<select ref='field' className='ui selection dropdown'>
					<option value='name'>Name</option>
					<option value='desc'>Description</option>
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
class NewRoleModal extends React.Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.visible) {
			// Clear input field
			this.refs.name.value = '';
			this.refs.desc.value = '';

			$(this.refs.component).modal({				
			    onApprove: this.onCreate
			}).modal('show');
		} else {
			$(this.refs.component).modal('hide');
		}
	}

	onCreate = () => {
		var perms = this.refs.permission.getCurrentPermissions();
		var name = this.refs.name.value;
		var desc = this.refs.desc.value;

		this.flux.dispatch('action.Admin.Roles.create', name, desc, perms);
	};

	render() {
		return (
			<div ref='component' className='ui small modal'>
				<div className='header'>
					New Role
				</div>
				<div className='content'>
					<div className='ui form'>
						<div className='field'>
							<label>Name</label>
							<div className={'ui left input'}>
								<input
									type='text'
									ref='name'
									name='name'
									placeholder='Admin' />
							</div>
						</div>

						<div className='field'>
							<label>Description</label>
							<div className={'ui left input'}>
								<input
									type='text'
									ref='desc'
									name='desc'
									placeholder='Administrator' />
							</div>
						</div>

						<div className='field'>
							<label>Permission</label>
							<PermissionPanel ref='permission' />
						</div>

					</div>
				</div>
				<div className='actions'>
					<div className='ui black deny button'>
						Cancel
					</div>
					<div className={'ui positive right labeled ' + (this.props.saving ? ' loading' : '') + ' icon button'} onClick={this.onCreate}>
						Create
						<i className='checkmark icon' />
					</div>
				</div>
			</div>
		);
	}
}

@flux
@i18n
@preAction('Admin.Roles.query')
class Roles extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.Roles');

		this.state = {
			roles: state.roles,
			page: state.page,
			pageCount: state.pageCount,
			perPage: state.perPage,
			busy: false,
			newRoleModal: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.Roles', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.Admin.Roles', this.onChange);
	};

	onChange = () => {
		var state = this.flux.getState('Admin.Roles');

		this.setState({
			roles: state.roles,
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

	newRole = () => {
		this.setState({
			newRoleModal: true
		});
	};

	render() {
		var roles = [];
		for (var index in this.state.roles) {
			var role = this.state.roles[index];
			roles.push(
				<RoleItem
					id={role._id}
					name={role.name}
					desc={role.desc}
					key={index} />
			);
		}

		return (
			<AdminLayout category='roles'>
				<div className='ui basic segment'>

					<div className='ui stackable grid'>
						<div className='four wide computer sixteen wide tablet column'>
							<h1 className='ui header'>
								<i className='users icon' />
								<div className='content'>
									<I18n sign='admin_roles.header'>Roles</I18n>
									<div className='sub header'>
										<I18n sign='admin_roles.subheader'>Role management</I18n>
									</div>
								</div>
							</h1>
						</div>

						<div className='eight wide computer sixteen wide tablet right floated right aligned column'>
							<SearchBar />
						</div>
					</div>

					<NewRoleModal visible={this.state.newRoleModal} />

					<div className='ui icon menu'>
						<a className='item' onClick={this.newRole}>
							<i className='add icon'></i>
						</a>
					</div>

					<PageNavigator page={this.state.page} pageCount={this.state.pageCount} top={true} />

					<table className='ui attached striped table'>
						<thead>
							<tr>
								<th className='three wide'>Name</th>
								<th>Description</th>
								<th className='two wide'></th>
							</tr>
						</thead>
						<tbody>
							{roles}
						</tbody>
					</table>

					<div className={'ui attached negative message ' + (roles.length ? 'hidden' : '')}>
					No Records
					</div>

					<PageNavigator page={this.state.page} pageCount={this.state.pageCount} bottom={true} />
				</div>
			</AdminLayout>
		);
	}
}

export default Roles;
