import React from 'react';
import I18n from 'Extension/I18n.jsx';

// Components
import Avatar from './Avatar.jsx';
import AvatarUploader from './AvatarUploader.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

@flux
@i18n
@preAction('User.syncProfile')
class UserProfile extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('User');

		this.state = {
			busy: false,
			error: false,
			name: state.name,
			email: state.email,
			id: state.id,
			avatar: state.avatar || false,
			avatar_hash: state.avatar_hash
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	};

	onChange = () => {

		var user = this.flux.getState('User');

		this.setState({
			name: user.name,
			email: user.email,
			id: user.id,
			avatar: user.avatar || false,
			avatar_hash: user.avatar_hash,
			busy: false
		});
	};

	updateProfile = () => {
		if (this.state.busy)
			return;

		this.setState({
			busy: true
		});

		this.flux.dispatch('action.User.updateProfile', this.state.name);
	};

	uploadAvatar = () => {
		var formData = new FormData();

		formData.append('avatar', this.refs.avatar.files[0]);

		$.ajax({
			url: '/user/upload/avatar',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false
		});
	};

	selectAvatar = () => {
		$(this.refs.avatar).show().trigger('click').hide();
	};

	render() {
		var emailClasses = 'field';
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
							<I18n sign='user_profile.header'>Profile</I18n>
							<div className='sub header'><I18n sign='user_profile.subheader'>Personal information</I18n></div>
						</div>
					</h1>

					<div className='ui segments'>
						<div className='ui secondary segment'>
							<h5 className='ui header'>
								<I18n sign='user_profile.public_profile'>Public Profile</I18n>
							</h5>
						</div>

						<div className='ui very padded segment'>
							{((ctx) => {
								if (ctx.state.busy)
									return (
										<div className='ui active dimmer'>
											<div className='ui text loader'>Saving</div>
										</div>
									);
							})(this)}

							<div className={nameClasses}>
								<label>
									<I18n sign='user_profile.display_name'>Display Name</I18n>
								</label>
								<div className={'ui left input'}>
									<input
										type='text'
										ref='name'
										name='name'
										placeholder='Fred Chien'
										value={this.state.name}
										onChange={(event) => this.setState({ name: event.target.value }) } />
								</div>
							</div>

							<div className={emailClasses}>
								<label>
									<I18n sign='user_profile.email'>E-mail Address</I18n>
								</label>
								<div className={'ui left input'}>
									<input
										type='text'
										ref='email'
										name='email'
										placeholder='fred@example.com'
										value={this.state.email}
										readOnly />
								</div>
							</div>

							<div className='field'>
								<button className={'ui teal' + (this.state.busy ? ' loading' : '') + ' button' } onClick={this.updateProfile}>
									<I18n sign='user_profile.update_button'>Update Profile</I18n>
								</button>
							</div>

						</div>
					</div>

					<div className='ui segments'>
						<div className='ui secondary segment'>
							<h5 className='ui header'>
								<I18n sign='user_profile.avatar_header'>Avatar</I18n>
							</h5>
						</div>

						<div className='ui very padded segment'>
							<AvatarUploader userId={this.state.id} internalAvatar={this.state.avatar} defaultHash={this.state.avatar_hash} size={96} />
						</div>
					</div>

				</div>
			</div>
		);
	}
}

export default UserProfile;
