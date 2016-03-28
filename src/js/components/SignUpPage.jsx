import React from 'react';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';

@router
@flux
class SignUpPage extends React.Component {

	constructor() {
		super();

		this.state = {
			error: false,
			username_error: false,
			username_existing_error: false,
			username_empty_error: false,
			email_existing_error: false,
			email_error: false,
			email_empty_error: false,
			confirm_error: false,
			password_error: false,
			password_empty_error: false,
			name_error: false,
			name_empty_error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.SignUp', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.SignUp', this.onChange);
	};

	signUp = () => {
		var features = this.flux.getState('Features');
		var email = this.refs.email.value.trim();
		var name = this.refs.name.value.trim();
		var password = this.refs.password.value;
		var confirm_password = this.refs.confirm_password.value;

		var state = {
			error: false,
			email_error: false,
			email_empty_error: false,
			confirm_error: false,
			password_error: false,
			password_empty_error: false,
			name_error: false,
			name_empty_error: false
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

		// Check e-mail
		regEx = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
		if (email == '') {
			state.error = true;
			state.email_error = true;
			state.email_empty_error = true;
		} else if (!regEx.test(email)) {
			state.error = true;
			state.email_error = true;
		}

		// Check name
		if (name == '') {
			state.error = true;
			state.name_error = true;
			state.name_empty_error = true;
		}

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

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		// Prepare user info fo signing up
		var userInfo = {
			email: email,
			password: password,
			name: name
		};

		if (features.uniqueUsername) {
			userInfo.username = this.refs.username.value.trim();
		}

		// Sign up now
		this.flux.dispatch('action.User.signUp', userInfo);
	};

	onChange = () => {
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

		// Clear password inputbox
		this.refs.password.value = ''; 
		this.refs.confirm_password.value = ''; 

		// Focus on email inputbox
		this.refs.email.select();
	};

	render() {

		var features = this.flux.getState('Features');
		var usernameClasses = 'required field';
		var emailClasses = 'required field';
		var nameClasses = 'required field';
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var errItems = [];
		var fieldClass = 'field';

		if (this.state.error) {
			fieldClass += ' error';

			if (features.uniqueUsername) {
				if (this.state.username_existing_error) {
					usernameClasses += ' error';
					errItems.push('Account exists already. Please type another username then try again');
				} else if (this.state.username_empty_error) {
					usernameClasses += ' error';
					errItems.push('Please enter username');
				} else if (this.state.username_error) {
					usernameClasses += ' error';
					errItems.push('Username can only contain alphanumeric lowercase characters and dashes(-)');
				}
			}

			if (this.state.email_existing_error) {
				emailClasses += ' error';
				errItems.push('E-mail exists already. Please type another e-mail address then try again');
			} else if (this.state.email_error) {
				emailClasses += ' error';
				errItems.push('E-mail is invalid');
			}

			if (this.state.name_error) {
				nameClasses += ' error';
				errItems.push('Name is invalid');
			}

			if (this.state.password_error) {
				passwordClasses += ' error';
				confirmClasses += ' error';
				errItems.push('Password is invalid');
			} else if (this.state.confirm_error) {
				passwordClasses += ' error';
				confirmClasses += ' error';
				errItems.push('Password doesn\'t match confirmation');
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
								<i className='add user icon' />
								<div className='content'><I18n sign='sign_up.header'>Create a New Account</I18n></div>
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
													<div className='header'>Failed to Sign Up</div>
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
													<label><I18n sign='sign_up.username'>Username</I18n></label>
													<div className={'ui left icon input'}>
														<i className={'user icon'} />
														<input type='text' ref='username' name='username' placeholder='fredchien' />
													</div>
												</div>
											);
										}
									})()}

									<div className={nameClasses}>
										<label><I18n sign='sign_up.display_name'>Display Name</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'tag icon'} />
											<input type='text' ref='name' name='name' placeholder='Fred Chien' />
										</div>
									</div>

									<div className={emailClasses}>
										<label><I18n sign='sign_up.email'>E-mail Address</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'mail icon'} />
											<input type='text' ref='email' name='email' placeholder='fred@example.com' autoFocus={true} />
										</div>
									</div>

									<div className={passwordClasses}>
										<label><I18n sign='sign_up.password'>Password</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' />
										</div>
									</div>

									<div className={confirmClasses}>
										<label><I18n sign='sign_up.confirm'>Confirm</I18n></label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='confirm_password' name='confirm_password' />
										</div>
									</div>

									<div className='field'>
										<button className='ui teal button' onClick={this.signUp}>
											<I18n sign='sign_up.submit_button'>Register</I18n>
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
