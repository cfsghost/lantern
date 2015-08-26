var React = require('react');
var Fluky = require('fluky');

class UserProfile extends React.Component {

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

	componentDidUpdate = () => {
//		$(this.refs.sidebar.getDOMNode()).sidebar();
	}

	onChange = () => {
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
						<div className='header'>Failed to Sign In</div>
						<p>Please check your email and password then try again</p>
					</div>
				</div>
			);
		}

		return (

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
		);
	}
}

module.exports = UserProfile;
