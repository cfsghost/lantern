import React from 'react';
import Fluky from 'fluky';

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

	updateProfile = () => {
	}

	render() {
		var emailClasses = 'required field';
		var nameClasses = 'required field';
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
							Profile
							<div className='sub header'>Personal information</div>
						</div>
					</h1>

					<div className='ui segments'>
						<div className='ui teal inverted segment'>
							<h5 className='ui header'>Public Profile</h5>
						</div>

						<div className='ui very padded segment'>
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
									<input type='text' ref='email' name='email' placeholder='fred@example.com' />
								</div>
							</div>

							<div className='field'>
								<button className='ui teal button' onClick={this.updateProfile}>Update Profile</button>
							</div>

						</div>
					</div>

				</div>
			</div>
		);
	}
}

module.exports = UserProfile;
