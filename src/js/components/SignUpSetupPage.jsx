import React from 'react';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';

@router
@flux
@i18n
class SignUpPage extends React.Component {

	constructor() {
		super();

		this.state = {
			error: false,
			username_error: false,
			username_existing_error: false,
			username_empty_error: false,
			confirm_error: false,
			password_error: false,
			password_empty_error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.SignUp', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.SignUp', this.onChange);
	};

	done = () => {
		var features = this.flux.getState('Features');

		var state = {
			error: false
		};

		var regEx;

		// Unique username is enabled
		if (features.uniqueUsername) {
			var username = this.refs.username.value.trim();

			regEx = /^[a-z0-9-]+$/;

			state.username_error = false;
			state.username_empty_error = false;
			state.username_existing_error = false;

			if (username == '') {
				state.error = true;
				state.username_error = true;
				state.username_empty_error = true;
			} else if (!regEx.test(username)) {
				state.error = true;
				state.username_error = true;
			}
		}

		if (features.requiredPassword) {
			var password = this.refs.password.value;
			var confirm_password = this.refs.confirm_password.value;

			state.confirm_error = false;
			state.password_error = false;
			state.password_empty_error = false;

			if (password == '') {
				state.error = true;
				state.password_error = true;
				state.password_empty_error = true;
				state.confirm_error = true;
			} else if (password != confirm_password) {
				// Two passwords should be the same
				state.error = true;
				state.confirm_error = true;
			}
		}

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		// Prepare user info fo signing up
		var userInfo = {};

		if (features.uniqueUsername) {
			userInfo.username = this.refs.username.value.trim();
		}

		if (features.requiredPassword) {
			userInfo.password = this.refs.password.value;
		}

		// Sign up now
		this.flux.dispatch('action.User.signUp', userInfo);
	};

	onChange = () => {
		var features = this.flux.getState('Features');
		var signUp = this.flux.getState('SignUp');
		var user = this.flux.getState('User');

		if (signUp.status == 'success') {
			// No need to sign in if logined already
			if (user.logined) {
				if (this.props.location.query.target) {
					this.history.pushState(null, this.props.location.query.target);
				} else {
					this.history.pushState(null, '/');
				}
			}

			return;
		}

		var updateState = {}
		for (var index in signUp.errors) {
			var err = signUp.errors[index];

			switch(err.code) {
			case 'Required':
				updateState.error = true;
				updateState[err.field + '_error'] = true;
				updateState[err.field + '_empty_error'] = true;
				break;
			case 'Invalid':
				updateState.error = true;
				updateState[err.field + '_error'] = true;
				break;
			case 'AlreadyExist':
				updateState.error = true;
				updateState[err.field + '_error'] = true;
				updateState[err.field + '_existing_error'] = true;
				break;
			}
		}

		this.setState(updateState);

		if (features.requiredPassword) {
			// Clear password inputbox
			this.refs.password.value = ''; 
			this.refs.confirm_password.value = ''; 

			// Focus on password inputbox
			this.refs.password.select();
		}
	};

	render() {

		var features = this.flux.getState('Features');
		var usernameClasses = 'required field';
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var errItems = [];
		var fieldClass = 'field';

		if (this.state.error) {
			fieldClass += ' error';

			if (features.uniqueUsername) {
				if (this.state.username_existing_error) {
					usernameClasses += ' error';
					errItems.push(this.i18n.getMessage('sign_up.username_existing_error', 'Account exists already. Please type another username then try again'));
				} else if (this.state.username_empty_error) {
					usernameClasses += ' error';
					errItems.push(this.i18n.getMessage('sign_up.username_empty_error', 'Please enter username'));
				} else if (this.state.username_error) {
					usernameClasses += ' error';
					errItems.push(this.i18n.getMessage('sign_up.username_invalid_error', 'Username can only contain alphanumeric lowercase characters and dashes(-)'));
				}
			}

			if (features.requiredPassword) {
				if (this.state.password_empty_error) {
					passwordClasses += ' error';
					confirmClasses += ' error';
					errItems.push(this.i18n.getMessage('sign_up.password_empty_error', 'Please enter password'));
				} else if (this.state.password_error) {
					passwordClasses += ' error';
					confirmClasses += ' error';
					errItems.push('Password is invalid');
				} else if (this.state.confirm_error) {
					passwordClasses += ' error';
					confirmClasses += ' error';
					errItems.push(this.i18n.getMessage('sign_up.confirm_error', 'Password doesn\'t match confirmation'));
				}
			}

		}

		return (
			<div className='main-page'>
				<Header />
				<div className={'ui basic center aligned padded segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>

					<div className='ui two column centered stackable grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='privacy icon' />
								<div className='content'><I18n sign='sign_up.complete_process_header'>Complete Account Setup</I18n></div>
							</h1>
							<div className={'ui basic segment'}>
								{(() => {
									if (errItems.length) {
										var messages = [];
										for (var index in errItems) {
											messages.push(<li key={index}>{errItems[index]}</li>);
										}

										return (
											<div className='ui negative icon message'>
												<i className={'warning sign icon'} />
												<div className='content'>
													<div className='header'>
														<I18n sign='sign_up.failed'>Failed to Sign Up</I18n>
													</div>
													<ul>
														{messages}
													</ul>
												</div>
											</div>
										);
									}
								})()}

								<div className='ui form'>

									{(() => {
										if (features.uniqueUsername) {

											return (
												<div className={usernameClasses}>
													<label><I18n sign='sign_up.setup_username'>Set Your Username</I18n></label>
													<div className={'ui left icon input'}>
														<i className={'user icon'} />
														<input type='text' ref='username' name='username' placeholder='fredchien' />
													</div>
												</div>
											);
										}
									})()}

									{(() => {
										if (features.requiredPassword) {

											return (
												<div className={passwordClasses}>
													<label><I18n sign='sign_up.setup_password'>Set Your Password</I18n></label>
													<div className={'ui left icon input'}>
														<i className={'lock icon'} />
														<input type='password' ref='password' name='password' />
													</div>
												</div>
											);
										}
									})()}

									{(() => {
										if (features.requiredPassword) {

											return (
												<div className={confirmClasses}>
													<label><I18n sign='sign_up.confirm'>Confirm</I18n></label>
													<div className={'ui left icon input'}>
														<i className={'lock icon'} />
														<input type='password' ref='confirm_password' name='confirm_password' />
													</div>
												</div>
											);
										}
									})()}

									<div className='field'>
										<button className='ui teal button' onClick={this.done}>
											<I18n sign='sign_up.done_button'>Done</I18n>
										</button>
									</div>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
		);
	}
}

export default SignUpPage;
