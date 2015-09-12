import React from 'react';
import Fluky from 'fluky';
import Router from 'react-router';
var { Route, RouteHandler, NotFoundRoute, Link } = Router;

import Header from './Header.jsx';

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

					<div className='ui two column centered grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='sign in icon' />
								<div className='content'>Sign In</div>
							</h1>

							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='email' name='email' placeholder='E-mail address' autoFocus={true} />
										</div>
									</div>
									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' placeholder='Password' onKeyDown={this.onKeyDown} />
										</div>
									</div>
									<div className='field'>
										<button className='ui teal button' onClick={this.signIn}>Sign In</button>
									</div>
									<div className='field ui teal message'>
										<div><Link to='/forgot'>Forgot your password?</Link></div>
										<div>No Account yet? <Link to='/signup'>Sign Up</Link></div>
									</div>
								</div>
							</div>

							<div className='ui horizontal divider header'>Or Login With</div>

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
