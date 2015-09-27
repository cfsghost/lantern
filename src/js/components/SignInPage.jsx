import React from 'react';
import Fluky from 'fluky';
import {
	Route,
	RouteHandler,
	NotFoundRoute,
	Link
} from 'react-router';

// Components
import Header from './Header.jsx';
import I18n from './I18n.jsx';

class SignInPage extends React.Component {

	static contextTypes = {
		router: React.PropTypes.func.isRequired
	};

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: false
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	signIn = () => {
		Fluky.dispatch('action.User.signIn',
			this.refs.email.getDOMNode().value,
			this.refs.password.getDOMNode().value);
	}

	onChange = () => {

		var user = Fluky.getState('User');

		// No need to sign in if logined already
		if (user.logined) {
			this.context.router.transitionTo('/');
			return;
		}

		if (user.status == 'login-failed') {

			// Clear password inputbox
			this.refs.password.getDOMNode().value = ''; 

			// Focus on email inputbox
			this.refs.email.getDOMNode().select();

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
											<input type='text' ref='email' name='email' placeholder={I18n.getMessage('sign_in.email', 'E-mail address')} autoFocus={true} />
										</div>
									</div>
									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' placeholder={I18n.getMessage('sign_in.password', 'Password')} onKeyDown={this.onKeyDown} />
										</div>
									</div>
									<div className='field'>
										<button className='ui teal button' onClick={this.signIn}><I18n sign='sign_in.submit_button'>Sign In</I18n></button>
									</div>
									<div className='field ui teal message'>
										<div><Link to='/forgot'><I18n sign='sign_in.forgot_password'>Forgot your password?</I18n></Link></div>
										<div><I18n sign='sign_in.no_account_yet'>No Account yet?</I18n> <Link to='/signup'><I18n sign='sign_in.sign_up'>Sign Up</I18n></Link></div>
									</div>
								</div>
							</div>

							<div className='ui horizontal divider header'><I18n sign='sign_in.or_login_with'>Or Login With</I18n></div>

							<div className={'ui center aligned basic segment'}>
								<div className='ui buttons'>
									<a href='/auth/facebook' className='ui facebook icon button'>
										<i className='facebook icon' />
									</a>
									<a href='/auth/github' className='ui github icon button'>
										<i className='github icon' />
									</a>
									<a href='/auth/google' className='ui google plus icon button'>
										<i className='google plus icon' />
									</a>
									<a href='/auth/linkedin' className='ui linkedin icon button'>
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
