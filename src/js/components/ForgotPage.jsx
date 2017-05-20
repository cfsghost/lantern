import React from 'react';
import { Link } from 'react-router';

// Decorators
import { router, flux, i18n } from 'Decorator';

// Components
import Header from './Header.jsx';
import I18n from 'Extension/I18n.jsx';

class RequestedPage extends React.Component {

	render() {
		return (
			<div className='column'>
				<h1 className='ui header'>
					<i className='mail icon' />
					<div className='content'>Requested Password Reset</div>
				</h1>

				<div className='ui positive icon message'>
					<i className={'checkmark sign icon'} />
					<div className='content'>
						<div className='header'>Confirmation mail was sent</div>
						<p>Please check your e-mail box. A message will be sent to that address containing a link to rest your password.</p>
					</div>
				</div>
			</div>
		);
	}
}

@router
@flux
@i18n
class ForgotPage extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			busy: false,
			error: false,
			success: false,
			readyToSubmit: false
		};
	}

	submit = () => {

		this.setState({
			busy: true
		});

		this.flux.dispatch('action.User.forgotPassword',
			this.refs.email.value, function(err, success) {

				this.setState({
					busy: false,
					error: err ? true : false,
					success: success
				});
			}.bind(this));
	};

	handleChange = () => {
		var email = this.refs.email.value;
		var isValid = true;

		if (!email)
			isValid = false;

		if (email[email.length - 1] == '@')
			isValid = false;
		else if (email.indexOf('@') == -1)
			isValid = false;

		this.setState({
			readyToSubmit: isValid
		});
	};

	render() {

		var content;

		if (this.state.success) {
			content = <RequestedPage />;
		} else {

			var message;
			if (this.state.error) {
				message = (
					<div className='ui negative icon message'>
						<i className={'warning sign icon'} />
						<div className='content'>
							<div className='header'>Failed to request password reset</div>
							<p>Please check your email then try again</p>
						</div>
					</div>
				);
			}

			content = (
				<div className='sixteen wide mobile eight wide tablet six wide computer column'>
					<h1 className='ui header'>
						<i className='lock icon' />
						<div className='content'>
							<I18n sign='forgot.header'>Forgot Password?</I18n>
						</div>
					</h1>

					<div className={'ui basic segment'}>
						{((ctx) => {
							if (ctx.state.busy)
								return (
									<div className='ui active inverted dimmer'>
										<div className='ui text loader'>Updating</div>
									</div>
								);
						})(this)}

						{message}

						<div className='ui form'>

							<div className='field'>
								<label><I18n sign='forgot.desc'>Please enter your e-mail address and we will send your a confirmation mail to reset your password.</I18n></label>
								<div className={'ui left icon input'}>
									<i className={'mail icon'} />
									<input
										type='text'
										ref='email'
										name='email'
										placeholder={this.i18n.getMessage('forgot.enter_email', 'Enter a valid e-mail address')}
										autoFocus={true}
										onChange={this.handleChange} />
								</div>
							</div>

							<div className='field'>
								<button
									className={'ui ' + (!this.state.readyToSubmit ? 'disabled' : '') + ' teal button'}
									onClick={this.submit}><I18n sign='forgot.submit_button'>Submit</I18n></button>
							</div>
						</div>
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
						{content}
					</div>

				</div>
			</div>
		);
	}
}

export default ForgotPage;
