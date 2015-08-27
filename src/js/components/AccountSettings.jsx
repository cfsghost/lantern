import React from 'react';
import Fluky from 'fluky';

class AccountSettings extends React.Component {

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

	updatePassword = () => {
	}

	render() {
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
			<div className='ui padded basic segment'>
				<div className='ui form'>
					<h1 className='ui header'>
						<div className='content'>
							Account Settings
							<div className='sub header'>Password and identifiable information</div>
						</div>
					</h1>

					<div className='ui segments'>
						<div className='ui teal inverted segment'>
							<h5 className='ui header'>Change Password</h5>
						</div>

						<div className='ui very padded segment'>
							<div className={passwordClasses}>
								<label>New Password</label>
								<div className={'ui left icon input'}>
									<i className={'lock icon'} />
									<input type='password' ref='password' name='password' />
								</div>
							</div>

							<div className={confirmClasses}>
								<label>Confirm new password</label>
								<div className={'ui left icon input'}>
									<i className={'lock icon'} />
									<input type='password' ref='confirm_password' name='confirm_password' />
								</div>
							</div>

							<div className='field'>
								<button className='ui teal button' onClick={this.updatePassword}>Update Password</button>
							</div>
						</div>
					</div>

				</div>
			</div>
		);
	}
}

export default AccountSettings;
