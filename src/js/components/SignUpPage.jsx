var React = require('react');
var Link = require('react-router-component').Link;
var Fluky = require('fluky');

var Header = require('./Header.jsx');

class SignUpPage extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	};

	constructor() {
		super();

		this.state = {
			error: false,
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
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentDidUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	signUp = () => {
		var email = this.refs.email.getDOMNode().value.trim();
		var name = this.refs.name.getDOMNode().value.trim();
		var password = this.refs.password.getDOMNode().value;
		var confirm_password = this.refs.confirm_password.getDOMNode().value;

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

		if (email == '') {
			state.error = true;
			state.email_error = true;
			state.email_empty_error = true;
		}

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
		}

		// Two passwords should be the same
		if (password != confirm_password) {
			state.error = true;
			state.confirm_error = true;
		}

		// Something's wrong
		if (state.error) {
			this.setState(state);
			return;
		}

		// Sign up now
		Fluky.dispatch('action.User.signUp',
			this.refs.email.getDOMNode().value,
			this.refs.password.getDOMNode().value,
			this.refs.name.getDOMNode().value);
	}

	onChange = () => {

		Fluky.dispatch('store.User.getState', function(user) {

			// No need to sign in if logined already
			if (user.logined) {
				this.context.router.navigate('/');
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

	render() {
		var emailClasses = 'required field';
		var nameClasses = 'required field';
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var message;
		var fieldClass = 'field';
		if (this.state.error) {
			fieldClass += ' error';
			message = (
				<div className='ui negative icon message'>
					<i className={'warning sign icon'} />
					<div className='content'>
						<div className='header'>Failed to Sign Up</div>
						<p>Please check all fields then try again</p>
					</div>
				</div>
			);

			if (this.state.email_error) {
				emailClasses += ' error';
			}

			if (this.state.name_error) {
				nameClasses += ' error';
			}

			if (this.state.password_error) {
				passwordClasses += ' error';
			}

			if (this.state.confirm_error) {
				confirmClasses += ' error';
			}
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
								<i className='add user icon' />
								<div className='content'>Create a New Account</div>
							</h1>
							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={nameClasses}>
										<label>Display Name</label>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='name' name='name' placeholder='Fred Chien' />
										</div>
									</div>

									<div className={emailClasses}>
										<label>E-mail Address</label>
										<div className={'ui left icon input'}>
											<i className={'mail icon'} />
											<input type='text' ref='email' name='email' placeholder='fred@example.com' autoFocus={true} />
										</div>
									</div>

									<div className={passwordClasses}>
										<label>Password</label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' />
										</div>
									</div>

									<div className={confirmClasses}>
										<label>Confirm</label>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='confirm_password' name='confirm_password' />
										</div>
									</div>

									<div className='field'>
										<button className='ui teal button' onClick={this.signUp}>Register</button>
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

module.exports = SignUpPage;
