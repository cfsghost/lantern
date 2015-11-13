import React from 'react';
import { Link } from 'react-router';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';

@router
@flux
@i18n
class SignInPage extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: false
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	}

	signIn = () => {
		this.flux.dispatch('action.User.signIn',
			this.refs.email.value,
			this.refs.password.value);
	}

	onChange = () => {

		var user = this.flux.getState('User');

		// No need to sign in if logined already
		if (user.logined) {
			if (this.props.location.query.target)
				this.history.pushState(null, this.props.location.query.target);
			else
				this.history.pushState(null, '/');

			return;
		}

		if (user.status == 'login-failed') {

			// Clear password inputbox
			this.refs.password.value = ''; 

			// Focus on email inputbox
			this.refs.email.select();

			this.setState({
				error: true
			});
		}
	}

	onKeyDown = (event) => {

		// Key code for enter
		if (event.keyCode === 13) {
			this.signIn();
		}
	}

	toURL = (url, target) => {
		if (target)
			return url + '?target=' + target;

		return url;
	}

	render() {
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

		var target = undefined;
		if (this.props.location.query.target) {
			target = this.props.location.query.target;
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
								<i className='sign in icon' />
								<div className='content'><I18n sign='sign_in.header'>Sign In</I18n></div>
							</h1>

							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='email' name='email' placeholder={this.i18n.getMessage('sign_in.email', 'E-mail address')} autoFocus={true} />
										</div>
									</div>
									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' placeholder={this.i18n.getMessage('sign_in.password', 'Password')} onKeyDown={this.onKeyDown} />
										</div>
									</div>
									<div className='field'>
										<button className='ui teal button' onClick={this.signIn}><I18n sign='sign_in.submit_button'>Sign In</I18n></button>
									</div>
									<div className='field ui teal message'>
										<div><Link to='/forgot'><I18n sign='sign_in.forgot_password'>Forgot your password?</I18n></Link></div>
										<div><I18n sign='sign_in.no_account_yet'>No Account yet?</I18n> <Link to='/signup' query={{ target: target }}><I18n sign='sign_in.sign_up'>Sign Up</I18n></Link></div>
									</div>
								</div>
							</div>

							<div className='ui horizontal divider header'><I18n sign='sign_in.or_login_with'>Or Login With</I18n></div>

							<div className={'ui center aligned basic segment'}>
								<div className='ui buttons'>
									<a href={this.toURL('/auth/facebook', target)} className='ui facebook icon button'>
										<i className='facebook icon' />
									</a>
									<a href={this.toURL('/auth/github', target)} className='ui github icon button'>
										<i className='github icon' />
									</a>
									<a href={this.toURL('/auth/google', target)} className='ui google plus icon button'>
										<i className='google plus icon' />
									</a>
									<a href={this.toURL('/auth/linkedin', target)} className='ui linkedin icon button'>
										<i className='linkedin icon' />
									</a>
								</div>
							</div>

						</div>

					</div>

				</div>
			</div>
		);
	}
}

export default SignInPage;
