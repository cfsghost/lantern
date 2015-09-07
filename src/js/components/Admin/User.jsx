import crypto from 'crypto';
import React from 'react';
import Fluky from 'fluky';

import Avatar from '../Avatar.jsx';
import AdminLayout from './AdminLayout.jsx';

class User extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = Fluky.getState('Admin.User');

		this.state = {
			id: state.id,
			name: state.name,
			email: state.email
		};
	}

	componentWillMount = () => {
		Fluky.on('store.Admin.User', Fluky.bindListener(this.onChange));
		Fluky.dispatch('action.Admin.User.get', this.props.params.userid);
	}

	componentWillUnmount = () => {
		Fluky.off('store.Admin.User', this.onChange);
	}

	onChange = () => {
		var state = Fluky.getState('Admin.User');

		this.setState({
			id: state.id,
			name: state.name,
			email: state.email
		});
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

					<div className='ui segments'>
						<div className='ui secondary segment'>
							<h5 className='ui header'>User Profile</h5>
						</div>

						<div className='ui very padded segment'>
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
											value={this.state.name}
											onChange={(event) => this.setState({ name: event.target.value }) } />
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
											value={this.state.email}
											readOnly />
									</div>
								</div>

								<div className='field'>
									<button className={'ui teal' + (this.state.busy ? ' loading' : '') + ' button' } onClick={this.updateProfile}>Update Profile</button>
								</div>
							</div>

						</div>
					</div>
				</div>
			</AdminLayout>
		);
	}
}

export default User;
