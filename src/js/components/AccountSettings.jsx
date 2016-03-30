import React from 'react';

import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

@flux
@i18n
class ChangePassword extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			readyToUpdate: false,
			busy: false,
			error: false,
			msg: '',
			showMessages: false,
			updateSuccess: false
		};
	}

	updatePassword = () => {
		if (this.state.busy)
			return;

		this.setState({
			showMessages: false,
			busy: true,
			updateSuccess: false,
			error: false
		});

		this.flux.dispatch('action.User.updatePassword',
				this.refs.password.value, function(err, success) {

					var state = {
						showMessages: true,
						busy: false
					};

					if (err) {
						state.error = true;
						state.msg = err;
					} else if (success) {
						state.updateSuccess = true;
						state.msg = 'The new password will be used next time the logs in';
					}

					this.setState(state);

					// Clear input
					this.refs.password.value = '';
					this.refs.confirm_password.value = '';
				}.bind(this));
	};

	handleChange = () => {
		var password = this.refs.password.value;
		var confirm_password = this.refs.confirm_password.value;

		// Password field doesn't match another field
		if (confirm_password != password) {
			this.setState({
				readyToUpdate: false
			});

			return;
		}

		this.setState({
			readyToUpdate: true
		});
	};

	render() {
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var message;

		if (this.state.showMessages) {
			if (this.state.error) {
				message = (
					<div className='ui negative icon message'>
						<i className={'warning sign icon'} />
						<div className='content'>
							<div className='header'>Failed to update password</div>
							<p>{this.state.msg}</p>
						</div>
					</div>
				);
			} else if (this.state.updateSuccess) {
				message = (
					<div className='ui positive icon message'>
						<i className={'checkmark icon'} />
						<div className='content'>
							<div className='header'>Password updated successfully</div>
							<p>The new password will be used next time the logs in</p>
						</div>
					</div>
				);
			}
		}

		return (
			<div className='ui segments'>
				<div className='ui secondary segment'>
					<h5 className='ui header'>
						<I18n sign='account_settings.change_password'>Change Password</I18n>
					</h5>
				</div>

				<div className='ui very padded segment'>
					{((ctx) => {
						if (ctx.state.busy)
							return (
								<div className='ui active dimmer'>
									<div className='ui text loader'>Updating</div>
								</div>
							);
					})(this)}

					{message}

					<div className={passwordClasses}>
						<label>
							<I18n sign='account_settings.new_password'>New Password</I18n>
						</label>
						<div className={'ui left icon input'}>
							<i className={'lock icon'} />
							<input
								type='password'
								ref='password'
								name='password'
								onChange={this.handleChange} />
						</div>
					</div>

					<div className={confirmClasses}>
						<label>
							<I18n sign='account_settings.confirm'>Confirm new password</I18n>
						</label>
						<div className={'ui left icon input'}>
							<i className={'lock icon'} />
							<input
								type='password'
								ref='confirm_password'
								name='confirm_password'
								onChange={this.handleChange} />
						</div>
					</div>

					<div className='field'>
						<button
							className={'ui ' + (!this.state.readyToUpdate ? 'disabled' : '') + ' teal button'}
							onClick={this.updatePassword}>
							<I18n sign='account_settings.update_password_button'>Update Password</I18n>
						</button>
					</div>
				</div>
			</div>
		);
	}
}

class AccountSettings extends React.Component {

	render() {
		return (
			<div className='ui padded basic segment'>
				<div className='ui form'>
					<h1 className='ui header'>
						<div className='content'>
							<I18n sign='account_settings.header'>Account Settings</I18n>
							<div className='sub header'>
								<I18n sign='account_settings.subheader'>Password and identifiable information</I18n>
							</div>
						</div>
					</h1>

					<ChangePassword />
				</div>
			</div>
		);
	}
}

export default AccountSettings;
