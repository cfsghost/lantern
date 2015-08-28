import React from 'react';
import reactMixin from 'react-mixin';
import Fluky from 'fluky';
import Router from 'react-router';
var { Route, RouteHandler, NotFoundRoute, Link } = Router;

import Header from './Header.jsx';

class ForgotPage extends React.Component {

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

		Fluky.dispatch('store.User.getState', function(user) {

			// No need to sign in if logined already
			if (user.logined) {
				this.context.router.translationTo('/');
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
		}.bind(this));
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
			<div>
				<Header />
				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className={'ui basic center aligned padded segment'}>

					<div className='ui two column centered grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='help circle icon' />
								<div className='content'>Forgot Password?</div>
							</h1>

							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={fieldClass}>
										<label>Please enter your e-mail address and we will send your a confirmation mail to reset your password.</label>
										<div className={'ui left icon input'}>
											<i className={'mail icon'} />
											<input type='text' ref='email' name='email' placeholder='Enter a valid e-mail address' autoFocus={true} />
										</div>
									</div>

									<div className='field'>
										<button className='ui teal button' onClick={this.signIn}>Submit</button>
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

export default ForgotPage;
