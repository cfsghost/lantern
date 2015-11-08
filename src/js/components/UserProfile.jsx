import React from 'react';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

@flux
@i18n
@preAction('User.syncProfile')
class UserProfile extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('User');

		this.state = {
			busy: false,
			error: false,
			name: state.name,
			email: state.email
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	}

	onChange = () => {

		var user = this.flux.getState('User');

		this.setState({
			name: user.name,
			email: user.email,
			busy: false
		});
	}

	updateProfile = () => {
		if (this.state.busy)
			return;

		this.setState({
			busy: true
		});

		this.flux.dispatch('action.User.updateProfile', this.state.name);
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

		return (
			<div className='ui padded basic segment'>
				<div className='ui form'>
					<h1 className='ui header'>
						<div className='content'>
							<I18n sign='user_profile.header'>Profile</I18n>
							<div className='sub header'><I18n sign='user_profile.subheader'>Personal information</I18n></div>
						</div>
					</h1>

					<div className='ui segments'>
						<div className='ui secondary segment'>
							<h5 className='ui header'>Public Profile</h5>
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

							<div className={nameClasses}>
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

							<div className={emailClasses}>
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
		);
	}
}

export default UserProfile;
